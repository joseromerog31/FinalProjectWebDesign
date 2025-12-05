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

// Question + meta info
const questionEl = document.querySelector<HTMLElement>('#question');      // DOM Question
const optionsEl = document.querySelector<HTMLUListElement>('.quiz-options'); // Optional: to show multiple-choice options as text
const categoryEl = document.querySelector<HTMLElement>('#quizCategory');  // DOM Category
const difficultyEl = document.querySelector<HTMLElement>('#quizDifficulty'); // DOM Difficulty

// New: user answer input (text box)
const answerInput = document.querySelector<HTMLInputElement>('#answer');

const btnCheck = document.getElementById('btnCheck') as HTMLButtonElement | null;
const infoMessageEl = document.querySelector<HTMLElement>('.info-message');
const totalQuestionsElement = document.getElementById('totalQuestions');

// Game State

let correctAnswer: string = '';
let incorrectAnswers: string[] = [];
let questionCount = 1;
let correctCount = 0;
let incorrectCount = 0;

// API Logic

async function loadQuestion (): Promise<void> {
    const APIUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';

    const response = await fetch(APIUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.status} ${response.statusText}`);
    }

    const data: TriviaApiResponse = await response.json();
    const firstQuestion = data.results[0];

    showQuestion(firstQuestion);
}

function showQuestion(data: TriviaQuestionRaw): void {
    correctAnswer = data.correct_answer;
    incorrectAnswers = data.incorrect_answers;

    const randomOptions: string[] = [];
    randomOptions.push(...incorrectAnswers);
    randomOptions.push(correctAnswer);

    // Randomize options (optional – only if you still want to display them)
    randomOptions.sort(() => Math.random() - 0.5);

    if (!questionEl || !categoryEl || !difficultyEl) return;

    // Use innerHTML because the API sends encoded entities (&quot;)
    questionEl.innerHTML = data.question;
    categoryEl.textContent = data.category;

    setDifficulty(data.difficulty);

    // Clear text input for new question
    if (answerInput) {
        answerInput.value = '';
    }

    // If you still want to display options as hints (non-clickable)
    if (optionsEl) {
        optionsEl.innerHTML = '';
        for (const option of randomOptions) {
            const li = document.createElement('li');
            li.innerHTML = option;  // show as plain text
            optionsEl.appendChild(li);
        }
    }
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

// ---------- Answer Check (using text box) ----------

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

    // Normalize both answers to ignore case and extra whitespace
    const userAnswer = userAnswerRaw.toLowerCase();
    const correctNormalized = correctAnswer.trim().toLowerCase();

    if (userAnswer === correctNormalized) {
        correctCount++;
        // You can later add a "correct!" message in the HTML
        console.log('Correct!');
    } else {
        incorrectCount++;
        console.log(`Incorrect. Correct answer: ${correctAnswer}`);
    }

    // Prepare for next question
    setTimeout(() => {
        if (questionCount === 10) {
            const queryString = `?correctCount=${correctCount}&incorrectCount=${incorrectCount}`;
            window.location.href = `quiz-results.html${queryString}`;
        } else {
            questionCount++;
            void loadQuestion();
        }

        if (totalQuestionsElement) {
            totalQuestionsElement.textContent = String(questionCount);
        }
    }, 800); // small delay so we can later show a "Correct/Incorrect" message
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

void loadQuestion();
