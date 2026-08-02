// ============================================================
// ALLY SKILL DATA
// noSP:true  → SP消費なし（基本技、各キャラ1つに設定）
// spCost     → SP1:中, SP2:重技, SP3:超重技, SP4:, SP5:,
// power      → そのままダメージ値（表示ダメージ = power）
// ============================================================
const SKILL_DATA = {

  // ============================================================
  // ドラゴンボール
  // ============================================================
  // -- 孫悟空 --
  goku_basic:          { name:'瞬間移動',              icon:'🐉', noSP:true,  power:4, type:'physical', target:'single', hits:3, animation:'punch' },
  kamehameha:          { name:'かめはめ波',            icon:'💥', spCost:1,    power:35, type:'magic',    target:'single', hits:1, animation:'beam', execute:true },
  genkidama:           { name:'元気玉',                icon:'🌟', spCost:3,    power:56, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, bossKiller:true },
  // -- ベジータ --
  vegeta_basic:        { name:'気弾',                  icon:'💜', noSP:true,  power:2,  type:'physical', target:'single', hits:6, animation:'beam' },
  vegeta_garlic:       { name:'ギャリック砲',          icon:'💜', spCost:1,    power:37, type:'magic',    target:'single', hits:1, animation:'beam' },
  vegeta_final_flash:  { name:'ファイナルフラッシュ',  icon:'💥', spCost:2,    power:55, type:'magic',    target:'all',    hits:1, animation:'explosion', execute:true },
  // -- 孫悟飯 --
  gohan_basic:         { name:'格闘',              icon:'💫', noSP:true,  power:7,  type:'physical', target:'single', hits:2, animation:'punch' },
  gohan_masenko:       { name:'魔閃光',            icon:'💫', spCost:1,    power:34, type:'magic',    target:'single', hits:1, animation:'beam' },
  gohan_beast:         { name:'静かな怒り',     　 icon:'⬆️', spCost:1,    power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up'  },
  // -- ピッコロ --
  piccolo_basic:       { name:'格闘',              icon:'🌀', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'punch' },
  piccolo_beam:        { name:'魔貫光殺砲',        icon:'🌀', spCost:1,    power:28, type:'magic',    target:'single', hits:1, animation:'beam', effect:'stun', effectChance:1, effectTurns:1 },
  piccolo_hellzone:    { name:'魔空包囲弾',        icon:'💥', spCost:2,    power:49, type:'magic',    target:'all', hits:1, animation:'explosion' },
  // -- 未来のトランクス --
  trunks_basic:        { name:'剣撃',                      icon:'🗡️', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  trunks_burn:         { name:'バーニングアタック',        icon:'🔥', spCost:1,   power:37, type:'magic',    target:'single', hits:1, animation:'explosion' },
  trunks_finish:       { name:'ファイナルホープスラッシュ',icon:'💥', spCost:2,   power:62, type:'magic',    target:'single', hits:1, animation:'explosion', execute:true },
  // -- クリリン --
  krillin_basic:       { name:'格闘',              icon:'👊', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'punch' },
  krillin_disc:        { name:'気円斬',            icon:'💿', spCost:1,    power:30, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true },
  krillin_solar:       { name:'太陽拳',            icon:'🌞', spCost:2,    power:0,   type:'support',  target:'all',    effect:'stun', effectChance:1, effectTurns:1, animation:'beam' },
  // -- フリーザ --
  frieza_basic:        { name:'格闘',                 icon:'🪐', noSP:true,  power:3,  type:'magic',    target:'single', hits:3, animation:'punch' },
  frieza_beam:         { name:'デスビーム',           icon:'🪐', spCost:1,    power:32, type:'magic',    target:'single', hits:1, animation:'beam', effect:'stun', effectChance:1, effectTurns:1 },
  frieza_full:         { name:'デスボール',           icon:'💥', spCost:3,    power:57, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true },

  // ============================================================
  // NARUTO
  // ============================================================
  // -- うずまきナルト --
  naruto_basic:            { name:'体術',                  icon:'🍥', noSP:true,  power:4, type:'physical', target:'single', hits:3, animation:'punch' },
  rasengan:                { name:'螺旋丸',                icon:'🌀', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'explosion', execute:true },
  senjutsu_rasengan:       { name:'風遁・螺旋手裏剣',      icon:'💥', spCost:3,    power:10, type:'magic',    target:'single', hits:11, animation:'explosion', effect:'def_down', effectChance:1, effectTurns:1, bossKiller:true, shieldBreak:true },
  // -- はたけカカシ --
  kakashi_basic:           { name:'体術',                  icon:'👁️', noSP:true,  power:4, type:'physical', target:'single', hits:3, animation:'punch' },
  kakashi_summon:          { name:'雷切',                  icon:'⚡', spCost:1,    power:38, type:'magic',    target:'single', hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3 },
  kakashi_lightning_blade: { name:'神威',                  icon:'💥', spCost:2,    power:64, type:'magic',    target:'single', hits:1, animation:'dark', effect:'atk_down', effectChance:1, effectTurns:3, shieldBreak:true },
  // -- うちはサスケ --
  sasuke_basic:            { name:'体術',              icon:'🌑', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'punch' },
  sasuke_chidori:          { name:'千鳥',              icon:'⚡', spCost:1,    power:38, type:'magic',    target:'single', hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3 },
  sasuke_susanoo:          { name:'須佐能乎',          icon:'🌑', spCost:3,    power:55, type:'magic',    target:'all',    hits:1, animation:'dark', noSpread:true },
  // -- うちはイタチ --
  itachi_basic:            { name:'手裏剣投げ',        icon:'🪶', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  itachi_tsukuyomi:        { name:'月読',              icon:'🌙', spCost:1,    power:33, type:'magic',    target:'single', hits:1, animation:'dark', effect:'stun', effectChance:1, effectTurns:1 },
  itachi_amaterasu:        { name:'天照',              icon:'🔥', spCost:2,    power:62, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:4, alsoEffect2:'curse' },
  // -- 綱手 --
  tsunade_basic:           { name:'体術',                  icon:'💥', noSP:true,  power:13,  type:'physical', target:'single', hits:1, animation:'punch' },
  tsunade_heal_all:        { name:'医療忍術',              icon:'💚', spCost:1,    power:0,   type:'heal',     target:'single', healPower:30, animation:'heal' },
  tsunade_mitsu:           { name:'百豪の術・創造再生',    icon:'💚', spCost:2,    power:0,   type:'revive',   target:'dead_ally', animation:'heal' },
  // -- 我愛羅 --
  gaara_basic:             { name:'砂の打撃',              icon:'🏜️', noSP:true,  power:7,  type:'physical', target:'single', hits:1, animation:'punch' },
  gaara_storm:             { name:'砂縛柩',                icon:'🏜️', spCost:1,    power:29, type:'magic',    target:'all',   hits:1, animation:'explosion', effect:'atk_down', effectChance:1, effectTurns:1 },
  gaara_absolute:          { name:'砂瀑送葬',              icon:'💥', spCost:2,    power:51, type:'physical', target:'all',   hits:1, animation:'explosion', effect:'def_down', effectChance:1, effectTurns:2 },
  // -- 自来也 --
  jiraiya_basic:           { name:'体術',                 icon:'🐸', noSP:true,  power:4, type:'physical',  target:'single', hits:3, animation:'punch' },
  jiraiya_rasengan:        { name:'螺旋丸',               icon:'🌀', spCost:1,    power:34, type:'physical', target:'single', hits:1, animation:'explosion', shieldBreak:true },
  jiraiya_sennin:          { name:'仙法・蝦蟇油炎弾',     icon:'💥', spCost:2,    power:52, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },

  // ============================================================
  // ONE PIECE
  // ============================================================
  // -- モンキー・D・ルフィ --
  luffy_basic:        { name:'ゴムゴムの銃（ピストル）',             icon:'⚓', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'punch' },
  jet_gatling:        { name:'ゴムゴムの銃乱打（ガトリング）',       icon:'⚓', spCost:1,    power:5,   type:'physical', target:'single', hits:7, animation:'punch', execute:true },
  gear5:              { name:'ゴムゴムの猿神銃（バジュラングガン）', icon:'💥', spCost:3,    power:110,  type:'magic',    target:'single', hits:1, animation:'explosion', effect:'atk_down', effectChance:1, effectTurns:1, bossKiller:true, shieldBreak:true },
  // -- ロロノア・ゾロ --
  three_sword_basic:  { name:'三刀流斬撃',            icon:'⚔️', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  oni_giri:           { name:'鬼斬り',                icon:'⚔️', spCost:1,    power:34, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true },
  asura:              { name:'三刀流奥義・三千世界',  icon:'💥', spCost:2,    power:20, type:'physical', target:'single', hits:3, animation:'explosion', effect:'def_down', effectChance:1, effectTurns:2 },
  // -- ヴィンスモーク・サンジ --
  sanji_basic:        { name:'蹴り技',                          icon:'🦵', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'punch' },
  sanji_diable:       { name:'悪魔風脚（ディアブルジャンブ）',    icon:'🔥', spCost:1,    power:33, type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  sanji_ifrit:        { name:'魔神風脚（イフリートジャンブ）',    icon:'💥', spCost:2,    power:62, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  // -- ポートガス・D・エース --
  ace_basic:          { name:'火銃',                  icon:'🔥', noSP:true,  power:10,  type:'physical', target:'single', hits:1, animation:'punch' },
  ace_hiken:          { name:'火拳',                  icon:'🔥', spCost:1,    power:33, type:'magic',     target:'single', hits:1, animation:'punch', effect:'burn', effectChance:1, effectTurns:2 },
  ace_dai_enkai:      { name:'大炎戒・炎帝',          icon:'💥', spCost:2,    power:52, type:'magic',     target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  // -- ナミ --
  nami_basic:         { name:'天候棒',                    icon:'⛵', noSP:true,  power:8,  type:'physical', target:'single', hits:1, animation:'slash' },
  nami_clima:         { name:'サンダーボルト・テンポ',    icon:'🌩️', spCost:1,    power:22, type:'magic',     target:'single', hits:1, animation:'thunder', effect:'stun', effectChance:1, effectTurns:1 },
  nami_perfect_clima: { name:'ゼウス・ブリーズ・テンポ',  icon:'⚡', spCost:2,    power:41, type:'magic',     target:'all',    hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3 },
  // -- ニコ・ロビン --
  robin_basic:        { name:'トレス・フルール・クラッチ',     icon:'🌺', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'punch' },
  robin_cien:         { name:'シエン・フルール・フリップ',     icon:'🌸', spCost:1,    power:24, type:'physical', target:'all',    hits:1, animation:'punch', effect:'atk_down', effectChance:1, effectTurns:1 },
  robin_mil:          { name:'ヒガンテスコ・マーノ・ストンプ', icon:'💥', spCost:2,    power:53, type:'physical', target:'single', hits:1, animation:'explosion', effect:'def_down', effectChance:1, effectTurns:2 },
  // -- シャンクス --
  shanks_basic:       { name:'斬撃',                 icon:'🍶', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  shanks_haki:        { name:'覇王色の覇気',         icon:'👑', spCost:1,    power:0,   type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:4, animation:'dark' },
  shanks_kamusari:    { name:'神避',                 icon:'💥', spCost:2,    power:66, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true, shieldBreak:true },

  // ============================================================
  // ワンパンマン
  // ============================================================
  // -- サイタマ --
  normal_punch:        { name:'普通のパンチ',          icon:'👊', noSP:true,  power:15, type:'physical', target:'single', hits:1, animation:'punch' },
  consecutive_punch:   { name:'連続普通のパンチ',      icon:'👊', spCost:1,    power:5,  type:'physical', target:'single', hits:8, animation:'punch', execute:true, shieldBreak:true },
  serious_punch:       { name:'マジ殴り',              icon:'💥', spCost:3,    power:120, type:'physical', target:'single', hits:1, animation:'punch_heavy', execute:true, bossKiller:true, shieldBreak:true },
  // -- ジェノス --
  genos_basic:         { name:'マシンガンブロー',  icon:'⚙️', noSP:true,  power:2,  type:'physical', target:'single', hits:7, animation:'slash' },
  genos_incinerator:   { name:'焼却砲',            icon:'🔥', spCost:1,    power:30, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:1 },
  genos_upgrade:       { name:'龍鳴核',            icon:'⬆️', spCost:1,    power:0,  type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  // -- ガロウ --
  garou_basic:         { name:'流水岩砕拳',        icon:'🐺', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'punch' },
  garou_martial:       { name:'大発勁',            icon:'🐺', spCost:1,    power:37, type:'physical', target:'single', hits:1, animation:'slash_heavy' },
  garou_cosmic:        { name:'ガンマ線バースト',  icon:'💥', spCost:2,    power:52, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  // -- タツマキ --
  tatsumaki_basic:     { name:'念動力波',          icon:'🌪️', noSP:true,  power:10, type:'magic',    target:'single', hits:1, animation:'beam' },
  tatsumaki_psycho:    { name:'念動金縛り',        icon:'🌪️', spCost:1,    power:36, type:'magic',    target:'single', hits:1, animation:'beam', effect:'stun', effectChance:1, effectTurns:1 },
  tatsumaki_cataclysm: { name:'地獄嵐',            icon:'💥', spCost:3,    power:55, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true },
  // -- キング --
  king_engine:         { name:'キング流気功術',    icon:'👑', noSP:true,  power:3,  type:'physical', target:'single', hits:1, animation:'punch' },
  king_stare:          { name:'キングアイ',        icon:'👑', spCost:1,    power:0,  type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:3, },
  king_intimidate:     { name:'キングエンジン',    icon:'💥', spCost:2,    power:0,  type:'support',  target:'all',    animation:'dark', effect:'paralyze', effectChance:1, effectTurns:3, alsoEffect2:'atk_down' },
  // -- 音速のソニック --
  sonic_basic:         { name:'音速の蹴撃',           icon:'🌀', noSP:true,  power:6, type:'physical', target:'single', hits:2, animation:'punch' },
  sonic_kunai:         { name:'爆破手裏剣',           icon:'🌀', spCost:1,    power:30, type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:1 },
  sonic_juuretsu:      { name:'奥義・十影葬',         icon:'💥', spCost:2,    power:6,  type:'physical', target:'single', hits:10, animation:'slash_heavy', bossKiller:true },

  // ============================================================
  // 鬼滅の刃
  // ============================================================
  // -- 煉獄杏寿郎 --
  flame_basic:        { name:'日輪刀',                   icon:'🔥', noSP:true,  power:12,  type:'physical', target:'single', hits:1, animation:'slash' },
  flame_breath_1:     { name:'炎の呼吸・壱ノ型・不知火', icon:'🔥', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  flame_breath_9:     { name:'炎の呼吸・玖ノ型・煉獄',   icon:'💥', spCost:2,    power:63, type:'physical', target:'single', hits:1, animation:'slash_heavy', effect:'burn', effectChance:1, effectTurns:3, bossKiller:true },
  // -- 竈門炭治郎 --
  tanjiro_basic:      { name:'日輪刀',                          icon:'🌸', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  tanjiro_water_12:   { name:'水の呼吸・漆ノ型 雫波紋突き・曲', icon:'💧', spCost:1,    power:35, type:'magic',     target:'single', hits:1, animation:'ice', effect:'atk_down', effectChance:1, effectTurns:2 },
  tanjiro_sun_breath: { name:'ヒノカミ神楽・円舞一閃',           icon:'💥', spCost:2,    power:66, type:'physical',  target:'single', hits:1, animation:'slash_heavy', effect:'burn', effectChance:1, effectTurns:4, bossKiller:true },
  // -- 竈門禰豆子 --
  nezuko_basic:       { name:'爪撃',                  icon:'🎀', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  nezuko_kick:        { name:'飛び蹴り',              icon:'🦵', spCost:1,    power:34, type:'physical', target:'single', hits:1, animation:'punch', effect:'def_down', effectChance:1, effectTurns:1 },
  nezuko_bakketsu:    { name:'血鬼術・爆血',          icon:'💥', spCost:2,    power:51, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  // -- 我妻善逸 --
  zenitsu_basic:      { name:'日輪刀',                icon:'⚡', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  zenitsu_thunder:    { name:'雷の呼吸・壱ノ型・霹靂一閃',      icon:'⚡', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:2 },
  zenitsu_seventh:    { name:'雷の呼吸・漆ノ型・火雷神',  icon:'💥', spCost:2,    power:60, type:'magic',    target:'single', hits:1, animation:'explosion', bossKiller:true },
  // -- 冨岡義勇 --
  water_basic:        { name:'日輪刀',                icon:'💧', noSP:true,  power:12,  type:'physical', target:'single', hits:1, animation:'slash' },
  water_breath_4:     { name:'水の呼吸・肆ノ型・打ち潮', icon:'💧', spCost:1,    power:34, type:'magic',    target:'single', hits:1, animation:'ice' },
  water_breath_11:    { name:'水の呼吸・拾壱ノ型・凪', icon:'💥', spCost:2,    power:51, type:'magic',    target:'all',    hits:1, animation:'ice', effect:'atk_down', effectChance:1, effectTurns:2 },
  // -- 嘴平伊之助 --
  inosuke_basic:      { name:'日輪刀',                   icon:'🐗', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  inosuke_double:     { name:'獣の呼吸・弐ノ牙・切り裂き', icon:'🐗', spCost:1,    power:17,  type:'physical', target:'single', hits:2, animation:'slash' },
  inosuke_beast:      { name:'獣の呼吸・捌ノ型・爆裂猛進', icon:'💥', spCost:2,   power:61, type:'physical', target:'single', hits:1, animation:'slash_heavy', effect:'def_down', effectChance:1, effectTurns:2, recoilPct:0.10 },
  // -- 甘露寺蜜璃 --
  mitsuri_basic:      { name:'日輪刀',                         icon:'💞', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  mitsuri_five:       { name:'恋の呼吸・伍ノ型・揺らめく恋情', icon:'💞', spCost:1,    power:4,   type:'physical', target:'all', hits:8, animation:'slash' },
  mitsuri_six:        { name:'恋の呼吸・陸ノ型・猫足恋風',     icon:'💥', spCost:2,    power:5, type:'physical', target:'all', hits:10, animation:'slash_heavy', effect:'atk_down', effectChance:1, effectTurns:2 },

  // ============================================================
  // SAO
  // ============================================================
  // -- キリト --
  kirito_basic:           { name:'シャープネイル',         icon:'⚔️', noSP:true,  power:4, type:'physical', target:'single', hits:3, animation:'slash' },
  vorpal_strike:          { name:'ヴォーパル・ストライク',     icon:'💥', spCost:1,    power:35, type:'physical', target:'single', hits:1,  animation:'slash_heavy', execute:true, shieldBreak:true },
  starburst_stream:       { name:'スターバースト・ストリーム', icon:'⚔️', spCost:2,    power:4,  type:'physical', target:'single', hits:16, animation:'slash_heavy', bossKiller:true },
  // -- アスナ --
  rapier_basic:           { name:'リニアー',                     icon:'✨', noSP:true,  power:12, type:'physical', target:'single', hits:1, animation:'slash' },
  healing_asuna:          { name:'カドラプル・ペイン',           icon:'✨', spCost:1,    power:8,  type:'physical', target:'single', hits:4, animation:'slash', effect:'def_down', effectChance:1, effectTurns:1 },
  mother_rosario:         { name:'フラッシング・ペネトレイター', icon:'💥', spCost:2,    power:64, type:'physical', target:'single', hits:1, animation:'slash_heavy', shieldBreak:true },
  // -- シノン --
  sinon_basic:        { name:'グロック18C',          icon:'🎯', noSP:true,  power:1,  type:'physical', target:'single', hits:13, animation:'slash' },
  sinon_rifle:        { name:'ファントム・バレット', icon:'🎯', spCost:1,    power:0,   type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:3, animation:'dark' },
  sinon_bullet:       { name:'ヘカートII',           icon:'💥', spCost:2,    power:66, type:'physical',  target:'single', hits:1, animation:'explosion', execute:true, shieldBreak:true },
  // -- ユウキ --
  yuuki_basic:        { name:'スラント',             icon:'🗡️', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  yuuki_11hit:        { name:'ホリゾンタル・スクエア', icon:'🗡️', spCost:1,    power:9, type:'physical', target:'all',    hits:4, animation:'slash' },
  yuuki_sword:        { name:'マザーズ・ロザリオ',     icon:'💥', spCost:2,    power:6, type:'physical', target:'single', hits:11, animation:'slash_heavy', execute:true },
  // -- リーファ --
  leafa_basic:        { name:'ソニックリープ',     icon:'🌿', noSP:true,  power:13,  type:'physical', target:'single', hits:1, animation:'slash' },
  leafa_heal:         { name:'フェアリィ・ダンス', icon:'🍃', spCost:1,    power:0,   type:'support',  target:'all_ally', effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  leafa_gale:         { name:'ヒール',             icon:'💚', spCost:2,    power:0,   type:'heal',     target:'all_ally', healPower:20, animation:'heal' },

  // ============================================================
  // Re:ゼロ
  // ============================================================
  // -- エミリア --
  ice_arrow:              { name:'アイシクルライン',       icon:'🧊', noSP:true,  power:2,  type:'magic',    target:'single', hits:6, animation:'ice' },
  ice_blade:              { name:'アイスブランド・アーツ', icon:'🧊', spCost:1,    power:30, type:'physical', target:'single', hits:1, animation:'ice', selfEffect:'atk_up', selfEffectTurns:2 },
  emilia_cocytus:         { name:'コキュートス',           icon:'💥', spCost:2,    power:55, type:'magic',    target:'all',    hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:3, alsoEffect2:'atk_down' },
  // -- レム --
  maid_punch:             { name:'モーニングスター',       icon:'💙', noSP:true,  power:14, type:'physical', target:'single', hits:1, animation:'slash' },
  oni_form:               { name:'振り回し',               icon:'💙', spCost:1,    power:18, type:'physical', target:'all',    hits:2, animation:'slash', shieldBreak:true },
  morning_star:           { name:'アル・ヒューマ',         icon:'💥', spCost:2,    power:15, type:'physical', target:'single', hits:4, animation:'ice', effect:'freeze', effectChance:1, effectTurns:3 },
  // -- 菜月昴 --
  subaru_basic:       { name:'拳打',              icon:'🖤', noSP:true,  power:7,  type:'physical', target:'single', hits:1, animation:'punch' },
  subaru_return:      { name:'死に戻り',          icon:'🖤', spCost:1,    power:0,   type:'heal',     target:'self',   healPower:30, animation:'heal' },
  subaru_shadow:      { name:'シャマク',          icon:'🌑', spCost:1,    power:31, type:'magic',    target:'single', hits:1, animation:'dark', effect:'atk_down', effectChance:1, effectTurns:1 },
  // -- ベアトリス --
  beatrice_basic:         { name:'ミーニャ',              icon:'📚', noSP:true,  power:5,  type:'magic',    target:'single', hits:1, animation:'beam' },
  beatrice_shamak:        { name:'エル・ミーニャ',        icon:'📚', spCost:1,    power:4, type:'magic',    target:'single', hits:8, animation:'dark' },
  beatrice_spirit:        { name:'アル・シャマク',        icon:'🌑', spCost:2,    power:61, type:'magic',   target:'single', hits:1, animation:'explosion', effect:'def_down', effectChance:1, effectTurns:2 },
  // -- ラム --
  ram_basic:              { name:'フーラ',                icon:'🌸', noSP:true,  power:10,  type:'magic',    target:'single', hits:1, animation:'beam' },
  ram_senrigan:           { name:'千里眼',                icon:'👁️', spCost:1,    power:0,   type:'support',  target:'all_ally', effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  ram_last:               { name:'エル・フーラ',          icon:'💥', spCost:2,    power:61, type:'magic',    target:'single', hits:1, animation:'explosion' },
  // -- ラインハルト --
  reinhard_basic:  { name:'剣聖の一閃',           icon:'🦁', noSP:true,  power:14, type:'physical', target:'single', hits:1, animation:'slash' },
  reinhard_guard:  { name:'剣聖の加護',           icon:'⬆️', spCost:1,    power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  reinhard_dragon: { name:'龍剣レイド・抜剣',     icon:'💥', spCost:2,    power:64, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true },

  // ============================================================
  // ポケモン
  // ============================================================
  // -- ピカチュウ --
  quick_attack:           { name:'でんこうせっか',        icon:'💥', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'punch' },
  thunderbolt:            { name:'10まんボルト',          icon:'⚡', spCost:1,    power:35,  type:'magic',    target:'single', hits:1, animation:'thunder', effect:'stun', effectChance:1, effectTurns:1, shieldBreak:true },
  volt_tackle:            { name:'ボルテッカー',          icon:'💥', spCost:3,    power:120,  type:'physical', target:'single', hits:1, animation:'explosion', effect:'paralyze', effectChance:1, effectTurns:3, recoilPct:0.10, execute:true },
  // -- ミュウツー --
  mewtwo_basic:       { name:'ねんりき',          icon:'🔮', noSP:true,  power:13, type:'magic',    target:'single', hits:1, animation:'beam' },
  mewtwo_psycho:      { name:'バリアー',          icon:'🛡️', spCost:2,    power:0,  type:'support',  target:'all_ally', effect:'shield', shieldPower:15, effectChance:1, animation:'buff' },
  mewtwo_psystrike:   { name:'サイコブレイク',    icon:'💥', spCost:2,    power:63, type:'magic',    target:'single', hits:1, animation:'beam', effect:'def_down', effectChance:1, effectTurns:2, shieldBreak:true },
  // -- ルカリオ --
  lucario_basic:      { name:'はっけい',          icon:'🔵', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  lucario_aura:       { name:'はどうだん',        icon:'🔵', spCost:1,    power:37, type:'magic',    target:'single', hits:1, animation:'beam' },
  lucario_mega:       { name:'メガ進化',          icon:'⬆️', spCost:1,    power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  // -- リザードン --
  charizard_basic:    { name:'かえんほうしゃ',    icon:'🔥', noSP:true,  power:11, type:'magic',    target:'single', hits:1, animation:'explosion' },
  charizard_fly:      { name:'そらをとぶ',        icon:'🐉', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'slash', effect:'stun', effectChance:1, effectTurns:1 },
  charizard_blaze:    { name:'だいもんじ',        icon:'💥', spCost:2,    power:53, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  // -- ゲンガー --
  gengar_basic:       { name:'おどろかす',        icon:'👻', noSP:true,  power:11, type:'magic',    target:'single', hits:1, animation:'dark' },
  gengar_lick:        { name:'したでなめる',      icon:'💀', spCost:1,    power:33, type:'magic',    target:'single', hits:1, animation:'dark', effect:'paralyze', effectChance:1, effectTurns:3 },
  gengar_hex:         { name:'シャドーボール',    icon:'💥', spCost:2,    power:60, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'curse', effectChance:1, effectTurns:2 },
  // -- ヌメルゴン --
  goodra_basic:       { name:'みずてっぽう',      icon:'💧', noSP:true,  power:10, type:'magic',    target:'single', hits:1, animation:'beam' },
  goodra_mud:         { name:'マッドショット',    icon:'🟤', spCost:1,    power:28, type:'magic',    target:'single', hits:1, animation:'beam', effect:'atk_down', effectChance:1, effectTurns:1 },
  goodra_pulse:       { name:'りゅうのはどう',    icon:'💥', spCost:2,    power:56, type:'magic',    target:'single', hits:1, animation:'beam' },
  // -- デンリュウ --
  ampharos_basic:     { name:'かみなりパンチ',    icon:'👊', noSP:true,  power:12, type:'physical', target:'single', hits:1, animation:'punch' },
  ampharos_parabola:  { name:'パラボラチャージ',  icon:'⚡', spCost:1,    power:32, type:'magic',    target:'all',    hits:1, animation:'thunder', healSelf:0.2 },
  ampharos_charge:    { name:'じゅうでん',        icon:'⬆️', spCost:1,    power:0,  type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },

  // ============================================================
  // 鋼の錬金術師
  // ============================================================
  // -- エドワード・エルリック --
  alchemy_fist:           { name:'義手のブレード化',      icon:'⚗️', noSP:true,   power:13, type:'physical', target:'single', hits:1, animation:'punch' },
  alchemy_spear:          { name:'壁の錬成',              icon:'🛡️', spCost:2,    power:0,  type:'support',  target:'all_ally', effect:'shield', shieldPower:20, effectChance:1, animation:'buff' },
  alchemy_arms:           { name:'武具の錬成',            icon:'⚗️', spCost:1,    power:0,  type:'support',  target:'all_ally', effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  // -- ロイ・マスタング --
  flame_snap:             { name:'指鳴らし',              icon:'🔥', noSP:true,   power:12, type:'magic',    target:'single', hits:1, animation:'beam' },
  flame_sniper:           { name:'ピンポイント',          icon:'🔥', spCost:1,    power:31, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  ryusei_no_hi:           { name:'爆炎',                  icon:'💥', spCost:2,    power:51, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  // -- アルフォンス・エルリック --
  alphonse_basic:     { name:'鎧の拳',            icon:'🛡️', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'punch' },
  alphonse_trap:      { name:'鉄の茨道',          icon:'⚗️', spCost:2,    power:30, type:'physical', target:'all',    hits:1, animation:'explosion', effect:'atk_down', effectChance:1, effectTurns:2 },
  alphonse_bind:      { name:'撃鉄靠掌',          icon:'💥', spCost:2,    power:56, type:'physical', target:'single', hits:1, animation:'punch_heavy', effect:'stun', effectChance:1, effectTurns:1, shieldBreak:true },
  // -- リザ・ホークアイ --
  riza_basic:         { name:'二丁拳銃',          icon:'🎖️', noSP:true,  power:6,  type:'physical', target:'single', hits:2, animation:'slash' },
  riza_snipe:         { name:'狙撃',              icon:'🎖️', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'slash', execute:true },
  riza_barrage:       { name:'乱射',              icon:'🎖️', spCost:2,    power:11, type:'physical', target:'single', hits:6, animation:'slash' },
  // -- グリード --
  greed_basic:        { name:'体術',              icon:'🖐️', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'punch' },
  greed_hardening:    { name:'全身硬化',          icon:'⬆️', spCost:1,    power:0,  type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  greed_edge:         { name:'炭素の手刀',        icon:'🖐️', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'slash', shieldBreak:true },

  // ============================================================
  // 呪術廻戦
  // ============================================================
  // -- 五条悟 --
  jujutsu_basic:          { name:'術式順転・蒼',          icon:'🔮', noSP:true,  power:13,  type:'physical', target:'single', hits:1, animation:'beam' },
  mugen:                  { name:'無下限呪術',            icon:'🛡️', spCost:2,    power:0,   type:'support',  target:'all_ally', effect:'shield', shieldPower:15, effectChance:1, animation:'buff' },
  murasaki:               { name:'虚式・茈',              icon:'💥', spCost:2,    power:67,  type:'magic',    target:'single',    hits:1, animation:'explosion', execute:true },
  // -- 両面宿儺 --
  sukuna_basic:           { name:'解（カイ）',            icon:'👹', noSP:true,  power:13,  type:'physical', target:'single', hits:1, animation:'slash' },
  sukuna_dismantle:       { name:'捌（ハチ）',            icon:'👹', spCost:1,    power:36, type:'physical', target:'single', hits:1, animation:'slash_heavy', shieldBreak:true },
  sukuna_domain:          { name:'領域展開・伏魔御厨子',  icon:'🌑', spCost:4,    power:55, type:'magic',    target:'all',    hits:1, animation:'dark', effect:'curse', effectChance:1, effectTurns:3, alsoEffect2:'burn', alsoEffect3:'def_down' },
  // -- 伏黒恵 --
  megumi_basic:           { name:'十種影法術',            icon:'🐾', noSP:true,  power:9,  type:'physical', target:'single', hits:1, animation:'punch' },
  megumi_dog:             { name:'玉犬',                  icon:'🐾', spCost:1,    power:30, type:'physical', target:'single', hits:1, animation:'slash', effect:'stun', effectChance:1, effectTurns:1 },
  megumi_domain:          { name:'領域展開・嵌合暗翳庭',  icon:'💥', spCost:2,    power:42, type:'magic',    target:'all',    hits:1, animation:'dark', effect:'atk_down', effectChance:1, effectTurns:2 },
  // -- 虎杖悠仁 --
  itadori_basic:      { name:'逕庭拳',            icon:'🥊', noSP:true,  power:7, type:'physical', target:'single', hits:2, animation:'punch' },
  itadori_black:      { name:'黒閃',              icon:'⚡', spCost:1,    power:35, type:'magic',    target:'single', hits:1, animation:'explosion', execute:true },
  itadori_shrine:     { name:'赤血操術・穿血',    icon:'💥', spCost:2,    power:61, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'curse', effectChance:1, effectTurns:4, alsoEffect2:'poison' },
  // -- 七海建人 --
  nanami_basic:           { name:'なまくらの一撃',        icon:'👔', noSP:true,  power:10,  type:'physical', target:'single', hits:1, animation:'slash' },
  nanami_ratio:           { name:'十劃呪法',              icon:'👔', spCost:1,    power:31, type:'physical', target:'single', hits:1, animation:'slash', effect:'def_down', effectChance:1, effectTurns:1, shieldBreak:true },
  nanami_fulltime:        { name:'拡張術式・瓦落瓦落',    icon:'💥', spCost:2,    power:54, type:'physical', target:'all',    hits:1, animation:'explosion', recoilPct:0.20 },
  // -- 釘崎野薔薇 --
  nobara_basic:           { name:'五寸釘',                icon:'🔨', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  nobara_doll:            { name:'芻霊呪法・簪',          icon:'🔨', spCost:1,    power:29, type:'magic',    target:'single', hits:1, animation:'dark', shieldBreak:true },
  nobara_elim:            { name:'芻霊呪法・共鳴り',      icon:'💥', spCost:2,    power:57, type:'magic',    target:'single', hits:1, animation:'dark', effect:'atk_down', effectChance:1, effectTurns:2, alsoEffect2:'curse' },
  // -- 乙骨憂太 --
  yuta_basic:      { name:'剣撃',                 icon:'💍', noSP:true,  power:12,  type:'physical', target:'single', hits:1, animation:'slash' },
  yuta_copy:       { name:'模倣',                 icon:'💍', spCost:1,    power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  yuta_rika:       { name:'領域展開・真贋相愛',   icon:'💥', spCost:2,    power:64, type:'magic',    target:'single',    hits:1, animation:'dark', recoilPct:0.10, execute:true },

  // ============================================================
  // BLEACH
  // ============================================================
  // -- 黒崎一護 --
  zangetsu_slash:         { name:'斬月',                  icon:'⚫', noSP:true,   power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  getsuga_tensho:         { name:'月牙天衝',              icon:'🌑', spCost:1,    power:35,  type:'magic',    target:'single', hits:1, animation:'dark', execute:true },
  mugetsu:                { name:'無月',                  icon:'💥', spCost:3,    power:110, type:'magic',    target:'single', hits:1, animation:'dark', execute:true, bossKiller:true, selfEffect:'atk_down', selfEffectTurns:2 },
  // -- 朽木ルキア --
  rukia_basic:        { name:'袖白雪',            icon:'🧊', noSP:true,  power:10,  type:'physical', target:'single', hits:1, animation:'slash' },
  rukia_soten:        { name:'次の舞・白漣',      icon:'🧊', spCost:1,    power:31, type:'magic',    target:'single', hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:2 },
  rukia_bankai:       { name:'卍解・白霞罸',      icon:'🌨️', spCost:2,    power:48, type:'magic',    target:'all',    hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:1, alsoEffect2:'def_down' },
  // -- 日番谷冬獅郎 --
  hitsugaya_basic:        { name:'氷輪丸',                icon:'🧊', noSP:true,  power:10,  type:'physical', target:'single', hits:1, animation:'slash' },
  hitsugaya_shikai:       { name:'霜天に坐せ「氷輪丸」',  icon:'🐉', spCost:1,    power:33, type:'magic',    target:'single', hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:2 },
  hitsugaya_bankai:       { name:'卍解・大紅蓮氷輪丸',    icon:'💥', spCost:2,    power:52, type:'magic',    target:'all',    hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:2 },
  // -- 朽木白哉 --
  byakuya_basic:          { name:'千本桜',                icon:'🌸', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  byakuya_cherry:         { name:'散れ「千本桜」',        icon:'🌸', spCost:1,    power:37, type:'magic',    target:'single', hits:1, animation:'slash' },
  byakuya_bankai:         { name:'卍解・千本桜景厳',      icon:'💥', spCost:2,    power:56, type:'magic',    target:'all',    hits:1, animation:'slash_heavy' },
  // -- 四楓院夜一 --
  yoruichi_basic:     { name:'瞬歩連撃',          icon:'🐱', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  yoruichi_shunko:    { name:'瞬閧',              icon:'⬆️', spCost:1,    power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  yoruichi_raishunko: { name:'瞬閧・雷神戦形',    icon:'💥', spCost:2,    power:56, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'paralyze', effectChance:1, effectTurns:2 },
  // -- 更木剣八 --
  kenpachi_basic:     { name:'野晒',              icon:'🔔', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'slash' },
  kenpachi_eyepatch:  { name:'呑め「野晒」',      icon:'💥', spCost:1,    power:30, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true, shieldBreak:true },
  kenpachi_nozarashi: { name:'卍解',              icon:'⬆️', spCost:1,    power:0,    type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },

  // ============================================================
  // HUNTER×HUNTER
  // ============================================================
  // -- キルア＝ゾルディック --
  hand_slice:             { name:'手刀',                  icon:'⚡', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'slash' },
  godspeed:               { name:'電光石火',              icon:'⬆️', spCost:1,    power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  kanmuru:                { name:'神速（カンムル）',      icon:'💥', spCost:2,    power:58, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'paralyze', effectChance:1, effectTurns:3 },
  // -- ゴン＝フリークス --
  gon_basic:          { name:'ジャジャン拳・パー',   icon:'🖐️', noSP:true,  power:12, type:'physical', target:'single', hits:1, animation:'beam' },
  gon_rock:           { name:'ジャジャン拳・チョキ', icon:'✌️', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'slash', effect:'def_down', effectChance:1, effectTurns:2, shieldBreak:true },
  gon_adult:          { name:'ジャジャン拳・グー',   icon:'✊', spCost:2,    power:67, type:'physical', target:'single', hits:1, animation:'punch_heavy', execute:true, shieldBreak:true },
  // -- ヒソカ＝モロウ --
  hisoka_basic:       { name:'トランプ投げ',                              icon:'🃏', noSP:true,   power:3, type:'physical', target:'single', hits:4, animation:'slash' },
  hisoka_bungee:      { name:'伸縮自在の愛（バンジーガム）',              icon:'🃏', spCost:1,     power:31, type:'physical', target:'single', hits:1, animation:'slash', effect:'stun', effectChance:1, effectTurns:1, shieldBreak:true },
  hisoka_card:        { name:'薄っぺらな嘘（ドッキリテクスチャー）',      icon:'💥',  spCost:1,    power:0,   type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:3, animation:'dark' },
  // -- クラピカ --
  kurapika_basic:         { name:'鎖打撃',                                icon:'🔗', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'punch' },
  kurapika_chain:         { name:'奪う人差し指の鎖（スチールチェーン）',    icon:'🔗', spCost:1,    power:31, type:'magic',    target:'single', hits:1, animation:'dark', effect:'def_down', effectChance:1, effectTurns:1 },
  kurapika_emperor:       { name:'絶対時間（エンペラータイム）',            icon:'💥', spCost:2,    power:61, type:'magic',    target:'single', hits:1, animation:'explosion', recoilPct:0.20, selfEffect:'atk_up', selfEffectTurns:3 },

  // ============================================================
  // 僕のヒーローアカデミア
  // ============================================================
  // -- オールマイト --
  smash_basic:            { name:'スマッシュ',                               icon:'💪', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'punch' },
  detroit_smash:          { name:'デトロイトスマッシュ',                     icon:'💪', spCost:1,   power:35, type:'physical', target:'single', hits:1, animation:'punch_heavy', effect:'stun', effectChance:1, effectTurns:1 },
  plus_ultra:             { name:'ユナイテッド・ステイツ・オブ・スマッシュ', icon:'💥', spCost:3,   power:110, type:'physical', target:'single', hits:1, animation:'punch_heavy', bossKiller:true, shieldBreak:true },
  // -- 緑谷出久 --
  blackwhip_basic:        { name:'黒鞭',                                 icon:'🥦', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'slash' },
  deku_airforce:          { name:'デラウェア・スマッシュ・エアフォース', icon:'🥦', spCost:1,   power:35, type:'physical', target:'all', hits:1, animation:'explosion' },
  deku_100percent:        { name:'ワイオミングスマッシュ',               icon:'💥', spCost:2,   power:65, type:'physical', target:'single', hits:1, animation:'punch_heavy', bossKiller:true, shieldBreak:true },
  // -- 轟焦凍 --
  todoroki_basic:         { name:'半冷半燃',              icon:'🌡️', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  todoroki_fire:          { name:'赫灼熱拳',              icon:'🔥', spCost:1,    power:32, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  todoroki_heaven:        { name:'冷炎白刃',              icon:'🧊', spCost:2,    power:62, type:'magic',    target:'single', hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:3 },
  // -- 爆豪勝己 --
  bakugo_basic:           { name:'爆破',                             icon:'💥', noSP:true,  power:12,  type:'physical', target:'single', hits:1, animation:'explosion' },
  bakugo_blast:           { name:'徹甲弾（A・P・ショット）',         icon:'💥', spCost:1,    power:36, type:'physical', target:'single', hits:1, animation:'explosion', shieldBreak:true },
  bakugo_howitzer:        { name:'榴弾砲着弾（ハウザーインパクト）', icon:'💥', spCost:2,    power:63, type:'magic',    target:'single', hits:1, animation:'explosion', execute:true, shieldBreak:true },

  // ============================================================
  // ジョジョの奇妙な冒険
  // ============================================================
  // -- DIO --
  knife_throw:            { name:'ナイフ投擲',                           icon:'🧛', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  the_world_stop:         { name:'ロードローラーだッ！',                 icon:'💥', spCost:1,   power:36, type:'magic',    target:'single', hits:1, animation:'explosion', execute:true, shieldBreak:true },
  time_erase:             { name:'無駄無駄無駄無駄無駄無駄ァ───ッ！',   icon:'💥', spCost:2,   power:6,  type:'physical', target:'single', hits:11, animation:'explosion', execute:true, shieldBreak:true },
  // -- 空条承太郎 --
  jotaro_basic:           { name:'オラァ！',                         icon:'⭐', noSP:true,   power:12, type:'physical', target:'single', hits:1, animation:'slash' },
  jotaro_time_stop:       { name:'スタープラチナ・ザ・ワールド',     icon:'⏰', spCost:1,    power:0, type:'support', target:'all',    effect:'def_down', effectChance:1, effectTurns:3, animation:'dark' },
  jotaro_ora_rush:        { name:'オラオラオラオラオラオラァ───ッ！', icon:'💥', spCost:2,    power:6,  type:'physical', target:'single', hits:11, animation:'explosion', bossKiller:true, shieldBreak:true },
  // -- ジョセフ・ジョースター --
  joseph_basic:           { name:'ハーミットパープル',                icon:'🔮', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  joseph_nensha:          { name:'念写',                             icon:'🔮', spCost:1,    power:0,  type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:3, animation:'dark' },
  joseph_overdrive:       { name:'波紋疾走（オーバードライブ）',      icon:'💥', spCost:2,    power:60, type:'physical', target:'single', hits:1, animation:'punch_heavy', bossKiller:true },
  // -- 花京院典明 --
  kakyoin_basic:          { name:'ハイエロファントグリーン',          icon:'🍒', noSP:true,  power:12, type:'magic',    target:'single', hits:1, animation:'beam' },
  kakyoin_emerald:        { name:'エメラルドスプラッシュ',            icon:'💥', spCost:1,    power:8,  type:'magic',    target:'all',    hits:4, animation:'beam', execute:true },
  kakyoin_barrier:        { name:'法皇の結界',                       icon:'🕸️', spCost:2,    power:5,  type:'magic',    target:'all',    hits:9, animation:'dark', effect:'atk_down', effectChance:1, effectTurns:2 },
  // -- ジャン＝ピエール・ポルナレフ --
  polnareff_basic:        { name:'レイピア突き',                     icon:'🤺', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  polnareff_rush:         { name:'乱れ突き',                         icon:'🤺', spCost:1,    power:7,  type:'physical', target:'single', hits:5, animation:'slash' },
  polnareff_armor:        { name:'甲冑脱ぎ（アーマーテイクオフ）',    icon:'💥', spCost:2,    power:11, type:'physical', target:'single', hits:6, animation:'slash_heavy', execute:true, selfEffect:'def_down', selfEffectTurns:1 },
  // -- モハメド・アヴドゥル --
  avdol_basic:            { name:'マジシャンズレッド',                icon:'🕯️', noSP:true,  power:12, type:'magic',    target:'single', hits:1, animation:'explosion' },
  avdol_crossfire:        { name:'クロスファイヤーハリケーン',        icon:'🔥', spCost:1,    power:34, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  avdol_crossfire_sp:     { name:'クロスファイヤーハリケーンスペシャル', icon:'💥', spCost:2, power:52, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  // -- イギー --
  iggy_basic:             { name:'砂の爪',                           icon:'🐩', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  iggy_spear:             { name:'砂の槍',                           icon:'🏜️', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'slash' },
  iggy_clone:             { name:'砂像',                             icon:'🛡️', spCost:2,    power:0,  type:'support',  target:'all_ally', effect:'shield', shieldPower:15, effectChance:1, animation:'buff' },

  // ============================================================
  // 転生したらスライムだった件
  // ============================================================
  // -- リムル・テンペスト --
  water_blade:            { name:'水刃',                     icon:'👑', noSP:true,  power:10, type:'magic',    target:'single', hits:1, animation:'ice' },
  storm_magic:            { name:'暴食之王（ベルゼビュート）', icon:'👑', spCost:1,    power:35, type:'magic',    target:'single',    hits:1, animation:'explosion', healSelf:0.2, execute:true },
  megiddo:                { name:'神之怒（メギド）',           icon:'💥', spCost:3,    power:56, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, execute:true },
  // -- ミリム・ナーヴァ --
  milim_basic:            { name:'ドラゴンナックル',               icon:'🍑', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'punch' },
  milim_drago:            { name:'竜星拡散爆（ドラゴ・バスター）', icon:'🍑', spCost:1, power:4, type:'physical', target:'all', hits:10, animation:'explosion', execute:true, shieldBreak:true },
  milim_millennium:       { name:'竜星爆炎覇（ドラゴ・ノヴァ）',   icon:'💥', spCost:3, power:58, type:'magic',    target:'all', hits:1, animation:'explosion', noSpread:true, execute:true, shieldBreak:true },

  // ============================================================
  // 魔法少女まどか☆マギカ
  // ============================================================
  // -- 暁美ほむら --
  pistol_shoot:           { name:'拳銃連射',              icon:'⏰', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  time_stop_hw:           { name:'時間停止',              icon:'⏰', spCost:2,    power:0,   type:'support',  target:'all',    effect:'stun', effectChance:1, effectTurns:1, animation:'dark' },
  barrier_hw:             { name:'全武装展開',            icon:'💥', spCost:2,    power:12, type:'physical', target:'single', hits:5, animation:'explosion' },
  // -- 鹿目まどか --
  madoka_basic:           { name:'ホーミングアロー',      icon:'🎀', noSP:true,   power:6,  type:'physical', target:'single', hits:2, animation:'slash' },
  madoka_heal:            { name:'スターライトアロー',    icon:'🎀', spCost:1,    power:7,   type:'physical', target:'all', hits:5, animation:'explosion', shieldBreak:true },
  madoka_ultimate:        { name:'天上の祈り',            icon:'💚', spCost:2,    power:0,   type:'heal',     target:'all_ally', healPower:30, animation:'heal', effect:'regen', effectChance:1, effectTurns:2 },
  // -- 巴マミ --
  mami_basic:         { name:'マスケット射撃',    icon:'🌼', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  mami_bind:          { name:'レガーレ・ヴァスタリア', icon:'🌼', spCost:2,    power:0,   type:'support',  target:'all',    effect:'stun', effectChance:1, effectTurns:1, animation:'dark' },
  mami_finale:        { name:'ティロ・フィナーレ', icon:'💥', spCost:2,   power:62, type:'physical', target:'single', hits:1, animation:'explosion', bossKiller:true },
  // -- 佐倉杏子 --
  kyoko_basic:        { name:'打突',              icon:'🍎', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  kyoko_spear:        { name:'鉄砕鞭',            icon:'🍎', spCost:1,    power:35, type:'physical', target:'all',    hits:1, animation:'slash' },
  kyoko_temptation:   { name:'浄罪の大炎',        icon:'💥', spCost:2,    power:56, type:'physical', target:'all', hits:1, animation:'explosion', execute:true, recoilPct:0.20 },
  // -- 美樹さやか --
  sayaka_basic:       { name:'剣撃',              icon:'🎵', noSP:true,  power:10,  type:'physical', target:'single', hits:1, animation:'slash' },
  sayaka_slash:       { name:'スティンガー',      icon:'🎵', spCost:1,    power:31,  type:'physical', target:'single', hits:1, animation:'slash', execute:true, shieldBreak:true },
  sayaka_mermaid:     { name:'ローレライの旋律',  icon:'💥', spCost:2,    power:52, type:'magic',    target:'all',    hits:1, animation:'ice' },

  // ============================================================
  // Fate/stay night
  // ============================================================
  // -- アルトリア・ペンドラゴン --
  saber_slash:            { name:'斬撃',                                 icon:'🗡️', noSP:true,  power:12,  type:'physical', target:'single', hits:1, animation:'slash' },
  invisible_air:          { name:'風王鉄槌（ストライク・エア）',         icon:'🌬️', spCost:1,    power:35, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'atk_down', effectChance:1, effectTurns:2 },
  excalibur:              { name:'約束された勝利の剣（エクスカリバー）', icon:'💥', spCost:3,    power:55, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, execute:true },
  // -- アーチャー(衛宮) --
  archer_basic:       { name:'干将・莫耶',                                   icon:'🏹', noSP:true,  power:6,  type:'physical', target:'single', hits:2, animation:'slash' },
  archer_rhoaias:     { name:'熾天覆う七つの円環（ロー・アイアス）',         icon:'🛡️', spCost:2,    power:0,   type:'support',  target:'all_ally', effect:'shield', shieldPower:15, effectChance:1, animation:'buff' },
  archer_unlimited:   { name:'無限の剣製（アンリミテッドブレイドワークス）', icon:'💥', spCost:2,    power:50, type:'physical', target:'all', hits:1, animation:'explosion', selfEffect:'atk_up', selfEffectTurns:3 },
  // -- 遠坂凛 --
  rin_basic:          { name:'蹴り技',             icon:'💎', noSP:true,  power:7,  type:'magic',    target:'single', hits:1, animation:'punch' },
  rin_gandr:          { name:'ガンド撃ち',         icon:'💎', spCost:1,    power:28, type:'magic',    target:'single', hits:1, animation:'dark', effect:'paralyze', effectChance:1, effectTurns:2 },
  rin_jewels:         { name:'フィンのガトリング', icon:'💥', spCost:2,    power:9, type:'magic',     target:'single',    hits:6, animation:'explosion', effect:'curse', effectChance:1, effectTurns:2 },
  // -- ランサー（クー・フーリン） --
  lancer_basic:       { name:'槍の一閃',                         icon:'🏃', noSP:true,  power:12, type:'physical', target:'single', hits:1, animation:'slash' },
  lancer_gae:         { name:'刺し穿つ死棘の槍（ゲイ・ボルク）', icon:'🏃', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'explosion', execute:true, shieldBreak:true },
  lancer_gae_throw:   { name:'突き穿つ死翔の槍（ゲイ・ボルク）', icon:'💥', spCost:2,    power:54, type:'physical', target:'all', hits:1, animation:'explosion', execute:true, shieldBreak:true },
  // -- ギルガメッシュ --
  gilgamesh_basic:    { name:'王の財宝（ゲート・オブ・バビロン）',     icon:'👑', noSP:true,  power:1,  type:'magic',    target:'all',    hits:15, animation:'beam', noSpread:true },
  gilgamesh_chain:    { name:'天の鎖（エルキドゥ）',                   icon:'👑', spCost:1,    power:0,  type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:3, alsoEffect2:'def_down', animation:'dark' },
  gilgamesh_ea:       { name:'天地乖離す開闢の星（エヌマ・エリシュ）', icon:'💥', spCost:3,    power:120, type:'magic',    target:'all',    hits:1, animation:'explosion', execute:true, shieldBreak:true },

  // ============================================================
  // 東京喰種
  // ============================================================
  // -- 金木研 --
  ukaku_basic:            { name:'鱗赫・貫き',     icon:'🕷️', noSP:true,  power:12, type:'physical', target:'single', hits:1, animation:'slash' },
  kagune_burst:           { name:'鱗赫・薙ぎ払い', icon:'🕷️', spCost:1,    power:35, type:'magic',    target:'all',    hits:1, animation:'dark', healSelf:0.2, execute:true, shieldBreak:true },
  kakuja:                 { name:'赫者（ムカデ）', icon:'⬆️', spCost:1,    power:0,  type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  // -- 霧嶋董香 --
  touka_basic:        { name:'結晶化・発射',      icon:'🐰', noSP:true,  power:3,  type:'physical', target:'single', hits:4, animation:'slash' },
  touka_wing:         { name:'捕食',              icon:'🐰', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'slash', healSelf:0.1 },
  touka_dive:         { name:'羽赫・乱れ撃ち',    icon:'💥', spCost:2,    power:49, type:'physical', target:'all',    animation:'explosion', effect:'atk_down', effectChance:1, effectTurns:2 },

  // ============================================================
  // ブラッククローバー
  // ============================================================
  // -- アスタ --
  anti_magic_basic:       { name:'ブラックスラッシュ',    icon:'🍀', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash', },
  black_hole:             { name:'滅魔の剣・因果解放',    icon:'🍀', spCost:1,    power:0,   type:'support',  target:'all',    effect:'dispel', effectChance:1, animation:'dark', alsoEffect2:'curse', effectTurns:4 },
  black_divider:          { name:'断魔の剣・ブラックディバイダー', icon:'💥', spCost:2,    power:63,  type:'physical', target:'single', hits:1, animation:'slash_heavy', effect:'def_down', effectChance:1, effectTurns:2, execute:true, shieldBreak:true },
  // -- ヤミ・スケヒロ --
  yami_basic:         { name:'闇纏・無明斬り',            icon:'🌑', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'slash' },
  yami_slash:         { name:'黒月',                      icon:'🌑', spCost:1,    power:0,   type:'support',  target:'all',    effect:'dispel', effectChance:1, animation:'dark' },
  yami_dimension:     { name:'闇纏・次元斬り',            icon:'💥', spCost:2,    power:61, type:'physical', target:'single', hits:1, animation:'slash_heavy', shieldBreak:true },

  // ============================================================
  // 進撃の巨人
  // ============================================================
  // -- リヴァイ --
  levi_basic:             { name:'立体機動連撃',          icon:'⚔️', noSP:true,  power:2, type:'physical', target:'single', hits:7, animation:'slash' },
  levi_aerial:            { name:'斬撃乱舞',              icon:'⚔️', spCost:1,    power:5, type:'physical', target:'all',    hits:7, animation:'slash' },
  levi_perfect:           { name:'リヴァイ斬り',          icon:'💥', spCost:2,    power:6, type:'physical', target:'single', hits:11, animation:'slash_heavy', bossKiller:true },
  // -- エレン・イェーガー --
  eren_basic:         { name:'立体機動連撃',      icon:'🦅', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  eren_thunderspear:  { name:'雷槍',              icon:'⚡', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  eren_rumbling:      { name:'硬質化パンチ',      icon:'💥', spCost:3,    power:110, type:'physical', target:'all', hits:1, animation:'punch_heavy', shieldBreak:true },
  // -- ミカサ・アッカーマン --
  mikasa_basic:        { name:'立体機動連撃',         icon:'🔴', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  mikasa_thunderspear: { name:'雷槍',                 icon:'⚡', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn',    effectChance:1, effectTurns:2 },
  mikasa_protect:      { name:'アッカーマン家の血筋', icon:'🔴', spCost:1,   power:0,   type:'support', target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  // -- アルミン・アルレルト --
  armin_basic:        { name:'立体機動斬撃',      icon:'🧠', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  armin_thunderspear: { name:'雷槍',              icon:'⚡', spCost:1,    power:30,  type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn',    effectChance:1, effectTurns:2 },
  armin_plan:         { name:'立案',              icon:'🧠', spCost:1,    power:0,   type:'support',  target:'all_ally', effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  // -- エルヴィン・スミス --
  erwin_basic:        { name:'立体機動斬撃',      icon:'🫀', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  erwin_thunderspear: { name:'雷槍',              icon:'⚡', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  erwin_charge:       { name:'心臓を捧げよ！',    icon:'🫀', spCost:2,    power:0,  type:'support',  target:'all_ally', effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  // -- ハンジ・ゾエ --
  hange_basic:        { name:'立体機動斬撃',      icon:'🥽', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  hange_thunderspear: { name:'雷槍',              icon:'⚡', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  hange_dissect:      { name:'巨人の解剖',        icon:'🥽', spCost:1,    power:0,  type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:3, animation:'dark' },

  // ============================================================
  // 七つの大罪
  // ============================================================
  // -- メリオダス --
  meliodas_basic:         { name:'魔剣ロストヴェイン',       icon:'⚔️', noSP:true,   power:12, type:'physical', target:'single', hits:1, animation:'slash' },
  meliodas_reflection:    { name:'リベンジカウンター',     icon:'⚔️', spCost:1,    power:50, type:'physical', target:'single', hits:1, animation:'slash', execute:true, selfEffect:'def_down', selfEffectTurns:2 },
  meliodas_rising:        { name:'獄炎（ヘルブレイズ）',     icon:'🔥', spCost:2,    power:61, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:6 },
  // -- エスカノール --
  escanor_basic:      { name:'神斧リッタ',                       icon:'🌞', noSP:true,  power:12, type:'physical', target:'single', hits:1, animation:'slash' },
  escanor_sunshine:   { name:'無慈悲な太陽（クルーエル・サン）', icon:'🌞', spCost:1,    power:37, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  escanor_the_one:    { name:'天上天下唯我独尊（ザ・ワン）',     icon:'🌞', spCost:2,    power:53, type:'physical', target:'single', hits:1, animation:'explosion', selfEffect:'atk_up', selfEffectTurns:3 },
  // -- バン --
  ban_basic:          { name:'聖棍クレシューズ',                 icon:'🦊', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  ban_snatch:         { name:'身体狩り（フィジカルハント）',     icon:'🦊', spCost:1,    power:33, type:'physical', target:'single', hits:1, animation:'slash', effect:'atk_down', effectChance:1, effectTurns:1 },
  ban_immortal:       { name:'不死身',                           icon:'🦊', spCost:1,    power:0,  type:'heal',     target:'self',   healPower:30, animation:'heal' },
  // -- キング（ハーレクイン） --
  harlequin_basic:    { name:'霊槍シャスティフォル',             icon:'🧚', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  harlequin_fossil:   { name:'第三形態「化石化」',               icon:'🧚', spCost:1,    power:33, type:'physical', target:'single', hits:1, animation:'slash', effect:'paralyze', effectChance:1, effectTurns:3 },
  harlequin_garden:   { name:'第八形態「花粒園」',               icon:'🛡️', spCost:2,    power:0,  type:'support',  target:'all_ally', effect:'shield', shieldPower:15, effectChance:1, animation:'buff' },
  // -- ディアンヌ --
  diane_basic:        { name:'戦鎚ギデオン',                     icon:'🪨', noSP:true,  power:14, type:'physical', target:'single', hits:1, animation:'punch' },
  diane_rush:         { name:'千の礫（ラッシュ・ロック）',       icon:'🪨', spCost:1,    power:5,  type:'physical', target:'single', hits:7, animation:'punch' },
  diane_catastrophe:  { name:'大地の怒号（マザー・カタストロフィ）', icon:'🪨', spCost:2, power:62, type:'physical', target:'single', hits:1, animation:'explosion', shieldBreak:true, execute:true },
  // -- マーリン --
  merlin_basic:       { name:'明星アルダン',                     icon:'♾️', noSP:true,  power:11, type:'magic',    target:'single', hits:1, animation:'beam' },
  merlin_stinger:     { name:'衝撃の尾針（ショックスティンガー）', icon:'♾️', spCost:1,   power:34, type:'magic',    target:'single', hits:1, animation:'beam', effect:'stun', effectChance:1, effectTurns:1 },
  merlin_javelin:     { name:'天雷撃（ブリッツ・ジャベリン）',   icon:'💥', spCost:2,    power:56, type:'magic',    target:'all',    hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3 },
  // -- ゴウセル --
  gowther_basic:      { name:'双弓ハーリット',                   icon:'🐐', noSP:true,  power:4,  type:'physical', target:'single', hits:3, animation:'slash' },
  gowther_jack:       { name:'傀儡縛り（ジャック）',             icon:'🐐', spCost:1,    power:33, type:'magic',    target:'single', hits:1, animation:'dark', effect:'def_down', effectChance:1, effectTurns:1 },
  gowther_blackout:   { name:'大停電（ブラックアウト）',         icon:'🐐', spCost:2,    power:0,  type:'support',  target:'all',    effect:'stun', effectChance:1, effectTurns:1, animation:'dark' },

  // ============================================================
  // FAIRY TAIL
  // ============================================================
  // -- ナツ・ドラグニル --
  natsu_basic:            { name:'火竜の鉄拳',            icon:'🐉', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'punch' },
  natsu_iron:             { name:'雷炎竜の撃鉄',          icon:'⚡', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:2 },
  natsu_explode:          { name:'滅竜奥義・漆黒爆炎刃',  icon:'💥', spCost:2,    power:64, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:4, bossKiller:true },
  // -- エルザ・スカーレット --
  erza_basic:             { name:'天輪の鎧',          icon:'⚔️', noSP:true,  power:12,  type:'physical', target:'single', hits:1, animation:'slash' },
  erza_eight:             { name:'天輪・五芒星の剣',  icon:'⚔️', spCost:1,    power:7,   type:'physical', target:'single', hits:5, animation:'slash' },
  erza_hero:              { name:'妖精の鎧',          icon:'💥', spCost:2,    power:30, type:'magic', target:'single', hits:2, animation:'explosion', execute:true },
  // -- グレイ・フルバスター --
  gray_basic:             { name:'アイスメイク・ランス',      icon:'🧊', noSP:true,  power:10,  type:'magic',    target:'single', hits:1, animation:'ice' },
  gray_rampart:           { name:'アイスメイク・ランパート',  icon:'🧊', spCost:2,    power:0,   type:'support',  target:'all_ally', effect:'shield', shieldPower:10, effectChance:1, animation:'buff' },
  gray_ice_emperor:       { name:'銀世界（シルバー）',        icon:'💥', spCost:2,    power:47, type:'magic', target:'all',   hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:2 },
  // -- ルーシィ・ハートフィリア --
  lucy_basic:             { name:'星霊召喚・ニコラ',          icon:'⭐', noSP:true,  power:5,  type:'physical', target:'single', hits:1, animation:'slash' },
  lucy_aquarius:          { name:'星霊召喚・アクエリアス',    icon:'💧', spCost:1,    power:29, type:'magic',    target:'all',    hits:1, animation:'ice', effect:'atk_down', effectChance:1, effectTurns:1 },
  lucy_stardress:         { name:'ウラノ・メトリア',          icon:'💥', spCost:2,    power:9,  type:'magic',    target:'all',    hits:6, animation:'explosion' },

  // ============================================================
  // オーバーロード
  // ============================================================
  // -- アインズ・ウール・ゴウン --
  ainz_basic:             { name:'心臓掌握（グラスプ・ハート）', icon:'💀', noSP:true,  power:14,  type:'physical', target:'single', hits:1, animation:'dark' },
  ainz_timestop:          { name:'上位道具作成',                 icon:'🗡', spCost:1,   power:0,   type:'support', target:'all_ally',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  ainz_annihilate:        { name:'隕石落下（メテオフォール）',    icon:'💥', spCost:3,   power:110, type:'magic', target:'all', hits:1, animation:'explosion', shieldBreak:true },
  // -- アルベド --
  albedo_basic:       { name:'3F',                         icon:'👸', noSP:true,  power:9,  type:'physical', target:'single', hits:1, animation:'slash' },
  albedo_guardian:    { name:'ウォールズ・オブ・ジェリコ', icon:'🛡️', spCost:2,    power:0,   type:'support',  target:'all_ally', effect:'shield', shieldPower:10, effectChance:1, animation:'buff' },
  albedo_apocalypse:  { name:'真なる無（ギンヌンガガプ）', icon:'💥', spCost:2,    power:56, type:'physical', target:'single', hits:1, animation:'slash_heavy', effect:'def_down', effectChance:1, effectTurns:2, shieldBreak:true },

  // ============================================================
  // この素晴らしい世界
  // ============================================================
  // -- アクア --
  aqua_basic:             { name:'花鳥風月',                       icon:'💧', noSP:true,  power:4,  type:'magic',    target:'single', hits:1, animation:'ice' },
  aqua_revive:            { name:'リザレクション',                 icon:'💚', spCost:1,    power:0,   type:'revive',   target:'dead_ally', animation:'heal' },
  aqua_sacred:            { name:'ゴッドブロー',                   icon:'💥', spCost:1,    power:20, type:'magic', target:'single',  hits:1, animation:'explosion', shieldBreak:true },
  // -- ダクネス --
  darkness_basic:         { name:'アイアンクロー',        icon:'⚔️', noSP:true,  power:4,  type:'physical', target:'single', hits:1, animation:'slash' },
  darkness_taunt:         { name:'デコイ',                icon:'⚔️', spCost:1,    power:0,   type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:3, animation:'dark' },
  darkness_holy:          { name:'特殊な嗜好',            icon:'🖤', spCost:1,    power:0,   type:'heal',     target:'self',   healPower:30, animation:'heal' },
  // -- めぐみん --
  megumin_basic:      { name:'チョークスリーパー', icon:'💣', noSP:true,  power:4,  type:'physical', target:'single', hits:1, animation:'slash' },
  megumin_chant:      { name:'詠唱呪文',           icon:'⬆️', spCost:1,    power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:2, animation:'buff' },
  megumin_advanced:   { name:'エクスプロージョン', icon:'💥', spCost:5,    power:120, type:'magic',    target:'all', hits:1, animation:'explosion', selfEffect:'atk_down', selfEffectTurns:3, execute:true, bossKiller:true },
  // -- 佐藤和真 --
  kazuma_basic:       { name:'名刀・ちゅんちゅん丸', icon:'🎲', noSP:true,  power:4, type:'physical',  target:'single', hits:1, animation:'slash' },
  kazuma_steal:       { name:'スティール',           icon:'🎲', spCost:1,    power:0,   type:'support',  target:'single', effect:'dispel', effectChance:1, animation:'dark', alsoEffect2:'def_down', effectTurns:3 },
  kazuma_lucky:       { name:'狙撃',                 icon:'💥', spCost:1,    power:20, type:'physical', target:'single', hits:1, animation:'explosion', },

  // ============================================================
  // チェンソーマン
  // ============================================================
  // -- デンジ --
  denji_basic:        { name:'チェンソー斬り',    icon:'⛓️', noSP:true,  power:2, type:'physical', target:'single', hits:6, animation:'slash' },
  denji_saw:          { name:'チェンソー乱撃',    icon:'⛓️', spCost:1,    power:4, type:'physical',  target:'all',    hits:9, animation:'slash', execute:true },
  denji_chainsaw:     { name:'永久機関',          icon:'💥', spCost:2,    power:62, type:'physical', target:'single', hits:1, animation:'slash_heavy', healSelf:0.2 },
  // -- パワー --
  power_basic:        { name:'血の鉈',            icon:'🩸', noSP:true,   power:12, type:'physical', target:'single', hits:1, animation:'slash' },
  power_blood:        { name:'止血',              icon:'💚', spCost:1,    power:0,   type:'heal',    target:'single', healPower:20, animation:'heal' },
  power_hammer:       { name:'血のハンマー',      icon:'💥', spCost:2,    power:60, type:'physical', target:'single', hits:1, animation:'punch_heavy', shieldBreak:true },
  // -- マキマ --
  makima_basic:       { name:'「ぱん」',                   icon:'🐕', noSP:true,  power:11,  type:'magic',    target:'single', hits:1, animation:'beam' },
  makima_control:     { name:'「ばん」「ばん」「ばーん」', icon:'🐕', spCost:1,    power:11,  type:'magic',    target:'single', hits:3, animation:'beam' },
  makima_will:        { name:'支配・服従',                 icon:'🐕', spCost:2,    power:0,   type:'support',  target:'all',    effect:'stun', effectChance:1, effectTurns:1, animation:'dark' },
  // -- 早川アキ --
  aki_basic:          { name:'日本刀',            icon:'🪖', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  aki_fox:            { name:'召喚・狐の悪魔',    icon:'🦊', spCost:1,    power:35, type:'physical', target:'single', hits:1, animation:'slash' },
  aki_future:         { name:'未来の悪魔・予知',  icon:'🪖', spCost:1,    power:0,   type:'support',  target:'all_ally', effect:'def_up', effectChance:1, effectTurns:3, animation:'buff' },

  // ============================================================
  // スパイ×ファミリー
  // ============================================================
  // ============================================================
  // 炎炎ノ消防隊
  // ============================================================
  // -- 森羅日下部 --
  shinra_basic:    { name:'森羅イダーキック',    icon:'🔥', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'punch' },
  shinra_adolla:   { name:'高速粒子化',          icon:'⬆️', spCost:1,    power:0,  type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:4, animation:'buff', alsoEffect2:'def_up' },
  shinra_burst:    { name:'悪魔の型（コルナ）',    icon:'💥', spCost:2,    power:64, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2, bossKiller:true, shieldBreak:true },
  // -- アーサー・ボイル --
  arthur_basic:    { name:'炎の剣（エクスカリバー）', icon:'⚔️', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'slash' },
  arthur_plasma:   { name:'紫電一閃',               icon:'⚡', spCost:1,    power:34, type:'physical', target:'single', hits:1, animation:'slash' },
  arthur_excalibur:{ name:'居合カリバー',           icon:'⚡', spCost:2,    power:60, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true, shieldBreak:true },
  // -- 新門紅丸 --
  benimaru_basic:  { name:'居合手刀',               icon:'✋', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'slash' },
  benimaru_kagetsu:{ name:'壱ノ型『火月』',          icon:'🌙', spCost:1,    power:35, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3 },
  benimaru_nichirin:{ name:'漆ノ型『日輪紅月』',     icon:'☀️', spCost:2,    power:65, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:3, execute:true, shieldBreak:true },

  // ============================================================
  // FINAL FANTASY
  // ============================================================
  // -- クラウド・ストライフ --
  cloud_basic:     { name:'破晄撃',               icon:'⚔️', noSP:true,  power:12, type:'physical', target:'single', hits:1,  animation:'slash' },
  cloud_braver:    { name:'凶斬り',               icon:'⚔️', spCost:1,    power:7,  type:'physical', target:'single', hits:5,  animation:'slash', effect:'paralyze', effectChance:1, effectTurns:3, execute:true },
  cloud_omnislash: { name:'画龍点睛',             icon:'💥', spCost:2,    power:66, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true, shieldBreak:true },
  // -- セフィロス --
  seph_basic:      { name:'一陣',                 icon:'🗡️', noSP:true,  power:13, type:'physical', target:'single', hits:1, animation:'slash' },
  seph_shadow:     { name:'八刀一閃',             icon:'😈', spCost:1,    power:4,  type:'magic',    target:'single', hits:8, animation:'slash', execute:true },
  seph_supernova:  { name:'スーパーノヴァ',       icon:'🌟', spCost:3,    power:56, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, effect:'def_down', effectChance:1, effectTurns:2 },
  // -- ティファ・ロックハート --
  tifa_basic:      { name:'サマーソルト',         icon:'🦶', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  tifa_straight: { name:'正拳突き',               icon:'👊', spCost:1,    power:28,  type:'physical', target:'single', hits:1, animation:'punch', effect:'def_down', effectChance:1, effectTurns:1 },
  tifa_final_heaven:{ name:'ファイナルヘブン',    icon:'💥', spCost:2,    power:61,  type:'physical', target:'single', hits:1, animation:'explosion', shieldBreak:true },
  // -- エアリス --
  aerith_basic:    { name:'ロッド',               icon:'🌸', noSP:true,  power:8,  type:'physical', target:'single', hits:1, animation:'slash' },
  aerith_heal:     { name:'癒しの風',             icon:'💚', spCost:2,    power:0,   type:'heal',     target:'all_ally', healPower:20, animation:'heal' },
  aerith_gospel:   { name:'星の守護',         icon:'🛡️', spCost:2,    power:0,   type:'support',  target:'all_ally', animation:'buff', effect:'shield', shieldPower:15, effectChance:1 },

  // ============================================================
  // とある魔術の禁書目録
  // ============================================================
  // -- 御坂美琴 --
  misaka_basic:    { name:'落雷',                   icon:'⚡', noSP:true,   power:2, type:'magic',     target:'single', hits:6, animation:'beam' },
  misaka_storm:    { name:'サンダーストーム',       icon:'⛈️', spCost:1,    power:32, type:'magic',    target:'all',    hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3 },
  misaka_dragon:   { name:'超電磁砲（レールガン）', icon:'💥', spCost:2,    power:64, type:'magic',    target:'single', hits:1, animation:'thunder', bossKiller:true, shieldBreak:true },
  // -- 一方通行 --
  accel_basic:     { name:'小石の砲弾',             icon:'🔄', noSP:true,  power:14, type:'physical', target:'single', hits:1, animation:'slash' },
  accel_vector:    { name:'大気圧縮・プラズマ生成', icon:'💥', spCost:1,    power:35, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true },
  accel_rampage:   { name:'黒い翼',                 icon:'💀', spCost:3,    power:110, type:'magic',    target:'single',    hits:1, animation:'explosion', execute:true, shieldBreak:true },
  // -- 上条当麻 --
  touma_basic:     { name:'拳',                             icon:'✊', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'punch' },
  touma_cancel:    { name:'幻想殺し（イマジンブレイカー）', icon:'✊', spCost:1,    power:0,   type:'support',  target:'single', effect:'dispel', effectChance:1, animation:'dark', alsoEffect2:'atk_down', effectTurns:3 },
  touma_possibility:{ name:'竜王の顎（ドラゴンストライク）',  icon:'💥', spCost:2,    power:58, type:'physical', target:'single', hits:1, animation:'punch_heavy', bossKiller:true, shieldBreak:true },
  // -- インデックス --
  index_basic:     { name:'シェオールフィア（魔滅の声）', icon:'📚', noSP:true,  power:8,  type:'magic',    target:'single', hits:1, animation:'beam' },
  index_spell:     { name:'自動書記（ヨハネのペン）',     icon:'📚', spCost:1,    power:0,   type:'support',  target:'all_ally', effect:'atk_up', effectChance:1, effectTurns:3,  animation:'buff' },
  index_soul:      { name:'竜王の殺息（ドラゴンブレス）', icon:'💥', spCost:4,    power:75, type:'magic',    target:'single',    hits:1, animation:'explosion', shieldBreak:true },
  // -- 白井黒子 --
  kuroko_basic:    { name:'空間移動',               icon:'✨', noSP:true,  power:6,  type:'physical', target:'single',  hits:2, animation:'beam' },
  kuroko_tele:     { name:'ドロップキック',         icon:'✨', spCost:1,    power:31, type:'physical', target:'single', hits:1, animation:'punch', effect:'def_down', effectChance:1, effectTurns:1 },
  kuroko_pin:      { name:'金属矢・拘束',           icon:'✨', spCost:1,    power:33, type:'physical', target:'single', hits:1, animation:'slash', effect:'stun', effectChance:1, effectTurns:1 },

  // ============================================================
  // 葬送のフリーレン
  // ============================================================
  // -- フリーレン --
  frieren_basic:   { name:'一般攻撃魔法（ゾルトラーク）',           icon:'🧝', noSP:true,  power:14,  type:'magic',   target:'single', hits:1, animation:'beam' },
  frieren_defense: { name:'防御魔法',                               icon:'🛡️', spCost:2,    power:0,   type:'support',  target:'all_ally', effect:'shield', shieldPower:15, effectChance:1, animation:'buff' },
  frieren_judradjim:{ name:'破滅の雷を放つ魔法（ジュドラジルム）',  icon:'💥', spCost:2,    power:53, type:'magic',    target:'all',    hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3, noSpread:true },
  // -- フェルン --
  fern_basic:      { name:'一般攻撃魔法（ゾルトラーク）', icon:'🌙', noSP:true,  power:4,  type:'magic',    target:'single', hits:3, animation:'beam' },
  fern_defense:      { name:'防御魔法',                   icon:'🛡️', spCost:2,    power:0,   type:'support',  target:'all_ally', effect:'shield', shieldPower:10, effectChance:1, animation:'buff' },
  fern_zoltraak:   { name:'ゾルトラーク・速射',           icon:'💥', spCost:2,    power:6,  type:'magic',    target:'all',    hits:9, animation:'beam', execute:true },
  // -- シュタルク --
  stark_basic:     { name:'斧撃',                 icon:'🪓', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  stark_axe:       { name:'光天斬',               icon:'🪓', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'explosion', effect:'def_down', effectChance:1, effectTurns:1 },
  stark_senten:    { name:'閃天撃',               icon:'💥', spCost:1,    power:32, type:'physical', target:'single', hits:1, animation:'slash_heavy', execute:true, shieldBreak:true },
  // -- ザイン --
  sein_basic:      { name:'女神の三槍',           icon:'📿', noSP:true,  power:4,  type:'magic',    target:'single', hits:3, animation:'beam' },
  sein_heal:       { name:'回復魔法',             icon:'💚', spCost:2,    power:0,   type:'heal',     target:'single', healPower:20, animation:'heal', effect:'regen', effectChance:1, effectTurns:2 },
  sein_blessing:   { name:'蘇生魔法',             icon:'💚', spCost:2,    power:0,   type:'revive',   target:'dead_ally', animation:'heal' },

  // ============================================================
  // 無職転生
  // ============================================================
  // -- ルーデウス・グレイラット --
  rudeus_basic:    { name:'岩砲弾（ストーンキャノン）',   icon:'🪨', noSP:true, power:13, type:'magic',   target:'single', hits:1, animation:'beam' },
  rudeus_swamp:    { name:'泥沼（クアグマイア）',         icon:'🕳️', spCost:1,   power:0,   type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:3, alsoEffect2:'def_down', animation:'dark' },
  rudeus_lightning:{ name:'雷光（ライトニング）',         icon:'💥', spCost:2,   power:56, type:'magic',    target:'all',    hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3, noSpread:true },
  // -- エリス・ボレアス・グレイラット --
  eris_basic:      { name:'斬撃',                 icon:'🦁', noSP:true,  power:11, type:'physical', target:'single', hits:1, animation:'slash' },
  eris_rengeki:    { name:'苛烈な連撃',           icon:'⚔️', spCost:1,    power:7, type:'physical',  target:'all', hits:5, animation:'slash' },
  eris_rush:       { name:'光の太刀',             icon:'💥', spCost:2,    power:64, type:'physical', target:'single', hits:1, animation:'slash', execute:true, shieldBreak:true },
  // -- ロキシー・ミグルディア --
  roxy_basic:      { name:'水弾（ウォーターボール）',   icon:'💧', noSP:true,  power:10,  type:'magic',    target:'single', hits:1, animation:'ice' },
  roxy_icicle:     { name:'氷霜撃（アイシクルブレイク）', icon:'💧', spCost:1,    power:34, type:'magic',    target:'single', hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:2 },
  roxy_cumulonimbus:{ name:'雷雲（キュムロニンバス）',  icon:'💥', spCost:2,    power:52, type:'magic',    target:'all',    hits:1, animation:'thunder', effect:'paralyze', effectChance:1, effectTurns:3 },
  // -- シルフィエット --
  sylphie_basic:   { name:'無詠唱・風弾',                     icon:'🍃', noSP:true,  power:10,  type:'magic',    target:'single', hits:1, animation:'beam' },
  sylphie_heal:    { name:'シャインヒーリング',               icon:'💚', spCost:1,    power:0,   type:'heal',    target:'single', healPower:30, animation:'heal' },
  sylphie_wind:    { name:'風槍竜巻（トルネイドインパクト）', icon:'💥', spCost:2,    power:47, type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'atk_down', effectChance:1, effectTurns:2 },
  // ============================================================
  // 盾の勇者の成り上がり
  // ============================================================
  // -- 岩谷尚文 --
  naofumi_basic:   { name:'盾の打撃',             icon:'🛡️', noSP:true,  power:6,  type:'physical', target:'single', hits:1, animation:'punch' },
  naofumi_airst:   { name:'エアストシールド',     icon:'🛡️', spCost:2,    power:0,   type:'support',  target:'all_ally', effect:'shield', shieldPower:20, effectChance:1, animation:'buff' },
  naofumi_maiden:  { name:'アイアンメイデン',     icon:'💥', spCost:2,    power:63, type:'physical', target:'single', hits:1, animation:'explosion' },
  // -- ラフタリア --
  raphtalia_basic: { name:'一閃',                     icon:'🦝', noSP:true,  power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  raphtalia_stardust:{ name:'スターダスト・ブレイド', icon:'✨', spCost:1,    power:11,  type:'magic',    target:'single', hits:3, animation:'slash' },
  raphtalia_tenmei:{ name:'八極陣天命剣',             icon:'💥', spCost:2,    power:61, type:'physical', target:'single', hits:1, animation:'slash', execute:true },
  // -- フィーロ --
  filo_basic:      { name:'フィロリアルの蹴り',     icon:'🐤', noSP:true,  power:10, type:'physical', target:'single', hits:1, animation:'punch' },
  filo_quick:      { name:'ハイクイック',           icon:'🐤', spCost:1,    power:10,  type:'physical', target:'single', hits:3, animation:'punch', effect:'def_down', effectChance:1, effectTurns:1 },
  filo_tornado:    { name:'ドライファ・トルネード', icon:'💥', spCost:2,    power:48, type:'magic',    target:'all',    hits:1, animation:'explosion' },
};

