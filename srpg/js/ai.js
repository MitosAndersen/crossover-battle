// ============================================================
// AI — 敵フェイズの思考
// ============================================================
// 1体ぶんの「何をするか」を決めて返すだけ。実際に動かすのは main.js。
// 決め方を目で追えるように、判断は上から順に3段だけにしてある。
//
//   1. サポーターで、傷ついた仲間がいる → 支援を優先
//   2. その場から届く相手がいる         → 一番ダメージが出る技を撃つ
//   3. 届かない                         → 一番近い相手へ寄る。寄った先から届けば撃つ
// ============================================================

const SRPG_AI = (function () {

  const HEAL_THRESHOLD = 0.7;   // HPがこれを下回った仲間がいれば支援を優先

  // ---- 候補手の評価 ----------------------------------------
  // ある位置から action を撃ったときの「よさ」を数字にする。
  // 攻撃は与ダメージ合計、支援は回復量・付与できる相手の数で測る。
  function scoreAt(actor, action, fromX, fromY, aimX, aimY) {
    const saveX = actor.x, saveY = actor.y;
    actor.x = fromX; actor.y = fromY;
    const targets = SRPG_Battle.targetsFor(actor, action, aimX, aimY);
    let score = 0;

    if (targets.length > 0) {
      const s = action.raw;
      if ((s.power || 0) > 0) {
        targets.forEach(function (t) {
          const dmg = SRPG_Battle.estimateDamage(actor, action, t, targets.length);
          // 倒しきれるならその一手を強く推す
          score += Math.min(dmg, t.hpNow) + (dmg >= t.hpNow ? 25 : 0);
        });
      } else if (s.type === 'heal') {
        targets.forEach(function (t) {
          score += Math.min(s.healPower || 0, t.hpMax - t.hpNow);   // 満タン相手には価値なし
        });
      } else {
        // 強化・妨害。すでに同じものが付いている相手は数えない
        targets.forEach(function (t) {
          const ef = s.effect;
          if (!ef) return;
          if (SRPG_Battle.STATUS_INFO[ef] && SRPG_Battle.hasStatus(t, ef)) return;
          score += 8;
        });
      }
    }

    actor.x = saveX; actor.y = saveY;
    return score;
  }

  // ある位置から撃てる技と着弾点を総当たりして、一番よい手を返す
  function bestShotFrom(actor, actions, fromX, fromY) {
    let best = null;
    actions.forEach(function (action) {
      if (!SRPG_Battle.canPay(actor, action)) return;

      if (action.form === 'self') {
        const sc = scoreAt(actor, action, fromX, fromY, fromX, fromY);
        if (sc > 0 && (!best || sc > best.score)) {
          best = { action: action, aimX: fromX, aimY: fromY, score: sc };
        }
        return;
      }
      const aims = SRPG_Grid.tilesInRange(fromX, fromY, actor.range);
      // 味方に向ける技は自分の足元も着弾点にできる（プレイヤー側と同じ扱い）
      if (action.side === 'own') aims.push({ x: fromX, y: fromY });
      aims.forEach(function (t) {
        const sc = scoreAt(actor, action, fromX, fromY, t.x, t.y);
        if (sc > 0 && (!best || sc > best.score)) {
          best = { action: action, aimX: t.x, aimY: t.y, score: sc };
        }
      });
    });
    return best;
  }

  // ---- 1体ぶんの行動を決める --------------------------------
  // 返り値: { moveTo: {x,y} | null, shot: {action, aimX, aimY} | null }
  function decide(actor) {
    const all = SRPG_Units.actionsOf(actor).filter(function (a) { return !a.unsupported; });
    const attacks = all.filter(function (a) { return (a.raw.power || 0) > 0; });
    const supports = all.filter(function (a) { return (a.raw.power || 0) === 0; });
    const foes = SRPG_Battle.living(SRPG_Battle.other(actor.side));
    if (foes.length === 0) return { moveTo: null, shot: null };

    // 1. サポーターの支援。傷ついた仲間がいるときだけ考える
    if (actor.role === 'support') {
      const hurt = SRPG_Battle.living(actor.side).some(function (u) {
        return u.hpNow < u.hpMax * HEAL_THRESHOLD;
      });
      if (hurt) {
        const help = bestShotFrom(actor, supports, actor.x, actor.y);
        if (help) return { moveTo: null, shot: help };
      }
    }

    // 2. その場から撃てるか
    const here = bestShotFrom(actor, all, actor.x, actor.y);
    if (here) return { moveTo: null, shot: here };

    // 3. 移動先を選ぶ。撃てる場所があればそこ、無ければ一番近づける場所
    const tiles = SRPG_Grid.movableTiles(actor, SRPG_Battle.occupiedBy);
    let bestMove = null;

    tiles.forEach(function (t) {
      const shot = bestShotFrom(actor, attacks.length ? attacks : all, t.x, t.y);
      const near = Math.min.apply(null, foes.map(function (f) {
        return SRPG_Grid.dist(t.x, t.y, f.x, f.y);
      }));
      // 撃てる手があるマスを最優先。同点なら相手に近いほうを選ぶ
      const rank = (shot ? 1000 + shot.score : 0) - near;
      if (!bestMove || rank > bestMove.rank) {
        bestMove = { rank: rank, tile: t, shot: shot };
      }
    });

    if (!bestMove) return { moveTo: null, shot: null };

    // その場に留まったほうが近いなら動かない
    const stayNear = Math.min.apply(null, foes.map(function (f) {
      return SRPG_Grid.dist(actor.x, actor.y, f.x, f.y);
    }));
    const moveNear = Math.min.apply(null, foes.map(function (f) {
      return SRPG_Grid.dist(bestMove.tile.x, bestMove.tile.y, f.x, f.y);
    }));
    if (!bestMove.shot && moveNear >= stayNear) return { moveTo: null, shot: null };

    return { moveTo: bestMove.tile, shot: bestMove.shot };
  }

  return { decide: decide };
})();
