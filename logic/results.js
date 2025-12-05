// Helper
function getNumberParam(params, key) {
    var value = params.get(key);
    var parsed = value !== null ? parseInt(value, 10) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
}
function initResults() {
    // Read query params: ?correctCount &incorrectCount
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var correctCount = getNumberParam(urlParams, 'correctCount');
    var incorrectCount = getNumberParam(urlParams, 'incorrectCount');
    // DOM elements
    var scoreTextElement = document.querySelector('#scoreText');
    var scorePointsElement = document.querySelector('#scorePoints');
    if (!scoreTextElement || !scorePointsElement) {
        console.error('Missing #scoreText or #scorePoints in the results HTML.');
        return;
    }
    // Show: Score
    scoreTextElement.textContent = "Your score is: ".concat(correctCount, " of 10");
    // Total points (10 per correct answer)
    var totalPoints = correctCount * 10;
    // Set points text and prepend trophy
    scorePointsElement.innerHTML = "".concat(totalPoints, " points");
}
// Run when the page is ready
document.addEventListener('DOMContentLoaded', initResults);
