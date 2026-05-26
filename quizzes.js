const QUIZ_DATA = {
  group_a: [
    { file: 'quiz_omada_a/1-Αναλυτική Χημεία.json', icon: '🔍' },
    { file: 'quiz_omada_a/2-Βιοχημεία & Φαρμακολογία.json', icon: '🧬' },
    { file: 'quiz_omada_a/3-Χημεία Εργαστηρίου & Ιδιότητες Ουσιών.json', icon: '🧪' },
    { file: 'quiz_omada_a/4-Εργαστηριακές Τεχνικές & Ασφάλεια Εργαστηρίου.json', icon: '🛡️' },
    { file: 'quiz_omada_a/5-Τεχνολογία Καλλυντικών.json', icon: '💄' },
    { file: 'quiz_omada_a/6-Διασφάλιση Ποιότητας & Περιβαλλοντικός Έλεγχος.json', icon: '✓' },
    { file: 'quiz_omada_a/7-Βασικές Αρχές Χημείας & Εργαστηριακές Μετρήσεις.json', icon: '⚗️' },
    { file: 'quiz_omada_a/8-Φαρμακευτικό Marketing & Τεχνολογία Σκευασμάτων.json', icon: '💊' }
  ],
  group_b: [
    { file: 'quiz_omada_b/1-Διαλύματα & Χημεία.json', icon: '🧪' },
    { file: 'quiz_omada_b/2-Χημεία & Φυσικοχημεία.json', icon: '⚗️' },
    { file: 'quiz_omada_b/3-Αναλυτικά Όργανα & Χρωματογραφία.json', icon: '🔬' },
    { file: 'quiz_omada_b/4-Τεχνολογία & Μικροβιολογία.json', icon: '🧬' },
    { file: 'quiz_omada_b/5-Ρεολογία & Φυσικοχημεία.json', icon: '📊' },
    { file: 'quiz_omada_b/6-Καλλυντικά-Σύσταση & Τεχνολογία.json', icon: '💄' },
    { file: 'quiz_omada_b/7-Πρώτες Ύλες & Περαιτέρω Καλλυντικά.json', icon: '🌿' },
    { file: 'quiz_omada_b/8-Φαρμακολογία & Φαρμακευτική Τεχνολογία.json', icon: '💊' }
  ]
};

async function loadQuizzes() {
  const quizList = document.getElementById('quizList');
  
  const groupASection = document.createElement('div');
  groupASection.className = 'quiz-group-section';
  groupASection.innerHTML = '<h2 class="group-title">Ομάδα Α</h2>';
  
  const groupBSection = document.createElement('div');
  groupBSection.className = 'quiz-group-section';
  groupBSection.innerHTML = '<h2 class="group-title">Ομάδα Β</h2>';
  
  const groupACards = document.createElement('div');
  groupACards.className = 'quiz-cards';
  
  const groupBCards = document.createElement('div');
  groupBCards.className = 'quiz-cards';

  for (const quiz of QUIZ_DATA.group_a) {
    try {
      const response = await fetch(quiz.file);
      const data = await response.json();
      const card = createQuizCard(data, quiz.file, quiz.icon);
      groupACards.appendChild(card);
    } catch (error) {
      console.error(`Error loading ${quiz.file}:`, error);
    }
  }

  for (const quiz of QUIZ_DATA.group_b) {
    try {
      const response = await fetch(quiz.file);
      const data = await response.json();
      const card = createQuizCard(data, quiz.file, quiz.icon);
      groupBCards.appendChild(card);
    } catch (error) {
      console.error(`Error loading ${quiz.file}:`, error);
    }
  }

  groupASection.appendChild(groupACards);
  groupBSection.appendChild(groupBCards);
  
  quizList.appendChild(groupASection);
  quizList.appendChild(groupBSection);
}

function createQuizCard(quizData, filePath, icon) {
  const card = document.createElement('div');
  card.className = 'quiz-card';
  
  const title = quizData.title || 'Κουίζ χωρίς τίτλο';
  const questions = quizData.totalQuestions || quizData.questions?.length || 0;
  
  card.innerHTML = `
    <div class="quiz-card-icon">${icon}</div>
    <h3>${title}</h3>
    <p class="quiz-questions-count">${questions} ερωτήσεις</p>
    <button class="quiz-btn" onclick="startQuiz('${filePath}', '${title.replace(/'/g, "\\'")}')">Έναρξη</button>
  `;
  
  return card;
}

function startQuiz(filePath, title) {
  sessionStorage.setItem('quizFile', filePath);
  sessionStorage.setItem('quizTitle', title);
  window.location.href = 'quiz.html';
}

document.addEventListener('DOMContentLoaded', loadQuizzes);
