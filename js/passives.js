// ============================================================
// PASSIVE DATA — all character passives keyed by character id
// ============================================================
const ALL_STATUS = ['stun','paralyze','poison','burn','atk_down','def_down','freeze','curse'];

const PASSIVE_DATA = {

  // ==== ドラゴンボール ====
  goku:         { name:'超サイヤ人',              type:'low_hp_atk',              desc:'HP50%↓ 攻防↑＋リジェネ（3T）', threshold:0.5, buffs:['atk_up','def_up','regen'], turns:3 },
  vegeta:       { name:'エリートの誇り',          type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  gohan:        { name:'潜在能力解放',            type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  piccolo:      { name:'ナメック星人',            type:'regen',                   desc:'毎T HP3%回復', value:0.03 },
  trunks:       { name:'ゼットソード',            type:'boss_damage',             desc:'ボスへ与ダメ+15%', value:0.15 },
  krillin:      { name:'最強の地球人',            type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  frieza:       { name:'帝王の威圧',              type:'enemy_debuff_start',      desc:'開幕 敵全攻↓(1T)', turns:1 },

  // ==== NARUTO ====
  naruto:       { name:'仙人モード',              type:'low_hp_atk',              desc:'HP50%↓ 攻防↑＋リジェネ（3T）', threshold:0.5, buffs:['atk_up','def_up','regen'], turns:3 },
  kakashi:      { name:'写輪眼',                  type:'enemy_debuff_start',      desc:'開幕 敵全に防↓(1T)', debuff:'def_down', turns:1 },
  sasuke:       { name:'写輪眼',                  type:'enemy_debuff_start',      desc:'開幕 敵全に防↓(1T)', debuff:'def_down', turns:1 },
  itachi:       { name:'写輪眼',                  type:'enemy_debuff_start',      desc:'開幕 敵全に防↓(1T)', debuff:'def_down', turns:1 },
  tsunade:      { name:'百豪の術',                type:'regen_team',              desc:'毎T 味方全HP2%回復', value:0.02 },
  gaara:        { name:'砂の盾',                  type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  jiraiya:      { name:'ガマ仙人',                type:'sp_max_up',               desc:'最大SP+1', value:1 },

  // ==== ONE PIECE ====
  luffy:        { name:'ギア5',                   type:'low_hp_atk',              desc:'HP50%↓ 攻防↑＋リジェネ（3T）', threshold:0.5, buffs:['atk_up','def_up','regen'], turns:3 },
  zoro:         { name:'三刀流',                  type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },
  sanji:        { name:'黒足',                    type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+30%', effect:'burn', value:0.30 },
  ace:          { name:'メラメラの実',            type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+30%', effect:'burn', value:0.30 },
  nami:         { name:'天候予測',                type:'status_immune',           desc:'味方全の麻痺・凍結無効', targets:['paralyze','freeze'] },
  robin:        { name:'ハナハナの実',            type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  shanks:       { name:'四皇の風格',              type:'battle_start_team_atk',   desc:'開幕 味方全攻↑(2T)', turns:2 },

  // ==== ワンパンマン ====
  saitama:      { name:'ハゲマント',              type:'compound',                desc:'状態異常無効', effects:[{type:'status_immune',targets:['stun','paralyze','poison','burn','atk_down','def_down','freeze','curse']}] },
  genos:        { name:'鬼サイボーグ',            type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  garou:        { name:'怪人覚醒',                type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  tatsumaki:    { name:'念動力バリア',            type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  king:         { name:'キングエンジン',          type:'enemy_debuff_start',      desc:'開幕 敵全攻↓(1T)', turns:1 },
  sonic:        { name:'音速',                    type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },

  // ==== 鬼滅の刃 ====
  rengoku:      { name:'心を燃やせ',              type:'battle_start_team_atk',   desc:'開幕 味方全攻↑(1T)', turns:1 },
  tanjiro:      { name:'全集中の呼吸',            type:'battle_start_buffs',      desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  nezuko:       { name:'鬼の再生力',              type:'regen',                   desc:'毎T HP3%回復', value:0.03 },
  zenitsu:      { name:'覚悟',                    type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  tomioka:      { name:'水柱',                    type:'status_immune',           desc:'味方全の燃焼・呪い無効', targets:['burn','curse'] },
  inosuke:      { name:'猪突猛進',                type:'battle_start_buffs',      desc:'開幕 自分に攻↑(2T)', buffs:['atk_up'], turns:2 },
  mitsuri:      { name:'恋柱',                    type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },

  // ==== SAO ====
  kirito:       { name:'二刀流',                  type:'multi_hit_boost',         desc:'連続ヒット技+30%', value:0.30 },
  asuna:        { name:'閃光',                    type:'battle_start_atk',        desc:'開幕 攻↑(2T)', turns:2 },
  sinon:        { name:'氷の狙撃手',              type:'exploit_status',          desc:'防御↓中の敵へ与ダメ+20%', effect:'def_down', value:0.20 },
  yuuki:        { name:'絶剣',                    type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },
  leafa:        { name:'スピードホリック',        type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  alice:        { name:'整合騎士',                type:'battle_start_team_def',   desc:'開幕 味方全防↑(1T)', turns:1 },

  // ==== Re:ゼロ ====
  emilia:       { name:'精霊の祝福',              type:'regen_team',              desc:'毎T 味方全HP3%回復', value:0.03 },
  rem:          { name:'鬼化',                    type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  subaru:       { name:'死に戻り',                type:'survive_fatal',           desc:'致死ダメージをHP1で耐える' },
  beatrice:     { name:'禁書庫の叡智',            type:'sp_max_up',               desc:'最大SP+1', value:1 },
  ram:          { name:'鬼神の血',                type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  reinhard:     { name:'無数の加護',              type:'compound',                desc:'気絶・攻↓・防↓無効', effects:[{type:'status_immune',targets:['stun','atk_down','def_down']}] },

  // ==== ポケモン ====
  pikachu:      { name:'せいでんき',              type:'counter_status',          desc:'被弾時、攻撃した敵を麻痺(3T)', effect:'paralyze', chance:1.0, turns:3 },
  mewtwo:       { name:'プレッシャー',            type:'enemy_debuff_start',      desc:'開幕 敵全攻↓(2T)', turns:2 },
  lucario:      { name:'せいしんりょく',          type:'compound',                desc:'気絶・攻↓・防↓無効', effects:[{type:'status_immune',targets:['stun','atk_down','def_down']}] },
  charizard:    { name:'もうか',                  type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  gengar:       { name:'のろわれボディ',          type:'counter_status',          desc:'被弾時、攻撃した敵を呪う(2T)', effect:'curse', chance:1.0, turns:2 },
  goodra:       { name:'ぬめぬめ',                type:'counter_status',          desc:'被弾時、攻撃した敵の攻↓(2T)', effect:'atk_down', chance:1.0, turns:2 },
  ampharos:     { name:'プラス',                  type:'battle_start_team_atk',   desc:'開幕 味方全攻↑(1T)', turns:1 },

  // ==== 鋼の錬金術師 ====
  edward:       { name:'機械鎧の義手',            type:'basic_atk_boost',         desc:'通常攻撃+150%', value:1.50 },
  mustang:      { name:'焔の錬金術師',            type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+30%', effect:'burn', value:0.30 },
  alphonse:     { name:'鋼の鎧',                  type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  riza:         { name:'鷹の眼',                  type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },
  greed:        { name:'最強の盾（アルティメット・シールド）', type:'shield_start',       desc:'開幕 シールド(HP15%)', value:0.15 },

  // ==== 呪術廻戦 ====
  gojo:         { name:'六眼',                    type:'sp_regen',                desc:'毎T SP+1' },
  sukuna:       { name:'呪いの王',                type:'exploit_status',          desc:'呪い中の敵へ与ダメ+30%', effect:'curse', value:0.30 },
  megumi_ft:    { name:'十種影法術',              type:'sp_max_up',               desc:'最大SP+1', value:1 },
  itadori:      { name:'宿儺の器',                type:'compound',                desc:'毎T HP3%回復・毒/呪い無効', effects:[{type:'regen',value:0.03},{type:'status_immune',targets:['poison','curse']}] },
  nanami:       { name:'時間外労働',              type:'low_hp_atk',              desc:'HP50%↓ 防↑（3T）', threshold:0.5, buff:'def_up', turns:3 },
  nobara:       { name:'芻霊呪法',                type:'counter',                 desc:'被ダメの50%を反射', value:0.50 },
  yuta:         { name:'里香の加護',              type:'compound',                desc:'気絶・攻↓・防↓無効', effects:[{type:'status_immune',targets:['stun','atk_down','def_down']}] },

  // ==== BLEACH ====
  ichigo:       { name:'卍解・天鎖斬月',          type:'battle_start_buffs',      desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  rukia:        { name:'袖白雪',                  type:'status_immune',           desc:'味方全の燃焼・凍結無効', targets:['burn','freeze'] },
  hitsugaya:    { name:'氷輪丸',                  type:'exploit_status',          desc:'凍結中の敵へ与ダメ+30%', effect:'freeze', value:0.30 },
  byakuya:      { name:'千本桜',                  type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  yoruichi:     { name:'神速',                    type:'exploit_status',          desc:'麻痺中の敵へ与ダメ+30%', effect:'paralyze', value:0.30 },
  kenpachi:     { name:'戦闘狂',                  type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  ishida:       { name:'滅却師',                  type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },

  // ==== HUNTER×HUNTER ====
  killua:       { name:'神速の稲妻',              type:'exploit_status',          desc:'麻痺中の敵へ与ダメ+30%', effect:'paralyze', value:0.30 },
  gon:          { name:'強制的成長',              type:'low_hp_atk',              desc:'HP50%↓ 攻防↑＋リジェネ（3T）', threshold:0.5, buffs:['atk_up','def_up','regen'], turns:3 },
  hisoka:       { name:'伸縮自在の愛',            type:'counter',                 desc:'被ダメの50%を反射', value:0.50 },
  kurapika:     { name:'緋の眼',                  type:'low_hp_atk',              desc:'HP50%↓ 防↑（3T）', threshold:0.5, buff:'def_up', turns:3 },
  leorio:       { name:'医学知識',                type:'regen_team',              desc:'毎T 味方全HP2%回復', value:0.02 },
  netero:       { name:'感謝',                    type:'basic_atk_boost',         desc:'通常攻撃+150%', value:1.50 },

  // ==== 僕のヒーローアカデミア ====
  allmight:     { name:'平和の象徴',              type:'battle_start_team_def',   desc:'開幕 味方全防↑(2T)', turns:2 },
  deku:         { name:'フルカウル',              type:'battle_start_buffs',      desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  todoroki:     { name:'半冷半燃',                type:'status_immune',           desc:'味方全の燃焼・凍結無効', targets:['burn','freeze'] },
  bakugo:       { name:'爆破',                    type:'boss_damage',             desc:'ボスへ与ダメ+15%', value:0.15 },

  // ==== ジョジョの奇妙な冒険 ====
  dio:          { name:'ザ・ワールド',            type:'enemy_debuff_start',      desc:'開幕 敵全に防↓(2T)', debuff:'def_down', turns:2 },
  jotaro:       { name:'スタープラチナ',          type:'exploit_status',          desc:'防御↓中の敵へ与ダメ+30%', effect:'def_down', value:0.30 },
  joseph:       { name:'次にお前は',              type:'enemy_debuff_start',      desc:'開幕 敵全攻↓(1T)', turns:1 },
  kakyoin:      { name:'法皇の緑',                type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },
  polnareff:    { name:'銀の戦車',                type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  avdol:        { name:'魔術師の赤',              type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+30%', effect:'burn', value:0.30 },
  iggy:         { name:'ザ・フール',              type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },

  // ==== 転生したらスライムだった件 ====
  rimuru:       { name:'智慧之王(ラファエル)',    type:'sp_regen',                desc:'毎T SP+1' },
  milim:        { name:'ヘルモード',              type:'low_hp_atk',              desc:'HP50%↓ 攻防↑＋リジェネ（3T）', threshold:0.5, buffs:['atk_up','def_up','regen'], turns:3 },

  // ==== 魔法少女まどか☆マギカ ====
  homura:       { name:'時間操作',                type:'exploit_status',          desc:'気絶中の敵へ与ダメ+30%', effect:'stun', value:0.30 },
  madoka:       { name:'円環の理',                type:'regen_team',              desc:'毎T 味方全HP3%回復', value:0.03 },
  mami:         { name:'リボン生成',              type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  kyoko:        { name:'底なしの食欲',            type:'regen',                   desc:'毎T HP3%回復', value:0.03 },
  sayaka:       { name:'癒しの願い',              type:'regen',                   desc:'毎T HP3%回復', value:0.03 },

  // ==== Fate/stay night ====
  saber:        { name:'直感',                    type:'battle_start_buffs',      desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  archer:       { name:'投影魔術',                type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  rin:          { name:'五大元素使い',            type:'sp_max_up',               desc:'最大SP+1', value:1 },
  lancer_fate:  { name:'クランの猛犬',            type:'battle_start_atk',        desc:'開幕 攻↑(2T)', turns:2 },
  gilgamesh:    { name:'慢心',                    type:'battle_start_buffs',      desc:'開幕 自分の攻↓(2T)', buffs:['atk_down'], turns:2 },

  // ==== 東京喰種 ====
  kaneki:       { name:'捕食',                    type:'on_kill_sp',              desc:'敵撃破時・SP+1', amount:1 },
  touka:        { name:'捕食',                    type:'lifesteal',               desc:'与ダメの8%を吸収', value:0.08 },

  // ==== ブラッククローバー ====
  asta:         { name:'反魔法',                  type:'compound',                desc:'自分の状態異常無効', effects:[{type:'status_immune',targets:['stun','paralyze','poison','burn','atk_down','def_down','freeze','curse']}] },
  yami:         { name:'黒の暴牛団長',            type:'battle_start_team_atk',   desc:'開幕 味方全攻↑(1T)', turns:1 },

  // ==== 進撃の巨人 ====
  levi:         { name:'人類最強の兵士',          type:'boss_damage',             desc:'ボスへ与ダメ+15%', value:0.15 },
  eren:         { name:'進撃の巨人',              type:'low_hp_atk',              desc:'HP50%↓ 攻防↑＋リジェネ（3T）', threshold:0.5, buffs:['atk_up','def_up','regen'], turns:3 },
  mikasa:       { name:'104期生首席',             type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  armin:        { name:'戦略家',                  type:'battle_start_team_def',   desc:'開幕 味方全防↑(1T)', turns:1 },
  erwin:        { name:'第13代団長',              type:'battle_start_team_atk',   desc:'開幕 味方全攻↑(1T)', turns:1 },
  hange:        { name:'巨人の生態調査',          type:'enemy_debuff_start',      desc:'開幕 敵全攻↓(1T)', turns:1 },

  // ==== 七つの大罪 ====
  // パッシブ名は7人とも固有魔力で統一している
  meliodas:     { name:'全反撃（フルカウンター）',  type:'counter',                 desc:'被ダメの100%を反射', value:1.0 },
  escanor:      { name:'太陽（サンシャイン）',      type:'battle_start_atk',        desc:'開幕 攻↑(2T)', turns:2 },
  ban:          { name:'強奪（スナッチ）',          type:'lifesteal',               desc:'与ダメの8%を吸収', value:0.08 },
  harlequin:    { name:'災厄（ディザスター）',      type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },
  diane:        { name:'創造（クリエイション）',    type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  merlin:       { name:'無限（インフィニティ）',    type:'sp_max_up',               desc:'最大SP+1', value:1 },
  gowther:      { name:'侵入（インベイジョン）',    type:'enemy_debuff_start',      desc:'開幕 敵全攻↓(1T)', turns:1 },

  // ==== FAIRY TAIL ====
  natsu:        { name:'火竜の血',                type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+50%', effect:'burn', value:0.50 },
  erza:         { name:'鎧換装',                  type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  gray:         { name:'氷の体',                  type:'status_immune',           desc:'味方全の燃焼・凍結無効', targets:['burn','freeze'] },
  lucy_ft:      { name:'星霊との契約',            type:'sp_max_up',               desc:'最大SP+1', value:1 },

  // ==== オーバーロード ====
  ainz:         { name:'絶望のオーラ',            type:'enemy_debuff_start',      desc:'開幕 敵全攻↓(2T)', turns:2 },
  albedo:       { name:'守護者の忠誠',            type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },

  // ==== この素晴らしい世界 ====
  aqua_kb:      { name:'女神',                    type:'regen_team',              desc:'毎T 味方全HP2%回復', value:0.02 },
  darkness_kb:  { name:'クルセイダー',            type:'survive_fatal',           desc:'致死ダメージをHP1で耐える' },
  megumin:      { name:'紅魔族',                  type:'low_hp_atk',              desc:'HP50%↓ 攻↑（3T）', threshold:0.5, turns:3 },
  kazuma:       { name:'幸運',                    type:'sp_regen_on_basic',       desc:'通常攻撃時SP+1' },

  // ==== チェンソーマン ====
  denji:        { name:'血の補給',                type:'on_kill_sp',              desc:'敵撃破時・SP+1', amount:1 },
  power_csm:    { name:'血の魔人',                type:'lifesteal',               desc:'与ダメの8%を吸収', value:0.08 },
  makima:       { name:'支配の力',                type:'battle_start_team_atk',   desc:'開幕 味方全攻↑(1T)', turns:1 },
  aki:          { name:'未来予知',                type:'status_immune',           desc:'味方全の気絶・呪い無効', targets:['stun','curse'] },

  // ==== 炎炎ノ消防隊 ====
  shinra:       { name:'アドラバースト',          type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+50%', effect:'burn', value:0.50 },
  arthur:       { name:'騎士王の妄想',            type:'boss_damage',             desc:'ボスへ与ダメ+15%', value:0.15 },
  benimaru:     { name:'煉合消防官',              type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+50%', effect:'burn', value:0.50 },

  // ==== FINAL FANTASY ====
  cloud:        { name:'元SOLDIER',               type:'battle_start_buffs',      desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  sephiroth_ff: { name:'片翼の天使',              type:'battle_start_buffs',      desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  tifa:         { name:'プロの格闘家',            type:'battle_start_atk',        desc:'開幕 攻↑(2T)', turns:2 },
  aerith:       { name:'セトラの民',              type:'sp_max_up',               desc:'最大SP+1', value:1 },

  // ==== とある魔術の禁書目録 ====
  misaka:       { name:'電撃使い',                type:'exploit_status',          desc:'麻痺中の敵へ与ダメ+50%', effect:'paralyze', value:0.50 },
  accelerator:  { name:'反射',                    type:'counter',                 desc:'被ダメの100%を反射', value:1.0 },
  touma:        { name:'神浄の討魔',              type:'compound',                desc:'自分の気絶・麻痺・凍結無効', effects:[{type:'status_immune', targets:['stun','paralyze','freeze']}] },
  index:        { name:'禁書目録',                type:'sp_max_up',               desc:'最大SP+1', value:1 },
  kuroko:       { name:'風紀委員',                type:'battle_start_team_def',   desc:'開幕 味方全防↑(1T)', turns:1 },

  // ==== 葬送のフリーレン ====
  frieren:      { name:'膨大な魔力',              type:'sp_regen',                desc:'毎T SP+1' },
  fern:         { name:'一級魔法使い',            type:'multi_hit_boost',         desc:'連続ヒット技+20%', value:0.20 },
  stark:        { name:'ビビリ',                  type:'shield_start',            desc:'開幕 シールド(HP15%)', value:0.15 },
  sein:         { name:'女神の加護',              type:'status_immune',           desc:'味方全の呪い・毒無効', targets:['curse','poison'] },

  // ==== 無職転生 ====
  rudeus:       { name:'魔眼・予見眼',            type:'battle_start_buffs',      desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  eris:         { name:'狂剣',                    type:'battle_start_buffs',      desc:'開幕 自分に攻↑(2T)', buffs:['atk_up'], turns:2 },
  roxy:         { name:'詠唱短縮',                type:'sp_max_up',               desc:'最大SP+1', value:1 },
  sylphiette:   { name:'無詠唱魔術',              type:'basic_atk_boost',         desc:'通常攻撃+100%', value:1.00 },

  // ==== 盾の勇者の成り上がり ====
  naofumi:      { name:'憤怒の盾',                type:'counter_status',          desc:'被弾時、攻撃した敵に燃焼(3T)', effect:'burn', chance:1.0, turns:3 },
  raphtalia:    { name:'亜人の成長',              type:'on_kill_atk',             desc:'敵撃破時・自分に攻↑(2T)', turns:2 },
  filo:         { name:'竜の天敵',                type:'boss_damage',             desc:'ボスへ与ダメ+15%', value:0.15 },

  // ==== ゼノブレイド2 ====
  rex:          { name:'マスタードライバー',        type:'battle_start_team_atk',   desc:'開幕 味方全攻↑(1T)', turns:1 },
  pyra:         { name:'焔の刀身',                  type:'exploit_status',          desc:'燃焼中の敵へ与ダメ+50%', effect:'burn', value:0.50 },
  mythra:       { name:'因果律予測',                type:'battle_start_sp',         desc:'開幕 SP+1' },
  nia:          { name:'豊饒の海',                  type:'regen_team',              desc:'毎T 味方全HP2%回復', value:0.02 },

  // ==== BOSS / MIDBOSS ====
  frieza_final:     { name:'宇宙帝王の威圧', type:'enemy_debuff_start', desc:'開幕 全員に攻↓(2T)', turns:2 },
  madara:           { name:'神樹の完全再生', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  kaido:            { name:'不死身の悪龍', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  zoma:             { name:'闇に守られし魔王', type:'compound', desc:'開幕シールド(HP15%)＋攻撃力+10%', effects:[{type:'shield_start',value:0.15},{type:'atk_boost',value:0.10}] },
  boros:            { name:'解放形態・覚醒', type:'low_hp_atk', desc:'HP50%↓ 攻↑（3T）', threshold:0.5, buff:'atk_up', turns:3 },
  dio_boss:         { name:'吸血鬼の力', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  kokushibo:        { name:'上弦の再生', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  ganon:            { name:'力の三角の加護', type:'battle_start_def', desc:'開幕 防↑(3T)', turns:3 },
  cell_perfect:     { name:'完全体の細胞再生', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  demon_king_seven: { name:'絶望を糧とする力', type:'low_hp_atk', desc:'HP50%↓ 防↑（3T）', threshold:0.5, buff:'def_up', turns:3 },
  gilgamesh_boss:   { name:'王の財宝',                type:'atk_boost',           desc:'攻撃力常時+15%', value:0.15 },
  muzan_boss:       { name:'鬼の始祖の威圧', type:'enemy_debuff_start', desc:'開幕 全員に攻↓(2T)', turns:2 },
  kaguya_boss:      { name:'神樹の力', type:'battle_start_atk', desc:'開幕 攻↑(3T)', turns:3 },
  meruem_boss:      { name:'完全なる王の進化', type:'low_hp_atk', desc:'HP50%↓ リジェネ（2T）', threshold:0.5, buff:'regen', turns:2 },
  aizen_boss:       { name:'完全催眠',                type:'def_boost',           desc:'被ダメ-15%', value:0.15 },
  acnologia_boss:   { name:'魔竜の咆哮', type:'enemy_debuff_start', desc:'開幕 全員に攻↓(2T)', turns:2 },
  yhwach_boss:      { name:'全知全能の未来視', type:'enemy_debuff_start', desc:'開幕 全員に攻↓(2T)', turns:2 },
  veldanava_boss:   { name:'星王竜の権能', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  all_for_one:      { name:'個性を強奪せし力', type:'enemy_debuff_start', desc:'開幕 全員に攻↓(2T)', turns:2 },
  kenjaku:          { name:'呪術の蓄積',              type:'def_boost',           desc:'被ダメ-15%', value:0.15 },
  zenon_boss:       { name:'空間魔法の守り', type:'def_boost', desc:'被ダメ-15%', value:0.15 },
  satella_boss:     { name:'嫉妬に狂う魔女の力', type:'low_hp_atk', desc:'HP50%↓ 攻↑（3T）', threshold:0.5, buff:'atk_up', turns:3 },
  blackbeard_boss:  { name:'二つの悪魔の実',          type:'low_hp_atk',          desc:'HP50%↓ 防↑（3T）', threshold:0.5, buff:'def_up', turns:3 },
  heathcliff_boss:  { name:'システム管理者権限', type:'battle_start_def', desc:'開幕 防↑(3T)', turns:3 },
  pucci_boss:       { name:'時間加速',                type:'battle_start_buffs',  desc:'開幕 攻防↑(2T)', buffs:['atk_up','def_up'], turns:2 },
  darkness_devil:   { name:'根源的恐怖', type:'status_immune', desc:'呪い無効', targets:['curse'] },
  estarossa_boss:   { name:'慈愛の戒禁', type:'atk_boost', desc:'攻撃力常時+15%', value:0.15 },
  father_boss:      { name:'魂の集合体', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  // ── MIDBOSS ───────────────────────────────────────────
  orochimaru_mb:    { name:'大蛇の不死',              type:'status_immune',       desc:'毒無効', targets:['poison'] },
  pain_mb:          { name:'六道仙人',                type:'def_boost',           desc:'被ダメ-10%', value:0.10 },
  doflamingo_mb:    { name:'糸の覇者',                type:'low_hp_atk',          desc:'HP50%↓ 防↑（2T）', threshold:0.5, buff:'def_up', turns:2 },
  katakuri_mb:      { name:'未来視の盾', type:'def_boost', desc:'被ダメ-10%', value:0.10 },
  ulquiorra_mb:     { name:'虚の再生',                type:'regen',               desc:'毎T HP1.5%回復', value:0.015 },
  grimmjow_mb:      { name:'戦闘狂',                  type:'low_hp_atk',          desc:'HP50%↓ 攻↑（2T）', threshold:0.5, buff:'atk_up', turns:2 },
  akaza_mb:         { name:'鬼の再生',                type:'regen',               desc:'毎T HP1.5%回復', value:0.015 },
  doma_mb:          { name:'氷の抱擁',                type:'status_immune',       desc:'燃焼・凍結無効', targets:['burn','freeze'] },
  mahito_mb:        { name:'無為転変',                type:'regen',               desc:'毎T HP1.5%回復', value:0.015 },
  jogo_mb:          { name:'燃え盛る呪力', type:'exploit_status', desc:'燃焼中の敵へ与ダメ+25%', effect:'burn', value:0.25 },
  shigaraki_mb:     { name:'崩壊の怒り',              type:'low_hp_atk',          desc:'HP50%↓ 攻↑（2T）', threshold:0.5, buff:'atk_up', turns:2 },
  dabi_mb:          { name:'蒼炎', type:'exploit_status', desc:'燃焼中の敵へ与ダメ+30%', effect:'burn', value:0.30 },
  beast_titan_mb:   { name:'硬質化の鎧', type:'def_boost', desc:'被ダメ-10%', value:0.10 },
  zeref_mb:         { name:'死の呪い',                type:'regen',               desc:'毎T HP1.5%回復', value:0.015 },
  chrollo_mb:       { name:'盗んだ能力',              type:'atk_boost',           desc:'攻撃力常時+10%', value:0.10 },
  neferpitou_mb:    { name:'王への忠誠', type:'regen', desc:'毎T HP1.5%回復', value:0.015 },
  dante_mb:         { name:'重力を操る悪魔', type:'atk_boost', desc:'攻撃力常時+10%', value:0.10 },
  garou_mb:         { name:'怪人化',                  type:'low_hp_atk',          desc:'HP50%↓ リジェネ（2T）', threshold:0.5, buff:'regen', turns:2 },
  roswaal_mb:       { name:'全属性魔法',              type:'exploit_status',      desc:'燃焼中の敵へ与ダメ+25%', effect:'burn', value:0.25 },
  diavolo_mb:       { name:'未来消去', type:'battle_start_atk', desc:'開幕 攻↑(3T)', turns:3 },
  kira_mb:          { name:'バイツァ・ダストの猶予', type:'low_hp_atk', desc:'HP50%↓ リジェネ（2T）', threshold:0.5, buff:'regen', turns:2 },
  heracles_mb:      { name:'ゴッドハンドの加護', type:'def_boost', desc:'被ダメ-10%', value:0.10 },
  katana_mb:        { name:'刀の速さ',                type:'atk_boost',           desc:'攻撃力常時+10%', value:0.10 },
  envy_mb:          { name:'人間への憎しみ',          type:'low_hp_atk',          desc:'HP50%↓ リジェネ（2T）', threshold:0.5, buff:'regen', turns:2 },
  wrath_mb:         { name:'至高の目', type:'def_boost', desc:'被ダメ-10%', value:0.10 },
  hendrickson_mb:   { name:'血鬼の力', type:'exploit_status', desc:'毒中の敵へ与ダメ+25%', effect:'poison', value:0.25 },
  clayman_mb:       { name:'人形の盾',                type:'def_boost',           desc:'被ダメ-10%', value:0.10 },
  furuta_mb:        { name:'仮面が剥がれる時', type:'low_hp_atk', desc:'HP50%↓ 防↑（2T）', threshold:0.5, buff:'def_up', turns:2 },
  walpurgis_mb:     { name:'絶望の化身', type:'atk_boost', desc:'攻撃力常時+10%', value:0.10 }
};

// Inject passive data into all character arrays
(function injectPassives() {
  const lists = [
    typeof ALLY_DATA !== 'undefined' ? ALLY_DATA : [],
    typeof BOSS_DATA !== 'undefined' ? BOSS_DATA : [],
    typeof MIDBOSS_DATA !== 'undefined' ? MIDBOSS_DATA : []
  ];
  lists.forEach(list => {
    list.forEach(char => {
      if (PASSIVE_DATA[char.id]) char.passive = PASSIVE_DATA[char.id];
    });
  });
})();
