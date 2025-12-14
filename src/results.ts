// Helper
function getNumberParam(params: URLSearchParams, key: string): number {
    const value = params.get(key);
    const parsed = value !== null ? parseInt(value, 10) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
}

function initResults(): void {
    // Read query params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const resultMessageElement = document.querySelector<HTMLElement>('#resultMessage');


    const correctCount: number = getNumberParam(urlParams, 'correctCount');
    const incorrectCount: number = getNumberParam(urlParams, 'incorrectCount');

    // DOM elements
    const scoreTextElement = document.querySelector<HTMLElement>('#scoreText');
    const scorePointsElement = document.querySelector<HTMLElement>('#scorePoints');

    if (!scoreTextElement || !scorePointsElement) {
        console.error('Missing #scoreText or #scorePoints in the results HTML.');
        return;
    }

    // Show score
    scoreTextElement.textContent = `Your score is: ${correctCount} of 10`;

    // Total points (10 per correct answer)
    const totalPoints: number = correctCount * 10;

    // Set points text and prepend trophy
    scorePointsElement.innerHTML = `${totalPoints} points`;

    if (resultMessageElement) {
        if (correctCount > 5) {
            resultMessageElement.textContent = "You're a genius 🧠";
        } else {
            resultMessageElement.textContent = "Better luck next time 🍀";
        }
    }

}

// Run when the page is ready
document.addEventListener('DOMContentLoaded', initResults);