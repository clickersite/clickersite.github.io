let initialized = false;

document.addEventListener('DOMContentLoaded', () => {
    if (!initialized) {
        initializeGame();
        initialized = true;
    }
});

function initializeGame() {
    setupEventListeners();
    initializeParticles();
    loadGame();
    startGameLoop();
}

function setupEventListeners() {
    document.getElementById('clickButton').addEventListener('click', (event) => {
        handleClick();
        createClickParticles(event);
    });

    document.getElementById('prestigeButton').addEventListener('click', () => prestige());
    document.getElementById('superPrestigeButton').addEventListener('click', () => superPrestige());
    
    document.getElementById('exportButton').addEventListener('click', () => exportSave());
    document.getElementById('importButton').addEventListener('click', () => importSave());
    document.getElementById('resetButton').addEventListener('click', () => confirmReset());
}

function startGameLoop() {
    setInterval(() => {
        processAutoClickers();
        updateBuffsDisplay();
        checkChallenges();
        updateGameTime();
    }, 100);
}

function updateGameTime() {
    gameState.statistics.totalTimePlayed = Math.floor((Date.now() - gameState.lastSaveTime) / 1000);
}

function createClickParticles(event) {
    const particles = [];
    const numParticles = 10;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        const angle = (Math.PI * 2 * i) / numParticles;
        const velocity = 5 + Math.random() * 5;
        
        const particleData = {
            element: particle,
            x: event.clientX,
            y: event.clientY,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1
        };
        
        particles.push(particleData);
        document.body.appendChild(particle);
    }
    
    animateParticles(particles);
}

function animateParticles(particles) {
    function update() {
        let anyAlive = false;
        
        particles.forEach(particle => {
            if (particle.life > 0) {
                anyAlive = true;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // gravity
                particle.life -= 0.02;
                
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                particle.element.style.opacity = particle.life;
            } else if (particle.element.parentNode) {
                particle.element.remove();
            }
        });
        
        if (anyAlive) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function confirmReset() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        resetGame();
    }
}

function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

function createFloatingNumber(amount, isCritical) {
    const x = event.clientX;
    const y = event.clientY;
    const text = formatNumber(amount);
    createFloatingText(text, x, y, isCritical ? '#FFD700' : '#ffffff');
}
