const gameState = {
    points: 0,
    pointsPerClick: 1,
    prestigeTokens: 0,
    prestigeLevel: 0,
    superPrestigePoints: 0,
    superPrestigeLevel: 0,
    achievementPoints: 0,
    globalMultiplier: 1,
    criticalChance: 0,
    criticalMultiplier: 2,
    lastSaveTime: Date.now(),
    activeBuffs: [],
    unlockedAchievements: new Set(),
    activeChallenges: new Set(),
    statistics: {
        totalClicks: 0,
        totalPrestige: 0,
        totalSuperPrestige: 0,
        totalTimePlayed: 0,
        highestPointsPerSecond: 0,
        totalCriticalHits: 0
    }
};

const PRESTIGE_REQUIREMENT = 1000000;
const SUPER_PRESTIGE_REQUIREMENT = 10;

function calculateGlobalMultiplier() {
    let multiplier = 1;
    multiplier += gameState.prestigeLevel * 0.1;
    multiplier += gameState.superPrestigeLevel;
    multiplier += gameState.achievementPoints * 0.05;
    return multiplier;
}

function updatePointsPerClick() {
    let base = 1;
    upgrades.forEach(upgrade => {
        base += upgrade.owned * (upgrade.pointsToAdd || 0);
    });
    gameState.pointsPerClick = base;
}

function calculateCriticalChance() {
    let chance = 0;
    upgrades.forEach(upgrade => {
        if (upgrade.critAdd) {
            chance += upgrade.owned * upgrade.critAdd;
        }
    });
    gameState.criticalChance = Math.min(chance, 100);
}

function calculatePoints(isCritical = false) {
    let basePoints = gameState.pointsPerClick;
    let multiplier = gameState.globalMultiplier;
    
    gameState.activeBuffs.forEach(buff => {
        multiplier *= buff.multiplier;
    });
    
    if (isCritical) {
        multiplier *= gameState.criticalMultiplier;
    }
    
    return Math.floor(basePoints * multiplier);
}

function addPoints(amount, isCritical = false) {
    const pointsToAdd = Math.floor(amount);
    gameState.points += pointsToAdd;
    
    createFloatingNumber(pointsToAdd, isCritical);
    
    if (gameState.statistics.highestPointsPerSecond < pointsToAdd) {
        gameState.statistics.highestPointsPerSecond = pointsToAdd;
    }
    
    updateDisplay();
    checkAchievements();
}

function createFloatingNumber(amount, isCritical) {
    const floatingNumber = document.createElement('div');
    floatingNumber.className = `floating-number ${isCritical ? 'critical-hit' : ''}`;
    floatingNumber.textContent = `+${amount.toLocaleString()}`;
    
    const clickButton = document.getElementById('clickButton');
    const rect = clickButton.getBoundingClientRect();
    
    floatingNumber.style.left = `${rect.left + Math.random() * rect.width}px`;
    floatingNumber.style.top = `${rect.top + Math.random() * rect.height}px`;
    
    document.getElementById('floatingNumbers').appendChild(floatingNumber);
    
    setTimeout(() => floatingNumber.remove(), 1000);
}

function handleClick() {
    const isCritical = Math.random() < (gameState.criticalChance / 100);
    const pointsGained = calculatePoints(isCritical);
    
    addPoints(pointsGained, isCritical);
    gameState.statistics.totalClicks++;
    
    if (isCritical) {
        gameState.statistics.totalCriticalHits++;
    }
    
    triggerRandomEvent();
}

function updateStatistics() {
    gameState.statistics.totalTimePlayed = Math.floor((Date.now() - gameState.lastSaveTime) / 1000);
}
