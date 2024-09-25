let currentQuestion = 0;
let score = 0;
let quizData = [];

const questionEl = document.getElementById("question");
const optionEls = Array.from(document.getElementsByClassName("option"));
const labelEls = [
  document.getElementById("label1"),
  document.getElementById("label2"),
  document.getElementById("label3"),
  document.getElementById("label4"),
];
const scoreEl = document.getElementById("score");

// Function to fetch questions from the OpenTDB API
async function fetchQuizQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple"
    );
    const data = await response.json();
    quizData = data.results.map((item) => {
      const options = [...item.incorrect_answers];
      const correctIndex = Math.floor(Math.random() * 4);
      options.splice(correctIndex, 0, item.correct_answer);

      return {
        question: item.question,
        options: options,
        correct: correctIndex,
      };
    });
    loadQuestion();
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
  }
}

function loadQuestion() {
  const currentQuizData = quizData[currentQuestion];
  questionEl.innerHTML = currentQuizData.question;
  optionEls.forEach((option, index) => {
    option.checked = false;
    labelEls[index].innerHTML = currentQuizData.options[index];
  });
}

function getSelectedOption() {
  let selectedOption = undefined;
  optionEls.forEach((option, index) => {
    if (option.checked) {
      selectedOption = index;
    }
  });
  return selectedOption;
}

function submitAnswer() {
  const selectedOption = getSelectedOption();

  if (selectedOption === undefined) {
    alert("Please select an answer!");
    return;
  }

  // Increment score if the selected answer is correct
  if (selectedOption === quizData[currentQuestion].correct) {
    score++;
  }

  // Move to the next question
  currentQuestion++;

  // Check if we have finished the quiz
  if (currentQuestion < quizData.length) {
    loadQuestion(); // Load the next question
  } else {
    // Display the score when the quiz is finished
    document.getElementById("quiz-container").innerHTML = `
      <h2>You scored ${score} out of ${quizData.length}</h2>
    `;

    // Create the restart button
    const restartButton = document.querySelector("button");
    restartButton.innerText = "Restart";
    restartButton.onclick = () => location.reload(); // Reload page to restart the quiz

    // Append the restart button to the quiz container
    document.getElementById("quiz-container").appendChild(restartButton);
  }

  // Update the score display
  scoreEl.innerText = `Score: ${score} / ${quizData.length}`;
}

// Call the function to fetch questions when the page loads
fetchQuizQuestions();
