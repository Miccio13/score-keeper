const STORAGE_KEY = 'scoreKeeperScores';

const scores = {
  a: 0,
  b: 0
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
}

function decrementTeamB() {
  if (scores.b > 0) {
    scores.b -= 1;
    updateScoreDisplay('b');
    saveScoresToStorage();
  }
}

loadScoresFromStorage();
