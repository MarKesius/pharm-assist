let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStarted = false;

async function initializeQuiz() {
  const quizFile = sessionStorage.getItem('quizFile');
  const quizTitle = sessionStorage.getItem('quizTitle');
  
  if (!quizFile) {
    window.location.href = 'quizzes.html';
    return;
  }
  
  try {
    const response = await fetch(quizFile);
    currentQuiz = await response.json();
    
    document.getElementById('quizTitle').textContent = currentQuiz.title || 'Κουίζ';
    document.getElementById('quizSubtitle').textContent = `${currentQuiz.totalQuestions || currentQuiz.questions?.length || 0} ερωτήσεις`;
    
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    
    renderQuiz();
  } catch (error) {
    console.error('Error loading quiz:', error);
    document.getElementById('quizContainer').innerHTML = '<p>Σφάλμα κατά τη φόρτωση του κουίζ.</p>';
  }
}

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  
  if (!quizStarted) {
    showStartScreen();
    return;
  }
  
  if (currentQuestionIndex >= currentQuiz.questions.length) {
    showResults();
    return;
  }
  
  const question = currentQuiz.questions[currentQuestionIndex];
  container.innerHTML = '';
  
  const questionDiv = document.createElement('div');
  questionDiv.className = 'quiz-question-card';
  
  questionDiv.innerHTML = `
    <div class="question-number">Ερώτηση ${currentQuestionIndex + 1} / ${currentQuiz.questions.length}</div>
    <h3>${question.question}</h3>
  `;
  
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'quiz-options';
  
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'quiz-option';
    
    const isSelected = userAnswers[currentQuestionIndex] === option.label;
    if (isSelected) {
      optionDiv.classList.add('selected');
    }
    
    optionDiv.innerHTML = `
      <input type="radio" id="option-${index}" name="answer" value="${option.label}" 
             ${isSelected ? 'checked' : ''} onchange="selectAnswer('${option.label}')">
      <label for="option-${index}">
        <span class="option-label">${option.label}</span>
        <span class="option-text">${option.text}</span>
      </label>
    `;
    
    optionsDiv.appendChild(optionDiv);
  });
  
  questionDiv.appendChild(optionsDiv);
  container.appendChild(questionDiv);
  
  const navDiv = document.createElement('div');
  navDiv.className = 'quiz-navigation';
  
  if (currentQuestionIndex > 0) {
    navDiv.innerHTML += '<button class="quiz-btn-prev" onclick="previousQuestion()">← Προηγούμενη</button>';
  }
  
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    navDiv.innerHTML += '<button class="quiz-btn-next" onclick="nextQuestion()">Επόμενη →</button>';
  } else {
    navDiv.innerHTML += '<button class="quiz-btn-submit" onclick="submitQuiz()">Ολοκλήρωση</button>';
  }
  
  questionDiv.appendChild(navDiv);
  
  updateProgress();
}

function showStartScreen() {
  const container = document.getElementById('quizContainer');
  container.innerHTML = `
    <div class="quiz-start-screen">
      <h2>Είστε έτοιμοι;</h2>
      <p>Αυτό το κουίζ περιέχει <strong>${currentQuiz.questions.length}</strong> ερωτήσεις.</p>
      <p>Διαθέτετε όσο χρόνο χρειάζεστε για να συμπληρώσετε κάθε ερώτηση.</p>
      <button class="quiz-btn-large" onclick="startQuizSession()">Έναρξη</button>
      <button class="quiz-btn-back" onclick="backToList()">Επιστροφή</button>
    </div>
  `;
}

function startQuizSession() {
  quizStarted = true;
  currentQuestionIndex = 0;
  renderQuiz();
}

function selectAnswer(answer) {
  userAnswers[currentQuestionIndex] = answer;
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    renderQuiz();
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuiz();
  }
}

function submitQuiz() {
  showResults();
}

function showResults() {
  const container = document.getElementById('quizContainer');
  
  let correctCount = 0;
  const resultsHTML = currentQuiz.questions.map((question, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = question.correctAnswer || question.options.find(o => o.isCorrect)?.label;
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) correctCount++;
    
    const selectedOption = question.options.find(o => o.label === userAnswer);
    const correctOption = question.options.find(o => o.label === correctAnswer);
    
    return `
      <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="result-question">
          <strong>Ερώτηση ${index + 1}:</strong> ${question.question}
        </div>
        <div class="result-answer">
          <div>Η απάντησή σας: <strong>${userAnswer || 'Δεν απαντήθηκε'}</strong> ${selectedOption ? `- ${selectedOption.text}` : ''}</div>
          ${!isCorrect ? `<div>Σωστή απάντηση: <strong>${correctAnswer}</strong> - ${correctOption?.text || ''}</div>` : ''}
          ${selectedOption?.rationale ? `<div class="rationale">Εξήγηση: ${selectedOption.rationale}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  const percentage = Math.round((correctCount / currentQuiz.questions.length) * 100);
  
  container.innerHTML = `
    <div class="quiz-results">
      <h2>Αποτελέσματα</h2>
      <div class="results-score">
        <div class="score-value">${percentage}%</div>
        <div class="score-text">${correctCount} / ${currentQuiz.questions.length} σωστές</div>
      </div>
      <div class="results-list">
        ${resultsHTML}
      </div>
      <div class="results-actions">
        <button class="quiz-btn" onclick="location.reload()">Επανάληψη</button>
        <button class="quiz-btn" onclick="backToList()">Πίσω στα Κουίζ</button>
      </div>
    </div>
  `;
}

function updateProgress() {
  const progressContainer = document.getElementById('progressContainer');
  const percentage = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  
  progressContainer.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${percentage}%"></div>
    </div>
    <div class="progress-text">${currentQuestionIndex + 1} / ${currentQuiz.questions.length}</div>
  `;
}

function backToList() {
  sessionStorage.removeItem('quizFile');
  sessionStorage.removeItem('quizTitle');
  window.location.href = 'quizzes.html';
}

document.addEventListener('DOMContentLoaded', initializeQuiz);
