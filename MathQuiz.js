

const gameState = {
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentProblem: null,
  // katek optionekey (walameky) xalat hal abzheret la naw am arrayada save dabet bo awa dubara natwani halebzheretawa
  disabledOptions: [], // la xwarawa zyatr basy dakam
  level: "medium", // har la saratawa by defult la mediamawa dast pey dakat
  timeLeft: 60,
  timer: null,
  problemsSolved: 0,
  totalProblems: 10,
};

// henanaway elemntakan 
const problemElement = document.getElementById("problem");  // 4 + 5 => ama peshan adat
const optionsElement = document.getElementById("options");  // lerada optionakan da danein (4 buttnaka)
const alertElement = document.getElementById("alert");      // bo agadareyakaya katek walamekey xalat hal abzheret

const scoreElement = document.getElementById("score");      
const correctElement = document.getElementById("correct");
const wrongElement = document.getElementById("wrong");

const nextButton = document.getElementById("next-btn");     
const hintButton = document.getElementById("hint-btn");

const levelSelector = document.getElementById("level");  // select 

const autoSolveButton = document.getElementById("auto-solve-btn");

       // progress aw bashaya ka pr abetawa katek walamakan hal abzheren
const progressElement = document.getElementById("progress"); 

const timerElement = document.getElementById("timer");

// score kotaey w (play again) dway yaryaka peshan adret
const gameOverElement = document.getElementById("game-over");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-btn");

// am functionaka hamw score w pointakan rest akatawa katak yaryka dast pey akat 
function initGame() {
   
  gameState.score = 0;
  gameState.correctAnswers = 0;
  gameState.wrongAnswers = 0;
  gameState.disabledOptions = [];
  gameState.problemsSolved = 0;
  gameState.timeLeft = 60;

  updateStats(); // katek yaryaka dasty pey krd xalakan updaite bkatawa (sfryan bkatawa)
  generateProblem(); // peshan daney prsyaraka
  startTimer(); // 

  // game over screenaka dasharetawa 
  gameOverElement.style.display = "none";
}

//am functiona prsyarakaman peshan adat
function generateProblem() {
  // away ba xalat hali bzhardwa lanaw am arrayadaya (dwatr la xwarawa basy dakam) rest akatawa (batali akat)
  gameState.disabledOptions = [];

  // aw boxaya ka pey dalet walami halay halbzhardwa
  alertElement.style.display = "none";


  let num1, num2, operator, answer;
  const level = gameState.level;

  // katek aikaina level easy 
  if (level === "easy") {
    // 2 zhmara dadat ba user la 1 ta 10 (+ yan -)
    num1 = Math.floor(Math.random() * 10) + 1; // reange la 1 ta 10ya 
    num2 = Math.floor(Math.random() * 10) + 1;
          // floor aikata zhmaray tawaw                 
                                    // ama la 0.0 bo 1.999...
    operator = ["+", "-"][Math.floor(Math.random() * 2)];  
    // operator akaina naw array  (+ la index 0 daya, - la index 1 daya)
  /*  bo nmuna 
    If Math.random() = 0.34 → 0.34 * 2 = 0.68
     → Math.floor(0.68) = 0 → ['+', '-'][0] = '+'
If Math.random() = 0.78 → 0.78 * 2 = 1.56 
→ Math.floor(1.56) = 1 → ['+', '-'][1] = '-'
 */


  } else if (level === "medium") { // la 1 ta 50
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
    operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
  } else {
    // agar easy yan mediam nabw 
    num1 = Math.floor(Math.random() * 100) + 1; // 1 ta 100
    num2 = Math.floor(Math.random() * 100) + 1;
    operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];

    
    if (operator === "/") {
      // katek dabash bw pewesta zhmarakan btwann dabash bbn w ba sheway
      // point dar nachet 
      num2 = Math.floor(Math.random() * 10) + 1; // num2 = 8
      num1 = num2 * (Math.floor(Math.random() * 10) + 1); 
      /* Example: Math.random() = 0.4 → 0.4 * 10 = 4 → 
                  Math.floor(4) = 4 → +1 = 5
                  num1 = num2 * 5 → 8 * 5
                  num1 = 40
            wata num2 / num1 wa akata 40 / 8 
      */
    }
  }
   // switch w case bo away aw operatoray la arrayaka boman dar achet 
   //wata agar indexakay sarawa yaksan bw ba sfr ama "+" dar achet wa pewesta
   // kokrdnawaman bo bkat
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
 // num1 = 5 , num2 = 3 , operator = "+"
  gameState.currentProblem = {
 // expression  :    5        +         3
    expression: `${num1} ${operator} ${num2}`,
    answer: answer,   // answer : 8 
    // am nrxai yata era walama rastakaya 
    // aineren bo functionu -> generateOption() boman akat ba 4 Option 
  };

  // ama aw bashaya ka la HTMLaka haya bo peshandani prsyaraka (line 30 la HTMl)
  // aw nrxay sarawa aikaina nawey 
  problemElement.textContent = `${num1} ${operator} ${num2} = ?`;

  // walama rastaka aneren bo am functiona 
  // la naw am functiona 4 Optionaka drwst akain
  generateOptions(answer);


  // // aw bashaya shenaya ka prdabetawa (xwar buttoni (nextPtoblem w Get Hint))
  // la xwarawa basy akam
  updateProgress();
}

// prsyaraka w walamakay
function generateOptions(correctAnswer) {

  // harkatek user walamakay halbzhard w prsyary dwatry peshanda 
  // awa 4 Optionaka aseretawa la prsyary dwatrda
  optionsElement.innerHTML = ""; 
// array bo 4 Optionaka xoman walama rastakay daxaina nawey
// wa dwatr ba randomi 3 Optioney bo daneren
  const options = [correctAnswer]; 


  // 3 Optioni tr zyad dakain balam abey wala rastakay teda nabet
  while (options.length < 4) { 
  let wrongOption;
   // walama rastaka bo nmuna = 8
   // ema 3 walami hala zyad dakain wa nrxakanian nzik bn la 8'awa

    if (gameState.level === "easy") {
      // 3 Optionaka la walama rastakawa nzikn 
      // walama rastaka ko yan kami zhmarayak akrey (1 ta 5)
      // walama halakan = walama rastaka (+ yan -) 1 ta 5
      // walama rastaka = 8 (3 Optionakay tr akrey amana bn 3,4,5,6,7,8,9,10,11,12,13)
      wrongOption =
        correctAnswer +
        (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
        // Math.random() = 0.0 to 0.999...  *   Math.random() * 5 → 0.0 to 4.999...
        // If Math.random() > 0.5 (50% chance), result is 1 wa Math.random() <= 0.5 (50% chance), result is -1
        // Math.random() * 5 → 0.0 to 4.999..., Math.floor(...) → 0, 1, 2, 3, or 4, + 1 → 1, 2, 3, 4, or 5
    } else if (gameState.level === "medium") {
      // bo qamesh ba haman shewa 
      // walama halakan = walama rastaka (+ yan -) 1 ta 10
      wrongOption =
        correctAnswer +
        (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
    } else {
    // bo bashi hard ba haman shewa 
      // walama halakan = walama rastaka (+ yan -) 1 ta 20
      wrongOption =
        correctAnswer +
        (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 1);
    }

    // bo away Optioni jyawaz daxl bkat w dwbara nabet 
// Optiona halakan yaksan nabey ba walama rastaka && nabey 2 Option haman yak dwbara betawa
    if (wrongOption !== correctAnswer && !options.includes(wrongOption)) {
                                  // aw optionay tr ka zyad dabet nabey la naw arrayakada habet 
      options.push(wrongOption); // push wata bekata naw arrayakawa
// aw dw marja jey baje bw awa aw optionam bo zyad bka
    }
  }

  // dway away loopaka tawaw bw esta arrayaka 4 nrxy teydaya
  // options = [walamarastaka, nrx1, nrx2, nrx3]
  shuffleArray(options); 
  // katek am functiona bakar ahenen nrxakan lanaw 
  // arrayakada shwenakayan dagoret bo away hamw jarek walama rastaka la haman shwenda nabey 
  // arrayakaman daneren bo naw aw functiona

 
  // loop bo nrxakani arrayaka 
  // nrxakan axata naw buttonawa, la loopakay sarawa 4'man danawa wata 4 opttion (div) drwst akat
  options.forEach((option) => {
    const optionElement = document.createElement("div"); // element dtwst akain 
    // daikaina naw (optionElement) wata line 34 la HTML
    optionElement.className = "option"; // classekey bo drwst dakain bo away style pe bdain la css
    optionElement.textContent = option; // option nrxakana (wata nrxakan zyad dakain bo am (div)a)
    optionElement.dataset.value = option; // data value'akay = "8" .. "5" ...
    optionElement.addEventListener("click", handleOptionClick); // bo away btwanin click'ey ley bkain
    optionsElement.appendChild(optionElement); // wata aw div'ana bo am basha zyad bka
    // (optionElement) wata line 34 la HTML
    /*  
     la kotaeyda ama bo HTML'aka zyad dabet w la sar screenaka aibenen
      <div class="option" data-value="5">5</div>
      <div class="option" data-value="8">8</div>
      <div class="option" data-value="3">3</div>
      <div class="option" data-value="11">11</div>

      wata aw option'anay aidain ba user ba div' krawa nak button
     */
  });
  
}

// katek click la (div) optionakan dakain
function handleOptionClick(event) {
  const selectedOption = event.target; // event.target wata aw elementa click'ey ley krawa
  const selectedValue = parseFloat(selectedOption.dataset.value);
  // away userhali bzhardwa.data-value'akay wardagrey lawanaya = "5" bet, balam ama Stringa
  // la regay parseFloat() daigoren bo number 

  /* 
  am if'a => katek user click la Optionekey hala dakat awa am optiona 
     ka hali bzhardwa dacheta naw aw arrayawa bo away user dubara natwanet 
     hali bzheretawa 
     disabledOptions ama arraya la sarawa nasandumana 
  */
  if (gameState.disabledOptions.includes(selectedValue)) {
    showAlert(); // ama agadaryakaya ka wa walamekey xalaty halbzhardwa
    return;
  }

  // agar user walama rastakay halbzhard amanaman bo bkat 
  if (selectedValue === gameState.currentProblem.answer) {
// wata (away user halibzhardwa === walamaka)  === wata haman haman value, haman type
    
// lerada sairy line 134 la CSS .option.correct 
// 1- classek zyad dakat ba nawey("correct") bo aw (div'ay ka walama rastakay tyaya) bo away style pey bdain
    selectedOption.classList.add("correct"); 
    gameState.score += 10       // 2-  10 score bo zyad bka 
    gameState.correctAnswers++ // 3- correct + 1 bka
    gameState.timeLeft += 5    // 4- zyad krdni 5 sanya bo katakay 

                                 // 5- aw optionanay tr ba user natwanet bakarwey benet
    document.querySelectorAll(".option").forEach((option) => {
      option.classList.add("disabled"); // class .disabled bo 3 optionakay tr zyad akain (line 127 la CSS)
    });

    // taza krdnaway score w correct w wrong lasar Screenaka
    updateStats();

   // prsyarekey trman pishn bdat dway 1.5 sanya
    // functioni setTimeout() fumctionekey 7azra la JS'da
    setTimeout(() => {
      nextProblem(); // prsyarey dwatrman peshan adat lera call'man krdotawa, la xwarawa basy akam
    }, 1500 );  // 1500 millisecond wata 1.5 sanya
    
  } else {
    // agar walami xalati halbzhard ba manaman bo bkat
    selectedOption.classList.add("wrong") // 1- zyad krdni classi wrong, pedani style Line 150 la CSS
    gameState.wrongAnswers++ // 2 - bashi Wrong la screenaka +1 bka
    gameState.disabledOptions.push(selectedValue) 
    /* 3- amay hali bzhardwa bekata naw aw arrayay ka lasarawa basm krd  
    disabledOptions ama arrayakaya walama alakan axaina erawa bo away user natwanek hali bzheretawa
    */
   // 4- la scoreakay -3  bkat
    gameState.score -= 3

    // 5- agadarey peshani user bdat (Wrong message) la (line 43 la HTML)
    showAlert()

    // updaite krdni xalakan la sar Screenaka
    updateStats()
  }
}

// peshan daney Wrong message (line 43 la HTML)
function showAlert() {
  alertElement.style.display = "block";
  setTimeout(() => {
    alertElement.style.display = "none";
  }, 2000) // 2000 millisecond wata 2s lasar screenaka bet
}

// peshandani prsyarey dwatr 
function nextProblem() {
  gameState.problemsSolved++; 

  // totalproblem = 10 lasarwa (line 1) nasandwmana wata 10 prsayr 
  // agar away user walami dawatawa >= bw la 10, ba yaryaka bwastet endGame()
  // agar na awa ba functioney generatePProblem() es bkat w prsyarekey tr peshani user bdat
  if (gameState.problemsSolved >= gameState.totalProblems) {
    endGame();
  } else {
    generateProblem();
  }
}

// updaiet krdni amarakan
function updateStats() {
  scoreElement.textContent = gameState.score; // score
  correctElement.textContent = gameState.correctAnswers; // Correct
  wrongElement.textContent = gameState.wrongAnswers;     // Wrong
}

// aw bashaya shenaya ka prdabetawa (xwar buttoni (nextPtoblem w Get Hint))
function updateProgress() {
  // (awya user walami dawatawa / 10) * 100
  // bo nmuna (3 / 10 * 100 = 30 ) wata (width'y) la sada 30% aw progressa prbetawa 
  const progress = (gameState.problemsSolved / gameState.totalProblems) * 100;
  progressElement.style.width = `${progress}%`; // {30}% =>  style (width = 30%)

}

// dast pe krdni kataka
// katek yaryaka dast pey bkat yan restart bkain awa am functiona Call akain
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

// am functiona katek yaryaka tawaw dabet amanaman bo bkat :
function endGame() {
  clearInterval(gameState.timer); //  1- kataka dawastenet 
  //  (bo nmuna user ba 50s tawawey dakat la 50s) wata rastawxo sfr nabetawa bahoy am functionawa

  // 2- am massga dakatawa (MESSAGE GAME OVER (Line 95 la HTML))
  gameOverElement.style.display = "block"; 
  finalScoreElement.textContent = gameState.score; // 3- pesandani Score kotaey

  // Drwst krdni animation bo dway yaryaka
  createConfetti();

  // for'ek bo away ka yaryaka tawaw bw user natwanet optionakan halbzheret 
  
   document.querySelectorAll(".option").forEach(
    (option) => {  
      // har 4 option'aka (div) classi .disabled bo zyad dakain (Line 131 la CSS)
    option.classList.add("disabled");
  });
  
}

// Drwst krdni animationaka (dway away yaryaka tawaw bw)
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

    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// buttoni auto solve katek user clicki ley krd boy shekar bkat
// am am functiona walama rastaka bo user haldabzeret 3 optionakay tr disable dakat user natwanit bakari benet
function autoSolve() {
  // loopek bo har 4 optionaka 
  document.querySelectorAll(".option").forEach(
    (option) => {  
    // aw dataset ka warey dagret -> ("8") daikain ba number la regay parseFloat
    // agar (aw dataset-value ka wary agren) === walmaka (walamaka la Line 132 save bwa )
    if (parseFloat(option.dataset.value) === gameState.currentProblem.answer) {
      // awa aw optiona (walama rastaka) classek bo div'akay zyad bka (.correct Line 139 la CSS) bo away styleakay bgoret w 
      // bbet ba walama rastaka w styleakay bgoret
      option.classList.add("correct");
    } 
  // else walama rastaka nabw aw optiona awa classi (.disabled) bo zyad bka w user natwanit hali bzheret
    option.classList.add("disabled");
  });
}


// am functiona la sarawa habw wtman 4 option'aka daxaina naw arrayakawa , daineren bo 
// am functiona (Line 207 la javaScript),  am functiona randomi shwenyan bo dyarey dakat
// bo away option'a rastaka har jaraw la shwenek bet 
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Event listeners bo buttnakan zyad dakain

// ama buttni (next problem) katek user clicki ley dakat awa fonctioni nextProblem esh dakat
// Line 308 la JavaScript
nextButton.addEventListener("click", nextProblem);

// katek user click lam buttna krd 2 optioni halay bo ladabat,
//  balam score'akay -5 dakret xo ba balash nya pey bleinawa
hintButton.addEventListener("click", () => {
  // Remove two wrong options as a hint
  const wrongOptions = Array.from(document.querySelectorAll(".option")).filter(
    (option) =>
      // (margy yakam ) wata aw dataset-value nabey yaksan bet ba  !== walama rastaka 
      parseFloat(option.dataset.value) !== gameState.currentProblem.answer &&
      // && (margy dwam) ama bo awaya 2 optioni jyawaz halbzheren nakre foraka dwjar dwbara betawa w haman option labaret
      // wata aw optiona nabet peshtr aw if'a hali bzhardbet
      !gameState.disabledOptions.includes(parseFloat(option.dataset.value))
  );

   // am if'a 2 optionaka haldabzheret w aixata naw arrayakay sarawa ka peshtr wtm option'a halakan 
   // dakaina nawey (bo away user natwanit hhali bzheret)
  if (wrongOptions.length >= 2) {
    wrongOptions[0].classList.add("disabled");
    wrongOptions[1].classList.add("disabled"); // option'a halaka classi disabled bo zyad bka w style bdarey la (140 CSS)
    gameState.disabledOptions.push(parseFloat(wrongOptions[0].dataset.value));
    gameState.disabledOptions.push(parseFloat(wrongOptions[1].dataset.value));
  }

  // wata -5 la score'akay bkat
  gameState.score = -5;
  updateStats();
});

// bo halbzhhardni level'akay
levelSelector.addEventListener("change", (event) => {
  gameState.level = event.target.value; // event.target.value wata away user hali dabzheret
  initGame();  // wata yaryakay bo dubara bkatawa
});

// katek click la buttni auto solve krd functioni autoSolve() esh bkat 
autoSolveButton.addEventListener("click", autoSolve);


restartButton.addEventListener("click", initGame);

// Initialize the game when the page loads
window.addEventListener("load", initGame);
/* window is the global object in browser JavaScript
   Represents the browser window/tab

   Why we use window:
To access browser events like page load
To ensure code runs in correct context
Some browsers require it, others don't (but it's good practice)
   */
