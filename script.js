const STORAGE_KEY = 'scoreKeeperScores';
const STORAGE_KEY_NAMES = 'scoreKeeperTeamNames';
const STORAGE_KEY_GOALS = 'scoreKeeperGoalTimes';
const MAX_GOALS_SHOWN = 5;

const scores = {
  a: 0,
  b: 0
};

const teamNames = {
  a: 'Team A',
  b: 'Team B'
};

const goalTimestamps = {
  a: [],
  b: []
};

function getScoreElement(team) {
  return document.getElementById('score-' + team);
}

const SCORE_SIZE_BASE = 3;   // rem
const SCORE_SIZE_PER_POINT = 0.15; // rem per point
const SCORE_SIZE_MAX = 6;   // rem

function updateScoreDisplay(team) {
  const el = getScoreElement(team);
  if (!el) return;
  const score = scores[team];
  el.textContent = score;
  const sizeRem = Math.min(SCORE_SIZE_BASE + score * SCORE_SIZE_PER_POINT, SCORE_SIZE_MAX);
  el.style.fontSize = sizeRem + 'rem';
}

function saveScoresToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {
    console.warn('Could not save scores to localStorage', e);
  }
}

function loadScoresFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed.a === 'number') scores.a = Math.max(0, parsed.a);
      if (typeof parsed.b === 'number') scores.b = Math.max(0, parsed.b);
      updateScoreDisplay('a');
      updateScoreDisplay('b');
    }
  } catch (e) {
    console.warn('Could not load scores from localStorage', e);
  }
}

function saveTeamNamesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_NAMES, JSON.stringify(teamNames));
  } catch (e) {
    console.warn('Could not save team names to localStorage', e);
  }
}

function loadTeamNamesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_NAMES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed.a === 'string' && parsed.a.trim()) teamNames.a = parsed.a.trim();
      if (typeof parsed.b === 'string' && parsed.b.trim()) teamNames.b = parsed.b.trim();
    }
    const nameA = document.getElementById('name-a');
    const nameB = document.getElementById('name-b');
    if (nameA) nameA.textContent = teamNames.a;
    if (nameB) nameB.textContent = teamNames.b;
  } catch (e) {
    console.warn('Could not load team names from localStorage', e);
  }
}

function saveGoalTimesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goalTimestamps));
  } catch (e) {
    console.warn('Could not save goal times to localStorage', e);
  }
}

function loadGoalTimesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_GOALS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.a)) goalTimestamps.a = parsed.a.slice(-50);
      if (Array.isArray(parsed.b)) goalTimestamps.b = parsed.b.slice(-50);
    }
  } catch (e) {
    console.warn('Could not load goal times from localStorage', e);
  }
}

function formatGoalTime(timestamp) {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return diffMins === 1 ? '1 min ago' : diffMins + ' min ago';
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24 && date.getDate() === new Date(now).getDate()) {
    return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function updateGoalTimesDisplay(team) {
  const list = document.getElementById('goals-' + team);
  if (!list) return;
  const times = goalTimestamps[team].slice(-MAX_GOALS_SHOWN).reverse();
  list.innerHTML = '';
  times.forEach(function (ts) {
    const li = document.createElement('li');
    li.textContent = formatGoalTime(ts);
    list.appendChild(li);
  });
}

function recordGoal(team) {
  goalTimestamps[team].push(Date.now());
  if (goalTimestamps[team].length > 50) goalTimestamps[team] = goalTimestamps[team].slice(-50);
  saveGoalTimesToStorage();
  updateGoalTimesDisplay(team);
}

function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  }
}

function incrementTeamA() {
  scores.a += 1;
  updateScoreDisplay('a');
  saveScoresToStorage();
  fireConfetti();
  recordGoal('a');
}

function decrementTeamA() {
  if (scores.a > 0) {
    scores.a -= 1;
    updateScoreDisplay('a');
    saveScoresToStorage();
  }
}

function incrementTeamB() {
  scores.b += 1;
  updateScoreDisplay('b');
  saveScoresToStorage();
  fireConfetti();
  recordGoal('b');
}

function decrementTeamB() {
  if (scores.b > 0) {
    scores.b -= 1;
    updateScoreDisplay('b');
    saveScoresToStorage();
  }
}

function initTeamNameEdit() {
  document.querySelectorAll('.team-name').forEach(function (el) {
    el.addEventListener('blur', function () {
      const team = this.getAttribute('data-team');
      const text = this.textContent.trim();
      teamNames[team] = text || (team === 'a' ? 'Team A' : 'Team B');
      this.textContent = teamNames[team];
      saveTeamNamesToStorage();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') this.blur();
    });
  });
}

loadScoresFromStorage();
loadTeamNamesFromStorage();
loadGoalTimesFromStorage();
updateGoalTimesDisplay('a');
updateGoalTimesDisplay('b');
initTeamNameEdit();
