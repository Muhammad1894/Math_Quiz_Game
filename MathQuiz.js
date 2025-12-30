const gameState = {
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentProblem: null,
  disabledOptions: [],
  level: "medium",
  timeLeft: 60,
  timer: null,
  problemsSolved: 0,
  totalProblems: 10,
};

const problemElement = document.getElementById("problem");
const optionsElement = document.getElementById("options");
const alertElement = document.getElementById("alert");
const scoreElement = document.getElementById("score");
const correctElement = document.getElementById("correct");
const wrongElement = document.getElementById("wrong");
const nextButton = document.getElementById("next-btn");
const hintButton = document.getElementById("hint-btn");
const levelSelector = document.getElementById("level");
const autoSolveButton = document.getElementById("auto-solve-btn");
const progressElement = document.getElementById("progress");
const timerElement = document.getElementById("timer");
const gameOverElement = document.getElementById("game-over");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-btn");

function initGame() {
  gameState.score = 0;
  gameState.correctAnswers = 0;
  gameState.wrongAnswers = 0;
  gameState.disabledOptions = [];
  gameState.problemsSolved = 0;
  gameState.timeLeft = 60;

  updateStats();
  generateProblem();
  startTimer();

  gameOverElement.style.display = "none";
}

function generateProblem() {
  gameState.disabledOptions = [];

  alertElement.style.display = "none";

  let num1, num2, operator, answer;
  const level = gameState.level;

  if (level === "easy") {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;

    operator = ["+", "-"][Math.floor(Math.random() * 2)];
  } else if (level === "medium") {
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
    operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
  } else {
    num1 = Math.floor(Math.random() * 100) + 1;
    num2 = Math.floor(Math.random() * 100) + 1;
    operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];

    if (operator === "/") {
      num2 = Math.floor(Math.random() * 10) + 1; // num2 = 8
      num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    }
  }

  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "*":
      answer = num1 * num2;
      break;
    case "/":
      answer = num1 / num2;
      break;
  }

  gameState.currentProblem = {
    expression: `${num1} ${operator} ${num2}`,
    answer: answer,
  };

  problemElement.textContent = `${num1} ${operator} ${num2} = ?`;

  generateOptions(answer);

  updateProgress();
}

// prsyaraka w walamakay
function generateOptions(correctAnswer) {

  optionsElement.innerHTML = "";

  const options = [correctAnswer];

 
  while (options.length < 4) {
    let wrongOption;

    if (gameState.level === "easy") {
      wrongOption =
        correctAnswer +
        (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
    } else if (gameState.level === "medium") {
      wrongOption =
        correctAnswer +
        (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
    } else {
      wrongOption =
        correctAnswer +
        (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 1);
    }

    if (wrongOption !== correctAnswer && !options.includes(wrongOption)) {
      options.push(wrongOption);
     
    }
  }


  shuffleArray(options);
 
  options.forEach((option) => {
    const optionElement = document.createElement("div"); 
    optionElement.className = "option"; 
    optionElement.textContent = option;
    optionElement.dataset.value = option;
    optionElement.addEventListener("click", handleOptionClick); 
    optionsElement.appendChild(optionElement); 
   
  });
}


function handleOptionClick(event) {
  const selectedOption = event.target; 
  const selectedValue = parseFloat(selectedOption.dataset.value);

  if (gameState.disabledOptions.includes(selectedValue)) {
    showAlert(); 
    return;
  }


  if (selectedValue === gameState.currentProblem.answer) {

    selectedOption.classList.add("correct");
    gameState.score += 10; 
    gameState.correctAnswers++; 
    gameState.timeLeft += 5; 


    document.querySelectorAll(".option").forEach((option) => {
      option.classList.add("disabled");
    });

   
    updateStats();

    setTimeout(() => {
      nextProblem(); 
    }, 1500); 
  } else {
    
    selectedOption.classList.add("wrong"); 
    gameState.wrongAnswers++; 
    gameState.disabledOptions.push(selectedValue);
    gameState.score -= 3;

    showAlert();


    updateStats();
  }
}


function showAlert() {
  alertElement.style.display = "block";
  setTimeout(() => {
    alertElement.style.display = "none";
  }, 2000); 
}


function nextProblem() {
  gameState.problemsSolved++;


  if (gameState.problemsSolved >= gameState.totalProblems) {
    endGame();
  } else {
    generateProblem();
  }
}


function updateStats() {
  scoreElement.textContent = gameState.score; 
  correctElement.textContent = gameState.correctAnswers; 
  wrongElement.textContent = gameState.wrongAnswers;
}

function updateProgress() {
  const progress = (gameState.problemsSolved / gameState.totalProblems) * 100;
  progressElement.style.width = `${progress}%`; 
}

function startTimer() {
  clearInterval(gameState.timer);
  gameState.timer = setInterval(() => {
    gameState.timeLeft--;
    timerElement.textContent = `Time: ${gameState.timeLeft}s`;

    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}


function endGame() {
  clearInterval(gameState.timer);



  gameOverElement.style.display = "block";
  finalScoreElement.textContent = gameState.score; 

  createConfetti();


  document.querySelectorAll(".option").forEach((option) => {
    option.classList.add("disabled");
  });
}

function createConfetti() {
  const colors = ["#4361ee", "#3a0ca3", "#f72585", "#4cc9f0", "#f8961e"];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 10 + 5 + "px";
    confetti.style.height = Math.random() * 10 + 5 + "px";
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(confetti);


    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

function autoSolve() {

  document.querySelectorAll(".option").forEach((option) => {
    if (parseFloat(option.dataset.value) === gameState.currentProblem.answer) {


      option.classList.add("correct");
    }

    option.classList.add("disabled");
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}




nextButton.addEventListener("click", nextProblem);


hintButton.addEventListener("click", () => {

  const wrongOptions = Array.from(document.querySelectorAll(".option")).filter(
    (option) =>

      parseFloat(option.dataset.value) !== gameState.currentProblem.answer &&

      !gameState.disabledOptions.includes(parseFloat(option.dataset.value))
  );


  if (wrongOptions.length >= 2) {
    wrongOptions[0].classList.add("disabled");
    wrongOptions[1].classList.add("disabled"); 
    gameState.disabledOptions.push(parseFloat(wrongOptions[0].dataset.value));
    gameState.disabledOptions.push(parseFloat(wrongOptions[1].dataset.value));
  }

  gameState.score = -5;
  updateStats();
});


levelSelector.addEventListener("change", (event) => {
  gameState.level = event.target.value; 
  initGame();
});


autoSolveButton.addEventListener("click", autoSolve);

restartButton.addEventListener("click", initGame);

window.addEventListener("load", initGame);

