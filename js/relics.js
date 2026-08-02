// ============================================================
// RELIC SYSTEM
// レリックシステム
// 所持数上限なし
// rarity: 1=★ 2=★★ 3=★★★
// 名称・効果は原作準拠（各作品の実在アイテム・概念）
// ============================================================

// ---- レリックデータ定義 ----
const RELIC_DATA = [
  // ── ドラゴンボール ──
  { id:'senzu',         name:'仙豆',                 origin:'ドラゴンボール',   emoji:'🫘', rarity:3,
    desc:'HPが0になった時、HP50%で復活（1戦闘1回）',
    effect:{ type:'revive_once', value:0.50 } },
  { id:'scouter',       name:'スカウター',            origin:'ドラゴンボール',   emoji:'🔭', rarity:1,
    desc:'ボスへのダメージ+10%',
    effect:{ type:'boss_damage', value:0.10 } },
  { id:'kaio_gravity',  name:'如意棒',                origin:'ドラゴンボール',   emoji:'🥢', rarity:1,
    desc:'攻撃力+8%',
    effect:{ type:'atk_boost', value:0.08 } },
  { id:'dragon_ball',   name:'ドラゴンボール',         origin:'ドラゴンボール',   emoji:'🟠', rarity:3,
    desc:'戦闘開始時SP+1',
    effect:{ type:'battle_start_sp', value:1 } },
  // ── NARUTO ──
  { id:'sage_oil',      name:'妙木山の仙油',          origin:'NARUTO',          emoji:'🫧', rarity:2,
    desc:'毎ターンHP2%回復',
    effect:{ type:'regen', value:0.02 } },
  { id:'kiba',          name:'大刀・鮫肌',            origin:'NARUTO',          emoji:'🗡️', rarity:2,
    desc:'与えたダメージの8%を自分のHPに吸収',
    effect:{ type:'lifesteal', value:0.08 } },
  { id:'chakra_pill',   name:'一楽のラーメン',         origin:'NARUTO',          emoji:'🍜', rarity:1,
    desc:'毎ターンHP1%回復',
    effect:{ type:'regen', value:0.01 } },

  // ── ONE PIECE ──
  { id:'devil_fruit',   name:'悪魔の実',              origin:'ONE PIECE',       emoji:'🍎', rarity:3,
    desc:'戦闘開始時SP+1',
    effect:{ type:'battle_start_sp', value:1 } },
  { id:'mera_mera',     name:'メラメラの実',          origin:'ONE PIECE',       emoji:'🔥', rarity:1,
    desc:'攻撃時、ヒットごとに20%で燃焼付与(2T)',
    effect:{ type:'status_chance', effect:'burn', value:0.20 } },
  { id:'sandai_kitetsu',name:'三代鬼徹',              origin:'ONE PIECE',       emoji:'🗡️', rarity:2,
    desc:'連続ヒット技（2回以上）のダメージ+20%',
    effect:{ type:'multi_hit_boost', value:0.20 } },
  { id:'reiatsu_stone', name:'骨付き肉',              origin:'ONE PIECE',       emoji:'🍖', rarity:1,
    desc:'毎ターンHP1%回復',
    effect:{ type:'regen', value:0.01 } },

  // ── 鬼滅の刃 ──
  { id:'nichirin',      name:'日輪刀',                origin:'鬼滅の刃',         emoji:'🌅', rarity:3,
    desc:'ボスへのダメージ+15%',
    effect:{ type:'boss_damage', value:0.15 } },
  { id:'zenchuu',       name:'全集中・常中',          origin:'鬼滅の刃',         emoji:'💨', rarity:2,
    desc:'毎ターンHP2%回復',
    effect:{ type:'regen', value:0.02 } },
  { id:'hinokami_mem',  name:'藤の花',                origin:'鬼滅の刃',         emoji:'🌸', rarity:1,
    desc:'攻撃時、ヒットごとに20%で毒付与(2T)',
    effect:{ type:'status_chance', effect:'poison', value:0.20 } },

  // ── 呪術廻戦 ──
  { id:'special_grade', name:'反転術式',              origin:'呪術廻戦',         emoji:'✨', rarity:2,
    desc:'毎ターンHP2%回復',
    effect:{ type:'regen', value:0.02 } },
  { id:'six_eyes_copy', name:'特級呪具・天逆鉾',      origin:'呪術廻戦',         emoji:'🔱', rarity:1,
    desc:'状態異常を受ける確率-30%',
    effect:{ type:'status_resist', value:0.30 } },

  // ── BLEACH ──
  { id:'bankai_crystal', name:'崩玉（ほうぎょく）',   origin:'BLEACH',           emoji:'🔮', rarity:3,
    desc:'戦闘開始時、味方全体に攻撃UP（2T）',
    effect:{ type:'battle_start_atk_up', turns:2 } },
  { id:'poison_needle', name:'雀蜂（すずめばち）',    origin:'BLEACH',           emoji:'🐝', rarity:1,
    desc:'攻撃時、ヒットごとに20%で毒付与(2T)',
    effect:{ type:'status_chance', effect:'poison', value:0.20 } },
  { id:'reiatsu_pill',  name:'義魂丸（ソウルキャンディ）', origin:'BLEACH',       emoji:'🍬', rarity:3,
    desc:'毎ターンSP1回復',
    effect:{ type:'pp_regen_interval', interval:1 } },
  { id:'reiatsu_rise',  name:'霊圧の覚醒',            origin:'BLEACH',           emoji:'💫', rarity:3,
    desc:'ターン経過ごとに攻撃力+2%蓄積（最大20%）',
    effect:{ type:'atk_ramp', value:0.02, max:10 } },

  // ── 僕のヒーローアカデミア ──
  { id:'ofa_remnant',   name:'オールマイトの髪の毛',   origin:'僕のヒーローアカデミア', emoji:'💪', rarity:3,
    desc:'戦闘開始時SP+1',
    effect:{ type:'battle_start_sp', value:1 } },
  { id:'support_item',  name:'サポートアイテム',       origin:'僕のヒーローアカデミア', emoji:'💊', rarity:1,
    desc:'攻撃力+8%',
    effect:{ type:'atk_boost', value:0.08 } },

  // ── HUNTER×HUNTER ──
  { id:'yorbian_honey', name:'大天使の息吹',           origin:'HUNTER×HUNTER',   emoji:'👼', rarity:2,
    desc:'戦闘開始時にHP30%回復',
    effect:{ type:'battle_start_heal', value:0.30 } },
  { id:'nen_proof',     name:'制約と誓約',             origin:'HUNTER×HUNTER',   emoji:'⛓️', rarity:2,
    desc:'攻撃力+15%（スキル使用時HP3%消費）',
    effect:{ type:'atk_skill_hp_cost', atk:0.15, cost:0.03 } },
  { id:'scarlet_chain', name:'クラピカの鎖',           origin:'HUNTER×HUNTER',   emoji:'🔗', rarity:1,
    desc:'攻撃時、ヒットごとに20%で気絶付与(2T)',
    effect:{ type:'status_chance', effect:'stun', value:0.20 } },

  // ── FAIRY TAIL ──
  { id:'dragon_scale',  name:'滅竜魔法の鱗',           origin:'FAIRY TAIL',       emoji:'🐉', rarity:1,
    desc:'全員の燃焼・凍結無効',
    effect:{ type:'status_immune', value:1, targets:['burn','freeze'] } },
  { id:'armor_shard',   name:'換装・冥界の鎧',         origin:'FAIRY TAIL',       emoji:'🛡️', rarity:2,
    desc:'戦闘開始時、全員にシールド付与（HP15%分）',
    effect:{ type:'shield_start', value:0.15 } },

  // ── 七つの大罪 ──
  { id:'sun_amber',     name:'恩寵『太陽』',            origin:'七つの大罪',       emoji:'🌞', rarity:3,
    desc:'ターン経過ごとに攻撃力+2%蓄積（最大20%）',
    effect:{ type:'atk_ramp', value:0.02, max:10 } },
  { id:'undead_cup',    name:'命の泉',                 origin:'七つの大罪',       emoji:'⛲', rarity:3,
    desc:'毎ターンHP3%回復',
    effect:{ type:'regen', value:0.03 } },
  { id:'fairy_staff',   name:'霊槍シャスティフォル・守護獣', origin:'七つの大罪', emoji:'🧸', rarity:2,
    desc:'戦闘開始時、全員にシールド付与（HP15%分）',
    effect:{ type:'shield_start', value:0.15 } },

  // ── ジョジョの奇妙な冒険 ──
  { id:'time_hourglass',name:'ザ・ワールドのタロットカード', origin:'ジョジョの奇妙な冒険', emoji:'⏳', rarity:2,
    desc:'戦闘開始時、敵全員を気絶（1T）させる',
    effect:{ type:'battle_start_stun_all', turns:1 } },
  { id:'sp_bracelet',   name:'石仮面',                 origin:'ジョジョの奇妙な冒険', emoji:'🗿', rarity:2,
    desc:'与えたダメージの8%を自分のHPに吸収',
    effect:{ type:'lifesteal', value:0.08 } },
  { id:'gold_arrow',    name:'黄金の矢',               origin:'ジョジョの奇妙な冒険', emoji:'🏹', rarity:3,
    desc:'戦闘開始時、各キャラが攻撃UP・防御UP・リジェネのいずれかをランダム取得（2T）',
    effect:{ type:'random_buff', turns:2, regen:true } },

  // ── Fate/stay night ──
  { id:'camelot_shard', name:'全て遠き理想郷',          origin:'Fate/stay night',  emoji:'🛡️', rarity:3,
    desc:'毎ターンHP3%回復',
    effect:{ type:'regen', value:0.03 } },
  { id:'excalibur_sheath', name:'凛のペンダント',       origin:'Fate/stay night',  emoji:'💎', rarity:1,
    desc:'致死ダメージを1度だけHP1で耐える（1戦闘1回）',
    effect:{ type:'survive_fatal', value:1 } },
  { id:'berserker_blood', name:'ヘラクレス神殿の礎',    origin:'Fate/stay night',  emoji:'🪨', rarity:3,
    desc:'アタッカー・ストライカーのみ攻撃力+15%',
    effect:{ type:'attacker_class_boost', value:0.15 } },

  // ── Re:ゼロ ──
  { id:'return_record', name:'死に戻り',                origin:'Re:ゼロ',          emoji:'⏰', rarity:3,
    desc:'一度だけHPが0になった時、HP50%で復活（1戦闘1回）',
    effect:{ type:'revive_once', value:0.50 } },
  { id:'echidna_tea',   name:'エキドナの茶杯',          origin:'Re:ゼロ',          emoji:'🍵', rarity:1,
    desc:'毎ターンHP1%回復',
    effect:{ type:'regen', value:0.01 } },
  { id:'wilhelm_sword', name:'ウィルヘルムの剣',        origin:'Re:ゼロ',          emoji:'⚔️', rarity:1,
    desc:'攻撃力+8%',
    effect:{ type:'atk_boost', value:0.08 } },

  // ── 転生したらスライムだった件 ──
  { id:'great_sage',    name:'大賢者',                  origin:'転生したらスライムだった件', emoji:'🧠', rarity:2,
    desc:'スキル使用時、10%の確率でSP消費なし',
    effect:{ type:'sp_free_chance', value:0.10 } },
  { id:'milim_wings',   name:'フルポーション',           origin:'転生したらスライムだった件', emoji:'🧪', rarity:2,
    desc:'HPが50%以下になった人にリジェネ（3T）（1戦闘1回）',
    effect:{ type:'team_regen_on_low_hp', turns:3 } },
  { id:'predator',      name:'捕食者',                  origin:'転生したらスライムだった件', emoji:'🔺', rarity:3,
    desc:'敵を撃破するたびにSP1回復',
    effect:{ type:'on_kill_sp' } },

  // ── とある魔術の禁書目録 ──
  { id:'attack_emblem', name:'ゲームセンターのコイン',  origin:'とある魔術の禁書目録', emoji:'🪙', rarity:1,
    desc:'攻撃時、ヒットごとに20%で麻痺付与(2T)',
    effect:{ type:'status_chance', effect:'paralyze', value:0.20 } },

  // ── 進撃の巨人 ──
  { id:'speed_boots',   name:'立体機動装置',            origin:'進撃の巨人',        emoji:'🪝', rarity:1,
    desc:'攻撃力+8%',
    effect:{ type:'atk_boost', value:0.08 } },

  // ── SAO ──
  { id:'healing_herb',  name:'回復結晶',                origin:'SAO',              emoji:'💠', rarity:2,
    desc:'戦闘開始時にHP30%回復',
    effect:{ type:'battle_start_heal', value:0.30 } },
  { id:'guild_seal',    name:'防御結晶',                origin:'SAO',              emoji:'🔷', rarity:2,
    desc:'戦闘開始時、全員にシールド付与（HP15%分）',
    effect:{ type:'shield_start', value:0.15 } },
  { id:'elucidator_dark_repulser', name:'エリュシデータ×ダークリパルサー', origin:'SAO', emoji:'⚔️', rarity:2,
    desc:'連続ヒット技（2回以上）のダメージ+20%',
    effect:{ type:'multi_hit_boost', value:0.20 } },

  // ── 魔法少女まどか☆マギカ ──
  { id:'iron_amulet',   name:'グリーフシード',           origin:'魔法少女まどか☆マギカ', emoji:'🖤', rarity:1,
    desc:'状態異常を受ける確率-30%',
    effect:{ type:'status_resist', value:0.30 } },
  { id:'soul_gem',      name:'ソウルジェム',             origin:'魔法少女まどか☆マギカ', emoji:'💎', rarity:2,
    desc:'毎ターンHP2%回復',
    effect:{ type:'regen', value:0.02 } },

  // ── 葬送のフリーレン ──
  { id:'lucky_coin',    name:'鏡蓮華の指輪',             origin:'葬送のフリーレン',   emoji:'💍', rarity:2,
    desc:'スキル使用時、10%の確率でSP消費なし',
    effect:{ type:'sp_free_chance', value:0.10 } },

  // ── 無職転生 ──
  { id:'ancient_tome',  name:'アクアハーティア',         origin:'無職転生',          emoji:'🪄', rarity:2,
    desc:'スキル使用時、10%の確率でSP消費なし',
    effect:{ type:'sp_free_chance', value:0.10 } },

  // ── 東京喰種 ──
  { id:'combo_fist',    name:'赫包（かくほう）',          origin:'東京喰種',          emoji:'🧬', rarity:2,
    desc:'与えたダメージの8%を自分のHPに吸収',
    effect:{ type:'lifesteal', value:0.08 } },

  // ── ワンパンマン ──
  { id:'monster_cell',  name:'怪人細胞',                 origin:'ワンパンマン',       emoji:'🧫', rarity:3,
    desc:'戦闘開始時、各キャラが攻撃UP・防御UP・リジェネのいずれかをランダム取得（2T）',
    effect:{ type:'random_buff', turns:2, regen:true } },
  { id:'metal_bat',     name:'金属バット',               origin:'ワンパンマン',       emoji:'🏏', rarity:1,
    desc:'攻撃力+8%',
    effect:{ type:'atk_boost', value:0.08 } },
  { id:'kuseno_upgrade', name:'クセーノ博士の改造',      origin:'ワンパンマン',       emoji:'⚙️', rarity:2,
    desc:'通常攻撃のダメージ+30%',
    effect:{ type:'normal_atk_boost', value:0.30 } },

  // ── 鋼の錬金術師 ──
  { id:'sharingan_scroll', name:'賢者の石',              origin:'鋼の錬金術師',     emoji:'🔴', rarity:2,
    desc:'最大SP+1',
    effect:{ type:'pp_max_up', value:1 } },

  // ── ブラッククローバー ──
  { id:'grimoire',      name:'三つ葉の魔導書',           origin:'ブラッククローバー', emoji:'🍀', rarity:2,
    desc:'最大SP+1',
    effect:{ type:'pp_max_up', value:1 } },
  // ── FINAL FANTASY ──
  { id:'elixir',        name:'エリクサー',               origin:'FINAL FANTASY',    emoji:'🧪', rarity:2,
    desc:'HPが50%以下になった人にリジェネ（3T）（1戦闘1回）',
    effect:{ type:'team_regen_on_low_hp', turns:3 } },

  // ── ポケットモンスター ──

  { id:'life_orb',      name:'いのちのたま',             origin:'ポケットモンスター', emoji:'🔴', rarity:2,
    desc:'攻撃力+15%（スキル使用時HP3%消費）',
    effect:{ type:'atk_skill_hp_cost', atk:0.15, cost:0.03 } },
  { id:'oran_berry',    name:'オボンのみ',               origin:'ポケットモンスター', emoji:'🫐', rarity:2,
    desc:'HPが50%以下になった人にリジェネ（3T）（1戦闘1回）',
    effect:{ type:'team_regen_on_low_hp', turns:3 } },
  { id:'focus_sash',    name:'きあいのタスキ',           origin:'ポケットモンスター', emoji:'🌟', rarity:1,
    desc:'致死ダメージを1度だけHP1で耐える（1戦闘1回）',
    effect:{ type:'survive_fatal', value:1 } },
  { id:'leftovers',     name:'たべのこし',               origin:'ポケットモンスター', emoji:'🍎', rarity:1,
    desc:'毎ターンHP1%回復',
    effect:{ type:'regen', value:0.01 } },
  { id:'rocky_helmet',  name:'ゴツゴツメット',           origin:'ポケットモンスター', emoji:'🪖', rarity:2,
    desc:'被ダメージの50%を攻撃した敵に反射する',
    effect:{ type:'thorns', value:0.5 } },
];

// ---- レリック効果適用 ----
const Relics = (() => {

  function getHeld() {
    return window.gameState ? (window.gameState.relics || []) : [];
  }

  // 戦闘開始時の効果（HP回復、バリア、シールド、開幕バフ等）
  function applyBattleStart(allies) {
    const held = getHeld();
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (!relic) return;
      const ef = relic.effect;

      if (ef.type === 'battle_start_heal') {
        allies.forEach(a => {
          const heal = Math.floor(a.maxHp * ef.value);
          a.hp = Math.min(a.maxHp, a.hp + heal);
        });
      }
      if (ef.type === 'battle_start_barrier') {
        allies.forEach(a => { a.hasBarrier = true; });
      }
      if (ef.type === 'shield_start') {
        allies.forEach(a => {
          a.shieldHp = Math.min(Math.floor(a.maxHp * 0.5), (a.shieldHp || 0) + Math.floor(a.maxHp * ef.value));
        });
        if (typeof UI !== 'undefined') UI.log(`🧸 <strong>${relic.name}</strong> — 味方全体にシールド付与！`, 'log-status');
      }
      if (ef.type === 'battle_start_atk_up') {
        allies.forEach(a => {
          // battle.js の applyStatusEffect(atk_up) と同じ処理をミラー
          if (!a.statusEffects.some(e => e.type === 'atk_up')) {
            a.statMods.atk *= 1.5;
            a.statusEffects.push({ type: 'atk_up', turns: ef.turns || 2, justApplied: false });
          }
          if (typeof UI !== 'undefined') UI.queueFloat(a.id, '⬆️攻撃力', 'float-buff');
        });
        if (typeof UI !== 'undefined') UI.log(`🌀 <strong>${relic.name}</strong> — 開幕、味方全体に攻撃UP（${ef.turns || 2}T）！`, 'log-status');
      }
      if (ef.type === 'guaranteed_initiative') {
        if (window.gameState) window.gameState._guaranteedInitiative = true;
      }
      if (ef.type === 'random_buff') {
        const t = ef.turns || 1;
        const opts = ef.regen ? ['atk_up', 'def_up', 'regen'] : ['atk_up', 'def_up'];
        allies.forEach(a => {
          const choice = opts[Math.floor(Math.random() * opts.length)];
          if (choice === 'atk_up') {
            if (!a.statusEffects.some(e => e.type === 'atk_up')) {
              a.statMods.atk *= 1.5;
              a.statusEffects.push({ type: 'atk_up', turns: t, justApplied: false });
            }
            if (typeof UI !== 'undefined') UI.queueFloat(a.id, `⬆️攻撃力UP(${t}T)`, 'float-buff');
          } else if (choice === 'def_up') {
            if (!a.statusEffects.some(e => e.type === 'def_up')) {
              a.statMods.defMult *= 0.5;
              a.statusEffects.push({ type: 'def_up', turns: t, justApplied: false });
            }
            if (typeof UI !== 'undefined') UI.queueFloat(a.id, `🛡️防御力UP(${t}T)`, 'float-shield');
          } else {
            if (!a.statusEffects.some(e => e.type === 'regen')) {
              a.statusEffects.push({ type: 'regen', turns: t, justApplied: false });
            }
            if (typeof UI !== 'undefined') UI.queueFloat(a.id, `💚リジェネ(${t}T)`, 'float-heal');
          }
        });
        if (typeof UI !== 'undefined') UI.log(`🏹 <strong>${relic.name}</strong> — 各キャラにランダムバフ（${t}T）付与！`, 'log-status');
      }
      if (ef.type === 'battle_start_sp_full') {
        if (window.gameState) {
          window.gameState.sp = window.gameState.maxSp ?? 5;
          if (typeof UI !== 'undefined') UI.updatePartySP();
        }
        if (typeof UI !== 'undefined') UI.log(`🍀 <strong>${relic.name}</strong> — 戦闘開始時SP全回復！`, 'log-status');
      }
      if (ef.type === 'battle_start_sp') {
        if (window.gameState) {
          window.gameState.sp = Math.min(window.gameState.maxSp ?? 5, (window.gameState.sp ?? 0) + (ef.value || 1));
          if (typeof UI !== 'undefined') UI.updatePartySP();
        }
        if (typeof UI !== 'undefined') UI.log(`✨ <strong>${relic.name}</strong> — 戦闘開始時SP+${ef.value || 1}！`, 'log-status');
      }
      if (ef.type === 'shield_start_flat') {
        allies.forEach(a => { a.shieldHp = Math.min(Math.floor(a.maxHp * 0.5), (a.shieldHp || 0) + (ef.value || 10)); });
        if (typeof UI !== 'undefined') UI.log(`🔷 <strong>${relic.name}</strong> — 全員にシールド${ef.value}付与！`, 'log-status');
      }
    });
  }

  // 毎ターン再生効果
  function applyRegen(allies) {
    const held = getHeld();
    let regenRate = 0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'regen') regenRate += relic.effect.value;
    });
    if (regenRate > 0) {
      allies.forEach(a => {
        if (!a.isDefeated) {
          const heal = Math.floor(a.maxHp * regenRate);
          if (heal > 0) a.hp = Math.min(a.maxHp, a.hp + heal);
        }
      });
    }
  }

  // 攻撃力ボーナス計算
  function getAtkMultiplier(actor, skill) {
    const held = getHeld();
    let mult = 1.0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (!relic) return;
      const ef = relic.effect;
      if (ef.type === 'atk_boost') mult += ef.value;
      if (ef.type === 'atk_with_def_penalty') mult += ef.atk;
      if (ef.type === 'atk_skill_hp_cost') mult += ef.atk;
      if (ef.type === 'attacker_class_boost' && (actor.role === 'attacker' || actor.role === 'striker')) mult += ef.value;
      if (ef.type === 'multi_hit_boost' && skill && (skill.hits || 1) > 1) mult += ef.value;
      if (ef.type === 'normal_atk_boost' && skill && (skill.noSP || skill.noPP)) mult += ef.value;
      if (ef.type === 'atk_ramp') mult += ef.value * Math.min(ef.max || 10, window.gameState?._atkRampStacks || 0);
    });
    return mult;
  }

  // 防御ボーナス計算（被ダメに乗算）
  function getDefMultiplier(actor) {
    const held = getHeld();
    let mult = 1.0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (!relic) return;
      const ef = relic.effect;
      if (ef.type === 'def_boost') mult -= ef.value;
      if (ef.type === 'atk_with_def_penalty') mult += ef.penalty;
    });
    return mult;
  }

  // ボス・中ボス特効ボーナス（与ダメに乗算）
  function getBossDamageMultiplier(target) {
    if (!target || !(target.isBoss || target.isMidBoss)) return 1.0;
    const held = getHeld();
    let mult = 1.0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'boss_damage') mult += relic.effect.value;
    });
    return mult;
  }

  // HP上限ボーナス
  function getHpBoostMultiplier() {
    const held = getHeld();
    let mult = 1.0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'hp_boost') mult += relic.effect.value;
    });
    return mult;
  }

  // 回復量ボーナス
  function getHealMultiplier() {
    const held = getHeld();
    let mult = 1.0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'heal_boost') mult += relic.effect.value;
    });
    return mult;
  }

  // 状態異常耐性ボーナス（確率を下げる）
  function getStatusResistReduction() {
    const held = getHeld();
    let reduction = 0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'status_resist') reduction += relic.effect.value;
    });
    return Math.min(0.80, reduction);
  }

  // 攻撃時の状態異常付与レリック一覧（どの攻撃でも独立判定で付与）
  function getStatusChanceProcs() {
    const held = getHeld();
    const procs = [];
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'status_chance') {
        procs.push({ effect: relic.effect.effect, value: relic.effect.value });
      }
    });
    return procs;
  }

  // 与ダメ吸収率（lifesteal）
  function getLifestealPct() {
    const held = getHeld();
    let pct = 0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'lifesteal') pct += relic.effect.value;
    });
    return pct;
  }

  // 被ダメ反射率（thorns）
  function getThornsPct() {
    const held = getHeld();
    let pct = 0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'thorns') pct += relic.effect.value;
    });
    return pct;
  }

  // SP上限増加の値を返す
  function getSpMaxBonus() {
    const held = getHeld();
    let bonus = 0;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && (relic.effect.type === 'sp_max_up' || relic.effect.type === 'pp_max_up')) bonus += relic.effect.value;
    });
    return bonus;
  }

  // スキル使用時のHP消費（atk_skill_hp_cost型レリック用）
  function applySkillHpCost(actor) {
    const held = getHeld();
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'atk_skill_hp_cost') {
        const cost = Math.floor(actor.maxHp * relic.effect.cost);
        actor.hp = Math.max(1, actor.hp - cost);
      }
    });
  }

  // 復活レリック: HP0時に発動（レリックごとに1戦闘1回）
  function tryRevive(target) {
    const gs = window.gameState;
    if (!gs) return false;
    if (!gs._reviveUsed || typeof gs._reviveUsed !== 'object') gs._reviveUsed = {};
    for (const relicId of getHeld()) {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (relic && relic.effect.type === 'revive_once' && !gs._reviveUsed[relicId]) {
        gs._reviveUsed[relicId] = true;
        target.hp = Math.max(1, Math.floor(target.maxHp * relic.effect.value));
        return relic;
      }
    }
    return false;
  }

  // くいしばりレリック: 致死ダメージをHP1で耐える（1戦闘1回）
  // 発動したレリック本体を返す（tryRevive と同じ約束）。
  // true を返すだけだと呼び出し側がレリック名を知りようがなく、
  // ログに名前を直書きすることになって改名時に取り残される
  function trySurviveFatal(target) {
    const gs = window.gameState;
    if (!gs || gs._surviveUsed) return null;
    const relic = getHeld()
      .map(relicId => RELIC_DATA.find(r => r.id === relicId))
      .find(r => r && r.effect.type === 'survive_fatal');
    if (!relic) return null;
    gs._surviveUsed = true;
    target.hp = 1;
    return relic;
  }

  // 毎ターンSP回復
  function applySpRegenTick(allies, currentTurn) {
    const held = getHeld();
    const gs = window.gameState;
    if (!gs) return;
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (!relic || relic.effect.type !== 'pp_regen_interval') return;
      const interval = relic.effect.interval || 3;
      if (currentTurn % interval !== 0) return;
      if ((gs.sp ?? 0) < (gs.maxSp ?? 5)) {
        gs.sp = Math.min(gs.maxSp ?? 5, (gs.sp ?? 0) + 1);
        if (typeof UI !== 'undefined') {
          UI.updatePartySP();
          const first = allies.find(a => !a.isDefeated);
          if (first) UI.queueFloat(first.id, '🔋SP+1', 'float-buff');
          if (first) UI.flashCard(first.id, 'relic-flash');
          UI.log(`💎 <strong>${relic.name}</strong> — パーティSP+1！`, 'log-status');
        }
      }
    });
  }

  // レアリティ重み付きで3個選択してドロップ候補を返す（rarity1:3 / rarity2:3 / rarity3:1）
  function pickDropCandidates() {
    const held = getHeld();
    const heldTypes = new Set(
      held.map(id => RELIC_DATA.find(r => r.id === id)?.effect?.type).filter(Boolean)
    );
    const exclusiveTypes = new Set(['revive_once', 'team_regen_on_low_hp', 'survive_fatal']);
    const available = RELIC_DATA.filter(r => {
      if (held.includes(r.id)) return false;
      if (exclusiveTypes.has(r.effect?.type) && heldTypes.has(r.effect?.type)) return false;
      return true;
    });
    const rarityWeight = { 1: 3, 2: 3, 3: 1 };
    const result = [];
    const remaining = [...available];
    while (result.length < 3 && remaining.length > 0) {
      const total = remaining.reduce((s, r) => s + (rarityWeight[r.rarity] || 1), 0);
      let rand = Math.random() * total;
      let idx = remaining.length - 1;
      for (let i = 0; i < remaining.length; i++) {
        rand -= rarityWeight[remaining[i].rarity] || 1;
        if (rand <= 0) { idx = i; break; }
      }
      result.push(remaining.splice(idx, 1)[0]);
    }
    return result;
  }

  // レリックを追加
  function addRelic(relicId) {
    if (!window.gameState) return;
    if (!window.gameState.relics) window.gameState.relics = [];
    if (!window.gameState.relics.includes(relicId)) {
      window.gameState.relics.push(relicId);
    }
  }

  function removeRelic(relicId) {
    if (!window.gameState) return;
    window.gameState.relics = (window.gameState.relics || []).filter(id => id !== relicId);
  }

  function isAtMax() {
    return false;
  }

  function getOnKillHealPct() {
    let pct = 0;
    getHeld().forEach(id => {
      const r = RELIC_DATA.find(r => r.id === id);
      if (r && r.effect.type === 'on_kill_heal') pct += r.effect.value;
    });
    return pct;
  }

  function hasOnKillSp() {
    return getHeld().filter(id => { const r = RELIC_DATA.find(r => r.id === id); return r && r.effect.type === 'on_kill_sp'; }).length;
  }

  function hasSpFreeChance() {
    return getHeld().some(id => { const r = RELIC_DATA.find(r => r.id === id); return r && r.effect.type === 'sp_free_chance'; });
  }

  function hasAtkRamp() {
    return getHeld().some(id => { const r = RELIC_DATA.find(r => r.id === id); return r && r.effect.type === 'atk_ramp'; });
  }

  function getTeamRegenOnLowHpTurns() {
    for (const id of getHeld()) {
      const r = RELIC_DATA.find(r => r.id === id);
      if (r && r.effect.type === 'team_regen_on_low_hp') return r.effect.turns || 3;
    }
    return 0;
  }

  function getTeamRegenRelic() {
    for (const id of getHeld()) {
      const r = RELIC_DATA.find(r => r.id === id);
      if (r && r.effect.type === 'team_regen_on_low_hp') return r;
    }
    return null;
  }

  function applyBattleStartPost(enemies) {
    const held = getHeld();
    held.forEach(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      if (!relic) return;
      const ef = relic.effect;
      if (ef.type === 'battle_start_stun_all') {
        enemies.forEach(e => {
          if (!e.isDefeated && typeof Battle !== 'undefined')
            Battle.applyStatusEffect(e, 'stun', ef.turns || 1);
        });
        if (typeof UI !== 'undefined')
          UI.log(`⏳ <strong>${relic.name}</strong> — 敵全員に気絶${ef.turns || 1}T！`, 'log-status');
      }
    });
  }

  // 特定の状態異常への免疫チェック（status_immune型レリック用・現在は未使用だが互換維持）
  function isImmuneTo(effectType) {
    const held = getHeld();
    return held.some(relicId => {
      const relic = RELIC_DATA.find(r => r.id === relicId);
      return relic && relic.effect.type === 'status_immune' &&
             Array.isArray(relic.effect.targets) && relic.effect.targets.includes(effectType);
    });
  }

  return {
    applyBattleStart,
    applyBattleStartPost,
    applyRegen,
    getAtkMultiplier,
    getDefMultiplier,
    getBossDamageMultiplier,
    getHpBoostMultiplier,
    getHealMultiplier,
    getStatusResistReduction,
    getStatusChanceProcs,
    getLifestealPct,
    getThornsPct,
    getSpMaxBonus,
    tryRevive,
    trySurviveFatal,
    pickDropCandidates,
    addRelic,
    removeRelic,
    isAtMax,
    isImmuneTo,
    applySkillHpCost,
    applySpRegenTick,
    getHeld,
    getOnKillHealPct,
    hasOnKillSp,
    hasSpFreeChance,
    hasAtkRamp,
    getTeamRegenOnLowHpTurns,
    getTeamRegenRelic
  };
})();
