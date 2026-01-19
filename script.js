let playerSetup = document.getElementById("playerSetup")
let playerOne = document.getElementById("playerOne")
let playerTwo = document.getElementById("playerTwo")
let startBtn = document.getElementById("startBtn")

let categorySelection = document.getElementById("categorySelection")
let roundNum = document.getElementById("roundNum")
let selectCategory = document.getElementById("selectCategory")
let startRoundBtn = document.getElementById("startRoundBtn")

let questionGameplay = document.getElementById("questionGameplay")
let roundNumDisplay = document.getElementById("roundNumDisplay")
let categoryText = document.getElementById("categoryText")
let difficultyText = document.getElementById("difficultyText")
let whoseTurn = document.getElementById("whoseTurn")
let playerScoreOne = document.getElementById("playerScoreOne")
let playerScoreTwo = document.getElementById("playerScoreTwo")
let questionText = document.getElementById("questionText")
let optionRadio = document.getElementsByClassName("optionRadio")
let optionLabel = document.getElementsByClassName("optionLabel")
let checkAnswerMsg = document.getElementById("checkAnswerMsg")
let nextBtn = document.getElementById("nextBtn")

let roundSummary = document.getElementById("roundSummary")
let nextRoundBtn = document.getElementById("nextRoundBtn")
let endGameBtn = document.getElementById("endGameBtn")

let finalresult = document.getElementById("finalresult")
let playerOneNameScroe = document.getElementById("playerOneNameScroe")
let playerTwoNameScroe = document.getElementById("playerTwoNameScroe")
let winnerName = document.getElementById("winnerName")

categorySelection.style.display = "none"
questionGameplay.style.display = "none"
roundSummary.style.display = "none"
finalresult.style.display = "none"

let questionArray = [];
let index = 0;
let round = 1;

let player1Score = 0;
let player2Score = 0;

let difficultyRating = {
    easy: 10,
    medium: 15,
    hard: 20
};


let nameOne = ""
let nameTwo = ""
startBtn.addEventListener("click", function () {

    nameOne = playerOne.value.trim()
    nameTwo = playerTwo.value.trim()

    if (nameOne === "" || nameTwo === "") {
        alert("Pls write both player name")
        return
    }

    if (nameOne === nameTwo) {
        alert("Player name should be unique")
        return
    }

    playerOne.value = ""
    playerTwo.value = ""

    playerSetup.style.display = "none"
    categorySelection.style.display = "block"

    roundNum.innerText = `Round: ${round}`;

})

startRoundBtn.addEventListener("click", function () {

    let selectedIndex = selectCategory.selectedIndex;
    let chosenCategory = selectCategory.value;
    selectCategory.remove(selectedIndex);

    questionArray = [];
    index = 0;

    fetchQuestions(chosenCategory);

});

async function fetchQuestions(category) {

    try {
        let easyRes = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=easy&limit=2`);
        let mediumRes = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=medium&limit=2`);
        let hardRes = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=hard&limit=2`);

        let easyData = await easyRes.json();
        let mediumData = await mediumRes.json();
        let hardData = await hardRes.json();

        questionArray = [...easyData, ...mediumData, ...hardData];

        displayQuestion()

        categorySelection.style.display = "none";
        questionGameplay.style.display = "block";
    }
    catch (error) {
        console.log(error);
    }

}

function displayQuestion() {

    let currentQuestion = questionArray[index];
    nextBtn.disabled = true

    roundNumDisplay.innerText = `Round: ${round}`;
    categoryText.innerText = `Category: ${currentQuestion.category}`;
    difficultyText.innerText = `Difficulty: ${currentQuestion.difficulty}`;

    if (index % 2 === 0) {
        whoseTurn.innerText = `Who's Turn: Player 1 ${nameOne}`
    }
    else {
        whoseTurn.innerText = `Who's Turn: Player 2 ${nameTwo}`
    }

    playerScoreOne.innerText = `Player 1 ${nameOne}: ${player1Score}`;
    playerScoreTwo.innerText = `Player 2 ${nameTwo}: ${player2Score}`;

    questionText.innerText = `${index + 1}: ${currentQuestion.question.text}`;

    displayOption()
}

function displayOption() {
    let correctAnswer = questionArray[index].correctAnswer;
    let incorrectAnswers = questionArray[index].incorrectAnswers;

    let optionsArray = [correctAnswer, ...incorrectAnswers];

    for (let i = optionsArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = optionsArray[i];
        optionsArray[i] = optionsArray[j];
        optionsArray[j] = temp;
    }

    for (let i = 0; i < optionsArray.length; i++) {
        optionRadio[i].checked = false;
        optionRadio[i].disabled = false;
        optionRadio[i].value = optionsArray[i];
        optionLabel[i].innerText = optionsArray[i];
    }

    checkAnswerMsg.innerText = ""
}

for (let i = 0; i < optionRadio.length; i++) {
    optionRadio[i].addEventListener("change", function (e) {
        let selectedOption = e.target.value
        answerCheck(selectedOption)

        for (let j = 0; j < optionRadio.length; j++) {
            optionRadio[j].disabled = true
        }

        nextBtn.disabled = false
    })
}

function answerCheck(selectedOption) {

    let currectAnswer = questionArray[index].correctAnswer
    let difficulty = questionArray[index].difficulty

    if (selectedOption === currectAnswer) {
        checkAnswerMsg.innerText = "Correct Answer"
        checkAnswerMsg.style.color = "green"

        if (index % 2 === 0) {
            player1Score += difficultyRating[difficulty]
        }
        else {
            player2Score += difficultyRating[difficulty]
        }
    }
    else {
        checkAnswerMsg.innerText = "Wrong Answer"
        checkAnswerMsg.style.color = "red"
    }

    playerScoreOne.innerText = `Player 1 ${nameOne}: ${player1Score}`;
    playerScoreTwo.innerText = `Player 2 ${nameTwo}: ${player2Score}`;

}

nextBtn.addEventListener("click", function () {

    index++;
    if (index >= questionArray.length) {
        questionGameplay.style.display = "none";
        roundSummary.style.display = "block";

        if (selectCategory.options.length === 0) {
            nextRoundBtn.disabled = true;
        }
        else {
            nextRoundBtn.disabled = false;
        }
    }
    else {
        displayQuestion();
    }

});

nextRoundBtn.addEventListener("click", function () {

    round++;
    roundNum.innerText = `Round: ${round}`;
    nextBtn.disabled = true

    roundSummary.style.display = "none";
    categorySelection.style.display = "block";

});

endGameBtn.addEventListener("click", function () {

    playerOneNameScroe.innerText = `Player 1: ${nameOne} , With ${player1Score} Score`
    playerTwoNameScroe.innerText = `Player 2: ${nameTwo} ,With ${player2Score} Score`

    if (player1Score > player2Score) {
        winnerName.innerText = `Winner is: ${nameOne}`
    }
    else if (player2Score > player1Score) {
        winnerName.innerText = `Winner is: ${nameTwo}`
    }
    else {
        winnerName.innerText = ` It's Tie`
    }

    roundSummary.style.display = "none"
    finalresult.style.display = "block"

})
