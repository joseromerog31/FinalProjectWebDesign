// DOM elements
// Question
const questionEl = document.querySelector('#question'); // DOM Question
const optionsEl = document.querySelector('.quiz-options'); // Optional: to show multiple-choice options as text
const categoryEl = document.querySelector('#quizCategory'); // DOM Category
const difficultyEl = document.querySelector('#quizDifficulty'); // DOM Difficulty
const answerInput = document.querySelector('#answer');
const btnCheck = document.getElementById('btnCheck');
const infoMessageEl = document.querySelector('.info-message');
const totalQuestionsElement = document.getElementById('totalQuestions');
const feedbackContainer = document.querySelector('#feedback');
const feedbackImage = document.querySelector('#feedbackImage');
const feedbackText = document.querySelector('#feedbackText');
// Game State
let correctAnswer = '';
let incorrectAnswers = [];
let questionCount = 1;
let correctCount = 0;
let incorrectCount = 0;
const timerEl = document.querySelector('#timer');
let timeLeft = 30;
let timerId = null;
function getCategoryIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('trivia_category');
    if (!value || value === 'any') {
        return null; // no category filter
    }
    return value;
}
const selectedCategoryId = getCategoryIdFromUrl();
function stopTimer() {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
    }
}
function renderTimer() {
    if (timerEl)
        timerEl.textContent = String(timeLeft);
}
function startTimer() {
    stopTimer();
    timeLeft = 30;
    renderTimer();
    timerId = window.setInterval(() => {
        timeLeft--;
        renderTimer();
        if (timeLeft <= 0) {
            stopTimer();
            handleTimeUp();
        }
    }, 1000);
}
function handleTimeUp() {
    // If you want: prevent the user from submitting while we show feedback
    if (btnCheck)
        btnCheck.disabled = true;
    if (answerInput)
        answerInput.disabled = true;
    // Count as incorrect
    incorrectCount++;
    // Reuse your feedback UI
    showFeedback(false); // will show "Incorrect! The correct answer was: ..."
    setTimeout(() => {
        if (feedbackContainer)
            feedbackContainer.classList.add('hidden');
        if (questionCount === 10) {
            const queryString = `?correctCount=${correctCount}&incorrectCount=${incorrectCount}`;
            window.location.href = `results.html${queryString}`;
            return;
        }
        questionCount++;
        if (totalQuestionsElement)
            totalQuestionsElement.textContent = String(questionCount);
        // Re-enable for next question
        if (btnCheck)
            btnCheck.disabled = false;
        if (answerInput) {
            answerInput.disabled = false;
            answerInput.value = '';
        }
        if (btnCheck)
            btnCheck.disabled = false;
        if (answerInput)
            answerInput.disabled = false;
        void loadQuestion();
    }, 1500);
}
// API Logic
async function loadQuestion() {
    let APIUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
    if (selectedCategoryId) {
        APIUrl += `&category=${selectedCategoryId}`;
    }
    const response = await fetch(APIUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.results.length === 0) {
        console.error('No questions returned for this category id:', selectedCategoryId);
        // Here you could show a message in the DOM if you want
        return;
    }
    const firstQuestion = data.results[0];
    showQuestion(firstQuestion);
}
function showQuestion(data) {
    correctAnswer = data.correct_answer;
    incorrectAnswers = data.incorrect_answers;
    const randomOptions = [];
    randomOptions.push(...incorrectAnswers);
    randomOptions.push(correctAnswer);
    // Randomize options
    randomOptions.sort(() => Math.random() - 0.5);
    if (!questionEl || !categoryEl || !difficultyEl)
        return;
    // Use innerHTML
    questionEl.innerHTML = data.question;
    categoryEl.textContent = data.category;
    setDifficulty(data.difficulty);
    // Clear text input for new question
    if (answerInput) {
        answerInput.value = '';
    }
    // Display options as hints
    if (optionsEl) {
        optionsEl.innerHTML = '';
        for (const option of randomOptions) {
            const li = document.createElement('li');
            li.innerHTML = option; // show as plain text
            optionsEl.appendChild(li);
        }
    }
    startTimer();
}
function setDifficulty(quizDifficulty) {
    if (!difficultyEl)
        return;
    difficultyEl.className = ''; // Reset difficulty classes
    if (quizDifficulty === 'easy') {
        difficultyEl.classList.add('easy');
    }
    else if (quizDifficulty === 'medium') {
        difficultyEl.classList.add('medium');
    }
    else if (quizDifficulty === 'hard') {
        difficultyEl.classList.add('hard');
    }
    difficultyEl.textContent = quizDifficulty;
}
// Feedback
function showFeedback(isCorrect) {
    if (!feedbackContainer || !feedbackImage || !feedbackText)
        return;
    feedbackContainer.classList.remove('hidden');
    if (isCorrect) {
        feedbackImage.src = '../assets/correct.jpg';
        feedbackText.textContent = 'Correct! 🎉';
    }
    else {
        feedbackImage.src = '../assets/incorrect.jpg';
        feedbackImage.alt = 'Incorrect answer';
        feedbackText.textContent = `Incorrect! The correct answer was: ${correctAnswer}`;
    }
}
// Answer Check
function checkAnswers() {
    if (!answerInput)
        return;
    stopTimer();
    const userAnswerRaw = answerInput.value.trim();
    // If the user didn't type anything, show info message
    if (!userAnswerRaw) {
        if (infoMessageEl) {
            infoMessageEl.classList.remove('hidden');
            setTimeout(() => {
                infoMessageEl.classList.add('hidden');
            }, 1500);
        }
        return;
    }
    // Normalize both answers to ignore case and extra whitespace
    const userAnswer = userAnswerRaw.toLowerCase();
    const correctNormalized = correctAnswer.trim().toLowerCase();
    const isCorrect = userAnswer === correctNormalized;
    if (isCorrect) {
        correctCount++;
    }
    else {
        incorrectCount++;
    }
    showFeedback(isCorrect);
    setTimeout(() => {
        // hide feedback
        if (feedbackContainer) {
            feedbackContainer.classList.add('hidden');
        }
        if (questionCount === 10) {
            const queryString = `?correctCount=${correctCount}&incorrectCount=${incorrectCount}`;
            window.location.href = `results.html${queryString}`;
        }
        else {
            questionCount++;
            void loadQuestion();
        }
        if (totalQuestionsElement) {
            totalQuestionsElement.textContent = String(questionCount);
        }
        // clear input for next question
        answerInput.value = '';
    }, 1500);
}
// Event Listeners
if (btnCheck) {
    btnCheck.addEventListener('click', checkAnswers);
}
// Optional: allow pressing Enter to submit the answer
if (answerInput) {
    answerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswers();
        }
    });
}
void loadQuestion();
