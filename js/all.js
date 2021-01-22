const displayStart = document.querySelector(".js-start");
const answer = document.querySelector(".js-answer");
const tryAgain = document.querySelector(".js-tryAgain");

const game = function () {
  const displayTime = document.querySelector(".js-time");
  const firstNumber = document.querySelector(".js-firstNumber");
  const secondaryNumber = document.querySelector(".js-secondaryNumber");
  const operator = document.querySelector(".js-operator");
  const scoreNumber = document.querySelector(".js-score");
  const displayMain = document.querySelector(".js-main");
  const displayQuestion = document.querySelector(".js-question");
  const displayResult = document.querySelector(".js-result");
  const finalScore = document.querySelector(".js-finalScore");

  const vm = this;
  let time = 0;
  let score = 0;
  let questionTemp = [];
  let isCheat = true;
  this.start = () => {
    if (time > 0 && time < 60) {
      return;
    } else {
      displayMain.classList.add("d-none");
      displayQuestion.classList.remove("d-none");
      displayResult.classList.add("d-none");
      time = 0;
      score = 0;
      isCheat = false
      scoreNumber.textContent = vm.scoreFormat(score);
      answer.value = "";
      vm.render();
      for (let z = 1; z <= 60; z++) {
        setTimeout(() => {
          time++;
          if (z <= 59) {
            displayTime.innerHTML = `00 : ${vm.timeFormat(time)}`;
          } else {
            displayTime.innerHTML = `01 : 00`;
            displayQuestion.classList.add("d-none");
            displayResult.classList.remove("d-none");
            finalScore.textContent = score;
          }
        }, 1000 * z);
      }
    }
  };
  /* 製造亂數成為題目 */
  this.numOutput = () => {
    return String(Math.floor(Math.random() * 10));
  };
  this.operatorOutput = () => {
    let operatorIndex = Math.floor(Math.random() * Math.floor(4));
    switch (operatorIndex) {
      case 0:
        return "+";
        break;
      case 1:
        return "-";
        break;
      case 2:
        return "*";
        break;
      case 3:
        return "/";
        break;
    }
  };
  /* 格式化數字 */
  this.answerFormat = (num) => {
    if (isNaN(num)) {
      return 0;
    } else if (num === Infinity || num === -Infinity) {
      return 0;
    } else {
      return Math.floor(num);
    }
  };
  this.timeFormat = (num) => {
    if (num < 10) {
      return (newStr = `0${num}`);
    } else {
      return num;
    }
  };
  this.scoreFormat = (num) => {
    if (num < 10) {
      return `00${num}`;
    } else if (num >= 10 && num <= 99) {
      return `0${num}`;
    } else if (num >= 100 && num <= 999) {
      return num;
    }
  };
  /* 渲染題目至畫面 */
  this.render = () => {
    if (isCheat === true) {
      return
    } else if (time <= 20) {
      firstNumber.textContent = vm.numOutput();
      secondaryNumber.textContent = vm.numOutput();
      operator.textContent = vm.operatorOutput();
      questionTemp.push(
        firstNumber.textContent,
        operator.textContent,
        secondaryNumber.textContent
      );
    } else if (time >= 21 && time <= 40) {
      firstNumber.textContent = `${Number(vm.numOutput() + vm.numOutput())}`;
      secondaryNumber.textContent = `${Number(
        vm.numOutput() + vm.numOutput()
      )}`;
      operator.textContent = `${vm.operatorOutput()}`;
      questionTemp.push(
        firstNumber.textContent,
        operator.textContent,
        secondaryNumber.textContent
      );
    } else if (time >= 41 && time <= 59) {
      firstNumber.textContent = `${Number(
        vm.numOutput() + vm.numOutput() + vm.numOutput()
      )}`;
      secondaryNumber.textContent = `${Number(
        vm.numOutput() + vm.numOutput() + vm.numOutput()
      )}`;
      operator.textContent = `${vm.operatorOutput()}`;
      questionTemp.push(
        firstNumber.textContent,
        operator.textContent,
        secondaryNumber.textContent
      );
    }
  };
  /* 檢查輸入答案並換題，最後清空輸入欄位 */
  this.inputEnter = (e) => {
    if (
      e.code === "NumpadEnter" ||
      (e.code === "Enter" && time >= 1 && time <= 59)
    ) {
      isCheat = false
      vm.checkAnswer();
      vm.render();
      answer.value = "";
      isCheat = true
    } else {
      return;
    }
  };
  this.checkAnswer = () => {
    let answerNumber = Number(answer.value);
    if (vm.answerFormat(eval(questionTemp.join(""))) === answerNumber && answer.value !== '') {
      if (time <= 40) {
        score += 1;
      } else if (time >= 41 && time <= 59) {
        score += 5;
      }
    } else {
      if (score !== 0) {
        score -= 1;
      }
    }
    scoreNumber.textContent = vm.scoreFormat(score);
    questionTemp = [];
  };
};
const newGame = new game();
displayStart.addEventListener("click", newGame.start);
answer.addEventListener("keydown", newGame.inputEnter);
tryAgain.addEventListener("click", newGame.start);