// ============================================================
// ACHIEVEMENT & ENCYCLOPEDIA SYSTEM
// localStorage で実績・図鑑進捗を永続化
// ============================================================

const ACH = (() => {
  const KEYS = {
    seenChars:    'icb_seenChars',
    seenRelics:   'icb_seenRelics',
    achievements: 'icb_achievements',
    stats:        'icb_stats'
  };

  // ---- 実績定義（30個） ----
  const ACHIEVEMENTS = [
    { id:'first_boss',      icon:'👑', name:'初陣',              desc:'最初のボスを倒す',
      check: s => s.bossesDefeated >= 1 },
    { id:'char_10',         icon:'🧑‍🤝‍🧑', name:'十人力',           desc:'10種類のキャラを使用する',
      check: (s,sc) => sc.size >= 10 },
    { id:'char_20',         icon:'⚔️',  name:'二十戦士',          desc:'20種類のキャラを使用する',
      check: (s,sc) => sc.size >= 20 },
    { id:'char_50',         icon:'🏆', name:'伝説のコレクター',   desc:'50種類のキャラを使用する',
      check: (s,sc) => sc.size >= 50 },
    { id:'rarity3_win',     icon:'⭐', name:'★の使い手',          desc:'★★★キャラを使って勝利する',
      check: s => s.rarity3Wins >= 1 },
    { id:'rarity3_five',    icon:'🌟', name:'レジェンド集め',     desc:'★★★キャラを5種類使用する',
      check: s => s.rarity3CharsUsed >= 5 },
    { id:'series_2',        icon:'🤝', name:'絆の力',             desc:'同一作品2人パーティで勝利する',
      check: s => s.series2Wins >= 1 },
    { id:'series_3_boss',   icon:'💪', name:'シリーズ統一',       desc:'同一作品3人でボスを撃破する',
      check: s => s.series3BossWins >= 1 },
    { id:'first_relic',     icon:'💎', name:'初レリック',         desc:'最初のレリックを入手する',
      check: (s,sc,sr) => sr.size >= 1 },
    { id:'relic_10',        icon:'🗃️',  name:'レリックコレクター', desc:'10種類のレリックを入手する',
      check: (s,sc,sr) => sr.size >= 10 },
    { id:'relic_25',        icon:'🏅', name:'レリックマスター',   desc:'25種類のレリックを入手する',
      check: (s,sc,sr) => sr.size >= 25 },
    { id:'relic_3_held',    icon:'💼', name:'レリック3個保持',    desc:'3個のレリックを同時に保持する',
      check: s => s.maxRelicsHeld >= 3 },
    { id:'high_hp_win',     icon:'🛡️', name:'無傷の勝利',         desc:'全員HP50%以上で通常戦闘勝利する',
      check: s => s.highHPWins >= 1 },
    { id:'tank_block_5',    icon:'🛡️', name:'タンクの盾',         desc:'タンクが5回攻撃を受け止める',
      check: s => s.tankBlocks >= 5 },
    { id:'heal_300',        icon:'💚', name:'癒しの手',           desc:'回復量の合計が1000を超える',
      check: s => s.totalHeal >= 1000 },
    { id:'set_2',           icon:'🔄', name:'第2セット突入',      desc:'2セット目に突入する',
      check: s => s.maxLoop >= 1 },
    { id:'set_3',           icon:'💫', name:'最終セットへ',       desc:'3セット目（最終セット）に突入する',
      check: s => s.maxLoop >= 2 },
    { id:'game_clear',      icon:'🏆', name:'完全制覇',           desc:'最終決戦を制してゲームクリアする',
      check: s => s.gameClears >= 1 },
    { id:'big_damage',      icon:'💥', name:'強打',               desc:'1回の攻撃で250ダメージ以上与える',
      check: s => s.maxDamage >= 250 },
    { id:'ultimate_10',     icon:'✨', name:'大技の輝き',         desc:'大技（SP3以上のスキル）を10回使用する',
      check: s => s.ultimatesUsed >= 10 },
    { id:'pokemon_master',  icon:'⚡', name:'ポケマスター',       desc:'ポケモンのキャラを使用する',
      check: s => s.usedOrigins && s.usedOrigins.includes('ポケモン') },
    { id:'kimetsu_win',     icon:'🌅', name:'鬼を斬る者',         desc:'鬼滅の刃キャラで通常戦闘に勝利する',
      check: s => s.kimetsuWins >= 1 },
    { id:'jjk_win',         icon:'👁️', name:'呪力の使い手',      desc:'呪術廻戦キャラで通常戦闘に勝利する',
      check: s => s.jjkWins >= 1 },
    { id:'revive_win',      icon:'🐦', name:'不死鳥',             desc:'復活レリックで生き延びる',
      check: s => s.reviveCount >= 1 },
    { id:'chainsaw_fan',    icon:'⛓️', name:'チェーンソー',       desc:'チェンソーマンのキャラを使用する',
      check: s => s.usedOrigins && s.usedOrigins.includes('チェンソーマン') },
    { id:'battle_30',       icon:'🗡️', name:'三十戦',             desc:'合計30回以上戦闘する',
      check: s => s.battlesFought >= 30 },
    { id:'full_survive_boss',icon:'🌟',name:'全員生存',           desc:'全員生存でボスを撃破する',
      check: s => s.fullSurviveBoss >= 1 },
    { id:'ace_first',       icon:'⭐', name:'エース覚醒',         desc:'アタッカーが敵を倒して再行動する',
      check: s => s.aceCount >= 1 },
    { id:'execute_kill',    icon:'🎯', name:'とどめの美学',       desc:'追撃スキルでHP70%以下の敵を倒す',
      check: s => s.executeKills >= 1 },
    { id:'resist_10',       icon:'🚫', name:'鉄壁の免疫',         desc:'味方が状態異常を10回レジストする',
      check: s => s.resists >= 10 },
    { id:'summon_witness',  icon:'📣', name:'増援警報',           desc:'敵が仲間を呼ぶのを目撃する',
      check: s => s.summonSeen >= 1 },
    { id:'shield_hero_fan', icon:'🛡️', name:'盾の勇者ファン',     desc:'盾の勇者の成り上がりのキャラを使用する',
      check: s => s.usedOrigins && s.usedOrigins.includes('盾の勇者の成り上がり') },
    { id:'all_roles',       icon:'🎭', name:'オールラウンダー',   desc:'全4ロールのキャラを使用する',
      check: (s,sc) => { const r = new Set(); sc.forEach(id => { const c = (typeof ALLY_DATA !== 'undefined') && ALLY_DATA.find(x => x.id === id); if (c) r.add(c.role); }); return r.size >= 4; } },
    { id:'char_100',        icon:'💯', name:'百人組手',           desc:'100種類のキャラを使用する',
      check: (s,sc) => sc.size >= 100 },

    // ---- 追加：作品別 ----
    { id:'dragonball_fan',  icon:'🐉', name:'ドラゴン使い',       desc:'ドラゴンボールのキャラを使用する',
      check: s => s.usedOrigins?.includes('ドラゴンボール') },
    { id:'naruto_fan',      icon:'🍃', name:'忍使い',             desc:'NARUTOのキャラを使用する',
      check: s => s.usedOrigins?.includes('NARUTO') },
    { id:'onepiece_fan',    icon:'⚓', name:'海賊使い',           desc:'ONE PIECEのキャラを使用する',
      check: s => s.usedOrigins?.includes('ONE PIECE') },
    { id:'bleach_fan',      icon:'⚔️', name:'死神使い',           desc:'BLEACHのキャラを使用する',
      check: s => s.usedOrigins?.includes('BLEACH') },
    { id:'bnha_fan',        icon:'💪', name:'個性の使い手',       desc:'僕のヒーローアカデミアのキャラを使用する',
      check: s => s.usedOrigins?.includes('僕のヒーローアカデミア') },
    { id:'hunter_fan',      icon:'🔮', name:'ハンター使い',       desc:'HUNTER×HUNTERのキャラを使用する',
      check: s => s.usedOrigins?.includes('HUNTER×HUNTER') },
    { id:'opm_fan',         icon:'👊', name:'ヒーロー使い',       desc:'ワンパンマンのキャラを使用する',
      check: s => s.usedOrigins?.includes('ワンパンマン') },
    { id:'sao_fan',         icon:'⚡', name:'剣士使い',           desc:'SAOのキャラを使用する',
      check: s => s.usedOrigins?.includes('SAO') },
    { id:'rezero_fan',      icon:'🔄', name:'異世界召喚者',       desc:'Re:ゼロのキャラを使用する',
      check: s => s.usedOrigins?.includes('Re:ゼロ') },
    { id:'fma_fan',         icon:'⚗️', name:'錬金術師',           desc:'鋼の錬金術師のキャラを使用する',
      check: s => s.usedOrigins?.includes('鋼の錬金術師') },
    { id:'tenslime_fan',    icon:'🟣', name:'転生スライム',       desc:'転スラのキャラを使用する',
      check: s => s.usedOrigins?.includes('転生したらスライムだった件') || s.usedOrigins?.includes('転スラ') },
    { id:'madoka_fan',      icon:'🌸', name:'魔法少女',           desc:'魔法少女まどか☆マギカのキャラを使用する',
      check: s => s.usedOrigins?.includes('魔法少女まどか☆マギカ') },
    { id:'fate_fan',        icon:'⚜️', name:'聖杯戦争参加者',     desc:'Fate/stay nightのキャラを使用する',
      check: s => s.usedOrigins?.includes('Fate/stay night') },
    { id:'aot_fan',         icon:'🗡️', name:'壁の外の戦士',       desc:'進撃の巨人のキャラを使用する',
      check: s => s.usedOrigins?.includes('進撃の巨人') },
    { id:'jojo_fan',        icon:'💎', name:'スタンド使い',       desc:'ジョジョの奇妙な冒険のキャラを使用する',
      check: s => s.usedOrigins?.includes('ジョジョの奇妙な冒険') },
    { id:'fairytail_fan',   icon:'🧲', name:'魔法使い',           desc:'FAIRY TAILのキャラを使用する',
      check: s => s.usedOrigins?.includes('FAIRY TAIL') },
    { id:'frieren_fan',     icon:'🌿', name:'長命の魔法使い',     desc:'葬送のフリーレンのキャラを使用する',
      check: s => s.usedOrigins?.includes('葬送のフリーレン') },
    { id:'konosuba_fan',    icon:'💧', name:'この素晴らしい冒険者',desc:'この素晴らしい世界のキャラを使用する',
      check: s => s.usedOrigins?.includes('この素晴らしい世界') },
    { id:'overlord_fan',    icon:'💀', name:'至高の御方',         desc:'オーバーロードのキャラを使用する',
      check: s => s.usedOrigins?.includes('オーバーロード') },
    { id:'mushoku_fan',     icon:'📖', name:'転生賢者',           desc:'無職転生のキャラを使用する',
      check: s => s.usedOrigins?.includes('無職転生') },

    // ---- 追加：マイルストーン ----
    { id:'boss_5',          icon:'👑', name:'ボスハンター',       desc:'ボスを5体撃破する',
      check: s => s.bossesDefeated >= 5 },
    { id:'big_damage_turn', icon:'💥', name:'一撃千金',           desc:'1ターン中に合計500ダメージ以上与える',
      check: s => s.maxTurnDamage >= 500 },
    { id:'heal_5000',       icon:'💚', name:'大いなる癒し',       desc:'回復量の合計が5000を超える',
      check: s => s.totalHeal >= 5000 },
    { id:'ultimate_50',     icon:'✨', name:'大技マニア',         desc:'大技（SP3以上のスキル）を50回使用する',
      check: s => s.ultimatesUsed >= 50 },
    { id:'game_clear_3',    icon:'🏆', name:'三度の覇者',         desc:'3回ゲームクリアする',
      check: s => s.gameClears >= 3 },
    { id:'execute_10',      icon:'🎯', name:'追撃の達人',         desc:'追撃スキルで10回敵を撃破する',
      check: s => s.executeKills >= 10 },
    { id:'battle_100',      icon:'🗡️', name:'百戦錬磨',           desc:'合計100回以上戦闘する',
      check: s => s.battlesFought >= 100 },
  ];

  // ---- ステート ----
  let seenChars    = new Set();
  let seenRelics   = new Set();
  let completedAchs = new Set();
  let stats        = {};
  let _pendingNotifs = [];

  function defaultStats() {
    return {
      bossesDefeated:0, battlesFought:0, maxLoop:0,
      tankBlocks:0, totalHeal:0, maxDamage:0, ultimatesUsed:0,
      rarity3Wins:0, rarity3CharsUsed:0, series2Wins:0, series3BossWins:0,
      highHPWins:0, maxRelicsHeld:0, reviveCount:0,
      fullSurviveBoss:0, kimetsuWins:0, jjkWins:0,
      gameClears:0, aceCount:0, executeKills:0, resists:0, summonSeen:0,
      maxTurnDamage:0, usedOrigins: []
    };
  }

  function load() {
    try {
      seenChars    = new Set(JSON.parse(localStorage.getItem(KEYS.seenChars) || '[]'));
      // ロスター削除済みキャラのIDをセーブから除去（図鑑進捗の分母超過防止）
      if (typeof ALLY_DATA !== 'undefined') {
        const validIds = new Set(ALLY_DATA.map(c => c.id));
        seenChars = new Set([...seenChars].filter(id => validIds.has(id)));
      }
      seenRelics   = new Set(JSON.parse(localStorage.getItem(KEYS.seenRelics) || '[]'));
      completedAchs= new Set(JSON.parse(localStorage.getItem(KEYS.achievements) || '[]'));
      const raw    = JSON.parse(localStorage.getItem(KEYS.stats) || '{}');
      stats        = { ...defaultStats(), ...raw };
    } catch(e) {
      seenChars = new Set(); seenRelics = new Set(); completedAchs = new Set();
      stats = defaultStats();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEYS.seenChars,    JSON.stringify([...seenChars]));
      localStorage.setItem(KEYS.seenRelics,   JSON.stringify([...seenRelics]));
      localStorage.setItem(KEYS.achievements, JSON.stringify([...completedAchs]));
      localStorage.setItem(KEYS.stats,        JSON.stringify(stats));
    } catch(e) {}
  }

  function checkAll() {
    const newly = [];
    ACHIEVEMENTS.forEach(a => {
      if (!completedAchs.has(a.id) && a.check(stats, seenChars, seenRelics)) {
        completedAchs.add(a.id);
        newly.push(a);
        _pendingNotifs.push(a);
      }
    });
    if (newly.length) save();
  }

  // ---- イベントハンドラ ----

  function onCharUsed(charId) {
    if (!seenChars.has(charId)) {
      seenChars.add(charId);
      // Origin tracking
      if (typeof ALLY_DATA !== 'undefined') {
        const data = ALLY_DATA.find(d => d.id === charId);
        if (data && data.origin && !stats.usedOrigins.includes(data.origin)) {
          stats.usedOrigins = [...stats.usedOrigins, data.origin];
        }
      }
      // Rarity3 tracking
      if (typeof CHAR_RARITY !== 'undefined' && CHAR_RARITY[charId] === 3) {
        const rarity3Set = new Set([...seenChars].filter(id => (CHAR_RARITY[id] || 2) === 3));
        stats.rarity3CharsUsed = rarity3Set.size;
      }
      checkAll();
    }
    save();
  }

  function onRelicObtained(relicId) {
    seenRelics.add(relicId);
    if (typeof Relics !== 'undefined') {
      stats.maxRelicsHeld = Math.max(stats.maxRelicsHeld, Relics.getHeld().length);
    }
    checkAll();
    save();
  }

  function onBattleFought() {
    stats.battlesFought++;
    checkAll();
    save();
  }

  function onBossDefeated({ loopCount, partyHasRarity3, seriesCount3, allAliveCount, loopDifficulty, party }) {
    stats.bossesDefeated++;
    stats.maxLoop = Math.max(stats.maxLoop, loopCount);
    if (partyHasRarity3) stats.rarity3Wins++;
    if (seriesCount3) stats.series3BossWins++;
    if (allAliveCount === party.length) stats.fullSurviveBoss++;
    checkAll();
    save();
  }

  function onNormalBattleWon({ isHighHP, partyOrigins, party }) {
    if (isHighHP) stats.highHPWins++;
    // series2 win check
    const originCounts = {};
    partyOrigins.forEach(o => { if (o) originCounts[o] = (originCounts[o]||0)+1; });
    if (Object.values(originCounts).some(c => c >= 2)) stats.series2Wins++;
    // kimetsu / jjk
    if (partyOrigins.includes('鬼滅の刃')) stats.kimetsuWins++;
    if (partyOrigins.includes('呪術廻戦')) stats.jjkWins++;
    checkAll();
    save();
  }

  function onTankBlock() {
    stats.tankBlocks++;
    checkAll();
    save();
  }

  function onHealDealt(amount) {
    stats.totalHeal += amount;
    checkAll();
    save();
  }

  function onDamageDealt(amount) {
    if (amount > stats.maxDamage) {
      stats.maxDamage = amount;
      checkAll();
    }
    save();
  }

  function onUltimateUsed() {
    stats.ultimatesUsed++;
    checkAll();
    save();
  }

  function onRevive() {
    stats.reviveCount++;
    checkAll();
    save();
  }

  function onGameClear() {
    stats.gameClears++;
    checkAll();
    save();
  }

  function onAceActivated() {
    stats.aceCount++;
    checkAll();
    save();
  }

  function onExecuteKill() {
    stats.executeKills++;
    checkAll();
    save();
  }

  function onResist() {
    stats.resists++;
    checkAll();
    save();
  }

  function onSummonWitnessed() {
    stats.summonSeen++;
    checkAll();
    save();
  }

  function onTurnDamageEnd(amount) {
    if (amount > (stats.maxTurnDamage || 0)) {
      stats.maxTurnDamage = amount;
      checkAll();
      save();
    }
  }

  // ---- 進捗リセット（実績・図鑑・統計をすべて初期化）----
  function resetAll() {
    try {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    } catch(e) {}
    seenChars = new Set();
    seenRelics = new Set();
    completedAchs = new Set();
    stats = defaultStats();
    _pendingNotifs = [];
  }

  // ---- 通知キュー ----
  function popNotifs() {
    const n = _pendingNotifs.slice();
    _pendingNotifs = [];
    return n;
  }

  // ---- Getters for Collection Screen ----
  function getSeenChars()     { return seenChars; }
  function getSeenRelics()    { return seenRelics; }
  function getCompletedAchs() { return completedAchs; }
  function getAllAchs()        { return ACHIEVEMENTS; }
  function getStats()         { return stats; }

  // ---- 初期ロード ----
  load();

  return {
    onCharUsed, onRelicObtained, onBattleFought,
    onBossDefeated, onNormalBattleWon,
    onTankBlock, onHealDealt, onDamageDealt, onUltimateUsed, onRevive,
    onGameClear, onAceActivated, onExecuteKill, onResist, onSummonWitnessed, onTurnDamageEnd,
    resetAll,
    popNotifs,
    getSeenChars, getSeenRelics, getCompletedAchs, getAllAchs, getStats
  };
})();

window.ACH = ACH;