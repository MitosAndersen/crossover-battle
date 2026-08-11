// ============================================================
// UNITS — 共有データ → SRPGユニットへの変換
// ============================================================
// このファイルの役割はひとつだけ。
// ../js/characters.js などの「共有データ」を読んで、SRPGが必要とする
// 形（移動力・射程・実効HP）に変換して返す。
//
// 【重要な原則】共有データ（../js/*.js）は絶対に書き換えない。
//   共有データに置くのは「原作の事実」だけ。
//     … 名前・作品・ロール・スキル構成・パッシブ・セリフ
//   ゲームごとの数値はこちら側で持つ。
//     … 移動力・射程・HP補正・SP・威力倍率
//   これを守っている限り、こちらを何度いじってもターン制のほうは壊れない。
//
// 【移動力と射程を158体ぶん手で書かない理由】
//   role がすでにアーキタイプを持っているため、変換表を1つ持てば足りる。
//   個別に調整したくなったキャラだけ、あとで OVERRIDES に書けばよい。
// ============================================================

const SRPG_Units = (function () {

  // ---- role → ユニット性能の変換表 -------------------------
  // ターン制側の役割の意味をそのまま持ち込んでいる。
  //   striker  … 先手を取る役      → 移動が長く、射程は短い
  //   tank     … 敵を引きつける役  → 移動が短く、耐える
  //   support  … 後方支援          → 射程が長い
  //   attacker … 標準
  const ROLE_UNIT = {
    striker:  { move: 6, range: 1, note: '足が速い。先に踏み込む' },
    attacker: { move: 4, range: 1, note: '標準' },
    support:  { move: 4, range: 3, note: '離れたまま撃てる' },
    tank:     { move: 3, range: 1, note: '遅いが硬い' }
  };

  // ---- HP補正 ----------------------------------------------
  // ターン制側と同じ値だが、意図的にこちらで持っている。
  // 共有せずコピーしているのは、SRPGの都合で動かしたときに
  // ターン制のバランスを巻き込まないため。
  const ROLE_HP = { tank: 1.4, striker: 0.9, support: 0.9, attacker: 1.0 };

  // ---- SP ---------------------------------------------------
  // ターン制ではパーティ共有だが、SRPGでは【ユニットごと】に持つ。
  // 「誰をどこへ出すか」の判断に、その人のSP残量が絡むようにするため。
  // 敵はSPを持たない（ENEMY_SKILL_DATA に spCost が無く、すべてコスト0になる）。
  const SP_INIT  = 3;   // 戦闘開始時
  const SP_MAX   = 5;   // 上限。ターン制のパーティSP上限と同じ数字
  const SP_REGEN = 1;   // 自フェイズ開始ごと

  // 敵HPの倍率。ターン制の makeEnemy と同じ 0.8 だが、これも意図的にコピー。
  const ENEMY_HP_SCALE = 0.8;

  // ---- 個別上書き ------------------------------------------
  // 変換表で気に入らないキャラだけここに書く。空でも動く。
  // 例: OVERRIDES = { yoruichi: { move: 8 } };
  const OVERRIDES = {};

  // ---- スキルの target → 射程の形 ---------------------------
  // ターン制の「単体／全体」を、マスの上での当たり方に読み替える。
  const TARGET_SHAPE = {
    single:    { label: '単体',     shape: 'unit',      desc: '射程内の敵1体' },
    all:       { label: '敵全体',   shape: 'burst',     desc: '着弾点のまわり（範囲攻撃）' },
    all_ally:  { label: '味方全体', shape: 'ally_area', desc: '自分のまわりの味方' },
    ally:      { label: '味方単体', shape: 'ally_unit', desc: '射程内の味方1体' },
    self:      { label: '自分',     shape: 'self',      desc: '自分のみ' },
    random:    { label: 'ランダム', shape: 'burst',     desc: '着弾点のまわり' }
  };

  function shapeOf(target) {
    return TARGET_SHAPE[target] || { label: target, shape: 'unit', desc: '—' };
  }

  // ---- 技が「どちら側」を狙うか -----------------------------
  // ターン制の resolveTargets と同じ読み方をする。
  //   'foe'  … 相手側     （single の攻撃・all）
  //   'own'  … 自分側     （all_ally / all_enemy / 回復の single）
  //   'self' … 自分だけ
  //   'dead' … 戦闘不能の味方（蘇生。SRPG版では未対応）
  // 注意: single は type で向きが変わる。回復技の single は味方1体を指す。
  function sideOf(s) {
    if (s.target === 'self')      return 'self';
    if (s.target === 'dead_ally') return 'dead';
    if (s.target === 'all_ally' || s.target === 'all_enemy') return 'own';
    if (s.target === 'single')    return (s.type === 'heal' || s.type === 'revive') ? 'own' : 'foe';
    return 'foe';   // 'all'
  }

  // マスの上での当たり方。単体か、着弾点のまわりか、自分だけか。
  function srpgShapeOf(s) {
    if (s.target === 'self')   return 'self';
    if (s.target === 'single') return 'unit';
    return 'burst';
  }

  // ---- 1体ぶんの変換 ---------------------------------------
  function toUnit(d) {
    const base = ROLE_UNIT[d.role] || ROLE_UNIT.attacker;
    const ov   = OVERRIDES[d.id] || {};
    const mult = ROLE_HP[d.role] != null ? ROLE_HP[d.role] : 1.0;
    const hp   = Math.floor(d.maxHp * mult);

    return {
      // --- 共有データからそのまま持ってくるもの（触らない）---
      id: d.id, name: d.name, origin: d.origin, emoji: d.emoji,
      role: d.role, job: d.job, gender: d.gender, color: d.color,
      baseHp: d.maxHp,
      skillIds: d.skillIds || [],
      rarity: (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[d.id]) || 2,
      passive: (typeof PASSIVE_DATA !== 'undefined' && PASSIVE_DATA[d.id]) || null,
      joinQuote: (typeof JOIN_QUOTES !== 'undefined' && JOIN_QUOTES[d.id]) || '',

      // --- SRPG側で決めるもの ---
      move:  ov.move  != null ? ov.move  : base.move,
      range: ov.range != null ? ov.range : base.range,
      hp:    hp,
      derived: !ov.move && !ov.range,   // 変換表そのままか、手で書いたか
      note:  base.note
    };
  }

  // ---- 盤面に置ける状態にする -------------------------------
  // toUnit は「図鑑としてのユニット」を返す。戦闘に出すときは
  // ここで現在HP・SP・座標・状態異常を足す。毎回作り直すので、
  // 同じキャラを2回出しても状態は混ざらない。
  let _uidSeq = 0;
  function toBattleUnit(u, side, x, y) {
    return Object.assign({}, u, {
      // 盤面での一意な名札。同じ敵データが2体出ても DOM が混ざらないようにする
      uid: side + '-' + u.id + '-' + (++_uidSeq),
      side: side,                 // 'ally' | 'enemy'
      x: x, y: y,
      hpMax: u.hp,
      hpNow: u.hp,
      sp:    side === 'ally' ? SP_INIT : 0,
      spMax: side === 'ally' ? SP_MAX  : 0,
      shield: 0,
      statusEffects: [],          // [{ type, turns }]
      acted: false,
      blocked: null,              // 'stun' | 'paralyze' | 'freeze'
      dead: false
    });
  }

  // ---- 敵1体ぶんの変換 -------------------------------------
  // ENEMY_DATA は origin も job も持たない（雑魚なので原作が無い）。
  // 技は ENEMY_SKILL_DATA から引く。
  function toEnemyUnit(d) {
    const base = ROLE_UNIT[d.role] || ROLE_UNIT.attacker;
    return {
      id: d.id, name: d.name, origin: '', emoji: d.emoji,
      role: d.role, job: '', gender: '', color: d.color,
      baseHp: d.maxHp,
      skillIds: (d.skillIds || []).filter(function (id, i, arr) { return arr.indexOf(id) === i; }),
      rarity: 1,
      passive: null,
      joinQuote: '',
      move:  base.move,
      range: base.range,
      hp:    Math.floor(d.maxHp * ENEMY_HP_SCALE),
      derived: true,
      note:  base.note,
      isEnemyData: true
    };
  }

  // ---- スキル1つぶんの変換 ---------------------------------
  // table を渡さなければ味方スキル（SKILL_DATA）。敵は ENEMY_SKILL_DATA を渡す。
  // raw に元データを添えているのは、battle.js が execute / noSpread / recoilPct
  // といった細かいフラグを、ここで書き写さずに直接読めるようにするため。
  function toAction(skillId, table) {
    const src = table || (typeof SKILL_DATA !== 'undefined' ? SKILL_DATA : null);
    const s = src && src[skillId];
    if (!s) return null;
    const hits = s.hits || 1;
    const sh   = shapeOf(s.target);
    return {
      id: skillId, name: s.name, icon: s.icon,
      cost: s.noSP ? 0 : (s.spCost || 0),
      isBasic: !!s.noSP,
      power: s.power, hits: hits, total: s.power * hits,
      healPower: s.healPower || 0, shieldPower: s.shieldPower || 0,
      shapeLabel: sh.label, shape: sh.shape, shapeDesc: sh.desc,
      effect: s.effect || null, effectTurns: s.effectTurns || 0,
      effect2: s.alsoEffect2 || null,
      tags: [
        s.shieldBreak && 'シールド破壊',
        s.execute     && '追撃',
        s.bossKiller  && 'ボス特攻',
        s.noSpread    && '減衰なし',
        s.recoilPct   && '反動',
        s.selfEffect  && '自身に' + s.selfEffect
      ].filter(Boolean),

      // --- 盤面用 ---
      side:  sideOf(s),           // 'foe' | 'own' | 'self' | 'dead'
      form:  srpgShapeOf(s),      // 'unit' | 'burst' | 'self'
      unsupported: sideOf(s) === 'dead',   // 蘇生はSRPG版では未対応
      raw: s
    };
  }

  // キャラ1体の技一覧（使えない技を落とさずに返す。UI側で灰色にする）
  function actionsOf(unit) {
    const table = unit.isEnemyData
      ? (typeof ENEMY_SKILL_DATA !== 'undefined' ? ENEMY_SKILL_DATA : null)
      : null;
    return (unit.skillIds || [])
      .map(function (id) { return toAction(id, table); })
      .filter(Boolean);
  }

  // ---- 全体の組み立て --------------------------------------
  function build() {
    if (typeof ALLY_DATA === 'undefined') return [];
    return ALLY_DATA.map(toUnit);
  }

  function buildEnemies() {
    if (typeof ENEMY_DATA === 'undefined') return [];
    return ENEMY_DATA.map(toEnemyUnit);
  }

  return {
    build: build,
    buildEnemies: buildEnemies,
    toUnit: toUnit,
    toEnemyUnit: toEnemyUnit,
    toBattleUnit: toBattleUnit,
    toAction: toAction,
    actionsOf: actionsOf,
    ROLE_UNIT: ROLE_UNIT,
    ROLE_HP: ROLE_HP,
    OVERRIDES: OVERRIDES,
    SP_INIT: SP_INIT,
    SP_MAX: SP_MAX,
    SP_REGEN: SP_REGEN,
    ENEMY_HP_SCALE: ENEMY_HP_SCALE
  };
})();
