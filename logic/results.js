"use strict";
// Helper
function getNumberParam(params, key) {
    const value = params.get(key);
    const parsed = value !== null ? parseInt(value, 10) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
}
function initResults() {
    // Read query params: ?correctCount &incorrectCount
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const correctCount = getNumberParam(urlParams, 'correctCount');
    const incorrectCount = getNumberParam(urlParams, 'incorrectCount');
    // DOM elements
    const scoreTextElement = document.querySelector('#scoreText');
    const scorePointsElement = document.querySelector('#scorePoints');
    if (!scoreTextElement || !scorePointsElement) {
        console.error('Missing #scoreText or #scorePoints in the results HTML.');
        return;
    }
    // Show: Score
    scoreTextElement.textContent = `Your score is: ${correctCount} of 10`;
    // Total points (10 per correct answer)
    const totalPoints = correctCount * 10;
    // Set points text and prepend trophy
    scorePointsElement.innerHTML = `${totalPoints} points`;
}
// Run when the page is ready
document.addEventListener('DOMContentLoaded', initResults);
