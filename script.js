
const claw = document.getElementById('claw');
const prizesElement = document.getElementById('prizes');
const status = document.getElementById('status');
const scoreElement = document.getElementById('score');
const dropButton = document.getElementById('dropButton');
const playfield = document.getElementById('playfield');
const prizeTypes = ['&#127912;', '&#127822;', '&#128142;', '&#127922;', '&#127872;', '&#129472;'];
let clawPosition = 50;
let score = 0;
let isDropping = false;

function hasExtensionStorage() {
    return typeof chrome !== 'undefined' && chrome.storage?.local;
}

function hasExtensionStorage() {
    return typeof chrome !== 'undefined' && chrome.storage?.local;
}

function saveScore() {
    if (hasExtensionStorage()) {
        chrome.storage.local.set({ clawScore: score });
        return;
    }

    localStorage.setItem('clawScore', score.toString());
}

function loadScore() {
    if (hasExtensionStorage()) {
        chrome.storage.local.get({ clawScore: 0 }, (data) => {
            score = Number(data.clawScore) || 0;
            scoreElement.textContent = score;
        });
        return;
    }

    score = Number(localStorage.getItem('clawScore')) || 0;
    scoreElement.textContent = score;
}

function createPrizes() {
    prizesElement.replaceChildren();
    prizeTypes.forEach((prize, index) => {
        const item = document.createElement('span');
        item.className = `prize prize-${index + 1}`;
        item.innerHTML = prize;
        prizesElement.appendChild(item);
    });
}

function moveClaw(amount) {
    if (isDropping) return;
    clawPosition = Math.max(15, Math.min(85, clawPosition + amount));
    claw.style.left = `${clawPosition}%`;
    status.textContent = `Claw position: ${Math.round(clawPosition)}%`;
}

function dropClaw() {
    if (isDropping) return;
    isDropping = true;
    dropButton.disabled = true;
    status.textContent = 'Dropping...';
    claw.classList.add('dropping');

    window.setTimeout(() => {
        const prizeHit = Math.abs(clawPosition - 50) < 18;
        if (prizeHit) {
            score += 1;
            scoreElement.textContent = score;
            saveScore();
            status.textContent = 'Jackpot! You caught a prize.';
            claw.classList.add('winner');
        } else {
            status.textContent = 'So close! Move the claw and try again.';
        }
    }, 850);

    window.setTimeout(() => {
        claw.classList.remove('dropping', 'winner');
        isDropping = false;
        dropButton.disabled = false;
    }, 1900);
}

document.getElementById('leftButton').addEventListener('click', () => moveClaw(-10));
document.getElementById('rightButton').addEventListener('click', () => moveClaw(10));
dropButton.addEventListener('click', dropClaw);
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveClaw(-10);
    if (event.key === 'ArrowRight') moveClaw(10);
    if (event.key === ' ') dropClaw();
});

createPrizes();
loadScore();

