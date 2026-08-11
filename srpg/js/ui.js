// ============================================================
// UI — 画面の描画と入力
// ============================================================
// ルール判断はしない。battle.js が持っている状態を、そのまま絵にするだけ。
// クリックはすべて「マス」で受ける（ユニットの絵は pointer-events を切ってある）。
// タップした先に誰がいるかは、呼び出し側が battle.js に聞く。
// ============================================================

const SRPG_UI = (function () {

  let boardEl, tilesEl, unitsEl, logEl, fxEl;
  let tileClickHandler = null;

  const ROLE_MARK = { attacker: '⚔️', support: '💚', tank: '🛡️', striker: '⚡' };

  function el(id) { return document.getElementById(id); }

  // ---- 画面の切り替え --------------------------------------
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.toggle('active', s.id === id);
    });
  }

  // ---- 盤面の土台を1回だけ作る ------------------------------
  function buildBoard() {
    boardEl = el('board');
    tilesEl = el('tiles');
    unitsEl = el('units-layer');
    fxEl    = el('fx-layer');
    logEl   = el('log');

    boardEl.style.setProperty('--cols', SRPG_Grid.COLS);
    boardEl.style.setProperty('--rows', SRPG_Grid.ROWS);

    let html = '';
    for (let y = 0; y < SRPG_Grid.ROWS; y++) {
      for (let x = 0; x < SRPG_Grid.COLS; x++) {
        // 市松模様にしておくと、移動範囲のマス数を目で数えられる
        const alt = (x + y) % 2 === 0 ? ' alt' : '';
        html += '<div class="tile' + alt + '" data-x="' + x + '" data-y="' + y + '"></div>';
      }
    }
    tilesEl.innerHTML = html;

    tilesEl.addEventListener('click', function (e) {
      const t = e.target.closest('.tile');
      if (!t || !tileClickHandler) return;
      tileClickHandler(Number(t.dataset.x), Number(t.dataset.y));
    });
  }

  function onTileClick(fn) { tileClickHandler = fn; }

  // ---- ユニットの描画 --------------------------------------
  function unitHtml(u) {
    const pct = Math.max(0, Math.round(u.hpNow / u.hpMax * 100));
    const hpCls = pct <= 25 ? ' low' : pct <= 55 ? ' mid' : '';
    const status = u.statusEffects.map(function (e) {
      const info = SRPG_Battle.STATUS_INFO[e.type];
      return info ? '<span title="' + info.label + '">' + info.icon + '</span>' : '';
    }).join('');
    const sp = u.spMax > 0
      ? '<div class="u-sp">' + '●'.repeat(u.sp) + '<span class="off">' + '●'.repeat(u.spMax - u.sp) + '</span></div>'
      : '';
    return '<div class="u-face">' + u.emoji + '</div>' +
           (u.shield > 0 ? '<div class="u-shield">🛡️' + u.shield + '</div>' : '') +
           '<div class="u-hp"><i class="' + hpCls + '" style="width:' + pct + '%"></i></div>' + sp +
           (status ? '<div class="u-status">' + status + '</div>' : '');
  }

  function renderUnits() {
    const units = SRPG_Battle.allUnits();
    // 既存の要素を使い回す。作り直すと移動のアニメが飛ぶため
    units.forEach(function (u) {
      let node = unitsEl.querySelector('[data-uid="' + u.uid + '"]');
      if (!node) {
        node = document.createElement('div');
        node.className = 'unit';
        node.dataset.uid = u.uid;
        unitsEl.appendChild(node);
      }
      node.classList.toggle('side-ally', u.side === 'ally');
      node.classList.toggle('side-enemy', u.side === 'enemy');
      node.classList.toggle('acted', u.acted && !u.dead);
      node.classList.toggle('dead', u.dead);
      node.style.left = 'calc(var(--tile) * ' + u.x + ')';
      node.style.top  = 'calc(var(--tile) * ' + u.y + ')';
      node.innerHTML = unitHtml(u);
    });
  }

  // 盤面から消す（戦闘をやり直すとき。uid が変わるので古い駒が残ってしまう）
  function clearUnits() { unitsEl.innerHTML = ''; }

  // 1マスずつ歩かせる。経路は grid.js が出し、座標の更新は battle.js に任せる
  function walk(unit, path) {
    return new Promise(function (resolve) {
      if (!path || path.length === 0) { resolve(); return; }
      let i = 0;
      const step = function () {
        if (i >= path.length) { resolve(); return; }
        SRPG_Battle.moveTo(unit, path[i].x, path[i].y);
        renderUnits();
        i++;
        setTimeout(step, 70);
      };
      step();
    });
  }

  // ---- マスのハイライト ------------------------------------
  function clearHighlights() {
    tilesEl.querySelectorAll('.tile').forEach(function (t) {
      t.classList.remove('hi-move', 'hi-range', 'hi-burst', 'hi-self');
    });
  }
  function highlight(tiles, cls) {
    (tiles || []).forEach(function (t) {
      const node = tilesEl.children[t.y * SRPG_Grid.COLS + t.x];
      if (node) node.classList.add(cls);
    });
  }

  // ---- 技のエフェクト --------------------------------------
  // 共有データの animation（slash / beam / explosion …11種）をそのまま鍵にする。
  // 見た目はターン制側と同じ配色・同じモチーフだが、あちらが画面全体に出すのに対し、
  // こちらは着弾したマスの上に出す（盤面ゲームなので、どこに当たったかが要る）。
  // CSS は srpg/style.css の .fx-* にある。
  const FX_MS = 380;
  function playEffect(anim, x, y, wide) {
    return new Promise(function (resolve) {
      if (!fxEl) { resolve(); return; }
      const node = document.createElement('div');
      node.className = 'fx fx-' + (anim || 'slash') + (wide ? ' wide' : '');
      node.style.left = 'calc(var(--tile) * ' + x + ')';
      node.style.top  = 'calc(var(--tile) * ' + y + ')';
      fxEl.appendChild(node);
      setTimeout(function () { node.remove(); }, 700);
      setTimeout(resolve, FX_MS);
    });
  }

  // 被弾した駒を光らせる
  function flashUnit(uid, cls) {
    const node = unitsEl.querySelector('[data-uid="' + uid + '"]');
    if (!node) return;
    node.classList.remove(cls);
    void node.offsetWidth;            // 連続で当たったときにアニメを頭から出し直す
    node.classList.add(cls);
    setTimeout(function () { node.classList.remove(cls); }, 400);
  }

  // ---- 音のON/OFFボタン ------------------------------------
  // ボタンは複数の画面に置けるよう、id ではなく .sound-btn[data-kind] で拾う。
  // ../js/audio.js を読めていないときは、そもそもボタンを出さない。
  function hasAudio() {
    try { return !!(Audio && Audio.isSEOn && Audio.toggleSE); } catch (e) { return false; }
  }
  function refreshSoundButtons() {
    const ok = hasAudio();
    const seOn  = ok && Audio.isSEOn();
    const bgmOn = ok && Audio.isBGMOn();
    document.querySelectorAll('.sound-btn').forEach(function (b) {
      if (!ok) { b.style.display = 'none'; return; }
      const isSE = b.dataset.kind === 'se';
      const on = isSE ? seOn : bgmOn;
      b.textContent = (on ? (isSE ? '🔊' : '🎵') : '🔇') + (isSE ? '効果音' : 'BGM');
      b.classList.toggle('off', !on);
    });
  }

  // ---- 浮かぶ数字 ------------------------------------------
  function floatText(uid, text, kind) {
    const node = unitsEl.querySelector('[data-uid="' + uid + '"]');
    if (!node) return;
    const f = document.createElement('div');
    f.className = 'float ' + (kind || '');
    f.textContent = text;
    node.appendChild(f);
    setTimeout(function () { f.remove(); }, 900);
  }

  // ---- ログ ------------------------------------------------
  function log(text) {
    const line = document.createElement('div');
    line.textContent = text;
    logEl.appendChild(line);
    while (logEl.children.length > 40) logEl.removeChild(logEl.firstChild);
    logEl.scrollTop = logEl.scrollHeight;
  }
  function logAll(lines) { (lines || []).forEach(log); }
  function clearLog() { logEl.innerHTML = ''; }

  function setPhase(text, side) {
    const p = el('phase');
    p.textContent = text;
    p.className = 'phase ' + (side || '');
  }

  function banner(text, cls) {
    return new Promise(function (resolve) {
      const b = el('banner');
      b.textContent = text;
      b.className = 'banner show ' + (cls || '');
      setTimeout(function () { b.className = 'banner'; resolve(); }, 900);
    });
  }

  // ---- 選択中ユニットの情報 --------------------------------
  function showInfo(u) {
    const box = el('info');
    if (!u) { box.innerHTML = '<span class="dim">マスをタップしてユニットを選ぶ</span>'; return; }
    const p = u.passive;
    box.innerHTML =
      '<div class="i-head">' + u.emoji + ' <b>' + u.name + '</b> ' +
        '<span class="dim">' + (ROLE_MARK[u.role] || '') + (u.origin || '') + '</span></div>' +
      '<div class="i-row">' +
        '<span>HP ' + u.hpNow + '/' + u.hpMax + '</span>' +
        (u.spMax > 0 ? '<span>SP ' + u.sp + '/' + u.spMax + '</span>' : '') +
        '<span>移動 ' + u.move + '</span><span>射程 ' + u.range + '</span>' +
        (u.shield > 0 ? '<span>🛡️' + u.shield + '</span>' : '') +
      '</div>' +
      (p ? '<div class="i-passive">🔹 ' + p.name +
           ' <span class="dim">' + p.desc + '（SRPG版では未実装）</span></div>' : '');
  }

  // ---- 行動メニュー ----------------------------------------
  // actions は SRPG_Units.actionsOf() の結果。onPick(action) / onWait() / onUndo()
  function showActionMenu(unit, actions, handlers) {
    const box = el('action-menu');
    let html = '<div class="am-title">' + unit.emoji + ' ' + unit.name +
               '<span class="dim">　SP ' + unit.sp + '/' + unit.spMax + '</span></div>';

    actions.forEach(function (a, i) {
      const payable = SRPG_Battle.canPay(unit, a);
      const reason = a.unsupported ? '未対応' : (!payable ? 'SP不足' : '');
      const power = a.total ? a.total + 'dmg'
                  : a.healPower ? '回復' + a.healPower
                  : a.shieldPower ? '盾' + a.shieldPower : '—';
      html += '<button class="am-skill" data-i="' + i + '"' + (payable ? '' : ' disabled') + '>' +
                '<span class="am-cost">' + (a.isBasic ? '通常' : 'SP' + a.cost) + '</span>' +
                '<span class="am-name">' + (a.icon || '') + ' ' + a.name + '</span>' +
                '<span class="am-meta">' + a.shapeLabel + '・' + power +
                  (reason ? ' <b class="ng">' + reason + '</b>' : '') + '</span>' +
              '</button>';
    });
    html += '<div class="am-foot">' +
              '<button class="am-sub" id="am-undo">↩ 移動やり直し</button>' +
              '<button class="am-sub" id="am-wait">待機</button>' +
            '</div>';

    box.innerHTML = html;
    box.classList.add('show');
    box.querySelectorAll('.am-skill').forEach(function (b) {
      b.addEventListener('click', function () { handlers.onPick(actions[Number(b.dataset.i)]); });
    });
    el('am-wait').addEventListener('click', handlers.onWait);
    const undo = el('am-undo');
    if (handlers.canUndo) undo.addEventListener('click', handlers.onUndo);
    else undo.disabled = true;
  }
  function hideActionMenu() { el('action-menu').classList.remove('show'); }

  // ---- 攻撃対象を選んでいるときの案内 -----------------------
  function showAimBar(action, onCancel) {
    const bar = el('aim-bar');
    bar.innerHTML = '<span>' + (action.icon || '') + ' <b>' + action.name + '</b> の対象を選ぶ（' +
                    action.shapeLabel + '）</span><button id="aim-cancel">やめる</button>';
    bar.classList.add('show');
    el('aim-cancel').addEventListener('click', onCancel);
  }
  function hideAimBar() { el('aim-bar').classList.remove('show'); }

  // ---- 出撃選択 --------------------------------------------
  // data.html の絞り込み（作品・ロール・名前）と同じ組み立て。
  function renderPartySelect(allUnits, picked, onToggle, onStart) {
    const fOrigin = el('f-origin'), fRole = el('f-role'), fName = el('f-name');

    if (!fOrigin.dataset.ready) {
      const origins = [];
      allUnits.forEach(function (u) { if (origins.indexOf(u.origin) < 0) origins.push(u.origin); });
      fOrigin.innerHTML = '<option value="">全作品（' + origins.length + '）</option>' +
        origins.map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('');
      fRole.innerHTML = '<option value="">全ロール</option>' +
        ['striker', 'attacker', 'support', 'tank'].map(function (r) {
          const label = (typeof ROLES !== 'undefined' && ROLES[r]) ? ROLES[r].label : r;
          return '<option value="' + r + '">' + label + '</option>';
        }).join('');
      [fOrigin, fRole].forEach(function (n) { n.addEventListener('change', draw); });
      fName.addEventListener('input', draw);
      fOrigin.dataset.ready = '1';
    }

    function draw() {
      const o = fOrigin.value, r = fRole.value, q = fName.value.trim();
      const list = allUnits.filter(function (u) {
        return (!o || u.origin === o) && (!r || u.role === r) && (!q || u.name.indexOf(q) >= 0);
      });
      el('pick-list').innerHTML = list.length ? list.map(function (u) {
        const on = picked.indexOf(u.id) >= 0;
        return '<div class="pick' + (on ? ' on' : '') + '" data-id="' + u.id + '">' +
                 '<div class="p-face">' + u.emoji + '</div>' +
                 '<div class="p-name">' + u.name + '</div>' +
                 '<div class="p-meta">' + (ROLE_MARK[u.role] || '') + ' HP' + u.hp +
                   ' 移' + u.move + ' 射' + u.range + '</div>' +
               '</div>';
      }).join('') : '<div class="empty">該当なし</div>';

      el('pick-count').textContent = picked.length + ' / 4';
      el('start-btn').disabled = picked.length !== 4;
      el('pick-slots').innerHTML = picked.map(function (id) {
        const u = allUnits.find(function (x) { return x.id === id; });
        return '<span class="slot">' + u.emoji + ' ' + u.name + '</span>';
      }).join('') || '<span class="dim">4体えらぶ</span>';
    }

    if (!el('pick-list').dataset.ready) {
      el('pick-list').addEventListener('click', function (e) {
        const card = e.target.closest('.pick');
        if (!card) return;
        onToggle(card.dataset.id);
        draw();
      });
      el('start-btn').addEventListener('click', onStart);
      el('pick-list').dataset.ready = '1';
    }
    draw();
  }

  // ---- リザルト --------------------------------------------
  function showResult(win, turns, onRetry, onTitle) {
    el('result-title').textContent = win ? '🏆 WIN' : '💀 LOSE';
    el('result-title').className = win ? 'win' : 'lose';
    el('result-sub').textContent = win
      ? turns + 'ターンで制圧した'
      : turns + 'ターン目に全滅した';
    const r = el('retry-btn'), t = el('to-title-btn');
    r.onclick = onRetry;
    t.onclick = onTitle;
    showScreen('result-screen');
  }

  return {
    showScreen: showScreen,
    buildBoard: buildBoard,
    onTileClick: onTileClick,
    renderUnits: renderUnits,
    clearUnits: clearUnits,
    walk: walk,
    clearHighlights: clearHighlights,
    highlight: highlight,
    playEffect: playEffect,
    flashUnit: flashUnit,
    refreshSoundButtons: refreshSoundButtons,
    floatText: floatText,
    log: log, logAll: logAll, clearLog: clearLog,
    setPhase: setPhase,
    banner: banner,
    showInfo: showInfo,
    showActionMenu: showActionMenu,
    hideActionMenu: hideActionMenu,
    showAimBar: showAimBar,
    hideAimBar: hideAimBar,
    renderPartySelect: renderPartySelect,
    showResult: showResult
  };
})();
