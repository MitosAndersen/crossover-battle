// ============================================================
// UI ENGINE v5
// - Battle log moved to left column
// - Pokemon-style next-turn panel (1 actor, detailed enemy intent)
// - 3-candidate swap overlay with stats/skills preview
// - Status glossary fully expanded
// - Character cards show origin/gender/job/rarity
// - No critical display
// ============================================================
const UI = (() => {

  let _activeBonusOrigins = new Set();
  let _dragSrcCard = null;
  let _onAllyReorder = null;
  function setAllyReorderCallback(fn) { _onAllyReorder = fn; }

  const EFFECT_LABELS = {
    atk_up:'⬆️攻撃', atk_down:'⬇️攻撃',
    def_up:'⬆️防御', def_down:'⬇️防御',
    stun:'💫気絶', paralyze:'⚡麻痺',
    burn:'🔥燃焼', poison:'☠️毒',
    freeze:'🧊凍結', curse:'🖤呪い', regen:'💚リジェネ',
    shield:'🛡️シールド', dispel:'🌀バフ解除', sp_restore:'🔋SP回復'
  };

  // ---- Screens ----
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  // ---- Battle Number ----
  function setBattleNum(n, loopLen, loopCount = 0, isMidBoss = false, isFinal = false) {
    const pos = ((n - 1) % loopLen) + 1;
    const isBoss = pos === loopLen;
    // 「WAVE <セット>-<ウェーブ>」形式。1セット目の2戦目なら WAVE 1-2
    const typeLabel = isFinal ? ' 🔥最終決戦🔥' : isMidBoss ? ' ☆中ボス☆' : isBoss ? ' ★BOSS★' : '';
    const el = document.getElementById('battle-num');
    if (el) el.textContent = `⚔️ WAVE ${loopCount + 1}-${pos}${typeLabel}`;
  }

  // ---- Character Cards ----
  function renderEnemyArea(enemies) {
    const area = document.getElementById('enemy-area');
    area.innerHTML = '';
    enemies.forEach(enemy => {
      const card = createCharCard(enemy, true);
      // 再レンダー時（召喚等）、撃破済みの敵は畳んだ状態で生成
      if (enemy.isDefeated) {
        card.classList.add('corpse-collapsed');
        card.style.display = 'none';
      }
      area.appendChild(card);
    });
  }

  // 敵の死体カードを畳む（撃破演出が見えた後に呼ぶ。畳み切ったら非表示にしてflexのgapも詰める）
  function collapseEnemyCard(charId) {
    const card = document.getElementById(`card-${charId}`);
    if (!card || card.classList.contains('corpse-collapsed')) return;
    card.classList.add('corpse-collapsed');
    setTimeout(() => { card.style.visibility = 'hidden'; }, 550);
  }

  function renderAllyArea(allies) {
    const area = document.getElementById('ally-area');
    area.innerHTML = '';
    allies.forEach(ally => area.appendChild(createCharCard(ally, false)));
    if (_activeBonusOrigins.size > 0) {
      allies.forEach(ally => {
        if (!ally.origin || !_activeBonusOrigins.has(ally.origin)) return;
        const card = document.getElementById(`card-${ally.id}`);
        if (!card) return;
        // 作品名は「作品名・レア度を省略」ONだと非表示になり発光が見えなくなるため、
        // カード自体にも印を付けて絵文字を光らせる
        card.classList.add('series-bonus-active');
        card.querySelector('.char-origin-row')?.classList.add('series-bonus-glow');
      });
    }
  }

  function createCharCard(char, isEnemy) {
    const div = document.createElement('div');
    div.className = `char-card ${isEnemy ? 'enemy-card' : 'ally-card'}${char.isBoss ? ' boss-card' : ''}`;
    div.id = `card-${char.id}`;
    div.style.setProperty('--char-color', char.color || '#888');

    const hpPct = (char.hp / char.maxHp) * 100;

    // ロールバッジ（従来の独立行）と、名前行に合体させる用のアイコンを両方出力しておく。
    // どちらを見せるかは CSS（body.merge-role-name）が決めるので、
    // 設定を切り替えてもカードを作り直す必要がない
    const isBossLike = isEnemy && (char.isBoss || char.isMidBoss);
    let roleBadge = '';
    let roleIcon = '';
    if (char.role && ROLES[char.role]) {
      const r = ROLES[char.role];
      roleBadge = `<span class="role-badge" id="role-${char.id}" style="background:${r.color}">${r.icon}${r.label}</span>`;
      roleIcon = `<span class="char-name-role-icon">${r.icon}</span>`;
      div.style.setProperty('--role-color', r.color);
    } else if (isBossLike) {
      // ボス・中ボスは BOSS_DATA / MIDBOSS_DATA に role を持たないため、
      // ロールの代わりに👑とボス専用色を名前チップに使う
      roleIcon = `<span class="char-name-role-icon">👑</span>`;
      div.style.setProperty('--role-color', '#7b2fbe');
    } else {
      div.style.setProperty('--role-color', 'transparent');
    }
    const bossBadge = isBossLike ? `<span class="role-badge boss-badge">👑 ボス</span>` : '';

    // Rarity from CHAR_RARITY
    let rarityHtml = '';
    if (!isEnemy) {
      const rarity = (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[char.id]) || 2;
      const stars = '★'.repeat(rarity);
      const starColor = rarity === 3 ? '#ffcc44' : rarity === 1 ? '#778899' : '#aabbcc';
      const genderJob = [char.gender, char.job].filter(Boolean).join(' / ');
      rarityHtml = `
        <div class="char-info-row">
          <span class="char-rarity" style="color:${starColor}">${stars}</span>
          ${genderJob ? `<span class="char-gender-job">${genderJob}</span>` : ''}
        </div>
        <div class="char-origin-row" title="${char.origin || ''}">${char.origin || ''}</div>`;
    }

    const enemyOriginHtml = (isEnemy && (char.isBoss || char.isMidBoss) && char.origin)
      ? `<div class="char-origin-row enemy-origin">${char.origin}</div>`
      : '';

    const passiveHtml = char.passive
      ? `<div class="char-passive" id="passive-${char.id}" title="${char.passive.name}：${char.passive.desc}"><span class="passive-name"><span style="color:${char.color || '#aaccff'};font-size:1.1em;">◆</span>${char.passive.name}</span><span class="passive-desc">${char.passive.desc}</span></div>`
      : '';

    div.innerHTML = `
      <div class="card-top-badges">${bossBadge}${roleBadge}</div>
      <div class="char-emoji">${char.emoji}</div>
      <div class="char-name" title="${char.name}">${roleIcon}${char.name}</div>
      ${rarityHtml}
      ${enemyOriginHtml}
      <div class="bar-wrap">
        <div class="bar hp-bar-bg">
          <div class="bar-fill hp-fill" id="hp-${char.id}" style="width:${hpPct}%"></div>
          <div class="shield-fill" id="shield-${char.id}" style="width:0%;display:none"></div>
        </div>
      </div>
      <div class="bar-value" id="hpval-${char.id}">❤️${char.hp}/${char.maxHp}</div>
      ${passiveHtml}
      <div class="status-icons" id="status-${char.id}"></div>
      ${!isEnemy ? `<div class="guard-overlay" id="guard-overlay-${char.id}">🛡️</div>` : ''}
      ${isEnemy ? `<div class="enemy-next-action" id="next-action-${char.id}"></div>` : ''}
    `;
    if (!isEnemy) {
      div.draggable = true;
      div.addEventListener('dragstart', e => {
        _dragSrcCard = div;
        div.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', char.id);
      });
      div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
        document.querySelectorAll('#ally-area .char-card').forEach(c => c.classList.remove('drag-over'));
        _dragSrcCard = null;
      });
      div.addEventListener('dragover', e => {
        e.preventDefault();
        if (_dragSrcCard && _dragSrcCard !== div) div.classList.add('drag-over');
      });
      div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
      div.addEventListener('drop', e => {
        e.preventDefault();
        div.classList.remove('drag-over');
        if (!_dragSrcCard || _dragSrcCard === div) return;
        const srcId = e.dataTransfer.getData('text/plain');
        const area = document.getElementById('ally-area');
        const cards = [...area.children];
        const si = cards.indexOf(_dragSrcCard);
        const di = cards.indexOf(div);
        if (si < di) area.insertBefore(_dragSrcCard, div.nextSibling);
        else         area.insertBefore(_dragSrcCard, div);
        if (_onAllyReorder) _onAllyReorder(srcId, char.id);
      });
    }

    return div;
  }

  function updateCharBars(char) {
    const hpFill = document.getElementById(`hp-${char.id}`);
    const hpVal  = document.getElementById(`hpval-${char.id}`);
    const card   = document.getElementById(`card-${char.id}`);

    if (hpFill) {
      const pct = Math.max(0, (char.hp / char.maxHp) * 100);
      hpFill.style.width = pct + '%';
      hpFill.className = 'bar-fill hp-fill' +
        (pct <= 20 ? ' hp-danger' : pct <= 50 ? ' hp-warning' : '');
    }
    if (hpVal) {
      const sh = (char.shieldHp > 0) ? `<span class="shield-val">🛡️${char.shieldHp}</span>` : '';
      hpVal.innerHTML = `❤️${Math.max(0, char.hp)}/${char.maxHp}${sh}`;
    }
    if (card) {
      if (char.isDefeated) card.classList.add('defeated');
      else card.classList.remove('defeated');
    }

    const shieldFill = document.getElementById(`shield-${char.id}`);
    if (shieldFill) {
      const pct = Math.min(100, ((char.shieldHp || 0) / char.maxHp) * 100);
      shieldFill.style.width = pct + '%';
      shieldFill.style.display = (char.shieldHp > 0) ? '' : 'none';
    }


    const statusEl = document.getElementById(`status-${char.id}`);
    if (statusEl) {
      statusEl.innerHTML = char.statusEffects.map(e => statusIcon(e.type, e.turns)).join('');
      if (char.hasBarrier) statusEl.innerHTML += `<span class="status-icon" title="無敵バリア">♾️<sub>1</sub></span>`;
    }
    const guardEl = document.getElementById(`guard-overlay-${char.id}`);
    if (guardEl) guardEl.classList.toggle('active', !!char.isGuarding);

  }

  function updatePartySP() {
    const el = document.getElementById('party-sp-gems');
    if (!el) return;
    const gs = window.gameState;
    const sp = gs?.sp ?? 0;
    const maxSp = gs?.maxSp ?? 5;
    el.innerHTML = '';
    for (let i = 0; i < maxSp; i++) {
      const seg = document.createElement('div');
      seg.className = 'sp-seg' + (i < sp ? ' on' : '');
      el.appendChild(seg);
    }
    const num = document.createElement('span');
    num.className = 'sp-num';
    num.textContent = `${sp}/${maxSp}`;
    el.appendChild(num);
  }

  // 固定幅の吹き出しに収まらない行だけを電光掲示板風に流す。
  // あふれ検知はCSSだけでは不可能なので実測してクラスとCSS変数を付ける。
  const MARQUEE_SPEED = 22;   // px/秒（文字数によらず一定速度に見せる）
  const MARQUEE_PAUSE = 2.4;  // 両端で静止する分の秒数
  function applyMarquee(container) {
    container.querySelectorAll('.next-action-skill, .next-action-detail').forEach(line => {
      const inner = line.firstElementChild;
      line.classList.remove('is-marquee');
      if (!inner) return;
      const over = inner.offsetWidth - line.clientWidth;
      if (over <= 2) return;   // 収まっている行は動かさない
      line.style.setProperty('--mq-shift', `-${over}px`);
      line.style.setProperty('--mq-dur', `${(over / MARQUEE_SPEED + MARQUEE_PAUSE).toFixed(1)}s`);
      line.classList.add('is-marquee');
    });
  }

  function updateEnemyNextAction(enemy, skill, livingAllies) {
    const el = document.getElementById(`next-action-${enemy.id}`);
    if (!el) return;
    const card = document.getElementById(`card-${enemy.id}`);
    if (card) card.classList.toggle('enemy-charging', !!enemy._charging && !enemy.isDefeated);
    if (!skill) { el.innerHTML = ''; return; }

    // チャージ中: 溜め段階は🔋、次の敵ターンで発動する段階は💥で簡潔表示
    if (enemy._charging) {
      const t = enemy._charging.turnsLeft;
      const est = estimateEnemyDamage(enemy, skill, livingAllies);
      const tgt = skill.target === 'all' ? '全体' : (enemy._nextTargetEmoji || '');
      const dmgStr = est ? ` ${est.max}` : '';
      const label = t <= 1 ? '💥次で発動' : '🔋チャージ中';
      const summonNote = (enemy.isBoss && t > 1) ? ' + 🐾手下召喚' : '';
      const detail = t <= 1 ? `${label} → ${tgt}${dmgStr}` : `${label}${summonNote}`;
      el.innerHTML = `
        <div class="next-action-skill"><span>${skill.icon || '⚡'} ${skill.name}</span></div>
        <div class="next-action-detail next-action-charge"><span>${detail}</span></div>
      `;
      applyMarquee(el);
      return;
    }

    const DEBUFF_EFFECTS = ['atk_down', 'def_down', 'stun', 'burn', 'poison', 'paralyze', 'freeze', 'curse', 'dispel'];
    const DEBUFF_EFFECT_ICONS = {
      atk_down:'⬇️攻', def_down:'⬇️防',
      stun:'💫', burn:'🔥', poison:'☠️',
      paralyze:'⚡', freeze:'🧊', curse:'🖤', dispel:'🌀'
    };
    const debuffIcon = DEBUFF_EFFECT_ICONS[skill.effect];
    const displayIcon = debuffIcon || skill.icon || '⚡';

    let typeLabel;
    if (skill.type === 'heal') typeLabel = '💚回復';
    else if (skill.type === 'summon') typeLabel = '📣召喚';
    else if (skill.type === 'revive') typeLabel = '💚蘇生';
    else if (skill.effect === 'dispel') typeLabel = '🌀バフ解除';
    else if (skill.type === 'support' && DEBUFF_EFFECTS.includes(skill.effect)) typeLabel = EFFECT_LABELS[skill.effect] || '⬇️デバフ';
    else if (skill.type === 'support') {
      const buffLabels = [skill.effect, skill.alsoEffect2, skill.alsoEffect3]
        .filter(e => e && EFFECT_LABELS[e] && !DEBUFF_EFFECTS.includes(e))
        .map(e => EFFECT_LABELS[e]);
      typeLabel = buffLabels.length > 0 ? buffLabels.join('+') : '⬆️バフ';
    }
    // 攻撃＋デバフは「⚔️攻撃+☠️毒」だと長いので「☠️毒攻撃」に圧縮する。
    // atk_down/def_down は EFFECT_LABELS が「攻撃/防御」を含み二重になるため、
    // パッシブ説明と同じ「攻↓」「防↓」表記にして末尾を「攻撃」で揃える
    else if (skill.effect && DEBUFF_EFFECTS.includes(skill.effect)) {
      const ATK_DEBUFF_LABELS = {
        poison:'☠️毒攻撃', burn:'🔥燃焼攻撃', stun:'💫気絶攻撃',
        paralyze:'⚡麻痺攻撃', freeze:'🧊凍結攻撃', curse:'🖤呪い攻撃',
        atk_down:'⬇️攻↓攻撃', def_down:'⬇️防↓攻撃'
      };
      typeLabel = ATK_DEBUFF_LABELS[skill.effect] || `⚔️攻撃+${EFFECT_LABELS[skill.effect] || skill.effect}`;
    }
    else typeLabel = '⚔️攻撃';

    let targetDisplay;
    if (skill.target === 'single') {
      targetDisplay = enemy._nextTargetEmoji || '❓';
    } else if (skill.target === 'self') {
      targetDisplay = '';
    } else {
      targetDisplay = '全体';
    }

    let dmgStr = '';
    const est = estimateEnemyDamage(enemy, skill, livingAllies);
    if (est) {
      dmgStr = ` ${est.min === est.max ? est.max : `${est.min}~${est.max}`}`;
    }

    const targetPart = targetDisplay ? ` → ${targetDisplay}` : '';
    el.innerHTML = `
      <div class="next-action-skill"><span>${displayIcon} ${skill.name}</span></div>
      <div class="next-action-detail"><span>${typeLabel}${targetPart}${dmgStr}</span></div>
    `;
    applyMarquee(el);
  }

  function statusIcon(type, turns) {
    const icons = {
      burn:'🔥', poison:'☠️', stun:'💫', paralyze:'⚡',
      atk_up:'⬆️攻', atk_down:'⬇️攻',
      def_up:'⬆️防', def_down:'⬇️防',
      barrier:'♾️',
      regen:'💚', freeze:'🧊', curse:'🖤'
    };
    return `<span class="status-icon" title="${type}(${turns}T)">${icons[type]||'?'}<sub>${turns}</sub></span>`;
  }

  function setActiveActor(char) {
    document.querySelectorAll('.char-card').forEach(c => c.classList.remove('active-actor'));
    const card = document.getElementById(`card-${char.id}`);
    if (card) card.classList.add('active-actor');
  }

  // battle.js applySkill の味方→敵ダメージ式の完全ミラー（対象の敵ごとの確定値・1ヒット分）
  // 乗算順・floorのタイミングまで実式に合わせている。ずれると予測が狂うので変更時は両方直すこと
  function calcAllyDamageExact(ally, skill, enemy, livingEnemyCount) {
    if (!skill.power || skill.power <= 0) return 0;
    let dmg = skill.power;
    if (skill.target === 'all' && !skill.noSpread) dmg *= Math.pow(0.8, (livingEnemyCount || 1) - 1);
    const DEBUFF_EFFECTS = ['atk_down', 'def_down', 'stun', 'burn', 'poison', 'paralyze', 'freeze', 'curse'];
    dmg *= (ally.statMods?.atk || 1);
    dmg *= (ally.seriesAtkBonus || 1.0);
    dmg *= (ally.atkMult || 1.0);
    if (ally.powerScale) dmg *= ally.powerScale;
    if (ally.passivePowerMult) dmg *= ally.passivePowerMult;
    if (typeof Relics !== 'undefined') dmg *= Relics.getAtkMultiplier(ally, skill);
    const _ap = ally.passive;
    // low_hp_atk: ATK UPバフ方式に変更したため乗算なし
    if (_ap?.type === 'atk_hp_drain') dmg *= (1 + _ap.value.atk);
    if (_ap?.type === 'berserk' && ally.hp <= ally.maxHp * _ap.value.threshold) dmg *= (1 + _ap.value.atk);
    if (_ap?.type === 'exploit_status' && enemy.statusEffects?.some(e => e.type === _ap.effect)) dmg *= (1 + _ap.value);
    if (_ap?.type === 'multi_hit_boost' && (skill.hits || 1) > 1) dmg *= (1 + _ap.value);
    if (_ap?.type === 'basic_atk_boost' && skill.noSP) dmg *= (1 + _ap.value);
    if (_ap?.type === 'boss_damage' && (enemy.isBoss || enemy.isMidBoss)) dmg *= (1 + _ap.value);
    if (skill.bossBonus && (enemy.isBoss || enemy.isMidBoss)) dmg *= (1 + skill.bossBonus);
    if (_ap?.type === 'compound') {
      _ap.effects?.forEach(eff => {
        if (eff.type === 'atk_boost') dmg *= (1 + eff.value);
        if (eff.type === 'low_hp_atk' && ally.hp <= ally.maxHp * (eff.threshold || 0.5)) dmg *= (1 + eff.value);
      });
    }
    dmg = Math.max(1, Math.floor(dmg));
    if (enemy.isGuarding) dmg = Math.floor(dmg * 0.5);
    const defMult = enemy.statMods?.defMult || 1;
    dmg = Math.floor(dmg * defMult);
    if (typeof Relics !== 'undefined') dmg = Math.floor(dmg * Relics.getBossDamageMultiplier(enemy));
    if (skill.bossKiller && (enemy.isBoss || enemy.isMidBoss)) dmg = Math.floor(dmg * 1.3);
    if (skill.execute && enemy.hp <= enemy.maxHp * 0.7) dmg = Math.floor(dmg * 1.2);
    const passiveDefMult = enemy.passiveDefMult || 1;
    if (passiveDefMult !== 1) dmg = Math.floor(dmg * passiveDefMult);
    const _tdp = enemy.passive;
    if (_tdp?.type === 'counter_vulnerable') dmg = Math.floor(dmg * (1 + _tdp.value.penalty));
    if (_tdp?.type === 'berserk' && enemy.hp <= enemy.maxHp * _tdp.value.threshold) dmg = Math.floor(dmg * (1 + _tdp.value.penalty));
    return Math.max(1, dmg);
  }

  // ---- 推定ダメージ計算（敵ごとに確定値を算出。敵によって変わる場合は min~max の幅を返す）----
  function estimateDamage(ally, skill) {
    if (skill.type === 'heal') {
      const base = Math.floor((skill.healPower || 20) * (ally.atkMult || 1.0));
      let mult = (typeof Relics !== 'undefined') ? Relics.getHealMultiplier() : 1.0;
      if (ally.passive?.type === 'heal_boost') mult *= (1 + ally.passive.value);
      const v = Math.floor(base * mult);
      return { type: 'heal', val: v, hits: 1, total: v };
    }
    if (!skill.power || skill.power <= 0) return null;
    if (typeof Battle === 'undefined') return null;
    const enemies = Battle.getLivingEnemies();
    if (enemies.length === 0) return null;

    const vals = enemies.map(e => calcAllyDamageExact(ally, skill, e, enemies.length));
    const hits = skill.hits || 1;
    const min = Math.min.apply(null, vals);
    const max = Math.max.apply(null, vals);
    const executeActive    = !!(skill.execute    && enemies.some(e => e.hp <= e.maxHp * 0.7));
    const bossKillerActive = !!(skill.bossKiller && enemies.some(e => e.isBoss || e.isMidBoss));
    const shieldBreakActive = !!(skill.shieldBreak && enemies.some(e => e.hasBarrier || (e.shieldHp || 0) > 0));
    return { type: 'dmg', min, max, hits, totalMin: min * hits, totalMax: max * hits, executeActive, bossKillerActive, shieldBreakActive };
  }

  // battle.js applySkill の敵→味方ダメージ式の完全ミラー（乱数なし・表示＝実ダメージ）
  // 乗算順・floorのタイミングまで実式に合わせている。ずれると予測が1でも狂うので変更時は両方直すこと
  function calcEnemyDamageExact(enemy, skill, ally, livingAllyCount) {
    if (!skill.power || skill.power <= 0) return 0;
    let dmg = skill.power;
    if (skill.target === 'all' && !skill.noSpread) dmg *= Math.pow(0.8, (livingAllyCount || 1) - 1);
    const DEBUFF_EFFECTS = ['atk_down', 'def_down', 'stun', 'burn', 'poison', 'paralyze', 'freeze', 'curse'];
    dmg *= (enemy.statMods?.atk || 1);
    dmg *= (enemy.atkMult || 1.0);
    if (enemy.powerScale) dmg *= enemy.powerScale;
    if (enemy.passivePowerMult) dmg *= enemy.passivePowerMult;
    const _ap = enemy.passive;
    if (_ap?.type === 'atk_hp_drain') dmg *= (1 + _ap.value.atk);
    if (_ap?.type === 'berserk' && enemy.hp <= enemy.maxHp * _ap.value.threshold) dmg *= (1 + _ap.value.atk);
    if (_ap?.type === 'exploit_status' && ally.statusEffects?.some(e => e.type === _ap.effect)) dmg *= (1 + _ap.value);
    if (_ap?.type === 'multi_hit_boost' && (skill.hits || 1) > 1) dmg *= (1 + _ap.value);
    if (_ap?.type === 'compound') {
      _ap.effects?.forEach(eff => {
        if (eff.type === 'atk_boost') dmg *= (1 + eff.value);
        if (eff.type === 'low_hp_atk' && enemy.hp <= enemy.maxHp * (eff.threshold || 0.5)) dmg *= (1 + eff.value);
      });
    }
    dmg = Math.max(1, Math.floor(dmg));
    if (ally.isGuarding) dmg = Math.floor(dmg * 0.5);
    dmg = Math.floor(dmg * (ally.statMods?.defMult || 1));
    dmg = Math.floor(dmg * (ally.seriesDefBonus || 1.0));
    if (typeof Relics !== 'undefined') dmg = Math.floor(dmg * Relics.getDefMultiplier(ally));
    const passiveDefMult = ally.passiveDefMult || 1;
    if (passiveDefMult !== 1) dmg = Math.floor(dmg * passiveDefMult);
    const _tdp = ally.passive;
    if (_tdp?.type === 'counter_vulnerable') dmg = Math.floor(dmg * (1 + _tdp.value.penalty));
    if (_tdp?.type === 'berserk' && ally.hp <= ally.maxHp * _tdp.value.threshold) dmg = Math.floor(dmg * (1 + _tdp.value.penalty));
    dmg = Math.max(1, dmg);
    return dmg * (skill.hits || 1);
  }

  function estimateEnemyDamage(enemy, skill, livingAllies) {
    if (!skill.power || skill.power <= 0) return null;
    const allies = (livingAllies || []).filter(a => !a.isDefeated);
    if (allies.length === 0) return null;
    // 単体攻撃は事前確定ターゲットの実防御で計算（確定していなければ全員分の幅を出す）
    const targets = (skill.target === 'single' && enemy._nextTarget && !enemy._nextTarget.isDefeated)
      ? [enemy._nextTarget]
      : allies;
    const vals = targets.map(a => calcEnemyDamageExact(enemy, skill, a, allies.length));
    return {
      min: Math.min.apply(null, vals),
      max: Math.max.apply(null, vals),
      isAoe: skill.target === 'all',
      targetCount: skill.target === 'all' ? allies.length : 1
    };
  }

  // ---- 致死ダメージ警告（予約中の敵攻撃で味方が倒れる恐れがある場合）----
  function estimateEnemyDamageToAlly(enemy, skill, ally, allyCount) {
    return calcEnemyDamageExact(enemy, skill, ally, allyCount);
  }

  function updateLethalWarning() {
    const bar = document.getElementById('lethal-warning');
    if (!bar || typeof Battle === 'undefined') return;

    const allies = Battle.getLivingAllies();
    const enemies = Battle.getLivingEnemies();

    // 味方ごとに予約中の敵攻撃の予測ダメージを合算
    const planned = {};
    enemies.forEach(e => {
      if (e._charging && e._charging.turnsLeft > 1) return; // チャージ中でまだ発動しない敵は警告対象外
      const skill = e._nextSkillId ? ENEMY_SKILL_DATA[e._nextSkillId] : null;
      if (!skill || !skill.power || skill.power <= 0) return;
      if (skill.target === 'single') {
        const t = e._nextTarget;
        if (t && !t.isDefeated) {
          planned[t.id] = (planned[t.id] || 0) + estimateEnemyDamageToAlly(e, skill, t, allies.length);
        }
      } else if (skill.target === 'all') {
        allies.forEach(a => {
          planned[a.id] = (planned[a.id] || 0) + estimateEnemyDamageToAlly(e, skill, a, allies.length);
        });
      }
    });

    const danger = allies.filter(a =>
      !a.hasBarrier && (planned[a.id] || 0) >= a.hp + (a.shieldHp || 0)
    );

    allies.forEach(a => {
      const card = document.getElementById(`card-${a.id}`);
      if (card) card.classList.toggle('lethal-danger', danger.includes(a));
    });
    document.querySelectorAll('#ally-area .char-card.lethal-danger').forEach(card => {
      const id = card.id.replace('card-', '');
      if (!danger.some(a => a.id === id)) card.classList.remove('lethal-danger');
    });

    if (danger.length > 0) {
      const names = danger.map(a => `${a.emoji}${a.name}`).join('、');
      bar.innerHTML = `⚠️ 致死ダメージの予兆！ ${names} が倒される恐れ`;
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  }

  // ---- Build skill effect summary lines ----
  // 対象の表記。同じ 'single' でも、通常攻撃／攻撃技／回復技で言い方を変える。
  // 戦闘中のスキルボタンと図鑑の詳細モーダルの両方から使うので関数にしてある
  function buildTargetLabel(skill) {
    if (!skill) return '';
    const isNoSP = !!(skill.noSP || skill.noPP);
    const hasDmg = (skill.power || 0) > 0;
    const singleLabel = isNoSP && hasDmg ? '通常攻撃' : hasDmg ? '単体攻撃'
      : (skill.type === 'heal' || skill.type === 'revive') ? '味方単体' : '敵単体';
    return skill.target === 'all'
      ? (hasDmg ? '全体攻撃' : '敵全体')
      : ({ single: singleLabel, self:'自分', all_ally:'味方全体', dead_ally:'倒れた仲間' }[skill.target] || '');
  }

  function buildSkillEffectLines(skill) {
    const lines = [];

    if (skill.type === 'heal') {
      lines.push(`💚回復：${skill.healPower || 20}`);
      if (skill.shieldOnHeal) lines.push(`🛡️シールド付与（+${skill.shieldOnHeal}）`);
      [skill.effect, skill.alsoEffect2, skill.alsoEffect3].forEach(ef => {
        if (ef) lines.push(`${EFFECT_LABELS[ef] || ef}（${skill.effectTurns || 3}T）`);
      });
      if (skill.selfEffect) {
        lines.push(`自身に${EFFECT_LABELS[skill.selfEffect] || skill.selfEffect}（${skill.selfEffectTurns || 2}T）`);
      }
      return lines;
    }

    if (skill.type === 'revive') {
      lines.push('💚蘇生（HP30%）');
      if (skill.alsoHealAll) lines.push(`💚全体回復（+${skill.alsoHealAll}）`);
      return lines;
    }

    if (skill.power > 0) {
      const base = skill.power;
      const hits  = skill.hits || 1;
      const dmgTxt = hits > 1 ? `ダメージ：${base}×${hits}H` : `ダメージ：${base}`;
      lines.push(dmgTxt);
      if (skill.noSpread && skill.target === 'all') lines.push('💥ダメージ分散なし');
    }

    if (skill.type === 'support' && !skill.power) {
      if (skill.effect === 'barrier') {
        lines.push('♾️バリア（次の攻撃1回無効）');
        if (skill.alsoEffect2) lines.push(EFFECT_LABELS[skill.alsoEffect2] || skill.alsoEffect2);
      } else if (skill.effect === 'shield') {
        lines.push(`🛡️シールド（HP+${skill.shieldPower}）`);
        [skill.alsoEffect2, skill.alsoEffect3].forEach(ef => {
          if (ef) lines.push(`${EFFECT_LABELS[ef] || ef}（${skill.effectTurns || 3}T）`);
        });
      } else if (skill.effect) {
        const lbl   = EFFECT_LABELS[skill.effect] || skill.effect;
        const note  = skill.effect === 'stun' ? '・ボスには無効' : '';
        const turns = skill.effectTurns ? `${skill.effectTurns}T` : '';
        lines.push(turns || note ? `${lbl}（${turns}${note}）` : lbl);
        const subTurns = skill.effectTurns || 2;
        if (skill.alsoEffect2) lines.push(`${EFFECT_LABELS[skill.alsoEffect2] || skill.alsoEffect2}（${subTurns}T）`);
        if (skill.alsoEffect3) lines.push(`${EFFECT_LABELS[skill.alsoEffect3] || skill.alsoEffect3}（${subTurns}T）`);
      }
    }

    if (skill.effect && skill.power > 0) {
      const lbl   = EFFECT_LABELS[skill.effect] || skill.effect;
      const note  = skill.effect === 'stun' ? '・ボスには無効' : '';
      const turns = skill.effectTurns || 2;
      lines.push(`${lbl}（${turns}T${note}）`);
    }
    if (skill.power > 0) {
      [skill.alsoEffect2, skill.alsoEffect3].forEach(extraEf => {
        if (!extraEf) return;
        const note = extraEf === 'stun' ? '・ボスには無効' : '';
        lines.push(`${EFFECT_LABELS[extraEf] || extraEf}（${skill.effectTurns || 2}T${note}）`);
      });
    }

    if (skill.bossKiller) lines.push('👑ボス特攻（ボスへ1.3倍）');
    if (skill.execute) lines.push('🗡️追撃（HP70%以下の敵へ1.2倍）');
    if (skill.shieldBreak) lines.push('🔨シールド破壊');
    if (skill.healSelf) lines.push(`💜HP吸収${Math.round(skill.healSelf * 100)}%`);
    if (skill.instantKillChance) {
      lines.push(`💀即死${Math.round(skill.instantKillChance * 100)}%（ボスには無効）`);
    }
    if (skill.recoilPct) lines.push(`⚠️ 自傷：HP${Math.round(skill.recoilPct * 100)}%`);
    if (skill.selfStun) lines.push(`⚠️ 使用後気絶（1T）`);
    if (skill.selfEffect) {
      const lbl = EFFECT_LABELS[skill.selfEffect] || skill.selfEffect;
      const isBuff = ['atk_up', 'def_up', 'regen', 'barrier', 'shield'].includes(skill.selfEffect);
      lines.push(`${isBuff ? '' : '⚠️ '}自身に${lbl}（${skill.selfEffectTurns || 2}T）`);
    }
    if (skill.allySplash) lines.push(`⚠️ 巻き込み：味方${Math.round(skill.allySplash * 100)}%`);
    if (skill.selfShieldPower) lines.push(`🛡️シールド付与（HP+${skill.selfShieldPower}）`);
    if (skill.shieldOnHeal) lines.push(`🛡️シールド付与（+${skill.shieldOnHeal}）`);


    return lines;
  }

  // ---- Card-based character select (side-turn system) ----
  let _allySelectHandlers = [];
  let _bgCancelHandler = null;

  function makeAllyCardsSelectable(allies, onSelect, initialAlly = null) {
    _allySelectHandlers = [];
    allies.forEach(ally => {
      const card = document.getElementById(`card-${ally.id}`);
      if (!card) return;
      card.classList.add('selectable-ally');
      const handler = () => {
        if (card.classList.contains('targetable')) return; // 対象選択モード中はアクター切り替えをスキップ
        _allySelectHandlers.forEach(({ card: c }) => c.classList.add('selectable-ally'));
        card.classList.remove('selectable-ally');
        onSelect(ally);
      };
      card.addEventListener('click', handler);
      _allySelectHandlers.push({ card, handler });
    });
    if (initialAlly) {
      const initCard = document.getElementById(`card-${initialAlly.id}`);
      if (initCard) initCard.classList.remove('selectable-ally');
      onSelect(initialAlly);
    } else {
      showWaitingPanel('⚡ <strong>キャラを選んでください</strong>');
    }
  }

  function showTurnChangeBanner(isPlayer, turnNum) {
    document.querySelectorAll('.turn-change-banner').forEach(b => b.remove());
    const banner = document.createElement('div');
    banner.className = `turn-change-banner ${isPlayer ? 'turn-player' : 'turn-enemy'}`;
    banner.textContent = isPlayer ? `⚡ 自軍ターン ${turnNum}` : '👹 敵ターン';
    const vsEl = document.querySelector('.vs-divider');
    if (vsEl) {
      const rect = vsEl.getBoundingClientRect();
      banner.style.top = `${rect.top + rect.height / 2}px`;
    }
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('active'));
    setTimeout(() => {
      banner.classList.remove('active');
      setTimeout(() => banner.remove(), 250);
    }, 1200);
  }

  function showInitiativeBanner(isPlayerFirst, reason = null) {
    let mainText, subText;
    if (!isPlayerFirst) {
      mainText = '敵の奇襲！'; subText = '敵ターン';
    } else {
      mainText = '先制！'; subText = '自軍ターン';
    }
    const banner = document.createElement('div');
    banner.className = `initiative-banner ${isPlayerFirst ? 'player-first' : 'enemy-first'}`;
    banner.innerHTML = `<div class="init-icon">${isPlayerFirst ? '⚡' : '👹'}</div><div class="init-text">${mainText}<br><span>${subText}</span></div>`;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('active'));
    setTimeout(() => {
      banner.classList.remove('active');
      setTimeout(() => banner.remove(), 400);
    }, 1600);
  }

  function clearAllyCardSelection() {
    _allySelectHandlers.forEach(({ card, handler }) => {
      card.classList.remove('selectable-ally');
      card.removeEventListener('click', handler);
    });
    _allySelectHandlers = [];
  }

  // ---- Legacy character select panel (kept for reference) ----
  function renderCharacterSelect(allies, onSelect) {
    const panel = document.getElementById('skill-panel');
    panel.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'skill-header';
    header.innerHTML = `⚡ <strong>誰を動かす？</strong>`;
    panel.appendChild(header);
    const grid = document.createElement('div');
    grid.className = 'char-select-grid';
    allies.forEach(ally => {
      const btn = document.createElement('button');
      btn.className = 'char-select-btn';
      btn.style.setProperty('--char-color', ally.color || '#888');
      const hpPct = Math.max(0, (ally.hp / ally.maxHp) * 100);
      const hpClass = hpPct <= 25 ? 'crit' : hpPct <= 50 ? 'low' : '';
      const roleIcon = ally.role === 'tank' ? '🛡️' : ally.role === 'support' ? '💚' : ally.role === 'striker' ? '⚡' : '⚔️';
      btn.innerHTML = `
        <div class="cs-emoji">${ally.emoji}</div>
        <div class="cs-name">${ally.name}</div>
        <div class="cs-role">${roleIcon}</div>
        <div class="cs-hp-bar"><div class="cs-hp-fill ${hpClass}" style="width:${hpPct}%"></div></div>
        <div class="cs-hp-val">${ally.hp}/${ally.maxHp}</div>`;
      btn.addEventListener('click', () => {
        try { Audio.SE.select(); } catch(e) {}
        onSelect(ally);
      });
      grid.appendChild(btn);
    });
    panel.appendChild(grid);
  }

  // ---- 待機表示（処理中 / 敵の行動中 など）----
  // 高さは #skill-panel の min-height で常に確保しているので、ここは中身を出すだけ。
  // clearTheme: パネル上下の枠色（行動キャラの色）を消すかどうか。
  // 元々消していたのは「処理中」と「◯◯の行動中」だけなので、そこだけ true を渡す
  function showWaitingPanel(headlineHtml, clearTheme = false) {
    const panel = document.getElementById('skill-panel');
    if (!panel) return;
    panel.innerHTML = `<div class="waiting-msg">${headlineHtml}</div>`;
    if (clearTheme) panel.style.removeProperty('--theme-color');
  }

  function showPlayerTurnMsg(turnNum) {
    showWaitingPanel(`⚡ <strong>自軍ターン ${turnNum}</strong> 開始...`);
  }

  function showEnemyTurnStartMsg() {
    showWaitingPanel('👹 <strong>敵ターン</strong> 開始...');
  }

  // ---- Skill buttons ----
  function renderSkillButtons(ally, onSkillClick, onCancel) {
    const panel = document.getElementById('skill-panel');
    panel.innerHTML = '';
    if (ally.color) panel.style.setProperty('--theme-color', ally.color);
    else panel.style.removeProperty('--theme-color');

    if (_bgCancelHandler) { document.removeEventListener('click', _bgCancelHandler); _bgCancelHandler = null; }
    _bgCancelHandler = (e) => {
      if (!document.querySelector('.skill-selected, .skill-pending')) return;
      if (e.target.closest('#skill-panel') || e.target.closest('.char-card')) return;
      clearTargetSelect();
      document.querySelectorAll('.skill-selected').forEach(b => b.classList.remove('skill-selected'));
      if (onCancel) onCancel();
    };
    document.addEventListener('click', _bgCancelHandler);

    // 「〇〇のターン！」見出し。設定でOFFにできるよう actor-turn-header を付ける
    // （同じ .skill-header を使う「誰を動かす？」は消えないようにするため）
    const header = document.createElement('div');
    header.className = 'skill-header actor-turn-header';
    header.style.color = '#fff';

    const _HEADER_BUFF_ICONS = {
      atk_up:'⬆️攻', atk_down:'⬇️攻',
      def_up:'⬆️防', def_down:'⬇️防',
      regen:'💚', barrier:'♾️',
      burn:'🔥', poison:'☠️', stun:'💫', paralyze:'⚡',
      freeze:'🧊', curse:'🖤'
    };
    const _buffParts = [
      ...(ally.statusEffects || []).map(e => _HEADER_BUFF_ICONS[e.type]).filter(Boolean),
      ally.hasBarrier ? '♾️' : null,
      ally.isGuarding ? '🛡️' : null
    ].filter(Boolean);
    const _buffDisplay = _buffParts.length > 0
      ? `<span style="margin-left:8px;opacity:0.8;">${_buffParts.join(' ')}</span>`
      : '';

    header.innerHTML = `${ally.emoji || '⚡'} <strong>${ally.name}</strong> の${ally._inPreTurn ? '先制行動！' : 'ターン！'}${_buffDisplay}`;
    panel.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'skill-grid';

    // 防御ボタン（通常攻撃の隣＝グリッド2セル目に挿入する）
    const spLabelHtml = `<span class="skill-mp noPP-label">SP不要</span>`;
    const defendBtn = document.createElement('button');
    defendBtn.className = 'defend-btn';
    defendBtn.dataset.skillId = 'defend';
    defendBtn.innerHTML = `
      <div class="skill-top">
        <span class="skill-icon">🛡️</span>
        <span class="skill-name">防御</span>
      </div>
      <div class="skill-effect-area"><span class="skill-effect-line">ダメージを50%カット</span></div>
      <div class="skill-meta">
        ${spLabelHtml}
        <span class="skill-tgt">自分</span>
      </div>`;
    defendBtn.addEventListener('click', () => {
      panel.querySelectorAll('.skill-btn.skill-selected').forEach(b => b.classList.remove('skill-selected'));
      defendBtn.classList.add('skill-selected');
      Audio.SE.select();
      onSkillClick('defend', { target: 'self', animation: 'buff', type: 'support' });
    });
    let defendPlaced = false;

    ally.skillIds.forEach(skillId => {
      const skill = SKILL_DATA[skillId];
      if (!skill) return;

      const isNoSP    = !!(skill.noSP || skill.noPP);
      const spCost    = isNoSP ? 0 : (skill.spCost ?? 5);
      // 実効コスト。ストライカーの先制行動中は-2され、負ならその分SPが回復する。
      // 計算は Battle 側に集約してあるので、表示と実消費が食い違わない
      const effCost   = isNoSP ? 0 : Battle.getEffectiveSpCost(ally, skill);
      const isDiscounted = effCost < spCost;
      const partySp   = window.gameState?.sp ?? 5;
      const hasDeadAlly = skill.target !== 'dead_ally' || Battle.getDeadAllies().length > 0;
      // 判定は必ず実効コストで行う。元コストで見ると、実際には撃てるのに
      // SP不足でボタンが押せない、という食い違いが起きる
      const canUse    = (isNoSP || partySp >= effCost) && hasDeadAlly;
      const btn = document.createElement('button');
      btn.className = `skill-btn${canUse ? '' : ' skill-disabled'}`;
      btn.dataset.skillId = skillId;
      btn.disabled = !canUse;

      const targetLabel = buildTargetLabel(skill);

      const spGain = ally.role === 'support' ? 2 : 1;
      // 先制割引の見せ方は3通り。
      //   effCost < 0 … 消費どころか回復する（コスト1の技）
      //   effCost = 0 … タダ
      //   effCost > 0 … 元コストに取り消し線を引いて実効コストを出す
      const discountLabel = effCost < 0
        ? `<span class="skill-mp noPP-label">⚡SP+${-effCost}<span class="orig-sp-cost">SP${spCost}</span></span>`
        : effCost === 0
          ? `<span class="skill-mp noPP-label">⚡SP0<span class="orig-sp-cost">SP${spCost}</span></span>`
          : `<span class="skill-mp${canUse ? '' : ' mp-short'}">SP${effCost} ${'◆'.repeat(effCost)}<span class="orig-sp-cost">SP${spCost}</span></span>`;
      const ppLabel = isNoSP
        ? `<span class="skill-mp noPP-label">🔋SP+${spGain}</span>`
        : isDiscounted
          ? discountLabel
          : `<span class="skill-mp${canUse ? '' : ' mp-short'}">SP${spCost} ${'◆'.repeat(spCost)}</span>`;

      const effectLines = buildSkillEffectLines(skill);
      const _liveEnemies = typeof Battle !== 'undefined' ? Battle.getLivingEnemies() : [];
      const _exActive  = skill.execute    && _liveEnemies.some(e => e.hp <= e.maxHp * 0.7);
      const _bkActive  = skill.bossKiller && _liveEnemies.some(e => e.isBoss || e.isMidBoss);
      const _sbActive  = skill.shieldBreak && _liveEnemies.some(e => e.hasBarrier || (e.shieldHp || 0) > 0);
      const effectHtml = effectLines.map(l => {
        const active = (skill.execute    && l.includes('追撃')      && _exActive)
                    || (skill.bossKiller && l.includes('ボス特攻')   && _bkActive)
                    || (skill.shieldBreak && l.includes('シールド破壊') && _sbActive);
        return `<span class="skill-effect-line${active ? ' effect-active' : ''}">${l}</span>`;
      }).join('');

      // 推定ダメージ（バフ・Tier・レリック込み）
      const est = estimateDamage(ally, skill);
      let estHtml = '';
      if (est) {
        // 敵の防御状態（防御↑↓・軽減パッシブ・特攻対象など）で値が変わる場合は min~max の幅表示
        const rng = (a, b) => a === b ? `${a}` : `${a}~${b}`;
        if (est.type === 'heal') {
          estHtml = `<span class="skill-dmg-estimate">➜ 推定回復 ${est.total}</span>`;
        } else if (est.hits > 1) {
          estHtml = `<span class="skill-dmg-estimate">➜ 推定ダメージ ${rng(est.totalMin, est.totalMax)}（${rng(est.min, est.max)}×${est.hits}H）</span>`;
        } else {
          estHtml = `<span class="skill-dmg-estimate">➜ 推定ダメージ ${rng(est.totalMin, est.totalMax)}</span>`;
        }
      }

      btn.innerHTML = `
        <div class="skill-top">
          <span class="skill-icon">${skill.icon}</span>
          <span class="skill-name">${skill.name}</span>
        </div>
        <div class="skill-effect-area">${effectHtml}${estHtml}</div>
        <div class="skill-meta">
          ${ppLabel}
          <span class="skill-tgt">${targetLabel}</span>
        </div>`;

      btn.addEventListener('click', () => {
        panel.querySelectorAll('.skill-btn.skill-selected').forEach(b => b.classList.remove('skill-selected'));
        btn.classList.add('skill-selected');
        Audio.SE.select();
        onSkillClick(skillId, skill);
      });
      grid.appendChild(btn);
      // 通常攻撃（noSP）の直後に防御を並べる
      if (!defendPlaced && isNoSP) {
        grid.appendChild(defendBtn);
        defendPlaced = true;
      }
    });
    if (!defendPlaced) grid.appendChild(defendBtn); // 通常攻撃が無いキャラ用フォールバック

    panel.appendChild(grid);
  }

  function hideSkillPanel() {
    if (_bgCancelHandler) { document.removeEventListener('click', _bgCancelHandler); _bgCancelHandler = null; }
    showWaitingPanel('⏳ 処理中...', true);
  }

  function showEnemyTurnMsg(enemy) {
    showWaitingPanel(`👹 <strong>${enemy.name}</strong> の行動中...`, true);
  }

  // ---- Info Sidebar ----
  // 所持レリック一覧。情報サイドバーと、戦闘中の💎レリックモーダルで共用する
  function heldRelicsHtml() {
    if (typeof Relics === 'undefined' || typeof RELIC_DATA === 'undefined') return '';
    const held = Relics.getHeld();
    if (held.length === 0) return '';
    const items = held.map(id => {
      const r = RELIC_DATA.find(x => x.id === id);
      if (!r) return '';
      const rarityStars = r.rarity === 3 ? '★★★' : r.rarity === 2 ? '★★' : '★';
      const rarityColor = r.rarity === 3 ? '#ffcc44' : r.rarity === 2 ? '#aabbcc' : '#778899';
      // 星のサイズは .relic-held-stars 側で持つ。インラインで font-size を書くと
      // --ui-scale による拡大が効かず、ここだけ小さいまま取り残される
      return `<div class="relic-held-item">
        <span class="relic-held-emoji">${r.emoji}</span>
        <div class="relic-held-text">
          <div class="relic-held-name">${r.name} <span class="relic-held-stars" style="color:${rarityColor}">${rarityStars}</span></div>
          <div class="relic-held-origin">${r.origin}</div>
          <div class="relic-held-desc">${r.desc}</div>
        </div>
      </div>`;
    }).join('');
    return `<div class="sidebar-relics">${items}</div>`;
  }

  function renderInfoSidebar(isBoss = false, seriesBonuses = [], _unused, activeAllies = []) {
    const sidebar = document.getElementById('info-sidebar');
    if (!sidebar) return;

    const live = activeAllies.filter(a => !a.isDefeated);
    const hasAttacker  = live.some(a => a.role === 'attacker');
    const hasSupport   = live.some(a => a.role === 'support');
    const hasTank      = live.some(a => a.role === 'tank');
    const hasStriker   = live.some(a => a.role === 'striker');

    // 所持レリックは左サイドパネル(#side-left)の独立した <details> に描画する。
    // sidebar.innerHTML に混ぜると毎ターンの再描画で開閉状態が飛ぶため、
    // 外枠は index.html に静的に置いて中身だけ差し替える
    // 未所持でも枠は常に出す（パネルの並びが戦況で変わらないようにするため）
    const relicBox = document.getElementById('relic-box');
    if (relicBox) {
      const held  = (typeof Relics !== 'undefined') ? Relics.getHeld() : [];
      const list  = heldRelicsHtml();
      const body  = document.getElementById('relic-box-body');
      const title = document.getElementById('relic-box-title');
      if (body)  body.innerHTML = list || '<div class="relic-empty">まだ所持していません<br>戦闘に勝つと入手できます</div>';
      if (title) title.textContent = `💎 所持レリック（${held.length}個）`;
    }

    const hasBonus2 = seriesBonuses.some(s => s.cnt === 2);
    const hasBonus3 = seriesBonuses.some(s => s.cnt >= 3);

    // 再描画で <details> が作り直されるとユーザーが開いた状態が毎ターン失われるので、
    // 直前の open を控えておいて書き換え後に復元する
    const wasOpen = [...sidebar.querySelectorAll('details')].map(d => d.open);

    sidebar.innerHTML = `
      <details class="sidebar-dropdown" open>
        <summary class="sidebar-dropdown-title">📘 システム</summary>
        <div class="sidebar-dropdown-content">
          <div class="system-row${hasAttacker ? ' role-active' : ''}">⚔️ アタッカー：敵撃破時に再行動できる</div>
          <div class="system-row${hasSupport  ? ' role-active' : ''}">💚 サポーター：通常攻撃がSP+2</div>
          <div class="system-row${hasTank     ? ' role-active' : ''}">🛡️ タンク：単体攻撃・デバフを引き付ける</div>
          <div class="system-row${hasStriker  ? ' role-active' : ''}">⚡ ストライカー：初回のみ先制行動（SP消費-2）</div>
          <div class="system-row${hasBonus2 ? ' role-active' : ''}">⭐ 同一作品2人→攻撃+20%・被ダメ-10%</div>
          <div class="system-row${hasBonus3 ? ' role-active' : ''}">⭐ 同一作品3人→攻撃+40%・被ダメ-20%</div>
        </div>
      </details>
    `;
    // 「📖 バフ・デバフ」の一覧はここにあったが、トップバーの📖ガイドがPCでも
    // 出るようになったので削除した。ガイドの「状態異常」タブが同じ13項目を
    // 数値付き・good/bad の色分けありで持っている（index.html の #sys-tab-status）

    // 初回（wasOpen が空）はマークアップの open 属性をそのまま活かす
    if (wasOpen.length) {
      sidebar.querySelectorAll('details').forEach((d, i) => {
        if (i < wasOpen.length) d.open = wasOpen[i];
      });
    }
  }

  // ---- Turn Order Panel（フェーズ制バトル対応）----
  // actors: 実アクターオブジェクト配列
  // opts.phase: 'select' | 'execute'
  // opts.selectingId: 現在選択中のアライID（選択フェーズ）
  // opts.currentActorId: 現在実行中のアクターID（実行フェーズ）
  // opts.selectedMap: Map<id, {skillId}> 選択済み行動
  function updateNextTurn(actors, opts = {}) {
    const { phase, selectingId, currentActorId, selectedMap } = opts;

    // キャラカードの行動順バッジを更新（パネルの有無に関係なく実行）
    document.querySelectorAll('.turn-order-badge').forEach(b => b.remove());
    if (currentActorId) {
      const card = document.getElementById(`card-${currentActorId}`);
      if (card) {
        const badge = document.createElement('div');
        badge.className = 'turn-order-badge badge-now';
        badge.textContent = '▶';
        card.appendChild(badge);
      }
    }
    if (actors) {
      actors.forEach((actor, i) => {
        if (actor.isDefeated) return;
        const card = document.getElementById(`card-${actor.id}`);
        if (card) {
          const badge = document.createElement('div');
          badge.className = 'turn-order-badge';
          badge.textContent = String(i + 1);
          card.appendChild(badge);
        }
      });
    }

    const el = document.getElementById('next-turn-panel');
    if (!el) return;

    if (!actors || actors.length === 0) {
      el.innerHTML = '<div class="ctb-loading">— 待機中 —</div>';
      return;
    }

    el.innerHTML = actors.map((entity, idx) => {
      const isEnemy = entity.isEnemy;
      const entryClass = isEnemy ? 'ctb-enemy-entry' : 'ctb-ally-entry';

      const isCurrent = entity.id === currentActorId || (phase === 'select' && entity.id === selectingId);
      const posLabel = isCurrent
        ? `<span class="ctb-pos-label ctb-pos-now">▶</span>`
        : `<span class="ctb-pos-label">${idx + 1}</span>`;

      let intentHtml = '';
      if (!isEnemy) {
        const selected = selectedMap && selectedMap.get(entity.id);
        if (entity.id === selectingId) {
          intentHtml = `<span class="ctb-intent ctb-intent-selecting">選択中…</span>`;
        } else if (selected) {
          const sk = selected.skillId === 'defend'
            ? { icon: '🛡️', name: '防御' }
            : (typeof SKILL_DATA !== 'undefined' && SKILL_DATA[selected.skillId]);
          if (sk) intentHtml = `<span class="ctb-intent ctb-intent-done">✓ ${sk.icon || ''}${sk.name}</span>`;
        }
      }

      return `
        <div class="ctb-entry ${entryClass}${isCurrent ? ' ctb-current' : ''}">
          ${posLabel}
          <span class="ctb-char-emoji">${entity.emoji}</span>
          <span class="ctb-char-name">${entity.name}</span>
          ${intentHtml}
        </div>`;
    }).join('');
  }

  // ---- Battle Log ----
  function log(msg, cls = '') {
    const logEl = document.getElementById('battle-log');
    if (!logEl) return;
    const line = document.createElement('div');
    line.className = `log-line ${cls}`;
    line.innerHTML = msg;
    logEl.prepend(line);
    if (logEl.children.length > 80) logEl.removeChild(logEl.lastChild);
  }

  function clearLog() {
    const logEl = document.getElementById('battle-log');
    if (logEl) logEl.innerHTML = '';
  }

  // ---- Floating numbers ----
  function floatNumber(charId, text, cls = '', yOffset = 0) {
    const card = document.getElementById(`card-${charId}`);
    if (!card) return;
    const el = document.createElement('div');
    el.className = `float-num ${cls}`;
    el.textContent = text;
    const rect = card.getBoundingClientRect();
    const xSpread = (Math.random() - 0.5) * 36;
    el.style.left = (rect.left + rect.width / 2 - 30 + xSpread) + 'px';
    const fromBottom = cls.includes('float-from-bottom');
    el.style.top = fromBottom
      ? (rect.bottom + window.scrollY - 20 + yOffset) + 'px'
      : (rect.top + window.scrollY + yOffset) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  // 同一カード上のフロートを時間差(400ms)+Y位置ずらし(50px)で重ならないように表示
  const _floatStates = {};
  function queueFloat(charId, text, cls = '') {
    if (!_floatStates[charId]) _floatStates[charId] = { endAt: 0, idx: 0 };
    const state = _floatStates[charId];
    const now = Date.now();
    if (state.endAt <= now) state.idx = 0;
    const yOff = -state.idx * 50;
    const startAt = Math.max(now, state.endAt);
    state.endAt = startAt + 400;
    state.idx++;
    const delay = startAt - now;
    if (delay <= 0) floatNumber(charId, text, cls, yOff);
    else setTimeout(() => floatNumber(charId, text, cls, yOff), delay);
  }

  // ---- Flash ----
  function flashCard(charId, cls = 'hit-flash', duration = 220) {
    const card = document.getElementById(`card-${charId}`);
    if (!card) return;
    card.classList.add(cls);
    setTimeout(() => card.classList.remove(cls), duration);
  }

  function flashPassive(charId, cls = 'passive-flash', duration = 1400) {
    const el = document.getElementById(`passive-${charId}`);
    if (!el) return;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), duration);
  }

  function flashRole(charId, cls, duration = 1400) {
    const el = document.getElementById(`role-${charId}`);
    if (!el) return;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), duration);
  }

  // ---- Screen shake ----
  function screenShake(intensity = 'normal') {
    const el = document.getElementById('battle-screen');
    if (!el) return;
    const cls = intensity === 'heavy' ? 'shake-heavy' : 'shake';
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 500);
  }

  // ---- Skill animation overlay (single hit) ----
  function playSkillAnimation(animType, isAllTarget = false, isTargetAlly = false) {
    return new Promise(resolve => {
      const overlay = document.getElementById('anim-overlay');
      if (!overlay) { resolve(); return; }
      const targetEl = document.getElementById(isTargetAlly ? 'ally-area' : 'enemy-area');
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        overlay.style.setProperty('--anim-target-y', (centerY / window.innerHeight * 100).toFixed(1) + '%');
      } else {
        overlay.style.setProperty('--anim-target-y', isTargetAlly ? '65%' : '30%');
      }
      let cls = `anim-overlay anim-${animType}`;
      if (isAllTarget)  cls += ' anim-wide';
      if (isTargetAlly) cls += ' anim-target-ally';
      overlay.className = cls;
      overlay.style.opacity = '1';
      setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.className = 'anim-overlay';
        resolve();
      }, 600);
    });
  }

  // ---- Multi-hit animation ----
  async function playMultiHitAnimation(animType, hits, isAllTarget = false, isTargetAlly = false) {
    const overlay = document.getElementById('anim-overlay');
    if (!overlay) return;
    const targetEl = document.getElementById(isTargetAlly ? 'ally-area' : 'enemy-area');
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      overlay.style.setProperty('--anim-target-y', (centerY / window.innerHeight * 100).toFixed(1) + '%');
    } else {
      overlay.style.setProperty('--anim-target-y', isTargetAlly ? '65%' : '30%');
    }
    let cls = `anim-overlay anim-${animType}`;
    if (isAllTarget)  cls += ' anim-wide';
    if (isTargetAlly) cls += ' anim-target-ally';
    const flashCount = Math.min(hits, 8);
    const totalMs    = 550;
    const flashDur   = Math.floor(totalMs / flashCount);
    for (let i = 0; i < flashCount; i++) {
      overlay.className = cls;
      overlay.style.opacity = '0.92';
      await new Promise(r => setTimeout(r, Math.floor(flashDur * 0.55)));
      overlay.style.opacity = '0.08';
      await new Promise(r => setTimeout(r, Math.floor(flashDur * 0.45)));
    }
    overlay.className = 'anim-overlay';
    overlay.style.opacity = '0';
  }

  // ---- Result overlay ----
  function showBattleResult(type, healPctLabel, onNext, droppedRelic = null) {
    const overlay = document.getElementById('result-overlay');
    const msg     = document.getElementById('result-msg');
    const btn     = document.getElementById('result-btn');
    if (!overlay || !msg || !btn) return;

    if (type === 'clear') {
      msg.innerHTML = `🏆 <span class="result-win">GAME CLEAR!</span><br><small style="color:#ffcc44;font-size:0.8rem">3つのWAVEを制覇した！</small>`;
      btn.textContent = 'タイトルへ戻る';
    } else if (type === 'win') {
      const recoverMsg = healPctLabel === 'full'
        ? `HP 全回復！`
        : healPctLabel > 0
        ? `HP ${healPctLabel}%回復`
        : `HP回復なし`;
      msg.innerHTML = `🎉 <span class="result-win">勝利！</span><br><small style="color:#aad;font-size:0.75rem">${recoverMsg}　<span style="color:#ffcc66">⚡ SP 3 からスタート</span></small>`;
      btn.textContent = '次のバトルへ →';
    } else {
      msg.innerHTML = '💀 <span class="result-lose">敗北...</span>';
      btn.textContent = 'タイトルへ戻る';
      Audio.SE.defeat();
    }

    const relicEl = document.getElementById('result-relic');
    if (relicEl) {
      if (type === 'win' && droppedRelic) {
        relicEl.innerHTML = `
          <div class="rr-label">✨ レリック入手！</div>
          <div class="rr-body">
            <span class="rr-emoji">${droppedRelic.emoji}</span>
            <span class="rr-name">${droppedRelic.name}</span>
          </div>
          <div class="rr-origin">${droppedRelic.origin}</div>
          <div class="rr-desc">${droppedRelic.desc}</div>`;
        relicEl.style.display = '';
      } else {
        relicEl.style.display = 'none';
      }
    }

    overlay.classList.add('active');
    btn.onclick = () => {
      overlay.classList.remove('active');
      onNext();
    };

  }

  // ---- Boss intro ----
  function showBossIntro(boss, onDone) {
    const overlay  = document.getElementById('boss-intro-overlay');
    const nameEl   = document.getElementById('boss-intro-name');
    const quoteEl  = document.getElementById('boss-intro-quote');
    if (!overlay) { onDone(); return; }
    nameEl.textContent  = `${boss.emoji} ${boss.name}`;
    if (boss.origin) {
      const originEl = document.createElement('div');
      originEl.style.cssText = 'font-size:0.72rem;color:#888;letter-spacing:0.15em;margin-top:4px;';
      originEl.textContent = `【${boss.origin}】`;
      nameEl.appendChild(originEl);
    }
    quoteEl.textContent = boss.intro || '';
    overlay.classList.add('active');
    Audio.SE.bossIntro();
    setTimeout(() => {
      overlay.classList.remove('active');
      setTimeout(onDone, 400);
    }, 2800);
  }

  // ---- AoE confirm (any card click fires skill) ----
  function promptAoeConfirm(targets, isAlly, onConfirm) {
    clearTargetSelect(); // 前回の選択表示が残っていても必ず1つにする
    const areaId = isAlly ? 'ally-area' : 'enemy-area';
    const area = document.getElementById(areaId);
    const overlay = document.createElement('div');
    overlay.className = `aoe-overlay${isAlly ? ' aoe-overlay-ally' : ''}`;
    overlay.textContent = isAlly ? '💚 全体' : '⚔️ 全体';
    area.appendChild(overlay);
    targets.forEach(t => {
      const card = document.getElementById(`card-${t.id}`);
      if (!card) return;
      card.classList.add('targetable', ...(isAlly ? ['targetable-ally'] : []));
      card.onclick = () => { Audio.SE.cursor(); clearTargetSelect(); onConfirm(); };
    });
  }

  // ---- Enemy target selection ----
  function promptTargetSelect(enemies, onSelect) {
    clearTargetSelect();
    enemies.forEach(e => {
      const card = document.getElementById(`card-${e.id}`);
      if (!card || e.isDefeated) return;
      card.classList.add('targetable');
      card.onclick = () => {
        Audio.SE.cursor();
        clearTargetSelect();
        onSelect(e);
      };
    });
  }

  // ---- Ally target selection ----
  function promptAllyTargetSelect(allies, onSelect) {
    clearTargetSelect();
    allies.forEach(a => {
      const card = document.getElementById(`card-${a.id}`);
      if (!card || a.isDefeated) return;
      card.classList.add('targetable', 'targetable-ally');
      card.onclick = () => {
        Audio.SE.cursor();
        clearTargetSelect();
        onSelect(a);
      };
    });
  }

  // ---- Dead ally target selection (for revive) ----
  function promptDeadAllySelect(deadAllies, onSelect) {
    clearTargetSelect();
    deadAllies.forEach(a => {
      const card = document.getElementById(`card-${a.id}`);
      if (!card) return;
      card.classList.add('targetable', 'targetable-ally');
      card.onclick = () => {
        Audio.SE.cursor();
        clearTargetSelect();
        onSelect(a);
      };
    });
  }

  function clearTargetSelect() {
    document.querySelectorAll('.aoe-overlay').forEach(el => el.remove());
    document.querySelectorAll('.targetable').forEach(c => {
      c.classList.remove('targetable', 'targetable-ally');
      c.onclick = null;
    });
    document.querySelectorAll('.skill-pending').forEach(b => b.classList.remove('skill-pending'));
  }

  // 対象確認待ちのスキル/防御ボタンをハイライト（hint: 2度押し時の動作説明）
  function setSkillBtnPending(skillId, hint) {
    document.querySelectorAll('.skill-pending').forEach(b => b.classList.remove('skill-pending'));
    if (!skillId) return;
    const btn = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (btn) {
      btn.classList.add('skill-pending');
      btn.dataset.pendingHint = hint || 'もう一度押すと発動';
    }
  }

  // ---- Swap overlay — 3 candidates with stats/skills preview ----
  function showSwapOverlay(candidates, currentParty, onChoose, title = '👑 ボス撃破！仲間チェンジのチャンス！') {
    const overlay = document.getElementById('swap-overlay');
    if (!overlay) return;

    let selectedCandidateId = null;

    function buildCurrentMemberHtml(char) {
      const rarity = (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[char.id]) || 2;
      const stars = '★'.repeat(rarity);
      const starColor = rarity === 3 ? '#ffcc44' : rarity === 1 ? '#778899' : '#aabbcc';
      const role = char.role && ROLES[char.role] ? ROLES[char.role] : null;
      const roleHtml = role ? `<span class="role-badge" style="background:${role.color}">${role.icon}${role.label}</span>` : '';
      const hpPct = Math.round(char.hp / char.maxHp * 100);
      const passiveHtml = char.passive
        ? `<div class="swap-cm-passive">⚡${char.passive.name}<span class="swap-cm-passive-desc"> — ${char.passive.desc}</span></div>`
        : '';
      const skillsList = (char.skillIds || []).map(id => {
        const s = SKILL_DATA[id];
        if (!s) return '';
        const isNoSP2 = !!(s.noSP || s.noPP);
        const spTxt = isNoSP2 ? '∞' : `SP${s.spCost ?? 5}`;
        const hasDmg = (s.power || 0) > 0;
        const singleLabel = isNoSP2 && hasDmg ? '通常攻撃' : hasDmg ? '単体攻撃'
          : (s.type === 'heal' || s.type === 'revive') ? '味方単体' : '敵単体';
        const tgtLabel = s.target === 'all'
          ? (hasDmg ? '全体攻撃' : '敵全体')
          : ({ single: singleLabel, self:'自分', all_ally:'味方全' }[s.target] || '');
        const effectLines = buildSkillEffectLines(s);
        const effectHtml = effectLines.map(l => `<span class="cand-skill-effect">${l}</span>`).join('');
        return `<div class="cand-skill-item">
          <div class="cand-skill-header">${s.icon} ${s.name} <span class="cand-skill-pp">${spTxt}</span><span class="cand-skill-tgt">${tgtLabel}</span></div>
          ${effectHtml ? `<div class="cand-skill-effects">${effectHtml}</div>` : ''}
        </div>`;
      }).join('');
      return `
        <div class="swap-cm-card" data-id="${char.id}">
          <div class="swap-cm-top">
            <span class="swap-cm-emoji">${char.emoji}</span>
            <div class="swap-cm-info">
              <div class="swap-cm-name">${char.name} <span style="color:${starColor};font-size:0.58rem">${stars}</span></div>
              <div class="swap-cm-sub">${char.origin || ''}${roleHtml ? ' ' + roleHtml : ''}</div>
              <div class="swap-cm-stats">HP ${char.hp}/${char.maxHp}(${hpPct}%)</div>
            </div>
          </div>
          ${passiveHtml}
          <div class="swap-cm-skills-toggle">▶ わざを見る</div>
          <div class="swap-cm-skills" style="display:none">${skillsList}</div>
        </div>`;
    }

    // スマホでは候補3人分のわざ一覧が開いたままだと画面が非常に長くなるため、
    // 初期状態を閉じておく（トグルは skillDiv.style.display を見て動くので整合する）
    const _swapSkillsOpen = !window.matchMedia('(max-width: 640px)').matches;

    function buildCandidateCardHtml(char) {
      const rarity = (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[char.id]) || 2;
      const stars = '★'.repeat(rarity);
      const starColor = rarity === 3 ? '#ffcc44' : rarity === 1 ? '#778899' : '#aabbcc';
      const role = char.role && ROLES[char.role] ? ROLES[char.role] : null;
      const roleHtml = role ? `<span class="role-badge" style="background:${role.color}">${role.icon}${role.label}</span>` : '';
      const passiveHtml = char.passive
        ? `<div class="swap-cand-passive">⚡${char.passive.name}<span class="swap-cand-passive-desc"> — ${char.passive.desc}</span></div>`
        : '';
      const skillsList = char.skillIds.map(id => {
        const s = SKILL_DATA[id];
        if (!s) return '';
        const isNoSP3 = !!(s.noSP || s.noPP);
        const spTxt3 = isNoSP3 ? '∞' : `SP${s.spCost ?? 5}`;
        const hasDmg = (s.power || 0) > 0;
        const singleLabel = isNoSP3 && hasDmg ? '通常攻撃' : hasDmg ? '単体攻撃'
          : (s.type === 'heal' || s.type === 'revive') ? '味方単体' : '敵単体';
        const tgtLabel = s.target === 'all'
          ? (hasDmg ? '全体攻撃' : '敵全体')
          : ({ single: singleLabel, self:'自分', all_ally:'味方全' }[s.target] || '');
        const effectLines = buildSkillEffectLines(s);
        const effectHtml = effectLines.map(l => `<span class="cand-skill-effect">${l}</span>`).join('');
        return `<div class="cand-skill-item">
          <div class="cand-skill-header">${s.icon} ${s.name} <span class="cand-skill-pp">${spTxt3}</span><span class="cand-skill-tgt">${tgtLabel}</span></div>
          ${effectHtml ? `<div class="cand-skill-effects">${effectHtml}</div>` : ''}
        </div>`;
      }).join('');
      return `
        <div class="swap-candidate-card" data-char-id="${char.id}">
          <div class="swap-cand-top">
            <span class="swap-cand-emoji">${char.emoji}</span>
            <div class="swap-cand-info">
              <div class="swap-cand-name">${char.name}</div>
              <div class="swap-cand-origin${char.origin && currentParty.some(p => p.origin === char.origin) ? ' same-series-glow' : ''}">${char.origin || ''}</div>
            </div>
          </div>
          <div class="swap-cand-badges">${roleHtml}<span class="swap-cand-rarity" style="color:${starColor}">${stars}</span></div>
          <div class="swap-cand-stats">HP ${Math.floor(char.maxHp * (char.role==='tank'?1.2:char.role==='striker'?0.9:char.role==='support'?0.9:1.0))}</div>
          ${passiveHtml}
          <div class="swap-cand-skills-toggle">${_swapSkillsOpen ? '▲ わざを閉じる' : '▼ わざを見る'}</div>
          <div class="swap-cand-skills" style="display:${_swapSkillsOpen ? 'block' : 'none'}">${skillsList}</div>
          <button class="swap-select-btn" data-char-id="${char.id}">この人を選ぶ</button>
        </div>`;
    }

    overlay.innerHTML = `
      <div class="swap-box swap-box-3">
        <div class="swap-title">${title}</div>
        <div class="swap-subtitle">3人の候補から1人を選んで仲間にしよう</div>
        <div class="swap-candidates">${candidates.map(c => buildCandidateCardHtml(c)).join('')}</div>
        <div class="swap-current-party">
          <div class="swap-current-label">── 現在のパーティ ──</div>
          <div class="swap-current-members">${currentParty.map(c => buildCurrentMemberHtml(c)).join('')}</div>
        </div>
        <button class="swap-cancel-btn" id="swap-cancel-btn">交代しない</button>
      </div>
    `;

    overlay.classList.add('active');

    // 候補カードを1枚ずつポップイン公開（レア度SE・★3は金フラッシュ）
    overlay.querySelectorAll('.swap-candidate-card').forEach((cardEl, i) => {
      cardEl.classList.add('cand-hidden');
      setTimeout(() => {
        cardEl.classList.remove('cand-hidden');
        cardEl.classList.add('cand-reveal');
        const rarity = (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[cardEl.dataset.charId]) || 2;
        if (rarity === 3) {
          Audio.SE.gachaFanfare();
          cardEl.classList.add('cand-flash-gold');
        } else if (rarity === 2) {
          Audio.SE.buff();
        } else {
          Audio.SE.cursor();
        }
      }, 350 + i * 450);
    });

    // Toggle skill list (候補メンバー欄)
    overlay.querySelectorAll('.swap-cand-skills-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const skillDiv = btn.nextElementSibling;
        if (skillDiv.style.display === 'none') {
          skillDiv.style.display = 'block';
          btn.textContent = '▲ わざを閉じる';
        } else {
          skillDiv.style.display = 'none';
          btn.textContent = '▼ わざを見る';
        }
      });
    });

    // Toggle skill list (既存パーティ欄)
    overlay.querySelectorAll('.swap-cm-skills-toggle').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const skillDiv = btn.nextElementSibling;
        if (skillDiv.style.display === 'none') {
          skillDiv.style.display = 'block';
          btn.textContent = '▲ わざを閉じる';
        } else {
          skillDiv.style.display = 'none';
          btn.textContent = '▶ わざを見る';
        }
      });
    });

    // パーティカードのクリックイベント（候補選択後に有効化）
    overlay.querySelectorAll('.swap-cm-card').forEach(card => {
      card.addEventListener('click', () => {
        if (!selectedCandidateId) return;
        Audio.SE.select();
        overlay.classList.remove('active');
        onChoose(selectedCandidateId, card.dataset.id);
      });
    });

    // 候補選択（「この人を選ぶ」）
    overlay.querySelectorAll('.swap-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.SE.select();
        selectedCandidateId = btn.dataset.charId;
        // 候補カードのハイライトを切り替え
        overlay.querySelectorAll('.swap-candidate-card').forEach(card => {
          card.classList.toggle('selected', card.dataset.charId === selectedCandidateId);
        });
        // パーティラベルを変更し、カードをクリック可能にする
        overlay.querySelector('.swap-current-label').textContent = '誰と交代する？（タップで選択）';
        overlay.querySelectorAll('.swap-cm-card').forEach(card => {
          card.classList.add('selectable');
        });
      });
    });

    document.getElementById('swap-cancel-btn').addEventListener('click', () => {
      Audio.SE.cursor();
      overlay.classList.remove('active');
      onChoose(null, null);
    });
  }

  // ---- ボス攻撃時わざ名ポップアップ ----
  function showEnemySkillName(charId, skillName) {
    const card = document.getElementById(`card-${charId}`);
    if (!card) return;
    const el = document.createElement('div');
    el.className = 'enemy-skill-popup';
    el.textContent = skillName;
    card.appendChild(el);
    requestAnimationFrame(() => el.classList.add('active'));
    setTimeout(() => { el.classList.remove('active'); setTimeout(() => el.remove(), 400); }, 1800);
  }

  // ---- WAVEバナー ----
  // トップバーと同じ「WAVE <セット>-<ウェーブ>」形式で表示する
  function showWaveBanner(setNum, pos, isBoss, isMidBoss) {
    const wave = `WAVE ${setNum}-${pos}`;
    const label = isBoss ? `${wave} ★ BOSS ★` : isMidBoss ? `${wave} ☆ 中ボス ☆` : wave;
    const cls = isBoss ? 'wave-boss' : isMidBoss ? 'wave-midboss' : 'wave-normal';
    const banner = document.createElement('div');
    banner.className = `wave-banner ${cls}`;
    banner.innerHTML = `<div class="wave-label">${label}</div>`;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('active'));
    setTimeout(() => { banner.classList.remove('active'); setTimeout(() => banner.remove(), 400); }, 1600);
  }

  // ---- スタン/麻痺 行動不能カードポップアップ ----
  // ---- 状態異常・バフデバフ付与時のポップアップ ----
  const STATUS_APPLIED_POPUP = {
    stun:     ['💫', '気絶'],
    paralyze: ['⚡', '麻痺'],
    burn:     ['🔥', '燃焼'],
    poison:   ['☠️', '毒'],
    freeze:   ['🧊', '凍結'],
    curse:    ['🖤', '呪い'],
    atk_down: ['⬇️', '攻撃DOWN'],
    def_down: ['⬇️', '防御DOWN'],
    atk_up:   ['⬆️', '攻撃UP'],
    def_up:   ['⬆️', '防御UP'],
    shield:   ['🛡️', 'シールド'],
    resist:   ['🚫', 'レジスト'],
    ace:      ['⭐', 'エース']
  };
  // キャラごとの表示キュー: 前のポップアップが消えてから次を出す（複数付与の重なり防止）
  const _statusPopupQueue = {};
  function showStatusApplied(charId, effect) {
    const info = STATUS_APPLIED_POPUP[effect];
    if (!info) return;
    const card = document.getElementById(`card-${charId}`);
    if (!card) return;
    const SHOW_MS = 900;   // 表示時間
    const STEP_MS = 1150;  // 次のポップアップまでの間隔（フェードアウト分含む）
    const spawn = () => {
      const el = document.createElement('div');
      el.className = 'status-skip-popup status-applied';
      el.innerHTML = `${info[0]} ${info[1]}！`;
      card.appendChild(el);
      requestAnimationFrame(() => el.classList.add('active'));
      setTimeout(() => { el.classList.remove('active'); setTimeout(() => el.remove(), 400); }, SHOW_MS);
    };
    const now = Date.now();
    const startAt = Math.max(now, _statusPopupQueue[charId] || 0);
    _statusPopupQueue[charId] = startAt + STEP_MS;
    if (startAt <= now) spawn();
    else setTimeout(spawn, startAt - now);
  }

  function showStatusSkip(charId, charName, status) {
    const card = document.getElementById(`card-${charId}`);
    if (!card) return;
    const icon = status === 'stun' ? '💫' : status === 'freeze' ? '🧊' : '⚡';
    const text = status === 'stun' ? '気絶！行動不能' : status === 'freeze' ? '氷結！動けない' : '麻痺！動けない';
    const el = document.createElement('div');
    el.className = 'status-skip-popup';
    el.innerHTML = `${icon} ${text}`;
    card.appendChild(el);
    requestAnimationFrame(() => el.classList.add('active'));
    setTimeout(() => { el.classList.remove('active'); setTimeout(() => el.remove(), 400); }, 1200);
  }

  // ---- わざセリフ（画面フロート表示・自動消滅）----
  function showSkillQuote(charId, quote) {
    const card = document.getElementById(`card-${charId}`);
    if (!card) return;
    const el = document.createElement('div');
    el.className = 'skill-quote-bubble';
    el.textContent = `「${quote}」`;
    const rect = card.getBoundingClientRect();
    el.style.left = Math.max(4, rect.left - 20) + 'px';
    el.style.top  = (rect.top + window.scrollY - 10) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ---- キャラ参入セリフポップアップ ----
  function showJoinOverlay(char, quote, onDone) {
    const el = document.createElement('div');
    el.className = 'join-overlay active';
    el.innerHTML = `
      <div class="join-box">
        <div class="join-header">✨ 仲間に加わった！</div>
        <div class="join-emoji">${char.emoji}</div>
        <div class="join-name">${char.name}</div>
        ${quote ? `<div class="join-quote">「${quote}」</div>` : ''}
        <button class="join-ok-btn">OK</button>
      </div>`;
    document.body.appendChild(el);

    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      el.classList.remove('active');
      setTimeout(() => { el.remove(); onDone(); }, 300);
    };
    el.querySelector('.join-ok-btn').addEventListener('click', cleanup);
    setTimeout(cleanup, 5000); // 5秒で自動閉じ
  }

  // ---- ゲーム開始時のガチャ風パーティ公開（裏向き3枚をタップでめくる）----
  function showGachaOverlay(party, onDone) {
    const overlay = document.createElement('div');
    overlay.className = 'gacha-overlay';

    const cardsHtml = party.map((char, i) => {
      const rarity = (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[char.id]) || 2;
      const stars = '★'.repeat(rarity);
      const starColor = rarity === 3 ? '#ffcc44' : rarity === 1 ? '#778899' : '#aabbcc';
      const role = char.role && ROLES[char.role] ? ROLES[char.role] : null;
      const roleHtml = role ? `<span class="role-badge" style="background:${role.color}">${role.icon}${role.label}</span>` : '';
      return `
        <div class="gacha-card" data-index="${i}" data-rarity="${rarity}" data-char-id="${char.id}">
          <div class="gacha-card-inner">
            <div class="gacha-card-back gacha-aura-${rarity}"><span class="gacha-q">?</span></div>
            <div class="gacha-card-front" style="--char-color:${char.color || '#888'}">
              <div class="gacha-stars" style="color:${starColor}">${stars}</div>
              <div class="gacha-emoji">${char.emoji}</div>
              <div class="gacha-name">${char.name}</div>
              <div class="gacha-origin">${char.origin || ''}</div>
              ${roleHtml}
            </div>
          </div>
        </div>`;
    }).join('');

    overlay.innerHTML = `
      <div class="gacha-title">✨ 仲間がやってくる！ ✨</div>
      <div class="gacha-cards">${cardsHtml}</div>
      <div class="gacha-hint">カードをタップしてめくろう</div>
      <button class="btn-primary gacha-start-btn" style="visibility:hidden">⚔️ 出撃！</button>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    let flipped = 0;
    overlay.querySelectorAll('.gacha-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        if (cardEl.classList.contains('flipped')) return;
        cardEl.classList.add('flipped');
        const rarity = Number(cardEl.dataset.rarity);
        if (rarity === 3) {
          Audio.SE.gachaFanfare();
          cardEl.classList.add('gacha-flash-gold');
        } else if (rarity === 2) {
          Audio.SE.buff();
        } else {
          Audio.SE.select();
        }
        const charId = cardEl.dataset.charId;
        const quote = (typeof JOIN_QUOTES !== 'undefined' && JOIN_QUOTES[charId]) || '';
        if (quote) {
          const rect = cardEl.getBoundingClientRect();
          const el = document.createElement('div');
          el.className = 'gacha-quote-float';
          el.textContent = `「${quote}」`;
          el.style.left = (rect.left + rect.width / 2) + 'px';
          el.style.top  = (rect.top + window.scrollY) + 'px';
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 3500);
        }
        flipped++;
        if (flipped === party.length) {
          const btn = overlay.querySelector('.gacha-start-btn');
          btn.style.visibility = 'visible';
          overlay.querySelector('.gacha-hint').textContent = 'この3人で行こう！';
        }
      });
    });

    overlay.querySelector('.gacha-start-btn').addEventListener('click', () => {
      Audio.SE.select();
      overlay.classList.remove('active');
      setTimeout(() => { overlay.remove(); onDone(); }, 300);
    });
  }

  return {
    showScreen, setBattleNum,
    setSeriesBonuses(bonuses) { _activeBonusOrigins = new Set((bonuses || []).map(b => b.origin)); },
    renderEnemyArea, renderAllyArea, updateCharBars, updateEnemyNextAction,
    collapseEnemyCard,
    setActiveActor,
    makeAllyCardsSelectable, clearAllyCardSelection, showInitiativeBanner, showTurnChangeBanner,
    renderCharacterSelect, showPlayerTurnMsg, showEnemyTurnStartMsg,
    renderSkillButtons, hideSkillPanel, showEnemyTurnMsg,
    // 図鑑の詳細モーダルが同じ効果表示を出すために使う。
    // 同じ組み立てを main.js 側に書き直すと、効果を足したときに片方だけ古くなる
    buildSkillEffectLines, buildTargetLabel,
    renderInfoSidebar, heldRelicsHtml, updateNextTurn,
    log, clearLog,
    floatNumber, queueFloat, flashCard, flashPassive, flashRole, screenShake,
    playSkillAnimation, playMultiHitAnimation,
    showBattleResult, showBossIntro,
    promptAoeConfirm, promptTargetSelect, promptAllyTargetSelect, promptDeadAllySelect, clearTargetSelect, setSkillBtnPending,
    showSwapOverlay, showJoinOverlay, showGachaOverlay, showSkillQuote,
    showEnemySkillName, showWaveBanner, showStatusSkip, showStatusApplied,
    updateLethalWarning,
    updatePartySP,
    setAllyReorderCallback
  };
})();
