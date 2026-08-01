// ============================================================
// MAIN GAME CONTROLLER v6
// - 6 battles per loop (1-2 normal, 3 = mid-boss, 4-5 normal, 6 = boss)
// - After normal battle: HP 25% × supporter count heal, no swap, no PP restore
// - After mid-boss battle: status clear only, relic drop
// - After boss battle: full restore + swap event (3 candidates), loopCount++
// - Enemies scale with loopCount (×1.3 per loop, compounding)
// - Side-turn system: player acts with all allies in any order → enemy turn → repeat
// - Initiative: player first 70%, enemy first 30% (guaranteed_initiative relic: always player first)
// - No critical hits
// ============================================================
const Game = (() => {
  const BATTLES_PER_LOOP = 3;
  const MID_BOSS_POS = 3;

  let currentBattle = 0;
  let loopCount     = 0;
  let activeAllies  = [];
  let _runParticipants = new Set();
  let currentActor  = null;
  let isBusy        = false;

  // ---- バトル用状態 ----
  let currentTurnNum = 0;
  let currentTurnDamage = 0;
  let isPlayerTurn = false;

  // ---- ゲームステート（レリック等永続状態） ----
  let gameState = { relics: [], _reviveUsed: {}, _surviveUsed: false, _guaranteedInitiative: false };
  window.gameState = gameState;

  let disabledOrigins = new Set(JSON.parse(localStorage.getItem('icb_disabledOrigins') || '[]'));
  function saveDisabledOrigins() {
    localStorage.setItem('icb_disabledOrigins', JSON.stringify([...disabledOrigins]));
  }
  function getEnabledCharPool() {
    return ALLY_DATA.filter(d => !disabledOrigins.has(d.origin || 'その他'));
  }

  let seriesBonusEnabled = JSON.parse(localStorage.getItem('icb_seriesBonus') ?? 'true');
  function saveSeriesBonusEnabled() {
    localStorage.setItem('icb_seriesBonus', JSON.stringify(seriesBonusEnabled));
  }

  let autoSelectNormalAtk = JSON.parse(localStorage.getItem('icb_autoSelectAtk') ?? 'false');
  function saveAutoSelectNormalAtk() {
    localStorage.setItem('icb_autoSelectAtk', JSON.stringify(autoSelectNormalAtk));
  }

  // カードの作品名・レア度・性別/職業の表示可否。
  // body のクラスで CSS 側を切り替えるので、描画済みのカードにも即座に反映される
  let showCardInfo = JSON.parse(localStorage.getItem('icb_showCardInfo') ?? 'true');
  function saveShowCardInfo() {
    localStorage.setItem('icb_showCardInfo', JSON.stringify(showCardInfo));
  }
  function applyShowCardInfo() {
    document.body.classList.toggle('hide-card-info', !showCardInfo);
  }

  // スキルパネル上の「〇〇のターン！」見出しの表示可否
  let showTurnHeader = JSON.parse(localStorage.getItem('icb_showTurnHeader') ?? 'true');
  function saveShowTurnHeader() {
    localStorage.setItem('icb_showTurnHeader', JSON.stringify(showTurnHeader));
  }
  function applyShowTurnHeader() {
    document.body.classList.toggle('hide-turn-header', !showTurnHeader);
  }

  // パッシブ名の表示可否。味方・敵の両方が対象（説明文は残す）
  let showPassiveName = JSON.parse(localStorage.getItem('icb_showPassiveName') ?? 'true');
  function saveShowPassiveName() {
    localStorage.setItem('icb_showPassiveName', JSON.stringify(showPassiveName));
  }
  function applyShowPassiveName() {
    document.body.classList.toggle('hide-passive-name', !showPassiveName);
  }

  // ロールを名前行と合体表示するか。味方・敵の両方が対象
  let mergeRoleName = JSON.parse(localStorage.getItem('icb_mergeRoleName') ?? 'true');
  function saveMergeRoleName() {
    localStorage.setItem('icb_mergeRoleName', JSON.stringify(mergeRoleName));
  }
  function applyMergeRoleName() {
    document.body.classList.toggle('merge-role-name', mergeRoleName);
  }

  // 省電力モード。装飾目的の光る無限アニメを一括で止める
  let lowPower = JSON.parse(localStorage.getItem('icb_lowPower') ?? 'false');
  function saveLowPower() {
    localStorage.setItem('icb_lowPower', JSON.stringify(lowPower));
  }
  function applyLowPower() {
    document.body.classList.toggle('low-power', lowPower);
  }

  function battlesThisLoop()  { return BATTLES_PER_LOOP; }
  function posInLoop()        { return ((currentBattle - 1) % BATTLES_PER_LOOP) + 1; }
  function isBossBattle()     { return loopCount === 1 && posInLoop() === BATTLES_PER_LOOP; }
  function isMidBossBattle()  { return loopCount === 0 && posInLoop() === BATTLES_PER_LOOP; }
  function isFinalBattle()    { return loopCount === 2 && posInLoop() === BATTLES_PER_LOOP; }

  // モーダルは「ボタン以外どこを押しても閉じる」。
  // スマホでは箱が画面いっぱいになり、背景の余白をタップしづらいため
  // （設定のトグル・ガイドのタブ・✕はボタンなので誤爆しない）
  function wireModalDismiss(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      modal.style.display = 'none';
    });
  }

  function init() {
    initDeviceDefaults();   // 保存値が無ければ端末に応じた既定を決める
    applyShowCardInfo();
    applyShowTurnHeader();
    applyShowPassiveName();
    applyMergeRoleName();
    applyLowPower();
    document.getElementById('start-btn').addEventListener('click', () => {
      try { Audio.SE.battleStart(); } catch(e) {}
      startGame();
    });
    // BGM/SE の切り替えは設定モーダル（トップバーの⚙️）へ集約した
    // 図鑑・実績ボタン
    const colBtn = document.getElementById('collection-btn');
    if (colBtn) colBtn.addEventListener('click', () => { Audio.SE.cursor(); showCollectionScreen('chars'); });
    // 登場作品ボタン
    document.getElementById('origins-btn')?.addEventListener('click', () => { Audio.SE.cursor(); showOriginsScreen(); });
    document.getElementById('origins-back-btn')?.addEventListener('click', () => { Audio.SE.cursor(); goTitleScreen(); });
    // 設定ボタン
    document.getElementById('settings-btn')?.addEventListener('click', () => { Audio.SE.cursor(); showSettingsScreen(); });
    document.getElementById('settings-back-btn')?.addEventListener('click', () => { Audio.SE.cursor(); goTitleScreen(); });
    // 戦闘中の設定モーダル（トップバーの⚙️）
    document.getElementById('settings-modal-btn')?.addEventListener('click', () => {
      Audio.SE.cursor();
      renderSettingsModal();
      document.getElementById('settings-modal').style.display = 'flex';
    });
    document.getElementById('settings-modal-close')?.addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'none';
    });
    wireModalDismiss('settings-modal');
    // 戦闘中のレリックモーダル（トップバーの💎）
    document.getElementById('relic-modal-btn')?.addEventListener('click', () => {
      Audio.SE.cursor();
      const body = document.getElementById('relic-modal-body');
      const title = document.getElementById('relic-modal-title');
      const held = (typeof Relics !== 'undefined') ? Relics.getHeld() : [];
      const list = UI.heldRelicsHtml();
      if (title) title.textContent = `💎 所持レリック（${held.length}個）`;
      if (body) body.innerHTML = list || '<div class="sys-desc">まだレリックを持っていません。戦闘に勝つと入手できます。</div>';
      document.getElementById('relic-modal').style.display = 'flex';
    });
    document.getElementById('relic-modal-close')?.addEventListener('click', () => {
      document.getElementById('relic-modal').style.display = 'none';
    });
    wireModalDismiss('relic-modal');
    // 戦闘中のシステムガイド（トップバーの📖）。タイトル画面と同じモーダルを開く
    document.getElementById('guide-modal-btn')?.addEventListener('click', () => {
      Audio.SE.cursor();
      document.getElementById('system-modal').style.display = 'flex';
    });
    // システムガイドモーダル
    document.getElementById('system-btn')?.addEventListener('click', () => {
      Audio.SE.cursor();
      document.getElementById('system-modal').style.display = 'flex';
    });
    document.getElementById('system-modal-close')?.addEventListener('click', () => {
      document.getElementById('system-modal').style.display = 'none';
    });
    wireModalDismiss('system-modal');
    document.querySelectorAll('.sys-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sys-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.sys-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`sys-tab-${tab.dataset.tab}`).classList.add('active');
      });
    });
    const colBack = document.getElementById('collection-back-btn');
    if (colBack) colBack.addEventListener('click', () => { Audio.SE.cursor(); goTitleScreen(); });
    // 図鑑・実績の進捗リセット
    const colReset = document.getElementById('collection-reset-btn');
    if (colReset) colReset.addEventListener('click', () => {
      if (!confirm('実績と図鑑の進捗をすべてリセットします。よろしいですか？')) return;
      if (typeof ACH !== 'undefined') ACH.resetAll();
      const activeTab = document.querySelector('.tab-btn.active');
      showCollectionScreen(activeTab ? activeTab.dataset.tab : 'chars');
    });
    // タブ切り替え
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.SE.cursor();
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showCollectionScreen(btn.dataset.tab);
      });
    });
    // モバイル: ログトグルボタン
    // 情報サイドバーの中身は 📖ガイド と 💎レリック に移したのでトグルは廃止。
    // #info-sidebar 自体はPCの右カラムとして引き続き使う
    const logToggleBtn = document.getElementById('log-toggle-btn');
    const battleLog    = document.getElementById('battle-log');
    if (logToggleBtn && battleLog) {
      logToggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        const opening = !battleLog.classList.contains('log-visible');
        // #battle-log は <details id="log-box"> の中にある。PC側でたたんだまま
        // モバイル幅に来ると閉じた details の非表示制御に巻き込まれるので、
        // 全画面オーバーレイを開くときは必ず開いた状態にしておく
        if (opening) document.getElementById('log-box')?.setAttribute('open', '');
        battleLog.classList.toggle('log-visible', opening);
        logToggleBtn.classList.toggle('active', opening);
      });
      // モーダル類と同様、ボタン以外どこを押しても閉じる
      battleLog.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        battleLog.classList.remove('log-visible');
        logToggleBtn.classList.remove('active');
      });
    }
    initTitleAmbience();
  }

  // ---- タイトル画面演出（ランダムアイコン＋浮かぶセリフ）----
  function refreshTitleChars() {
    const el = document.querySelector('#title-screen .title-chars');
    if (!el) return;
    el.textContent = [...ALLY_DATA].sort(() => Math.random() - 0.5).slice(0, 16).map(a => a.emoji).join('');
  }

  // タイトルへ戻る。演出タイマーは離脱時に止めているのでここで再開する
  function goTitleScreen() {
    UI.showScreen('title-screen');
    initTitleAmbience();
  }

  let _titleAmbienceTimer = null;
  function initTitleAmbience() {
    refreshTitleChars();
    // セリフプール（登場時＋スキル時）
    const pool = [...Object.values(JOIN_QUOTES), ...Object.values(SKILL_QUOTES)].filter(Boolean);
    let wasActive = true; // 初期化時に並べ済み（初回tickでの再並び替えを防ぐ）
    // タイトル以外の画面では止める。以前は解除されず戦闘中も2.2秒ごとに起床していた
    if (_titleAmbienceTimer) clearInterval(_titleAmbienceTimer);
    _titleAmbienceTimer = setInterval(() => {
      const screen = document.getElementById('title-screen');
      const active = screen && screen.classList.contains('active');
      if (!active) {
        // タイトルを離れたらタイマーごと停止（戻ってきたら showScreen 側で再開）
        clearInterval(_titleAmbienceTimer);
        _titleAmbienceTimer = null;
        wasActive = false;
        return;
      }
      if (!wasActive) refreshTitleChars(); // タイトルに戻るたび並び替え
      wasActive = active;
      if (pool.length === 0) return;
      const q = pool[Math.floor(Math.random() * pool.length)];
      const el = document.createElement('div');
      el.className = 'title-quote';
      el.textContent = `「${q}」`;
      el.style.left = (10 + Math.random() * 80) + '%';
      el.style.top  = (15 + Math.random() * 65) + '%';
      screen.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, 2200);
  }

  // ---- SP initialization ----
  function getPassiveSpBonus() {
    return (activeAllies || []).filter(a => a.passive?.type === 'sp_max_up')
      .reduce((sum, a) => sum + (a.passive.value || 1), 0);
  }

  function updateSpForPartyChange() {
    const relicBonus = (typeof Relics !== 'undefined') ? Relics.getSpMaxBonus() : 0;
    const newMax = 5 + relicBonus + getPassiveSpBonus();
    const diff = newMax - (gameState.maxSp ?? 5);
    gameState.maxSp = newMax;
    gameState.sp = Math.max(0, Math.min(newMax, (gameState.sp ?? 0) + diff));
    if (typeof UI !== 'undefined') UI.updatePartySP();
  }

  function initSp() {
    const bonus = (typeof Relics !== 'undefined') ? Relics.getSpMaxBonus() : 0;
    return 5 + bonus + getPassiveSpBonus();
  }

  function restoreSp() {
    const bonus = (typeof Relics !== 'undefined') ? Relics.getSpMaxBonus() : 0;
    gameState.maxSp = 5 + bonus + getPassiveSpBonus();
    gameState.sp = 3;
    if (typeof UI !== 'undefined') UI.updatePartySP();
  }

  function applyRelicPickupEffect(relicId) {
    const relic = RELIC_DATA.find(r => r.id === relicId);
    if (!relic) return;
    const ef = relic.effect;
    if (ef.type !== 'sp_max_up' && ef.type !== 'pp_max_up') return;
    const bonus = ef.value || 1;
    gameState.maxSp = (gameState.maxSp ?? 5) + bonus;
    gameState.sp = Math.min((gameState.sp ?? 5) + bonus, gameState.maxSp);
    UI.updatePartySP();
  }

  // ---- Weighted candidate picker for swap events ----
  function pickWeightedCandidates(pool, n, weights) {
    const result = [];
    const remaining = [...pool];
    while (result.length < n && remaining.length > 0) {
      const total = remaining.reduce((s, c) => s + (weights[c.id] || 1), 0);
      let r = Math.random() * total;
      let idx = remaining.length - 1;
      for (let i = 0; i < remaining.length; i++) {
        r -= (weights[remaining[i].id] || 1);
        if (r <= 0) { idx = i; break; }
      }
      result.push(remaining.splice(idx, 1)[0]);
    }
    return result;
  }

  function makeTierWeights(mode) {
    const allRarities = typeof CHAR_RARITY !== 'undefined' ? Object.values(CHAR_RARITY) : [];
    const r3count   = allRarities.filter(r => r === 3).length || 1;
    const nonR3count = allRarities.filter(r => r !== 3).length || 1;
    let r3ratio, nonR3ratio;
    if (mode === 'boss')        { r3ratio = 3; nonR3ratio = 7; }
    else if (mode === 'midboss'){ r3ratio = 1; nonR3ratio = 4; }
    else                        { r3ratio = 1; nonR3ratio = 9; }
    const w3    = r3ratio    * nonR3count;
    const wNon3 = nonR3ratio * r3count;
    const weights = {};
    if (typeof CHAR_RARITY !== 'undefined') {
      Object.entries(CHAR_RARITY).forEach(([id, rarity]) => {
        weights[id] = rarity === 3 ? w3 : wNon3;
      });
    }
    return weights;
  }

  // ---- Pick 3 random allies (weighted by rarity) ----
  function pickRandomParty() {
    const pool = getEnabledCharPool();
    const picked = pickWeightedCandidates(pool, 3, makeTierWeights('initial'));
    return picked.map(data => makeCombatant(data));
  }

  function makeCombatant(data) {
    // Tier（★レア度）によるHP・威力補正は廃止。atkMult はパッシブATKブーストの保持のみに使う
    let atkMult = 1.0;
    const role = data.role || 'attacker';
    const roleHpBonus = role === 'tank' ? 1.2 : role === 'striker' ? 0.9 : role === 'support' ? 0.9 : 1.0;
    // パッシブ静的効果適用
    const p = data.passive;
    if (p?.type === 'atk_boost')  atkMult *= (1 + p.value);
    if (p?.type === 'atk_hp_drain') atkMult *= (1 + p.value.atk);
    let passiveDefMult = p?.type === 'def_boost' ? (1 - p.value) : 1.0;
    if (p?.type === 'compound') {
      p.effects?.forEach(eff => {
        if (eff.type === 'atk_boost') atkMult *= (1 + eff.value);
        if (eff.type === 'def_boost') passiveDefMult *= (1 - eff.value);
      });
    }
    const relicHpMult = (typeof Relics !== 'undefined') ? Relics.getHpBoostMultiplier() : 1.0;
    const baseMaxHp = Math.floor(data.maxHp * roleHpBonus);
    const adjHp = Math.floor(baseMaxHp * relicHpMult);
    return {
      ...data,
      hp: adjHp,
      maxHp: adjHp,
      baseMaxHp,
      atkMult,
      passiveDefMult,
      isEnemy: false,
      isBoss: false,
      statusEffects: [],
      statMods: { atk: 1, defMult: 1 },
      hasBarrier: false,
      isGuarding: false,
      isDefeated: false,
      actedThisTurn: false,
    };
  }

  // ---- Game Start ----
  function startGame() {
    gameState.relics = [];
    gameState._reviveUsed = {};
    gameState._surviveUsed = false;
    gameState._guaranteedInitiative = false;
    gameState._atkRampStacks = 0;
    gameState._teamRegenRelicUsed = false;
    gameState._lastSpFree = false;
    activeAllies  = pickRandomParty();
    _runParticipants = new Set(activeAllies.map(a => a.id));
    gameState.maxSp = initSp();
    gameState.sp = 3;
    window.gameState = gameState;
    currentBattle = 0;
    loopCount     = 0;
    // ガチャ風のパーティ公開演出を挟んでから戦闘開始
    UI.showGachaOverlay(activeAllies, () => nextBattle());
  }

  // ---- Battle Progression ----
  function nextBattle() {
    currentBattle++;
    const boss = isBossBattle();

    // Between-battle recovery (based on what PREVIOUS battle was)
    if (currentBattle > 1) {
      const prevPos = ((currentBattle - 2) % BATTLES_PER_LOOP) + 1;
      const prevWasBoss    = prevPos === BATTLES_PER_LOOP;
      const prevWasMidBoss = prevPos === MID_BOSS_POS;
      if (prevWasMidBoss) {
        // 中ボス後：handleBattleEnd内で全回復済み
      } else if (!prevWasBoss) {
        // 雑魚後：ステータスリセット
        activeAllies.forEach(a => {
          if (!a.isDefeated) {
            a.statusEffects = [];
            a.statMods = { atk: 1, defMult: 1 };
            a.hasBarrier = false;
            a.shieldHp = 0;
            a.isGuarding = false;
            a._ppRegenCounter = 0;
            a._awakened = false;
            a._gutsUsed = false;
          }
        });
      }
    }

    const enemies = pickEnemies();

    const startFight = () => {
      UI.showScreen('battle-screen');
      UI.setBattleNum(currentBattle, battlesThisLoop(), loopCount, isMidBossBattle(), isFinalBattle());
      UI.clearLog();
      UI.renderEnemyArea(enemies);
      UI.renderAllyArea(activeAllies);
      UI.setAllyReorderCallback((srcId, dstId) => {
        const si = activeAllies.findIndex(a => a.id === srcId);
        const di = activeAllies.findIndex(a => a.id === dstId);
        if (si !== -1 && di !== -1) [activeAllies[si], activeAllies[di]] = [activeAllies[di], activeAllies[si]];
      });
      activeAllies.forEach(a => UI.updateCharBars(a));
      enemies.forEach(e => UI.updateCharBars(e));

      Audio.stopBGM();
      if (isFinalBattle())                Audio.startBGM('final');
      else if (boss || isMidBossBattle()) Audio.startBGM('boss');
      else if (loopCount === 2)           Audio.startBGM('third');
      else                                Audio.startBGM('normal');

      // レリック戦闘開始効果（HP回復・バリア等）
      gameState._reviveUsed = {};
      gameState._surviveUsed = false;
      gameState._atkRampStacks = 0;
      gameState._teamRegenRelicUsed = false;
      gameState.sp = 3;
      UI.updatePartySP();
      if (typeof Relics !== 'undefined') Relics.applyBattleStart(activeAllies.filter(a => !a.isDefeated));
      const battleState = Battle.initBattle({ allies: activeAllies, enemies, battleNum: currentBattle });
      if (typeof Relics !== 'undefined') Relics.applyBattleStartPost(enemies);
      if (!seriesBonusEnabled) {
        activeAllies.forEach(a => { a.seriesAtkBonus = 1.0; a.seriesDefBonus = 1.0; });
      }
      UI.setSeriesBonuses(seriesBonusEnabled ? battleState.seriesBonuses : []);
      UI.renderAllyArea(activeAllies);
      activeAllies.forEach(a => UI.updateCharBars(a));

      const partyNames = activeAllies.map(a => `${a.emoji}${a.name}`).join('、');
      const battleLabel = isFinalBattle() ? ' 🔥 最終決戦 🔥' : boss ? ' ★ BOSS ★' : isMidBossBattle() ? ' ☆ 中ボス ☆' : '';
      UI.log(`⚔️ <strong>WAVE ${loopCount + 1}-${posInLoop()}</strong>${battleLabel} 開始！`, 'log-system');
      UI.log(`🧑‍🤝‍🧑 パーティ：${partyNames}`, 'log-system');
      // シリーズボーナス表示
      if (seriesBonusEnabled && battleState.seriesBonuses && battleState.seriesBonuses.length > 0) {
        battleState.seriesBonuses.forEach(({ origin, cnt }) => {
          const bonusTxt = cnt >= 3 ? '攻撃+35%・被ダメ-25%' : '攻撃+20%・被ダメ-15%';
          UI.log(`⭐ <strong>シリーズボーナス</strong>：${origin}（${cnt}人） → ${bonusTxt}`, 'log-system');
        });
      }
      isBusy = false;
      currentTurnNum = 0;
      UI.hideSkillPanel();

      // WAVEバナーを先に表示し、バナーが消えてからパッシブ演出を開始
      UI.showWaveBanner(loopCount + 1, posInLoop(), !!boss, isMidBossBattle());
      setTimeout(() => {
        // パッシブ戦闘開始演出
        const floatQueue = [];
        activeAllies.forEach(ally => {
          const p = ally.passive;
          if (!p) return;
          if (p.type === 'battle_start_atk') {
            UI.log(`⚡ <strong>${ally.name}</strong> の闘志が燃え上がった！攻撃力UP！`, 'log-status');
            floatQueue.push([ally.id, '⬆️攻', 'float-buff float-from-bottom']);
          }
          if (p.type === 'battle_start_buffs') {
            const labels = { atk_up:['⬆️攻','float-buff float-from-bottom'], def_up:['⬆️防御力','float-buff'], atk_down:['⬇️攻','float-debuff float-down'], def_down:['⬇️防御力','float-debuff'], regen:['💚リジェネ','float-heal'] };
            UI.log(`⚡ <strong>${ally.name}</strong> の「${p.name}」が発動！`, 'log-status');
            (p.buffs || []).forEach(b => { const l = labels[b]; if (l) floatQueue.push([ally.id, l[0], l[1]]); });
          }
          if (p.type === 'battle_start_barrier') {
            UI.log(`🛡️ <strong>${ally.name}</strong> はバリアを展開！`, 'log-status');
            floatQueue.push([ally.id, '♾️バリア', 'float-shield']);
          }
          if (p.type === 'shield_start') {
            UI.log(`🛡️ <strong>${ally.name}</strong> はシールドを展開！`, 'log-status');
            floatQueue.push([ally.id, '🛡️シールド', 'float-shield']);
          }
          if (p.type === 'battle_start_team_atk') {
            UI.log(`⚡ <strong>${ally.name}</strong> の鼓舞でチーム全体に攻撃力UP！`, 'log-status');
            activeAllies.forEach(a => floatQueue.push([a.id, '⬆️攻', 'float-buff float-from-bottom']));
          }
          if (p.type === 'battle_start_team_barrier') {
            UI.log(`🛡️ <strong>${ally.name}</strong> の加護でチーム全体にバリア！`, 'log-status');
            activeAllies.forEach(a => floatQueue.push([a.id, '♾️バリア', 'float-shield']));
          }
          if (p.type === 'enemy_debuff_start') {
            const isDefDown = p.debuff === 'def_down';
            UI.log(`👁️ <strong>${ally.name}</strong>（写輪眼）：敵全体に${isDefDown ? '防御力' : '攻撃力'}DOWN！`, 'log-status');
            const floatLabel = isDefDown ? '⬇️防' : '⬇️攻';
            enemies.forEach(e => floatQueue.push([e.id, floatLabel, 'float-debuff float-down']));
          }
          if (p.type === 'battle_start_team_def') {
            UI.log(`🛡️ <strong>${ally.name}</strong> の守護でチーム全体に防御力UP！`, 'log-status');
            activeAllies.forEach(a => floatQueue.push([a.id, '⬆️防御力', 'float-buff']));
          }
          if (p.type === 'battle_start_team_shield') {
            UI.log(`🛡️ <strong>${ally.name}</strong> の「${p.name}」：味方全員にシールド付与！`, 'log-status');
            activeAllies.forEach(a => floatQueue.push([a.id, '🛡️シールド', 'float-buff']));
          }
          if (p.type === 'battle_start_sp') {
            gameState.sp = Math.min(gameState.maxSp ?? 5, (gameState.sp ?? 0) + 1);
            UI.log(`🔋 <strong>${ally.name}</strong> の「${p.name}」：戦闘開始時SP+1！`, 'log-status');
            floatQueue.push([ally.id, '🔋SP+1', 'float-buff']);
          }
          if (p.type === 'compound') {
            UI.log(`⚡ <strong>${ally.name}</strong> の「${p.name}」が発動！`, 'log-status');
          }
        });
        // 敵の開幕パッシブ演出（バリア・ATK UP）
        enemies.forEach(e => {
          const p = e.passive;
          if (!p) return;
          const fx = p.type === 'compound' ? (p.effects || []) : [p];
          if (fx.some(x => x.type === 'battle_start_barrier')) {
            UI.log(`♾️ <strong>${e.name}</strong> の「${p.name}」！バリアを展開！`, 'log-enemy');
            floatQueue.push([e.id, '♾️バリア', 'float-shield']);
          }
          if (fx.some(x => x.type === 'shield_start')) {
            UI.log(`🛡️ <strong>${e.name}</strong> の「${p.name}」！シールドを展開！`, 'log-enemy');
            floatQueue.push([e.id, '🛡️シールド', 'float-shield']);
          }
          if (fx.some(x => x.type === 'battle_start_atk')) {
            UI.log(`⚡ <strong>${e.name}</strong> の「${p.name}」！攻撃力UP！`, 'log-enemy');
            floatQueue.push([e.id, '⬆️攻', 'float-buff float-from-bottom']);
          }
          if (fx.some(x => x.type === 'battle_start_def')) {
            UI.log(`🛡️ <strong>${e.name}</strong> の「${p.name}」！防御力UP！`, 'log-enemy');
            floatQueue.push([e.id, '⬆️防御力', 'float-buff']);
          }
          if (fx.some(x => x.type === 'enemy_debuff_start')) {
            UI.log(`😨 <strong>${e.name}</strong> の「${p.name}」！味方全体に攻撃力DOWN！`, 'log-enemy');
            activeAllies.forEach(a => floatQueue.push([a.id, '⬇️攻', 'float-debuff float-down']));
          }
        });
        const flashedIds = new Set();
        floatQueue.forEach(([id, text, cls]) => {
          UI.queueFloat(id, text, cls);
          if (!flashedIds.has(id)) { UI.flashPassive(id, 'passive-flash'); flashedIds.add(id); }
        });
        UI.updatePartySP();

        // パッシブ・レリック効果適用後にステータスアイコンを更新
        activeAllies.forEach(a => UI.updateCharBars(a));
        enemies.forEach(e => UI.updateCharBars(e));
        // 初手チャージは禁止（奇襲と重なると理不尽なため allowCharge=false）
        enemies.forEach(e => { const sk = Battle.planNextAction(e, false); UI.updateEnemyNextAction(e, sk, Battle.getLivingAllies()); });
        UI.updateLethalWarning();
        updateAceStatus();
        UI.updateNextTurn([]);
        UI.renderInfoSidebar(boss, seriesBonusEnabled ? (battleState.seriesBonuses || []) : [], isMidBossBattle(), activeAllies);

        const passiveDelay = floatQueue.length > 0 ? 800 : 0;
        setTimeout(() => { startPlayerTurn(); }, passiveDelay);
      }, 1700);
    };

    if (boss || isMidBossBattle() || isFinalBattle()) {
      UI.showScreen('battle-screen');
      UI.setBattleNum(currentBattle, battlesThisLoop(), loopCount, isMidBossBattle(), isFinalBattle());
      UI.renderEnemyArea(enemies);
      UI.renderAllyArea(activeAllies);
      UI.showBossIntro(enemies[1], startFight);
    } else {
      startFight();
    }
  }

  function pickEnemies() {
    if (isFinalBattle()) {
      const bossData = BOSS_DATA[Math.floor(Math.random() * BOSS_DATA.length)];
      const mbPool = (typeof MIDBOSS_DATA !== 'undefined') ? MIDBOSS_DATA : BOSS_DATA;
      const shuffledMb = [...mbPool].sort(() => Math.random() - 0.5);
      // 左=中ボス、中央=大ボス、右=中ボス
      return [makeEnemy(shuffledMb[0]), makeEnemy(bossData), makeEnemy(shuffledMb[1] || shuffledMb[0])];
    }
    if (isBossBattle()) {
      const boss = BOSS_DATA[Math.floor(Math.random() * BOSS_DATA.length)];
      const attackerPool = ENEMY_DATA.filter(e => e.role !== 'support');
      const flankData = attackerPool[Math.floor(Math.random() * attackerPool.length)];
      const ts = Date.now() % 100000;
      return [
        makeEnemy({ ...flankData, id: `${flankData.id}_fl${ts}` }),
        makeEnemy(boss),
        makeEnemy({ ...flankData, id: `${flankData.id}_fr${ts}` })
      ];
    }
    if (isMidBossBattle()) {
      const pool = (typeof MIDBOSS_DATA !== 'undefined') ? MIDBOSS_DATA : BOSS_DATA;
      const mb = pool[Math.floor(Math.random() * pool.length)];
      const attackerPool = ENEMY_DATA.filter(e => e.role !== 'support');
      const flankData = attackerPool[Math.floor(Math.random() * attackerPool.length)];
      const ts = Date.now() % 100000;
      return [
        makeEnemy({ ...flankData, id: `${flankData.id}_fl${ts}` }),
        makeEnemy(mb),
        makeEnemy({ ...flankData, id: `${flankData.id}_fr${ts}` })
      ];
    }
    // スマホの画面幅に収めるため敵は常に最大3体。セットが進むほど数が増える
    // WAVE 1-1/1-2 → 1〜2体、2-1/2-2 → 2〜3体、3-1/3-2 → 3体
    // （各セットの3戦目は中ボス/ボス/最終で上の分岐が処理済み。いずれも3体固定）
    const count = loopCount >= 2
      ? 3
      : loopCount === 1
        ? (Math.random() < 0.5 ? 2 : 3)
        : (Math.random() < 0.5 ? 1 : 2);
    const shuffled = [...ENEMY_DATA].sort(() => Math.random() - 0.5);
    let picked = shuffled.slice(0, count);
    const rest = shuffled.slice(count).filter(e => e.role !== 'support'); // 入れ替え用の非サポーター

    // サポーターは同時に最大2体まで。超過分は非サポーターと入れ替える
    const supports = picked.filter(e => e.role === 'support');
    while (supports.length > 2 && rest.length > 0) {
      const idx = picked.indexOf(supports.pop());
      picked[idx] = rest.shift();
    }

    // サポーターは必ずアタッカー系と同時出現（サポーターのみの編成を禁止）
    if (picked.some(e => e.role === 'support') && !picked.some(e => e.role !== 'support') && rest.length > 0) {
      if (picked.length === 1) picked.push(rest.shift());  // 1体編成なら追加して2体に
      else picked[0] = rest.shift();                        // 複数ならサポーター1体を入れ替え
    }
    return picked.map(makeEnemy);
  }

  function makeEnemy(data) {
    const HP_SCALES  = [0.8, 0.8, 0.8];
    const ATK_SCALES = [0.8, 0.8, 0.8];
    const idx = Math.min(loopCount, 2);
    const hpScale  = HP_SCALES[idx];
    const atkScale = ATK_SCALES[idx];
    const p = data.passive;
    let passivePowerMult = p?.type === 'atk_boost' ? (1 + p.value) : 1.0;
    let passiveDefMult   = p?.type === 'def_boost'  ? (1 - p.value) : 1.0;
    if (p?.type === 'atk_hp_drain') passivePowerMult = 1 + p.value.atk;
    if (p?.type === 'compound') {
      p.effects?.forEach(eff => {
        if (eff.type === 'atk_boost') passivePowerMult *= (1 + eff.value);
        if (eff.type === 'def_boost') passiveDefMult *= (1 - eff.value);
      });
    }
    return {
      ...data,
      hp: Math.floor(data.maxHp * hpScale),
      maxHp: Math.floor(data.maxHp * hpScale),
      powerScale: atkScale,
      passivePowerMult,
      passiveDefMult,
      isEnemy: true,
      statusEffects: [],
      statMods: { atk: 1, defMult: 1 },
      hasBarrier: false,
      isGuarding: false,
      isDefeated: false,
      _charging: null,
      _chargeUsed: false
    };
  }

  // ============================================================
  // ---- バトルループ（サイドターン制）----
  // 自軍ターン: 全味方を任意順で操作 → 敵ターン: 全敵が行動 → ループ
  // ============================================================

  async function startPlayerTurn() {
    if (isBusy) return;
    const endCheck = Battle.checkBattleEnd();
    if (endCheck) { handleBattleEnd(endCheck); return; }

    isPlayerTurn = true;
    currentTurnNum++;
    if (currentTurnNum === 1) {
      Battle.getLivingAllies().forEach(a => {
        a._inPreTurn = a.role === 'striker';
      });
    } else {
      Battle.getLivingAllies().forEach(a => {
        a._inPreTurn = false;
      });
      UI.showTurnChangeBanner(true, currentTurnNum);
    }
    currentTurnDamage = 0;
    if (typeof Relics !== 'undefined' && Relics.hasAtkRamp()) {
      gameState._atkRampStacks = Math.min(10, (gameState._atkRampStacks || 0) + 1);
    }

    // 自軍ターン開始時: ステータス異常カウントダウン・レリック再生（2ターン目以降）
    if (currentTurnNum > 1) {
      if (typeof Relics !== 'undefined') {
        const regenAllies = activeAllies.filter(a => !a.isDefeated);
        const before = regenAllies.map(a => a.hp);
        Relics.applyRegen(regenAllies);
        regenAllies.forEach((a, i) => {
          if (a.hp !== before[i]) {
            UI.updateCharBars(a);
            UI.queueFloat(a.id, `${a.hp - before[i]}💎`, 'float-heal');
            UI.flashCard(a.id, 'relic-flash');
          }
        });
        Relics.applySpRegenTick(Battle.getLivingAllies(), currentTurnNum);
      }
      // リジェネ（味方）
      let _regenSePlayed = false;
      Battle.getLivingAllies().forEach(a => {
        if (a.statusEffects.some(e => e.type === 'regen')) {
          const heal = Math.max(1, Math.floor(a.maxHp * 0.10));
          a.hp = Math.min(a.maxHp, a.hp + heal);
          UI.queueFloat(a.id, `+${heal}`, 'float-heal');
          UI.log(`💚 <strong>${a.name}</strong> のリジェネで ${heal} 回復！`, 'log-heal');
          UI.updateCharBars(a);
          if (!_regenSePlayed) { Audio.SE.recover(); _regenSePlayed = true; }
        }
      });
      [...Battle.getLivingAllies(), ...Battle.getLivingEnemies()].forEach(c => {
        Battle.decrementEffects(c);
        UI.updateCharBars(c);
      });
      // パッシブ回復（ターン開始時に統一）
      Battle.getLivingAllies().forEach(a => {
        const _ap = a.passive;
        if (!_ap) return;
        const _regenVal = _ap.type === 'regen' ? _ap.value
          : (_ap.type === 'compound' ? (_ap.effects?.find(e => e.type === 'regen')?.value || 0) : 0);
        if (_regenVal > 0) {
          const healAmt = Math.floor(a.maxHp * _regenVal);
          if (a.hp < a.maxHp && healAmt > 0) {
            a.hp = Math.min(a.maxHp, a.hp + healAmt);
            UI.queueFloat(a.id, `+${healAmt}`, 'float-heal');
            UI.flashPassive(a.id, 'passive-flash');
            UI.log(`💚 <strong>${a.name}</strong>「${_ap.name}」：${healAmt}HP回復！`, 'log-heal');
            UI.updateCharBars(a);
          }
        }
        if (_ap.type === 'regen_team') {
          const healAmt = Math.floor(a.maxHp * _ap.value);
          if (healAmt > 0) {
            const healed = activeAllies.filter(t => !t.isDefeated && t.hp < t.maxHp);
            healed.forEach(t => {
              t.hp = Math.min(t.maxHp, t.hp + healAmt);
              UI.queueFloat(t.id, `+${healAmt}`, 'float-heal');
              UI.updateCharBars(t);
            });
            if (healed.length > 0) {
              UI.flashPassive(a.id, 'passive-flash');
              UI.log(`✨ <strong>${a.name}</strong>「${_ap.name}」：仲間全員を${healAmt}回復！`, 'log-heal');
            }
          }
        }
        if (_ap.type === 'sp_regen_slow') {
          if (!a._spRegenCounter) a._spRegenCounter = 0;
          a._spRegenCounter++;
          if (a._spRegenCounter >= _ap.interval) {
            a._spRegenCounter = 0;
            if ((gameState.sp ?? 0) < (gameState.maxSp ?? 5)) {
              gameState.sp = Math.min(gameState.maxSp ?? 5, (gameState.sp ?? 0) + 1);
              UI.updatePartySP();
              Audio.SE.cursor();
              UI.queueFloat(a.id, '🔋SP+1', 'float-buff');
              UI.log(`✨ <strong>${a.name}</strong>「${_ap.name}」：パーティSP+1！`, 'log-status');
            }
          }
        }
        if (_ap.type === 'sp_regen') {
          if ((gameState.sp ?? 0) < (gameState.maxSp ?? 5)) {
            gameState.sp = Math.min(gameState.maxSp ?? 5, (gameState.sp ?? 0) + 1);
            UI.updatePartySP();
            Audio.SE.cursor();
            UI.queueFloat(a.id, '🔋SP+1', 'float-buff');
            UI.flashPassive(a.id, 'passive-flash');
            UI.log(`🔋 <strong>${a.name}</strong> の「${_ap.name}」：SP+1！`, 'log-status');
          }
        }
      });
    }

    // 防御態勢リセット（全員）
    [...Battle.getLivingAllies(), ...Battle.getLivingEnemies()].forEach(c => {
      if (c.isGuarding) { c.isGuarding = false; UI.updateCharBars(c); }
    });

    // 全味方のactedThisTurnをリセット＆行動可否をターン開始時に確定
    Battle.getLivingAllies().forEach(a => {
      a.actedThisTurn = false;
      document.getElementById(`card-${a.id}`)?.classList.remove('ally-acted');
      if (Battle.isStunned(a))                                a._blockStatus = 'stun';
      else if (Battle.isParalyzed(a) && Math.random() < 0.15) a._blockStatus = 'paralyze';
      else if (Battle.isFrozen(a)    && Math.random() < 0.15) a._blockStatus = 'freeze';
      else                                                     a._blockStatus = null;
    });

    // 行動予約: 未予約の敵だけ新規抽選（開幕予約・チャージ中の予約は実行まで変えない）
    Battle.getLivingEnemies().forEach(e => {
      let sk;
      if (e._charging) sk = ENEMY_SKILL_DATA[e._charging.skillId];
      else if (e._nextSkillId) sk = ENEMY_SKILL_DATA[e._nextSkillId];
      else sk = Battle.planNextAction(e);
      UI.updateEnemyNextAction(e, sk, Battle.getLivingAllies());
    });
    UI.updateLethalWarning();
    UI.updatePartySP();
    UI.log(`⚡ <strong>自軍ターン ${currentTurnNum}</strong>`, 'log-system');
    UI.updateNextTurn([], {});
    UI.showPlayerTurnMsg(currentTurnNum);
    if (currentTurnNum > 1) await delay(400);
    doNextAllyAction();
  }

  function doNextAllyAction(preSelectedAlly = null) {
    UI.clearAllyCardSelection();
    const endCheck = Battle.checkBattleEnd();
    if (endCheck) { handleBattleEnd(endCheck); return; }

    const unacted = Battle.getLivingAllies().filter(a => !a.actedThisTurn);

    if (unacted.length === 0) {
      // ターン終了時 DOTダメージ（味方）
      let _dotSePlayed_p = false;
      Battle.getLivingAllies().forEach(a => {
        const ticks = Battle.tickStatusEffects(a);
        ticks.forEach(tick => {
          UI.updateCharBars(tick.target);
          if (tick.type === 'burn_tick') {
            UI.queueFloat(tick.target.id, `-${tick.amount}🔥`, 'float-dmg');
            UI.log(`🔥 <strong>${tick.target.name}</strong> は燃焼ダメージ ${tick.amount}！`, 'log-status');
            if (!_dotSePlayed_p) { Audio.SE.fire(); _dotSePlayed_p = true; }
          } else if (tick.type === 'poison_tick') {
            UI.queueFloat(tick.target.id, `-${tick.amount}☠️`, 'float-dmg');
            UI.log(`☠️ <strong>${tick.target.name}</strong> は毒ダメージ ${tick.amount}！`, 'log-status');
            if (!_dotSePlayed_p) { Audio.SE.poison_se(); _dotSePlayed_p = true; }
          } else if (tick.type === 'curse_tick') {
            UI.queueFloat(tick.target.id, `-${tick.amount}🖤`, 'float-dmg');
            UI.log(`🖤 <strong>${tick.target.name}</strong> は呪いに蝕まれた！ ${tick.amount}ダメージ！`, 'log-status');
            if (!_dotSePlayed_p) { Audio.SE.dark(); _dotSePlayed_p = true; }
          } else if (tick.type === 'passive_proc') {
            UI.queueFloat(tick.target.id, `⚡${tick.text}`, 'float-buff');
            UI.log(`⚡ <strong>${tick.target.name}</strong> の「${tick.name}」が発動！${tick.text}`, 'log-status');
          } else if (tick.type === 'survive_fatal') {
            UI.queueFloat(tick.target.id, '✋くいしばり!', 'float-heal');
            UI.log(`✋ <strong>${tick.target.name}</strong> は令呪の力でHP1で耐えた！`, 'log-status');
          } else if (tick.type === 'revive_relic') {
            const dotRevRelic = tick.target._lastReviveRelic;
            if (dotRevRelic) { delete tick.target._lastReviveRelic; }
            const dotRevIcon = dotRevRelic ? dotRevRelic.emoji : '💒';
            const dotRevLabel = dotRevRelic ? `${dotRevIcon}${dotRevRelic.name}で復活！` : '💒復活！';
            const dotRevLog = dotRevRelic
              ? `${dotRevIcon} <strong>${tick.target.name}</strong> は「${dotRevRelic.name}」の力で復活した！`
              : `💒 <strong>${tick.target.name}</strong> はレリックの力で復活した！`;
            UI.flashCard(tick.target.id, 'revive-flash', 1400);
            UI.queueFloat(tick.target.id, dotRevLabel, 'float-revive');
            UI.log(dotRevLog, 'log-heal');
            UI.updateCharBars(tick.target);
          }
          if (['burn_tick','poison_tick','curse_tick'].includes(tick.type)
              && !tick.target.isEnemy && !tick.target.isDefeated && !gameState._teamRegenRelicUsed) {
            const regenTurns = typeof Relics !== 'undefined' ? Relics.getTeamRegenOnLowHpTurns() : 0;
            if (regenTurns > 0 && tick.target.hp <= tick.target.maxHp * 0.5) {
              gameState._teamRegenRelicUsed = true;
              const immediateHeal = Math.max(1, Math.floor(tick.target.maxHp * 0.10));
              tick.target.hp = Math.min(tick.target.maxHp, tick.target.hp + immediateHeal);
              Battle.applyStatusEffect(tick.target, 'regen', regenTurns);
              UI.updateCharBars(tick.target);
              const _trRelic2 = typeof Relics !== 'undefined' ? Relics.getTeamRegenRelic() : null;
              const _trIcon2 = _trRelic2 ? _trRelic2.emoji : '💒';
              const _trName2 = _trRelic2 ? _trRelic2.name : 'レリック';
              UI.queueFloat(tick.target.id, `${_trIcon2}${_trName2}`, 'float-buff');
              UI.queueFloat(tick.target.id, `リジェネ(${regenTurns}T)+${immediateHeal}`, 'float-heal');
              UI.flashCard(tick.target.id, 'relic-flash');
              UI.log(`${_trIcon2} <strong>「${_trName2}」発動！</strong><strong>${tick.target.name}</strong> にリジェネ（${regenTurns}T）！`, 'log-status');
            }
          }
        });
      });
      const dotEndCheck = Battle.checkBattleEnd();
      if (dotEndCheck) { handleBattleEnd(dotEndCheck); return; }
      setTimeout(() => startEnemyTurn(), 900);
      return;
    }

    // ターン開始時に確定済みのブロック済み味方を先に自動スキップ
    const nextBlocked = unacted.find(a => a._blockStatus !== null);
    if (nextBlocked) {
      doAllyTurn(nextBlocked, null);
      return;
    }

    // ターン1はストライカーが先行（先制未消化のストライカーがいる間は他を選べない）
    const unactedStrikers = unacted.filter(a => a.role === 'striker' && a._inPreTurn);
    const strikerPhase = currentTurnNum === 1 && unactedStrikers.length > 0;
    const selectable = strikerPhase ? unactedStrikers : unacted;
    if (strikerPhase) {
      unacted.filter(a => a.role !== 'striker').forEach(a =>
        document.getElementById(`card-${a.id}`)?.classList.add('ally-waiting'));
    } else {
      unacted.forEach(a =>
        document.getElementById(`card-${a.id}`)?.classList.remove('ally-waiting'));
    }

    if (selectable.length === 1) {
      const _solo = selectable[0];
      const onSelected1 = async ({ skillId, target }) => {
        const wasPreemptive = _solo._inPreTurn;
        if (!wasPreemptive) _solo.actedThisTurn = true;
        const _eb1 = Battle.getLivingEnemies().length;
        await executeAllyAction(_solo, skillId, target);
        await processAllyActionPassives(_solo);
        const _reAct1 = _solo.role === 'attacker' && !_solo.isDefeated
          && Battle.getLivingEnemies().length < _eb1 && Battle.getLivingEnemies().length > 0;
        if (_reAct1) {
          _solo.actedThisTurn = false;
          if (typeof ACH !== 'undefined') ACH.onAceActivated();
          UI.flashCard(_solo.id, 'extra-turn-flash', 1200);
          UI.queueFloat(_solo.id, '⚔️ 再行動！', 'float-buff');
          UI.log(`⚔️ <strong>${_solo.name}</strong> 撃破！再行動獲得！`, 'log-ally');
          doAllyTurn(_solo, onSelected1);
        } else if (wasPreemptive && !_solo.isDefeated) {
          _solo._inPreTurn = false;
          const _c1 = document.getElementById(`card-${_solo.id}`);
          _c1?.classList.remove('ally-waiting');
          doNextAllyAction();
        } else {
          _solo.actedThisTurn = true;
          _solo._inPreTurn = false;
          const _c1 = document.getElementById(`card-${_solo.id}`);
          _c1?.classList.add('ally-acted');
          _c1?.classList.remove('ally-waiting');
          doNextAllyAction();
        }
      };
      doAllyTurn(_solo, onSelected1);
    } else {
      UI.makeAllyCardsSelectable(selectable, (selectedAlly) => {
        UI.clearTargetSelect();
        const onSelected2 = async ({ skillId, target }) => {
          UI.clearAllyCardSelection();
          const wasPreemptive2 = selectedAlly._inPreTurn;
          if (!wasPreemptive2) selectedAlly.actedThisTurn = true;
          const _eb2 = Battle.getLivingEnemies().length;
          await executeAllyAction(selectedAlly, skillId, target);
          await processAllyActionPassives(selectedAlly);
          const _reAct2 = selectedAlly.role === 'attacker' && !selectedAlly.isDefeated
            && Battle.getLivingEnemies().length < _eb2 && Battle.getLivingEnemies().length > 0;
          if (_reAct2) {
            selectedAlly.actedThisTurn = false;
            if (typeof ACH !== 'undefined') ACH.onAceActivated();
            UI.flashCard(selectedAlly.id, 'extra-turn-flash', 1200);
            UI.queueFloat(selectedAlly.id, '⚔️ 再行動！', 'float-buff');
            UI.log(`⚔️ <strong>${selectedAlly.name}</strong> 撃破！再行動獲得！`, 'log-ally');
            doNextAllyAction(selectedAlly);
          } else if (wasPreemptive2 && !selectedAlly.isDefeated) {
            selectedAlly._inPreTurn = false;
            const _c2 = document.getElementById(`card-${selectedAlly.id}`);
            _c2?.classList.remove('ally-waiting');
            doNextAllyAction();
          } else {
            selectedAlly.actedThisTurn = true;
            selectedAlly._inPreTurn = false;
            const _c2 = document.getElementById(`card-${selectedAlly.id}`);
            _c2?.classList.add('ally-acted');
            _c2?.classList.remove('ally-waiting');
            doNextAllyAction();
          }
        };
        doAllyTurn(selectedAlly, onSelected2);
      }, preSelectedAlly ?? selectable[0]);
    }
  }

  async function processAllyActionPassives(actor) {
    const _ap = actor.passive;
    if (!_ap || actor.isDefeated) return;
    if (_ap.type === 'atk_hp_drain') {
      const drain = Math.floor(actor.maxHp * _ap.value.drain);
      if (drain > 0 && actor.hp > 1) {
        actor.hp = Math.max(1, actor.hp - drain);
        UI.floatNumber(actor.id, `-${drain}`, 'float-dmg');
        UI.flashPassive(actor.id, 'passive-flash');
        UI.updateCharBars(actor);
      }
    }

  }

  async function startEnemyTurn() {
    if (typeof ACH !== 'undefined' && currentTurnDamage > 0) ACH.onTurnDamageEnd(currentTurnDamage);

    const endCheck = Battle.checkBattleEnd();
    if (endCheck) { handleBattleEnd(endCheck); return; }

    isPlayerTurn = false;
    if (currentTurnNum >= 1) UI.showTurnChangeBanner(false);
    UI.clearAllyCardSelection();
    UI.clearTargetSelect();
    document.querySelectorAll('.char-card.active-actor').forEach(c => c.classList.remove('active-actor'));
    // 行動済みグレーは敵ターン開始時点で解除（フラグは自軍ターン開始時にリセット）
    document.querySelectorAll('.ally-acted').forEach(c => c.classList.remove('ally-acted'));
    UI.log(`👹 <strong>敵ターン</strong>`, 'log-system');
    UI.showEnemyTurnStartMsg();
    await delay(400);

    const enemies = Battle.getLivingEnemies();

    // フェーズ1: 全員リジェネ（行動前）
    let _regenSePlayed_e = false;
    for (const enemy of enemies) {
      if (enemy.isDefeated) continue;

      const _ep = enemy.passive;
      if (_ep && _ep.type === 'regen') {
        const healAmt = Math.floor(enemy.maxHp * _ep.value);
        if (enemy.hp < enemy.maxHp && healAmt > 0) {
          enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmt);
          UI.floatNumber(enemy.id, `+${healAmt}`, 'float-heal');
          UI.log(`💚 <strong>${enemy.name}</strong>「${_ep.name}」：${healAmt}HP回復！`, 'log-heal');
          UI.updateCharBars(enemy);
          if (!_regenSePlayed_e) { Audio.SE.recover(); _regenSePlayed_e = true; }
        }
      }

      if (enemy.statusEffects.some(e => e.type === 'regen')) {
        const heal = Math.max(1, Math.floor(enemy.maxHp * 0.10));
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + heal);
        UI.floatNumber(enemy.id, `+${heal}`, 'float-heal');
        UI.log(`💚 <strong>${enemy.name}</strong> のリジェネで ${heal} 回復！`, 'log-heal');
        UI.updateCharBars(enemy);
        if (!_regenSePlayed_e) { Audio.SE.recover(); _regenSePlayed_e = true; }
      }
    }

    if (_regenSePlayed_e) await delay(400);

    // フェーズ2: 全員行動
    let _blockSePlayed = false;
    for (const enemy of enemies) {
      if (enemy.isDefeated) continue;

      if (Battle.isStunned(enemy)) {
        UI.updateCharBars(enemy);
        UI.log(`💫 <strong>${enemy.name}</strong> は気絶！行動不能。`, 'log-status');
        if (!_blockSePlayed) { Audio.SE.shock(); _blockSePlayed = true; }
        UI.showStatusSkip(enemy.id, enemy.name, 'stun');
        notifyChargeCancel(enemy);
        await delay(400);
        continue;
      }
      if (Battle.isParalyzed(enemy) && Math.random() < 0.15) {
        UI.updateCharBars(enemy);
        UI.log(`⚡ <strong>${enemy.name}</strong> は麻痺で動けなかった！`, 'log-status');
        if (!_blockSePlayed) { Audio.SE.shock(); _blockSePlayed = true; }
        UI.showStatusSkip(enemy.id, enemy.name, 'paralyze');
        notifyChargeCancel(enemy);
        await delay(400);
        continue;
      }
      if (Battle.isFrozen(enemy) && Math.random() < 0.15) {
        UI.updateCharBars(enemy);
        UI.log(`🧊 <strong>${enemy.name}</strong> は氷結で動けなかった！`, 'log-status');
        if (!_blockSePlayed) { Audio.SE.freeze(); _blockSePlayed = true; }
        UI.showStatusSkip(enemy.id, enemy.name, 'freeze');
        notifyChargeCancel(enemy);
        await delay(400);
        continue;
      }

      await doEnemyTurn(enemy);

      const endMid = Battle.checkBattleEnd();
      if (endMid) { handleBattleEnd(endMid); return; }
    }

    // フェーズ3: 全員DOT（行動後）
    let _dotSePlayed_e = false;
    for (const enemy of enemies) {
      if (enemy.isDefeated) continue;
      const ticks = Battle.tickStatusEffects(enemy);
      ticks.forEach(tick => {
        UI.updateCharBars(tick.target);
        if (tick.type === 'burn_tick') {
          UI.floatNumber(tick.target.id, `-${tick.amount}🔥`, 'float-dmg');
          UI.log(`🔥 <strong>${tick.target.name}</strong> は燃焼ダメージ ${tick.amount}！`, 'log-status');
          if (!_dotSePlayed_e) { Audio.SE.fire(); _dotSePlayed_e = true; }
        } else if (tick.type === 'poison_tick') {
          UI.floatNumber(tick.target.id, `-${tick.amount}☠️`, 'float-dmg');
          UI.log(`☠️ <strong>${tick.target.name}</strong> は毒ダメージ ${tick.amount}！`, 'log-status');
          if (!_dotSePlayed_e) { Audio.SE.poison_se(); _dotSePlayed_e = true; }
        } else if (tick.type === 'curse_tick') {
          UI.floatNumber(tick.target.id, `-${tick.amount}🖤`, 'float-dmg');
          UI.log(`🖤 <strong>${tick.target.name}</strong> は呪いに蝕まれた！ ${tick.amount}ダメージ！`, 'log-status');
          if (!_dotSePlayed_e) { Audio.SE.dark(); _dotSePlayed_e = true; }
        } else if (tick.type === 'passive_proc') {
          UI.floatNumber(tick.target.id, `⚡${tick.text}`, 'float-buff');
          UI.log(`⚡ <strong>${tick.target.name}</strong> の「${tick.name}」が発動！${tick.text}`, 'log-status');
        }
      });
      if (ticks.some(t => ['burn_tick', 'poison_tick', 'curse_tick'].includes(t.type))) {
        await delay(400);
      }

      if (enemy.isDefeated) {
        UI.flashCard(enemy.id, 'defeated-flash');
        UI.log(`💀 <strong>${enemy.name}</strong> は倒れた！`, 'log-enemy');
        if (Battle.cancelCharge(enemy)) {
          UI.log(`💥 <strong>${enemy.name}</strong> のチャージは撃破により中断された！`, 'log-ally');
        }
        setTimeout(() => UI.collapseEnemyCard(enemy.id), 800);
        const endMid = Battle.checkBattleEnd();
        if (endMid) { handleBattleEnd(endMid); return; }
      }
    }

    await delay(700);
    startPlayerTurn();
  }

  // ---- Ally Turn（スキル選択UIを表示し、選択されたら onSelected を呼ぶ）----
  function doAllyTurn(ally, onSelected) {
    if (ally._blockStatus === 'stun') {
      UI.updateCharBars(ally);
      UI.log(`💫 <strong>${ally.name}</strong> は気絶！行動不能。`, 'log-status');
      Audio.SE.shock();
      UI.showStatusSkip(ally.id, ally.name, 'stun');
      ally.actedThisTurn = true;
      ally._inPreTurn = false;
      { const _sc = document.getElementById(`card-${ally.id}`); _sc?.classList.add('ally-acted'); _sc?.classList.remove('ally-waiting'); }
      ally._blockStatus = undefined;
      setTimeout(() => doNextAllyAction(), 600);
      return;
    }
    if (ally._blockStatus === 'paralyze') {
      UI.updateCharBars(ally);
      UI.log(`⚡ <strong>${ally.name}</strong> は麻痺で動けなかった！`, 'log-status');
      Audio.SE.shock();
      UI.showStatusSkip(ally.id, ally.name, 'paralyze');
      ally.actedThisTurn = true;
      ally._inPreTurn = false;
      { const _sc = document.getElementById(`card-${ally.id}`); _sc?.classList.add('ally-acted'); _sc?.classList.remove('ally-waiting'); }
      ally._blockStatus = undefined;
      setTimeout(() => doNextAllyAction(), 600);
      return;
    }
    if (ally._blockStatus === 'freeze') {
      UI.updateCharBars(ally);
      UI.log(`🧊 <strong>${ally.name}</strong> は氷結で動けなかった！`, 'log-status');
      Audio.SE.freeze();
      UI.showStatusSkip(ally.id, ally.name, 'freeze');
      ally.actedThisTurn = true;
      ally._inPreTurn = false;
      { const _sc = document.getElementById(`card-${ally.id}`); _sc?.classList.add('ally-acted'); _sc?.classList.remove('ally-waiting'); }
      ally._blockStatus = undefined;
      setTimeout(() => doNextAllyAction(), 600);
      return;
    }
    currentActor = ally;
    UI.setActiveActor(ally);
    if (ally._inPreTurn) {
      UI.queueFloat(ally.id, '⚡先制行動！', 'float-buff');
      UI.log(`⚡ <strong>${ally.name}</strong> 先制行動！`, 'log-ally');
    }
    UI.updatePartySP();
    // 誤射防止: 全スキル共通で「1度目=対象確認 → カードクリック or 同じボタン2度押しで発動」
    let pendingSkillId = null;
    UI.renderSkillButtons(ally, (skillId, skill) => {
      if (isBusy) return;
      const confirmed = t => { pendingSkillId = null; onSelected({ skillId, target: t ?? null }); };

      if (skill.target === 'single') {
        const isAllyTarget = skill.type === 'heal' || skill.effect === 'sp_restore';
        const pool = isAllyTarget ? Battle.getLivingAllies() : Battle.getLivingEnemies();
        if (pendingSkillId === skillId) {
          // 2度押し: HPが最も低い対象へ即発動
          UI.clearTargetSelect();
          confirmed(pool.reduce((a, b) => a.hp <= b.hp ? a : b));
          return;
        }
        pendingSkillId = skillId;
        const prompt = isAllyTarget ? UI.promptAllyTargetSelect : UI.promptTargetSelect;
        prompt(pool, confirmed);
        UI.setSkillBtnPending(skillId, 'もう一度押すとHP最低の相手へ'); // prompt内のclearTargetSelectで消えるため後から付与
        return;
      }

      // 全体・味方全体・復活・自身・防御: 2度押し or カードクリックで発動
      if (pendingSkillId === skillId) {
        UI.clearTargetSelect();
        try { (skillId === 'defend' ? Audio.SE.barrier_se : Audio.SE.cursor)(); } catch(e) {}
        confirmed();
        return;
      }
      pendingSkillId = skillId;
      if (skill.target === 'all') {
        UI.promptAoeConfirm(Battle.getLivingEnemies(), false, () => confirmed());
      } else if (skill.target === 'all_ally') {
        UI.promptAoeConfirm(Battle.getLivingAllies(), true, () => confirmed());
      } else if (skill.target === 'dead_ally') {
        const dead = activeAllies.filter(a => a.isDefeated);
        if (dead.length <= 1) {
          confirmed(dead[0] ?? null);
        } else {
          UI.promptDeadAllySelect(dead, t => confirmed(t));
          UI.setSkillBtnPending(skillId, 'もう一度押すと最後に倒れた仲間を蘇生');
        }
        return;
      } else {
        // self / 防御: 自分のカードをクリックで発動
        UI.promptAllyTargetSelect([ally], () => confirmed());
      }
      UI.setSkillBtnPending(skillId, 'もう一度押すと発動');
    }, () => { pendingSkillId = null; });

    if (autoSelectNormalAtk) {
      const _panel = document.getElementById('skill-panel');
      const _noSpBtn = Array.from(_panel.querySelectorAll('.skill-btn')).find(b => {
        const sk = SKILL_DATA[b.dataset.skillId];
        return sk && (sk.noSP || sk.noPP);
      });
      if (_noSpBtn && !_noSpBtn.disabled) _noSpBtn.click();
    }
  }

  async function executeAllyAction(ally, skillId, target) {
    isBusy = true;

    UI.hideSkillPanel();
    UI.clearTargetSelect();

    if (skillId === 'defend') {
      UI.log(`🛡️ <strong>${ally.name}</strong> は防御態勢をとった！（次の攻撃ダメ50%カット）`, 'log-ally');
      const { results } = Battle.executeAllySkill(ally, skillId, target);
      results.forEach(r => UI.updateCharBars(r.target));
      UI.updateCharBars(ally);
      Battle.getLivingEnemies().forEach(e => {
        const plannedSkill = e._nextSkillId ? ENEMY_SKILL_DATA[e._nextSkillId] : null;
        UI.updateEnemyNextAction(e, plannedSkill, Battle.getLivingAllies());
      });
      UI.updateLethalWarning();
      await delay(400);
      isBusy = false;
      return;
    }

    const skill = SKILL_DATA[skillId];
    // 大技使用追跡
    if (skill && skill.spCost === 4 && typeof ACH !== 'undefined') ACH.onUltimateUsed();
    UI.log(`✨ <strong>${ally.name}</strong> は <em>${skill.name}</em> を使った！`, 'log-ally');
    const allyQuote = (typeof SKILL_QUOTES !== 'undefined') && SKILL_QUOTES[skillId];
    if (allyQuote) UI.showSkillQuote(ally.id, allyQuote);
    Audio.playByAnimation(skill.animation || 'slash');

    const isAll = skill.target === 'all' || skill.target === 'all_ally';
    const isTargetAlly = skill.target === 'self' || skill.target === 'all_ally';
    await UI.playSkillAnimation(skill.animation || 'slash', isAll, isTargetAlly);
    if (isAll && skill.type !== 'heal' && skill.type !== 'support') {
      UI.screenShake(skill.power >= 36 ? 'heavy' : 'normal');
    } else if (skill.animation === 'punch_heavy' || skill.animation === 'slash_heavy') {
      UI.screenShake('normal'); // 強打・重斬は単体技でも揺らす
    }

    const { results } = Battle.executeAllySkill(ally, skillId, target);
    if (gameState._lastSpFree) {
      gameState._lastSpFree = false;
      UI.floatNumber(ally.id, '✨SPタダ！', 'float-buff');
      UI.log(`✨ <strong>${ally.name}</strong> のSP消費がタダになった！`, 'log-status');
      Audio.SE.buff();
    }
    UI.updatePartySP();
    if (skill.type !== 'support' && typeof Relics !== 'undefined') Relics.applySkillHpCost(ally);
    if (typeof ACH !== 'undefined' && skill.execute && results.some(r => r.type === 'damage' && r.isKill)) ACH.onExecuteKill();
    // 基本攻撃がヒットしたらSP回復（サポーターは+2、それ以外は+1）
    const _spGain = ((skill.noSP || skill.noPP) && !ally.isDefeated)
      ? (ally.role === 'support' ? 2 : 1) : 0;
    if (_spGain > 0) {
      gameState.sp = Math.min(gameState.maxSp ?? 5, (gameState.sp ?? 0) + _spGain);
      UI.updatePartySP();
      if (_spGain === 2) UI.flashCard(ally.id, 'support-sp-flash', 1200);
    }
    await processResults(results, ally);
    if (_spGain > 0) UI.queueFloat(ally.id, `🔋SP+${_spGain}`, 'float-buff');
    Battle.getLivingAllies().forEach(a => UI.updateCharBars(a));
    UI.updateCharBars(ally);
    Battle.getLivingEnemies().forEach(e => {
      const plannedSkill = e._nextSkillId ? ENEMY_SKILL_DATA[e._nextSkillId] : null;
      UI.updateEnemyNextAction(e, plannedSkill, Battle.getLivingAllies());
    });
    UI.updateLethalWarning();

    // 通常攻撃時SP+1パッシブ
    if (SKILL_DATA[skillId]?.noSP && ally.passive?.type === 'sp_regen_on_basic') {
      if ((gameState.sp ?? 0) < (gameState.maxSp ?? 5)) {
        gameState.sp = Math.min(gameState.maxSp ?? 5, (gameState.sp ?? 0) + 1);
        UI.updatePartySP();
        Audio.SE.cursor();
        UI.queueFloat(ally.id, '🔋SP+1', 'float-buff');
        UI.flashPassive(ally.id, 'passive-flash');
      }
    }

    await delay(300);
    isBusy = false;
  }

  // チャージ中の敵が行動不能になったとき: 中断を通知し次回行動を再プラン
  function notifyChargeCancel(enemy) {
    if (!Battle.cancelCharge(enemy)) return;
    UI.log(`💥 <strong>${enemy.name}</strong> のチャージが中断された！`, 'log-ally');
    UI.floatNumber(enemy.id, 'チャージ中断!', 'float-crit');
    const sk = Battle.planNextAction(enemy);
    UI.updateEnemyNextAction(enemy, sk, Battle.getLivingAllies());
    UI.updateLethalWarning();
  }

  // ---- Enemy Turn ----
  async function doEnemyTurn(enemy) {
    isBusy = true;
    UI.showEnemyTurnMsg(enemy);
    await delay(650);

    const { results, skill, skillId: enemySkillId, charging, turnsLeft, chargeFired } = Battle.executeEnemyTurn(enemy);
    if (!skill) { isBusy = false; return; }

    if (charging) {
      // チャージ宣言/継続ターン: 攻撃せず溜める
      const _chargeTargetStr = (skill.target === 'single' && enemy._nextTargetEmoji) ? ` → ${enemy._nextTargetEmoji}` : '';
      UI.log(`🔋 <strong>${enemy.name}</strong> は <em>${skill.name}</em> のチャージ中…！（発動まで敵ターン${turnsLeft}回）${_chargeTargetStr}`, 'log-enemy');
      UI.floatNumber(enemy.id, '🔋チャージ!', 'float-crit');
      Audio.playByAnimation('buff');
      UI.updateEnemyNextAction(enemy, skill, Battle.getLivingAllies());
      UI.updateLethalWarning();
      // チャージ開始時のみボス/中ボスにシールド100付与
      if (turnsLeft === skill.chargeTurns && (enemy.isBoss || enemy.isMidBoss)) {
        enemy.shieldHp = (enemy.shieldHp || 0) + 100;
        UI.updateCharBars(enemy);
        UI.queueFloat(enemy.id, '🛡️+100', 'float-shield');
      }
      // ボスがチャージ開始: サポーター雑魚をボスの左右に召喚
      if (enemy.isBoss) {
        const supportPool = ENEMY_DATA.filter(e => e.role === 'support');
        const slots = Math.max(0, 3 - Battle.getLivingEnemies().length);
        if (slots > 0) {
          const bossIdx = Battle.getEnemies().indexOf(enemy);
          const ts = Date.now() % 100000;
          if (slots >= 2) {
            const lData = supportPool[Math.floor(Math.random() * supportPool.length)];
            Battle.insertEnemy(makeEnemy({ ...lData, id: `${lData.id}_csl${ts}` }), bossIdx);
            const rData = supportPool[Math.floor(Math.random() * supportPool.length)];
            Battle.insertEnemy(makeEnemy({ ...rData, id: `${rData.id}_csr${ts}` }), bossIdx + 2);
          } else {
            const lData = supportPool[Math.floor(Math.random() * supportPool.length)];
            Battle.insertEnemy(makeEnemy({ ...lData, id: `${lData.id}_csl${ts}` }), bossIdx);
          }
          UI.renderEnemyArea(Battle.getEnemies());
          Battle.getEnemies().forEach(e => UI.updateCharBars(e));
          Battle.getLivingEnemies().forEach(e => {
            const sk = e._nextSkillId ? ENEMY_SKILL_DATA[e._nextSkillId] : null;
            UI.updateEnemyNextAction(e, sk, Battle.getLivingAllies());
          });
          UI.log(`⚡ <strong>${enemy.name}</strong> の大技に呼応し、手下が現れた！`, 'log-enemy');
          UI.updateLethalWarning();
        }
      }
      await delay(500);
      isBusy = false;
      return;
    }

    UI.updateEnemyNextAction(enemy, null, Battle.getLivingAllies()); // 実行した予告はパネルから消す
    UI.log(`👹 <strong>${enemy.name}</strong> は <em>${skill.name}</em> を使った！`, 'log-enemy');
    if (enemy.isBoss || enemy.isMidBoss || chargeFired) UI.showEnemySkillName(enemy.id, skill.name);
    const bossQuote = (typeof BOSS_SKILL_QUOTES !== 'undefined') && BOSS_SKILL_QUOTES[enemySkillId];
    if (bossQuote) UI.showSkillQuote(enemy.id, bossQuote);
    Audio.playByAnimation(skill.animation || 'slash');

    const isAll = skill.target === 'all' || skill.target === 'all_ally';
    const isTargetAlly = skill.target === 'single' || skill.target === 'all';
    await UI.playSkillAnimation(skill.animation || 'slash', isAll, isTargetAlly);
    if (isAll && skill.type !== 'support' && skill.type !== 'heal') {
      UI.screenShake(skill.power >= 150 ? 'heavy' : 'normal');
    } else if (skill.animation === 'punch_heavy' || skill.animation === 'slash_heavy') {
      UI.screenShake('normal'); // 強打・重斬は単体技でも揺らす
    }

    await processResults(results, enemy);
    Battle.getLivingEnemies().forEach(e => UI.updateCharBars(e));
    UI.updateCharBars(enemy);
    UI.updateLethalWarning();

    await delay(350);
    isBusy = false;
  }

  // ---- 撃破時レリック（on_kill_heal / on_kill_sp）----
  // 「味方が敵を倒した」ときのみ発動し、撃破手段（通常ダメージ／即死／
  // カウンター反射／棘反射）を問わず同じ効果を出す。killer=倒した側、victim=倒された側
  function applyOnKillRelics(killer, victim) {
    if (!killer || !victim) return;
    if (!victim.isEnemy || killer.isEnemy || killer.isDefeated) return;
    if (typeof Relics === 'undefined') return;
    // 1体の撃破につき1回だけ。反射が複数人ぶん発生した場合、結果の再生時点では
    // どの counter/reflect_dmg からも isDefeated が true に見えるため二重に入りうる
    if (victim._killRewarded) return;
    victim._killRewarded = true;
    const healPct = Relics.getOnKillHealPct();
    if (healPct > 0) {
      const h = Math.floor(killer.maxHp * healPct);
      killer.hp = Math.min(killer.maxHp, killer.hp + h);
      UI.floatNumber(killer.id, `+${h}💚`, 'float-heal');
      UI.updateCharBars(killer);
      UI.flashCard(killer.id, 'relic-flash');
    }
    const killSpGain = Relics.hasOnKillSp();
    if (killSpGain > 0) {
      const gs = window.gameState;
      if (gs) { gs.sp = Math.min(gs.maxSp ?? 5, (gs.sp ?? 0) + killSpGain); UI.updatePartySP(); }
      UI.queueFloat(killer.id, `🔋SP+${killSpGain}`, 'float-buff');
      UI.flashCard(killer.id, 'relic-flash');
    }
  }

  // ---- Process skill results (async — stagger multi-hit display) ----
  async function processResults(results, actor) {
    let damageHitIndex = 0;
    // 同一ターゲットへの damage 結果を事前集計（多段ヒットのログ集約用）
    const dmgGroups = new Map();
    results.filter(r => r.type === 'damage').forEach(r => {
      if (!dmgGroups.has(r.target)) dmgGroups.set(r.target, { total: 0, hits: 0 });
      const g = dmgGroups.get(r.target);
      g.total += r.amount;
      g.hits++;
    });
    // drain 結果を事前集計（多段ヒット時にログを1行にまとめる）
    let drainTotal = 0;
    let drainCount = 0;
    results.filter(r => r.type === 'drain').forEach(r => { drainTotal += r.amount; drainCount++; });
    let drainLogged = 0;
    const distinctTargets = new Set(results.map(r => r.target)).size;
    const hitCounters = new Map();
    let _statusDebuffSePlayed = false;
    for (const r of results) {
      UI.updateCharBars(r.target);

      switch (r.type) {
        case 'damage': {
          if (damageHitIndex > 0) await delay(110); // stagger hits
          damageHitIndex++;

          // 毎ヒット：視覚エフェクト
          UI.flashCard(r.target.id, 'hit-flash');
          UI.floatNumber(r.target.id, `${r.amount}`, 'float-dmg');
          if (typeof ACH !== 'undefined') {
            if (r.target.isEnemy && !actor.isEnemy) {
              ACH.onDamageDealt(r.amount);
              currentTurnDamage += r.amount;
            }
            if (r.tankBlocked) ACH.onTankBlock();
          }
          // ヒットカウント管理
          if (!hitCounters.has(r.target)) hitCounters.set(r.target, 0);
          const hitIdx = hitCounters.get(r.target);
          hitCounters.set(r.target, hitIdx + 1);
          const group = dmgGroups.get(r.target);
          const isMultiHit = group.hits > 1;
          const isLastHit = hitIdx === group.hits - 1;

          // テキストログ：単発は毎回、多段は最終ヒットのみ
          if (!isMultiHit || isLastHit) {
            if (actor.isEnemy && r.target.role === 'tank' && !r.target.isEnemy && distinctTargets === 1) {
              UI.flashCard(r.target.id, 'tank-block-flash', 1200);
            }
            if (r.isKill) {
              UI.flashCard(r.target.id, 'defeated-flash');
              const killMsg = isMultiHit
                ? `💀 <strong>${r.target.name}</strong> を倒した！（${group.hits}ヒット / 合計 <strong>${group.total}</strong>）`
                : `💀 <strong>${r.target.name}</strong> を倒した！`;
              UI.log(killMsg, r.target.isEnemy ? 'log-enemy' : 'log-ally');
              Audio.SE.enemyDefeat();
              if (r.target.isEnemy && Battle.cancelCharge(r.target)) {
                UI.log(`💥 <strong>${r.target.name}</strong> のチャージは撃破により中断された！`, 'log-ally');
                UI.updateEnemyNextAction(r.target, null, Battle.getLivingAllies());
              }
              if (r.target.isEnemy) setTimeout(() => UI.collapseEnemyCard(r.target.id), 800);
              if (!r.target.isEnemy) {
                activeAllies.filter(a => !a.isDefeated && a.passive?.type === 'on_defeat_atk').forEach(a => {
                  Battle.applyStatusEffect(a, 'atk_up', a.passive.turns || 2);
                  Battle.applyStatusEffect(a, 'def_up', a.passive.turns || 2);
                  UI.floatNumber(a.id, '怒↑', 'float-crit');
                  UI.flashPassive(a.id, 'passive-flash');
                  UI.log(`✨ <strong>${a.name}</strong>「${a.passive.name}」発動！攻撃UP＆防御UP！`, 'log-status');
                  UI.updateCharBars(a);
                });
              }
              applyOnKillRelics(actor, r.target);
            } else {
              const side = r.target.isEnemy ? '👹' : '🛡️';
              const dmgMsg = isMultiHit
                ? `   ${side} <strong>${r.target.name}</strong> に <strong>${group.total}</strong> ダメージ！（${group.hits}ヒット）`
                : `   ${side} <strong>${r.target.name}</strong> に <strong>${r.amount}</strong> ダメージ！`;
              UI.log(dmgMsg, r.target.isEnemy ? 'log-enemy' : 'log-ally');
            }
            if (!r.target.isEnemy && !r.target.isDefeated && !gameState._teamRegenRelicUsed) {
              const regenTurns = typeof Relics !== 'undefined' ? Relics.getTeamRegenOnLowHpTurns() : 0;
              if (regenTurns > 0 && r.target.hp <= r.target.maxHp * 0.5) {
                gameState._teamRegenRelicUsed = true;
                const immediateHeal = Math.max(1, Math.floor(r.target.maxHp * 0.10));
                r.target.hp = Math.min(r.target.maxHp, r.target.hp + immediateHeal);
                Battle.applyStatusEffect(r.target, 'regen', regenTurns);
                UI.updateCharBars(r.target);
                const _trRelic = Relics.getTeamRegenRelic();
                const _trIcon = _trRelic ? _trRelic.emoji : '💒';
                const _trName = _trRelic ? _trRelic.name : 'レリック';
                UI.queueFloat(r.target.id, `${_trIcon}${_trName}`, 'float-buff');
                UI.queueFloat(r.target.id, `リジェネ(${regenTurns}T)+${immediateHeal}`, 'float-heal');
                UI.flashCard(r.target.id, 'relic-flash');
                UI.log(`${_trIcon} <strong>「${_trName}」発動！</strong><strong>${r.target.name}</strong> にリジェネ（${regenTurns}T）！`, 'log-status');
              }
            }
          }
          break;
        }

        case 'revive': {
          const revRelic = r.target._lastReviveRelic;
          if (revRelic) { delete r.target._lastReviveRelic; }
          const revIcon = revRelic ? revRelic.emoji : '✨';
          const revLabel = revRelic ? `${revIcon}${revRelic.name}で復活！` : '✨復活！';
          const revLog = revRelic
            ? `${revIcon} <strong>${r.target.name}</strong> は「${revRelic.name}」の力で復活した！`
            : `✨ <strong>${r.target.name}</strong> が復活した！`;
          UI.flashCard(r.target.id, 'revive-flash', 1400);
          UI.floatNumber(r.target.id, revLabel, 'float-revive');
          UI.log(revLog, 'log-heal');
          UI.updateCharBars(r.target);
          break;
        }

        case 'heal':
          UI.floatNumber(r.target.id, `${r.amount}💚`, 'float-heal');
          UI.log(`   💚 <strong>${r.target.name}</strong> のHPが <strong>${r.amount}</strong> 回復！`, 'log-heal');
          if (typeof ACH !== 'undefined') ACH.onHealDealt(r.amount);
          break;

        case 'drain':
          UI.floatNumber(r.target.id, `${r.amount}💜`, 'float-heal');
          drainLogged++;
          if (drainLogged === drainCount) {
            const drainMsg = drainCount > 1 ? `${drainTotal}（${drainCount}ヒット合計）` : `${drainTotal}`;
            UI.log(`   💜 <strong>${actor.name}</strong> はHPを <strong>${drainMsg}</strong> 吸収！`, 'log-status');
          }
          break;

        case 'status': {
          if (actor.isEnemy && r.target.role === 'tank' && !r.target.isEnemy && distinctTargets === 1) {
            UI.flashCard(r.target.id, 'tank-block-flash', 1200);
          }
          const names = {
            burn:'🔥燃焼', poison:'☠️毒', stun:'💫気絶', paralyze:'⚡麻痺',
            atk_up:'⬆️攻撃↑', atk_down:'⬇️攻撃↓',
            def_up:'⬆️防御↑', def_down:'⬇️防御↓',
            barrier:'♾️バリア', guard:'🛡️防御態勢',
            regen:'💚リジェネ', freeze:'🧊氷結', curse:'🖤呪い',
            sp_restore:'✨SP回復', dispel:'🌀バフ解除', shield:'🛡️シールド'
          };
          UI.log(`   ✨ <strong>${r.target.name}</strong> は <strong>${names[r.effect] || r.effect}</strong> 状態！`, 'log-status');
          UI.showStatusApplied(r.target.id, r.effect);
          if (r.effect === 'atk_up')   UI.queueFloat(r.target.id, '⬆️攻', 'float-buff float-from-bottom');
          else if (r.effect === 'atk_down') UI.queueFloat(r.target.id, '⬇️攻', 'float-debuff float-down');
          {
            const _effectSe = {
              burn: 'fire', poison: 'poison_se', curse: 'dark',
              stun: 'shock', paralyze: 'shock', freeze: 'freeze',
              atk_down: 'debuff', def_down: 'debuff',
              atk_up: 'stat_up', def_up: 'stat_up',
              regen: 'recover', barrier: 'barrier_se', guard: 'barrier_se',
              shield: 'barrier_se', sp_restore: 'buff',
            };
            const _seName = _effectSe[r.effect];
            if (_seName && !_statusDebuffSePlayed) { Audio.SE[_seName]?.(); _statusDebuffSePlayed = true; }
          }
          break;
        }

        case 'status_miss':
          UI.log(`   … 状態異常は効かなかった。`, 'log-status');
          UI.showStatusApplied(r.target.id, 'resist');
          Audio.SE.cancel();
          if (!r.target.isEnemy && typeof ACH !== 'undefined') ACH.onResist();
          break;

        case 'instakill':
          UI.flashCard(r.target.id, 'defeated-flash');
          UI.floatNumber(r.target.id, '即死💀', 'float-crit');
          UI.log(`💀 <strong>${r.target.name}</strong> は即死！`, 'log-crit');
          Audio.SE.enemyDefeat();
          applyOnKillRelics(actor, r.target);
          if (r.target.isEnemy) setTimeout(() => UI.collapseEnemyCard(r.target.id), 800);
          break;

        case 'barrier':
          UI.floatNumber(r.target.id, 'GUARD♾️', 'float-heal');
          UI.log(`♾️ <strong>${r.target.name}</strong> のバリアが攻撃を防いだ！`, 'log-status');
          break;

        case 'shield_block':
          UI.floatNumber(r.target.id, 'SHIELD🛡️', 'float-heal');
          UI.log(`🛡️ <strong>${r.target.name}</strong> のシールドがダメージを吸収した！`, 'log-status');
          break;

        case 'self_shield':
          UI.floatNumber(r.target.id, `+${r.amount}🛡️`, 'float-heal');
          UI.log(`🛡️ <strong>${r.target.name}</strong> にシールド ${r.amount} 付与！`, 'log-status');
          UI.showStatusApplied(r.target.id, 'shield');
          break;

        case 'recoil':
          UI.updateCharBars(r.target);
          UI.floatNumber(r.target.id, `-${r.amount}`, 'float-damage');
          UI.log(`💢 <strong>${r.target.name}</strong> は反動で <strong>${r.amount}</strong> のダメージ！`, 'log-damage');
          break;

        case 'self_stun':
          UI.log(`💫 <strong>${r.target.name}</strong> は力を使い果たし、行動不能になった！`, 'log-status');
          break;

        case 'ally_splash':
          UI.updateCharBars(r.target);
          UI.floatNumber(r.target.id, `-${r.amount}`, 'float-damage');
          UI.log(`💥 <strong>${r.target.name}</strong> が爆発に巻き込まれた！ <strong>${r.amount}</strong>`, 'log-damage');
          if (r.target.isDefeated) {
            UI.flashCard(r.target.id, 'defeated-flash');
            UI.log(`💀 <strong>${r.target.name}</strong> は巻き込まれて倒れた！`, 'log-damage');
          }
          break;

        case 'self_effect': {
          const SELF_EFFECT_NAMES = { atk_up:'⬆️攻撃UP', atk_down:'⬇️攻撃DOWN', def_up:'⬆️防御UP', def_down:'⬇️防御DOWN', regen:'💚リジェネ', barrier:'♾️バリア' };
          UI.log(`⚡ <strong>${r.target.name}</strong> に ${SELF_EFFECT_NAMES[r.effect] || r.effect} が発生した！`, 'log-status');
          UI.showStatusApplied(r.target.id, r.effect);
          if (r.effect === 'atk_up')   UI.queueFloat(r.target.id, '⬆️攻', 'float-buff float-from-bottom');
          else if (r.effect === 'atk_down') UI.queueFloat(r.target.id, '⬇️攻', 'float-debuff float-down');
          {
            const _selfEffectSe = {
              atk_down: 'debuff', def_down: 'debuff',
              atk_up: 'stat_up', def_up: 'stat_up',
              regen: 'recover', barrier: 'barrier_se',
            };
            const _sn = _selfEffectSe[r.effect];
            if (_sn && !_statusDebuffSePlayed) { Audio.SE[_sn]?.(); _statusDebuffSePlayed = true; }
          }
          break;
        }

        case 'counter':
          UI.updateCharBars(r.target);
          UI.floatNumber(r.target.id, `-${r.amount}`, 'float-dmg');
          UI.flashPassive(r.source.id, 'passive-flash');
          UI.log(`🔄 <strong>${r.source.name}</strong>「${r.source.passive?.name}」：${r.amount}反射！`, 'log-status');
          if (r.target.isDefeated) {
            UI.flashCard(r.target.id, 'defeated-flash');
            UI.log(`💀 <strong>${r.target.name}</strong> は反射ダメージで倒れた！`, 'log-enemy');
            Audio.SE.enemyDefeat();
            applyOnKillRelics(r.source, r.target);   // 倒したのは反射した味方
            if (r.target.isEnemy) setTimeout(() => UI.collapseEnemyCard(r.target.id), 800);
          }
          break;

        case 'reflect_dmg':
          UI.updateCharBars(r.target);
          UI.floatNumber(r.target.id, `-${r.amount}`, 'float-dmg');
          UI.flashCard(r.source.id, 'relic-flash');
          UI.log(`🔄 <strong>${r.source.name}</strong> の棘が <strong>${r.amount}</strong> 反射！`, 'log-status');
          if (r.target.isDefeated) {
            UI.flashCard(r.target.id, 'defeated-flash');
            UI.log(`💀 <strong>${r.target.name}</strong> は反射ダメージで倒れた！`, 'log-enemy');
            Audio.SE.enemyDefeat();
            applyOnKillRelics(r.source, r.target);   // 倒したのは棘で反射した味方
            if (r.target.isEnemy) setTimeout(() => UI.collapseEnemyCard(r.target.id), 800);
          }
          break;

        case 'survive_fatal':
          UI.updateCharBars(r.target);
          UI.floatNumber(r.target.id, '✋くいしばり!', 'float-heal');
          UI.log(`✋ <strong>${r.target.name}</strong> は令呪の力でHP1で耐えた！`, 'log-status');
          break;

        case 'passive_proc':
          UI.updateCharBars(r.target);
          UI.floatNumber(r.target.id, `⚡${r.text}`, 'float-buff');
          UI.flashPassive(r.target.id, 'passive-flash');
          UI.log(`⚡ <strong>${r.target.name}</strong> の「${r.name}」が発動！${r.text}`, 'log-status');
          break;

        case 'summon_request': {
          const summonCap = 3;   // スマホの画面幅に収めるため全状況で3体まで
          if (Battle.getLivingEnemies().length >= summonCap) {
            UI.log(`📣 <strong>${r.target.name}</strong> は仲間を呼んだ…しかし誰も来なかった！`, 'log-enemy');
            break;
          }
          const pool = ENEMY_DATA.filter(e => e.role !== 'support');
          const data = pool[Math.floor(Math.random() * pool.length)];
          const ne = makeEnemy({ ...data, id: `${data.id}_s${Date.now() % 100000}` });
          Battle.addEnemy(ne);
          UI.renderEnemyArea(Battle.getEnemies());
          Battle.getEnemies().forEach(e => UI.updateCharBars(e));
          Battle.getLivingEnemies().forEach(e => {
            const sk = e._nextSkillId ? ENEMY_SKILL_DATA[e._nextSkillId] : null;
            UI.updateEnemyNextAction(e, sk, Battle.getLivingAllies());
          });
          UI.log(`📣 <strong>${r.target.name}</strong> は仲間を呼んだ！ <strong>${ne.name}</strong> が現れた！`, 'log-enemy');
          UI.updateLethalWarning();
          if (typeof ACH !== 'undefined') ACH.onSummonWitnessed();
          break;
        }
      }
    }
    updateAceStatus();
  }

  function updateAceStatus() {}

  // ---- Battle End ----
  function handleBattleEnd(result) {
    Audio.stopBGM();
    isBusy = true;
    const boss = isBossBattle();


    if (result === 'win') {
      setTimeout(async () => {
        // 実績追跡
        if (typeof ACH !== 'undefined') ACH.onBattleFought();
        if (isFinalBattle()) {
          // 最終決戦勝利 → ゲームクリア
          if (typeof ACH !== 'undefined') ACH.onGameClear();
          Audio.SE.clearFanfare();
          activeAllies.forEach(a => { a.hp = a.maxHp; a.isDefeated = false; a.statusEffects = []; a.statMods = { atk: 1, defMult: 1 }; a.hasBarrier = false; a.shieldHp = 0; });
          restoreSp();
          UI.log(`🏆 <strong>最終決戦勝利！すべてのWAVEを制覇した！</strong>`, 'log-system');
          await delay(1500);
          endGame(true);
          return;
        }
        if (boss) {
          // Boss victory: full restore + loopCount++ + show 3-candidate swap event
          loopCount++;
          const allAlive = activeAllies.filter(a => !a.isDefeated).length;
          activeAllies.forEach(a => {
            a.hp = a.maxHp;
            a.isDefeated = false;
            a.statusEffects = [];
            a.statMods = { atk: 1, defMult: 1 };
            a.hasBarrier = false;
            a.shieldHp = 0;
            a.isGuarding = false;
            a._ppRegenCounter = 0;
            a._awakened = false;
            a._gutsUsed = false;
          });
          restoreSp();
          // ボス実績
          if (typeof ACH !== 'undefined') {
            const seriesMap = {};
            activeAllies.forEach(a => { if(a.origin) seriesMap[a.origin]=(seriesMap[a.origin]||0)+1; });
            ACH.onBossDefeated({
              loopCount,
              partyHasRarity3: activeAllies.some(a => (CHAR_RARITY && CHAR_RARITY[a.id]) === 3),
              seriesCount3: Object.values(seriesMap).some(c => c >= 3),
              allAliveCount: allAlive,
              loopDifficulty: loopCount - 1,
              party: activeAllies
            });
          }
          Audio.SE.victory();
          UI.log(`👑 <strong>ボス撃破！</strong> HP・SP <strong>全回復！</strong>`, 'log-system');
          UI.log(`🔄 <strong>${loopCount + 1}セット目</strong> へ進む！`, 'log-system');
          await delay(1200);
          // レリックドロップ → キャラ追加（高レア寄り）
          const pool = getEnabledCharPool().filter(a => !activeAllies.some(p => p.id === a.id));
          const partyHasRare3 = activeAllies.some(a => (CHAR_RARITY[a.id] || 0) === 3);
          let candidates;
          if (!partyHasRare3) {
            const rare3pool = pool.filter(a => (CHAR_RARITY[a.id] || 0) === 3);
            if (rare3pool.length > 0) {
              const guaranteed = rare3pool[Math.floor(Math.random() * rare3pool.length)];
              const rest = pickWeightedCandidates(pool.filter(a => a.id !== guaranteed.id), 2, makeTierWeights('boss'));
              candidates = [guaranteed, ...rest];
            } else {
              candidates = pickWeightedCandidates(pool, 3, makeTierWeights('boss'));
            }
          } else {
            candidates = pickWeightedCandidates(pool, 3, makeTierWeights('boss'));
          }
          const bossRelicCandidates = (typeof Relics !== 'undefined') ? Relics.pickDropCandidates() : [];
          const doSwap = () => {
            UI.showSwapOverlay(candidates, activeAllies, (chosenCharId, swapOutId) => {
              const doFinish = () => {
                showAchievementNotifs(() => {
                  UI.showBattleResult('win', 'full', () => { isBusy = false; nextBattle(); });
                });
              };
              if (chosenCharId && swapOutId) {
                const chosenData = candidates.find(c => c.id === chosenCharId);
                const idx = activeAllies.findIndex(a => a.id === swapOutId);
                if (idx !== -1 && chosenData) {
                  activeAllies.splice(idx, 1, makeCombatant(chosenData));
                  _runParticipants.add(chosenData.id);
                  updateSpForPartyChange();
                  if (typeof ACH !== 'undefined') ACH.onCharUsed(chosenData.id);
                  const quote = JOIN_QUOTES[chosenData.id];
                  UI.showJoinOverlay(chosenData, quote, doFinish);
                  return;
                }
              }
              doFinish();
            }, '👑 ボス撃破！仲間チェンジのチャンス！');
          };
          if (bossRelicCandidates.length > 0) {
            showRelicDropOverlay(bossRelicCandidates, () => doSwap());
          } else {
            doSwap();
          }
        } else if (isMidBossBattle()) {
          // 中ボス撃破: loopCount++（セット2へ）、HP・PP全回復 ＋ キャラ追加（低レア寄り）
          loopCount++;
          activeAllies.forEach(a => {
            a.hp = a.maxHp;
            a.isDefeated = false;
            a.statusEffects = [];
            a.statMods = { atk: 1, defMult: 1 };
            a.hasBarrier = false;
            a.shieldHp = 0;
            a.isGuarding = false;
            a._ppRegenCounter = 0;
            a._awakened = false;
            a._gutsUsed = false;
          });
          restoreSp();
          Audio.SE.victory();
          UI.log(`☆ <strong>中ボス撃破！</strong> HP・SP <strong>全回復！</strong>`, 'log-system');
          await delay(800);
          const mbPool = getEnabledCharPool().filter(a => !activeAllies.some(p => p.id === a.id));
          const mbCandidates = pickWeightedCandidates(mbPool, 3, makeTierWeights('midboss'));
          const mbRelicCandidates = (typeof Relics !== 'undefined') ? Relics.pickDropCandidates() : [];
          const doMbSwap = () => {
            UI.showSwapOverlay(mbCandidates, activeAllies, (chosenCharId, swapOutId) => {
              const doMbFinish = () => {
                showAchievementNotifs(() => {
                  UI.showBattleResult('win', 'full', () => { isBusy = false; nextBattle(); });
                });
              };
              if (chosenCharId && swapOutId) {
                const chosenData = mbCandidates.find(c => c.id === chosenCharId);
                const idx = activeAllies.findIndex(a => a.id === swapOutId);
                if (idx !== -1 && chosenData) {
                  activeAllies.splice(idx, 1, makeCombatant(chosenData));
                  _runParticipants.add(chosenData.id);
                  updateSpForPartyChange();
                  if (typeof ACH !== 'undefined') ACH.onCharUsed(chosenData.id);
                  const quote = JOIN_QUOTES[chosenData.id];
                  UI.showJoinOverlay(chosenData, quote, doMbFinish);
                  return;
                }
              }
              doMbFinish();
            }, '☆ 中ボス撃破！仲間チェンジのチャンス！');
          };
          if (mbRelicCandidates.length > 0) {
            showRelicDropOverlay(mbRelicCandidates, () => doMbSwap());
          } else {
            doMbSwap();
          }
        } else {
          // Normal battle: NO swap, NO relic
          const healPctLabel = 0;
          // 通常戦闘実績
          if (typeof ACH !== 'undefined') {
            const isHighHP = activeAllies.every(a => a.isDefeated || a.hp / a.maxHp >= 0.5);
            ACH.onNormalBattleWon({
              isHighHP,
              partyOrigins: activeAllies.map(a => a.origin),
              party: activeAllies
            });
          }
          // 死亡キャラをHP1で復活（通常戦闘のみ）
          const revivedAllies = activeAllies.filter(a => a.isDefeated);
          if (revivedAllies.length > 0) {
            revivedAllies.forEach(a => {
              a.isDefeated = false;
              a.hp = 1;
              a.statusEffects = [];
              a.statMods = { atk: 1, defMult: 1 };
              a.hasBarrier = false;
              a.shieldHp = 0;
              a.isGuarding = false;
              a._ppRegenCounter = 0;
              a._awakened = false;
              a._gutsUsed = false;
              UI.updateCharBars(a);
            });
            UI.log(`💗 ${revivedAllies.map(a => `<strong>${a.name}</strong>`).join('、')} が <strong>HP1</strong> で復活！`, 'log-status');
          }
          Audio.SE.victory();
          const doShowResult = (droppedRelic) => {
            showAchievementNotifs(() => {
              UI.showBattleResult('win', healPctLabel,
                () => { isBusy = false; nextBattle(); },
                droppedRelic
              );
            });
          };
          if (typeof Relics !== 'undefined') {
            const candidates = Relics.pickDropCandidates();
            if (candidates.length > 0) {
              showRelicDropOverlay(candidates, (relic) => {
                if (relic) UI.log(`✨ <strong>${relic.emoji} ${relic.name}</strong> を入手！`, 'log-status');
                doShowResult(relic);
              });
            } else {
              doShowResult(null);
            }
          } else {
            doShowResult(null);
          }
        }
      }, 800);
    } else {
      setTimeout(() => {
        UI.showBattleResult('lose', 0, () => endGame(false));
      }, 800);
    }
  }

  function endGame(won) {
    isBusy = false;
    if (won) {
      if (typeof ACH !== 'undefined') {
        _runParticipants.forEach(id => ACH.onCharUsed(id));
        if (typeof Relics !== 'undefined') Relics.getHeld().forEach(id => ACH.onRelicObtained(id));
      }
      showAchievementNotifs(() => {
        UI.showBattleResult('clear', 0, () => {
          currentBattle = 0; loopCount = 0; activeAllies = [];
          goTitleScreen();
        });
      });
    } else {
      currentBattle = 0; loopCount = 0; activeAllies = [];
      goTitleScreen();
    }
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ---- レリックドロップオーバーレイ ----
  function showRelicDropOverlay(candidates, callback) {
    const overlay = document.getElementById('relic-overlay');
    const choicesDiv = document.getElementById('relic-choices');
    if (!overlay || !choicesDiv) { callback(); return; }

    choicesDiv.innerHTML = candidates.map(r => {
      const stars = r.rarity === 3 ? '★★★' : r.rarity === 2 ? '★★' : '★';
      const starColor = r.rarity === 3 ? '#ffcc44' : r.rarity === 2 ? '#aabbcc' : '#778899';
      return `
      <div class="relic-card" data-id="${r.id}" data-rarity="${r.rarity || 2}">
        <div class="relic-emoji">${r.emoji}</div>
        <div class="relic-name">${r.name} <span style="color:${starColor};font-size:0.7rem">${stars}</span></div>
        <div class="relic-origin">${r.origin}</div>
        <div class="relic-desc">${r.desc}</div>
      </div>`;
    }).join('');

    overlay.classList.add('active');

    choicesDiv.querySelectorAll('.relic-card').forEach((cardEl, i) => {
      cardEl.classList.add('relic-hidden');
      setTimeout(() => {
        cardEl.classList.remove('relic-hidden');
        cardEl.classList.add('relic-reveal');
        const rarity = Number(cardEl.dataset.rarity);
        if (rarity === 3) {
          Audio.SE.gachaFanfare();
          cardEl.classList.add('relic-flash-gold');
        } else if (rarity === 2) {
          Audio.SE.buff();
        } else {
          Audio.SE.select();
        }
      }, 300 + i * 420);
    });

    const handlePick = (relicId) => {
      overlay.classList.remove('active');
      choicesDiv.innerHTML = '';
      const relic = RELIC_DATA.find(r => r.id === relicId) ?? null;
      if (typeof Relics === 'undefined') { callback(relic); return; }
      if (Relics.isAtMax()) {
        showRelicDiscardOverlay(relicId, () => callback(relic));
      } else {
        Relics.addRelic(relicId);
        applyHpRelicToParty(relicId);
        applyRelicPickupEffect(relicId);
        callback(relic);
      }
    };

    choicesDiv.querySelectorAll('.relic-card').forEach(card => {
      card.addEventListener('click', () => handlePick(card.dataset.id));
    });

  }

  function applyHpRelicToParty(relicId) {
    const relic = RELIC_DATA.find(r => r.id === relicId);
    if (!relic || relic.effect?.type !== 'hp_boost') return;
    const newMult = (typeof Relics !== 'undefined') ? Relics.getHpBoostMultiplier() : 1.0;
    let anyHealed = false;
    activeAllies.forEach(a => {
      if (a.isDefeated || !a.baseMaxHp) return;
      const newMaxHp = Math.floor(a.baseMaxHp * newMult);
      const delta = newMaxHp - a.maxHp;
      a.maxHp = newMaxHp;
      if (delta > 0) {
        a.hp = Math.min(a.maxHp, a.hp + delta);
        UI.floatNumber(a.id, `❤️+${delta}`, 'float-heal');
        anyHealed = true;
      }
      UI.updateCharBars(a);
    });
    if (anyHealed) UI.log(`💎 <strong>${relic.name}</strong> — 全員のHP上限＆現在HP増加！`, 'log-status');
  }

  function showRelicDiscardOverlay(newRelicId, callback) {
    const overlay = document.getElementById('relic-discard-overlay');
    const choicesDiv = document.getElementById('relic-discard-choices');
    if (!overlay || !choicesDiv || typeof Relics === 'undefined') {
      Relics.addRelic(newRelicId);
      applyHpRelicToParty(newRelicId);
      applyRelicPickupEffect(newRelicId);
      callback();
      return;
    }

    const newRelic = RELIC_DATA.find(r => r.id === newRelicId);
    const held = Relics.getHeld();
    const allFour = [...held, newRelicId];

    choicesDiv.innerHTML = `
      <p class="relic-discard-prompt">どれを手放しますか？（クリックで選択）</p>
      ${allFour.map(id => {
        const r = RELIC_DATA.find(x => x.id === id);
        const isNew = id === newRelicId;
        return `<div class="relic-discard-item${isNew ? ' is-new' : ''}" data-id="${id}">
          <span class="relic-emoji">${r.emoji}</span>
          <span class="relic-discard-name">${r.name}${isNew ? ' <span class="new-badge">NEW</span>' : ''}</span>
          <span class="relic-discard-origin">${r.origin}</span>
          <span class="relic-discard-desc">${r.desc}</span>
        </div>`;
      }).join('')}
    `;

    overlay.classList.add('active');

    choicesDiv.querySelectorAll('.relic-discard-item').forEach(item => {
      item.addEventListener('click', () => {
        const discardId = item.dataset.id;
        overlay.classList.remove('active');
        if (discardId !== newRelicId) {
          Relics.removeRelic(discardId);
          Relics.addRelic(newRelicId);
          applyHpRelicToParty(newRelicId);
          applyRelicPickupEffect(newRelicId);
        }
        callback();
      });
    });
  }

  // ---- 実績通知 ----
  function showAchievementNotifs(callback) {
    if (typeof ACH === 'undefined') { callback(); return; }
    const notifs = ACH.popNotifs();
    if (notifs.length === 0) { callback(); return; }
    const overlay = document.getElementById('ach-notif-overlay');
    const box = document.getElementById('ach-notif-box');
    if (!overlay || !box) { callback(); return; }

    box.innerHTML = notifs.map(a => `
      <div class="ach-notif-item">
        <span class="ach-notif-icon">${a.icon}</span>
        <div>
          <div class="ach-notif-name">実績解除：${a.name}</div>
          <div class="ach-notif-desc">${a.desc}</div>
        </div>
      </div>
    `).join('');

    overlay.classList.add('active');
    const okBtn = document.getElementById('ach-notif-ok');
    if (okBtn) {
      okBtn.onclick = () => { overlay.classList.remove('active'); callback(); };
    }
  }

  // ---- 登場作品アイコン ----
  const ORIGIN_ICONS = {
    'ドラゴンボール': '🐉',
    'NARUTO': '🍥',
    'ONE PIECE': '🏴‍☠️',
    'ワンパンマン': '👊',
    '鬼滅の刃': '👹',
    'SAO': '⚔️',
    'Re:ゼロ': '🔄',
    'ポケモン': '⚡',
    '鋼の錬金術師': '⚗️',
    '呪術廻戦': '👁️',
    'BLEACH': '⚰️',
    'HUNTER×HUNTER': '🎣',
    '僕のヒーローアカデミア': '🦸',
    'ジョジョの奇妙な冒険': '⭐',
    '転生したらスライムだった件': '💧',
    '魔法少女まどか☆マギカ': '🎀',
    'Fate/stay night': '🗡️',
    '東京喰種': '🎭',
    'ブラッククローバー': '🍀',
    '進撃の巨人': '🗿',
    '七つの大罪': '7️⃣',
    'FAIRY TAIL': '🧚',
    'オーバーロード': '💀',
    'この素晴らしい世界': '🎲',
    'チェンソーマン': '⛓️',
    '炎炎ノ消防隊': '🔥',
    'FINAL FANTASY': '🔮',
    'とある魔術の禁書目録': '✊',
    '葬送のフリーレン': '🧝',
    '無職転生': '🪄',
    '盾の勇者の成り上がり': '🛡️'
  };

  // ---- 登場作品スクリーン ----
  function showOriginsScreen() {
    UI.showScreen('origins-screen');
    const content = document.getElementById('origins-content');
    if (!content) return;

    const originMap = {};
    ALLY_DATA.forEach(d => {
      const o = d.origin || 'その他';
      if (!originMap[o]) originMap[o] = [];
      originMap[o].push(d);
    });
    // ALLY_DATA の定義順（コード順）のまま表示する
    const sorted = Object.entries(originMap);
    const enabledCount = sorted.filter(([o]) => !disabledOrigins.has(o)).length;

    let html = '<div class="origins-root">';
    html += `<div class="origins-info">ONの作品からキャラクターが登場します（現在 <strong>${enabledCount}/${sorted.length}</strong> 作品有効）</div>`;
    html += '<div class="origins-bulk"><button class="origin-bulk-btn" id="all-on-btn">全てON</button><button class="origin-bulk-btn tog-off" id="all-off-btn">全てOFF</button></div>';
    html += `<div class="series-bonus-row"><span class="series-bonus-label">⭐ シリーズボーナス</span><button class="origin-toggle${seriesBonusEnabled ? ' tog-on' : ' tog-off'}" id="series-bonus-btn">${seriesBonusEnabled ? 'ON' : 'OFF'}</button></div>`;
    html += '<div class="origins-list">';
    sorted.forEach(([origin, chars]) => {
      const isOn = !disabledOrigins.has(origin);
      const icon = ORIGIN_ICONS[origin] || chars[0].emoji || '📺';
      html += `<div class="origin-row${isOn ? '' : ' origin-off'}">
        <span class="origin-name">${icon} ${origin}</span>
        <span class="origin-count">${chars.length}体</span>
        <button class="origin-toggle${isOn ? ' tog-on' : ' tog-off'}" data-origin="${origin}">${isOn ? 'ON' : 'OFF'}</button>
      </div>`;
    });
    html += '</div></div>';
    content.innerHTML = html;

    content.querySelector('#all-on-btn').addEventListener('click', () => {
      disabledOrigins.clear();
      saveDisabledOrigins();
      showOriginsScreen();
    });
    content.querySelector('#all-off-btn').addEventListener('click', () => {
      const allOrigins = [...new Set(ALLY_DATA.map(d => d.origin || 'その他'))];
      allOrigins.slice(1).forEach(o => disabledOrigins.add(o));
      saveDisabledOrigins();
      showOriginsScreen();
    });
    content.querySelector('#series-bonus-btn').addEventListener('click', () => {
      seriesBonusEnabled = !seriesBonusEnabled;
      saveSeriesBonusEnabled();
      showOriginsScreen();
    });

    content.querySelectorAll('.origin-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const o = btn.dataset.origin;
        const currentlyOn = !disabledOrigins.has(o);
        const allOrigins = [...new Set(ALLY_DATA.map(d => d.origin || 'その他'))];
        const enabledOrigins = allOrigins.filter(x => !disabledOrigins.has(x));
        if (currentlyOn && enabledOrigins.length <= 1) return;
        if (currentlyOn) disabledOrigins.add(o);
        else disabledOrigins.delete(o);
        saveDisabledOrigins();
        showOriginsScreen();
      });
    });
  }

  // ---- 設定 ----
  // タイトル画面の設定スクリーンと、戦闘中トップバーの設定モーダルで同じ内容を共用する
  // スマホ向け一括設定。「画面を狭く使うための表示省略」だけをまとめて切り替える。
  // 状態は個別設定から導出するので、あとから個別に触っても表示がズレない。
  //
  // 省電力(lowPower)はここに含めない。画面の広さと電池の持ちは別の軸で、
  // 縦に余裕のある最近のスマホでもアニメーションは止めておきたいため、
  // 一括設定とは独立に initDeviceDefaults でスマホなら常にONにしている
  function isMobilePresetOn() {
    return !showCardInfo && !showTurnHeader && !showPassiveName
        && mergeRoleName;
  }
  function setMobilePreset(on) {
    showCardInfo    = !on;   // 作品名・レア度
    showTurnHeader  = !on;   // 「〇〇のターン！」
    showPassiveName = !on;   // パッシブ名
    mergeRoleName   = on;    // ロールを名前と合体（ONで省スペース）
    saveShowCardInfo(); saveShowTurnHeader(); saveShowPassiveName();
    saveMergeRoleName();
    applyShowCardInfo(); applyShowTurnHeader(); applyShowPassiveName();
    applyMergeRoleName();
  }

  // 初回起動時だけ、実際の画面サイズを見て既定を決める。
  // 保存済みのキーがあれば「一度でも自分で設定を触った」ということなので保存値を優先する。
  // 省電力と表示省略は別々に判定するので、判定も別々に書く。
  // PCでは何もしない（勝手にフル表示や省電力へ倒さない）
  function initDeviceDefaults() {
    const isPhone = window.matchMedia('(max-width: 640px)').matches;
    if (!isPhone) return;

    // 省電力: スマホなら画面の広さに関係なく既定ON。
    // 光り続ける演出は発熱と電池に直結するので、縦に余裕がある端末でも止めておく
    if (localStorage.getItem('icb_lowPower') === null) {
      lowPower = true;
      saveLowPower();
      applyLowPower();
    }

    // 表示省略: 縦が短い端末だけ既定ON。
    // 省略は1画面に収めるための妥協なので、縦に余裕があるなら最初からフル表示でよい。
    // 730px の根拠: iPhone SE2/SE3 が 667px、iPhone 12〜15 が 844px。その間で切る
    const DISPLAY_KEYS = ['icb_showCardInfo', 'icb_showTurnHeader',
                          'icb_showPassiveName', 'icb_mergeRoleName'];
    if (DISPLAY_KEYS.every(k => localStorage.getItem(k) === null)
        && window.matchMedia('(max-height: 730px)').matches) {
      setMobilePreset(true);
    }
  }

  // 設定画面では「ONで省スペース／省エネ」に統一している。
  // showCardInfo / showTurnHeader / showPassiveName は内部的には「表示するか」を持つため、
  // ボタンの表示だけ反転させている（保存キーの意味は変えていないので既存の設定値はそのまま使える）
  function settingsRowsHtml() {
    const mp = isMobilePresetOn();
    return `<div class="settings-list">
      <div class="settings-row">
        <span class="settings-label">⚔️ 行動時に通常攻撃を自動選択<div class="settings-desc">ONにすると、キャラのターンが来た時に通常攻撃があらかじめ選択された状態になります</div></span>
        <button class="origin-toggle${autoSelectNormalAtk ? ' tog-on' : ' tog-off'}" data-setting="autoAtk">${autoSelectNormalAtk ? 'ON' : 'OFF'}</button>
      </div>
      <div class="settings-row">
        <span class="settings-label">🎵 BGM<div class="settings-desc">戦闘中のBGMを鳴らします</div></span>
        <button class="origin-toggle${Audio.isBGMOn() ? ' tog-on' : ' tog-off'}" data-setting="bgm">${Audio.isBGMOn() ? 'ON' : 'OFF'}</button>
      </div>
      <div class="settings-row">
        <span class="settings-label">🔊 効果音<div class="settings-desc">攻撃・回復などの効果音を鳴らします</div></span>
        <button class="origin-toggle${Audio.isSEOn() ? ' tog-on' : ' tog-off'}" data-setting="se">${Audio.isSEOn() ? 'ON' : 'OFF'}</button>
      </div>
      <!-- 省電力は「画面を狭く使う」話ではなく電池の話なので一括設定には入れない。
           スマホでは initDeviceDefaults が既定でONにする -->
      <div class="settings-row">
        <span class="settings-label">🔋 省電力モード<div class="settings-desc">カードやSPが光り続ける演出を止めます。発熱や電池の減りが気になるときに。ダメージ表示など進行に必要な演出は残ります。スマホでは最初からONです</div></span>
        <button class="origin-toggle${lowPower ? ' tog-on' : ' tog-off'}" data-setting="lowPower">${lowPower ? 'ON' : 'OFF'}</button>
      </div>

      <div class="settings-group">
        <div class="settings-row settings-row-master">
          <span class="settings-label">📱 スマホ設定（一括）<div class="settings-desc">この枠の中の4つをまとめて切り替えます。ONで省スペース表示、OFFでフル表示に戻ります</div></span>
          <button class="origin-toggle${mp ? ' tog-on' : ' tog-off'}" data-setting="mobilePreset">${mp ? 'ON' : 'OFF'}</button>
        </div>
        <div class="settings-row settings-row-child">
          <span class="settings-label">🎬 作品名・レア度を省略<div class="settings-desc">ONにすると、キャラカードの名前の下にある登場作品・レア度・性別/職業を隠してカードを小さくします</div></span>
          <button class="origin-toggle${!showCardInfo ? ' tog-on' : ' tog-off'}" data-setting="cardInfo">${!showCardInfo ? 'ON' : 'OFF'}</button>
        </div>
        <div class="settings-row settings-row-child">
          <span class="settings-label">🗣️ 「〇〇のターン！」を省略<div class="settings-desc">ONにすると、スキルパネル上の行動中キャラの見出しを消して1行分詰めます</div></span>
          <button class="origin-toggle${!showTurnHeader ? ' tog-on' : ' tog-off'}" data-setting="turnHeader">${!showTurnHeader ? 'ON' : 'OFF'}</button>
        </div>
        <div class="settings-row settings-row-child">
          <span class="settings-label">◆ パッシブ名を省略<div class="settings-desc">ONにすると、味方・敵カードのパッシブ名を消して効果の説明だけにし、1行分詰めます</div></span>
          <button class="origin-toggle${!showPassiveName ? ' tog-on' : ' tog-off'}" data-setting="passiveName">${!showPassiveName ? 'ON' : 'OFF'}</button>
        </div>
        <div class="settings-row settings-row-child">
          <span class="settings-label">🎖️ ロールを名前と合体させて省略<div class="settings-desc">ONにすると、ロールのアイコンを名前の前に置いて背景をロールカラーにし、独立したバッジ行を消します</div></span>
          <button class="origin-toggle${mergeRoleName ? ' tog-on' : ' tog-off'}" data-setting="mergeRole">${mergeRoleName ? 'ON' : 'OFF'}</button>
        </div>
      </div>
    </div>`;
  }

  // BGMをONに戻したとき、今の状況に合った曲を鳴らし直す
  // （戦闘開始時と同じ分岐ルール。戦闘外なら鳴らさない）
  function startContextBGM() {
    const inBattle = document.getElementById('battle-screen')?.classList.contains('active');
    if (!inBattle) return;
    if (isFinalBattle())                          Audio.startBGM('final');
    else if (isBossBattle() || isMidBossBattle()) Audio.startBGM('boss');
    else if (loopCount === 2)                     Audio.startBGM('third');
    else                                          Audio.startBGM('normal');
  }

  // data-setting でトグルを識別する。値を反転・保存したあと rerender で表示を更新
  function wireSettingsRows(container, rerender) {
    container.querySelectorAll('[data-setting]').forEach(btn => {
      btn.addEventListener('click', () => {
        try { Audio.SE.cursor(); } catch(e) {}
        if (btn.dataset.setting === 'mobilePreset') {
          setMobilePreset(!isMobilePresetOn());
        } else if (btn.dataset.setting === 'autoAtk') {
          autoSelectNormalAtk = !autoSelectNormalAtk;
          saveAutoSelectNormalAtk();
        } else if (btn.dataset.setting === 'cardInfo') {
          showCardInfo = !showCardInfo;
          saveShowCardInfo();
          applyShowCardInfo();   // body クラスを切り替えるだけなので戦闘中でも即座に反映される
        } else if (btn.dataset.setting === 'turnHeader') {
          showTurnHeader = !showTurnHeader;
          saveShowTurnHeader();
          applyShowTurnHeader();
        } else if (btn.dataset.setting === 'passiveName') {
          showPassiveName = !showPassiveName;
          saveShowPassiveName();
          applyShowPassiveName();
        } else if (btn.dataset.setting === 'mergeRole') {
          mergeRoleName = !mergeRoleName;
          saveMergeRoleName();
          applyMergeRoleName();
        } else if (btn.dataset.setting === 'lowPower') {
          lowPower = !lowPower;
          saveLowPower();
          applyLowPower();
        } else if (btn.dataset.setting === 'bgm') {
          if (Audio.toggleBGM()) startContextBGM();
        } else if (btn.dataset.setting === 'se') {
          Audio.toggleSE();
        }
        rerender();
      });
    });
  }

  // タイトル画面の設定スクリーン
  function showSettingsScreen() {
    UI.showScreen('settings-screen');
    const content = document.getElementById('settings-content');
    if (!content) return;
    content.innerHTML = `<div class="settings-root">${settingsRowsHtml()}</div>`;
    wireSettingsRows(content, showSettingsScreen);
  }

  // 戦闘中トップバーの⚙️から開くモーダル。設定スクリーンと同じ変数を使うので双方が連動する
  function renderSettingsModal() {
    const body = document.getElementById('settings-modal-body');
    if (!body) return;
    body.innerHTML = settingsRowsHtml();
    wireSettingsRows(body, renderSettingsModal);
  }

  // ---- 図鑑・実績スクリーン ----
  function showCollectionScreen(tab) {
    UI.showScreen('collection-screen');
    const content = document.getElementById('collection-content');
    if (!content) return;
    const t = tab || 'chars';

    if (t === 'chars') {
      const seenChars = (typeof ACH !== 'undefined') ? ACH.getSeenChars() : new Set();
      // Group by origin
      const originMap = {};
      ALLY_DATA.forEach(d => {
        const o = d.origin || 'その他';
        if (!originMap[o]) originMap[o] = [];
        originMap[o].push(d);
      });
      let html = '<div class="coll-chars">';
      // 登場作品スクリーンと同じ並び（ALLY_DATA の定義順）で表示する
      Object.entries(originMap).forEach(([origin, chars]) => {
        html += `<div class="coll-origin-group"><div class="coll-origin-title">${origin}</div><div class="coll-char-row">`;
        chars.forEach(d => {
          const seen = seenChars.has(d.id);
          const rarity = (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[d.id]) || 2;
          const stars = '★'.repeat(rarity);
          if (seen) {
            html += `<div class="coll-char-card seen" title="${d.name}">
              <div class="coll-char-emoji">${d.emoji}</div>
              <div class="coll-char-name">${d.name}</div>
              <div class="coll-char-stars rarity${rarity}">${stars}</div>
            </div>`;
          } else {
            html += `<div class="coll-char-card unseen"><div class="coll-char-emoji">❓</div><div class="coll-char-name">???</div></div>`;
          }
        });
        html += '</div></div>';
      });
      html += `<div class="coll-total">図鑑進捗: ${seenChars.size} / ${ALLY_DATA.length} 体</div>`;
      html += '</div>';
      content.innerHTML = html;

    } else if (t === 'relics') {
      const seenRelics = (typeof ACH !== 'undefined') ? ACH.getSeenRelics() : new Set();
      let html = '<div class="coll-relics-grid">';
      RELIC_DATA.forEach(r => {
        const seen = seenRelics.has(r.id);
        if (seen) {
          html += `<div class="coll-relic-card seen">
            <div class="coll-relic-emoji">${r.emoji}</div>
            <div class="coll-relic-name">${r.name}</div>
            <div class="coll-relic-origin">${r.origin}</div>
            <div class="coll-relic-desc">${r.desc}</div>
          </div>`;
        } else {
          html += `<div class="coll-relic-card unseen">
            <div class="coll-relic-emoji">❓</div>
            <div class="coll-relic-name">???</div>
            <div class="coll-relic-origin">未入手</div>
          </div>`;
        }
      });
      html += '</div>';
      html += `<div class="coll-total">レリック進捗: ${seenRelics.size} / ${RELIC_DATA.length} 種</div>`;
      content.innerHTML = html;

    } else if (t === 'achievements') {
      const completedAchs = (typeof ACH !== 'undefined') ? ACH.getCompletedAchs() : new Set();
      const allAchs = (typeof ACH !== 'undefined') ? ACH.getAllAchs() : [];
      const done = allAchs.filter(a => completedAchs.has(a.id)).length;
      let html = `<div class="coll-ach-progress">${done} / ${allAchs.length} 達成</div><div class="coll-ach-list">`;
      allAchs.forEach(a => {
        const isComplete = completedAchs.has(a.id);
        html += `<div class="coll-ach-item${isComplete ? ' completed' : ''}">
          <span class="coll-ach-icon">${a.icon}</span>
          <div class="coll-ach-text">
            <div class="coll-ach-name">${a.name}</div>
            <div class="coll-ach-desc">${a.desc}</div>
          </div>
          <span class="coll-ach-status">${isComplete ? '✅' : '🔒'}</span>
        </div>`;
      });
      html += '</div>';
      content.innerHTML = html;
    }
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => Game.init());
