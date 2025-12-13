interface TriviaQuestionRaw {
    category: string;
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface TriviaApiResponse {
    response_code: number;
    results: TriviaQuestionRaw[];
}

// DOM elements

// Question
const questionEl = document.querySelector<HTMLElement>('#question');      // DOM Question
const optionsEl = document.querySelector<HTMLUListElement>('.quiz-options'); // Optional: to show multiple-choice options as text
const categoryEl = document.querySelector<HTMLElement>('#quizCategory');  // DOM Category
const difficultyEl = document.querySelector<HTMLElement>('#quizDifficulty'); // DOM Difficulty
const answerInput = document.querySelector<HTMLInputElement>('#answer');


const btnCheck = document.getElementById('btnCheck') as HTMLButtonElement | null;
const infoMessageEl = document.querySelector<HTMLElement>('.info-message');
const totalQuestionsElement = document.getElementById('totalQuestions');

const feedbackContainer = document.querySelector<HTMLElement>('#feedback');
const feedbackImage = document.querySelector<HTMLImageElement>('#feedbackImage');
const feedbackText = document.querySelector<HTMLElement>('#feedbackText');

// Game State
let correctAnswer: string = '';
let incorrectAnswers: string[] = [];
let questionCount = 1;
let correctCount = 0;
let incorrectCount = 0;

// Timer
let timerInterval: number | null = null;
let timeLeft: number = 15;
const SECONDS_PER_QUESTION = 15;
let timerEl: HTMLElement | null = null;

document.addEventListener('DOMContentLoaded', () => {
    timerEl = document.querySelector<HTMLElement>('#timer');
    void loadQuestion();
});


function getCategoryIdFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('trivia_category');

    if (!value || value === 'any') {
        return null; // no category filter
    }

    return value;
}

const selectedCategoryId: string | null = getCategoryIdFromUrl();

function startTimer(): void {
    stopTimer();
    timeLeft = SECONDS_PER_QUESTION;
    console.log('timerEl is', timerEl);
    if (timerEl) {
        timerEl.textContent = `Time left: ${timeLeft}s`;
    }

    timerInterval = window.setInterval(() => {
        timeLeft--;

        if (timerEl) {
            timerEl.textContent = `Time left: ${timeLeft}s`;
        }

        if (timeLeft <= 0) {
            stopTimer();
            handleTimeOut();
        }
    }, 1000);
}


function stopTimer(): void {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function handleTimeOut(): void {
    incorrectCount++;

    // Show feedback as incorrect
    showFeedback(false);

    setTimeout(() => {
        if (feedbackContainer) {
            feedbackContainer.classList.add('hidden');
        }

        if (questionCount === 10) {
            const queryString = `?correctCount=${correctCount}&incorrectCount=${incorrectCount}`;
            window.location.href = `results.html${queryString}`;
        } else {
            questionCount++;
            void loadQuestion();
        }

        if (totalQuestionsElement) {
            totalQuestionsElement.textContent = String(questionCount);
        }
    }, 1500);
}


// API Logic
async function loadQuestion (): Promise<void> {
    let APIUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';

    if (selectedCategoryId) {
        APIUrl += `&category=${selectedCategoryId}`;
    }

    const response = await fetch(APIUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.status} ${response.statusText}`);
    }

    const data: TriviaApiResponse = await response.json();

    if (data.results.length === 0) {
        console.error('No questions returned for this category id:', selectedCategoryId);
        // Here you could show a message in the DOM if you want
        return;
    }

    const firstQuestion = data.results[0];

    showQuestion(firstQuestion);
}

function showQuestion(data: TriviaQuestionRaw): void {
    correctAnswer = data.correct_answer;
    incorrectAnswers = data.incorrect_answers;

    const randomOptions: string[] = [];
    randomOptions.push(...incorrectAnswers);
    randomOptions.push(correctAnswer);

    // Randomize options
    randomOptions.sort(() => Math.random() - 0.5);

    if (!questionEl || !categoryEl || !difficultyEl) return;

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
            li.innerHTML = option;  // show as plain text
            optionsEl.appendChild(li);
        }
    }
    startTimer();
}

function setDifficulty(quizDifficulty: TriviaQuestionRaw['difficulty']): void {
    if (!difficultyEl) return;

    difficultyEl.className = ''; // Reset difficulty classes

    if (quizDifficulty === 'easy') {
        difficultyEl.classList.add('easy');
    } else if (quizDifficulty === 'medium') {
        difficultyEl.classList.add('medium');
    } else if (quizDifficulty === 'hard') {
        difficultyEl.classList.add('hard');
    }

    difficultyEl.textContent = quizDifficulty;
}

// Feedback
function showFeedback(isCorrect: boolean): void {
    if (!feedbackContainer || !feedbackImage || !feedbackText) return;

    feedbackContainer.classList.remove('hidden');

    if (isCorrect) {
        feedbackImage.src = '../assets/correct.jpg';
        feedbackText.textContent = 'Correct! 🎉';
    } else {
        feedbackImage.src = '../assets/incorrect.jpg';
        feedbackImage.alt = 'Incorrect answer';
        feedbackText.textContent = `Incorrect! The correct answer was: ${correctAnswer}`;
    }
}

// Answer Check
function checkAnswers(): void {
    if (!answerInput) return;

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

    stopTimer();

    // Normalize both answers to ignore case and extra whitespace
    const userAnswer = userAnswerRaw.toLowerCase();
    const correctNormalized = correctAnswer.trim().toLowerCase();
    const isCorrect = userAnswer === correctNormalized;

    if (isCorrect) {
        correctCount++;
    } else {
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
        } else {
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
    answerInput.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswers();
        }
    });
}
