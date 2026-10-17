const upgradesData = [
  { id: 'clickPower', name: 'Finger Power', baseCost: 100, baseGain: 1, desc: 'Increase points earned per click', type: 'click' },
  { id: 'cursor', name: 'Auto Clicker', baseCost: 15, baseGain: 2, desc: 'Passively earns points over time', type: 'passive' },
  { id: 'mouse', name: 'Gaming Mouse', baseCost: 100, baseGain: 10, desc: 'Faster auto-clicking', type: 'passive' },
  { id: 'keyboard', name: 'Mechanical Keyboard', baseCost: 500, baseGain: 50, desc: 'Rapid fire clicks', type: 'passive' },
  { id: 'bot', name: 'Click Bot', baseCost: 2500, baseGain: 200, desc: 'Automated clicking system', type: 'passive' },
  { id: 'ai', name: 'AI Clicker', baseCost: 15000, baseGain: 1000, desc: 'Smart auto-clicking AI', type: 'passive' },
  { id: 'quantum', name: 'Quantum Clicker', baseCost: 100000, baseGain: 5000, desc: 'Transcendent clicking', type: 'passive' },
  { id: 'crit', name: 'Critical Strike', baseCost: 500, chance: 0.05, multiplier: 10, desc: '5% chance per click for 10x damage', type: 'crit' },
  { id: 'combo', name: 'Combo Master', baseCost: 1000, desc: 'Each click adds +10% multiplier (resets after 1s pause)', type: 'combo' },
  { id: 'echo', name: 'Echo Clicks', baseCost: 3000, chance: 0.25, desc: '25% chance each click spawns a free ghost click', type: 'echo' },
  { id: 'momentum', name: 'Momentum', baseCost: 8000, desc: 'Clicking faster increases per-click value up to +200%', type: 'momentum' },
  { id: 'magnet', name: 'Click Magnet', baseCost: 20000, bonus: 0.15, desc: 'Each click collects 15% of passive income instantly', type: 'magnet' },
  { id: 'synergy', name: 'Synergy Engine', baseCost: 50000, bonus: 0.05, desc: 'Each owned upgrade boosts all passive income by 5%', type: 'synergy' },
  { id: 'timewarp', name: 'Time Warp', baseCost: 200000, speedBonus: 0.5, desc: 'Speeds up game time by 50% (faster passive ticks)', type: 'timewarp' }
];

// Auto-save to localStorage (persists across sessions automatically)
function autoSave() {
  try {
    const saveData = {
      score,
      perClick,
      perSecond,
      totalClicks,
      lastClickTime,
      comboCounter,
      rebirths,
      upgrades: {}
    };
    Object.keys(upgrades).forEach(key => {
      saveData.upgrades[key] = { ...upgrades[key] };
    });
    localStorage.setItem('school-clicker-save', JSON.stringify(saveData));
  } catch (e) {
    // localStorage may be blocked in some contexts
  }
}

function autoLoad() {
  try {
    const saved = localStorage.getItem('school-clicker-save');
    if (saved) {
      const saveData = JSON.parse(saved);
      score = saveData.score || 0;
      perClick = saveData.perClick || 1;
      perSecond = saveData.perSecond || 0;
      totalClicks = saveData.totalClicks || 0;
      lastClickTime = saveData.lastClickTime || 0;
      comboCounter = saveData.comboCounter || 0;
      rebirths = saveData.rebirths || 0;
      rebirthBonus = 1 + (rebirths * 0.25);
      if (saveData.upgrades) {
        Object.keys(saveData.upgrades).forEach(key => {
          if (upgrades[key]) {
            upgrades[key] = { ...upgrades[key], ...saveData.upgrades[key] };
          }
        });
      }
    }
  } catch (e) {
    // ignore load errors, start fresh
  }
}

// Game state
let score = 0;
let perClick = 1;
let perSecond = 0;
let totalClicks = 0;
let lastClickTime = 0;
let comboCounter = 0;
let comboTimeout = null;
let rebirths = 0;
let rebirthBonus = 1;

const upgrades = {};
upgradesData.forEach(u => {
  upgrades[u.id] = { level: 0, cost: u.baseCost, gain: 0, type: u.type };
});

const scoreEl = document.getElementById('score');
const perClickEl = document.getElementById('perClick');
const perSecondEl = document.getElementById('perSecond');
const totalClicksEl = document.getElementById('totalClicks');
const clickerBtn = document.getElementById('clickerBtn');
const upgradesEl = document.getElementById('upgrades');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const rebirthBtn = document.getElementById('rebirthBtn');
const rebirthCountEl = document.getElementById('rebirthCount');

function formatNum(n) {
  if (!isFinite(n) || isNaN(n)) return '0';
  if (n === 0) return '0';
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Vg'];
  let suffixIndex = 0;
  while (Math.abs(n) >= 1000 && suffixIndex < suffixes.length - 1) {
    n /= 1000;
    suffixIndex++;
  }
  const formatted = n.toFixed(3).replace(/\.?0+$/, '');
  return (formatted || '0') + suffixes[suffixIndex];
}

function updateUI() {
  scoreEl.textContent = formatNum(score);
  perClickEl.textContent = '+' + formatNum(perClick);
  perSecondEl.textContent = formatNum(perSecond) + '/s';
  totalClicksEl.textContent = formatNum(totalClicks);

  upgradesData.forEach(u => {
    const up = upgrades[u.id];
    const btn = document.getElementById('buy-' + u.id);
    const costEl = document.getElementById('cost-' + u.id);
    const levelEl = document.getElementById('level-' + u.id);
      if (btn && costEl) {
        costEl.textContent = formatNum(up.cost);
        btn.disabled = score < up.cost;
      }
      if (levelEl) levelEl.textContent = 'Lv.' + up.level;
      });
      // Rebirth button - requires 1QA (1 quadrillion) score
      rebirthBtn.disabled = score < 1000000000000000;
      rebirthCountEl.textContent = rebirths;
    }

function createUpgrades() {
  upgradesEl.innerHTML = '';
  upgradesData.forEach(u => {
    const up = upgrades[u.id];
    const div = document.createElement('div');
    div.className = 'upgrade-item';
    div.innerHTML = `
      <div class="upgrade-info">
        <div class="upgrade-name">${u.name} <span class="upgrade-level" id="level-${u.id}">Lv.${up.level}</span></div>
        <div class="upgrade-desc">${u.desc}</div>
      </div>
      <div class="upgrade-cost-row">
        <span>Cost:</span>
        <span id="cost-${u.id}">${formatNum(up.cost)}</span>
      </div>
      <button class="upgrade-btn" id="buy-${u.id}" data-id="${u.id}">Buy</button>
    `;
    upgradesEl.appendChild(div);
  });
  document.querySelectorAll('.upgrade-btn').forEach(btn => {
    btn.addEventListener('click', (e) => buyUpgrade(e.target.dataset.id));
  });
}

function buyUpgrade(id) {
  const up = upgrades[id];
  if (!up) return;
  const data = upgradesData.find(u => u.id === id);
  if (score >= up.cost) {
    score -= up.cost;
    up.level++;

if (data.type === 'click') {
          perClick = (1 + (data.baseGain * up.level)) * rebirthBonus;
    } else if (data.type === 'crit') {
      up.critChance = Math.min((up.critChance || 0) + data.baseGain, 1.0);
    } else if (data.type === 'combo') {
      up.comboBonus = (up.comboBonus || 0) + 0.1;
    } else if (data.type === 'echo') {
      up.echoChance = Math.min((up.echoChance || 0) + data.baseGain, 0.9);
    } else if (data.type === 'momentum') {
      up.momentumBonus = (up.momentumBonus || 0) + 0.02;
    } else if (data.type === 'magnet') {
      up.magnetBonus = (up.magnetBonus || 0) + data.baseGain;
    } else if (data.type === 'synergy') {
      up.synergyBonus = (up.synergyBonus || 0) + data.baseGain;
    } else if (data.type === 'timewarp') {
      up.timeWarpBonus = (up.timeWarpBonus || 0) + data.baseGain;
    } else {
      up.gain = data.baseGain * Math.pow(1.5, up.level - 1);
    }

    up.cost = Math.floor(up.cost * 1.3);

// Recalculate perSecond from all passive upgrades
        perSecond = upgradesData
          .filter(u => u.type === 'passive')
          .reduce((sum, u) => sum + (upgrades[u.id].gain || 0), 0) * rebirthBonus;

document.getElementById('level-' + id).textContent = 'Lv.' + up.level;
        updateUI();
        autoSave();
      }
}

function rebirth() {
  if (score < 1000000000000000) return; // Requires 1QA (1 quadrillion)
  rebirths++;
  rebirthBonus = 1 + (rebirths * 0.25); // +25% per rebirth

  // Reset game state but keep rebirths and rebirthBonus
  score = 0;
  perClick = 1 * rebirthBonus;
  perSecond = 0;
  totalClicks = 0;
  lastClickTime = 0;
  comboCounter = 0;

  // Reset all upgrades
  upgradesData.forEach(u => {
    upgrades[u.id] = { level: 0, cost: u.baseCost, gain: 0, type: u.type };
  });

  updateUI();
  autoSave();
  rebirthBtn.disabled = true;
}

function addFloatingText(x, y, text) {
  const el = document.createElement('span');
  el.className = 'plus-one';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  clickerBtn.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

clickerBtn.addEventListener('click', (e) => {
  // Momentum - faster clicking increases per-click value up to +200%
  let momentumBonus = 0;
  if (upgrades['momentum'] && upgrades['momentum'].level > 0) {
    const now = Date.now();
    const timeDiff = lastClickTime ? now - lastClickTime : 1000;
    const rawMomentum = Math.max(0, Math.min(1, 500 / timeDiff));
    momentumBonus = perClick * rawMomentum * upgrades['momentum'].momentumBonus * upgrades['momentum'].level * 2;
  }

      // Critical Strike - random chance for 10x damage
  if (upgrades['crit'] && upgrades['crit'].level > 0 && Math.random() < upgrades['crit'].critChance) {
    score += perClick * (data.multiplier - 1);
  }

  // Combo Master - build combo bonus with each click
  if (upgrades['combo'] && upgrades['combo'].level > 0) {
    const now = Date.now();
    if (lastClickTime && now - lastClickTime < 1000) {
      comboCounter++;
    } else {
      comboCounter = 1;
    }
    lastClickTime = now;
    score += perClick * (upgrades['combo'].comboBonus * comboCounter);
    clearTimeout(comboTimeout);
    comboTimeout = setTimeout(() => { comboCounter = 0; }, 1000);
  } else {
    lastClickTime = Date.now();
  }

  // Echo Clicks - chance for free ghost click
  if (upgrades['echo'] && upgrades['echo'].level > 0 && Math.random() < upgrades['echo'].echoChance) {
    score += perClick;
  }

  // Click Magnet - each click collects % of passive income instantly
  if (upgrades['magnet'] && upgrades['magnet'].level > 0) {
    score += perSecond * upgrades['magnet'].magnetBonus / 10;
  }

score += momentumBonus;
      score += perClick;
      totalClicks++;
      updateUI();
      autoSave();

  const rect = clickerBtn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  addFloatingText(x, y, '+' + formatNum(perClick));
});

clickerBtn.addEventListener('mousemove', (e) => {
  const rect = clickerBtn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  clickerBtn.style.setProperty('--x', x + '%');
  clickerBtn.style.setProperty('--y', y + '%');
});

clickerBtn.addEventListener('mouseleave', () => {
  clickerBtn.style.setProperty('--x', '30%');
  clickerBtn.style.setProperty('--y', '30%');
});

setInterval(() => {
  if (perSecond > 0) {
    // Synergy Engine - each owned upgrade boosts passive income
    let synergyBonus = 0;
    if (upgrades['synergy'] && upgrades['synergy'].level > 0) {
      const totalUpgrades = Object.values(upgrades).filter(u => u.level > 0).length;
      synergyBonus = totalUpgrades * upgrades['synergy'].synergyBonus;
    }

    // Time Warp - speeds up game ticks
    let tickMultiplier = 1;
    if (upgrades['timewarp'] && upgrades['timewarp'].level > 0) {
      tickMultiplier += upgrades['timewarp'].timeWarpBonus;
    }

score += (perSecond / 10) * (1 + synergyBonus) * tickMultiplier;
        updateUI();
        autoSave();
      }
}, 100);

// Save/Load system
function saveGame() {
  const saveData = {
    score,
    perClick,
    perSecond,
    totalClicks,
    lastClickTime,
    comboCounter,
    rebirths,
    upgrades: {}
  };
  Object.keys(upgrades).forEach(key => {
    saveData.upgrades[key] = { ...upgrades[key] };
  });
  // Manual save replaces the auto-save cache
  localStorage.setItem('school-clicker-save', JSON.stringify(saveData));
  const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'school-clicker-save.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  saveBtn.textContent = 'Saved!';
  setTimeout(() => { saveBtn.textContent = 'Save'; }, 1000);
}

function loadGame() {
  document.getElementById('loadInput').value = '';
  document.getElementById('loadInput').click();
}

document.getElementById('loadInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const saveData = JSON.parse(event.target.result);
      score = saveData.score || 0;
      perClick = saveData.perClick || 1;
      perSecond = saveData.perSecond || 0;
      totalClicks = saveData.totalClicks || 0;
      lastClickTime = saveData.lastClickTime || 0;
      comboCounter = saveData.comboCounter || 0;
      if (saveData.upgrades) {
        Object.keys(saveData.upgrades).forEach(key => {
          if (upgrades[key]) {
            upgrades[key] = { ...upgrades[key], ...saveData.upgrades[key] };
          }
        });
      }
      // Manual load replaces the auto-save cache
      saveData.rebirths = rebirths;
      localStorage.setItem('school-clicker-save', JSON.stringify(saveData));
      updateUI();
      loadBtn.textContent = 'Loaded!';
      setTimeout(() => { loadBtn.textContent = 'Load'; }, 1000);
    } catch (err) {
      loadBtn.textContent = 'Error';
      setTimeout(() => { loadBtn.textContent = 'Load'; }, 1000);
    }
  };
  reader.readAsText(file);
});

saveBtn.addEventListener('click', saveGame);
loadBtn.addEventListener('click', loadGame);
rebirthBtn.addEventListener('click', rebirth);

// Cursor-following blob
const blobs = document.querySelectorAll('.blob');
const halfSize = Math.min(window.innerWidth, window.innerHeight) * 0.25; // half of 50vmin

document.addEventListener('mousemove', (e) => {
  const x = e.clientX - halfSize;
  const y = e.clientY - halfSize;
  blobs[0].style.transform = `translate(${x}px, ${y}px)`;
  blobs[1].style.transform = `translate(${x}px, ${y}px)`;
});

createUpgrades();
autoLoad();
updateUI();

// Auto-save on page close
window.addEventListener('beforeunload', autoSave);