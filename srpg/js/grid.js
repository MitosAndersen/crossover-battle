// ============================================================
// GRID — マス目の計算だけを持つ
// ============================================================
// このファイルは状態を一切持たない。盤面の中身（誰がどこにいるか）は
// 呼び出し側が occupiedBy(x, y) という関数で渡す。
//   occupiedBy(x, y) … そのマスにいるユニットの side を返す。空きなら null
//
// 盤面の広さを変えたくなったら、下の COLS / ROWS だけを触ればよい。
// ============================================================

const SRPG_Grid = (function () {

  const COLS = 10;
  const ROWS = 8;

  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function inside(x, y) { return x >= 0 && x < COLS && y >= 0 && y < ROWS; }

  // マスをMap/Setの鍵にするための番号。座標オブジェクトを鍵にすると
  // 参照が違うだけで別物扱いになるため、数値に潰しておく。
  function key(x, y) { return y * COLS + x; }

  // マンハッタン距離。斜め移動なしのゲームなので、これがそのまま歩数になる。
  function dist(ax, ay, bx, by) { return Math.abs(ax - bx) + Math.abs(ay - by); }

  // ---- 移動できるマス --------------------------------------
  // 幅優先探索。1歩ずつ広げて move 歩で止める。
  //   ・敵ユニットのマスは「通れない」（すり抜け禁止）
  //   ・味方ユニットのマスは「通れるが止まれない」（すれ違いは許す）
  // 現在地は含めない（その場に留まるのは「待機」で表現する）。
  function movableTiles(unit, occupiedBy) {
    const startK = key(unit.x, unit.y);
    const cost = new Map([[startK, 0]]);
    const queue = [[unit.x, unit.y]];
    const out = [];

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const c = cost.get(key(x, y));
      if (c >= unit.move) continue;

      for (const [dx, dy] of DIRS) {
        const nx = x + dx, ny = y + dy;
        if (!inside(nx, ny)) continue;
        const nk = key(nx, ny);
        if (cost.has(nk)) continue;

        const occ = occupiedBy(nx, ny);
        if (occ && occ !== unit.side) continue;   // 敵は通り抜けられない

        cost.set(nk, c + 1);
        queue.push([nx, ny]);
        if (!occ) out.push({ x: nx, y: ny });     // 味方の上には止まれない
      }
    }
    return out;
  }

  // ---- 射程内のマス ----------------------------------------
  // 自分のマス（距離0）は含めない。
  function tilesInRange(x, y, range) {
    const out = [];
    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        const d = dist(x, y, tx, ty);
        if (d >= 1 && d <= range) out.push({ x: tx, y: ty });
      }
    }
    return out;
  }

  // ---- 範囲技の当たるマス ----------------------------------
  // 着弾点＋上下左右の十字5マス。盤外は落とす。
  function burstTiles(x, y) {
    return [{ x: x, y: y }]
      .concat(DIRS.map(([dx, dy]) => ({ x: x + dx, y: y + dy })))
      .filter(t => inside(t.x, t.y));
  }

  // ---- 経路 ------------------------------------------------
  // movableTiles と同じ通行ルールで from → to の道順を返す（from は含まない）。
  // 移動アニメ用。届かないときは空配列。
  function path(unit, tx, ty, occupiedBy) {
    const startK = key(unit.x, unit.y);
    const prev = new Map([[startK, null]]);
    const queue = [[unit.x, unit.y]];

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      if (x === tx && y === ty) break;
      for (const [dx, dy] of DIRS) {
        const nx = x + dx, ny = y + dy;
        if (!inside(nx, ny)) continue;
        const nk = key(nx, ny);
        if (prev.has(nk)) continue;
        const occ = occupiedBy(nx, ny);
        if (occ && occ !== unit.side) continue;
        prev.set(nk, { x: x, y: y });
        queue.push([nx, ny]);
      }
    }

    if (!prev.has(key(tx, ty))) return [];
    const out = [];
    let cur = { x: tx, y: ty };
    while (cur && !(cur.x === unit.x && cur.y === unit.y)) {
      out.unshift(cur);
      cur = prev.get(key(cur.x, cur.y));
    }
    return out;
  }

  return {
    COLS: COLS, ROWS: ROWS,
    inside: inside, key: key, dist: dist,
    movableTiles: movableTiles,
    tilesInRange: tilesInRange,
    burstTiles: burstTiles,
    path: path
  };
})();
