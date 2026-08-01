// ============================================================
// BATTLE ENGINE v6
// - No ATK stat: base damage = skill.power
// - No critical hits
// - Side-turn system: player turn (all allies act in any order) → enemy turn → repeat
// - First turn: player goes first 70%, enemy goes first 30%
// - enemy.powerScale: loop difficulty multiplier
// - executeAllySkill / executeEnemyTurn return {results,skill} (no callback)
// ============================================================
const Battle = (() => {

  let state = null;
  let _phaseActorIsEnemy = false; // 直近の applySkill の行動者が敵か（justApplied 判定用）

  function initBattle({ allies, enemies, battleNum }) {
    state = {
      allies,
      enemies,
      battleNum,
      seriesBonuses: []
    };

    // 同作品シリーズボーナス計算
    const originCounts = {};
    allies.forEach(a => {
      const o = a.origin || '';
      if (o) originCounts[o] = (originCounts[o] || 0) + 1;
    });
    allies.forEach(a => {
      const cnt = originCounts[a.origin || ''] || 0;
      if (cnt >= 3) {
        a.seriesAtkBonus = 1.40;
        a.seriesDefBonus = 0.80;
      } else if (cnt >= 2) {
        a.seriesAtkBonus = 1.20;
        a.seriesDefBonus = 0.90;
      } else {
        a.seriesAtkBonus = 1.0;
        a.seriesDefBonus = 1.0;
      }
    });
    // ボーナス発動時はパーティ全員に最高ティアを適用
    const bestAtk = Math.max(...allies.map(a => a.seriesAtkBonus));
    const bestDef = Math.min(...allies.map(a => a.seriesDefBonus));
    if (bestDef < 1.0) {
      allies.forEach(a => { a.seriesAtkBonus = bestAtk; a.seriesDefBonus = bestDef; });
    }
    state.seriesBonuses = Object.entries(originCounts)
      .filter(([, cnt]) => cnt >= 2)
      .map(([origin, cnt]) => ({ origin, cnt }));

    // パッシブ：戦闘開始時効果
    allies.forEach(a => {
      const p = a.passive;
      if (!p) return;
      if (p.type === 'battle_start_atk') {
        applyStatusEffect(a, 'atk_up', p.turns || 2, true);
      }
      // 複数バフ（攻防バフや自己デバフ等）を自分に付与
      if (p.type === 'battle_start_buffs') {
        (p.buffs || []).forEach(b => applyStatusEffect(a, b, p.turns || 2, true));
      }
      if (p.type === 'battle_start_barrier') {
        a.hasBarrier = true;
      }
      if (p.type === 'shield_start') {
        a.shieldHp = Math.min(a.maxHp, (a.shieldHp || 0) + Math.floor(a.maxHp * (p.value || 0.15)));
      }
      if (p.type === 'battle_start_team_shield') {
        state.allies.forEach(ally => {
          ally.shieldHp = Math.min(ally.maxHp, (ally.shieldHp || 0) + Math.floor(ally.maxHp * (p.value || 0.15)));
        });
      }
      // チーム全体パッシブ
      if (p.type === 'battle_start_team_atk') {
        state.allies.forEach(ally => applyStatusEffect(ally, 'atk_up', p.turns || 2, true));
      }
      if (p.type === 'battle_start_team_barrier') {
        state.allies.forEach(ally => { ally.hasBarrier = true; });
      }
      if (p.type === 'enemy_debuff_start') {
        const debuffType = p.debuff || 'atk_down';
        state.enemies.forEach(enemy => applyStatusEffect(enemy, debuffType, p.turns || 2, true));
      }
      if (p.type === 'battle_start_team_def') {
        state.allies.forEach(ally => applyStatusEffect(ally, 'def_up', p.turns || 2, true));
      }
      if (p.type === 'battle_start_team_atk_def') {
        state.allies.forEach(ally => {
          applyStatusEffect(ally, 'atk_up', p.turns || 2, true);
          applyStatusEffect(ally, 'def_up', p.turns || 2, true);
        });
      }
      if (p.type === 'compound') {
        p.effects?.forEach(eff => {
          if (eff.type === 'battle_start_atk') applyStatusEffect(a, 'atk_up', eff.turns || 2, true);
          if (eff.type === 'battle_start_barrier') a.hasBarrier = true;
        });
      }
    });

    // パッシブ：ボス・中ボスの戦闘開始時効果（ATK UP / バリア / 味方デバフ）
    state.enemies.forEach(e => {
      const p = e.passive;
      if (!p) return;
      if (p.type === 'battle_start_atk') {
        applyStatusEffect(e, 'atk_up', p.turns || 2, true);
      }
      if (p.type === 'battle_start_def') {
        applyStatusEffect(e, 'def_up', p.turns || 3, true);
      }
      if (p.type === 'battle_start_buffs') {
        (p.buffs || []).forEach(b => applyStatusEffect(e, b, p.turns || 2, true));
      }
      if (p.type === 'battle_start_barrier') {
        e.hasBarrier = true;
      }
      if (p.type === 'enemy_debuff_start') {
        state.allies.forEach(ally => applyStatusEffect(ally, 'atk_down', p.turns || 2, true));
      }
      if (p.type === 'compound') {
        p.effects?.forEach(eff => {
          if (eff.type === 'battle_start_atk') applyStatusEffect(e, 'atk_up', eff.turns || 2, true);
          if (eff.type === 'battle_start_barrier') e.hasBarrier = true;
          if (eff.type === 'shield_start') {
            e.shieldHp = Math.min(e.maxHp, (e.shieldHp || 0) + Math.floor(e.maxHp * (eff.value || 0.15)));
          }
        });
      }
    });

    return state;
  }

  function getLivingAllies()  { return state.allies.filter(a => !a.isDefeated); }
  function getLivingEnemies() { return state.enemies.filter(e => !e.isDefeated); }

  function resolveTargets(skill, actor, chosenTarget = null) {
    const liveAllies  = getLivingAllies();
    const liveEnemies = getLivingEnemies();
    switch (skill.target) {
      case 'single':
        if (chosenTarget) return [chosenTarget];
        if (actor.isEnemy) {
          // タンクが生存中なら単体攻撃・デバフは常にタンクへ向かう
          const tank = liveAllies.find(a => a.role === 'tank');
          if (tank) return [tank];
          // 事前確定ターゲットが生存していればそれを使う（ミスマッチバグ修正）
          if (actor._nextTarget && !actor._nextTarget.isDefeated) {
            return [actor._nextTarget];
          }
          return [liveAllies[Math.floor(Math.random() * liveAllies.length)]];
        }
        return [liveEnemies[0]];
      case 'all':
        return actor.isEnemy ? liveAllies : liveEnemies;
      case 'all_enemy':
        return actor.isEnemy ? liveEnemies : liveAllies;
      case 'all_ally':
        return liveAllies;
      case 'self':
        return [actor];
      case 'dead_ally':
        if (chosenTarget) return [chosenTarget];
        return state.allies.filter(a => a.isDefeated);
      default:
        return [actor];
    }
  }

  // 撃破時パッシブ（on_kill_atk / on_kill_sp）。「味方が敵を倒した」ときのみ発動し、
  // 撃破手段（通常ダメージ／即死／カウンター反射／棘反射）を問わず同じ効果を出す。
  // killer=倒した側、victim=倒された側
  function applyOnKillPassives(killer, victim, results) {
    if (!killer || !victim) return;
    if (!victim.isEnemy || killer.isEnemy || killer.isDefeated) return;
    const p = killer.passive;
    if (p?.type === 'on_kill_atk') {
      applyStatusEffect(killer, 'atk_up', p.turns || 2);
      results.push({ type: 'passive_proc', target: killer, name: p.name, text: '撃破で攻撃UP！' });
    }
    if (p?.type === 'on_kill_sp') {
      const gs = window.gameState;
      const amt = p.amount ?? 1;
      if (gs) gs.sp = Math.min(gs.maxSp ?? 5, (gs.sp ?? 0) + amt);
      results.push({ type: 'passive_proc', target: killer, name: p.name, text: `撃破でSP+${amt}！` });
    }
  }

  function applySkill(actor, skill, targets, usedSkillId = null) {
    const results = [];
    _phaseActorIsEnemy = actor.isEnemy; // justApplied判定用（敵ターン中の付与のみ初回減算をスキップ）

    // 仲間を呼ぶ（敵専用）：生成はmain.js側（loopCountスケーリングのため）
    if (skill.type === 'summon') {
      results.push({ type: 'summon_request', target: actor });
      return results;
    }

    // 蘇生スキル（死者がいれば蘇生、いなくても alsoHealAll の全体回復は発動）
    if (skill.type === 'revive') {
      const dead = state.allies.filter(a => a.isDefeated);
      const reviveTarget = targets[0] ?? dead[dead.length - 1] ?? null;
      if (reviveTarget) {
        reviveTarget.isDefeated = false;
        reviveTarget.hp = Math.floor(reviveTarget.maxHp * 0.3);
        reviveTarget.statusEffects = [];
        reviveTarget.shieldHp = 0;
        results.push({ type: 'revive', target: reviveTarget });
      }
      return results;
    }

    if (skill.type === 'heal') {
      let healMult = (!actor.isEnemy && typeof Relics !== 'undefined') ? Relics.getHealMultiplier() : 1.0;
      // パッシブ：heal_boost（自分の回復量アップ）
      if (actor.passive?.type === 'heal_boost') healMult *= (1 + actor.passive.value);
      targets.forEach(target => {
        if (target.isDefeated) return;
        const base = Math.floor((skill.healPower || 20) * (actor.atkMult || 1.0));
        const heal = Math.floor(base * healMult);
        const prev = target.hp;
        target.hp = Math.min(target.maxHp, target.hp + heal);
        results.push({ type: 'heal', target, amount: target.hp - prev });
        if (skill.shieldOnHeal) {
          target.shieldHp = Math.min(target.maxHp, (target.shieldHp || 0) + skill.shieldOnHeal);
          results.push({ type: 'self_shield', target, amount: skill.shieldOnHeal });
        }
        // 回復スキルの付随効果（リジェネ等）を付与
        [skill.effect, skill.alsoEffect2, skill.alsoEffect3].forEach(ef => {
          if (!ef) return;
          if (Math.random() < (skill.effectChance || 1)) {
            const applied = applyStatusEffect(target, ef, skill.effectTurns || 3);
            if (applied) results.push({ type: 'status', target, effect: ef });
          }
        });
      });
      if (skill.selfEffect && !actor.isDefeated) {
        applyStatusEffect(actor, skill.selfEffect, skill.selfEffectTurns || 2);
        results.push({ type: 'self_effect', target: actor, effect: skill.selfEffect });
      }
      return results;
    }

    if (skill.type === 'support') {
      targets.forEach(target => {
        if (target.isDefeated) return;
        const tankBlocked = target._isTankBlocking || false;
        const tankProtecting = target._tankProtecting || null;
        if (tankBlocked) { target._isTankBlocking = false; target._tankProtecting = null; }
        if (skill.effect === 'guard') {
          target.isGuarding = true;
          results.push({ type: 'status', target, effect: 'guard', tankBlocked, tankProtecting });
          return;
        }
        if (skill.effect === 'sp_restore') {
          const restoreAmt = skill.effectValue ?? 2;
          const gs = window.gameState;
          if (gs) gs.sp = Math.min(gs.maxSp ?? 5, (gs.sp ?? 0) + restoreAmt);
          results.push({ type: 'status', target, effect: 'sp_restore', tankBlocked, tankProtecting });
          return;
        }
        if (skill.effect === 'dispel') {
          ['atk_up', 'def_up', 'regen'].forEach(t => {
            if (target.statusEffects.some(e => e.type === t)) removeStatusEffect(target, t);
          });
          target.hasBarrier = false;
          target.shieldHp = 0;
          results.push({ type: 'status', target, effect: 'dispel', tankBlocked, tankProtecting });
          return;
        }
        if (skill.effect === 'shield') {
          target.shieldHp = Math.min(target.maxHp, (target.shieldHp || 0) + (skill.shieldPower || 20));
          results.push({ type: 'status', target, effect: 'shield', tankBlocked, tankProtecting });
          return;
        }
        if (skill.effect) {
          if (Math.random() < (skill.effectChance || 1)) {
            const applied = applyStatusEffect(target, skill.effect, skill.effectTurns || 3);
            if (applied) {
              results.push({ type: 'status', target, effect: skill.effect, tankBlocked, tankProtecting });
            } else {
              results.push({ type: 'status_miss', target, effect: skill.effect, tankBlocked, tankProtecting });
            }
          } else {
            results.push({ type: 'status_miss', target, effect: skill.effect, tankBlocked, tankProtecting });
          }
        }
      });
      [skill.alsoEffect2, skill.alsoEffect3].forEach(extraEf => {
        if (!extraEf) return;
        targets.forEach(t => {
          if (t.isDefeated) return;
          const applied = applyStatusEffect(t, extraEf, skill.effectTurns || 3);
          if (applied) results.push({ type: 'status', target: t, effect: extraEf });
          else results.push({ type: 'status_miss', target: t, effect: extraEf });
        });
      });
      return results;
    }

    const effectApplied = new Set();
    const effectMissed = new Set(); // レジスト報告済み（target.id + ':' + effect）— 多段ヒットでの重複表示防止

    // Damage
    for (let hit = 0; hit < (skill.hits || 1); hit++) {
      targets.forEach(target => {
        if (target.isDefeated) return;

        if (target.hasBarrier) {
          target.hasBarrier = false;
          results.push({ type: 'barrier', target });
          if (!skill.shieldBreak || actor.isEnemy) return;
        }

        if (skill.instantKillChance && !target.isBoss && Math.random() < skill.instantKillChance) {
          target.hp = 0;
          target.isDefeated = true;
          results.push({ type: 'instakill', target });
          applyOnKillPassives(actor, target, results);
          return;
        }

        let dmg = skill.power || 0;
        if (skill.target === 'all' && !skill.noSpread) dmg *= Math.pow(0.8, targets.length - 1);
        dmg *= actor.statMods.atk;
        dmg *= (actor.seriesAtkBonus || 1.0); // シリーズ攻撃ボーナス
        dmg *= (actor.atkMult || 1.0);
        if (actor.powerScale) dmg *= actor.powerScale; // loop difficulty scaling
        // パッシブ：敵の atk_boost（passivePowerMult）
        if (actor.passivePowerMult) dmg *= actor.passivePowerMult;
        // レリック攻撃力ボーナス（味方のみ）
        if (!actor.isEnemy && typeof Relics !== 'undefined') {
          dmg *= Relics.getAtkMultiplier(actor, skill);
        }
        // パッシブ：ATK系ブースト
        const _ap = actor.passive;
        // low_hp_atk: ダメージ乗算なし（覚醒時にATK UPバフを付与する方式に変更）
        if (_ap?.type === 'atk_hp_drain') dmg *= (1 + _ap.value.atk);
        if (_ap?.type === 'berserk' && actor.hp <= actor.maxHp * _ap.value.threshold) {
          dmg *= (1 + _ap.value.atk);
        }
        // パッシブ：exploit_status（対象が特定の状態異常中なら与ダメ増）
        if (_ap?.type === 'exploit_status' && target.statusEffects?.some(e => e.type === _ap.effect)) {
          dmg *= (1 + _ap.value);
        }
        // パッシブ：multi_hit_boost（連続ヒット技強化）
        if (_ap?.type === 'multi_hit_boost' && (skill.hits || 1) > 1) dmg *= (1 + _ap.value);
        // パッシブ：basic_atk_boost（通常攻撃強化）
        if (_ap?.type === 'basic_atk_boost' && skill.noSP) dmg *= (1 + _ap.value);
        // パッシブ：boss_damage（ボス・中ボス特効）
        if (_ap?.type === 'boss_damage' && (target.isBoss || target.isMidBoss)) dmg *= (1 + _ap.value);
        // スキル固有ボス特攻
        if (skill.bossBonus && (target.isBoss || target.isMidBoss)) dmg *= (1 + skill.bossBonus);
        if (_ap?.type === 'compound') {
          _ap.effects?.forEach(eff => {
            if (eff.type === 'atk_boost') dmg *= (1 + eff.value);
            if (eff.type === 'low_hp_atk' && actor.hp <= actor.maxHp * (eff.threshold || 0.5)) dmg *= (1 + eff.value);
          });
        }
        dmg = Math.max(1, Math.floor(dmg));

        const tankBlocked = target._isTankBlocking || false;
        const tankProtecting = target._tankProtecting || null;
        if (tankBlocked) { target._isTankBlocking = false; target._tankProtecting = null; }

        if (target.isGuarding) {
          dmg = Math.floor(dmg * 0.5);
        }
        dmg = Math.floor(dmg * target.statMods.defMult);
        if (!target.isEnemy) {
          dmg = Math.floor(dmg * (target.seriesDefBonus || 1.0)); // シリーズ防御ボーナス
          if (typeof Relics !== 'undefined') dmg = Math.floor(dmg * Relics.getDefMultiplier(target)); // レリック防御ボーナス
        }
        // レリック：ボス・中ボス特効（味方→ボス格の敵）
        if (!actor.isEnemy && target.isEnemy && typeof Relics !== 'undefined') {
          dmg = Math.floor(dmg * Relics.getBossDamageMultiplier(target));
        }
        // スキル：ボス特攻（ボス・中ボスへ1.3倍）
        if (skill.bossKiller && (target.isBoss || target.isMidBoss)) {
          dmg = Math.floor(dmg * 1.3);
        }
        // スキル：追撃（HP70%以下の敵へ1.2倍）
        if (skill.execute && target.hp <= target.maxHp * 0.7) {
          dmg = Math.floor(dmg * 1.2);
        }
        // パッシブ：passiveDefMult（def_boost）
        const passiveDefMult = target.passiveDefMult || 1;
        if (passiveDefMult !== 1) dmg = Math.floor(dmg * passiveDefMult);
        // デメリットパッシブ：被ダメ増加
        const _tp = target.passive;
        if (_tp?.type === 'counter_vulnerable') dmg = Math.floor(dmg * (1 + _tp.value.penalty));
        if (_tp?.type === 'berserk' && target.hp <= target.maxHp * _tp.value.threshold) {
          dmg = Math.floor(dmg * (1 + _tp.value.penalty));
        }
        dmg = Math.max(1, dmg);

        // シールドHP吸収（全吸収でも状態異常付与は後段で判定する）
        let shieldAbsorbed = false;
        if (target.shieldHp > 0 && (!skill.shieldBreak || actor.isEnemy)) {
          if (dmg <= target.shieldHp) {
            target.shieldHp -= dmg;
            results.push({ type: 'shield_block', target, amount: dmg, tankBlocked, tankProtecting });
            shieldAbsorbed = true;
            dmg = 0; // HPダメージなし。以降の dmg>0 判定（反撃・吸収等）は自然にスキップされる
          } else {
            dmg -= target.shieldHp;
            target.shieldHp = 0;
          }
        }
        if (skill.shieldBreak && !actor.isEnemy) target.shieldHp = 0;

        target.hp = Math.max(0, target.hp - dmg);
        if (target.hp === 0) {
          const surv = checkFatalSurvival(target);
          if (surv === 'guts') {
            results.push({ type: 'damage', target, amount: dmg, tankBlocked, tankProtecting });
            results.push({ type: 'passive_proc', target, name: target.passive.name, text: 'HP1で耐えた！' });
          } else if (surv === 'survive_relic') {
            results.push({ type: 'damage', target, amount: dmg, tankBlocked, tankProtecting });
            results.push({ type: 'survive_fatal', target });
          } else if (surv === 'revive') {
            results.push({ type: 'damage', target, amount: dmg, tankBlocked, tankProtecting });
            results.push({ type: 'revive', target });
          } else { // dead
            results.push({ type: 'damage', target, amount: dmg, tankBlocked, tankProtecting, isKill: true });
            applyOnKillPassives(actor, target, results);
          }
        } else if (!shieldAbsorbed) {
          results.push({ type: 'damage', target, amount: dmg, tankBlocked, tankProtecting });
        }
        // パッシブ：低HP覚醒
        const push = r => results.push(r);
        checkLowHpAwakening(target, push, push);
        // パッシブ：counter / counter_vulnerable（味方が敵から攻撃を受けたとき反射）
        if (_tp?.type === 'counter' && !target.isEnemy && actor.isEnemy && dmg > 0 && !target.isDefeated && !actor.isDefeated) {
          const counterDmg = Math.max(1, Math.floor(dmg * _tp.value));
          actor.hp = Math.max(0, actor.hp - counterDmg);
          if (actor.hp <= 0) actor.isDefeated = true;
          results.push({ type: 'counter', target: actor, amount: counterDmg, source: target });
          if (actor.isDefeated) applyOnKillPassives(target, actor, results);
        }
        if (_tp?.type === 'counter_vulnerable' && !target.isEnemy && actor.isEnemy && dmg > 0 && !target.isDefeated && !actor.isDefeated) {
          const counterDmg = Math.max(1, Math.floor(dmg * _tp.value.reflect));
          actor.hp = Math.max(0, actor.hp - counterDmg);
          if (actor.hp <= 0) actor.isDefeated = true;
          results.push({ type: 'counter', target: actor, amount: counterDmg, source: target });
          if (actor.isDefeated) applyOnKillPassives(target, actor, results);
        }
        // パッシブ：counter_status（被弾時、攻撃してきた敵に状態異常付与）
        if (_tp?.type === 'counter_status' && !target.isEnemy && actor.isEnemy && dmg > 0 && !target.isDefeated && !actor.isDefeated) {
          if (Math.random() < (_tp.chance || 0.15)) {
            const csApplied = applyStatusEffect(actor, _tp.effect, _tp.turns || 1);
            if (csApplied) results.push({ type: 'status', target: actor, effect: _tp.effect });
          }
        }


        // レリック：thorns（味方が被弾時、攻撃した敵に一部反射）
        if (!target.isEnemy && actor.isEnemy && dmg > 0 && !target.isDefeated && !actor.isDefeated && typeof Relics !== 'undefined') {
          const thornsPct = Relics.getThornsPct();
          if (thornsPct > 0) {
            const thornsDmg = Math.max(1, Math.floor(dmg * thornsPct));
            actor.hp = Math.max(0, actor.hp - thornsDmg);
            if (actor.hp <= 0) actor.isDefeated = true;
            results.push({ type: 'reflect_dmg', target: actor, amount: thornsDmg, source: target });
            if (actor.isDefeated) applyOnKillPassives(target, actor, results);
          }
        }

        // 直前の反射ダメージ(thorns)で行動者が倒れている場合がある。
        // isDefeated を見ないと HP が 0 を超えて「倒れているのに生きている」状態になるため、
        // recoil / lifesteal と同じく除外する
        if (skill.healSelf && !actor.isDefeated) {
          const healAmt = Math.floor(dmg * skill.healSelf);
          actor.hp = Math.min(actor.maxHp, actor.hp + healAmt);
          results.push({ type: 'drain', target: actor, amount: healAmt });
        }

        // レリック：lifesteal（味方の与ダメの一部を吸収）
        if (!actor.isEnemy && target.isEnemy && dmg > 0 && !actor.isDefeated &&
            typeof Relics !== 'undefined') {
          const lsPct = Relics.getLifestealPct();
          if (lsPct > 0) {
            const lsAmt = Math.max(1, Math.floor(dmg * lsPct));
            actor.hp = Math.min(actor.maxHp, actor.hp + lsAmt);
            results.push({ type: 'drain', target: actor, amount: lsAmt });
          }
        }
        // パッシブ：lifesteal（与ダメ吸収）
        if (!actor.isEnemy && target.isEnemy && dmg > 0 && !actor.isDefeated &&
            actor.passive?.type === 'lifesteal') {
          const plsAmt = Math.max(1, Math.floor(dmg * actor.passive.value));
          actor.hp = Math.min(actor.maxHp, actor.hp + plsAmt);
          results.push({ type: 'drain', target: actor, amount: plsAmt });
        }

        // レリック：攻撃時の状態異常付与（ヒットごとに独立判定・付与済みの異常はスキップするのでログは最大1行）
        if (!actor.isEnemy && (skill.power || 0) > 0 && !target.isDefeated && typeof Relics !== 'undefined') {
          Relics.getStatusChanceProcs().forEach(proc => {
            if (target.statusEffects.some(e => e.type === proc.effect)) return;
            if (Math.random() < proc.value) {
              const procApplied = applyStatusEffect(target, proc.effect, 2);
              if (procApplied) results.push({ type: 'status', target, effect: proc.effect });
            }
          });
        }

        if (skill.effect && !effectApplied.has(target)) {
          const reportMiss = (effect) => {
            const key = target.id + ':' + effect;
            if (effectMissed.has(key)) return;
            effectMissed.add(key);
            results.push({ type: 'status_miss', target, effect });
          };
          const effChance = skill.effectChance || 0;
          if (Math.random() < effChance) {
            let applyStatus = true;
            // 敵が味方に状態異常を与えようとする場合、レリック耐性チェック
            if (actor.isEnemy && !target.isEnemy && typeof Relics !== 'undefined') {
              const resist = Relics.getStatusResistReduction();
              if (Math.random() < resist) applyStatus = false;
            }
            if (applyStatus) {
              const applied = applyStatusEffect(target, skill.effect, skill.effectTurns || 2);
              if (applied) {
                results.push({ type: 'status', target, effect: skill.effect });
                effectApplied.add(target);
              } else {
                reportMiss(skill.effect);
              }
              // 追加効果（alsoEffect2/3）：メイン効果がブロックされても独立に判定
              [skill.alsoEffect2, skill.alsoEffect3].forEach(extraEf => {
                if (!extraEf) return;
                const applied2 = applyStatusEffect(target, extraEf, skill.effectTurns || 2);
                if (applied2) {
                  results.push({ type: 'status', target, effect: extraEf });
                  effectApplied.add(target);
                } else {
                  reportMiss(extraEf);
                }
              });
            } else {
              // レリック耐性でレジスト
              reportMiss(skill.effect);
            }
          }
        }
      });
    }
    // selfShieldPower: 攻撃と同時に自分へシールド付与
    if (skill.selfShieldPower && !actor.isDefeated) {
      actor.shieldHp = Math.min(actor.maxHp, (actor.shieldHp || 0) + skill.selfShieldPower);
      results.push({ type: 'self_shield', target: actor, amount: skill.selfShieldPower });
    }
    // 自傷（recoil）：HP1以下にはならない
    if (skill.recoilPct && !actor.isDefeated) {
      const recoilDmg = Math.max(1, Math.floor(actor.maxHp * skill.recoilPct));
      actor.hp = Math.max(1, actor.hp - recoilDmg);
      results.push({ type: 'recoil', target: actor, amount: recoilDmg });
    }
    // 自己スタン（selfStun）：使用後1T行動不能
    if (skill.selfStun && !actor.isDefeated) {
      applyStatusEffect(actor, 'stun', 1);
      results.push({ type: 'self_stun', target: actor });
    }
    // 自己状態異常（selfEffect）
    if (skill.selfEffect && !actor.isDefeated) {
      applyStatusEffect(actor, skill.selfEffect, skill.selfEffectTurns || 2);
      results.push({ type: 'self_effect', target: actor, effect: skill.selfEffect });
    }
    // 巻き込みダメージ（allySplash）：爆発等で他の味方にも小ダメージ
    if (skill.allySplash && !actor.isEnemy) {
      const splashBase = Math.max(1, Math.floor(skill.power * 0.2 * skill.allySplash));
      getLivingAllies().filter(a => a !== actor && !a.isDefeated).forEach(a => {
        const actualDmg = Math.max(1, Math.floor(splashBase * (a.statMods?.defMult || 1)));
        a.hp = Math.max(0, a.hp - actualDmg);
        if (a.hp === 0) a.isDefeated = true;
        results.push({ type: 'ally_splash', target: a, amount: actualDmg });
      });
    }
    return results;
  }

  function applyStatusEffect(target, effectType, turns, skipJustApplied = false) {
    // 中ボス・ボスはスタンデフォルト無効
    if (effectType === 'stun' && (target.isBoss || target.isMidBoss)) return false;
    // パッシブ：status_immune チェック（自己）
    const _sip = target.passive;
    if (_sip?.type === 'status_immune' && _sip.targets?.includes(effectType)) return false;
    if (_sip?.type === 'compound' && _sip.effects?.some(e => e.type === 'status_immune' && e.targets?.includes(effectType))) return false;
    // 純粋 status_immune は仲間全体にオーラとして適用
    if (!target.isEnemy) {
      const hasAura = getLivingAllies().some(a => a !== target && a.passive?.type === 'status_immune' && a.passive?.targets?.includes(effectType));
      if (hasAura) return false;
    }
    // 状態異常免疫チェック（日輪刀等）
    if (!target.isEnemy && typeof Relics !== 'undefined' && Relics.isImmuneTo(effectType)) return false;
    // 対立バフ/デバフの相殺
    const CANCEL_PAIRS = { atk_up: 'atk_down', atk_down: 'atk_up', def_up: 'def_down', def_down: 'def_up' };
    const opposite = CANCEL_PAIRS[effectType];
    if (opposite && target.statusEffects.some(e => e.type === opposite)) {
      removeStatusEffect(target, opposite);
    }

    const existing = target.statusEffects.find(e => e.type === effectType);
    if (existing) { existing.turns = Math.max(existing.turns, turns); return true; }

    switch (effectType) {
      case 'atk_up':   target.statMods.atk     *= 1.3; break;
      case 'atk_down': target.statMods.atk     *= 0.7; break;
      case 'def_up':   target.statMods.defMult *= 0.7; break;
      case 'def_down': target.statMods.defMult *= 1.3; break;
      case 'barrier':  target.hasBarrier = true; return true;
    }
    // 敵ターン中の付与のみ初回減算スキップ（自軍ターン中の付与は「付与ターン＝1ターン目」と数える）
    const needsJustApplied = !skipJustApplied && _phaseActorIsEnemy;
    target.statusEffects.push({ type: effectType, turns, justApplied: needsJustApplied });
    return true;
  }

  function removeStatusEffect(target, effectType) {
    target.statusEffects = target.statusEffects.filter(e => e.type !== effectType);
    switch (effectType) {
      case 'atk_up':   target.statMods.atk     /= 1.3; break;
      case 'atk_down': target.statMods.atk     /= 0.7; break;
      case 'def_up':   target.statMods.defMult /= 0.7; break;
      case 'def_down': target.statMods.defMult /= 1.3; break;
    }
  }

  // 根性・くいしばり・復活レリックの共通チェック
  // returns: 'guts' | 'survive_relic' | 'revive' | 'dead'
  function checkFatalSurvival(target) {
    if (!target.isEnemy && target.passive?.type === 'survive_fatal' && !target._gutsUsed) {
      target._gutsUsed = true;
      target.hp = 1;
      return 'guts';
    }
    if (!target.isEnemy && typeof Relics !== 'undefined' && Relics.trySurviveFatal(target)) return 'survive_relic';
    const revivedByRelic = !target.isEnemy && typeof Relics !== 'undefined' && Relics.tryRevive(target);
    if (revivedByRelic) {
      target._lastReviveRelic = revivedByRelic;
      if (typeof ACH !== 'undefined') ACH.onRevive();
      return 'revive';
    }
    target.isDefeated = true;
    return 'dead';
  }

  // 低HP覚醒の共通チェック（味方・敵両対応）
  // statusPush: 味方覚醒時のステータス表示コールバック（省略可）
  function checkLowHpAwakening(target, pushResult, statusPush = null) {
    const p = target.passive;
    if (!p || target.isDefeated || target._awakened) return;
    if (!target.isEnemy && (p.type === 'low_hp_atk' || p.type === 'berserk')) {
      const thr = p.threshold || p.value?.threshold || 0.5;
      if (target.hp <= target.maxHp * thr) {
        target._awakened = true;
        const buffList = p.buffs || [p.buff || 'atk_up'];
        buffList.forEach(b => applyStatusEffect(target, b, p.turns || 2));
        const buffText = buffList.length > 1 ? '覚醒！'
          : (buffList[0] === 'def_up' ? '覚醒！防御UP！' : '覚醒！攻撃UP！');
        pushResult({ type: 'passive_proc', target, name: p.name, text: buffText });
        if (statusPush) buffList.forEach(b => statusPush({ type: 'status', target, effect: b }));
      }
    } else if (target.isEnemy && p.type === 'low_hp_atk') {
      const thr = p.threshold || 0.5;
      if (target.hp <= target.maxHp * thr) {
        target._awakened = true;
        const buffType = p.buff || 'atk_up';
        applyStatusEffect(target, buffType, p.turns || 2);
        const buffText = buffType === 'def_up' ? '防御UP！' : buffType === 'regen' ? '再生体制！' : '攻撃UP！';
        pushResult({ type: 'passive_proc', target, name: p.name, text: buffText });
      }
    }
  }

  function afterDotDamage(actor, ticks) {
    if (actor.hp === 0) {
      const surv = checkFatalSurvival(actor);
      if (surv === 'guts') ticks.push({ type: 'passive_proc', target: actor, name: actor.passive.name, text: 'HP1で耐えた！' });
      else if (surv === 'survive_relic') ticks.push({ type: 'survive_fatal', target: actor });
      else if (surv === 'revive') ticks.push({ type: 'revive_relic', target: actor });
      else return; // dead
    }
    checkLowHpAwakening(actor, r => ticks.push(r));
  }

  function tickStatusEffects(actor) {
    const ticks = [];
    if (actor.isDefeated) return ticks;
    actor.statusEffects.forEach(eff => {
      if (actor.isDefeated) return;
      if (eff.type === 'burn') {
        const dmg = Math.max(1, Math.floor(actor.maxHp * 0.03));
        actor.hp = Math.max(0, actor.hp - dmg);
        ticks.push({ type: 'burn_tick', target: actor, amount: dmg });
        afterDotDamage(actor, ticks);
      } else if (eff.type === 'poison') {
        const dmg = Math.max(1, Math.floor(actor.maxHp * 0.03));
        actor.hp = Math.max(0, actor.hp - dmg);
        ticks.push({ type: 'poison_tick', target: actor, amount: dmg });
        afterDotDamage(actor, ticks);
      } else if (eff.type === 'curse') {
        const dmg = Math.max(1, Math.floor(actor.maxHp * 0.03));
        actor.hp = Math.max(0, actor.hp - dmg);
        ticks.push({ type: 'curse_tick', target: actor, amount: dmg });
        afterDotDamage(actor, ticks);
      }
    });
    return ticks;
  }

  function decrementEffects(actor) {
    const toRemove = [];
    actor.statusEffects.forEach(eff => {
      if (eff.justApplied) { eff.justApplied = false; return; } // 付与ターンはスキップ
      eff.turns--;
      if (eff.turns <= 0) toRemove.push(eff.type);
    });
    toRemove.forEach(t => removeStatusEffect(actor, t));
  }

  function isStunned(actor) {
    return actor.statusEffects.some(e => e.type === 'stun');
  }

  function isParalyzed(actor) {
    return actor.statusEffects.some(e => e.type === 'paralyze');
  }

  function isFrozen(actor) {
    return actor.statusEffects.some(e => e.type === 'freeze');
  }

  function executeDefend(ally) {
    ally.isGuarding = true;
    return [{ type: 'status', target: ally, effect: 'guard' }];
  }

  function isBuffRedundant(skill, actor, livingAllies) {
    if (skill.type !== 'support') return false;
    if (skill.effect === 'barrier') return actor.hasBarrier;
    if (skill.effect === 'shield') return (actor.shieldHp || 0) > 0;
    const ALL_STATUS = ['atk_up','def_up','regen','atk_down','def_down','burn','poison','curse','stun','paralyze','freeze'];
    const buffTypes  = ['atk_up','def_up','regen','atk_down','def_down'];
    if (!skill.effect || !ALL_STATUS.includes(skill.effect)) return false;
    // self ターゲット（敵自身へのバフ）→ actor を見る
    if (!skill.target || skill.target === 'self') {
      const has = type => actor.statusEffects.some(e => e.type === type);
      const mainActive = has(skill.effect);
      const alsoActive = !skill.alsoEffect2 || !buffTypes.includes(skill.alsoEffect2) || has(skill.alsoEffect2);
      return mainActive && alsoActive;
    }
    // 全体/単体デバフ（ダメージなし）→ 生存する全員がすでにその状態なら無意味
    if ((skill.power || 0) === 0 && livingAllies && livingAllies.length > 0) {
      return livingAllies.every(a => a.statusEffects.some(e => e.type === skill.effect));
    }
    return false;
  }

  function enemyChooseSkill(enemy, allowCharge = true) {
    const all = enemy.skillIds || [];
    if (all.length === 0) return null;

    const filtered = all.filter(id => {
      const sk = ENEMY_SKILL_DATA[id];
      return !sk || !isBuffRedundant(sk, enemy, getLivingAllies());
    });
    const pool = filtered.length > 0 ? filtered : all;

    // チャージ型危険行動: 保持者のみ・1戦闘1回・全体で同時1体まで
    // ボス・中ボス(切り札)はHP60%以下で確定発動、雑魚は毎ターン35%抽選
    const forced = (typeof window !== 'undefined' && window._forceCharge);
    const chargeReady = forced
      || ((enemy.isBoss || enemy.isMidBoss)
          ? enemy.hp <= enemy.maxHp * 0.6
          : Math.random() < 0.35);
    if (allowCharge && enemy.chargeSkillId && !enemy._chargeUsed && !enemy._charging
        && !getLivingEnemies().some(e => e._charging)
        && chargeReady) {
      return enemy.chargeSkillId;
    }

    // サポーターは支援スキル（味方ヒール・バフ・デバフ）を75%確率で優先（単独生存時は20%）
    if (enemy.role === 'support') {
      const isAlone = getLivingEnemies().length === 1;
      // 仲間を呼ぶ（生存敵3体未満・雑魚のみ。単独残りなら50%で呼ぶ）
      if (!enemy.isBoss && !enemy.isMidBoss && getLivingEnemies().length < 3
          && Math.random() < (isAlone ? 0.5 : 0.25)) {
        return 'e_call_ally';
      }
      const suppSkills = pool.filter(id => {
        const sk = ENEMY_SKILL_DATA[id];
        return sk && (sk.type === 'heal' || (sk.type === 'support' && sk.target !== 'single'));
      });
      if (suppSkills.length > 0 && Math.random() < (isAlone ? 0.20 : 0.75)) {
        return suppSkills[Math.floor(Math.random() * suppSkills.length)];
      }
    }

    const healSkills = pool.filter(id => ENEMY_SKILL_DATA[id]?.type === 'heal');
    if (enemy.hp / enemy.maxHp < 0.35 && healSkills.length > 0 && Math.random() < 0.65) {
      return healSkills[0];
    }
    if (enemy.isBoss) {
      const aoeSkills = pool.filter(id => {
        const sk = ENEMY_SKILL_DATA[id];
        return sk && sk.target === 'all' && sk.type !== 'support' && sk.type !== 'heal';
      });
      if (aoeSkills.length > 0 && Math.random() < 0.35) {
        return aoeSkills[Math.floor(Math.random() * aoeSkills.length)];
      }
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function planNextAction(enemy, allowCharge = true) {
    let skillId;
    if (enemy._charging) {
      skillId = enemy._charging.skillId; // チャージ中は再抽選せずピン留め
    } else {
      skillId = enemyChooseSkill(enemy, allowCharge);
      const chosen = skillId ? ENEMY_SKILL_DATA[skillId] : null;
      if (chosen && chosen.chargeTurns) {
        // turnsLeft は発動する敵ターンを含めた残り敵行動回数
        enemy._charging = { skillId, turnsLeft: chosen.chargeTurns + 1 };
      }
    }
    enemy._nextSkillId = skillId;
    const skill = skillId ? ENEMY_SKILL_DATA[skillId] : null;
    enemy._nextTarget = null;
    enemy._nextTargetEmoji = null;
    if (skill && skill.target === 'single') {
      const liveAllies = getLivingAllies();
      const tank = liveAllies.find(a => a.role === 'tank');
      const t = tank || liveAllies[Math.floor(Math.random() * liveAllies.length)];
      if (t) {
        enemy._nextTarget = t;
        enemy._nextTargetEmoji = t.emoji;
      }
    }
    return skill;
  }

  // Returns {results, skill, skillId} — no callback
  function executeEnemyTurn(enemy) {
    if (enemy._charging) {
      const chargeSkill = ENEMY_SKILL_DATA[enemy._charging.skillId];
      if (enemy._charging.turnsLeft > 1) {
        // チャージ継続: このターンは行動せず溜める
        enemy._charging.turnsLeft--;
        return { results: [], skill: chargeSkill, skillId: enemy._charging.skillId,
                 charging: true, turnsLeft: enemy._charging.turnsLeft };
      }
      // turnsLeft === 1 → 発動
      const chargeSkillId = enemy._charging.skillId;
      enemy._charging = null;
      enemy._chargeUsed = true;
      enemy._nextSkillId = null;
      const chargeTargets = resolveTargets(chargeSkill, enemy);
      enemy._nextTarget = null;
      enemy._nextTargetEmoji = null;
      return { results: applySkill(enemy, chargeSkill, chargeTargets),
               skill: chargeSkill, skillId: chargeSkillId, chargeFired: true };
    }
    const skillId = enemy._nextSkillId || enemyChooseSkill(enemy);
    enemy._nextSkillId = null;
    const skill = ENEMY_SKILL_DATA[skillId];
    if (!skill) return { results: [], skill: null, skillId: null };
    const targets = resolveTargets(skill, enemy);
    enemy._nextTarget = null;
    enemy._nextTargetEmoji = null;
    const results = applySkill(enemy, skill, targets);
    return { results, skill, skillId };
  }

  // Returns {results, skill} — no callback
  function executeAllySkill(ally, skillId, chosenTarget) {
    if (skillId === 'defend') {
      return { results: executeDefend(ally), skill: { name:'防御', animation:'buff', type:'support' } };
    }
    const skill = SKILL_DATA[skillId];
    if (!skill) return { results: [], skill: null };

    if (!skill.noSP) {
      const spCost = skill.spCost ?? 5;
      const gs = window.gameState;
      if ((gs?.sp ?? 5) < spCost) return { results: [], skill: null };
      const isFree = typeof Relics !== 'undefined' && Relics.hasSpFreeChance() && Math.random() < 0.10;
      if (isFree) { if (gs) gs._lastSpFree = true; }
      else { if (gs) gs.sp = (gs.sp ?? 5) - spCost; }
    }

    const targets = skill.target === 'single'
      ? (chosenTarget ? [chosenTarget] : resolveTargets(skill, ally))
      : resolveTargets(skill, ally, chosenTarget);

    return { results: applySkill(ally, skill, targets, skillId), skill };
  }

  // チャージ中断（行動不能・撃破時）。中断された敵は同一戦闘で再チャージ不可
  function cancelCharge(enemy) {
    if (!enemy._charging) return false;
    enemy._charging = null;
    enemy._chargeUsed = true;
    enemy._nextSkillId = null;
    enemy._nextTarget = null;
    enemy._nextTargetEmoji = null;
    return true;
  }

  function checkBattleEnd() {
    if (getLivingEnemies().length === 0) return 'win';
    if (getLivingAllies().length === 0) return 'lose';
    return null;
  }

  return {
    initBattle,
    tickStatusEffects, decrementEffects,
    isStunned, isParalyzed, isFrozen,
    planNextAction, executeEnemyTurn, executeAllySkill, cancelCharge,
    checkBattleEnd, getLivingAllies, getLivingEnemies,
    getDeadAllies: () => (state?.allies || []).filter(a => a.isDefeated),
    addEnemy: (e) => { state.enemies.push(e); return e; },
    insertEnemy: (e, idx) => { state.enemies.splice(idx, 0, e); return e; },
    getEnemies: () => state.enemies,
    applyStatusEffect
  };
})();
