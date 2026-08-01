// ============================================================
// TUTORIAL — 初回戦闘のスポットライト案内
// 画面を暗くして対象の要素だけを切り抜き、吹き出しで説明する。
// 案内中はゲーム操作を止め、「次へ」「スキップ」だけを受け付ける読み進め形式。
// ============================================================
const Tutorial = (() => {

  const DONE_KEY = 'icb_tutorialDone';

  // 各ステップの対象と文面。sel は document.querySelector に渡すセレクタ。
  // 対象が見つからないステップは飛ばすので、画面構成が変わっても落ちない
  const STEPS = [
    {
      sel: '#enemy-area',
      title: '👹 敵',
      body: '倒すべき相手です。最大3体まで現れます。技を使うときは、ここから狙う敵を選びます。'
    },
    {
      sel: '.vs-divider',
      title: '🔋 SPは3人で共有',
      body: 'このゲームのSPは<strong>パーティ全体で1つ</strong>です。誰かが技を使うと、みんなの残りが減ります。戦闘開始時は3から始まります。'
    },
    {
      sel: '#ally-area',
      title: '👥 仲間',
      body: '<strong>行動する順番は自由に選べます</strong>。カードをタップすれば、動かす仲間を切り替えられます。4つのロールで役割が違うので、詳しくは📖ガイドを見てください。'
    },
    {
      sel: '.skill-grid',
      title: '⚔️ 技を選ぶ',
      body: '使う技を選びます。<strong>SPが足りない技は押せません</strong>。技ごとに威力・対象・追加効果が違うので、ボタンの中の表示を見比べてください。'
    },
    {
      // 通常攻撃のボタン。
      // .noPP-label で引くと、防御の「SP不要」やストライカー割引の「⚡SP+1」にも
      // 同じクラスが付いていて誤爆する。skillId から SKILL_DATA を引いて確実に判定する
      // （main.js の「通常攻撃を自動選択」と同じ手）
      find: () => {
        if (typeof SKILL_DATA === 'undefined') return null;
        return [...document.querySelectorAll('#skill-panel .skill-btn')].find(b => {
          const sk = SKILL_DATA[b.dataset.skillId];
          return sk && (sk.noSP || sk.noPP);
        }) || null;
      },
      title: '🔋 通常攻撃でSPが回復',
      body: '通常攻撃は<strong>SPを消費せず、逆に回復します</strong>（サポーターは+2）。強い技だけを撃っているとSPが尽きるので、回復する手を挟むのが大事です。'
    },
    {
      sel: '#skill-panel',
      title: '👆 対象選びは2度押し',
      body: '技を選ぶと、まず<strong>対象と予想ダメージが表示されます</strong>。そこでもう一度同じボタンを押すか、狙いたい敵のカードを押すと発動します。<strong>1度目では発動しません</strong>ので、誤爆の心配なく確認できます。'
    }
  ];

  let _root = null;      // 操作を止める受け皿
  let _spot = null;      // 切り抜き（周囲を暗くする）
  let _bubble = null;    // 吹き出し
  let _idx = 0;
  let _onDone = null;
  let _onResize = null;

  function isDone() {
    try { return localStorage.getItem(DONE_KEY) === 'true'; } catch (e) { return false; }
  }
  function markDone() {
    try { localStorage.setItem(DONE_KEY, 'true'); } catch (e) {}
  }
  function reset() {
    try { localStorage.removeItem(DONE_KEY); } catch (e) {}
  }
  function shouldAutoRun() {
    return !isDone();
  }

  // ステップの対象要素。sel（セレクタ）か find（関数）のどちらかで引く。
  // 見つからなければ null を返し、呼び出し側がそのステップを飛ばす
  function findTarget(step) {
    try {
      if (step.find) return step.find();
      return document.querySelector(step.sel);
    } catch (e) {
      return null;
    }
  }

  // 対象を囲むように切り抜きと吹き出しを置き直す
  function place(el) {
    const pad = 6;
    const r = el.getBoundingClientRect();
    const top    = Math.max(4, r.top - pad);
    const left   = Math.max(4, r.left - pad);
    const width  = Math.min(window.innerWidth  - left - 4, r.width  + pad * 2);
    const height = Math.min(window.innerHeight - top  - 4, r.height + pad * 2);

    _spot.style.top    = top + 'px';
    _spot.style.left   = left + 'px';
    _spot.style.width  = width + 'px';
    _spot.style.height = height + 'px';

    // 吹き出しは対象の下。入らなければ上へ回す。それも入らなければ画面中央寄せ
    const bw = _bubble.offsetWidth;
    const bh = _bubble.offsetHeight;
    const gap = 12;
    let bTop;
    if (top + height + gap + bh <= window.innerHeight - 8) {
      bTop = top + height + gap;                 // 下に置く
    } else if (top - gap - bh >= 8) {
      bTop = top - gap - bh;                     // 上に置く
    } else {
      bTop = Math.max(8, (window.innerHeight - bh) / 2);
    }
    let bLeft = left + width / 2 - bw / 2;       // 対象の中央に揃える
    bLeft = Math.max(8, Math.min(window.innerWidth - bw - 8, bLeft));

    _bubble.style.top  = bTop + 'px';
    _bubble.style.left = bLeft + 'px';
  }

  function render() {
    // 対象が見つからないステップは飛ばす
    let step = STEPS[_idx];
    let el = step ? findTarget(step) : null;
    while (step && !el) {
      _idx++;
      step = STEPS[_idx];
      el = step ? findTarget(step) : null;
    }
    if (!step) { finish(); return; }

    const isLast = _idx >= STEPS.length - 1;
    _bubble.innerHTML = `
      <div class="tut-step">${_idx + 1} / ${STEPS.length}</div>
      <div class="tut-title">${step.title}</div>
      <div class="tut-body">${step.body}</div>
      <div class="tut-actions">
        <button class="tut-skip">スキップ</button>
        <button class="tut-next">${isLast ? '始める' : '次へ'}</button>
      </div>`;
    _bubble.querySelector('.tut-next').addEventListener('click', next);
    _bubble.querySelector('.tut-skip').addEventListener('click', finish);

    // モバイルでは対象が画面外にあり得るので、測る前に見える位置へ送る。
    // scrollIntoView の反映を待ってから測らないと古い座標を掴む
    el.scrollIntoView({ block: 'center', inline: 'nearest' });
    requestAnimationFrame(() => requestAnimationFrame(() => place(el)));

    _onResize = () => place(el);
    window.addEventListener('resize', _onResize);
    window.addEventListener('scroll', _onResize, true);
  }

  function clearResize() {
    if (!_onResize) return;
    window.removeEventListener('resize', _onResize);
    window.removeEventListener('scroll', _onResize, true);
    _onResize = null;
  }

  function next() {
    clearResize();
    _idx++;
    if (_idx >= STEPS.length) { finish(); return; }
    render();
  }

  function finish() {
    clearResize();
    markDone();
    if (_root) { _root.remove(); _root = null; }
    _spot = null;
    _bubble = null;
    const cb = _onDone;
    _onDone = null;
    if (cb) cb();
  }

  // 案内を再生する。onDone は完了・スキップのどちらでも呼ばれる
  function run(onDone) {
    if (_root) return;              // 二重起動を防ぐ
    _onDone = onDone || null;
    _idx = 0;

    _root = document.createElement('div');
    _root.className = 'tut-root';   // ここが背後への操作を全部受け止める

    _spot = document.createElement('div');
    _spot.className = 'tut-spot';

    _bubble = document.createElement('div');
    _bubble.className = 'tut-bubble';

    _root.appendChild(_spot);
    _root.appendChild(_bubble);
    document.body.appendChild(_root);

    render();
  }

  return { shouldAutoRun, run, reset, isDone };
})();
