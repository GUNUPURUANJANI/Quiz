let questions = [];
let selectedQuestions = [];
let currentQuestion = {};
let score = 0;
let questionIndex = 0;

let timer;
let timeLeft = 10;

// Load JSON
async function loadQuestions() {
  const response = await fetch("questions.json");
  questions = await response.json();

  startQuiz();
}

// Start Quiz (pick 10 random questions)
function startQuiz() {
  score = 0;
  questionIndex = 0;

  // Shuffle and pick first 10
  selectedQuestions = [...questions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  loadQuestion();
}

// Load Question
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 20;

  document.getElementById("timer").innerText = timeLeft;
  document.getElementById("result").innerText = "";

  // Quiz finished
  if (questionIndex === selectedQuestions.length) {
    document.querySelector(".quiz-container").innerHTML = `
      <h2>Quiz Finished 🎉</h2>
      <p>Your Score: ${score}/10</p>
      <button onclick="restartQuiz()">Play Again 🔄</button>
    `;
    return;
  }

  currentQuestion = selectedQuestions[questionIndex];

  // Update UI
  document.getElementById("question").innerText = currentQuestion.question;
  document.getElementById("A").innerText = currentQuestion.A;
  document.getElementById("B").innerText = currentQuestion.B;
  document.getElementById("C").innerText = currentQuestion.C;
  document.getElementById("D").innerText = currentQuestion.D;

  // Progress
  document.getElementById("progressText").innerText =
    `Question ${questionIndex + 1}/10`;

  document.getElementById("progress").style.width =
    ((questionIndex + 1) / 10) * 100 + "%";

  startTimer();
}

// Timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      showCorrectAnswer();
      setTimeout(() => {
        questionIndex++;
        loadQuestion();
      }, 1000);
    }
  }, 1000);
}

// Check Answer
function checkAnswer(option) {
  clearInterval(timer);

  const buttons = document.querySelectorAll(".option");
  buttons.forEach(btn => btn.disabled = true);

  if (option === currentQuestion.answer) {
    document.getElementById(option).classList.add("correct");
    score++;
  } else {
    document.getElementById(option).classList.add("wrong");
    document.getElementById(currentQuestion.answer).classList.add("correct");
  }

  setTimeout(() => {
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove("correct", "wrong");
    });

    questionIndex++;
    loadQuestion();
  }, 1000);
}

// Show correct if time ends
function showCorrectAnswer() {
  document.getElementById(currentQuestion.answer).classList.add("correct");
}

// Restart quiz
function restartQuiz() {
  location.reload(); // simplest way
}

// Start
loadQuestions();
