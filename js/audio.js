// ============================================================
// AUDIO ENGINE v3 — expanded SE/BGM
// New SE: levelUp, restore, poison, freeze, shock, drain, barrier, slash_heavy
// New BGM: title screen calm arpeggio
// ============================================================
const Audio = (() => {
  let ctx = null;
  let bgmNodes = [];
  let bgmPlaying = false;
  let bgmType = null; // 'title' | 'normal' | 'boss'
  let bgmVariant = 0; // 0,1,2 — random variant picked per battle
  let bgmGeneration = 0; // incremented on every start/stop to invalidate stale loops
  // 音のON/OFFはリロードで消えないよう localStorage に持つ。
  // キー名は他の設定（icb_showCardInfo など）と同じ接頭辞に揃えている。
  // localStorage が使えない環境（プライベートモードの一部）でも Audio モジュール
  // 自体が定義されないと全機能が落ちるので、読み書きは必ず try で囲む
  const SE_KEY  = 'icb_seOn';
  const BGM_KEY = 'icb_bgmOn';
  function loadPref(key) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? true : v === 'true';   // 未設定なら既定ON
    } catch (e) { return true; }
  }
  function savePrefs() {
    try {
      localStorage.setItem(SE_KEY,  String(seEnabled));
      localStorage.setItem(BGM_KEY, String(bgmEnabled));
    } catch (e) {}
  }
  let seEnabled  = loadPref(SE_KEY);
  let bgmEnabled = loadPref(BGM_KEY);

  function getCtx() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch(e) {}
    return ctx;
  }

  function playTone(freq, type, duration, vol = 0.3, startTime = null) {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = type; osc.frequency.value = freq;
    const t = startTime !== null ? startTime : c.currentTime;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t); osc.stop(t + duration + 0.05);
  }

  function playNoise(duration, vol = 0.2, startTime = null, highpass = 0) {
    const c = getCtx();
    if (!c) return;
    const bufSize = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const gain = c.createGain();
    const t = startTime !== null ? startTime : c.currentTime;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    if (highpass > 0) {
      const filt = c.createBiquadFilter();
      filt.type = 'highpass'; filt.frequency.value = highpass;
      src.connect(filt); filt.connect(gain);
    } else {
      src.connect(gain);
    }
    gain.connect(c.destination);
    src.start(t); src.stop(t + duration + 0.05);
  }

  const SE = {
    physical() {
      if (!seEnabled) return;
      playNoise(0.08, 0.3);
      playTone(80, 'sawtooth', 0.1, 0.2);
    },
    slash_heavy() {
      if (!seEnabled) return;
      playNoise(0.12, 0.4);
      playTone(60, 'sawtooth', 0.15, 0.3);
      playTone(100, 'sawtooth', 0.1, 0.2, getCtx().currentTime + 0.04);
    },
    magic() {
      if (!seEnabled) return;
      const c = getCtx();
      const osc = c.createOscillator(); const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
      osc.start(); osc.stop(c.currentTime + 0.45);
    },
    fire() {
      if (!seEnabled) return;
      playNoise(0.25, 0.35);
      playTone(120, 'sawtooth', 0.2, 0.25);
      playTone(80, 'sawtooth', 0.3, 0.15, getCtx().currentTime + 0.05);
    },
    ice() {
      if (!seEnabled) return;
      const c = getCtx();
      for (let i = 0; i < 4; i++) {
        playTone(1200 + i * 180, 'sine', 0.08, 0.12, c.currentTime + i * 0.04);
      }
      playNoise(0.12, 0.1, null, 6000);
    },
    freeze() {
      if (!seEnabled) return;
      const c = getCtx();
      [1600, 1400, 1200, 900].forEach((f, i) => playTone(f, 'sine', 0.12, 0.14, c.currentTime + i * 0.05));
      playNoise(0.18, 0.12, null, 5000);
    },
    thunder() {
      if (!seEnabled) return;
      playNoise(0.12, 0.45);
      playTone(200, 'sawtooth', 0.1, 0.3);
      playTone(400, 'square', 0.05, 0.3, getCtx().currentTime + 0.05);
      playTone(800, 'square', 0.04, 0.2, getCtx().currentTime + 0.1);
    },
    shock() {
      if (!seEnabled) return;
      const c = getCtx();
      [1000, 800, 1200, 600].forEach((f, i) => playTone(f, 'square', 0.07, 0.2, c.currentTime + i * 0.03));
      playNoise(0.1, 0.3, null, 3000);
    },
    water() {
      if (!seEnabled) return;
      const c = getCtx();
      playNoise(0.2, 0.2, null, 1000);
      [500, 700, 900].forEach((f, i) => playTone(f, 'sine', 0.15, 0.15, c.currentTime + i * 0.05));
    },
    dark() {
      if (!seEnabled) return;
      const c = getCtx();
      const osc = c.createOscillator(); const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
      osc.start(); osc.stop(c.currentTime + 0.65);
      playNoise(0.1, 0.1, c.currentTime + 0.1);
    },
    light() {
      if (!seEnabled) return;
      const c = getCtx();
      [880, 1100, 1320, 1760].forEach((f, i) => playTone(f, 'sine', 0.18, 0.18, c.currentTime + i * 0.06));
      playNoise(0.08, 0.05, null, 8000);
    },
    energy() {
      if (!seEnabled) return;
      const c = getCtx();
      const osc = c.createOscillator(); const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, c.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.55);
      gain.gain.setValueAtTime(0.28, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
      osc.start(); osc.stop(c.currentTime + 0.65);
    },
    beam() {
      if (!seEnabled) return;
      const c = getCtx();
      const osc = c.createOscillator(); const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1500, c.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.5);
      gain.gain.setValueAtTime(0.25, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.55);
      osc.start(); osc.stop(c.currentTime + 0.6);
    },
    explosion() {
      if (!seEnabled) return;
      playNoise(0.35, 0.55);
      playTone(80, 'sawtooth', 0.35, 0.35);
      playTone(50, 'sawtooth', 0.25, 0.2, getCtx().currentTime + 0.05);
    },
    buff() {
      if (!seEnabled) return;
      const c = getCtx();
      [400, 500, 630, 800].forEach((f, i) => playTone(f, 'triangle', 0.15, 0.2, c.currentTime + i * 0.07));
    },
    stat_up() {
      if (!seEnabled) return;
      const c = getCtx();
      [600, 800, 1050, 1400].forEach((f, i) => playTone(f, 'triangle', 0.2, 0.18, c.currentTime + i * 0.06));
      playTone(1800, 'sine', 0.15, 0.22, c.currentTime + 0.26);
    },
    debuff() {
      if (!seEnabled) return;
      const c = getCtx();
      [600, 480, 380, 280].forEach((f, i) => playTone(f, 'sawtooth', 0.12, 0.15, c.currentTime + i * 0.06));
    },
    heal() {
      if (!seEnabled) return;
      const c = getCtx();
      [261.6, 329.6, 392, 523.3, 659.3].forEach((f, i) => playTone(f, 'sine', 0.22, 0.2, c.currentTime + i * 0.07));
    },
    recover() {
      if (!seEnabled) return;
      const c = getCtx();
      [392, 523, 659, 784].forEach((f, i) => playTone(f, 'triangle', 0.28, 0.18, c.currentTime + i * 0.09));
      [784, 880, 1047].forEach((f, i) => playTone(f, 'sine', 0.2, 0.12, c.currentTime + 0.4 + i * 0.06));
    },
    restore() {
      if (!seEnabled) return;
      const c = getCtx();
      // Full restore fanfare — ascending arpeggio with harmonics
      const notes = [262, 330, 392, 523, 659, 784, 1047, 1319];
      notes.forEach((f, i) => {
        playTone(f, 'sine', 0.25, 0.22, c.currentTime + i * 0.07);
        playTone(f * 2, 'triangle', 0.15, 0.1, c.currentTime + i * 0.07 + 0.02);
      });
    },
    drain() {
      if (!seEnabled) return;
      const c = getCtx();
      const osc = c.createOscillator(); const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.45);
      osc.start(); osc.stop(c.currentTime + 0.5);
      [600, 440].forEach((f, i) => playTone(f, 'sine', 0.15, 0.12, c.currentTime + 0.05 + i * 0.08));
    },
    barrier_se() {
      if (!seEnabled) return;
      const c = getCtx();
      [800, 1000, 1200, 1500].forEach((f, i) => playTone(f, 'triangle', 0.1, 0.18, c.currentTime + i * 0.05));
      playNoise(0.06, 0.08, c.currentTime + 0.18, 7000);
    },
    poison_se() {
      if (!seEnabled) return;
      const c = getCtx();
      [300, 250, 200, 160].forEach((f, i) => playTone(f, 'sawtooth', 0.1, 0.14, c.currentTime + i * 0.07));
      playNoise(0.1, 0.08, c.currentTime + 0.05, 2000);
    },
    levelUp() {
      if (!seEnabled) return;
      const c = getCtx();
      // Classic game level-up jingle
      const seq = [[523,0],[659,0.12],[784,0.24],[1047,0.36],[1319,0.5],[1047,0.62],[1319,0.72],[1568,0.85]];
      seq.forEach(([f, t]) => {
        playTone(f, 'square', 0.18, 0.22, c.currentTime + t);
        playTone(f * 0.5, 'triangle', 0.12, 0.1, c.currentTime + t);
      });
    },
    critical() {
      if (!seEnabled) return;
      playNoise(0.06, 0.4);
      playTone(600, 'square', 0.05, 0.3);
      playTone(900, 'square', 0.05, 0.3, getCtx().currentTime + 0.06);
      playTone(1200, 'square', 0.12, 0.25, getCtx().currentTime + 0.12);
    },
    enemyDefeat() {
      if (!seEnabled) return;
      const c = getCtx();
      [400, 350, 300, 240, 180].forEach((f, i) => playTone(f, 'square', 0.1, 0.2, c.currentTime + i * 0.055));
      playNoise(0.08, 0.12, c.currentTime + 0.05);
    },
    victory() {
      if (!seEnabled) return;
      const c = getCtx();
      const fanfare = [[523,0],[523,0.15],[523,0.3],[415,0.45],[523,0.6],[622,0.75],[698,0.9],[784,1.1]];
      fanfare.forEach(([f, t]) => {
        playTone(f, 'square', 0.18, 0.25, c.currentTime + t);
        playTone(f * 0.5, 'triangle', 0.16, 0.12, c.currentTime + t);
      });
    },
    clearFanfare() {
      if (!seEnabled) return;
      const c = getCtx();
      // 最終決戦クリア：3フレーズ構成の豪華ファンファーレ
      const melody = [
        [523,0.0],[523,0.12],[523,0.24],[415,0.36],[523,0.5],
        [659,0.72],[659,0.87],[659,1.02],[523,1.17],[659,1.37],
        [784,1.62],[784,1.80],[784,1.98],[698,2.16],[784,2.38],
        [1047,2.68],[784,2.93],[880,3.13],[1047,3.45]
      ];
      melody.forEach(([f, t]) => {
        playTone(f, 'square', 0.19, 0.28, c.currentTime + t);
        playTone(f * 0.5, 'triangle', 0.13, 0.18, c.currentTime + t);
      });
      // ハーモニー（うっすら重ねる）
      [[392,0.5],[494,0.72],[587,1.37],[659,1.62],[784,2.38],[880,2.68],[1047,3.45]].forEach(([f,t]) => {
        playTone(f, 'sine', 0.09, 0.38, c.currentTime + t);
      });
    },
    gachaFanfare() {
      if (!seEnabled) return;
      const c = getCtx();
      // ガチャ★3確定: 短い上昇グリス＋高音チャイム（クリアファンファーレとは別物・約0.6秒）
      [659, 784, 1047, 1319].forEach((f, i) =>
        playTone(f, 'triangle', 0.08, 0.16, c.currentTime + i * 0.06));
      [[1319, 0.3], [1568, 0.3]].forEach(([f, t]) =>
        playTone(f, 'sine', 0.3, 0.2, c.currentTime + t));
    },
    loopContinue() {
      if (!seEnabled) return;
      const c = getCtx();
      const seq = [[392,0],[523,0.1],[659,0.2],[784,0.3],[1047,0.45],[880,0.6],[1047,0.75]];
      seq.forEach(([f, t]) => {
        playTone(f, 'square', 0.15, 0.22, c.currentTime + t);
        playTone(f * 2, 'sine', 0.12, 0.1, c.currentTime + t + 0.02);
      });
    },
    defeat() {
      if (!seEnabled) return;
      const c = getCtx();
      [400, 350, 280, 200, 140].forEach((f, i) => playTone(f, 'sawtooth', 0.3, 0.2, c.currentTime + i * 0.13));
    },
    battleStart() {
      if (!seEnabled) return;
      const c = getCtx();
      [523, 659, 784, 1047].forEach((f, i) =>
        playTone(f, 'sine', 0.35, 0.13, c.currentTime + i * 0.03));
    },
    select()  { if (!seEnabled) return; playTone(800, 'sine', 0.08, 0.15); },
    cursor()  { if (!seEnabled) return; playTone(600, 'sine', 0.05, 0.1); },
    cancel()  { if (!seEnabled) return; playTone(300, 'sine', 0.08, 0.12); },
    bossIntro() {
      if (!seEnabled) return;
      const c = getCtx();
      playNoise(0.6, 0.35);
      [200, 175, 155, 135, 110, 90].forEach((f, i) => playTone(f, 'sawtooth', 0.22, 0.3, c.currentTime + i * 0.09));
      playTone(55, 'sawtooth', 0.8, 0.25, c.currentTime + 0.3);
    }
  };

  // ---- BGM ----
  // Type: 'normal' | 'boss' | 'title' | 'third' | 'final'
  // 後方互換: startBGM(true)→'boss'  startBGM(false)→'normal'
  function startBGM(type = 'normal', isTitle = false) {
    if (type === true)  type = 'boss';
    if (type === false) type = 'normal';
    if (!bgmEnabled) return;
    bgmGeneration++;
    stopBGM();
    const myGen = bgmGeneration;
    bgmPlaying = true;
    bgmType = isTitle ? 'title' : type;
    bgmVariant = Math.floor(Math.random() * 6);
    if (isTitle)          { _scheduleTitleBGM(myGen); return; }
    if (type === 'final') { _scheduleFinalBGM(myGen); return; }
    if (type === 'third') { _scheduleBattleBGM(false, myGen, true); return; }
    _scheduleBattleBGM(type === 'boss', myGen, false);
  }

  function _scheduleTitleBGM(myGen) {
    const c = getCtx();
    // Gentle major-key arpeggio
    const arpeggioNotes = [262, 330, 392, 523, 659, 523, 392, 330,
                            294, 370, 440, 587, 740, 587, 440, 370];
    const tempo = 0.22;
    let startT = c.currentTime + 0.1;

    function scheduleLoop() {
      if (!bgmPlaying || bgmGeneration !== myGen) return;
      const now = c.currentTime;
      if (startT < now) startT = now + 0.05;
      arpeggioNotes.forEach((freq, i) => {
        const t = startT + i * tempo;
        const mo = c.createOscillator(); const mg = c.createGain();
        mo.connect(mg); mg.connect(c.destination);
        mo.type = 'triangle'; mo.frequency.value = freq;
        mg.gain.setValueAtTime(0.07, t);
        mg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 0.9);
        mo.start(t); mo.stop(t + tempo);
        trackNodes(mo, mg);

        // Bass note (every 4 steps)
        if (i % 4 === 0) {
          const bo = c.createOscillator(); const bg = c.createGain();
          bo.connect(bg); bg.connect(c.destination);
          bo.type = 'sine'; bo.frequency.value = freq * 0.5;
          bg.gain.setValueAtTime(0.05, t);
          bg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 3.5);
          bo.start(t); bo.stop(t + tempo * 4);
          trackNodes(bo, bg);
        }
      });
      startT += arpeggioNotes.length * tempo;
      const delay = (startT - c.currentTime - 0.5) * 1000;
      if (delay > 0) setTimeout(scheduleLoop, delay);
      else scheduleLoop();
    }
    scheduleLoop();
  }

  function _scheduleBattleBGM(isBoss, myGen, isThird = false) {
    const c = getCtx();

    // 3 tempo variants per type
    const tempos = isBoss ? [0.18, 0.22, 0.15] : isThird ? [0.20, 0.22, 0.18] : [0.25, 0.28, 0.20];
    const tempo = tempos[bgmVariant] || tempos[0];

    // Bass note patterns — 3 variants each for normal, boss, third
    const bassLib = {
      n0: [65, 65, 73, 65, 61, 61, 69, 61, 58, 58, 65, 58, 55, 55, 61, 65],
      n1: [61, 58, 55, 52, 49, 52, 55, 58, 46, 49, 52, 49, 44, 46, 49, 52],
      n2: [73, 73, 82, 73, 69, 73, 78, 73, 65, 73, 78, 65, 73, 73, 82, 73],
      b0: [55, 55, 65, 58, 49, 49, 58, 49, 52, 52, 62, 55, 46, 46, 55, 52],
      b1: [44, 44, 49, 46, 41, 41, 46, 44, 37, 37, 44, 41, 33, 37, 41, 44],
      b2: [58, 65, 58, 52, 55, 62, 55, 49, 52, 58, 52, 46, 49, 55, 49, 44],
      t0: [55, 58, 52, 55, 49, 52, 46, 49, 52, 55, 49, 52, 58, 55, 52, 49],
      t1: [61, 61, 58, 55, 52, 52, 49, 46, 55, 55, 52, 49, 46, 46, 52, 55],
      t2: [49, 52, 55, 58, 52, 55, 58, 55, 46, 49, 52, 55, 49, 52, 46, 52],
      n3: [55, 55, 65, 55, 49, 49, 58, 49, 44, 44, 49, 44, 41, 44, 49, 55],
      n4: [73, 73, 82, 73, 65, 65, 73, 65, 61, 65, 69, 65, 58, 55, 58, 65],
      n5: [55, 61, 65, 61, 58, 55, 52, 55, 49, 52, 55, 52, 46, 49, 52, 55],
      b3: [41, 41, 49, 44, 37, 37, 44, 41, 33, 37, 44, 37, 33, 33, 37, 41],
      b4: [49, 52, 46, 49, 44, 46, 41, 44, 37, 41, 44, 41, 33, 37, 41, 44],
      b5: [44, 49, 52, 49, 44, 49, 55, 52, 49, 52, 55, 49, 46, 49, 52, 55],
      t3: [52, 55, 58, 55, 49, 52, 55, 52, 46, 49, 52, 55, 52, 49, 46, 49],
      t4: [55, 58, 61, 58, 52, 55, 58, 55, 49, 52, 55, 58, 55, 52, 49, 52],
      t5: [46, 49, 52, 55, 49, 52, 55, 52, 44, 46, 49, 52, 46, 49, 44, 46],
    };
    // Melody note patterns
    const melLib = {
      n0: [196, 0, 220, 0, 196, 0, 175, 0, 165, 0, 185, 175, 165, 0, 147, 0],
      n1: [165, 0, 185, 165, 147, 0, 165, 0, 139, 0, 155, 0, 147, 0, 131, 0],
      n2: [220, 247, 0, 220, 208, 0, 220, 196, 220, 247, 0, 220, 208, 196, 0, 208],
      b0: [220, 0, 196, 0, 175, 185, 165, 0, 175, 0, 165, 0, 155, 147, 165, 0],
      b1: [110, 0, 98, 104, 0, 98, 93, 0, 104, 0, 98, 0, 88, 93, 0, 88],
      b2: [233, 0, 247, 220, 0, 233, 208, 0, 233, 247, 0, 220, 208, 0, 233, 220],
      t0: [233, 0, 220, 0, 208, 196, 220, 0, 208, 0, 196, 0, 185, 175, 196, 0],
      t1: [196, 220, 0, 196, 185, 0, 196, 208, 0, 185, 175, 0, 185, 196, 0, 175],
      t2: [247, 0, 233, 220, 0, 233, 208, 0, 220, 247, 0, 233, 208, 196, 0, 220],
      n3: [220, 0, 196, 0, 220, 233, 0, 220, 196, 0, 208, 196, 175, 0, 196, 220],
      n4: [233, 0, 247, 220, 0, 233, 0, 208, 220, 0, 247, 220, 0, 208, 196, 0],
      n5: [196, 208, 0, 196, 185, 0, 196, 208, 175, 185, 0, 175, 165, 0, 175, 185],
      b3: [175, 0, 165, 0, 155, 147, 165, 0, 175, 0, 147, 0, 139, 147, 0, 155],
      b4: [196, 0, 185, 175, 0, 185, 196, 0, 175, 0, 165, 0, 155, 165, 0, 175],
      b5: [208, 0, 220, 208, 0, 233, 220, 0, 208, 220, 0, 196, 208, 0, 220, 233],
      t3: [208, 0, 220, 208, 196, 0, 208, 220, 185, 196, 0, 185, 175, 185, 0, 196],
      t4: [247, 0, 233, 220, 0, 233, 247, 0, 220, 0, 233, 247, 220, 208, 0, 220],
      t5: [185, 196, 0, 208, 196, 0, 185, 196, 175, 0, 185, 196, 165, 175, 0, 185],
    };
    // Counter-melody (boss and third)
    const ctrLib = {
      b0: [0, 147, 0, 139, 0, 131, 0, 147, 0, 139, 0, 131, 0, 123, 0, 131],
      b1: [0, 82, 0, 77, 73, 0, 77, 82, 0, 77, 73, 0, 69, 0, 73, 77],
      b2: [0, 175, 165, 0, 175, 0, 165, 175, 0, 185, 165, 0, 175, 165, 0, 175],
      t0: [0, 155, 0, 147, 0, 139, 0, 155, 0, 147, 0, 131, 0, 139, 0, 147],
      t1: [0, 131, 123, 0, 131, 0, 123, 131, 0, 139, 131, 0, 123, 0, 131, 123],
      t2: [0, 165, 0, 155, 147, 0, 155, 0, 139, 0, 147, 0, 155, 147, 0, 155],
      b3: [0, 110, 0, 104, 98, 0, 104, 0, 0, 110, 0, 98, 0, 104, 0, 110],
      b4: [0, 131, 123, 0, 131, 0, 123, 117, 0, 123, 0, 117, 0, 110, 0, 117],
      b5: [0, 139, 0, 147, 139, 0, 155, 139, 0, 147, 0, 139, 0, 131, 139, 0],
      t3: [0, 139, 0, 147, 139, 0, 155, 139, 0, 131, 139, 0, 123, 131, 0, 139],
      t4: [0, 165, 155, 0, 165, 0, 175, 165, 0, 155, 0, 165, 155, 0, 147, 155],
      t5: [0, 123, 131, 0, 123, 0, 117, 123, 0, 131, 0, 123, 0, 117, 0, 123],
    };

    const pfx = isThird ? 't' + bgmVariant : (isBoss ? 'b' : 'n') + bgmVariant;
    const bassNotes = bassLib[pfx] || bassLib.n0;
    const melodyNotes = melLib[pfx] || melLib.n0;
    const counterNotes = (isBoss || isThird) ? (ctrLib[pfx] || []) : [];

    let startT = c.currentTime + 0.1;

    function scheduleLoop() {
      if (!bgmPlaying || bgmGeneration !== myGen) return;
      const now = c.currentTime;
      if (startT < now) startT = now + 0.05;
      const len = bassNotes.length;

      for (let i = 0; i < len; i++) {
        const t = startT + i * tempo;

        const bo = c.createOscillator(); const bg = c.createGain();
        bo.connect(bg); bg.connect(c.destination);
        bo.type = 'triangle'; bo.frequency.value = bassNotes[i];
        bg.gain.setValueAtTime(0.1, t);
        bg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 0.85);
        bo.start(t); bo.stop(t + tempo * 0.9);
        trackNodes(bo, bg);

        if (melodyNotes[i] > 0) {
          const mo = c.createOscillator(); const mg = c.createGain();
          mo.connect(mg); mg.connect(c.destination);
          mo.type = 'square'; mo.frequency.value = melodyNotes[i];
          mg.gain.setValueAtTime(0.05, t);
          mg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 0.7);
          mo.start(t); mo.stop(t + tempo * 0.75);
          trackNodes(mo, mg);
        }

        if ((isBoss || isThird) && counterNotes[i] > 0) {
          const co = c.createOscillator(); const cg = c.createGain();
          co.connect(cg); cg.connect(c.destination);
          co.type = 'sawtooth'; co.frequency.value = counterNotes[i];
          cg.gain.setValueAtTime(0.03, t);
          cg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 0.6);
          co.start(t); co.stop(t + tempo * 0.65);
          trackNodes(co, cg);
        }

        // Kick on beat 0 and 8
        if (i % 8 === 0) {
          const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.12), c.sampleRate);
          const d = buf.getChannelData(0);
          for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / d.length);
          const ks = c.createBufferSource(); ks.buffer = buf;
          const kg = c.createGain(); kg.gain.value = isBoss ? 0.18 : isThird ? 0.16 : 0.13;
          ks.connect(kg); kg.connect(c.destination); ks.start(t);
          trackNodes(ks, kg);
        }

        // Snare on 4 and 12
        if (i % 8 === 4) {
          const buf2 = c.createBuffer(1, Math.floor(c.sampleRate * 0.08), c.sampleRate);
          const d2 = buf2.getChannelData(0);
          for (let j = 0; j < d2.length; j++) d2[j] = (Math.random() * 2 - 1) * (1 - j / d2.length);
          const ss = c.createBufferSource(); ss.buffer = buf2;
          const sg = c.createGain(); sg.gain.value = isThird ? 0.12 : 0.1;
          const sf = c.createBiquadFilter(); sf.type = 'bandpass'; sf.frequency.value = 4000; sf.Q.value = 0.8;
          ss.connect(sf); sf.connect(sg); sg.connect(c.destination); ss.start(t);
          trackNodes(ss, sg, sf);
        }

        // Hi-hat
        if (i % 2 === 1) {
          const buf3 = c.createBuffer(1, Math.floor(c.sampleRate * 0.04), c.sampleRate);
          const d3 = buf3.getChannelData(0);
          for (let j = 0; j < d3.length; j++) d3[j] = (Math.random() * 2 - 1) * (1 - j / d3.length);
          const hs = c.createBufferSource(); hs.buffer = buf3;
          const hg = c.createGain(); hg.gain.value = 0.04;
          const hf = c.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 8000;
          hs.connect(hf); hf.connect(hg); hg.connect(c.destination); hs.start(t);
          trackNodes(hs, hg, hf);
        }

        // Boss/third: cymbal crash on beat 0
        if ((isBoss || isThird) && i % 16 === 0) {
          const buf4 = c.createBuffer(1, Math.floor(c.sampleRate * 0.3), c.sampleRate);
          const d4 = buf4.getChannelData(0);
          for (let j = 0; j < d4.length; j++) d4[j] = (Math.random() * 2 - 1) * Math.exp(-j / (d4.length * 0.3));
          const cs = c.createBufferSource(); cs.buffer = buf4;
          const cg2 = c.createGain(); cg2.gain.value = isThird ? 0.06 : 0.08;
          const cf = c.createBiquadFilter(); cf.type = 'highpass'; cf.frequency.value = 6000;
          cs.connect(cf); cf.connect(cg2); cg2.connect(c.destination); cs.start(t);
          trackNodes(cs, cg2, cf);
        }
      }

      startT += len * tempo;
      const delay = (startT - c.currentTime - 0.4) * 1000;
      if (delay > 0) setTimeout(scheduleLoop, delay);
      else scheduleLoop();
    }

    scheduleLoop();
  }

  function _scheduleFinalBGM(myGen) {
    const c = getCtx();
    // 壮大なマイナーキー・高速テンポ・4声部
    const tempos = [0.13, 0.14, 0.12];
    const tempo = tempos[bgmVariant] || tempos[0];

    const bassLib = [
      [49, 49, 52, 49, 46, 46, 49, 46, 44, 44, 49, 52, 46, 44, 46, 49],
      [44, 44, 49, 46, 41, 41, 46, 44, 37, 37, 41, 44, 41, 37, 41, 44],
      [52, 52, 55, 52, 49, 49, 52, 49, 46, 46, 52, 55, 49, 46, 49, 52],
      [46, 46, 49, 46, 41, 41, 46, 41, 37, 37, 41, 44, 37, 33, 37, 41],
      [41, 44, 49, 52, 44, 49, 52, 49, 37, 41, 44, 49, 41, 37, 41, 44],
      [33, 33, 37, 41, 37, 33, 37, 44, 41, 37, 41, 44, 37, 41, 44, 49],
    ];
    const melLib = [
      [294, 0, 330, 294, 262, 0, 294, 0, 277, 0, 294, 0, 262, 247, 262, 0],
      [220, 0, 247, 220, 196, 0, 220, 0, 208, 0, 220, 247, 208, 196, 0, 208],
      [349, 0, 330, 0, 311, 330, 294, 0, 330, 0, 311, 294, 277, 0, 294, 311],
      [277, 0, 262, 247, 0, 262, 277, 0, 247, 0, 262, 0, 233, 247, 0, 262],
      [330, 0, 311, 294, 0, 311, 330, 0, 277, 294, 0, 311, 294, 0, 277, 262],
      [262, 0, 277, 0, 262, 247, 262, 0, 233, 247, 0, 262, 247, 233, 0, 247],
    ];
    const ctrLib = [
      [0, 196, 0, 185, 175, 0, 185, 0, 196, 185, 0, 175, 0, 185, 175, 0],
      [0, 147, 139, 0, 147, 0, 131, 139, 0, 147, 0, 131, 123, 0, 131, 139],
      [0, 220, 0, 208, 0, 196, 208, 0, 220, 0, 208, 196, 0, 208, 0, 196],
      [0, 185, 0, 175, 165, 0, 175, 0, 196, 185, 0, 175, 0, 185, 165, 0],
      [0, 220, 208, 0, 220, 0, 233, 220, 0, 208, 0, 220, 208, 0, 196, 208],
      [0, 175, 0, 165, 0, 175, 185, 0, 165, 0, 175, 185, 0, 175, 165, 0],
    ];
    // コード和音（壮大な厚み）
    const chordLib = [
      [196, 0, 0, 0, 175, 0, 0, 0, 185, 0, 0, 0, 175, 0, 0, 0],
      [165, 0, 0, 0, 147, 0, 0, 0, 155, 0, 0, 0, 147, 0, 0, 0],
      [208, 0, 0, 0, 185, 0, 0, 0, 196, 0, 0, 0, 185, 0, 0, 0],
      [185, 0, 0, 0, 175, 0, 0, 0, 165, 0, 0, 0, 175, 0, 0, 0],
      [220, 0, 0, 0, 208, 0, 0, 0, 196, 0, 0, 0, 208, 0, 0, 0],
      [175, 0, 0, 0, 165, 0, 0, 0, 155, 0, 0, 0, 165, 0, 0, 0],
    ];

    const v = bgmVariant % 6;
    const bassNotes   = bassLib[v];
    const melodyNotes = melLib[v];
    const counterNotes = ctrLib[v];
    const chordNotes  = chordLib[v];
    let startT = c.currentTime + 0.1;

    function scheduleLoop() {
      if (!bgmPlaying || bgmGeneration !== myGen) return;
      const now = c.currentTime;
      if (startT < now) startT = now + 0.05;
      const len = bassNotes.length;

      for (let i = 0; i < len; i++) {
        const t = startT + i * tempo;

        // Bass (triangle — 重厚)
        const bo = c.createOscillator(); const bg = c.createGain();
        bo.connect(bg); bg.connect(c.destination);
        bo.type = 'triangle'; bo.frequency.value = bassNotes[i];
        bg.gain.setValueAtTime(0.13, t);
        bg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 0.85);
        bo.start(t); bo.stop(t + tempo * 0.9);
        trackNodes(bo, bg);

        // Melody (square)
        if (melodyNotes[i] > 0) {
          const mo = c.createOscillator(); const mg = c.createGain();
          mo.connect(mg); mg.connect(c.destination);
          mo.type = 'square'; mo.frequency.value = melodyNotes[i];
          mg.gain.setValueAtTime(0.06, t);
          mg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 0.65);
          mo.start(t); mo.stop(t + tempo * 0.7);
          trackNodes(mo, mg);
        }

        // Counter-melody (sawtooth)
        if (counterNotes[i] > 0) {
          const co = c.createOscillator(); const cg = c.createGain();
          co.connect(cg); cg.connect(c.destination);
          co.type = 'sawtooth'; co.frequency.value = counterNotes[i];
          cg.gain.setValueAtTime(0.04, t);
          cg.gain.exponentialRampToValueAtTime(0.001, t + tempo * 0.6);
          co.start(t); co.stop(t + tempo * 0.65);
          trackNodes(co, cg);
        }

        // Chord pad (sine — 荘厳な和音)
        if (chordNotes[i] > 0) {
          [1.0, 1.25, 1.5].forEach(ratio => {
            const co2 = c.createOscillator(); const cg2 = c.createGain();
            co2.connect(cg2); cg2.connect(c.destination);
            co2.type = 'sine'; co2.frequency.value = chordNotes[i] * ratio;
            cg2.gain.setValueAtTime(0.025, t);
            cg2.gain.exponentialRampToValueAtTime(0.001, t + tempo * 3.5);
            co2.start(t); co2.stop(t + tempo * 4);
            trackNodes(co2, cg2);
          });
        }

        // Kick — 強め
        if (i % 8 === 0) {
          const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.15), c.sampleRate);
          const d = buf.getChannelData(0);
          for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / d.length);
          const ks = c.createBufferSource(); ks.buffer = buf;
          const kg = c.createGain(); kg.gain.value = 0.22;
          ks.connect(kg); kg.connect(c.destination); ks.start(t);
          trackNodes(ks, kg);
        }

        // Snare
        if (i % 8 === 4) {
          const buf2 = c.createBuffer(1, Math.floor(c.sampleRate * 0.1), c.sampleRate);
          const d2 = buf2.getChannelData(0);
          for (let j = 0; j < d2.length; j++) d2[j] = (Math.random() * 2 - 1) * (1 - j / d2.length);
          const ss = c.createBufferSource(); ss.buffer = buf2;
          const sg = c.createGain(); sg.gain.value = 0.14;
          const sf = c.createBiquadFilter(); sf.type = 'bandpass'; sf.frequency.value = 4000; sf.Q.value = 0.8;
          ss.connect(sf); sf.connect(sg); sg.connect(c.destination); ss.start(t);
          trackNodes(ss, sg, sf);
        }

        // Hi-hat (全ステップ)
        if (i % 2 === 1) {
          const buf3 = c.createBuffer(1, Math.floor(c.sampleRate * 0.03), c.sampleRate);
          const d3 = buf3.getChannelData(0);
          for (let j = 0; j < d3.length; j++) d3[j] = (Math.random() * 2 - 1) * (1 - j / d3.length);
          const hs = c.createBufferSource(); hs.buffer = buf3;
          const hg = c.createGain(); hg.gain.value = 0.05;
          const hf = c.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 8000;
          hs.connect(hf); hf.connect(hg); hg.connect(c.destination); hs.start(t);
          trackNodes(hs, hg, hf);
        }

        // クラッシュシンバル（8拍ごと — boss の2倍頻度）
        if (i % 8 === 0) {
          const buf4 = c.createBuffer(1, Math.floor(c.sampleRate * 0.4), c.sampleRate);
          const d4 = buf4.getChannelData(0);
          for (let j = 0; j < d4.length; j++) d4[j] = (Math.random() * 2 - 1) * Math.exp(-j / (d4.length * 0.25));
          const cs = c.createBufferSource(); cs.buffer = buf4;
          const cg3 = c.createGain(); cg3.gain.value = 0.10;
          const cf2 = c.createBiquadFilter(); cf2.type = 'highpass'; cf2.frequency.value = 6000;
          cs.connect(cf2); cf2.connect(cg3); cg3.connect(c.destination); cs.start(t);
          trackNodes(cs, cg3, cf2);
        }
      }

      startT += len * tempo;
      const delay = (startT - c.currentTime - 0.4) * 1000;
      if (delay > 0) setTimeout(scheduleLoop, delay);
      else scheduleLoop();
    }

    scheduleLoop();
  }

  // スケジュール済みノードを追跡する。
  // 以前は bgmNodes に push しっぱなしで stopBGM() まで解放されず、
  // BGMを鳴らし続けると毎秒20〜30ノードが参照されたまま溜まっていた
  // （長い戦闘でメモリとオーディオグラフが肥大化＝発熱・電池消費の一因）。
  // 音が鳴り終わった時点で配列から外し、グラフからも切り離す。
  function trackNodes() {
    const nodes = Array.prototype.slice.call(arguments);
    nodes.forEach(n => bgmNodes.push(n));
    // 発音源（start/onended を持つノード）の終了をトリガーにまとめて解放する
    const src = nodes.find(n => n && typeof n.start === 'function' && 'onended' in n);
    if (!src) return;
    src.onended = () => {
      nodes.forEach(n => {
        const i = bgmNodes.indexOf(n);
        if (i >= 0) bgmNodes.splice(i, 1);
        try { n.disconnect(); } catch (e) {}
      });
    };
  }

  function stopBGM() {
    bgmGeneration++;
    bgmPlaying = false;
    bgmType = null;
    bgmNodes.forEach(n => { try { if (n.stop) n.stop(); n.disconnect(); } catch(e){} });
    bgmNodes = [];
  }

  function toggleBGM() {
    bgmEnabled = !bgmEnabled;
    if (!bgmEnabled) stopBGM();
    savePrefs();
    return bgmEnabled;
  }

  function toggleSE() { seEnabled = !seEnabled; savePrefs(); return seEnabled; }

  function playByAnimation(anim) {
    switch (anim) {
      case 'slash':       SE.physical();  break;
      case 'slash_heavy': SE.explosion(); break;
      case 'punch':       SE.physical();  break;
      case 'punch_heavy': SE.explosion(); break;
      case 'beam':      SE.beam();      break;
      case 'explosion': SE.explosion(); break;
      case 'heal':      SE.heal();      break;
      case 'thunder':   SE.thunder();   break;
      case 'ice':       SE.ice();       break;
      case 'dark':      SE.dark();      break;
      case 'buff':      SE.buff();      break;
      case 'fire':      SE.fire();      break;
      case 'water':     SE.water();     break;
      case 'light':     SE.light();     break;
      case 'energy':    SE.energy();    break;
      default:          SE.physical();  break;
    }
  }

  // 設定UIが現在のON/OFF状態を読むためのゲッター
  function isBGMOn() { return bgmEnabled; }
  function isSEOn()  { return seEnabled; }

  return { SE, startBGM, stopBGM, toggleBGM, toggleSE, isBGMOn, isSEOn, playByAnimation, getCtx };
})();
