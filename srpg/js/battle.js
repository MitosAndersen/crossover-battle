// ============================================================
// BATTLE — 盤面の状態とルール
// ============================================================
// DOMには一切触らない。描画は ui.js の担当。
// 数値の考え方はターン制側と揃えているが、コードは共有していない
// （盤面が前提になるぶん、こちらのほうがずっと短い）。
// ============================================================

const SRPG_Battle = (function () {

  const DOT_PCT = 0.03;          // 火傷・毒・呪い・再生は毎フェイズ最大HPの3%
  const BLOCK_CHANCE = 0.15;     // 麻痺・凍結で動けない確率（ターン制と同値）
  const ENEMY_COUNT = 5;
  const MAX_ENEMY_SUPPORT = 2;   // サポーターだらけの編成を避ける（ターン制と同じ規則）

  // ---- 状態異常の一覧 --------------------------------------
  // 共有データ（passives.js の ALL_STATUS）が使う名前をすべて網羅している。
  // 新しい効果名が共有データ側に増えたときは、ここに1行足すだけでよい。
  const STATUS_INFO = {
    stun:     { label: '気絶', icon: '💫', kind: 'block' },
    paralyze: { label: '麻痺', icon: '⚡', kind: 'blockChance' },
    freeze:   { label: '凍結', icon: '🧊', kind: 'blockChance' },
    burn:     { label: '火傷', icon: '🔥', kind: 'dot' },
    poison:   { label: '毒',   icon: '☠️', kind: 'dot' },
    curse:    { label: '呪い', icon: '🔮', kind: 'dot' },
    regen:    { label: '再生', icon: '💚', kind: 'regen' },
    atk_up:   { label: '攻↑', icon: '⬆️', kind: 'buff' },
    atk_down: { label: '攻↓', icon: '⬇️', kind: 'buff' },
    def_up:   { label: '防↑', icon: '🛡️', kind: 'buff' },
    def_down: { label: '防↓', icon: '💢', kind: 'buff' }
  };

  // 相殺する組。攻↑がかかっている相手に攻↓を入れたら、打ち消して終わり。
  const CANCEL_PAIRS = {
    atk_up: 'atk_down', atk_down: 'atk_up',
    def_up: 'def_down', def_down: 'def_up'
  };

  let state = { units: [], phase: 'ally', turn: 1 };

  // ---- 盤面の組み立て --------------------------------------
  function setup(allyChoices) {
    const units = [];

    // 自軍は左2列に縦に並べる
    allyChoices.forEach(function (u, i) {
      const x = i % 2;                       // 0列目 / 1列目
      const y = 2 + Math.floor(i / 2) * 2;   // 1マスおきに置いて見やすくする
      units.push(SRPG_Units.toBattleUnit(u, 'ally', x, y));
    });

    // 敵は右3列。ENEMY_DATA からランダムに選ぶ
    pickEnemies().forEach(function (u, i) {
      const x = SRPG_Grid.COLS - 1 - (i % 3);
      const y = 1 + Math.floor(i / 3) * 2 + (i % 3);
      units.push(SRPG_Units.toBattleUnit(u, 'enemy', x, Math.min(y, SRPG_Grid.ROWS - 1)));
    });

    // 万一マスが重なったら押し出す（配置式を変えたときの保険）
    units.forEach(function (u, i) {
      while (units.some(function (o, j) { return j < i && o.x === u.x && o.y === u.y; })) {
        u.y = (u.y + 1) % SRPG_Grid.ROWS;
      }
    });

    state = { units: units, phase: 'ally', turn: 1 };
    return state;
  }

  function pickEnemies() {
    const pool = SRPG_Units.buildEnemies();
    const shuffled = pool.slice().sort(function () { return Math.random() - 0.5; });
    const picked = [];
    let supports = 0;
    for (let i = 0; i < shuffled.length && picked.length < ENEMY_COUNT; i++) {
      const e = shuffled[i];
      if (e.role === 'support') {
        if (supports >= MAX_ENEMY_SUPPORT) continue;
        supports++;
      }
      picked.push(e);
    }
    return picked;
  }

  // ---- 盤面の問い合わせ ------------------------------------
  function getState()  { return state; }
  function allUnits()  { return state.units; }
  function living(side) {
    return state.units.filter(function (u) { return !u.dead && (!side || u.side === side); });
  }
  function unitAt(x, y) {
    return state.units.find(function (u) { return !u.dead && u.x === x && u.y === y; }) || null;
  }
  function occupiedBy(x, y) {
    const u = unitAt(x, y);
    return u ? u.side : null;
  }
  function other(side) { return side === 'ally' ? 'enemy' : 'ally'; }

  // ---- 状態異常 --------------------------------------------
  function hasStatus(u, type) {
    return u.statusEffects.some(function (e) { return e.type === type; });
  }
  function removeStatus(u, type) {
    u.statusEffects = u.statusEffects.filter(function (e) { return e.type !== type; });
  }
  function applyStatus(u, type, turns) {
    if (!STATUS_INFO[type]) return false;      // 知らない効果名は無視する
    if (u.dead) return false;
    const pair = CANCEL_PAIRS[type];
    if (pair && hasStatus(u, pair)) { removeStatus(u, pair); return false; }  // 相殺
    const cur = u.statusEffects.find(function (e) { return e.type === type; });
    if (cur) { cur.turns = Math.max(cur.turns, turns || 2); return true; }
    u.statusEffects.push({ type: type, turns: turns || 2 });
    return true;
  }

  // 倍率は毎回 statusEffects から数え直す。
  // 付与時に倍率を掛け、解除時に割り戻す方式は、順番が狂うとズレが残るため採らない。
  function atkMult(u) {
    let m = 1;
    if (hasStatus(u, 'atk_up'))   m *= 1.3;
    if (hasStatus(u, 'atk_down')) m *= 0.7;
    return m;
  }
  function defMult(u) {
    let m = 1;
    if (hasStatus(u, 'def_up'))   m *= 0.7;   // 被ダメが減る
    if (hasStatus(u, 'def_down')) m *= 1.3;
    return m;
  }

  // ---- フェイズ開始 ----------------------------------------
  // そのフェイズを迎える側だけを処理する。
  //   1. 継続ダメージ／回復  2. 残りターン減らす  3. SP回復  4. 行動可否の抽選
  function startPhase(side) {
    const logs = [];
    living(side).forEach(function (u) {
      u.acted = false;
      u.blocked = null;

      // 継続ダメージと再生
      let dot = 0, regen = 0;
      u.statusEffects.forEach(function (e) {
        const info = STATUS_INFO[e.type];
        if (!info) return;
        if (info.kind === 'dot')   dot   += Math.max(1, Math.floor(u.hpMax * DOT_PCT));
        if (info.kind === 'regen') regen += Math.max(1, Math.floor(u.hpMax * DOT_PCT));
      });
      if (dot > 0) {
        u.hpNow = Math.max(0, u.hpNow - dot);
        logs.push('🩸 ' + u.name + ' は継続ダメージ ' + dot);
        if (u.hpNow === 0) { kill(u); logs.push('💀 ' + u.name + ' は倒れた！'); return; }
      }
      if (regen > 0) {
        const before = u.hpNow;
        u.hpNow = Math.min(u.hpMax, u.hpNow + regen);
        if (u.hpNow > before) logs.push('💚 ' + u.name + ' は ' + (u.hpNow - before) + ' 回復');
      }

      // SP回復（敵はSPを使わないので spMax が 0 のまま＝何も起きない）。
      // 1ターン目は初期SPのまま始めたいので、2ターン目以降だけ回復する
      if (u.spMax > 0 && state.turn > 1) u.sp = Math.min(u.spMax, u.sp + SRPG_Units.SP_REGEN);

      // 行動できるか。気絶は確定、麻痺と凍結は15%
      if (hasStatus(u, 'stun')) u.blocked = 'stun';
      else if (hasStatus(u, 'paralyze') && Math.random() < BLOCK_CHANCE) u.blocked = 'paralyze';
      else if (hasStatus(u, 'freeze')   && Math.random() < BLOCK_CHANCE) u.blocked = 'freeze';

      if (u.blocked) {
        u.acted = true;
        logs.push(STATUS_INFO[u.blocked].icon + ' ' + u.name + ' は' + STATUS_INFO[u.blocked].label + 'で動けない！');
      }

      // 残りターンを減らして切れたものを外す。
      // 【順番が大事】判定より先に減らすと、1ターンの気絶が一度も効かずに消える
      // （敵フェイズに付いた気絶が、次の自軍フェイズの頭で0になってしまうため）
      u.statusEffects.forEach(function (e) { e.turns--; });
      u.statusEffects = u.statusEffects.filter(function (e) { return e.turns > 0; });
    });
    state.phase = side;
    return logs;
  }

  function canAct(u) { return u && !u.dead && !u.acted && u.side === state.phase; }
  function allActed(side) {
    return living(side).every(function (u) { return u.acted; });
  }
  function endPhase() {
    if (state.phase === 'enemy') state.turn++;
    return other(state.phase);
  }

  function kill(u) {
    u.dead = true;
    u.hpNow = 0;
    u.statusEffects = [];
    u.shield = 0;
  }

  // ---- 移動 ------------------------------------------------
  function moveTo(u, x, y) { u.x = x; u.y = y; }

  // ---- 技の対象 --------------------------------------------
  // ax, ay は着弾点。form が 'self' のときは使わない。
  function targetsFor(actor, action, ax, ay) {
    if (action.form === 'self') return [actor];
    const want = action.side === 'own' ? actor.side : other(actor.side);
    const tiles = action.form === 'burst'
      ? SRPG_Grid.burstTiles(ax, ay)
      : [{ x: ax, y: ay }];
    const out = [];
    tiles.forEach(function (t) {
      const u = unitAt(t.x, t.y);
      if (u && u.side === want && out.indexOf(u) < 0) out.push(u);
    });
    return out;
  }

  function canPay(actor, action) {
    if (action.unsupported) return false;
    if (actor.spMax === 0) return true;        // 敵はコストを払わない
    return actor.sp >= action.cost;
  }

  // ---- ダメージ --------------------------------------------
  // ターン制側の数値をそのまま持ち込んでいる。
  //   範囲技の減衰 0.8^(命中数-1)（noSpread なら減衰なし）
  //   攻↑×1.3 攻↓×0.7 / 防↑×0.7 防↓×1.3
  //   追撃（execute）はHP70%以下の相手へ×1.2
  function estimateDamage(actor, action, target, hitCount) {
    const s = action.raw;
    let dmg = (s.power || 0) * (s.hits || 1);
    if (dmg <= 0) return 0;
    if (action.form === 'burst' && !s.noSpread) {
      dmg *= Math.pow(0.8, Math.max(0, (hitCount || 1) - 1));
    }
    dmg *= atkMult(actor);
    dmg = Math.max(1, Math.floor(dmg));
    dmg = Math.floor(dmg * defMult(target));
    if (s.execute && target.hpNow <= target.hpMax * 0.7) dmg = Math.floor(dmg * 1.2);
    return Math.max(1, dmg);
  }

  // ---- 技の実行 --------------------------------------------
  // 戻り値: { logs: [文字列], hits: [{ id, text, kind }] }
  //   hits は ui.js が数字を飛ばすために使う。
  function execute(actor, action, ax, ay) {
    const s = action.raw;
    const targets = targetsFor(actor, action, ax, ay);
    const logs = [];
    const hits = [];

    if (actor.spMax > 0) actor.sp = Math.max(0, actor.sp - action.cost);
    logs.push((actor.side === 'ally' ? '🔹 ' : '🔸 ') + actor.name + ' の ' + (s.icon || '') + s.name + '！');

    targets.forEach(function (t) {
      // --- 回復 ---
      if (s.type === 'heal' && (s.healPower || 0) > 0) {
        const before = t.hpNow;
        t.hpNow = Math.min(t.hpMax, t.hpNow + s.healPower);
        const amt = t.hpNow - before;
        logs.push('　💚 ' + t.name + ' のHPが ' + amt + ' 回復');
        hits.push({ uid: t.uid, text: '+' + amt, kind: 'heal' });
        if (s.shieldOnHeal) {
          t.shield = Math.min(Math.floor(t.hpMax * 0.5), t.shield + s.shieldOnHeal);
          logs.push('　🛡️ ' + t.name + ' にシールド ' + s.shieldOnHeal);
        }
      }

      // --- ダメージ ---
      const dmg = estimateDamage(actor, action, t, targets.length);
      if (dmg > 0) {
        let rest = dmg;
        if (t.shield > 0 && !s.shieldBreak) {
          const absorbed = Math.min(t.shield, rest);
          t.shield -= absorbed;
          rest -= absorbed;
          if (absorbed > 0) logs.push('　🛡️ ' + t.name + ' のシールドが ' + absorbed + ' 吸収');
        } else if (s.shieldBreak && t.shield > 0) {
          t.shield = 0;
          logs.push('　💥 ' + t.name + ' のシールドを破壊！');
        }
        t.hpNow = Math.max(0, t.hpNow - rest);
        logs.push('　💥 ' + t.name + ' に ' + dmg + ' ダメージ');
        hits.push({ uid: t.uid, text: '-' + dmg, kind: 'dmg' });

        // 与ダメージ吸収
        if (s.healSelf && !actor.dead) {
          const drain = Math.max(1, Math.floor(dmg * s.healSelf));
          actor.hpNow = Math.min(actor.hpMax, actor.hpNow + drain);
          logs.push('　🩸 ' + actor.name + ' は ' + drain + ' 吸収');
        }
      }

      // --- シールド付与（type:'support' の shield）---
      if (s.effect === 'shield' && (s.shieldPower || 0) > 0) {
        t.shield = Math.min(Math.floor(t.hpMax * 0.5), t.shield + s.shieldPower);
        logs.push('　🛡️ ' + t.name + ' にシールド ' + s.shieldPower);
      }

      // --- 強化解除 ---
      if (s.effect === 'dispel') {
        let removed = 0;
        ['atk_up', 'def_up', 'regen'].forEach(function (type) {
          if (hasStatus(t, type)) { removeStatus(t, type); removed++; }
        });
        logs.push(removed > 0 ? '　✨ ' + t.name + ' の強化を解除した' : '　… ' + t.name + ' に解除できる強化はなかった');
      }

      // --- SP回復（味方向け）---
      if (s.effect === 'sp_restore' && t.spMax > 0) {
        const amt = s.effectValue != null ? s.effectValue : 2;
        t.sp = Math.min(t.spMax, t.sp + amt);
        logs.push('　🔋 ' + t.name + ' のSPが ' + amt + ' 回復');
      }

      // --- 状態異常・強化 ---
      // ダメージ技は effectChance を明示したものだけ、支援技は既定で必ず入る。
      const chance = s.effectChance != null ? s.effectChance
                   : ((s.power || 0) > 0 ? 0 : 1);
      [s.effect, s.alsoEffect2, s.alsoEffect3].forEach(function (ef) {
        if (!ef || !STATUS_INFO[ef]) return;
        if (t.dead) return;
        if (Math.random() >= chance) {
          logs.push('　… ' + t.name + ' には効かなかった');
          return;
        }
        if (applyStatus(t, ef, s.effectTurns || 2)) {
          logs.push('　' + STATUS_INFO[ef].icon + ' ' + t.name + ' に' + STATUS_INFO[ef].label);
        } else {
          logs.push('　✨ ' + t.name + ' の' + STATUS_INFO[ef].label + 'を打ち消した');
        }
      });

      if (t.hpNow === 0 && !t.dead) {
        kill(t);
        logs.push('　💀 ' + t.name + ' は倒れた！');
      }
    });

    if (targets.length === 0) logs.push('　… 誰にも当たらなかった');

    // --- 自分にかかるもの ---
    if (s.selfEffect && !actor.dead) {
      if (applyStatus(actor, s.selfEffect, s.selfEffectTurns || 2)) {
        logs.push('　' + (STATUS_INFO[s.selfEffect] ? STATUS_INFO[s.selfEffect].icon : '✨') +
                  ' ' + actor.name + ' 自身に' + (STATUS_INFO[s.selfEffect] ? STATUS_INFO[s.selfEffect].label : s.selfEffect));
      }
    }
    if (s.recoilPct && !actor.dead) {
      const recoil = Math.max(1, Math.floor(actor.hpMax * s.recoilPct));
      actor.hpNow = Math.max(1, actor.hpNow - recoil);    // 反動では死なない
      logs.push('　💢 ' + actor.name + ' は反動で ' + recoil + ' 受けた');
      hits.push({ uid: actor.uid, text: '-' + recoil, kind: 'dmg' });
    }
    if (s.selfStun && !actor.dead) {
      applyStatus(actor, 'stun', 1);
      logs.push('　💫 ' + actor.name + ' は反動で動けなくなった');
    }

    actor.acted = true;
    return { logs: logs, hits: hits };
  }

  function wait(u) {
    u.acted = true;
    return u.name + ' は待機した';
  }

  // ---- 勝敗 ------------------------------------------------
  function checkEnd() {
    if (living('enemy').length === 0) return 'win';
    if (living('ally').length === 0)  return 'lose';
    return null;
  }

  return {
    STATUS_INFO: STATUS_INFO,
    setup: setup,
    getState: getState,
    allUnits: allUnits,
    living: living,
    unitAt: unitAt,
    occupiedBy: occupiedBy,
    other: other,
    startPhase: startPhase,
    endPhase: endPhase,
    canAct: canAct,
    allActed: allActed,
    moveTo: moveTo,
    targetsFor: targetsFor,
    canPay: canPay,
    estimateDamage: estimateDamage,
    execute: execute,
    wait: wait,
    checkEnd: checkEnd,
    hasStatus: hasStatus
  };
})();
