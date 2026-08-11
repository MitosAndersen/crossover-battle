// ============================================================
// MAIN — 画面の進行と入力の受け付け
// ============================================================
// タイトル → 出撃選択 → 戦闘 → リザルト
//
// 戦闘中の操作は「今どの段階か」を mode 1つで表す。
//   'select' … ユニットを選んだ。移動先を待っている
//   'moved'  … 移動が終わった。行動メニューを開いている
//   'aiming' … 技を選んだ。着弾点を待っている
//   null     … 何も選んでいない
// ============================================================

const SRPG_Game = (function () {

  const PARTY_SIZE = 4;
  const SAVE_KEY = 'srpg_lastParty';   // ターン制側は全キー icb_ 始まりなので衝突しない

  let roster = [];        // 図鑑としての全味方（SRPG_Units.build()）
  let picked = [];        // 出撃に選んだ id
  let mode = null;
  let sel = null;         // 選択中のユニット
  let action = null;      // 選択中の技
  let preMove = null;     // 移動前の座標（やり直し用）
  let busy = false;       // 敵フェイズ中などの入力ロック

  const delay = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  // ---- 音 --------------------------------------------------
  // ../js/audio.js を読めているときだけ鳴らす。読めていない場合、識別子 Audio は
  // ブラウザ内蔵の <audio> コンストラクタを指してしまうので、
  // 「うちの Audio かどうか」を中身の有無で毎回確かめる。
  function se(name) {
    try { if (Audio && Audio.SE && Audio.SE[name]) Audio.SE[name](); } catch (e) {}
  }
  function seAnim(anim) {
    try { if (Audio && Audio.playByAnimation) Audio.playByAnimation(anim); } catch (e) {}
  }
  // 今どの曲を鳴らすべき場面か。BGMをONに戻したときの復帰にも使う
  let bgmScene = null;              // 'title' | 'battle' | null
  function bgmStart(scene) {
    bgmScene = scene;
    try {
      if (!(Audio && Audio.startBGM)) return;
      if (scene === 'title') Audio.startBGM('title', true);
      else                   Audio.startBGM('normal', false);
    } catch (e) {}
  }
  function bgmStop() {
    bgmScene = null;
    try { if (Audio && Audio.stopBGM) Audio.stopBGM(); } catch (e) {}
  }

  // ============================================================
  // 起動
  // ============================================================
  function init() {
    roster = SRPG_Units.build();
    if (roster.length === 0) {
      document.body.innerHTML = '<p style="padding:20px">共有データ（../js/characters.js）が読めていません。</p>';
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
      picked = saved.filter(function (id) {
        return roster.some(function (u) { return u.id === id; });
      }).slice(0, PARTY_SIZE);
    } catch (e) { picked = []; }

    SRPG_UI.buildBoard();
    SRPG_UI.onTileClick(onTile);

    document.getElementById('start-select-btn').addEventListener('click', function () {
      se('cursor');
      // 音は最初のタップまで鳴らせない（ブラウザの自動再生制限）。
      // ここが最初の操作なので、タイトルのBGMもこのタイミングで始める
      bgmStart('title');
      openSelect();
    });
    document.getElementById('end-phase-btn').addEventListener('click', function () {
      if (busy || SRPG_Battle.getState().phase !== 'ally') return;
      se('cursor');
      SRPG_Battle.living('ally').forEach(function (u) { u.acted = true; });
      deselect();
      SRPG_UI.renderUnits();
      enemyPhase();
    });

    // 音のON/OFF。ボタンは複数の画面に置いてあるので、まとめて拾う
    document.addEventListener('click', function (e) {
      const btn = e.target.closest && e.target.closest('.sound-btn');
      if (!btn) return;
      try {
        if (btn.dataset.kind === 'se') {
          Audio.toggleSE(); se('cursor');
        } else {
          // toggleBGM は「切る」ことしかしない（ONに戻しても鳴り始めない）ので、
          // ONにしたときは今の場面の曲をこちらから掛け直す
          const on = Audio.toggleBGM();
          if (on && bgmScene) bgmStart(bgmScene);
        }
      } catch (err) {}
      SRPG_UI.refreshSoundButtons();
    });
    SRPG_UI.refreshSoundButtons();

    SRPG_UI.showScreen('title-screen');
  }

  // ============================================================
  // 出撃選択
  // ============================================================
  function openSelect() {
    SRPG_UI.showScreen('select-screen');
    SRPG_UI.renderPartySelect(roster, picked, function (id) {
      const i = picked.indexOf(id);
      if (i >= 0) { picked.splice(i, 1); se('cancel'); }
      else if (picked.length < PARTY_SIZE) { picked.push(id); se('select'); }
    }, startBattle);
    SRPG_UI.refreshSoundButtons();
  }

  // ============================================================
  // 戦闘の開始
  // ============================================================
  async function startBattle() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(picked)); } catch (e) { /* 保存できなくても遊べる */ }

    const chosen = picked.map(function (id) {
      return roster.find(function (u) { return u.id === id; });
    });
    SRPG_Battle.setup(chosen);

    SRPG_UI.showScreen('battle-screen');
    SRPG_UI.clearLog();
    SRPG_UI.clearUnits();     // 前回の駒を消してから並べ直す
    SRPG_UI.renderUnits();
    SRPG_UI.refreshSoundButtons();
    deselect();
    se('battleStart');
    bgmStart('battle');
    SRPG_UI.log('⚔️ 遭遇戦 開始！ 敵を全滅させろ');
    await allyPhase();
  }

  // ============================================================
  // 自軍フェイズ
  // ============================================================
  async function allyPhase() {
    const logs = SRPG_Battle.startPhase('ally');
    SRPG_UI.setPhase('ターン ' + SRPG_Battle.getState().turn + '　自軍フェイズ', 'ally');
    SRPG_UI.renderUnits();
    SRPG_UI.logAll(logs);
    reportBlocked('ally');
    if (await checkEnd()) return;
    await SRPG_UI.banner('PLAYER PHASE', 'ally');
    busy = false;
    // 全員が状態異常で動けないこともある
    if (SRPG_Battle.allActed('ally')) { await enemyPhase(); }
  }

  // 状態異常で動けない者がいたら、まとめて1回だけ音を鳴らす
  function reportBlocked(side) {
    const any = SRPG_Battle.living(side).some(function (u) { return u.blocked; });
    if (any) se('shock');
  }

  // ---- マスがタップされた ----------------------------------
  function onTile(x, y) {
    if (busy || SRPG_Battle.getState().phase !== 'ally') return;
    const here = SRPG_Battle.unitAt(x, y);

    if (mode === 'aiming') { aimAt(x, y); return; }

    // 移動を終えたら、行動を決めるまで盤面の操作を受けない。
    // ここで別のユニットに移れてしまうと、移動だけを繰り返せてしまう
    if (mode === 'moved') { if (here === sel) openMenu(); return; }

    if (mode === 'select') {
      if (here === sel) { openMenu(); return; }                  // 自分をもう一度 → その場で行動
      if (isMovable(x, y)) { doMove(x, y); return; }
      if (here && SRPG_Battle.canAct(here)) { select(here); return; }
      deselect();
      SRPG_UI.showInfo(here);
      return;
    }

    // 何も選んでいない
    if (here && SRPG_Battle.canAct(here)) { select(here); return; }
    SRPG_UI.showInfo(here);
  }

  let movable = [];    // 選択中ユニットが移動できるマス
  let aimTiles = [];   // 技の着弾点にできるマス
  function isMovable(x, y) {
    return movable.some(function (t) { return t.x === x && t.y === y; });
  }

  function select(u) {
    se('select');
    sel = u;
    mode = 'select';
    action = null;
    preMove = { x: u.x, y: u.y };
    movable = SRPG_Grid.movableTiles(u, SRPG_Battle.occupiedBy);
    SRPG_UI.clearHighlights();
    SRPG_UI.highlight(movable, 'hi-move');
    SRPG_UI.highlight([{ x: u.x, y: u.y }], 'hi-self');
    SRPG_UI.hideActionMenu();
    SRPG_UI.hideAimBar();
    SRPG_UI.showInfo(u);
  }

  function deselect() {
    sel = null; mode = null; action = null; preMove = null; movable = []; aimTiles = [];
    SRPG_UI.clearHighlights();
    SRPG_UI.hideActionMenu();
    SRPG_UI.hideAimBar();
    SRPG_UI.showInfo(null);
  }

  async function doMove(x, y) {
    const path = SRPG_Grid.path(sel, x, y, SRPG_Battle.occupiedBy);
    se('cursor');
    busy = true;
    SRPG_UI.clearHighlights();
    await SRPG_UI.walk(sel, path);
    busy = false;
    openMenu();
  }

  function openMenu() {
    mode = 'moved';
    SRPG_UI.clearHighlights();
    SRPG_UI.highlight([{ x: sel.x, y: sel.y }], 'hi-self');
    SRPG_UI.showInfo(sel);
    SRPG_UI.showActionMenu(sel, SRPG_Units.actionsOf(sel), {
      canUndo: preMove && (preMove.x !== sel.x || preMove.y !== sel.y),
      onPick: pickAction,
      onWait: function () {
        se('cursor');
        SRPG_UI.log('　' + SRPG_Battle.wait(sel));
        finishUnit();
      },
      onUndo: function () {
        se('cancel');
        SRPG_Battle.moveTo(sel, preMove.x, preMove.y);
        SRPG_UI.renderUnits();
        select(sel);
      }
    });
  }

  // ---- 技を選んだ ------------------------------------------
  function pickAction(a) {
    if (!SRPG_Battle.canPay(sel, a)) return;
    se('cursor');
    action = a;

    if (a.form === 'self') { runAction(sel.x, sel.y); return; }

    mode = 'aiming';
    SRPG_UI.hideActionMenu();
    SRPG_UI.clearHighlights();
    aimTiles = SRPG_Grid.tilesInRange(sel.x, sel.y, sel.range);
    // 味方に向ける技は自分の足元も着弾点にできる。
    // そうしないと、自分を巻き込む形の全体強化・全体回復が撃てない
    if (a.side === 'own') aimTiles.push({ x: sel.x, y: sel.y });
    SRPG_UI.highlight(aimTiles, 'hi-range');
    // 「実際に誰かに当たるマス」だけを濃く出す。空振りを選びにくくする
    SRPG_UI.highlight(aimTiles.filter(function (t) {
      return SRPG_Battle.targetsFor(sel, a, t.x, t.y).length > 0;
    }), 'hi-burst');
    SRPG_UI.highlight([{ x: sel.x, y: sel.y }], 'hi-self');
    SRPG_UI.showAimBar(a, function () { SRPG_UI.hideAimBar(); openMenu(); });
  }

  function aimAt(x, y) {
    if (!aimTiles.some(function (t) { return t.x === x && t.y === y; })) {
      se('cancel');
      SRPG_UI.log('　… そこは射程の外');
      return;
    }
    if (SRPG_Battle.targetsFor(sel, action, x, y).length === 0) {
      se('cancel');
      SRPG_UI.log('　… そこには誰も当たらない');
      return;
    }
    runAction(x, y);
  }

  // ---- 技1つの見せ方 ---------------------------------------
  // 「音 → エフェクト → 判定 → 数字」の順。プレイヤーと敵の両方がここを通るので、
  // どちらが撃っても見え方が食い違わない。
  // 効果音とエフェクトの種類は、共有データの animation（slash / beam / …）で決まる。
  async function performAction(actor, act, x, y) {
    const targets = SRPG_Battle.targetsFor(actor, act, x, y);
    const anim = (act.raw && act.raw.animation) || 'slash';

    seAnim(anim);
    await SRPG_UI.playEffect(anim, x, y, act.form === 'burst');
    if ((act.raw.power || 0) > 0) {
      targets.forEach(function (t) { SRPG_UI.flashUnit(t.uid, 'hit-flash'); });
    }

    const res = SRPG_Battle.execute(actor, act, x, y);
    SRPG_UI.logAll(res.logs);
    // 数字を飛ばすのは描画のあと。renderUnits が中身を作り直すので、先に出すと消える
    SRPG_UI.renderUnits();
    res.hits.forEach(function (h) { SRPG_UI.floatText(h.uid, h.text, h.kind); });
    if (targets.some(function (t) { return t.dead; })) se('enemyDefeat');
    await delay(380);
  }

  async function runAction(x, y) {
    busy = true;
    SRPG_UI.hideAimBar();
    SRPG_UI.hideActionMenu();
    SRPG_UI.clearHighlights();
    await performAction(sel, action, x, y);
    busy = false;
    finishUnit();
  }

  async function finishUnit() {
    const done = sel;
    deselect();
    if (done) done.acted = true;
    SRPG_UI.renderUnits();
    if (await checkEnd()) return;
    if (SRPG_Battle.allActed('ally')) await enemyPhase();
  }

  // ============================================================
  // 敵フェイズ
  // ============================================================
  async function enemyPhase() {
    busy = true;
    deselect();
    const logs = SRPG_Battle.startPhase('enemy');
    SRPG_UI.setPhase('ターン ' + SRPG_Battle.getState().turn + '　敵フェイズ', 'enemy');
    SRPG_UI.renderUnits();
    SRPG_UI.logAll(logs);
    reportBlocked('enemy');
    if (await checkEnd()) return;
    await SRPG_UI.banner('ENEMY PHASE', 'enemy');

    const order = SRPG_Battle.living('enemy').slice();
    for (const e of order) {
      if (e.dead || e.acted) continue;
      if (SRPG_Battle.checkEnd()) break;

      const plan = SRPG_AI.decide(e);
      if (plan.moveTo) {
        const path = SRPG_Grid.path(e, plan.moveTo.x, plan.moveTo.y, SRPG_Battle.occupiedBy);
        await SRPG_UI.walk(e, path);
        await delay(120);
      }
      if (plan.shot) {
        await performAction(e, plan.shot.action, plan.shot.aimX, plan.shot.aimY);
      } else {
        e.acted = true;
      }
      SRPG_UI.renderUnits();
      if (await checkEnd()) return;
    }

    SRPG_Battle.endPhase();
    await allyPhase();
  }

  // ============================================================
  // 勝敗
  // ============================================================
  async function checkEnd() {
    const r = SRPG_Battle.checkEnd();
    if (!r) return false;
    busy = true;
    deselect();
    bgmStop();
    await delay(400);
    se(r === 'win' ? 'victory' : 'defeat');
    await SRPG_UI.banner(r === 'win' ? 'WIN!' : 'LOSE...', r === 'win' ? 'ally' : 'enemy');
    SRPG_UI.showResult(r === 'win', SRPG_Battle.getState().turn, startBattle, function () {
      se('cursor');
      bgmStart('title');
      SRPG_UI.showScreen('title-screen');
    });
    return true;
  }

  return { init: init };
})();

window.addEventListener('DOMContentLoaded', function () { SRPG_Game.init(); });
