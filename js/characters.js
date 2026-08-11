// ============================================================
// JOIN QUOTES (shown in swap overlay and battle log)
// ============================================================
const JOIN_QUOTES = {
  // -- ドラゴンボール --
  goku: 'オラわくわくすっぞ！',
  vegeta: '感謝しろ。超エリートのこの俺が戦ってやるのだからな。',
  gohan: '父さんに恥じない戦いを…僕も全力でやります！',
  piccolo: '……フン、仕方ない。',
  trunks: '未来を変えるために…全力で戦う！',
  krillin: '修行の成果を見せてやるぞ！',
  frieza: '私の戦闘力は53万です。……安心なさい、今は味方ですよ。',

  // -- NARUTO --
  naruto: 'まっすぐ自分の言葉は曲げねぇ。それが俺の忍道だってばよ！',
  kakashi: '安心しろ。俺は仲間を…絶対に死なせない。',
  sasuke: '足手まといにはなるな。',
  itachi: '全て…仲間を守るためだ。',
  tsunade: '五代目火影・綱手、ここからは私も出よう！',
  gaara: '里への脅威を排除するのも…長の役目だ。',
  jiraiya: 'あいやしばらく！！ よく聞いた！',

  // -- ONE PIECE --
  luffy: '海賊王に俺はなるっ！！お前ら、ついてこい！',
  zoro: '背中の傷は、剣士の恥だ。',
  sanji: '美人のために戦うのは男の本懐！',
  ace: 'できの悪い弟を持つと………兄貴は心配なんだ',
  nami: '航海士のナミよ！天候はぜーんぶ私に任せて！',
  robin: '仲間のために生きる。それが私の答えよ。',
  shanks: '新しい時代に懸けてきた。……ここは俺も出よう。',

  // -- ワンパンマン --
  saitama: '別にいいけど、一発で終わらせるかもな。',
  genos: 'サイタマ先生のために、全力で戦います！',
  garou: '悪を執行する。本気を見せてやるよ。',
  tatsumaki: 'どいつもこいつも私がいないと駄目ね！',
  king: '…（キングエンジン始動）',
  sonic: '音速のソニック、参る。……サイタマはいないだろうな？',

  // -- 鬼滅の刃 --
  rengoku: '俺は俺の責務を全うする！心を燃やせ！！',
  tanjiro: '全集中で行きます！',
  nezuko: '前を向こう、一緒に頑張ろうよ。',
  zenitsu: 'お、俺がんばります！ちゃんとやります！',
  tomioka: '生殺与奪の権を、敵に握らせるな。',
  inosuke: '山の王・伊之助様の力を見せてやる！猪突猛進！！',
  mitsuri: 'はわわ…素敵な人がいっぱい！恋柱・甘露寺蜜璃、頑張ります！',

  // -- SAO --
  kirito: '死んでもいいゲームなんてヌルすぎるぜ',
  asuna: 'アスナです。私も戦います。',
  sinon: 'たかがワンマッチ。あんたがそう思うのは勝手よ。',
  yuuki: '一緒に戦えるなんて嬉しいな！ボクの剣技、見せてあげる！',
  leafa: 'リーファです！あたしも一緒に戦うわ！',
  alice: '私は、私の成すべきことを成すために、あなたと戦います！',

  // -- Re:ゼロ --
  emilia: '私はエミリア。ただのエミリアよ。',
  rem: 'レムが皆さんをお守りします。',
  subaru: '俺がここで折れたら…誰が皆を守るんだよ！',
  beatrice: '仕方ないから、ベティーが力を貸してあげるかしら。',
  ram: 'ラムの本気、見せてあげます。光栄に思いなさい。',
  reinhard: '剣聖ラインハルト・ヴァン・アストレア。あなたの剣となりましょう。',

  // -- ポケモン --
  pikachu: 'ピカピ！',
  mewtwo: '私は最強のポケモン。お前たちの力を試してやろう。',
  lucario: '波導は我にあり。',
  charizard: 'ガオォ！！',
  gengar: 'ゲンゲロゲ～ッ！！',
  goodra: 'ヌンゴォ！',
  ampharos: 'パルッ！パルルッ！',

  // -- 鋼の錬金術師 --
  edward: '…格の違いってやつを見せてやる！！',
  mustang: '焔の錬金術師の実力、見せてやろう。',
  alphonse: '兄さんと一緒に、僕も戦います！',
  riza: '私は私の意志で引き金を引くの　守るべき人のために。',
  greed: '金も女も部下も、全部オレの所有物なんだよ！',

  // -- 呪術廻戦 --
  gojo: '大丈夫。僕、最強だから。',
  sukuna: 'どうせなら本気で楽しませろ、雑魚ども。',
  megumi_ft: '最悪ではない結果のために戦う。',
  itadori: '俺が引き受ける。もう誰も死なせない！',
  nanami: '時間外労働は好きではありません。……ですが、仕方ないですね。',
  nobara: '私は釘崎野薔薇なんで！行くわよ！',
  yuta: '僕はここにいていいんだ。……行こう、里香ちゃん。',

  // -- BLEACH --
  ichigo: '黒崎一護、死神代行だ。',
  rukia: '舞え、「袖白雪」。……行くぞ。',
  hitsugaya: '十番隊隊長・日番谷冬獅郎だ。……子ども扱いするなよ。',
  byakuya: '散れ、「千本桜」。',
  yoruichi: '瞬神・夜一、参る。わしの速さについてこれるか？',
  kenpachi: '楽しませろよ。死ぬ気で来い。',
  ishida: '僕らは、友達だからだ',

  // -- HUNTER×HUNTER --
  killua: '面白そうだからついてくよ。',
  gon: 'オレ絶対に強くなる！一緒に頑張ろう！',
  hisoka: '♠ 君たちと戦えるとは…武者震いだよ ♠',
  kurapika: '仲間を守るためなら、何でもする。',
  leorio: 'オレに出来る事があるなら言え、何でもやる！！',
  netero: 'この歳で挑戦者か、血沸く血沸く♪',

  // -- 僕のヒーローアカデミア --
  allmight: '私が来た！',
  deku: '僕は、君を助けたいんだ！',
  todoroki: '俺の個性は火と氷、両方だ。',
  bakugo: '決めてンだよ俺ァ！勝負は必ず完全勝利！',

  // -- ジョジョの奇妙な冒険 --
  dio: 'このDIOが来たのだ、感謝するがいい。',
  jotaro: 'やれやれだぜ。',
  joseph: '次にお前はこう言う。「助けてくれ」とな！',
  kakyoin: 'やはりエジプトか……いつ出発する？わたしも同行する',
  polnareff: '自分の周りで死なれるのはスゲー迷惑だぜッ！ このオレはッ！',
  avdol: 'YES I AM！　チッ♪　チッ♪',
  iggy: 'やれやれ…犬好きの子供は見殺しには……できねーぜ！',

  // -- 転生したらスライムだった件 --
  rimuru: 'ま、大抵のことは何とかなるさ。俺に任とけ。',
  milim: '”友達”というより…”マブダチ”だな！',

  // -- 魔法少女まどか☆マギカ --
  homura: 'まどかは…私が守る。何度でも。',
  madoka: 'こんな私でも、誰かの役に立てるなら……それが一番の夢だから。',
  mami: '慌てないで。先輩の私が付いてるわ。',
  kyoko: 'はぁ…しょうがない。ちょっと手を貸してやる。',
  sayaka: 'あたしは正義の味方！',

  // -- Fate/stay night --
  saber: '問おう。あなたが、私のマスターか。',
  archer: '別に、アレを倒してしまっても構わんのだろう？',
  rin: '遠坂凛よ。足を引っ張らないでね。',
  lancer_fate: 'ランサー、クー・フーリンだ。……さて、派手に行こうぜ！',
  gilgamesh: '雑種どもが。最古の英雄の戦い、その目に焼き付けるがいい。',

  // -- 東京喰種 --
  kaneki: '……僕はもう、逃げない。',
  touka: '喰べる勇気がないならさ…私が手伝ってやるよ。',

  // -- ブラッククローバー --
  asta: '俺の魔法は、諦めないことだ！！',
  yami: '限界ってのはな、超えるためにあるんだよ。ぶった斬るぞ。',

  // -- 進撃の巨人 --
  levi: '俺の手でやる。それだけだ。',
  eren: '駆逐してやる！！この世から…一匹…残らず！！',
  mikasa: '仕方ないでしょ？世界は残酷なんだから。',
  armin: '何かを変えられるのは、何かを捨てられる者です。僕の策に懸けてください。',
  erwin: '兵士よ怒れ　兵士よ叫べ　兵士よ！！戦え！！',
  hange: '何言ってんの？調査兵団は未だ負けたことしかないんだよ？',

  // -- 七つの大罪 --
  meliodas: 'オレは強くなる。今守るべきもののために。',
  escanor: '獅子の罪（ライオン・シン）のエスカノール。太陽が昇っている限り、俺は負けん。',
  ban: 'いつか必ず　お前を奪う',
  harlequin: 'オイラの故郷で勝手な真似をするな',
  diane: '辛い記憶の中にも大切な思い出はあるはずだよ',
  merlin: '考えろ、そして自分たちで答えを見つけるのだ',
  gowther: 'オレが知りたいのはその先にある感情だ',

  // -- FAIRY TAIL --
  natsu: '燃えてきたぞ！行くぜ！',
  erza: '仲間のために戦うこと、それが私の誇り！',
  gray: '俺に任せろ。氷は裏切らない。',
  lucy_ft: '星霊魔法、見せてあげる！開け、星霊の扉！',

  // -- オーバーロード --
  ainz: '我が名はアインズ・ウール・ゴウン。',
  albedo: 'アインズ様のために…全ての敵を排除いたします。',

  // -- この素晴らしい世界 --
  aqua_kb: 'おかしいから！女神を連れてくなんて反則だから！！',
  darkness_kb: 'まだパーティーメンバーの募集はしているだろうか？',
  megumin: '我が名はめぐみん！紅魔族随一の魔法の使い手にして、爆裂魔法を操る者！',
  kazuma: '俺は平穏に暮らしたいだけなんだ！',

  // -- チェンソーマン --
  denji: '悪魔でもなんでもぶった切ってやる！',
  power_csm: 'ワシの名はパワー、バディとやらはウヌか？',
  makima: 'あなたたちに期待しています。……さぁ、戦いなさい。',
  aki: '…油断するなよ。悪魔相手に気を抜いたら死ぬぞ。',

  // -- 炎炎ノ消防隊 --
  shinra: '悪魔の足音、聞こえますか？',
  arthur: '我が剣の名はエクスカリバー！',
  benimaru: 'その喧嘩、俺も混ぜてくれ、面白そうだ',

  // -- FINAL FANTASY --
  cloud: '……興味ないね。',
  sephiroth_ff: 'お前には何も理解できない',
  tifa: 'みんなで勝とう！',
  aerith: '大丈夫。私がついてるから',

  // -- とある魔術の禁書目録 --
  misaka: '御坂美琴よ。超電磁砲（レールガン）なんて呼ばれたりもしてるわ',
  accelerator: '悪りぃが、こっから先は一方通行だ',
  touma: '不幸だ……！',
  index: '10万3000冊の魔道書が力を貸してくれるんだよ！',
  kuroko: 'お姉様のためなら何でもしますわ！',

  // -- 葬送のフリーレン --
  frieren: '魔法使いフリーレンだよ。人間の時間は短いから、さっさと終わらせよう。',
  fern: 'フェルンです。フリーレン様のお供をしています。……手加減はしません。',
  stark: 'お、俺がやるのか…!? わかったよ、やってやるよ！',
  sein: '……はぁ、仕方ねえな。僧侶のザインだ。怪我したら治してやるよ。',

  // -- 無職転生 --
  rudeus: '前世の分まで、本気で生きる。ルーデウス・グレイラット、参ります。',
  eris: 'アタシが守ってあげるわよ！……感謝しなさい！',
  roxy: 'ロキシー・ミグルディアです。わたしが来たからには、もう大丈夫ですよ。',
  sylphiette: 'シルフィエットだよ。ボクが皆を守るね。',

  // -- 盾の勇者の成り上がり --
  naofumi: '……信じられるのは、この盾だけだ。',
  raphtalia: 'ラフタリアです。私は、ナオフミ様の剣ですから。',
  filo: 'フィーロだよ！ご主人様のために、いーっぱい蹴っ飛ばすの！',
  // -- ゼノブレイド2 --
  rex: '約束だろ？───オレは君のために楽園に行く！',
  pyra: '私を、楽園に連れて行って',
  mythra: 'あなたがそうしたいと思うのなら協力はする',
  nia: 'アタシも見てみたくなったよ、楽園。本当にあるんだろうね？',

};

// ============================================================
// CHAR RARITY: 3=main protagonist (rare), 2=normal, 1=support/common
// ステータス補正は廃止済み。rarityは★表示・出現重み・実績判定にのみ使用
// ============================================================
const CHAR_RARITY = {
  // -- ドラゴンボール --
  goku:3, vegeta:2, gohan:2, piccolo:2, trunks:2, krillin:2, frieza:2,
  // -- NARUTO --
  naruto:3, sasuke:2, itachi:2, kakashi:2, tsunade:2, gaara:2, jiraiya:2,
  // -- ONE PIECE --
  luffy:3, nami:1, shanks:3, zoro:2, sanji:2, ace:2, robin:2,
  // -- ワンパンマン --
  saitama:3, king:1, sonic:1, genos:2, garou:2, tatsumaki:2,
  // -- 鬼滅の刃 --
  tanjiro:3, zenitsu:1, inosuke:1, rengoku:2, nezuko:2, tomioka:2, mitsuri:2,
  // -- SAO --
  kirito:3, asuna:2, sinon:2, yuuki:2, leafa:2, alice:2,
  // -- Re:ゼロ --
  emilia:3, beatrice:1, ram:1, rem:2, subaru:2, reinhard:2,
  // -- ポケモン --
  pikachu:3, mewtwo:3, lucario:2, charizard:2, gengar:2, goodra:2, ampharos:2,
  // -- 鋼の錬金術師 --
  edward:3, mustang:2, alphonse:2, riza:2, greed:2,
  // -- 呪術廻戦 --
  gojo:3, sukuna:2, itadori:3, megumi_ft:2, nanami:2, nobara:2, yuta:2,
  // -- BLEACH --
  ichigo:3, rukia:2, hitsugaya:2, byakuya:2, yoruichi:2, kenpachi:2, ishida:2,
  // -- HUNTER×HUNTER --
  gon:3, killua:2, hisoka:2, kurapika:2, leorio:2, netero:3,
  // -- 僕のヒーローアカデミア --
  allmight:3, deku:3, todoroki:2, bakugo:2,
  // -- ジョジョの奇妙な冒険 --
  dio:3, jotaro:3, joseph:2, kakyoin:2, polnareff:2, avdol:2, iggy:2,
  // -- 転生したらスライムだった件 --
  rimuru:3, milim:3,
  // -- 魔法少女まどか☆マギカ --
  madoka:3, homura:2, mami:2, kyoko:2, sayaka:2,
  // -- Fate/stay night --
  saber:3, gilgamesh:3, archer:2, rin:2, lancer_fate:2,
  // -- 東京喰種 --
  kaneki:3, touka:1,
  // -- ブラッククローバー --
  asta:3, yami:2,
  // -- 進撃の巨人 --
  eren:3, armin:1, levi:2, mikasa:2, erwin:2, hange:2,
  // -- 七つの大罪 --
  meliodas:3, escanor:2, ban:2, harlequin:2, diane:2, merlin:2, gowther:2,
  // -- FAIRY TAIL --
  natsu:3, lucy_ft:1, erza:2, gray:2,
  // -- オーバーロード --
  ainz:3, albedo:2,
  // -- この素晴らしい世界 --
  aqua_kb:1, darkness_kb:1, megumin:1, kazuma:1,
  // -- チェンソーマン --
  denji:3, power_csm:1, aki:1, makima:2,
  // -- 炎炎ノ消防隊 --
  shinra:3, arthur:2, benimaru:3,
  // -- FINAL FANTASY --
  cloud:3, sephiroth_ff:3, tifa:2, aerith:2,
  // -- とある魔術の禁書目録 --
  misaka:3, accelerator:3, index:1, touma:2, kuroko:2,
  // -- 葬送のフリーレン --
  frieren:3, fern:2, stark:2, sein:2,
  // -- 無職転生 --
  rudeus:3, eris:2, roxy:2, sylphiette:2,
  // -- 盾の勇者の成り上がり --
  naofumi:3, raphtalia:2, filo:2,
  // -- ゼノブレイド2 --
  rex:2, pyra:3, mythra:3, nia:2,
};

// ============================================================
// ROLES
// ============================================================
const ROLES = {
  attacker: { label: 'アタッカー',   icon: '⚔️', color: '#cc3333' },
  support:  { label: 'サポーター',   icon: '💚', color: '#228844' },
  tank:     { label: 'タンク',       icon: '🛡️', color: '#446688' },
  striker:  { label: 'ストライカー', icon: '⚡', color: '#ddaa00' }
};

// ============================================================
// ALLY CHARACTERS (135 total, grouped by series)
// ============================================================
const ALLY_DATA = [
  // -- ドラゴンボール (7) --
  { id:'goku',       name:'孫悟空',               origin:'ドラゴンボール',         emoji:'🐒', maxHp:95,  role:'attacker', gender:'男', job:'格闘家',       skillIds:['goku_basic','kamehameha','genkidama'],                         color:'#ff9900' },
  { id:'vegeta',     name:'ベジータ',              origin:'ドラゴンボール',         emoji:'💜', maxHp:90,  role:'attacker', gender:'男', job:'王子',         skillIds:['vegeta_basic','vegeta_garlic','vegeta_final_flash'],         color:'#5500aa' },
  { id:'gohan',     name:'孫悟飯',              origin:'ドラゴンボール',        emoji:'💫', maxHp:88,  role:'attacker', gender:'男', job:'格闘家',       skillIds:['gohan_basic','gohan_masenko','gohan_beast'],                color:'#99cc00' },
  { id:'piccolo',   name:'ピッコロ',            origin:'ドラゴンボール',        emoji:'👽', maxHp:88,  role:'tank',     gender:'男', job:'戦士',         skillIds:['piccolo_basic','piccolo_beam','piccolo_hellzone'],    color:'#116622' },
  { id:'trunks',         name:'トランクス',                origin:'ドラゴンボール',         emoji:'🗡️', maxHp:88,  role:'attacker', gender:'男', job:'戦士',         skillIds:['trunks_basic','trunks_burn','trunks_finish'],                            color:'#8844cc' },
  { id:'krillin',        name:'クリリン',                  origin:'ドラゴンボール',         emoji:'💿', maxHp:74,  role:'support',  gender:'男', job:'格闘家',       skillIds:['krillin_basic','krillin_disc','krillin_solar'],                           color:'#ff8844' },
  { id:'frieza',     name:'フリーザ',              origin:'ドラゴンボール',        emoji:'🪐', maxHp:86,  role:'attacker', gender:'男', job:'宇宙の帝王',    skillIds:['frieza_basic','frieza_beam','frieza_full'],                 color:'#aa66cc' },
  // -- NARUTO (7) --
  { id:'naruto',     name:'うずまきナルト',         origin:'NARUTO',                emoji:'🍥', maxHp:85,  role:'attacker', gender:'男', job:'忍者',         skillIds:['naruto_basic','rasengan','senjutsu_rasengan'],             color:'#ff6600' },
  { id:'kakashi',    name:'はたけカカシ',           origin:'NARUTO',                emoji:'👁️', maxHp:82,  role:'attacker', gender:'男', job:'忍者',         skillIds:['kakashi_basic','kakashi_summon','kakashi_lightning_blade'], color:'#336699' },
  { id:'sasuke',    name:'うちはサスケ',         origin:'NARUTO',               emoji:'🌩️', maxHp:85,  role:'striker',  gender:'男', job:'忍者',         skillIds:['sasuke_basic','sasuke_chidori','sasuke_susanoo'],      color:'#330055' },
  { id:'itachi',    name:'うちはイタチ',         origin:'NARUTO',               emoji:'🪶', maxHp:78,  role:'attacker', gender:'男', job:'忍者',         skillIds:['itachi_basic','itachi_tsukuyomi','itachi_amaterasu'],       color:'#221122' },
  { id:'tsunade',      name:'綱手',                  origin:'NARUTO',               emoji:'💚', maxHp:82,  role:'support',  gender:'女', job:'5代目火影',         skillIds:['tsunade_basic','tsunade_heal_all','tsunade_mitsu'],         color:'#cc6699' },
  { id:'gaara',        name:'我愛羅',                 origin:'NARUTO',               emoji:'🏜️', maxHp:84,  role:'tank',     gender:'男', job:'風影',         skillIds:['gaara_basic','gaara_storm','gaara_absolute'],               color:'#cc8822' },
  { id:'jiraiya',    name:'自来也',                origin:'NARUTO',               emoji:'🐸', maxHp:86,  role:'attacker', gender:'男', job:'伝説の三忍',    skillIds:['jiraiya_basic','jiraiya_rasengan','jiraiya_sennin'],        color:'#cc4444' },
  // -- ONE PIECE (7) --
  { id:'luffy',      name:'モンキー・D・ルフィ',    origin:'ONE PIECE',             emoji:'⚓', maxHp:90,  role:'attacker', gender:'男', job:'海賊',         skillIds:['luffy_basic','jet_gatling','gear5'],                             color:'#cc2200' },
  { id:'zoro',       name:'ロロノア・ゾロ',         origin:'ONE PIECE',             emoji:'⚔️', maxHp:88,  role:'attacker', gender:'男', job:'剣士',         skillIds:['three_sword_basic','oni_giri','asura'],                     color:'#009933' },
  { id:'sanji',      name:'ヴィンスモーク・サンジ',  origin:'ONE PIECE',             emoji:'🦵', maxHp:74,  role:'striker',  gender:'男', job:'コック',       skillIds:['sanji_basic','sanji_diable','sanji_ifrit'],             color:'#003399' },
  { id:'ace',          name:'ポートガス・D・エース',   origin:'ONE PIECE',            emoji:'🔥', maxHp:76,  role:'attacker', gender:'男', job:'海賊',         skillIds:['ace_basic','ace_hiken','ace_dai_enkai'],                   color:'#cc4400' },
  { id:'nami',      name:'ナミ',                origin:'ONE PIECE',            emoji:'⛵', maxHp:62,  role:'support',  gender:'女', job:'航海士',       skillIds:['nami_basic','nami_clima','nami_perfect_clima'],            color:'#ff8800' },
  { id:'robin',     name:'ニコ・ロビン',         origin:'ONE PIECE',            emoji:'🌺', maxHp:72,  role:'attacker', gender:'女', job:'考古学者',      skillIds:['robin_basic','robin_cien','robin_mil'],       color:'#001166' },
  { id:'shanks',     name:'シャンクス',            origin:'ONE PIECE',            emoji:'🍶', maxHp:92,  role:'attacker', gender:'男', job:'四皇',         skillIds:['shanks_basic','shanks_haki','shanks_kamusari'], color:'#cc2233' },
  // -- ワンパンマン (6) --
  { id:'saitama',    name:'サイタマ',              origin:'ワンパンマン',           emoji:'👊', maxHp:100, role:'attacker', gender:'男', job:'ヒーロー',      skillIds:['normal_punch','consecutive_punch','serious_punch'], color:'#ffdd00' },
  { id:'genos',     name:'ジェノス',             origin:'ワンパンマン',          emoji:'⚙️', maxHp:73,  role:'striker',  gender:'男', job:'サイボーグ',    skillIds:['genos_basic','genos_incinerator','genos_upgrade'],        color:'#dd8800' },
  { id:'garou',          name:'ガロウ',                    origin:'ワンパンマン',           emoji:'🐺', maxHp:90,  role:'attacker', gender:'男', job:'英雄狩り',      skillIds:['garou_basic','garou_martial','garou_cosmic'],                            color:'#445566' },
  { id:'tatsumaki',  name:'タツマキ',                 origin:'ワンパンマン',          emoji:'🌪️', maxHp:75,  role:'attacker', gender:'女', job:'Sクラスヒーロー', skillIds:['tatsumaki_basic','tatsumaki_psycho','tatsumaki_cataclysm'], color:'#228833' },
  { id:'king',           name:'キング',                    origin:'ワンパンマン',           emoji:'💓', maxHp:70,  role:'support',  gender:'男', job:'Sクラスヒーロー', skillIds:['king_engine','king_stare','king_intimidate'],                           color:'#886644' },
  { id:'sonic',      name:'音速のソニック',         origin:'ワンパンマン',          emoji:'💨', maxHp:70,  role:'striker',  gender:'男', job:'忍者',         skillIds:['sonic_basic','sonic_kunai','sonic_juuretsu'],               color:'#7744aa' },
  // -- 鬼滅の刃 (7) --
  { id:'rengoku',    name:'煉獄杏寿郎',            origin:'鬼滅の刃',              emoji:'🔥', maxHp:82,  role:'attacker', gender:'男', job:'炎柱',         skillIds:['flame_basic','flame_breath_1','flame_breath_9'],           color:'#ff4400' },
  { id:'tanjiro',    name:'竈門炭治郎',             origin:'鬼滅の刃',              emoji:'🎴', maxHp:85,  role:'attacker', gender:'男', job:'鬼殺隊士',         skillIds:['tanjiro_basic','tanjiro_water_12','tanjiro_sun_breath'], color:'#006633' },
  { id:'nezuko',     name:'竈門禰豆子',             origin:'鬼滅の刃',              emoji:'🎋', maxHp:82,  role:'striker',  gender:'女', job:'鬼',           skillIds:['nezuko_basic','nezuko_kick','nezuko_bakketsu'],              color:'#ff6688' },
  { id:'zenitsu',      name:'我妻善逸',               origin:'鬼滅の刃',             emoji:'⚡', maxHp:68,  role:'striker',  gender:'男', job:'鬼殺隊士',         skillIds:['zenitsu_basic','zenitsu_thunder','zenitsu_seventh'],          color:'#aaaa00' },
  { id:'tomioka',    name:'冨岡義勇',              origin:'鬼滅の刃',              emoji:'🌊', maxHp:83,  role:'attacker', gender:'男', job:'水柱',         skillIds:['water_basic','water_breath_4','water_breath_11'],            color:'#2266aa' },
  { id:'inosuke',      name:'嘴平伊之助',             origin:'鬼滅の刃',             emoji:'🐗', maxHp:79,  role:'striker',  gender:'男', job:'鬼殺隊士',         skillIds:['inosuke_basic','inosuke_double','inosuke_beast'],         color:'#557744' },
  { id:'mitsuri',    name:'甘露寺蜜璃',            origin:'鬼滅の刃',              emoji:'💞', maxHp:78,  role:'striker',  gender:'女', job:'恋柱',         skillIds:['mitsuri_basic','mitsuri_five','mitsuri_six'],               color:'#ff88aa' },
  // -- SAO (6) --
  { id:'kirito',     name:'キリト',                origin:'SAO',                   emoji:'⚔️', maxHp:80,  role:'attacker', gender:'男', job:'剣士',         skillIds:['kirito_basic','vorpal_strike','starburst_stream'],          color:'#220088' },
  { id:'asuna',      name:'アスナ',                origin:'SAO',                   emoji:'✨', maxHp:71,  role:'striker',  gender:'女', job:'剣士',         skillIds:['rapier_basic','healing_asuna','mother_rosario'],        color:'#cc88ff' },
  { id:'sinon',     name:'シノン',               origin:'SAO',                  emoji:'🎯', maxHp:68,  role:'attacker', gender:'女', job:'スナイパー',    skillIds:['sinon_basic','sinon_rifle','sinon_bullet'],                             color:'#228877' },
  { id:'yuuki',      name:'ユウキ',                  origin:'SAO',                  emoji:'🗡️', maxHp:73,  role:'attacker', gender:'女', job:'剣士',         skillIds:['yuuki_basic','yuuki_11hit','yuuki_sword'],                              color:'#cc44aa' },
  { id:'leafa',          name:'リーファ',                  origin:'SAO',                   emoji:'🌿', maxHp:76,  role:'support',  gender:'女', job:'剣士',         skillIds:['leafa_basic','leafa_heal','leafa_gale'],                                 color:'#228844' },
  { id:'alice',      name:'アリス・シンセシス・サーティ', origin:'SAO',                   emoji:'🏵️', maxHp:90,  role:'tank',     gender:'女', job:'整合騎士',      skillIds:['alice_basic','alice_enhance','alice_release'],                           color:'#d4a017' },
  // -- Re:ゼロ (6) --
  { id:'emilia',     name:'エミリア',              origin:'Re:ゼロ',               emoji:'❄️', maxHp:75,  role:'support',  gender:'女', job:'精霊使い',      skillIds:['ice_arrow','ice_blade','emilia_cocytus'],                       color:'#88ccff' },
  { id:'rem',        name:'レム',                  origin:'Re:ゼロ',               emoji:'💙', maxHp:84,  role:'attacker', gender:'女', job:'メイド',        skillIds:['maid_punch','oni_form','morning_star'],                    color:'#2244cc' },
  { id:'subaru',    name:'菜月昴',               origin:'Re:ゼロ',              emoji:'🔄', maxHp:80,  role:'tank',     gender:'男', job:'召喚者',       skillIds:['subaru_basic','subaru_return','subaru_shadow'],            color:'#334488' },
  { id:'beatrice',     name:'ベアトリス',             origin:'Re:ゼロ',              emoji:'🚪', maxHp:68,  role:'support',  gender:'女', job:'精霊',         skillIds:['beatrice_basic','beatrice_shamak','beatrice_spirit'],       color:'#ffaadd' },
  { id:'ram',          name:'ラム',                   origin:'Re:ゼロ',              emoji:'🌸', maxHp:76,  role:'support',  gender:'女', job:'メイド',        skillIds:['ram_basic','ram_senrigan','ram_last'],                           color:'#ff88bb' },
  { id:'reinhard',   name:'ラインハルト',           origin:'Re:ゼロ',              emoji:'🦁', maxHp:96,  role:'tank',     gender:'男', job:'剣聖',         skillIds:['reinhard_basic','reinhard_guard','reinhard_dragon'],        color:'#cc3344' },
  // -- ポケモン (5) --
  { id:'pikachu',    name:'ピカチュウ',            origin:'ポケモン',              emoji:'⚡', maxHp:63,  role:'striker',  gender:'不明', job:'ポケモン',    skillIds:['quick_attack','thunderbolt','volt_tackle'],                    color:'#ffee00' },
  { id:'mewtwo',     name:'ミュウツー',               origin:'ポケモン',              emoji:'🧬', maxHp:88,  role:'attacker', gender:'不明', job:'ポケモン',    skillIds:['mewtwo_basic','mewtwo_psycho','mewtwo_psystrike'],       color:'#8866cc' },
  { id:'lucario',    name:'ルカリオ',                 origin:'ポケモン',              emoji:'🔵', maxHp:80,  role:'striker',  gender:'不明', job:'ポケモン',    skillIds:['lucario_basic','lucario_aura','lucario_mega'],      color:'#0044aa' },
  { id:'charizard',      name:'リザードン',                origin:'ポケモン',              emoji:'🔥', maxHp:86,  role:'attacker', gender:'不明', job:'ポケモン',    skillIds:['charizard_basic','charizard_fly','charizard_blaze'],                     color:'#cc4400' },
  { id:'gengar',         name:'ゲンガー',                  origin:'ポケモン',              emoji:'👻', maxHp:78,  role:'striker',  gender:'不明', job:'ポケモン',    skillIds:['gengar_basic','gengar_lick','gengar_hex'],                          color:'#553388' },
  { id:'goodra',         name:'ヌメルゴン',                origin:'ポケモン',              emoji:'🐌', maxHp:94,  role:'tank',     gender:'不明', job:'ポケモン',    skillIds:['goodra_basic','goodra_mud','goodra_pulse'],                        color:'#9988cc' },
  { id:'ampharos',       name:'デンリュウ',                origin:'ポケモン',              emoji:'💡', maxHp:90,  role:'attacker', gender:'不明', job:'ポケモン',    skillIds:['ampharos_basic','ampharos_parabola','ampharos_charge'],            color:'#eecc22' },
  // -- 鋼の錬金術師 (5) --
  { id:'edward',     name:'エドワード・エルリック',  origin:'鋼の錬金術師',          emoji:'⚗️', maxHp:80,  role:'attacker', gender:'男', job:'錬金術師',      skillIds:['alchemy_fist','alchemy_spear','alchemy_arms'],             color:'#ddaa00' },
  { id:'mustang',    name:'ロイ・マスタング',        origin:'鋼の錬金術師',          emoji:'🧤', maxHp:72,  role:'attacker', gender:'男', job:'軍人',         skillIds:['flame_snap','flame_sniper','ryusei_no_hi'],                  color:'#cc4400' },
  { id:'alphonse',   name:'アルフォンス・エルリック',  origin:'鋼の錬金術師',          emoji:'🛡️', maxHp:92,  role:'tank',     gender:'男', job:'錬金術師',      skillIds:['alphonse_basic','alphonse_trap','alphonse_bind'],       color:'#888800' },
  { id:'riza',       name:'リザ・ホークアイ',         origin:'鋼の錬金術師',          emoji:'🎖️', maxHp:74,  role:'attacker', gender:'女', job:'軍人',         skillIds:['riza_basic','riza_snipe','riza_barrage'],               color:'#b8a04a' },
  { id:'greed',      name:'グリード',                 origin:'鋼の錬金術師',          emoji:'🖐️', maxHp:100, role:'tank',     gender:'男', job:'ホムンクルス',   skillIds:['greed_basic','greed_hardening','greed_edge'],           color:'#3a3a44' },
  // -- 呪術廻戦 (7) --
  { id:'gojo',       name:'五条悟',                origin:'呪術廻戦',              emoji:'🕶️', maxHp:88,  role:'attacker', gender:'男', job:'呪術師',       skillIds:['jujutsu_basic','mugen','murasaki'],                                 color:'#0088ff' },
  { id:'sukuna',       name:'両面宿儺',               origin:'呪術廻戦',             emoji:'👹', maxHp:95,  role:'attacker', gender:'男', job:'呪術師',       skillIds:['sukuna_basic','sukuna_dismantle','sukuna_domain'],          color:'#880000' },
  { id:'megumi_ft',    name:'伏黒恵',                 origin:'呪術廻戦',             emoji:'🐾', maxHp:84,  role:'tank',     gender:'男', job:'呪術師',       skillIds:['megumi_basic','megumi_dog','megumi_domain'],             color:'#334455' },
  { id:'itadori',        name:'虎杖悠仁',                  origin:'呪術廻戦',              emoji:'🥊', maxHp:92,  role:'attacker', gender:'男', job:'呪術師',       skillIds:['itadori_basic','itadori_black','itadori_shrine'],    color:'#cc4422' },
  { id:'nanami',       name:'七海建人',               origin:'呪術廻戦',             emoji:'👔', maxHp:88,  role:'tank',     gender:'男', job:'呪術師',       skillIds:['nanami_basic','nanami_ratio','nanami_fulltime'],          color:'#886633' },
  { id:'nobara',       name:'釘崎野薔薇',             origin:'呪術廻戦',             emoji:'🔨', maxHp:78,  role:'attacker', gender:'女', job:'呪術師',       skillIds:['nobara_basic','nobara_doll','nobara_elim'],                  color:'#cc4488' },
  { id:'yuta',       name:'乙骨憂太',              origin:'呪術廻戦',              emoji:'💍', maxHp:84,  role:'attacker', gender:'男', job:'特級呪術師',    skillIds:['yuta_basic','yuta_copy','yuta_rika'],                       color:'#8899bb' },
  // -- BLEACH (7) --
  { id:'ichigo',     name:'黒崎一護',              origin:'BLEACH',                emoji:'⚫', maxHp:90,  role:'attacker', gender:'男', job:'死神',         skillIds:['zangetsu_slash','getsuga_tensho','mugetsu'],              color:'#333366' },
  { id:'rukia',     name:'朽木ルキア',           origin:'BLEACH',               emoji:'❄️', maxHp:78,  role:'attacker', gender:'女', job:'死神',         skillIds:['rukia_basic','rukia_soten','rukia_bankai'],              color:'#9988cc' },
  { id:'hitsugaya', name:'日番谷冬獅郎',         origin:'BLEACH',               emoji:'🧊', maxHp:76,  role:'attacker', gender:'男', job:'死神',         skillIds:['hitsugaya_basic','hitsugaya_shikai','hitsugaya_bankai'], color:'#66ccee' },
  { id:'byakuya',      name:'朽木白哉',               origin:'BLEACH',               emoji:'🌸', maxHp:88,  role:'attacker', gender:'男', job:'死神',         skillIds:['byakuya_basic','byakuya_cherry','byakuya_bankai'],       color:'#aaaacc' },
  { id:'yoruichi',  name:'四楓院夜一',           origin:'BLEACH',               emoji:'🐱', maxHp:72,  role:'striker',  gender:'女', job:'神速の人',      skillIds:['yoruichi_basic','yoruichi_shunko','yoruichi_raishunko'], color:'#553388' },
  { id:'kenpachi',   name:'更木剣八',              origin:'BLEACH',               emoji:'🔔', maxHp:98,  role:'attacker', gender:'男', job:'十一番隊隊長',  skillIds:['kenpachi_basic','kenpachi_eyepatch','kenpachi_nozarashi'],  color:'#886655' },
  { id:'ishida',     name:'石田雨竜',              origin:'BLEACH',               emoji:'🧵', maxHp:74,  role:'support',  gender:'男', job:'滅却師',        skillIds:['ishida_basic','ishida_regen','ishida_ginto'],               color:'#5a7a9a' },
  // -- HUNTER×HUNTER (4) --
  { id:'killua',     name:'キルア・ゾルディック',   origin:'HUNTER×HUNTER',        emoji:'⚡', maxHp:70,  role:'striker',  gender:'男', job:'暗殺者',       skillIds:['hand_slice','godspeed','kanmuru'],                       color:'#aaccff' },
  { id:'gon',       name:'ゴン＝フリークス',     origin:'HUNTER×HUNTER',       emoji:'🎣', maxHp:85,  role:'attacker', gender:'男', job:'念能力者',      skillIds:['gon_basic','gon_rock','gon_adult'],                       color:'#228833' },
  { id:'hisoka',    name:'ヒソカ＝モロウ',       origin:'HUNTER×HUNTER',       emoji:'🃏', maxHp:82,  role:'attacker', gender:'男', job:'奇術師',       skillIds:['hisoka_basic','hisoka_bungee','hisoka_card'],           color:'#cc1133' },
  { id:'kurapika',     name:'クラピカ',               origin:'HUNTER×HUNTER',       emoji:'🔗', maxHp:82,  role:'attacker', gender:'男', job:'念能力者',      skillIds:['kurapika_basic','kurapika_chain','kurapika_emperor'],     color:'#cc8800' },
  { id:'leorio',       name:'レオリオ',               origin:'HUNTER×HUNTER',       emoji:'💼', maxHp:78,  role:'support',  gender:'男', job:'医者志望',      skillIds:['leorio_basic','leorio_punch','leorio_heal'],              color:'#3a6a8a' },
  { id:'netero',       name:'ネテロ会長',              origin:'HUNTER×HUNTER',       emoji:'🙏', maxHp:88,  role:'attacker', gender:'男', job:'ハンター協会会長', skillIds:['netero_basic','netero_ichi','netero_zero'],            color:'#c8a04a' },
  // -- 僕のヒーローアカデミア (4) --
  { id:'allmight',   name:'オールマイト',           origin:'僕のヒーローアカデミア',  emoji:'💪', maxHp:105, role:'tank',     gender:'男', job:'ヒーロー',      skillIds:['smash_basic','detroit_smash','plus_ultra'],                color:'#ddcc00' },
  { id:'deku',       name:'緑谷出久',              origin:'僕のヒーローアカデミア',  emoji:'🥦', maxHp:82,  role:'attacker', gender:'男', job:'ヒーロー',      skillIds:['blackwhip_basic','deku_airforce','deku_100percent'],           color:'#228833' },
  { id:'todoroki',     name:'轟焦凍',                 origin:'僕のヒーローアカデミア', emoji:'🌡️', maxHp:88,  role:'attacker', gender:'男', job:'ヒーロー',      skillIds:['todoroki_basic','todoroki_fire','todoroki_heaven'],    color:'#8844aa' },
  { id:'bakugo',       name:'爆豪勝己',               origin:'僕のヒーローアカデミア', emoji:'💥', maxHp:85,  role:'attacker', gender:'男', job:'ヒーロー',      skillIds:['bakugo_basic','bakugo_blast','bakugo_howitzer'],           color:'#ff6600' },
  // -- ジョジョの奇妙な冒険 (3) --
  { id:'dio',        name:'DIO',                   origin:'ジョジョの奇妙な冒険',   emoji:'🧛', maxHp:85,  role:'attacker', gender:'男', job:'吸血鬼',       skillIds:['knife_throw','the_world_stop','time_erase'],                color:'#ffdd00' },
  { id:'jotaro',     name:'空条承太郎',             origin:'ジョジョの奇妙な冒険',   emoji:'⭐', maxHp:87,  role:'attacker', gender:'男', job:'高校生',       skillIds:['jotaro_basic','jotaro_time_stop','jotaro_ora_rush'], color:'#114433' },
  { id:'joseph',     name:'ジョセフ・ジョースター',   origin:'ジョジョの奇妙な冒険',   emoji:'🔮', maxHp:78,  role:'support',  gender:'男', job:'波紋使い',     skillIds:['joseph_basic','joseph_nensha','joseph_overdrive'],   color:'#7755aa' },
  { id:'kakyoin',    name:'花京院典明',             origin:'ジョジョの奇妙な冒険',   emoji:'🍒', maxHp:76,  role:'striker',  gender:'男', job:'高校生',       skillIds:['kakyoin_basic','kakyoin_emerald','kakyoin_barrier'], color:'#22aa66' },
  { id:'polnareff',  name:'ジャン＝ピエール・ポルナレフ', origin:'ジョジョの奇妙な冒険', emoji:'🤺', maxHp:80,  role:'tank',     gender:'男', job:'剣士',         skillIds:['polnareff_basic','polnareff_rush','polnareff_armor'], color:'#aabbcc' },
  { id:'avdol',      name:'モハメド・アヴドゥル',     origin:'ジョジョの奇妙な冒険',   emoji:'🕯️', maxHp:84,  role:'attacker', gender:'男', job:'占い師',       skillIds:['avdol_basic','avdol_crossfire','avdol_crossfire_sp'], color:'#cc4422' },
  { id:'iggy',       name:'イギー',                origin:'ジョジョの奇妙な冒険',   emoji:'🐩', maxHp:80,  role:'tank',     gender:'不明', job:'犬',          skillIds:['iggy_basic','iggy_spear','iggy_clone'],              color:'#ccaa77' },
  // -- 転生したらスライムだった件 (2) --
  { id:'rimuru',     name:'リムル・テンペスト',     origin:'転生したらスライムだった件',emoji:'💧',maxHp:80, role:'attacker', gender:'不明', job:'魔王',      skillIds:['water_blade','storm_magic','megiddo'],                       color:'#55aaff' },
  { id:'milim',      name:'ミリム・ナーヴァ',          origin:'転生したらスライムだった件',emoji:'🍑',maxHp:90, role:'attacker', gender:'女', job:'魔王',        skillIds:['milim_basic','milim_drago','milim_millennium'],             color:'#ff4488' },
  // -- 魔法少女まどか☆マギカ (5) --
  { id:'homura',     name:'暁美ほむら',             origin:'魔法少女まどか☆マギカ',  emoji:'⏰', maxHp:64,  role:'striker',  gender:'女', job:'魔法少女',      skillIds:['pistol_shoot','time_stop_hw','barrier_hw'],               color:'#8833aa' },
  { id:'madoka',       name:'鹿目まどか',             origin:'魔法少女まどか☆マギカ', emoji:'🎀', maxHp:70,  role:'support',  gender:'女', job:'魔法少女',      skillIds:['madoka_basic','madoka_heal','madoka_ultimate'],            color:'#ffaaee' },
  { id:'mami',       name:'巴マミ',                   origin:'魔法少女まどか☆マギカ', emoji:'🌼', maxHp:74,  role:'support',  gender:'女', job:'魔法少女',      skillIds:['mami_basic','mami_bind','mami_finale'],                      color:'#ffdd44' },
  { id:'kyoko',      name:'佐倉杏子',                 origin:'魔法少女まどか☆マギカ', emoji:'🍎', maxHp:82,  role:'attacker', gender:'女', job:'魔法少女',      skillIds:['kyoko_basic','kyoko_spear','kyoko_temptation'],            color:'#cc3333' },
  { id:'sayaka',         name:'美樹さやか',                origin:'魔法少女まどか☆マギカ', emoji:'🎵', maxHp:80,  role:'striker',  gender:'女', job:'魔法少女',      skillIds:['sayaka_basic','sayaka_slash','sayaka_mermaid'],                          color:'#2266cc' },
  // -- Fate/stay night (5) --
  { id:'saber',      name:'アルトリア・ペンドラゴン', origin:'Fate/stay night',      emoji:'🗡️', maxHp:87,  role:'attacker', gender:'女', job:'騎士王',       skillIds:['saber_slash','invisible_air','excalibur'],                     color:'#4477cc' },
  { id:'archer',     name:'アーチャー(衛宮)',          origin:'Fate/stay night',      emoji:'🏹', maxHp:82,  role:'attacker', gender:'男', job:'英霊',         skillIds:['archer_basic','archer_rhoaias','archer_unlimited'],     color:'#cc6644' },
  { id:'rin',        name:'遠坂凛',                   origin:'Fate/stay night',      emoji:'💎', maxHp:70,  role:'support',  gender:'女', job:'魔術師',       skillIds:['rin_basic','rin_gandr','rin_jewels'],                    color:'#cc0033' },
  { id:'lancer_fate',    name:'ランサー（クー・フーリン）', origin:'Fate/stay night',      emoji:'🏃', maxHp:88,  role:'striker',  gender:'男', job:'英霊',         skillIds:['lancer_basic','lancer_gae','lancer_gae_throw'],                          color:'#0033aa' },
  { id:'gilgamesh',      name:'ギルガメッシュ',            origin:'Fate/stay night',      emoji:'👑', maxHp:92,  role:'attacker', gender:'男', job:'英雄王',       skillIds:['gilgamesh_basic','gilgamesh_chain','gilgamesh_ea'],    color:'#cc9900' },
  // -- 東京喰種 (2) --
  { id:'kaneki',     name:'金木研',                origin:'東京喰種',              emoji:'🕷️', maxHp:88,  role:'attacker', gender:'男', job:'喰種',         skillIds:['ukaku_basic','kagune_burst','kakuja'],                       color:'#330033' },
  { id:'touka',      name:'霧嶋董香',                 origin:'東京喰種',              emoji:'🐰', maxHp:80,  role:'striker',  gender:'女', job:'喰種',         skillIds:['touka_basic','touka_wing','touka_dive'],                  color:'#8833aa' },
  // -- ブラッククローバー (2) --
  { id:'asta',       name:'アスタ',                origin:'ブラッククローバー',     emoji:'🍀', maxHp:92,  role:'attacker', gender:'男', job:'魔法騎士',      skillIds:['anti_magic_basic','black_hole','black_divider'],            color:'#115511' },
  { id:'yami',       name:'ヤミ・スケヒロ',            origin:'ブラッククローバー',    emoji:'🚬', maxHp:90,  role:'attacker', gender:'男', job:'魔法騎士団長',  skillIds:['yami_basic','yami_slash','yami_dimension'],                  color:'#221133' },
  // -- 進撃の巨人 (4) --
  { id:'levi',       name:'リヴァイ',              origin:'進撃の巨人',             emoji:'🧹', maxHp:72,  role:'striker',  gender:'男', job:'兵士',         skillIds:['levi_basic','levi_aerial','levi_perfect'],                   color:'#445566' },
  { id:'eren',      name:'エレン・イェーガー',    origin:'進撃の巨人',           emoji:'🦅', maxHp:86,  role:'attacker', gender:'男', job:'調査兵',       skillIds:['eren_basic','eren_thunderspear','eren_rumbling'],                 color:'#223322' },
  { id:'mikasa',    name:'ミカサ・アッカーマン',  origin:'進撃の巨人',           emoji:'🔴', maxHp:75,  role:'striker',  gender:'女', job:'調査兵',       skillIds:['mikasa_basic','mikasa_thunderspear','mikasa_protect'],        color:'#775544' },
  { id:'armin',      name:'アルミン・アルレルト',      origin:'進撃の巨人',           emoji:'🧠', maxHp:72,  role:'support',  gender:'男', job:'調査兵',       skillIds:['armin_basic','armin_thunderspear','armin_plan'],           color:'#667788' },
  { id:'erwin',      name:'エルヴィン・スミス',        origin:'進撃の巨人',           emoji:'🫀', maxHp:82,  role:'tank',     gender:'男', job:'調査兵団長',    skillIds:['erwin_basic','erwin_thunderspear','erwin_charge'],          color:'#5a6b7a' },
  { id:'hange',      name:'ハンジ・ゾエ',             origin:'進撃の巨人',           emoji:'🥽', maxHp:80,  role:'support',  gender:'不明', job:'分隊長',      skillIds:['hange_basic','hange_thunderspear','hange_dissect'],        color:'#8a7755' },
  // -- 七つの大罪 (2) --
  { id:'meliodas',   name:'メリオダス',             origin:'七つの大罪',             emoji:'↩️', maxHp:88,  role:'tank',     gender:'男', job:'騎士団長',      skillIds:['meliodas_basic','meliodas_reflection','meliodas_rising'], color:'#cc8800' },
  { id:'escanor',   name:'エスカノール',          origin:'七つの大罪',           emoji:'🌞', maxHp:92,  role:'attacker', gender:'男', job:'戦士',         skillIds:['escanor_basic','escanor_sunshine','escanor_the_one'],   color:'#ff9900' },
  { id:'ban',        name:'バン',                   origin:'七つの大罪',           emoji:'🦊', maxHp:92,  role:'tank',     gender:'男', job:'盗賊',         skillIds:['ban_basic','ban_snatch','ban_immortal'],                 color:'#a34a3c' },
  { id:'harlequin',  name:'キング（ハーレクイン）',   origin:'七つの大罪',           emoji:'🧚', maxHp:76,  role:'support',  gender:'男', job:'妖精王',       skillIds:['harlequin_basic','harlequin_fossil','harlequin_garden'], color:'#5aa06b' },
  { id:'diane',      name:'ディアンヌ',              origin:'七つの大罪',           emoji:'🪨', maxHp:95,  role:'attacker', gender:'女', job:'巨人族',       skillIds:['diane_basic','diane_rush','diane_catastrophe'],          color:'#8a6b4a' },
  { id:'merlin',     name:'マーリン',                origin:'七つの大罪',           emoji:'♾️', maxHp:74,  role:'attacker', gender:'女', job:'魔術師',       skillIds:['merlin_basic','merlin_stinger','merlin_javelin'],        color:'#4a5a9a' },
  { id:'gowther',    name:'ゴウセル',                origin:'七つの大罪',           emoji:'🐐', maxHp:76,  role:'support',  gender:'不明', job:'人形',       skillIds:['gowther_basic','gowther_jack','gowther_blackout'],       color:'#c47a9a' },
  // -- FAIRY TAIL (4) --
  { id:'natsu',      name:'ナツ・ドラグニル',        origin:'FAIRY TAIL',            emoji:'🐉', maxHp:92,  role:'attacker', gender:'男', job:'竜使い',       skillIds:['natsu_basic','natsu_iron','natsu_explode'],                  color:'#dd2200' },
  { id:'erza',       name:'エルザ・スカーレット',    origin:'FAIRY TAIL',            emoji:'👗', maxHp:90,  role:'tank',     gender:'女', job:'剣士',         skillIds:['erza_basic','erza_eight','erza_hero'],                       color:'#cc2244' },
  { id:'gray',       name:'グレイ・フルバスター',    origin:'FAIRY TAIL',            emoji:'🧊', maxHp:83,  role:'attacker', gender:'男', job:'魔法使い',      skillIds:['gray_basic','gray_rampart','gray_ice_emperor'],               color:'#2255aa' },
  { id:'lucy_ft',      name:'ルーシィ・ハートフィリア', origin:'FAIRY TAIL',          emoji:'🔑', maxHp:74,  role:'support',  gender:'女', job:'星霊魔法使い', skillIds:['lucy_basic','lucy_aquarius','lucy_stardress'],                color:'#ffcc44' },
  // -- オーバーロード (2) --
  { id:'ainz',       name:'アインズ・ウール・ゴウン', origin:'オーバーロード',         emoji:'💀', maxHp:80,  role:'attacker', gender:'男', job:'魔王',         skillIds:['ainz_basic','ainz_timestop','ainz_annihilate'],              color:'#220033' },
  { id:'albedo',    name:'アルベド',             origin:'オーバーロード',        emoji:'👸', maxHp:92,  role:'tank',     gender:'女', job:'守護者統括',    skillIds:['albedo_basic','albedo_guardian','albedo_apocalypse'],    color:'#220022' },
  // -- この素晴らしい世界 (4) --
  { id:'aqua_kb',      name:'アクア',                 origin:'この素晴らしい世界',    emoji:'💧', maxHp:68,  role:'support',  gender:'女', job:'女神',         skillIds:['aqua_basic','aqua_revive','aqua_sacred'],                      color:'#2288cc' },
  { id:'darkness_kb',  name:'ダクネス',               origin:'この素晴らしい世界',    emoji:'🛡️', maxHp:98,  role:'tank',     gender:'女', job:'騎士',         skillIds:['darkness_basic','darkness_taunt','darkness_holy'],       color:'#aaaa44' },
  { id:'megumin',   name:'めぐみん',             origin:'この素晴らしい世界',    emoji:'💣', maxHp:65,  role:'attacker', gender:'女', job:'爆裂魔法使い',  skillIds:['megumin_basic','megumin_chant','megumin_advanced'],    color:'#990033' },
  { id:'kazuma',    name:'佐藤和真',             origin:'この素晴らしい世界',    emoji:'🎲', maxHp:72,  role:'support',  gender:'男', job:'冒険者',       skillIds:['kazuma_basic','kazuma_steal','kazuma_lucky'],             color:'#886633' },
  // -- チェンソーマン (4) --
  { id:'denji',      name:'デンジ',                   origin:'チェンソーマン',        emoji:'⛓️', maxHp:88,  role:'attacker', gender:'男', job:'デビルハンター', skillIds:['denji_basic','denji_saw','denji_chainsaw'],                   color:'#cc2200' },
  { id:'power_csm',  name:'パワー',                   origin:'チェンソーマン',        emoji:'🩸', maxHp:84,  role:'attacker', gender:'女', job:'悪魔',         skillIds:['power_basic','power_blood','power_hammer'],                color:'#880000' },
  { id:'makima',     name:'マキマ',                   origin:'チェンソーマン',        emoji:'🐕', maxHp:85,  role:'support',  gender:'女', job:'公安対魔特異4課長', skillIds:['makima_basic','makima_control','makima_will'],           color:'#cc9944' },
  { id:'aki',        name:'早川アキ',                 origin:'チェンソーマン',        emoji:'🪖', maxHp:80,  role:'attacker', gender:'男', job:'デビルハンター', skillIds:['aki_basic','aki_fox','aki_future'],                          color:'#334455' },
  // -- 炎炎ノ消防隊 (2) --
  { id:'shinra',      name:'森羅日下部',          origin:'炎炎ノ消防隊',          emoji:'👣', maxHp:90,  role:'striker',  gender:'男', job:'消防士',         skillIds:['shinra_basic','shinra_adolla','shinra_burst'],              color:'#cc2200' },
  { id:'arthur',      name:'アーサー・ボイル',     origin:'炎炎ノ消防隊',          emoji:'🐴', maxHp:82,  role:'attacker', gender:'男', job:'消防士',         skillIds:['arthur_basic','arthur_plasma','arthur_excalibur'],                         color:'#4488cc' },
  { id:'benimaru',    name:'新門紅丸',            origin:'炎炎ノ消防隊',          emoji:'⛩️', maxHp:92,  role:'attacker', gender:'男', job:'大隊長',        skillIds:['benimaru_basic','benimaru_kagetsu','benimaru_nichirin'],                    color:'#dd2244' },
  // -- FINAL FANTASY (4) --
  { id:'cloud',       name:'クラウド・ストライフ', origin:'FINAL FANTASY',        emoji:'🏍️', maxHp:90,  role:'attacker', gender:'男', job:'傭兵',           skillIds:['cloud_basic','cloud_braver','cloud_omnislash'],             color:'#4466cc' },
  { id:'sephiroth_ff',name:'セフィロス',          origin:'FINAL FANTASY',        emoji:'🪽', maxHp:94,  role:'attacker', gender:'男', job:'元SOLDIER',      skillIds:['seph_basic','seph_shadow','seph_supernova'],                 color:'#aaaaaa' },
  { id:'tifa',        name:'ティファ・ロックハート',origin:'FINAL FANTASY',        emoji:'👊', maxHp:84,  role:'striker',  gender:'女', job:'バーテンダー',    skillIds:['tifa_basic','tifa_straight','tifa_final_heaven'],                       color:'#cc4444' },
  { id:'aerith',      name:'エアリス',            origin:'FINAL FANTASY',        emoji:'💐', maxHp:72,  role:'support',  gender:'女', job:'花売り',         skillIds:['aerith_basic','aerith_heal','aerith_gospel'],                              color:'#ff88cc' },
  // -- とある魔術の禁書目録 (5) --
  { id:'misaka',      name:'御坂美琴',            origin:'とある魔術の禁書目録',  emoji:'⚡', maxHp:88,  role:'attacker', gender:'女', job:'超能力者',        skillIds:['misaka_basic','misaka_storm','misaka_dragon'],           color:'#cc8800' },
  { id:'accelerator', name:'一方通行',            origin:'とある魔術の禁書目録',  emoji:'➡️', maxHp:92,  role:'tank',     gender:'男', job:'超能力者',        skillIds:['accel_basic','accel_vector','accel_rampage'],             color:'#888888' },
  { id:'touma',       name:'上条当麻',            origin:'とある魔術の禁書目録',  emoji:'✊', maxHp:82,  role:'tank',     gender:'男', job:'学生',           skillIds:['touma_basic','touma_cancel','touma_possibility'],                          color:'#4488cc' },
  { id:'index',       name:'インデックス',         origin:'とある魔術の禁書目録',  emoji:'📚', maxHp:64,  role:'support',  gender:'女', job:'魔術師',         skillIds:['index_basic','index_spell','index_soul'],                                  color:'#ccbbaa' },
  { id:'kuroko',      name:'白井黒子',            origin:'とある魔術の禁書目録',  emoji:'✨', maxHp:74,  role:'striker',  gender:'女', job:'風紀委員',        skillIds:['kuroko_basic','kuroko_tele','kuroko_pin'],                                 color:'#8844cc' },
  // -- 葬送のフリーレン (4) --
  { id:'frieren',    name:'フリーレン',            origin:'葬送のフリーレン',      emoji:'🧝', maxHp:78,  role:'attacker', gender:'女', job:'魔法使い',      skillIds:['frieren_basic','frieren_defense','frieren_judradjim'], color:'#ccddee' },
  { id:'fern',       name:'フェルン',              origin:'葬送のフリーレン',      emoji:'🌙', maxHp:72,  role:'striker',  gender:'女', job:'魔法使い',      skillIds:['fern_basic','fern_defense','fern_zoltraak'],                  color:'#7766aa' },
  { id:'stark',      name:'シュタルク',            origin:'葬送のフリーレン',      emoji:'🪓', maxHp:94,  role:'tank',     gender:'男', job:'戦士',         skillIds:['stark_basic','stark_axe','stark_senten'],                   color:'#aa5533' },
  { id:'sein',       name:'ザイン',                origin:'葬送のフリーレン',      emoji:'📿', maxHp:72,  role:'support',  gender:'男', job:'僧侶',         skillIds:['sein_basic','sein_heal','sein_blessing'],                   color:'#997755' },
  // -- 無職転生 (4) --
  { id:'rudeus',     name:'ルーデウス・グレイラット', origin:'無職転生',            emoji:'🪄', maxHp:80,  role:'attacker', gender:'男', job:'魔術師',       skillIds:['rudeus_basic','rudeus_swamp','rudeus_lightning'], color:'#557788' },
  { id:'eris',       name:'エリス・ボレアス・グレイラット', origin:'無職転生',      emoji:'🦁', maxHp:84,  role:'striker',  gender:'女', job:'剣王',         skillIds:['eris_basic','eris_rengeki','eris_rush'],                     color:'#cc3322' },
  { id:'roxy',       name:'ロキシー・ミグルディア',  origin:'無職転生',              emoji:'💧', maxHp:70,  role:'attacker', gender:'女', job:'水聖級魔術師',  skillIds:['roxy_basic','roxy_icicle','roxy_cumulonimbus'],             color:'#4477cc' },
  { id:'sylphiette', name:'シルフィエット',         origin:'無職転生',              emoji:'🍃', maxHp:68,  role:'support',  gender:'女', job:'宮廷魔術師',    skillIds:['sylphie_basic','sylphie_heal','sylphie_wind'],              color:'#88cc99' },
  // -- 盾の勇者の成り上がり (3) --
  { id:'naofumi',    name:'岩谷尚文',              origin:'盾の勇者の成り上がり',   emoji:'🛡️', maxHp:92,  role:'tank',     gender:'男', job:'盾の勇者',      skillIds:['naofumi_basic','naofumi_meteor','naofumi_maiden'],   color:'#336655' },
  { id:'raphtalia',  name:'ラフタリア',            origin:'盾の勇者の成り上がり',   emoji:'🦝', maxHp:76,  role:'attacker', gender:'女', job:'亜人の剣士',    skillIds:['raphtalia_basic','raphtalia_stardust','raphtalia_tenmei'],         color:'#aa6644' },
  { id:'filo',       name:'フィーロ',              origin:'盾の勇者の成り上がり',   emoji:'🐤', maxHp:72,  role:'striker',  gender:'女', job:'フィロリアル・クイーン', skillIds:['filo_basic','filo_quick','filo_tornado'],                  color:'#ffdd66' },
  // -- ゼノブレイド2 (4) --
  { id:'rex',        name:'レックス',              origin:'ゼノブレイド2',          emoji:'🚢', maxHp:82,  role:'attacker', gender:'男', job:'サルベージャー', skillIds:['rex_basic','rex_shot','rex_rolling'],                      color:'#3a8a8a' },
  { id:'pyra',       name:'ホムラ',                origin:'ゼノブレイド2',          emoji:'🔥', maxHp:78,  role:'attacker', gender:'女', job:'天の聖杯',      skillIds:['pyra_basic','pyra_prominence','pyra_burning'],             color:'#cc3322' },
  { id:'mythra',     name:'ヒカリ',                origin:'ゼノブレイド2',          emoji:'✨', maxHp:72,  role:'striker',  gender:'女', job:'天の聖杯',      skillIds:['mythra_basic','mythra_photon','mythra_sacred'],            color:'#d4b83a' },
  { id:'nia',        name:'ニア',                  origin:'ゼノブレイド2',          emoji:'🐈', maxHp:74,  role:'support',  gender:'女', job:'ドライバー',    skillIds:['nia_basic','nia_butterfly','nia_healing'],                 color:'#4a8a9a' },
];

// ============================================================
// NORMAL ENEMIES (55)
// ============================================================
const ENEMY_DATA = [
  { id:'demon_warrior', name:'魔族の戦士',   emoji:'👹', role:'attacker', maxHp:94, color:'#880000', skillIds:['e_slash','e_dark_wave','e_power_up','e_slash'] },
  { id:'frieza_soldier',name:'フリーザ兵',   emoji:'👽', role:'attacker', maxHp:83, color:'#cc44cc', skillIds:['e_beam','e_slash','e_power_up','e_beam'] },
  { id:'mech',          name:'機械兵器',     emoji:'🤖', role:'attacker', maxHp:118, color:'#448888', skillIds:['e_missile','e_laser','e_repair','e_missile','e_shield_self'], chargeSkillId:'e_charge_cannon' },
  { id:'dragon_enemy',  name:'ドラゴン',     emoji:'🐲', role:'attacker', maxHp:123, color:'#336600', skillIds:['e_fire_breath','e_tail_sweep','e_roar','e_fire_breath'] },
  { id:'upper_demon',   name:'上弦の鬼',     emoji:'👺', role:'support',  maxHp:107, color:'#660022', skillIds:['e_supp_heal','e_curse','e_team_buff','e_dark_wave','e_supp_shield'] },
  { id:'zombie',        name:'ゾンビ',       emoji:'🧟', role:'support',  maxHp:89, color:'#446633', skillIds:['e_supp_heal','e_curse','e_team_buff','e_slash','e_supp_shield'] },
  { id:'death_knight',  name:'死霊騎士',     emoji:'💀', role:'support',  maxHp:99, color:'#334455', skillIds:['e_supp_heal','e_curse','e_team_buff','e_dark_wave','e_supp_shield'] },
  { id:'orc_general',   name:'オーク将軍',   emoji:'🐗', role:'attacker', maxHp:131, color:'#664422', skillIds:['e_heavy_blow','e_war_cry','e_slash','e_heavy_blow','e_shield_self'] },
  { id:'cursed_spirit', name:'呪霊',         emoji:'👻', role:'support',  maxHp:94, color:'#442255', skillIds:['e_supp_heal','e_curse','e_team_buff','e_dark_wave','e_supp_shield'] },
  { id:'titan',         name:'巨人',         emoji:'🦴', role:'attacker', maxHp:142, color:'#886644', skillIds:['e_heavy_blow','e_tail_sweep','e_roar','e_heavy_blow'] },
  { id:'goblin_king',   name:'ゴブリン将軍', emoji:'👺', role:'support',  maxHp:89, color:'#336622', skillIds:['e_supp_heal','e_war_cry','e_team_buff','e_slash','e_supp_shield'] },
  { id:'vampire',       name:'吸血鬼',       emoji:'🧛', role:'support',  maxHp:102, color:'#550022', skillIds:['e_supp_heal','e_curse','e_team_buff','e_blood_art','e_supp_shield'] },
  { id:'fire_witch',    name:'炎の魔女',     emoji:'🔮', role:'support',  maxHp:83, color:'#cc3300', skillIds:['e_supp_heal','e_curse','e_team_buff','e_fire_breath','e_supp_shield'] },
  { id:'ice_spirit',    name:'氷霊',         emoji:'💎', role:'support',  maxHp:89, color:'#aaddff', skillIds:['e_supp_heal','e_slow','e_team_buff','e_ice_shard','e_supp_shield'] },
  { id:'thunder_beast', name:'雷神獣',       emoji:'🐯', role:'attacker', maxHp:107, color:'#aacc00', skillIds:['e_thunder_fang','e_laser','e_roar','e_thunder_fang'] },
  { id:'sea_serpent',   name:'海蛇魔神',     emoji:'🐍', role:'attacker', maxHp:113, color:'#003388', skillIds:['e_water_blast','e_tail_sweep','e_poison_bite','e_water_blast'] },
  { id:'light_guardian',name:'光の守護者',   emoji:'👼', role:'support',  maxHp:99, color:'#ffeeaa', skillIds:['e_supp_heal','e_light_bind','e_light_guard','e_holy_strike','e_supp_shield'] },
  { id:'armored_curse', name:'呪いの鎧',     emoji:'🛡️', role:'attacker', maxHp:137, color:'#334466', skillIds:['e_heavy_blow','e_dark_wave','e_war_cry','e_heavy_blow','e_shield_self'] },
  { id:'phantom_wolf',  name:'幻狼王',       emoji:'🐺', role:'attacker', maxHp:99, color:'#557788', skillIds:['e_slash','e_roar','e_power_up','e_heavy_blow'] },
  { id:'mech_dragon',   name:'機甲龍',       emoji:'🦾', role:'attacker', maxHp:123, color:'#335577', skillIds:['e_thunder_fang','e_laser','e_missile','e_thunder_fang'], chargeSkillId:'e_charge_cannon' },
  { id:'dark_elf',      name:'闇エルフの弓兵',emoji:'🧝', role:'attacker', maxHp:99, color:'#223344', skillIds:['e_dark_arrow','e_dark_wave','e_power_up','e_dark_arrow'] },
  { id:'ancient_golem', name:'古代ゴーレム', emoji:'🗿', role:'attacker', maxHp:155, color:'#776655', skillIds:['e_stone_fist','e_heavy_blow','e_repair','e_stone_fist','e_shield_self'] },
  { id:'dragon_warrior',name:'竜人族の戦士', emoji:'🐲', role:'attacker', maxHp:113, color:'#554400', skillIds:['e_fire_slash','e_fire_breath','e_slash','e_fire_slash'] },
  { id:'sea_king',      name:'深海の王者',   emoji:'🦈', role:'attacker', maxHp:123, color:'#003366', skillIds:['e_water_breath','e_water_blast','e_tail_sweep','e_water_breath'] },
  { id:'demon_beast',   name:'呪いの魔獣',   emoji:'🐺', role:'attacker', maxHp:107, color:'#332233', skillIds:['e_demon_claws','e_curse','e_dark_wave','e_demon_claws'] },
  { id:'shadow_assassin', name:'影の刺客',     emoji:'🥷', role:'attacker', maxHp:104, color:'#223344', skillIds:['e_shadow_stab','e_slash','e_dark_wave','e_shadow_stab'] },
  { id:'bone_dragon_e',   name:'骸骨龍',       emoji:'💀', role:'attacker', maxHp:131, color:'#445566', skillIds:['e_bone_blast','e_tail_sweep','e_roar','e_bone_blast'] },
  { id:'lava_golem',      name:'溶岩ゴーレム', emoji:'🌋', role:'attacker', maxHp:147, color:'#993300', skillIds:['e_lava_fist','e_heavy_blow','e_fire_breath','e_lava_fist'], chargeSkillId:'e_charge_eruption' },
  { id:'thunder_knight_e',name:'雷霆騎士',     emoji:'⚡', role:'attacker', maxHp:118, color:'#886600', skillIds:['e_thunder_lance','e_slash','e_war_cry','e_thunder_lance'] },
  { id:'undead_mage',     name:'不死の魔導士', emoji:'💀', role:'support',  maxHp:94, color:'#334466', skillIds:['e_supp_heal','e_curse','e_team_buff','e_dark_wave','e_supp_shield'] },
  { id:'hell_hound',      name:'地獄犬',       emoji:'🐕', role:'attacker', maxHp:99, color:'#661100', skillIds:['e_hellfire_e','e_slash','e_poison_bite','e_hellfire_e'] },
  { id:'crystal_guardian',name:'水晶の守護者', emoji:'💎', role:'attacker', maxHp:137, color:'#88aacc', skillIds:['e_crystal_spike','e_heavy_blow','e_repair','e_crystal_spike'] },
  { id:'wind_elemental',  name:'風の精霊',     emoji:'💨', role:'support',  maxHp:89, color:'#aaccaa', skillIds:['e_supp_heal','e_roar','e_team_buff','e_tail_sweep','e_supp_shield'] },
  { id:'mirror_demon',    name:'鏡の魔人',     emoji:'🪞', role:'support',  maxHp:107, color:'#556677', skillIds:['e_supp_heal','e_curse','e_team_buff','e_dark_wave','e_supp_shield'] },
  { id:'poison_toad_e',   name:'毒ガエル王',   emoji:'🐸', role:'attacker', maxHp:94, color:'#336622', skillIds:['e_venom_spit','e_poison_bite','e_regen','e_venom_spit'] },
  { id:'dark_shaman_e',   name:'闇のシャーマン',emoji:'🧙', role:'support', maxHp:99, color:'#442255', skillIds:['e_supp_heal','e_curse','e_team_buff','e_dark_wave','e_supp_shield'] },
  { id:'ice_titan',       name:'氷の巨人',     emoji:'🧊', role:'attacker', maxHp:142, color:'#88aaff', skillIds:['e_blizzard_e','e_heavy_blow','e_slow','e_blizzard_e'] },
  { id:'death_reaper',    name:'死神',         emoji:'💀', role:'attacker', maxHp:113, color:'#222233', skillIds:['e_death_scythe','e_curse','e_dark_wave','e_death_scythe'] },
  { id:'chaos_wyrm',      name:'混沌の竜',     emoji:'🐉', role:'attacker', maxHp:128, color:'#440055', skillIds:['e_chaos_breath_e','e_tail_sweep','e_roar','e_chaos_breath_e'], chargeSkillId:'e_charge_abyss' },
  { id:'soul_eater_e',    name:'魂喰いの怪物', emoji:'👻', role:'attacker', maxHp:109, color:'#332244', skillIds:['e_soul_drain','e_dark_wave','e_curse','e_soul_drain'] },
  { id:'iron_golem',      name:'鉄のゴーレム', emoji:'🗿', role:'attacker', maxHp:155, color:'#556655', skillIds:['e_iron_pound','e_heavy_blow','e_repair','e_iron_pound','e_shield_self'] },
  { id:'frost_phoenix',   name:'霜の鳳',       emoji:'🦅', role:'attacker', maxHp:113, color:'#99ccff', skillIds:['e_frost_blast','e_ice_shard','e_blizzard_e','e_frost_blast'] },
  { id:'venom_serpent',   name:'毒蛇の魔神',   emoji:'🐍', role:'attacker', maxHp:107, color:'#336644', skillIds:['e_venom_coil','e_poison_bite','e_water_blast','e_venom_coil'] },
  { id:'abyss_knight',    name:'深淵騎士',     emoji:'🛡️', role:'attacker', maxHp:123, color:'#221133', skillIds:['e_abyss_slash','e_dark_wave','e_heavy_blow','e_abyss_slash','e_shield_self'] },
  { id:'storm_giant_e',   name:'嵐の巨人',     emoji:'🌪️', role:'attacker', maxHp:147, color:'#335566', skillIds:['e_tail_sweep','e_heavy_blow','e_roar','e_tail_sweep'] },
  { id:'plague_doctor_e', name:'疫病医',       emoji:'🎭', role:'support',  maxHp:94, color:'#334433', skillIds:['e_supp_heal','e_curse','e_team_buff','e_plague_cloud','e_supp_shield'] },
  { id:'shadow_clone_e',  name:'影の分身',     emoji:'🌑', role:'attacker', maxHp:89, color:'#333344', skillIds:['e_shadow_strike','e_slash','e_dark_wave','e_shadow_strike'] },
  { id:'blood_demon_e',   name:'血の悪魔',     emoji:'🩸', role:'support',  maxHp:113, color:'#550011', skillIds:['e_supp_heal','e_curse','e_team_buff','e_blood_art_2','e_supp_shield'] },
  { id:'earth_colossus',  name:'大地の巨神',   emoji:'🗻', role:'attacker', maxHp:161, color:'#664433', skillIds:['e_earth_smash','e_heavy_blow','e_roar','e_earth_smash'], chargeSkillId:'e_charge_eruption' },
  { id:'celestial_beast', name:'天上の魔獣',   emoji:'✨', role:'attacker', maxHp:123, color:'#cccc66', skillIds:['e_holy_strike','e_light_bind','e_roar','e_holy_strike'] },
  { id:'void_wraith',     name:'虚無の怨霊',   emoji:'👁️', role:'support',  maxHp:99, color:'#221122', skillIds:['e_supp_heal','e_curse','e_team_buff','e_void_drain','e_supp_shield'] },
  { id:'demon_general_e', name:'魔軍将軍',     emoji:'👺', role:'attacker', maxHp:137, color:'#440022', skillIds:['e_demon_blade','e_dark_wave','e_power_up','e_demon_blade'] },
  { id:'ancient_vampire', name:'古代吸血鬼',   emoji:'🧛', role:'support',  maxHp:118, color:'#330011', skillIds:['e_supp_heal','e_curse','e_team_buff','e_blood_art','e_supp_shield'] },
  { id:'berserker_orc',   name:'狂戦士オーク', emoji:'🐗', role:'attacker', maxHp:142, color:'#554422', skillIds:['e_heavy_blow','e_war_cry','e_slash','e_heavy_blow'] },
  { id:'cursed_swordsman',name:'呪われた剣士', emoji:'⚔️', role:'attacker', maxHp:109, color:'#332233', skillIds:['e_cursed_slash','e_dark_wave','e_slash','e_cursed_slash'] }
];

// ============================================================
// BOSS CHARACTERS (30)
// ============================================================
const BOSS_DATA = [
  { id:'frieza_final',  name:'フリーザ〈最終形態〉',    emoji:'☄️', maxHp:680, isBoss:true, color:'#cc44cc', origin:'ドラゴンボール', skillIds:['b_death_beam','b_nova_strike','b_transform'], chargeSkillId:'b_100percent',       intro:'「ホッホッホ…私に挑むとは、いい度胸ですねぇ。宇宙の帝王の力、見せてあげましょう。」' },
  { id:'madara',        name:'うちはマダラ',            emoji:'👁️', maxHp:660, isBoss:true, color:'#990022', origin:'NARUTO', skillIds:['b_susanoo','b_susanoo_armor','b_mutsuki','b_rinnegan'], chargeSkillId:'b_meteor',  intro:'「お前も舞うか？」' },
  { id:'kaido',         name:'カイドウ',                emoji:'🐉', maxHp:730, isBoss:true, color:'#224488', origin:'ONE PIECE', skillIds:['b_boro_breath','b_thunder_bagua','b_kaido_form'], chargeSkillId:'b_bolo_breath',   intro:'「世界最高の戦争を始めようぜ！」' },
  { id:'zoma',          name:'魔王ゾーマ',              emoji:'🌑', maxHp:660, isBoss:true, color:'#110033', origin:'ドラゴンクエスト', skillIds:['b_blizzard','b_dark_all','b_zoma_dispel','b_maou_barrier'], chargeSkillId:'b_zoma_zero',          intro:'「ふはははは！この闇の力を受けたわしに、勝てるとでも思うたか！」' },
  { id:'boros',         name:'ボロス〈解放形態〉',      emoji:'👾', maxHp:690, isBoss:true, color:'#440088', origin:'ワンパンマン', skillIds:['b_collapsing_star','b_boros_barrage','b_meteoric_burst','b_regen_boss'], chargeSkillId:'b_galaxy_burst', intro:'「ようやく出会えた…俺の全力を受け止められる者に！」' },
  { id:'dio_boss',      name:'DIO〈ザ・ワールド〉',     emoji:'⏱️', maxHp:620, isBoss:true, color:'#aaaa00', origin:'ジョジョの奇妙な冒険', skillIds:['b_time_stop_boss','b_knife_barrage','b_wryyy'], chargeSkillId:'b_road_roller',    intro:'「無駄！無駄！無駄！無駄ァ！このDIOにはすべてが無駄なのだ！」' },
  { id:'kokushibo',     name:'上弦の壱・黒死牟',        emoji:'🌙', maxHp:650, isBoss:true, color:'#220033', origin:'鬼滅の刃', skillIds:['b_moon_breathing','b_moon_crescent','b_koku_regen'], chargeSkillId:'b_infinite_slashes', intro:'「吾はただ鬼舞辻無惨様に仕える者…」' },
  { id:'ganon',         name:'ガノンドロフ',            emoji:'🐗', maxHp:640, isBoss:true, color:'#224400', origin:'ゼルダの伝説', skillIds:['b_dark_trident','b_phantom_ganon','b_ganon_barrier'], chargeSkillId:'b_beast_ganon', intro:'「愚かな勇者よ…この闇の力、その身に刻んでやろう。」' },
  { id:'cell_perfect',       name:'セル〈完全体〉',    emoji:'🪲', maxHp:680, isBoss:true, color:'#225500', origin:'ドラゴンボール', skillIds:['b_cell_beam','b_cell_kamehame','b_cell_regen','b_cell_perfect'], chargeSkillId:'b_cell_solar',    intro:'「私が完全体に進化するということがどういうことか…思い知らせてあげましょう！」' },
  { id:'demon_king_seven',   name:'魔神王〈怨嗟〉',   emoji:'👿', maxHp:700, isBoss:true, color:'#220022', origin:'七つの大罪', skillIds:['b_demon_commandment','b_demon_curse','b_demon_true'], chargeSkillId:'b_demon_black', intro:'「すべての存在は絶望の前に平等だ。お前たちも例外ではない。」' },
  { id:'gilgamesh_boss',     name:'ギルガメッシュ',   emoji:'⭐', maxHp:670, isBoss:true, color:'#aa8800', origin:'Fate/stay night', skillIds:['b_gil_treasury','b_gil_ea','b_gil_aura'], chargeSkillId:'b_gil_enuma',               intro:'「雑種どもが…王の前に跪け。」' },
  { id:'muzan_boss',         name:'鬼舞辻無惨',       emoji:'🩸', maxHp:720, isBoss:true, color:'#440011', origin:'鬼滅の刃', skillIds:['b_muzan_cells','b_muzan_aura','b_muzan_whip'], chargeSkillId:'b_muzan_final',          intro:'「私の言うことを否定するのか？……私は限りなく完璧に近い生物だ。」' },
  { id:'kaguya_boss',        name:'大筒木カグヤ',     emoji:'🌳', maxHp:770, isBoss:true, color:'#ffccee', origin:'NARUTO', skillIds:['b_kaguya_byakugan','b_kaguya_gravity','b_kaguya_truth'], chargeSkillId:'b_kaguya_yomotsu', intro:'「この世の全ての者よ…平伏しなさい。」' },
  { id:'meruem_boss',        name:'メルエム',         emoji:'🐜', maxHp:750, isBoss:true, color:'#226600', origin:'HUNTER×HUNTER', skillIds:['b_meruem_strike','b_meruem_aura','b_meruem_nen'], chargeSkillId:'b_meruem_coil',        intro:'「跪け、王に逆らう愚か者よ。」' },
  { id:'aizen_boss',         name:'藍染惣右介〈完全体〉',emoji:'💠',maxHp:730, isBoss:true, color:'#886600', origin:'BLEACH', skillIds:['b_aizen_kyoka','b_aizen_light','b_aizen_goryu','b_aizen_transcend','b_aizen_shield'], chargeSkillId:'b_aizen_hogyoku', intro:'「これから…私が、天に立つ。」' },
  { id:'acnologia_boss',     name:'アクノロギア',     emoji:'🐉', maxHp:730, isBoss:true, color:'#223355', origin:'FAIRY TAIL', skillIds:['b_acnologia_roar','b_acnologia_dark','b_acnologia_temporal'], chargeSkillId:'b_acnologia_pulse', intro:'「竜…殺し…するために…貴様らには消えてもらう。」' },
  { id:'yhwach_boss',        name:'ユーハバッハ',     emoji:'✡️', maxHp:760, isBoss:true, color:'#cc9922', origin:'BLEACH', skillIds:['b_yhwach_almighty','b_yhwach_heilig','b_yhwach_schrift'], chargeSkillId:'b_yhwach_reishi', intro:'「全ての魂は私のものだ。平静に死を受け入れろ。」' },
  { id:'veldanava_boss',     name:'ヴェルダナーヴァ〈星王竜〉',emoji:'🌌',maxHp:800, isBoss:true, color:'#002244', origin:'転スラ', skillIds:['b_vel_strike','b_vel_creation','b_vel_annihilate'], chargeSkillId:'b_vel_god',     intro:'「世界の創造主として…汝らの存在を試す。」' },
  { id:'all_for_one',        name:'オール・フォー・ワン',         emoji:'🦹', maxHp:700, isBoss:true, color:'#110022', origin:'僕のヒーローアカデミア', skillIds:['b_afo_steal','b_afo_roar','b_afo_impact'], chargeSkillId:'b_afo_almight',       intro:'「すべての“個性”は…僕のもの。さぁ、君のも差し出してもらおうか。」' },
  { id:'kenjaku',            name:'羂索',                          emoji:'🧠', maxHp:630, isBoss:true, color:'#220033', origin:'呪術廻戦', skillIds:['b_ken_curse','b_ken_brain','b_ken_heian'], chargeSkillId:'b_ken_merging',         intro:'「人類の進化を促させてもらおう。君たちの命が礎になる。」' },
  { id:'zenon_boss',         name:'ゼノン・ゾグラティス',           emoji:'🦴', maxHp:610, isBoss:true, color:'#334455', origin:'ブラッククローバー', skillIds:['b_zen_bone','b_zen_skeleton','b_zen_bone_shield','b_zen_devil'], chargeSkillId:'b_zen_almighty', intro:'「骨の魔法は全てを貫く。弱者はここで終わりだ。」' },
  { id:'satella_boss',       name:'嫉妬の魔女・サテラ',            emoji:'🌑', maxHp:750, isBoss:true, color:'#220044', origin:'Re:ゼロ', skillIds:['b_sat_shadow','b_sat_embrace','b_sat_jealousy'], chargeSkillId:'b_sat_witch',       intro:'「……愛してる、愛してる、愛してる、愛してる——」' },
  { id:'blackbeard_boss',    name:'黒ひげ〈最強〉',                emoji:'🏴', maxHp:710, isBoss:true, color:'#111111', origin:'ONE PIECE', skillIds:['b_bb_quake','b_bb_dark','b_bb_darkness'], chargeSkillId:'b_bb_tsunami',             intro:'「時代は俺らのもんだ！！ゼハハハハ！！」' },
  { id:'heathcliff_boss',    name:'ヒースクリフ〈茅場晶彦〉',      emoji:'🗡️', maxHp:590, isBoss:true, color:'#4466aa', origin:'SAO', skillIds:['b_heath_holy','b_heath_shield','b_heath_sword'], chargeSkillId:'b_heath_god',       intro:'「プレイヤーの諸君、私の世界へようこそ。」' },
  { id:'pucci_boss',         name:'プッチ神父〈MadeInHeaven〉',    emoji:'⛪', maxHp:760, isBoss:true, color:'#003355', origin:'ジョジョの奇妙な冒険', skillIds:['b_pucci_disc','b_pucci_made','b_pucci_time','b_pucci_accel'], chargeSkillId:'b_pucci_heaven',       intro:'「天国に至る方法がわかった…DIOよ、僕たちは神になれる！」' },
  { id:'darkness_devil',     name:'闇の悪魔',                      emoji:'😱', maxHp:710, isBoss:true, color:'#000011', origin:'チェンソーマン', skillIds:['b_darkdev_fear','b_darkdev_crush','b_darkdev_blade'], chargeSkillId:'b_darkdev_despair', intro:'「恐怖そのものが私の正体だ。逃げ場はない——」' },
  { id:'estarossa_boss',     name:'エスタロッサ〈慈愛の戒禁〉',      emoji:'🖤', maxHp:640, isBoss:true, color:'#330011', origin:'七つの大罪', skillIds:['b_esta_love','b_esta_repose','b_esta_cross'], chargeSkillId:'b_esta_full',           intro:'「俺の慈愛が全てを焼き尽くす。これが戒禁「慈愛」の力だ。」' },
  { id:'father_boss',        name:'お父様〈神の力〉',               emoji:'☀️', maxHp:780, isBoss:true, color:'#887700', origin:'鋼の錬金術師', skillIds:['b_father_eat','b_father_god','b_father_truth'], chargeSkillId:'b_father_light',     intro:'「人間など、路傍の石に過ぎない。神の器として完成された私の前に…」' }
];

// ============================================================
// MID-BOSS DATA (29)
// ============================================================
const MIDBOSS_DATA = [
  { id:'orochimaru_mb',      name:'大蛇丸',                   emoji:'🐍', maxHp:333, isMidBoss:true, color:'#336622', origin:'NARUTO', skillIds:['mb_oro_basic','mb_oro_snake','mb_oro_juuin','mb_oro_hakke'],          intro:'「クックック…面白い。試させてもらうわ」' },
  { id:'pain_mb',            name:'ペイン〈神道〉',            emoji:'🌀', maxHp:320, isMidBoss:true, color:'#440033', origin:'NARUTO', skillIds:['mb_pain_push','mb_pain_pull','mb_pain_rod','mb_pain_chibaku'],          intro:'「苦しみを知らぬ者に平和は守れぬ」' },
  { id:'doflamingo_mb',      name:'ドフラミンゴ',              emoji:'🦩', maxHp:347, isMidBoss:true, color:'#ff88aa', origin:'ONE PIECE', skillIds:['mb_dofu_string','mb_dofu_bird','mb_dofu_cage','mb_dofu_game'],           intro:'「お前たちの運命は俺が決める！」' },
  { id:'katakuri_mb',        name:'カタクリ',                  emoji:'🍩', maxHp:378, isMidBoss:true, color:'#884422', origin:'ONE PIECE', skillIds:['mb_kata_mochi','mb_kata_future','mb_kata_nwc','mb_kata_supreme'],         intro:'「俺の未来視は外れない」' },
  { id:'ulquiorra_mb',       name:'ウルキオラ・シファー',       emoji:'🦇', maxHp:324, isMidBoss:true, color:'#334433', origin:'BLEACH', skillIds:['mb_ulq_lance','mb_ulq_cero','mb_ulq_resurr','mb_ulq_nihil'],             intro:'「心？そんなものは存在しない」' },
  { id:'grimmjow_mb',        name:'グリムジョー',               emoji:'🐆', maxHp:333, isMidBoss:true, color:'#2244aa', origin:'BLEACH', skillIds:['mb_grim_cero','mb_grim_pantera','mb_grim_resurr','mb_grim_desgarron'],    intro:'「俺の相手をしろ！強い奴！」' },
  { id:'akaza_mb',           name:'猗窩座',                    emoji:'❄️', maxHp:360, isMidBoss:true, color:'#8833aa', origin:'鬼滅の刃', skillIds:['mb_aka_fist','mb_aka_kill','mb_aka_regen','mb_aka_super'],                 intro:'「素晴らしい…至高の領域に近い。俺と永遠に戦い続けないか？」' },
  { id:'doma_mb',            name:'童磨',                      emoji:'🪭', maxHp:351, isMidBoss:true, color:'#88cccc', origin:'鬼滅の刃', skillIds:['mb_doma_fan','mb_doma_blizzard','mb_doma_lotus','mb_doma_final'],           intro:'「愛していますよ。皆さんのことを」' },
  { id:'mahito_mb',          name:'真人',                      emoji:'👐', maxHp:315, isMidBoss:true, color:'#445566', origin:'呪術廻戦', skillIds:['mb_mahi_body','mb_mahi_idle','mb_mahi_real','mb_mahi_doom'],                intro:'「呪霊は人の負の感情の塊だよ」' },
  { id:'jogo_mb',            name:'漏瑚',                      emoji:'🌋', maxHp:324, isMidBoss:true, color:'#cc3300', origin:'呪術廻戦', skillIds:['mb_jogo_flame','mb_jogo_lava','mb_jogo_volcano','mb_jogo_max'],             intro:'「死ぬがいい」' },
  { id:'shigaraki_mb',       name:'死柄木弔',                  emoji:'🖐️', maxHp:333, isMidBoss:true, color:'#442233', origin:'僕のヒーローアカデミア', skillIds:['mb_shig_decay','mb_shig_touch','mb_shig_all','mb_shig_regen'],              intro:'「すべてを崩壊させてやる」' },
  { id:'dabi_mb',            name:'荼毘',                      emoji:'💙', maxHp:320, isMidBoss:true, color:'#2244bb', origin:'僕のヒーローアカデミア', skillIds:['mb_dabi_blaze','mb_dabi_jet','mb_dabi_crema','mb_dabi_wall'],               intro:'「俺は荼毘。エンデヴァーの息子だ」' },
  { id:'beast_titan_mb',     name:'獣の巨人',                  emoji:'🦍', maxHp:374, isMidBoss:true, color:'#556644', origin:'進撃の巨人', skillIds:['mb_beast_throw','mb_beast_roar','mb_beast_harden','mb_beast_rain'],          intro:'「実験を続けるとしよう」' },
  { id:'zeref_mb',           name:'ゼレフ',                    emoji:'📖', maxHp:342, isMidBoss:true, color:'#110022', origin:'FAIRY TAIL', skillIds:['mb_zeref_curse','mb_zeref_death','mb_zeref_anck','mb_zeref_grey'],           intro:'「私は長い時間、死を求めてきた」' },
  { id:'chrollo_mb',         name:'クロロ・ルシルフル',         emoji:'✝️', maxHp:329, isMidBoss:true, color:'#221133', origin:'HUNTER×HUNTER', skillIds:['mb_chro_steal','mb_chro_book','mb_chro_skill','mb_chro_combo'],             intro:'「俺は幻影旅団団長、クロロ＝ルシルフル。……その能力、盗ませてもらう」' },
  { id:'neferpitou_mb',      name:'ネフェルピトー',             emoji:'😺', maxHp:351, isMidBoss:true, color:'#cc9922', origin:'HUNTER×HUNTER', skillIds:['mb_nefer_claw','mb_nefer_doctor','mb_nefer_puppet','mb_nefer_terp'],         intro:'「王の敵は、ボクが殺す」' },
  { id:'dante_mb',           name:'ダンテ〈重力〉',             emoji:'😈', maxHp:324, isMidBoss:true, color:'#330011', origin:'ブラッククローバー', skillIds:['mb_dante_devil','mb_dante_body','mb_dante_magic','mb_dante_dark'],           intro:'「悪魔の力は最高だぜ」' },
  { id:'garou_mb',           name:'怪人英雄ガロウ',             emoji:'🐺', maxHp:338, isMidBoss:true, color:'#446688', origin:'ワンパンマン', skillIds:['mb_garou_hunter','mb_garou_copy','mb_garou_roar','mb_garou_cosmic'],         intro:'「俺はモンスターだ！」' },
  { id:'roswaal_mb',         name:'ロズワール・L・メイザース',   emoji:'🤡', maxHp:310, isMidBoss:true, color:'#cc44aa', origin:'Re:ゼロ', skillIds:['mb_ros_fire','mb_ros_thunder','mb_ros_magic','mb_ros_all'],                 intro:'「さぁーて、楽しませてもらおうかなァ〜？」' },
  { id:'diavolo_mb',         name:'ディアボロ',                 emoji:'♠️', maxHp:328, isMidBoss:true, color:'#aa0044', origin:'ジョジョの奇妙な冒険', skillIds:['mb_diav_erase','mb_diav_kq','mb_diav_future','mb_diav_king'],               intro:'「私の過去は消え去る！」' },
  { id:'kira_mb',            name:'吉良吉影',                   emoji:'💣', maxHp:319, isMidBoss:true, color:'#334455', origin:'ジョジョの奇妙な冒険', skillIds:['mb_kira_bite','mb_kira_kq','mb_kira_bomb','mb_kira_bites'],                  intro:'「キラー・クイーンはすでに触れている…」' },
  { id:'heracles_mb',        name:'バーサーカー〈ヘラクレス〉',  emoji:'🪓', maxHp:387, isMidBoss:true, color:'#664422', origin:'Fate/stay night', skillIds:['mb_herc_smash','mb_herc_nine','mb_herc_regen','mb_herc_god'],                intro:'「ォアアアアア！！」' },
  { id:'katana_mb',          name:'刀の悪魔',                   emoji:'🗡️', maxHp:315, isMidBoss:true, color:'#445566', origin:'チェンソーマン', skillIds:['mb_katana_slash','mb_katana_spin','mb_katana_devil','mb_katana_chain'],       intro:'「その斬れ味、見せてやるよ」' },
  { id:'envy_mb',            name:'エンヴィー',                  emoji:'🦎', maxHp:329, isMidBoss:true, color:'#226622', origin:'鋼の錬金術師', skillIds:['mb_envy_fist','mb_envy_shape','mb_envy_giant','mb_envy_hate'],               intro:'「人間なんて反吐が出る」' },
  { id:'wrath_mb',           name:'ラース〈憤怒〉',              emoji:'👁️', maxHp:338, isMidBoss:true, color:'#884422', origin:'鋼の錬金術師', skillIds:['mb_wrath_sword','mb_wrath_pride','mb_wrath_sin','mb_wrath_blade'],            intro:'「私はキング・ブラッドレイ。ホムンクルスの“憤怒（ラース）”だ」' },
  { id:'hendrickson_mb',     name:'ヘンドリクセン',              emoji:'🧪', maxHp:329, isMidBoss:true, color:'#334466', origin:'七つの大罪', skillIds:['mb_hend_acid','mb_hend_blood','mb_hend_grey','mb_hend_death'],               intro:'「真の力を見せてやろう」' },
  { id:'clayman_mb',         name:'クレイマン',                  emoji:'🪢', maxHp:320, isMidBoss:true, color:'#553322', origin:'転生したらスライムだった件', skillIds:['mb_clay_puppet','mb_clay_chain','mb_clay_master','mb_clay_curse'],            intro:'「おやおや、このクレイマンに逆らうとは……愚かなことだ」' },
  { id:'furuta_mb',          name:'旧多二福',                    emoji:'🃏', maxHp:317, isMidBoss:true, color:'#443322', origin:'東京喰種', skillIds:['mb_furu_kagune','mb_furu_plan','mb_furu_v','mb_furu_clown'],                  intro:'「世界を変えてやるよ。俺が」' },
  { id:'walpurgis_mb',       name:'ワルプルギスの夜',            emoji:'🎭', maxHp:369, isMidBoss:true, color:'#220033', origin:'魔法少女まどか☆マギカ', skillIds:['mb_walp_gear','mb_walp_cannon','mb_walp_storm','mb_walp_despair'],            intro:'「……（無言の絶望）」' }
];

// ============================================================
// ENEMY SKILL DATA (normal + boss)
// ============================================================
const ENEMY_SKILL_DATA = {
  // ---- Normal enemy skills (55) ----
  e_call_ally:    { name:'仲間を呼ぶ',   icon:'📣', power:0,   type:'summon',   target:'self',   animation:'buff' },
  e_slash:        { name:'斬撃',         icon:'⚔️', power:11,  type:'physical', target:'single', hits:1, animation:'slash' },
  e_dark_wave:    { name:'暗黒波',       icon:'🌑', power:15,  type:'magic',    target:'single', hits:1, animation:'dark' },
  e_power_up:     { name:'戦気高揚',     icon:'⬆️', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  e_beam:         { name:'デスビーム',   icon:'💥', power:14,  type:'magic',    target:'single', hits:1, animation:'beam' },
  e_missile:      { name:'ミサイル',     icon:'🚀', power:22, type:'physical', target:'single', hits:1, animation:'slash' },
  e_laser:        { name:'レーザー',     icon:'🔴', power:17, type:'magic',    target:'all',    hits:1, animation:'beam' },
  e_repair:       { name:'自己修復',     icon:'🔧', power:0,   type:'heal',     target:'self',   healPower:20,  animation:'heal' },
  e_fire_breath:  { name:'ファイアブレス',icon:'🔥',power:14,  type:'magic',    target:'all',    effect:'burn', effectChance:1, effectTurns:2, animation:'explosion' },
  e_tail_sweep:   { name:'テールスイープ',icon:'💨',power:14,  type:'physical', target:'all',    hits:1, animation:'slash' },
  e_roar:         { name:'咆哮',         icon:'📢', power:0,   type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:2, animation:'dark' },
  e_blood_art:    { name:'血鬼術',       icon:'🩸', power:17, type:'magic',    target:'single', hits:1, animation:'dark' },
  e_regen:        { name:'再生',         icon:'💚', power:0,   type:'support',  target:'self',   effect:'regen', effectChance:1, effectTurns:2, animation:'heal' },
  e_poison_bite:  { name:'毒牙',         icon:'☠️', power:9,  type:'physical', target:'single', effect:'poison', effectChance:1, effectTurns:3, animation:'slash' },
  e_curse:        { name:'呪い',         icon:'🔮', power:0,   type:'support',  target:'all',    effect:'curse', effectChance:1, effectTurns:2, animation:'dark' },
  e_heavy_blow:   { name:'強打',         icon:'💪', power:19, type:'physical', target:'single', hits:1, animation:'punch' },
  e_war_cry:      { name:'雄叫び',       icon:'📣', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:2, animation:'buff' },
  e_ice_shard:    { name:'氷の矢',       icon:'🧊', power:15,  type:'magic',    target:'single', hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:1 },
  e_blizzard_e:   { name:'吹雪',         icon:'🌨️', power:11,  type:'magic',    target:'all',    effect:'freeze', effectChance:1, effectTurns:2, animation:'ice' },
  e_slow:         { name:'スロウ',       icon:'🐢', power:0,   type:'support',  target:'all',    effect:'freeze', effectChance:1, effectTurns:2, animation:'ice' },
  e_thunder_fang: { name:'雷牙',         icon:'⚡', power:13,  type:'magic',    target:'single', effect:'paralyze', effectChance:1, effectTurns:2, animation:'thunder' },
  e_water_blast:  { name:'水撃',         icon:'💧', power:15,  type:'magic',    target:'single', hits:1, animation:'ice' },
  e_holy_strike:  { name:'聖撃',         icon:'✨', power:15,  type:'magic',    target:'single', hits:1, animation:'beam' },
  e_light_bind:   { name:'光の拘束',     icon:'🔗', power:0,   type:'support',  target:'single', effect:'stun', effectChance:1, effectTurns:1, animation:'buff' },
  e_dark_arrow:   { name:'闇の矢',       icon:'🌑', power:14,  type:'magic',    target:'single', hits:1, animation:'dark' },
  e_stone_fist:   { name:'石の拳',       icon:'🪨', power:20, type:'physical', target:'single', hits:1, animation:'punch', selfShieldPower:20 },
  e_fire_slash:   { name:'炎斬り',       icon:'🔥', power:12,  type:'physical', target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  e_water_breath: { name:'水の息吹',     icon:'🌊', power:16,  type:'magic',    target:'all',    hits:1, animation:'ice' },
  e_demon_claws:  { name:'魔獣の爪',     icon:'🐾', power:21, type:'physical', target:'single', hits:1, animation:'slash', effect:'poison', effectChance:1, effectTurns:2 },
  e_light_guard:  { name:'光の障壁',     icon:'🛡️', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:20, effectChance:1, animation:'buff' },
  e_supp_heal:    { name:'仲間を癒す',   icon:'💚', power:0,   type:'heal',    target:'all_enemy', healPower:28,  animation:'heal' },
  e_team_buff:    { name:'士気高揚',     icon:'⬆️', power:0,   type:'support', target:'all_enemy', effect:'atk_up', effectChance:1, effectTurns:2, animation:'buff' },
  e_supp_shield:  { name:'仲間を守る',   icon:'🛡️', power:0,   type:'support', target:'all_enemy', effect:'shield', shieldPower:20, effectChance:1, animation:'buff' },
  e_shield_self:  { name:'防御構え',     icon:'🛡️', power:0,   type:'support', target:'self',      effect:'shield', shieldPower:25, effectChance:1, animation:'buff' },
  e_shadow_stab:   { name:'影の刺突',     icon:'🌑', power:16,  type:'physical', target:'single', hits:1, animation:'slash' },
  e_bone_blast:    { name:'骨の爆発',     icon:'💀', power:12,  type:'physical', target:'all',    hits:1, animation:'explosion' },
  e_lava_fist:     { name:'溶岩拳',       icon:'🌋', power:16,  type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  e_thunder_lance: { name:'雷の槍',       icon:'⚡', power:14,  type:'magic',    target:'single', hits:1, animation:'thunder',   effect:'paralyze', effectChance:1, effectTurns:2 },
  e_hellfire_e:    { name:'地獄の炎',     icon:'🔥', power:12,  type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  e_crystal_spike: { name:'水晶の刺',     icon:'💎', power:15,  type:'physical', target:'single', hits:1, animation:'slash', selfShieldPower:25 },
  e_venom_spit:    { name:'毒液',         icon:'☠️', power:10,  type:'physical', target:'single', hits:1, animation:'slash',     effect:'poison', effectChance:1, effectTurns:3 },
  e_death_scythe:  { name:'死神の鎌',     icon:'💀', power:19, type:'physical', target:'single', hits:1, animation:'slash' },
  e_chaos_breath_e:{ name:'混沌の息吹',   icon:'🌀', power:16,  type:'magic',    target:'all',    hits:1, animation:'dark' },
  e_soul_drain:    { name:'魂吸収',       icon:'💜', power:15,  type:'magic',    target:'single', hits:1, animation:'dark',      healSelf:0.4, selfShieldPower:20 },
  e_iron_pound:    { name:'鉄拳',         icon:'👊', power:21, type:'physical', target:'single', hits:1, animation:'punch', selfShieldPower:30 },
  e_frost_blast:   { name:'霜撃',         icon:'🧊', power:15,  type:'magic',    target:'single', hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:1 },
  e_venom_coil:    { name:'毒の締め付け', icon:'🐍', power:11,  type:'physical', target:'single', hits:1, animation:'slash',     effect:'poison', effectChance:1, effectTurns:3 },
  e_abyss_slash:   { name:'深淵斬',       icon:'🌑', power:17, type:'magic',    target:'single', hits:1, animation:'dark', selfShieldPower:20 },
  e_plague_cloud:  { name:'疫病雲',       icon:'🎭', power:0,   type:'support',  target:'all',    effect:'poison', effectChance:1, effectTurns:2, animation:'dark' },
  e_shadow_strike: { name:'影打ち',       icon:'🌑', power:24, type:'physical', target:'single', hits:1, animation:'slash' },
  e_blood_art_2:   { name:'血鬼術改',     icon:'🩸', power:18, type:'magic',    target:'single', hits:1, animation:'dark' },
  e_earth_smash:   { name:'大地砕き',     icon:'🗻', power:16,  type:'physical', target:'all',    hits:1, animation:'slash' },
  e_void_drain:    { name:'虚無吸収',     icon:'👁️', power:14,  type:'magic',    target:'single', hits:1, animation:'dark',      healSelf:0.35, selfShieldPower:15 },
  e_demon_blade:   { name:'魔刃',         icon:'⚔️', power:18, type:'physical', target:'single', hits:1, animation:'slash' },
  e_cursed_slash:  { name:'呪斬',         icon:'💜', power:13,  type:'physical', target:'single', hits:1, animation:'dark',      effect:'curse', effectChance:1, effectTurns:2 },

  // ---- Charge skills: fire after chargeTurns, cancelled by defeat/stun (3) ----
  e_charge_cannon:   { name:'フルチャージ砲', icon:'🔋', power:40, type:'magic', target:'all', hits:1, animation:'beam',      noSpread:true, chargeTurns:1 },
  e_charge_eruption: { name:'大噴火',        icon:'🌋', power:44, type:'magic', target:'all', hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  e_charge_abyss:    { name:'終焉の息吹',    icon:'🌀', power:42, type:'magic', target:'all', hits:1, animation:'dark',      noSpread:true, chargeTurns:1 },

  // ---- Boss skills (125) -- chargeTurns:1 = boss trump card (HP<=60% trigger) ----
  b_death_beam:      { name:'デスビーム',          icon:'💜', power:24, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_nova_strike:     { name:'スーパーノヴァ',     icon:'💥', power:26, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  b_transform:       { name:'100%パワー解放',       icon:'💎', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_100percent:      { name:'デス・ボール',         icon:'✨', power:38, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_susanoo:         { name:'須佐能乎',             icon:'👁️', power:50, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_susanoo_armor:   { name:'須佐能乎・完成体',     icon:'🛡️', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:70, effectChance:1, animation:'buff' },
  b_mutsuki:         { name:'月読',                 icon:'🌙', power:35, type:'magic',    target:'single', hits:1, animation:'dark',  effect:'stun', effectChance:1, effectTurns:1 },
  b_meteor:          { name:'地爆天星',               icon:'☄️', power:38, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_rinnegan:        { name:'輪廻眼引力',           icon:'🌀', power:33, type:'magic',    target:'single', effect:'def_down', effectChance:1, effectTurns:2, animation:'dark' },
  b_boro_breath:     { name:'ボロブレス',           icon:'🔥', power:22, type:'magic',    target:'all',    effect:'burn', effectChance:1, effectTurns:2, animation:'explosion' },
  b_thunder_bagua:   { name:'雷鳴八卦',             icon:'⚡', power:32, type:'magic',    target:'single', hits:1, animation:'thunder' },
  b_kaido_form:      { name:'百獣形態',             icon:'🐲', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  b_bolo_breath:     { name:'大威徳雷鳴八卦',         icon:'💥', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_blizzard:        { name:'マヒャデドス',         icon:'🧊', power:20, type:'magic',    target:'all',    effect:'freeze', effectChance:1, effectTurns:2, animation:'ice' },
  b_dark_all:        { name:'痛恨の一撃',           icon:'🌑', power:35, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_maou_barrier:    { name:'魔王のバリア',         icon:'🛡️', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:70, effectChance:1, animation:'buff' },
  b_collapsing_star: { name:'エナジー弾',           icon:'⭐', power:35, type:'magic',    target:'single', hits:1, animation:'explosion' },
  b_meteoric_burst:  { name:'メテオリックバースト', icon:'☄️', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  b_regen_boss:      { name:'再生能力',             icon:'💚', power:0,   type:'support',  target:'self',   effect:'regen', effectChance:1, effectTurns:2, animation:'heal' },
  b_boros_barrage:   { name:'エナジー乱射',         icon:'⭐', power:30, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  b_galaxy_burst:    { name:'崩星咆哮砲',         icon:'🌌', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_road_roller:     { name:'ロードローラーだッ！', icon:'🚛', power:60, type:'physical', target:'single', hits:1, animation:'explosion', effect:'stun', effectChance:1, effectTurns:1, chargeTurns:1 },
  b_time_stop_boss:  { name:'ザ・ワールド！時よ止まれ',icon:'⏱️',power:23,type:'physical', target:'single', hits:1, animation:'slash', effect:'stun', effectChance:1, effectTurns:1 },
  b_knife_barrage:   { name:'ナイフ乱投',           icon:'🔪', power:23, type:'physical', target:'all',    hits:1, animation:'slash' },
  b_wryyy:           { name:'無駄無駄ラッシュ',     icon:'👊', power:33, type:'physical', target:'single', hits:1, animation:'punch' },
  b_moon_breathing:  { name:'月の呼吸',             icon:'🌙', power:28, type:'physical', target:'single', hits:1, animation:'slash' },
  b_moon_crescent:   { name:'月の十六夜',           icon:'🌔', power:24, type:'physical', target:'all',    hits:1, animation:'slash' },
  b_koku_regen:      { name:'鬼の再生',             icon:'💚', power:0,   type:'support',  target:'self',   effect:'regen', effectChance:1, effectTurns:2, animation:'heal' },
  b_infinite_slashes:{ name:'無限斬撃',             icon:'⚔️', power:38, type:'physical', target:'all',    hits:1, animation:'slash', noSpread:true, chargeTurns:1 },
  b_dark_trident:    { name:'魔のトライデント',     icon:'🔱', power:26, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_phantom_ganon:   { name:'幻のガノン',           icon:'👻', power:24, type:'magic',    target:'all',    hits:1, animation:'dark' },
  b_ganon_barrier:   { name:'闇のバリア',           icon:'🛡️', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:65, effectChance:1, animation:'buff' },
  b_beast_ganon:     { name:'ビーストガノン',       icon:'🗡️', power:38, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_cell_beam:          { name:'セルビーム',         icon:'💚', power:25, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_cell_kamehame:      { name:'フルパワーかめはめ波',icon:'💥', power:30, type:'magic',   target:'all',    hits:1, animation:'explosion' },
  b_cell_regen:         { name:'細胞再生',           icon:'💚', power:0,   type:'support',  target:'self',   effect:'regen', effectChance:1, effectTurns:2, animation:'heal' },
  b_cell_perfect:       { name:'パーフェクトパワー', icon:'⬆️', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_demon_commandment:  { name:'嘆息の賢人',         icon:'👑', power:25, type:'magic',    target:'all',    hits:1, animation:'dark', effect:'atk_down', effectChance:1, effectTurns:2 },
  b_demon_curse:        { name:'呪いの刃',           icon:'🩸', power:22, type:'magic',    target:'single', hits:1, animation:'dark', effect:'curse', effectChance:1, effectTurns:2 },
  b_demon_true:         { name:'真の姿',             icon:'😈', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_demon_black:        { name:'獄炎（ヘルブレイズ）',             icon:'🔥', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, effect:'burn', effectChance:1, effectTurns:2, chargeTurns:1 },
  b_gil_treasury:       { name:'王の財宝',           icon:'⭐', power:27, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  b_gil_ea:             { name:'乖離剣・エア', icon:'🌪️', power:33, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_gil_aura:           { name:'黄金のオーラ',       icon:'💛', power:0,   type:'support',  target:'self',   effect:'def_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'atk_up' },
  b_gil_enuma:          { name:'天地乖離す開闢の星（エヌマ・エリシュ）',       icon:'💥', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_cell_solar:         { name:'太陽系破壊かめはめ波', icon:'☀️', power:38, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_zoma_zero:          { name:'絶対零度',           icon:'❄️', power:38, type:'magic',    target:'all',    hits:1, animation:'ice',       noSpread:true, effect:'freeze', effectChance:1, effectTurns:2, chargeTurns:1 },
  b_zoma_dispel:        { name:'いてつくはどう',     icon:'🌀', power:0,   type:'support',  target:'all',    effect:'dispel', effectChance:1, animation:'dark' },
  b_muzan_cells:      { name:'細胞分裂突撃',   icon:'🩸', power:26, type:'physical', target:'single', hits:1, animation:'slash', selfShieldPower:25 },
  b_muzan_aura:       { name:'鬼の覇気',       icon:'👑', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_muzan_whip:       { name:'細胞の鞭',       icon:'🩸', power:20, type:'physical', target:'all',    hits:1, animation:'slash',     effect:'atk_down', effectChance:1, effectTurns:2 },
  b_muzan_final:      { name:'鬼始祖の怒り',   icon:'💀', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, effect:'curse', effectChance:1, effectTurns:2, chargeTurns:1 },
  b_kaguya_byakugan:  { name:'白眼',       icon:'👁️', power:42, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_kaguya_gravity:   { name:'天之御中',     icon:'🌌', power:0,   type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:2, animation:'dark' },
  b_kaguya_truth:     { name:'真実の求道玉',   icon:'⚫', power:48, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_kaguya_yomotsu:   { name:'黄泉比良坂',       icon:'🌑', power:72, type:'magic',    target:'single', hits:1, animation:'dark',      effect:'stun', effectChance:1, effectTurns:1, chargeTurns:1 },
  b_meruem_strike:    { name:'王の一撃',       icon:'👊', power:43, type:'physical', target:'single', hits:1, animation:'slash' },
  b_meruem_aura:      { name:'絶大な覇気',     icon:'👑', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_meruem_nen:       { name:'絶対王の腕',         icon:'🌑', power:47, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_meruem_coil:      { name:'蟻王の支配',     icon:'🐜', power:66, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'stun', effectChance:1, effectTurns:1, chargeTurns:1 },
  b_aizen_kyoka:      { name:'鏡花水月',       icon:'🌸', power:0,   type:'support',  target:'all',    effect:'dispel', effectChance:1, animation:'dark' },
  b_aizen_light:      { name:'黒棺',           icon:'🌑', power:40, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_aizen_goryu:      { name:'破道の九十九・五龍転滅', icon:'🐉', power:35, type:'magic', target:'all', hits:1, animation:'explosion' },
  b_aizen_transcend:  { name:'超越者の力',     icon:'💫', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_aizen_hogyoku:    { name:'崩玉覚醒',       icon:'💠', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_aizen_shield:     { name:'崩玉の加護',     icon:'💠', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:65, effectChance:1, animation:'buff' },
  b_acnologia_roar:   { name:'竜の咆哮',       icon:'🐉', power:29, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  b_acnologia_dark:   { name:'闇竜の吐息',     icon:'🌑', power:28, type:'magic',    target:'single', hits:1, animation:'dark',      effect:'atk_down', effectChance:1, effectTurns:2 },
  b_acnologia_temporal:{ name:'魔竜の轟音',  icon:'⏱️', power:24, type:'magic',    target:'single', hits:1, animation:'dark',  effect:'stun', effectChance:1, effectTurns:1 },
  b_acnologia_pulse:  { name:'魔力の波動',     icon:'💥', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_yhwach_almighty:  { name:'全知全能',       icon:'✨', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_yhwach_heilig:    { name:'聖矢',           icon:'🏹', power:26, type:'magic',    target:'all',    hits:1, animation:'beam' },
  b_yhwach_schrift:   { name:'聖文字・拒絶',      icon:'📖', power:29, type:'magic',    target:'single', hits:1, animation:'dark',      effect:'def_down', effectChance:1, effectTurns:2 },
  b_yhwach_reishi:    { name:'霊子吸収',       icon:'💜', power:46, type:'magic',    target:'all',    hits:1, animation:'explosion', healSelf:0.25, noSpread:true, chargeTurns:1 },
  b_vel_strike:       { name:'星王の一撃',     icon:'⚡', power:29, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_vel_creation:     { name:'創造の奇跡',     icon:'✨', power:0,   type:'heal',     target:'self',   healPower:55,  animation:'heal' },
  b_vel_annihilate:   { name:'消滅の波動',     icon:'🌌', power:35, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  b_vel_god:          { name:'神の怒り',       icon:'💥', power:72, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'stun', effectChance:1, effectTurns:1, chargeTurns:1 },
  b_afo_steal:      { name:'個性強奪',         icon:'🖤', power:20, type:'magic',    target:'single', hits:1, animation:'dark',      effect:'atk_down', effectChance:1, effectTurns:2 },
  b_afo_roar:       { name:'衝撃波',           icon:'💥', power:26, type:'physical', target:'all',    hits:1, animation:'explosion' },
  b_afo_impact:     { name:'個性複合',         icon:'😤', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_afo_almight:    { name:'オール・フォー・ワン解放',icon:'🖤',power:42, type:'magic', target:'all',  hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_ken_curse:      { name:'呪術乱用',         icon:'🧠', power:20, type:'magic',    target:'single', hits:1, animation:'dark',      effect:'curse', effectChance:1, effectTurns:2 },
  b_ken_brain:      { name:'脳縫合',           icon:'🧠', power:22, type:'magic',    target:'single', hits:1, animation:'dark',  effect:'stun', effectChance:1, effectTurns:1 },
  b_ken_heian:      { name:'平安の呪術',       icon:'🌑', power:30, type:'magic',    target:'all',    hits:1, animation:'dark' },
  b_ken_merging:    { name:'器の融合',         icon:'💥', power:38, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, effect:'curse', effectChance:1, effectTurns:2, chargeTurns:1 },
  b_zen_bone:       { name:'骨の魔法',         icon:'💀', power:25, type:'physical', target:'single', hits:1, animation:'slash' },
  b_zen_skeleton:   { name:'骨の包囲',         icon:'💀', power:22, type:'physical', target:'all',    hits:1, animation:'slash' },
  b_zen_bone_shield:{ name:'骨の防壁',         icon:'🛡️', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:55, effectChance:1, animation:'buff' },
  b_zen_devil:      { name:'空間魔法',         icon:'😈', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_zen_almighty:   { name:'無間骨牙',       icon:'💥', power:38, type:'physical', target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_sat_shadow:     { name:'嫉妬の影',         icon:'🌑', power:46, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_sat_embrace:    { name:'魔女の抱擁',       icon:'🌑', power:0,   type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:2, animation:'dark' },
  b_sat_jealousy:   { name:'嫉妬の嵐',        icon:'🌑', power:40, type:'magic',    target:'single', hits:1, animation:'dark',      effect:'stun', effectChance:1, effectTurns:1 },
  b_sat_witch:      { name:'嫉妬の魔女・解放', icon:'💥', power:46, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, effect:'atk_down', effectChance:1, effectTurns:2, chargeTurns:1 },
  b_bb_quake:       { name:'グラグラの実',     icon:'🌊', power:24, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'stun', effectChance:1, effectTurns:1 },
  b_bb_dark:        { name:'ヤミヤミの実',     icon:'🌑', power:25, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_bb_darkness:    { name:'闇の引力',         icon:'🌑', power:23, type:'magic',    target:'all',    hits:1, animation:'dark',      effect:'atk_down', effectChance:1, effectTurns:2 },
  b_bb_tsunami:     { name:'震撃津波',         icon:'💥', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_heath_holy:     { name:'神聖剣',           icon:'✝️', power:42, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_heath_shield:   { name:'絶対防御',         icon:'🛡️', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:80, effectChance:1, animation:'buff' },
  b_heath_sword:    { name:'神聖剣連撃',       icon:'⚔️', power:48, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_heath_god:      { name:'デスゲームの始まり',         icon:'💥', power:60, type:'magic',    target:'single', hits:1, animation:'explosion', chargeTurns:1 },
  b_pucci_disc:     { name:'記憶ディスク',     icon:'💿', power:0,   type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:2, animation:'dark' },
  b_pucci_accel:    { name:'時間加速',         icon:'⏩', power:27, type:'magic',    target:'all',    hits:1, animation:'beam' },
  b_pucci_made:     { name:'メイド・イン・ヘブン',icon:'🌀',power:0,  type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_pucci_time:     { name:'加速の一撃',       icon:'⏩', power:35, type:'magic',    target:'single', hits:1, animation:'beam' },
  b_pucci_heaven:   { name:'天国への扉',       icon:'💥', power:46, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },
  b_darkdev_fear:   { name:'恐怖の具現',       icon:'😱', power:19,  type:'magic',    target:'all',    hits:1, animation:'dark',      effect:'atk_down', effectChance:1, effectTurns:2 },
  b_darkdev_crush:  { name:'闇の圧殺',         icon:'🌑', power:28, type:'magic',    target:'single', hits:1, animation:'dark' },
  b_darkdev_blade:  { name:'闇刃',             icon:'🗡️', power:24, type:'physical', target:'single', hits:1, animation:'slash' },
  b_darkdev_despair:{ name:'絶望の具現化',     icon:'💥', power:42, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, effect:'atk_down', effectChance:1, effectTurns:2, chargeTurns:1 },
  b_esta_love:      { name:'慈愛の戒禁',         icon:'🖤', power:25, type:'physical', target:'single', hits:1, animation:'slash' },
  b_esta_repose:    { name:'安息',             icon:'🖤', power:0,   type:'support',  target:'self',   effect:'def_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'atk_up' },
  b_esta_cross:     { name:'十字炎',           icon:'🔥', power:29, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  b_esta_full:      { name:'慈愛の業炎・全開',     icon:'💥', power:38, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, effect:'burn', effectChance:1, effectTurns:2, chargeTurns:1 },
  b_father_eat:     { name:'人間を喰らう',     icon:'✨', power:26, type:'magic',    target:'single', hits:1, animation:'beam',      healSelf:0.3 },
  b_father_god:     { name:'神の器',           icon:'✨', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  b_father_truth:   { name:'無からの創造',         icon:'⬜', power:31, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  b_father_light:   { name:'神の力・解放',     icon:'💥', power:46, type:'magic',    target:'all',    hits:1, animation:'explosion', noSpread:true, chargeTurns:1 },

  // ---- Mid-boss skills (116) ----
  mb_oro_basic:     { name:'大蛇の牙',         icon:'🐍', power:18,  type:'physical', target:'single', hits:1, animation:'slash' },
  mb_oro_snake:     { name:'潜影多蛇手',   icon:'🐍', power:20, type:'magic',    target:'single', hits:1, animation:'dark',      effect:'poison', effectChance:1, effectTurns:2 },
  mb_oro_juuin:     { name:'呪印術',           icon:'🌑', power:0,   type:'support',  target:'all',    effect:'dispel', effectChance:1, animation:'dark' },
  mb_oro_hakke:     { name:'口寄せ・三重羅生門',       icon:'💥', power:29, type:'magic',    target:'single', hits:1, animation:'dark' },
  mb_pain_push:     { name:'万象天引',         icon:'🌀', power:19,  type:'magic',    target:'single', hits:1, animation:'beam' },
  mb_pain_pull:     { name:'神羅天征',         icon:'🌀', power:0,   type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:2, animation:'dark' },
  mb_pain_rod:      { name:'黒の受信器',       icon:'🔱', power:17,  type:'physical', target:'single', hits:1, animation:'slash',   effect:'stun', effectChance:1, effectTurns:1 },
  mb_pain_chibaku:  { name:'地爆天星',         icon:'💥', power:28, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_dofu_string:   { name:'糸切断',           icon:'🦩', power:18,  type:'physical', target:'single', hits:1, animation:'slash' },
  mb_dofu_bird:     { name:'パラサイト',             icon:'🦩', power:0,   type:'support',  target:'all',    effect:'dispel', effectChance:1, animation:'dark' },
  mb_dofu_cage:     { name:'バードケージ',      icon:'💥', power:22, type:'physical', target:'all',    hits:1, animation:'slash', selfShieldPower:30 },
  mb_dofu_game:     { name:'命がけのゲーム',   icon:'💥', power:28, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_kata_mochi:    { name:'加々身モチ',         icon:'🍩', power:19,  type:'physical', target:'single', hits:1, animation:'slash', selfShieldPower:30 },
  mb_kata_future:   { name:'未来視',           icon:'👁️', power:0,   type:'support',  target:'self',   effect:'def_up', effectChance:1, effectTurns:3, animation:'buff' },
  mb_kata_nwc:      { name:'無双ドーナツ', icon:'🍩', power:20, type:'physical', target:'single', hits:1, animation:'slash',   effect:'stun', effectChance:1, effectTurns:1 },
  mb_kata_supreme:  { name:'鏡餅・完全体',     icon:'💥', power:29, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_ulq_lance:     { name:'ランサ・デル・レランパーゴ',icon:'🦇',power:22,type:'magic', target:'single', hits:1, animation:'dark' },
  mb_ulq_cero:      { name:'グラン・レイ・セロ', icon:'🌑',power:20, type:'magic',   target:'all',    hits:1, animation:'dark' },
  mb_ulq_resurr:    { name:'黒翼大魔',          icon:'🦇', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up', selfShieldPower:40 },
  mb_ulq_nihil:     { name:'虚無の力',         icon:'💥', power:29, type:'magic',    target:'single', hits:1, animation:'explosion' },
  mb_grim_cero:     { name:'セロ',             icon:'🐆', power:19,  type:'magic',    target:'single', hits:1, animation:'beam' },
  mb_grim_pantera:  { name:'パンテラ・復活',   icon:'🐆', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_grim_resurr:   { name:'ガラ・デ・ラ・パンテラ',           icon:'🐆', power:23, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_grim_desgarron:{ name:'デスガロン',       icon:'💥', power:29, type:'physical', target:'all',    hits:1, animation:'explosion' },
  mb_aka_fist:      { name:'破壊殺・空式',     icon:'🌸', power:20, type:'physical', target:'single', hits:1, animation:'slash', selfShieldPower:20 },
  mb_aka_kill:      { name:'破壊殺・乱式',     icon:'🌸', power:24, type:'physical', target:'single', hits:1, animation:'slash', selfShieldPower:20 },
  mb_aka_regen:     { name:'鬼の再生',         icon:'💚', power:0,   type:'support',  target:'self',   effect:'regen', effectChance:1, effectTurns:2, animation:'heal' },
  mb_aka_super:     { name:'破壊殺・滅式',     icon:'💥', power:29, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_doma_fan:      { name:'蓮葉氷',           icon:'🧊', power:18,  type:'magic',    target:'single', hits:1, animation:'ice', effect:'freeze', effectChance:1, effectTurns:1 },
  mb_doma_blizzard: { name:'冬ざれ氷柱',         icon:'🧊', power:18,  type:'magic',    target:'all',    hits:1, animation:'ice',       effect:'freeze', effectChance:1, effectTurns:2 },
  mb_doma_lotus:    { name:'蔓蓮華',       icon:'🌺', power:17,  type:'magic',    target:'single', hits:1, animation:'ice',   effect:'stun', effectChance:1, effectTurns:1 },
  mb_doma_final:    { name:'睡蓮菩薩',     icon:'💥', power:29, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_mahi_body:     { name:'無為転変',         icon:'👐', power:19,  type:'physical', target:'single', hits:1, animation:'slash' },
  mb_mahi_idle:     { name:'魂の形状変化',     icon:'👐', power:19,  type:'magic',    target:'single', hits:1, animation:'dark',      effect:'atk_down', effectChance:1, effectTurns:2 },
  mb_mahi_real:     { name:'真の肉体改造',     icon:'👐', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_mahi_doom:     { name:'自閉円頓遮',           icon:'💥', power:29, type:'magic',    target:'single', hits:1, animation:'explosion' },
  mb_jogo_flame:    { name:'炎の弾',           icon:'🌋', power:15,  type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  mb_jogo_lava:     { name:'マグマ爆発',       icon:'🌋', power:19,  type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  mb_jogo_volcano:  { name:'火山の誕生',       icon:'🌋', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  mb_jogo_max:      { name:'蓋棺鉄囲山',       icon:'💥', power:29, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_shig_decay:    { name:'崩壊',             icon:'🖐️', power:22, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_shig_touch:    { name:'五指の崩壊',         icon:'🖐️', power:0,   type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:2, animation:'dark' },
  mb_shig_all:      { name:'全崩壊',           icon:'💥', power:24, type:'physical', target:'all',    hits:1, animation:'explosion' },
  mb_shig_regen:    { name:'超再生',         icon:'💚', power:0,   type:'support',  target:'self',   effect:'regen', effectChance:1, effectTurns:2, animation:'heal' },
  mb_dabi_blaze:    { name:'荼毘の炎',         icon:'🔥', power:15,  type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  mb_dabi_jet:      { name:'蒼炎噴射',     icon:'🔥', power:19,  type:'magic',    target:'all',    hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  mb_dabi_crema:    { name:'クレマトリウム',   icon:'🔥', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  mb_dabi_wall:     { name:'青白い炎の壁',     icon:'💥', power:29, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_beast_throw:   { name:'岩石投擲',         icon:'🦍', power:30, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_beast_roar:    { name:'雄叫び',           icon:'📢', power:0,   type:'support',  target:'all',    effect:'def_down', effectChance:1, effectTurns:2, animation:'dark' },
  mb_beast_harden:  { name:'硬化',             icon:'🛡️', power:0,   type:'support',  target:'self',   effect:'shield', shieldPower:50, effectChance:1, animation:'buff' },
  mb_beast_rain:    { name:'石の雨',           icon:'💥', power:29, type:'physical', target:'all',    hits:1, animation:'explosion' },
  mb_zeref_curse:   { name:'死の呪い',         icon:'📖', power:17,  type:'magic',    target:'single', hits:1, animation:'dark',      effect:'curse', effectChance:1, effectTurns:2 },
  mb_zeref_death:   { name:'死の波動',         icon:'🌑', power:24, type:'magic',    target:'all',    hits:1, animation:'dark' },
  mb_zeref_anck:    { name:'アンクセラム',     icon:'📖', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_zeref_grey:    { name:'破滅の黒魔法',         icon:'💥', power:29, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_chro_steal:    { name:'盗賊の極意',     icon:'✝️', power:16,  type:'physical', target:'single', hits:1, animation:'slash',   effect:'atk_down', effectChance:1, effectTurns:2 },
  mb_chro_book:     { name:'栞のテーマ',       icon:'📕', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', selfShieldPower:25 },
  mb_chro_skill:    { name:'盗んだ念能力',     icon:'✝️', power:24, type:'magic',    target:'single', hits:1, animation:'dark' },
  mb_chro_combo:    { name:'団長の全力',       icon:'💥', power:29, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_nefer_claw:    { name:'恐怖の爪',         icon:'😺', power:21, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_nefer_doctor:  { name:'ドクターブライス',   icon:'😺', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up', selfShieldPower:30 },
  mb_nefer_puppet:  { name:'傀儡操作',         icon:'🐱', power:0,   type:'support',  target:'all',    effect:'atk_down', effectChance:1, effectTurns:2, animation:'dark' },
  mb_nefer_terp:    { name:'テレプシコーラ全力', icon:'💥', power:30, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_dante_devil:   { name:'悪魔の力',         icon:'😈', power:20, type:'magic',    target:'single', hits:1, animation:'dark' },
  mb_dante_body:    { name:'肉体魔法',         icon:'😈', power:0,   type:'support',  target:'self',   effect:'def_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'atk_up' },
  mb_dante_magic:   { name:'重力魔法',         icon:'🌑', power:23, type:'magic',    target:'all',    hits:1, animation:'dark' },
  mb_dante_dark:    { name:'重力崩壊・全開',       icon:'💥', power:29, type:'magic',    target:'single', hits:1, animation:'explosion' },
  mb_garou_hunter:  { name:'英雄狩り',         icon:'🐺', power:20, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_garou_copy:    { name:'模倣格闘',         icon:'🐺', power:22, type:'physical', target:'single', hits:1, animation:'punch' },
  mb_garou_roar:    { name:'流水岩砕拳',       icon:'📢', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  mb_garou_cosmic:  { name:'宇宙的恐怖',       icon:'💥', power:29, type:'physical', target:'all',    hits:1, animation:'explosion' },
  mb_ros_fire:      { name:'爆炎の号砲',           icon:'🔥', power:16,  type:'magic',    target:'single', hits:1, animation:'explosion', effect:'burn', effectChance:1, effectTurns:2 },
  mb_ros_thunder:   { name:'雷光乱撃',           icon:'⚡', power:18,  type:'magic',    target:'single', hits:1, animation:'thunder',  effect:'stun', effectChance:1, effectTurns:1 },
  mb_ros_magic:     { name:'六色魔導',         icon:'🤡', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  mb_ros_all:       { name:'森羅万象・全開放',       icon:'💥', power:28, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_diav_erase:    { name:'時間消去',         icon:'♠️', power:18,  type:'physical', target:'single', hits:1, animation:'slash', effect:'stun', effectChance:1, effectTurns:1 },
  mb_diav_kq:       { name:'キングクリムゾン',  icon:'♠️', power:24, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_diav_future:   { name:'エピタフの一撃',     icon:'👁️', power:22, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_diav_king:     { name:'王の全力',         icon:'💥', power:29, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_kira_bite:     { name:'シアーハートアタック',icon:'💣',power:21, type:'magic',   target:'single', hits:1, animation:'explosion' },
  mb_kira_kq:       { name:'キラークイーン',   icon:'💣', power:19,  type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_kira_bomb:     { name:'コイン爆弾',         icon:'💥', power:23, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_kira_bites:    { name:'バイツァ・ダスト',  icon:'💥', power:29, type:'magic',    target:'single', hits:1, animation:'explosion' },
  mb_herc_smash:    { name:'ネメアの剛拳',     icon:'⚡', power:23, type:'physical', target:'single', hits:1, animation:'punch' },
  mb_herc_nine:     { name:'十二の試練',       icon:'⚡', power:24, type:'physical', target:'all',    hits:1, animation:'slash' },
  mb_herc_regen:    { name:'ゴッドハンド再生', icon:'💚', power:0,   type:'support',  target:'self',   effect:'regen', effectChance:1, effectTurns:2, animation:'heal' },
  mb_herc_god:      { name:'神性解放',         icon:'💥', power:30, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_katana_slash:  { name:'居合一閃',         icon:'🗡️', power:19,  type:'physical', target:'single', hits:1, animation:'slash' },
  mb_katana_spin:   { name:'回転斬り',         icon:'🗡️', power:21, type:'physical', target:'all',    hits:1, animation:'slash' },
  mb_katana_devil:  { name:'悪魔変身',         icon:'🗡️', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_katana_chain:  { name:'刃の連鎖',         icon:'💥', power:29, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_envy_fist:     { name:'妬みの鉄拳',       icon:'🌿', power:18,  type:'physical', target:'single', hits:1, animation:'punch' },
  mb_envy_shape:    { name:'形態変化',         icon:'🌿', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_envy_giant:    { name:'巨人化',           icon:'🌿', power:24, type:'physical', target:'all',    hits:1, animation:'slash' },
  mb_envy_hate:     { name:'憎しみの全力',     icon:'💥', power:29, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_wrath_sword:   { name:'至高の目・剣',       icon:'⚔️', power:21, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_wrath_pride:   { name:'双剣乱舞',         icon:'⚔️', power:24, type:'physical', target:'single', hits:1, animation:'slash' },
  mb_wrath_sin:     { name:'憤怒の一閃',       icon:'⚔️', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff' },
  mb_wrath_blade:   { name:'至高の目・全力斬',     icon:'💥', power:29, type:'physical', target:'all',    hits:1, animation:'explosion' },
  mb_hend_acid:     { name:'毒の血',           icon:'🧪', power:15,  type:'magic',    target:'single', hits:1, animation:'dark',      effect:'poison', effectChance:1, effectTurns:3 },
  mb_hend_blood:    { name:'血鬼化',           icon:'🧪', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_hend_grey:     { name:'グレイデモン',     icon:'🌑', power:23, type:'magic',    target:'all',    hits:1, animation:'dark' },
  mb_hend_death:    { name:'暗黒の死',         icon:'💥', power:29, type:'magic',    target:'single', hits:1, animation:'explosion' },
  mb_clay_puppet:   { name:'人形操作',         icon:'🧤', power:16,  type:'magic',    target:'single', hits:1, animation:'dark',      effect:'atk_down', effectChance:1, effectTurns:2 },
  mb_clay_chain:    { name:'鎖の束縛',         icon:'🔗', power:16,  type:'physical', target:'single', hits:1, animation:'slash', effect:'stun', effectChance:1, effectTurns:1 },
  mb_clay_master:   { name:'傀儡師の力',       icon:'🧤', power:23, type:'magic',    target:'all',    hits:1, animation:'dark' },
  mb_clay_curse:    { name:'呪いの束縛',       icon:'💥', power:28, type:'magic',    target:'single', hits:1, animation:'explosion', effect:'curse', effectChance:1, effectTurns:2 },
  mb_furu_kagune:   { name:'赫子攻撃',         icon:'🃏', power:19,  type:'physical', target:'single', hits:1, animation:'slash' },
  mb_furu_plan:     { name:'V計画',            icon:'🃏', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_furu_v:        { name:'鱗甲乱舞',            icon:'🃏', power:23, type:'physical', target:'all',    hits:1, animation:'slash' },
  mb_furu_clown:    { name:'ピエロの全力',     icon:'💥', power:29, type:'physical', target:'single', hits:1, animation:'explosion' },
  mb_walp_gear:     { name:'歯車の嵐',         icon:'🎭', power:22, type:'magic',    target:'all',    hits:1, animation:'explosion' },
  mb_walp_cannon:   { name:'大砲の直撃',       icon:'💥', power:30, type:'magic',    target:'single', hits:1, animation:'explosion' },
  mb_walp_storm:    { name:'嵐の魔力',         icon:'🎭', power:0,   type:'support',  target:'self',   effect:'atk_up', effectChance:1, effectTurns:3, animation:'buff', alsoEffect2:'def_up' },
  mb_walp_despair:  { name:'絶望の化身',       icon:'💥', power:30, type:'magic',    target:'all',    hits:1, animation:'explosion' },
};

// ============================================================
// SKILL_QUOTES: 大技使用時のセリフ（skillId → セリフ文字列）
// ============================================================
const SKILL_QUOTES = {
  // -- ドラゴンボール --
  kamehameha: 'か…め…は…め…波ーーーっ！！',
  genkidama: 'みんなのエネルギーをオラに分けてくれ！！元気玉っ！！',
  vegeta_final_flash: 'ファイナルフラッシュっ！！覚悟しろォ！！',
  piccolo_beam: '魔貫光殺砲っ！！',
  piccolo_hellzone: '魔空包囲弾っ！！逃げ場はないぞ！！',
  trunks_finish: 'ファイナルホープスラッシュっ！！',
  krillin_disc: '気円斬っ！！',
  frieza_full: 'これで消し飛びなさいっ！！デスボールっ！！',

  // -- NARUTO --
  rasengan: '螺旋丸っ！！',
  senjutsu_rasengan: '風遁……螺旋手裏剣っ！！',
  kakashi_lightning_blade: '神威っ！！',
  sasuke_chidori: '千鳥っ！！',
  sasuke_susanoo: '須佐能乎っ！！',
  itachi_tsukuyomi: '月読っ！！',
  itachi_amaterasu: '天照っ！！',
  tsunade_mitsu: '百豪の術・創造再生！！',
  gaara_absolute: '……砂瀑送葬っ！！',
  jiraiya_sennin: '仙法・蝦蟇油炎弾っ！！',

  // -- ONE PIECE --
  gear5: 'ゴムゴムの……猿神銃（バジュラングガン）っ！！',
  asura: '三・千・世・界っ！！！',
  sanji_ifrit: 'イフリートジャンブっ！！',
  ace_hiken: '火拳っ！！',
  shanks_kamusari: '神避（かむさり）っ！！',

  // -- ワンパンマン --
  serious_punch: 'マジシリーズ……マジ殴り。',
  genos_incinerator: '焼却砲、発射。',
  tatsumaki_cataclysm: '不愉快、消えて',
  sonic_juuretsu: '奥義……十影葬っ！！',

  // -- 鬼滅の刃 --
  flame_breath_1: '炎の呼吸、壱ノ型！！不知火っ！！',
  flame_breath_9: '炎の呼吸、玖ノ型……煉獄っ！！',
  tanjiro_sun_breath: 'ヒノカミ神楽……円舞一閃っ！！',
  nezuko_bakketsu: '（血鬼術・爆血！！）',
  zenitsu_thunder: '雷の呼吸、壱ノ型……霹靂一閃っ！！',
  zenitsu_seventh: '漆ノ型……火雷神っ！！',
  water_breath_11: '水の呼吸、拾壱ノ型……凪っ！！',
  inosuke_beast: '獣の呼吸、捌ノ型……爆裂猛進っ！！',
  mitsuri_six: '恋の呼吸、陸ノ型……猫足恋風っ！！',

  // -- SAO --
  vorpal_strike: 'ヴォーパル・ストライク！！',
  starburst_stream: 'スターバースト……ストリーム！！',
  healing_asuna: 'カドラプル・ペイン！！',
  mother_rosario: 'フラッシング・ペネトレイター！！',
  yuuki_sword: 'これがボクの生きた証……マザーズ・ロザリオっ！！',

  // -- Re:ゼロ --
  subaru_shadow: 'シャマクっ！！……今のうちだ！！',
  reinhard_dragon: '――そこまでだ',

  // -- ポケモン --
  volt_tackle: 'ピッカァァァ〜〜チュウウウ！！',

  // -- 鋼の錬金術師 --
  alchemy_arms: '錬成開始だ！！持っていけっ！！',
  ryusei_no_hi: '……焼き尽くす。',
  alphonse_bind: 'いくよ！！撃鉄靠掌っ！！',

  // -- 呪術廻戦 --
  mugen: '無限……僕に触れることはできないよ。',
  murasaki: '茈っ！！',
  sukuna_domain: '領域展開……伏魔御厨子。',
  megumi_domain: '領域展開……嵌合暗翳庭。',
  nanami_fulltime: '……瓦落瓦落（がらがら）。',
  yuta_rika: '駄目だよリカちゃん、やりすぎは',

  // -- BLEACH --
  getsuga_tensho: '月牙、天衝！！',
  mugetsu: '俺自身が、月牙になる事だ',
  rukia_bankai: '卍解……白霞罸！',
  hitsugaya_bankai: '卍解……大紅蓮氷輪丸！',
  byakuya_bankai: '卍解……千本桜景厳！',
  yoruichi_raishunko: '瞬閧……雷神戦形っ！！',
  kenpachi_nozarashi: '卍解。……楽しくなってきたじゃねェか。',

  // -- HUNTER×HUNTER --
  godspeed: '電光石火！！',
  kanmuru: '神速！！',
  gon_rock: 'ジャン……ケン……グーっ！！',
  gon_adult: 'もうこれで終わってもいい。……だから、ありったけを！！',
  hisoka_bungee: '♠ バンジーガム。もう逃げられないよ ♥',
  kurapika_emperor: '……絶対時間！！',
  leorio_punch: 'くそ野郎！！',

  // -- 僕のヒーローアカデミア --
  plus_ultra: 'ユナイテッド・ステイツ・オブ・スマッーーーッシュ！！！',
  deku_100percent: '100パーセント……ワイオミングスマッシュ！！！',
  todoroki_heaven: '凍てつけ……冷炎白刃っ！！',
  bakugo_blast: '死ねェッ！！徹甲弾（A・P・ショット）！！',
  bakugo_howitzer: '榴弾砲着弾（ハウザーインパクト）っ！！',

  // -- ジョジョの奇妙な冒険 --
  the_world_stop: 'ウリイイイイヤアアアッー',
  time_erase: '無駄ァ！無駄！無駄！無駄ァーッ！！',
  jotaro_time_stop: 'やれやれだぜ…スタープラチナ、ザ・ワールドっ！！',
  jotaro_ora_rush: 'オラオラオラオラオラオラオラっ！！',
  kakyoin_emerald: 'くらえッ！半径20mエメラルド・スプラッシュをーーーッ！',
  polnareff_armor: 'おれが判決をいうぜ、「死刑」！',
  avdol_crossfire_sp: 'C・F・H・S！かわせるかッー！！',

  // -- 転生したらスライムだった件 --
  megiddo: '――死ね。神の怒りに焼き貫かれて。',
  milim_millennium: '消し飛べ！！ドラゴ・ノヴァっ！！',

  // -- 魔法少女まどか☆マギカ --
  barrier_hw: '……全ての魔女は、私一人で片付ける。',
  madoka_ultimate: '……それが私の祈り！！',
  mami_finale: 'ティロ・フィナーレっ！！',

  // -- Fate/stay night --
  excalibur: '受けるが良い！エクス……カリバー！！',
  archer_unlimited: 'I am the bone of my sword.',
  lancer_gae: 'その心臓、貰い受ける！ゲイ……ボルク！！',
  gilgamesh_ea: '死をもって鎮まるがいい！！エヌマ・エリシュ！！',

  // -- 東京喰種 --
  kakuja: '993……986……。赫者、解放。',

  // -- ブラッククローバー --
  black_hole: '滅魔の剣……因果解放っ！！',
  black_divider: 'あぁオレは…魔法帝になるからなァ…！！',
  yami_dimension: '闇纏……次元斬っ！！',

  // -- 進撃の巨人 --
  levi_perfect: '俺が仕留める。',
  eren_rumbling: 'ウオオオォォォォォ！！！',
  mikasa_thunderspear: '戦わなければ、勝てない',

  // -- 七つの大罪 --
  meliodas_reflection: 'リベンジカウンター！！',
  meliodas_rising: '…お前らに勝機はねぇ',
  escanor_the_one: '時は正午。……「最強」の刻（ザ・ワン）。',

  // -- FAIRY TAIL --
  natsu_iron: '雷炎竜の撃鉄っ！！',
  natsu_explode: '滅竜奥義……漆黒爆炎刃っ！！',
  erza_eight: '天輪！！五芒星の剣！！',
  erza_hero: '換装！！妖精の鎧！！',
  gray_rampart: 'アイスメイク……ランパート！！',
  gray_ice_emperor: '……銀世界（シルバー）',
  lucy_stardress: 'ウラノ・メトリア！！',

  // -- オーバーロード --
  ainz_annihilate: '……全ての生命の到達点は死である。',
  albedo_guardian: '守護者として…誰一人通さない！！',
  albedo_apocalypse: 'アインズ様のために…！！',

  // -- この素晴らしい世界 --
  megumin_chant: '黒より黒く闇より暗き漆黒に…、我が深紅の混淆を望みたもう…、',
  megumin_advanced: 'エクスプローーーージョン！！',

  // -- チェンソーマン --
  denji_chainsaw: '永久機関が完成しちまったなアア～！！',
  makima_control: 'ばん、ばん、ばーん',
  aki_fox: 'コン',

  // -- とある魔術の禁書目録 --
  misaka_dragon: '行くわよ！！',
  touma_possibility: 'その幻想を、ぶち殺す！！',

  // -- 葬送のフリーレン --
  frieren_defense: '……この程度なら防げるよ。',
  frieren_judradjim: '……ジュドラジルム。',

  // -- 無職転生 --
  eris_rush: 'はああぁっ！！',
  roxy_cumulonimbus: '……雷雲（キュムロニンバス）！！',

  // -- 盾の勇者の成り上がり --
  naofumi_maiden: 'シールドプリズン、チェンジシールド……アイアンメイデン！！',

};

// ============================================================
// BOSS_SKILL_QUOTES: ボス大技のセリフ（skillId → セリフ文字列）
// ============================================================
const BOSS_SKILL_QUOTES = {
  b_100percent:       'フルパワーの私に勝てるとでも思いましたか？……消し飛びなさい！！',
  b_galaxy_burst:     '崩星咆哮砲……これが俺の全力だ！！受け止めてみせろ！！',
  b_bolo_breath:      '大威徳雷鳴八卦！！俺に勝てる奴なんて……この世にゃいねぇんだよ！！',
  b_meteor:           'これは避けられまい。……天変地異というものだ。',
  b_beast_ganon:      'ビーストガノン！！王の怒りを受けろ！！',
  b_infinite_slashes: '月の呼吸・拾肆ノ型……兇変・天満繊月ッ！！',
  b_wryyy:            '無駄無駄無駄無駄ァッ！！これがDIOの力だァ！！',
  b_rinnegan:         '輪廻眼引力！！逃げ場はない！！',
  b_muzan_final:      '私が"正しい"と言った事が"正しい"のだ。……消え去れ。',
  b_kaguya_yomotsu:   '黄泉比良坂！！この世の全てはわたしのもの！！',
  b_meruem_coil:      '蟻王の支配！！全ての存在は余の前に膝まずく！！',
  b_aizen_hogyoku:    '崩玉の覚醒……。いつから、私を倒せると錯覚していた？',
  b_acnologia_pulse:  '魔力の波動！！竜殺しの力……貴様らには早すぎた！！',
  b_yhwach_reishi:    '霊子吸収！！全ての魂は私のものだ！！',
  b_vel_god:          'これが、私の権能の一端……その身で受け止めてみせよ。',
  b_gil_enuma:        '目覚めよ、エア！　いざ見せてやろう、天地乖離す開闢の星（エヌマ・エリシュ）を！！',
  b_demon_black:      '獄炎（ヘルブレイズ）！！絶望の炎よ、全てを覆い尽くせ！！',
  b_road_roller:      'ロードローラーだッ！！無駄無駄無駄無駄ァッ！！',
  b_cell_solar:       '太陽系ごと……消し飛ばしてさしあげます！！さようなら！！',
  b_zoma_zero:        'いい覚悟だ……ならば凍てつく絶望を見せてやろう。絶対零度！！',
  b_afo_almight:      '最高・最適の”個性”たちで……君を殴る！！',
  b_ken_merging:      'さぁ、器の融合だ。人類の新たな進化を見届けたまえ。',
  b_zen_almighty:     '無間骨牙……。貫けぬものなどない。',
  b_sat_witch:        '——愛してる。だから、わたしの全部をあなたにあげる。',
  b_bb_tsunami:       'ゼハハハハ！！世界ごと沈めェ！！震撃津波！！',
  b_heath_god:        'これは、ゲームであっても遊びではない。',
  b_pucci_heaven:     '時は加速する……！！メイド・イン・ヘブン！！',
  b_darkdev_despair:  '……恐怖の底を、見せてあげよう。',
  b_esta_full:        '俺の慈愛はもう止まらない……慈愛の業炎・全開だ！！',
  b_father_light:     '神の力を得た私に、人間ごときが敵うと思ったか。',
};