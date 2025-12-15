// Helper
function getNumberParam(params, key) {
    var value = params.get(key);
    var parsed = value !== null ? parseInt(value, 10) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
}
function initResults() {
    // Read query params
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var resultMessageElement = document.querySelector('#resultMessage');
    var correctCount = getNumberParam(urlParams, 'correctCount');
    var incorrectCount = getNumberParam(urlParams, 'incorrectCount');
    // DOM elements
    var scoreTextElement = document.querySelector('#scoreText');
    var scorePointsElement = document.querySelector('#scorePoints');
    if (!scoreTextElement || !scorePointsElement) {
        console.error('Missing #scoreText or #scorePoints in the results HTML.');
        return;
    }
    // Show score
    scoreTextElement.textContent = "Your score is: ".concat(correctCount, " of 10");
    // Total points (10 per correct answer)
    var totalPoints = correctCount * 10;
    // Set points
    scorePointsElement.innerHTML = "".concat(totalPoints, " points");
    if (resultMessageElement) {
        if (correctCount > 5) {
            resultMessageElement.textContent = "You're a genius 🧠";
        }
        else {
            resultMessageElement.textContent = "Better luck next time 🍀";
        }
    }
}
// Run when the page is ready
document.addEventListener('DOMContentLoaded', initResults);
