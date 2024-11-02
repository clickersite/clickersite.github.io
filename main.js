// Initialize game systems
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    initializeParticles();
    loadGame();
});

function initializeGame() {
    // Set up initial game state
    calculateGlobalMultiplier();
    updateDisplay();
    
    // Start game loops
    setInterval(() => {
        processAutoClickers();
        updateBuffTimers();
        checkChallenges();
        updateStatistics();
    }, 100);
    
    // Initialize sound system
    initializeSoundSystem();
}

function setupEventListeners() {
    // Main click button
    document.getElementById('clickButton').onclick = () => {
    handleClick();
    createClickParticles(event);
};

    
    // Prestige buttons
    document.getElementById('prestigeButton').addEventListener('click', prestige);
    document.getElementById('superPrestigeButton').addEventListener('click', superPrestige);
    
    // Save management buttons
    document.getElementById('exportButton').addEventListener('click', exportSave);
    document.getElementById('importButton').addEventListener('click', importSave);
    document.getElementById('resetButton').addEventListener('click', confirmReset);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function initializeParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particleContainer';
    document.body.appendChild(particleContainer);
}

function createClickParticles(event) {
    const particles = 10;
    const colors = ['#FFD700', '#FFA500', '#FF4500'];
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (Math.PI * 2 * i) / particles;
        const velocity = 2 + Math.random() * 2;
        
        const startX = event.clientX;
        const startY = event.clientY;
        
        animateParticle(particle, startX, startY, angle, velocity);
        document.getElementById('particleContainer').appendChild(particle);
    }
}

function animateParticle(particle, x, y, angle, velocity) {
    let posX = x;
    let posY = y;
    let life = 1;
    
    const animate = () => {
        if (life <= 0) {
            particle.remove();
            return;
        }
        
        posX += Math.cos(angle) * velocity;
        posY += Math.sin(angle) * velocity + 0.5;
        life -= 0.02;
        
        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.opacity = life;
        
        requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
}

function handleKeyboardShortcuts(event) {
    switch(event.key) {
        case ' ':
            handleClick();
            break;
        case 'p':
            prestige();
            break;
        case 's':
            saveGame();
            break;
    }
}

function confirmReset() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

function initializeSoundSystem() {
    const sounds = {
        click: 'click.mp3',
        prestige: 'prestige.mp3',
        achievement: 'achievement.mp3',
        purchase: 'purchase.mp3'
    };
    
    // Preload sounds
    Object.values(sounds).forEach(sound => {
        const audio = new Audio(`sounds/${sound}`);
        audio.preload = 'auto';
    });
}

function processAutoClickers() {
    const autoClickPoints = calculateAutoClickerProduction() / 10;
    if (autoClickPoints > 0) {
        addPoints(autoClickPoints);
    }
}

function updateBuffTimers() {
    const currentTime = Date.now();
    gameState.activeBuffs = gameState.activeBuffs.filter(buff => {
        if (buff.endTime > currentTime) {
            return true;
        }
        if (buff.cleanup) {
            buff.cleanup();
        }
        return false;
    });
}

function calculateAutoClickerProduction() {
    let production = 0;
    autoClickers.forEach(ac => {
        production += ac.owned * ac.cps;
    });
    return production * calculatePoints();
}
