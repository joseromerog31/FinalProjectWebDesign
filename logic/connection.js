var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// DOM elements
// Question
var questionEl = document.querySelector('#question'); // DOM Question
var optionsEl = document.querySelector('.quiz-options'); // Optional: to show multiple-choice options as text
var categoryEl = document.querySelector('#quizCategory'); // DOM Category
var difficultyEl = document.querySelector('#quizDifficulty'); // DOM Difficulty
var answerInput = document.querySelector('#answer');
var btnCheck = document.getElementById('btnCheck');
var infoMessageEl = document.querySelector('.info-message');
var totalQuestionsElement = document.getElementById('totalQuestions');
var feedbackContainer = document.querySelector('#feedback');
var feedbackImage = document.querySelector('#feedbackImage');
var feedbackText = document.querySelector('#feedbackText');
// Game State
var correctAnswer = '';
var incorrectAnswers = [];
var questionCount = 1;
var correctCount = 0;
var incorrectCount = 0;
function getCategoryIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var value = params.get('trivia_category');
    if (!value || value === 'any') {
        return null; // no category filter
    }
    return value;
}
var selectedCategoryId = getCategoryIdFromUrl();
// API Logic
function loadQuestion() {
    return __awaiter(this, void 0, void 0, function () {
        var APIUrl, response, data, firstQuestion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    APIUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
                    if (selectedCategoryId) {
                        APIUrl += "&category=".concat(selectedCategoryId);
                    }
                    return [4 /*yield*/, fetch(APIUrl)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch question: ".concat(response.status, " ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.results.length === 0) {
                        console.error('No questions returned for this category id:', selectedCategoryId);
                        // Here you could show a message in the DOM if you want
                        return [2 /*return*/];
                    }
                    firstQuestion = data.results[0];
                    showQuestion(firstQuestion);
                    return [2 /*return*/];
            }
        });
    });
}
function showQuestion(data) {
    correctAnswer = data.correct_answer;
    incorrectAnswers = data.incorrect_answers;
    var randomOptions = [];
    randomOptions.push.apply(randomOptions, incorrectAnswers);
    randomOptions.push(correctAnswer);
    // Randomize options
    randomOptions.sort(function () { return Math.random() - 0.5; });
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
        for (var _i = 0, randomOptions_1 = randomOptions; _i < randomOptions_1.length; _i++) {
            var option = randomOptions_1[_i];
            var li = document.createElement('li');
            li.innerHTML = option; // show as plain text
            optionsEl.appendChild(li);
        }
    }
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
        feedbackText.textContent = "Incorrect! The correct answer was: ".concat(correctAnswer);
    }
}
// Answer Check
function checkAnswers() {
    if (!answerInput)
        return;
    var userAnswerRaw = answerInput.value.trim();
    // If the user didn't type anything, show info message
    if (!userAnswerRaw) {
        if (infoMessageEl) {
            infoMessageEl.classList.remove('hidden');
            setTimeout(function () {
                infoMessageEl.classList.add('hidden');
            }, 1500);
        }
        return;
    }
    // Normalize both answers to ignore case and extra whitespace
    var userAnswer = userAnswerRaw.toLowerCase();
    var correctNormalized = correctAnswer.trim().toLowerCase();
    var isCorrect = userAnswer === correctNormalized;
    if (isCorrect) {
        correctCount++;
    }
    else {
        incorrectCount++;
    }
    showFeedback(isCorrect);
    setTimeout(function () {
        // hide feedback
        if (feedbackContainer) {
            feedbackContainer.classList.add('hidden');
        }
        if (questionCount === 10) {
            var queryString = "?correctCount=".concat(correctCount, "&incorrectCount=").concat(incorrectCount);
            window.location.href = "results.html".concat(queryString);
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
    answerInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswers();
        }
    });
}
void loadQuestion();
