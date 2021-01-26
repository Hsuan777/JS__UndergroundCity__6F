const displayStart = document.querySelector(".js-start");
const answer = document.querySelector(".js-answer");
const tryAgainAll = document.querySelectorAll(".js-tryAgain");
const leaderPage = document.querySelector(".js-leaderPage");
const gamerRecord = document.querySelector(".js-gamerRecord");
const gamerName = document.querySelector(".js-gamerName");

const game = function () {
  const displayTime = document.querySelector(".js-time");
  const firstNumber = document.querySelector(".js-firstNumber");
  const secondaryNumber = document.querySelector(".js-secondaryNumber");
  const operator = document.querySelector(".js-operator");
  const scoreNumber = document.querySelector(".js-score");
  const displayMain = document.querySelector(".js-main");
  const displayQuestion = document.querySelector(".js-question");
  const displayResult = document.querySelector(".js-result");
  const displayLeaderBoard = document.querySelector(".js-leaderBoard");
  const finalScore = document.querySelector(".js-finalScore");
  const finalCorrectTimes = document.querySelector(".js-correctTimes");
  const gamerList = document.querySelector(".js-gamerList");
  const apiGet = "https://spreadsheets.google.com/feeds/list/1B1uS_BDJW9PtwhoLNV95n7B4FSUqLxcRrv8Vms11Y4Y/1/public/values?alt=json"
  const apiPost = "https://script.google.com/macros/s/AKfycbxBjEDhEnIamuPAyulyynmUUq2fiQ3X64H86kVsd2XU42AtHuwsmw-ThQ/exec"


  const vm = this;
  let time = 0;
  let score = 0;
  let questionTemp = [];
  let isCheat = true;
  let correctTimes = 0 ;
  let correct40Times = 0
  let correct60Times = 0
  let timestampTemp = [];
  let gamerData = {
    name : '',
    score : 0,
    correct40 : 0,
    correct60 : 0,
    check: ''
  }
  this.start = () => {
    if ( Date.now() > timestampTemp[0] && Date.now() < timestampTemp[1]) {
      return;
    } else {
      displayMain.classList.add("d-none");
      displayQuestion.classList.remove("d-none");
      displayResult.classList.add("d-none");
      displayLeaderBoard.classList.add("d-none");
      time = 0;
      score = 0;
      correctTimes = 0;
      correct40Times = 0;
      correct60Times = 0;
      isCheat = false;
      scoreNumber.textContent = vm.scoreFormat(score);
      answer.value = "";
      displayTime.innerHTML = `00 : 00`
      timestampTemp = []
      timestampTemp.push(Date.now(), Date.now() + 60*1000)
      questionTemp = [];
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
            gamerName.classList.remove("d-none");
            gamerRecord.classList.remove("d-none");
            finalScore.textContent = score;
            finalCorrectTimes.textContent = `CorrectTimes : ${correctTimes}`
          }
        }, 1000 * z);
      }
    }
  };
  /* 製造亂數成為題目 */
  this.numOutput = (max, min) => {
    return String(Math.floor(Math.random() * ( max - min) + min ));
  };
  this.operatorOutput = () => {
    let operatorIndex = Math.floor(Math.random() * 4);
    switch (operatorIndex) {
      case 0:
        return ["+", "+"];
        break;
      case 1:
        return ["-", "−"];
        break;
      case 2:
        return ["*", "×"];
        break;
      case 3:
        return ["/", "÷"];
        break;
    }
  };
  /* 格式化數字 */
  this.answerFormat = (num) => {
    return Math.floor(num);
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
    } else {
      let newOperatorOutput = vm.operatorOutput()
      operator.textContent = newOperatorOutput[1];
      if (time <= 20) {
        firstNumber.textContent = vm.numOutput(10, 0);
        secondaryNumber.textContent = vm.numOutput(10, 0);
        questionTemp.push(
          firstNumber.textContent,
          newOperatorOutput[0],
          secondaryNumber.textContent
        );
        vm.isReset()
      } else if (time >= 21 && time <= 40) {
        firstNumber.textContent = vm.numOutput(100, 10);
        secondaryNumber.textContent = vm.numOutput(100, 10);
        questionTemp.push(
          firstNumber.textContent,
          newOperatorOutput[0],
          secondaryNumber.textContent
        );
        vm.isReset()
      } else if (time >= 41 && time <= 59) {
        firstNumber.textContent = vm.numOutput(1000, 100);
        secondaryNumber.textContent = vm.numOutput(1000, 100);
        questionTemp.push(
          firstNumber.textContent,
          newOperatorOutput[0],
          secondaryNumber.textContent
        );
        vm.isReset()
      }
    }
  };
  this.isReset = () => {
    let checkQuestion = eval(questionTemp.join(""));
    if (checkQuestion === Infinity || checkQuestion === -Infinity || isNaN(checkQuestion)) {
      isCheat = false;
      vm.render()
    }
  }
  /* 檢查輸入答案並換題，最後清空輸入欄位 */
  this.inputEnter = (e) => {
    if (
      e.code === "NumpadEnter" ||
      (e.code === "Enter" && Date.now() > timestampTemp[0] && Date.now() < timestampTemp[1])
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
      correctTimes += 1
      if (time <= 40) {
        correct40Times += 1
        score += 1;
      } else if (time >= 41 && time <= 59) {
        correct60Times += 1
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
  this.getData = () => {
    if (Date.now()) {
      displayMain.classList.add("d-none");
      displayQuestion.classList.add("d-none");
      displayResult.classList.add("d-none");
      displayLeaderBoard.classList.remove("d-none");
      let data = []
      let str = ''
      fetch(apiGet).then(response => {
        console.log(response)
        return response.json()
      }).then(response=>{
        data = response.feed.entry
        data.sort((a, b)=>{
          return b.gsx$score.$t - a.gsx$score.$t
        })
        data.map((item, index) => {
          if ( index < 5 ) {
            str += `<tr>
              <th scope="row">${index+1}</th>
              <td>${item.gsx$name.$t}</td>
              <td class="text-center">${item.gsx$score.$t}</td>
            </tr>`
          }
        })
        gamerList.innerHTML = str
      }).catch( () => 'Please Refresh')
      fetch(apiPost).then(response=>{
        return response.text()
      }).then(data=> gamerData.check = data)
    }
  };
  this.postData = () => {
    if (Date.now() > timestampTemp[1] && score > 0) {
      gamerName.classList.add("d-none");
      gamerRecord.classList.add("d-none");
      let newRecord = Object.assign({}, gamerData)
      newRecord.name = gamerName.value
      newRecord.score = score
      newRecord.correct40 = correct40Times
      newRecord.correct60 = correct60Times
      fetch(apiPost, {
        method: 'POST', 
        mode: 'cors', 
        body: JSON.stringify(newRecord),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(() => {
          vm.getData();
          score = 0;
      })
      .catch(() => '404')
    }
  }
};
const newGame = new game();
displayStart.addEventListener("click", newGame.start);
answer.addEventListener("keydown", newGame.inputEnter);
tryAgainAll.forEach(item => {
  item.addEventListener("click", newGame.start);
})
leaderPage.addEventListener("click", newGame.getData);
gamerRecord.addEventListener("click", newGame.postData);
