const prestigeUpgrades = [
    { id: 'prestige1', name: 'Point Multiplier', cost: 1, multiplier: 1.5, owned: 0, maxOwned: 50 },
    { id: 'prestige2', name: 'Auto-Click Booster', cost: 2, multiplier: 2, owned: 0, maxOwned: 50 },
    { id: 'prestige3', name: 'Golden Clicks', cost: 5, multiplier: 3, owned: 0, maxOwned: 25 },
    { id: 'prestige4', name: 'Critical Master', cost: 8, critMultiplier: 0.5, owned: 0, maxOwned: 20 },
    { id: 'prestige5', name: 'Time Warper', cost: 15, timeMultiplier: 1.2, owned: 0, maxOwned: 10 }
];

const superPrestigeUpgrades = [
    { id: 'super1', name: 'Prestige Multiplier', cost: 1, prestigeBonus: 2, owned: 0, maxOwned: 10 },
    { id: 'super2', name: 'Auto Prestige', cost: 3, autoPrestige: true, owned: 0, maxOwned: 1 },
    { id: 'super3', name: 'Ultimate Production', cost: 5, globalBonus: 5, owned: 0, maxOwned: 5 }
];

function purchasePrestigeUpgrade(upgrade) {
    if (gameState.prestigeTokens >= upgrade.cost && upgrade.owned < upgrade.maxOwned) {
        gameState.prestigeTokens -= upgrade.cost;
        upgrade.owned++;
        calculatePrestigeBonuses();
        updateDisplay();
        saveGame();
    }
}

function purchaseSuperPrestigeUpgrade(upgrade) {
    if (gameState.superPrestigePoints >= upgrade.cost && upgrade.owned < upgrade.maxOwned) {
        gameState.superPrestigePoints -= upgrade.cost;
        upgrade.owned++;
        calculateSuperPrestigeBonuses();
        updateDisplay();
        saveGame();
    }
}

function prestige() {
    if (gameState.points >= PRESTIGE_REQUIREMENT) {
        const tokensToGain = Math.floor(Math.log10(gameState.points) - 5);
        gameState.prestigeTokens += tokensToGain;
        gameState.prestigeLevel++;
        gameState.statistics.totalPrestige++;
        
        resetBasicProgress();
        calculatePrestigeBonuses();
        
        showPrestigeAnimation();
        playPrestigeSound();
        
        updateDisplay();
        saveGame();
        checkAchievements();
    }
}

function superPrestige() {
    if (gameState.prestigeLevel >= SUPER_PRESTIGE_REQUIREMENT) {
        const superPointsToGain = Math.floor(Math.log10(gameState.prestigeLevel));
        gameState.superPrestigePoints += superPointsToGain;
        gameState.superPrestigeLevel++;
        gameState.statistics.totalSuperPrestige++;
        
        resetAllProgress();
        calculateSuperPrestigeBonuses();
        
        showSuperPrestigeAnimation();
        playSuperPrestigeSound();
        
        updateDisplay();
        saveGame();
        checkAchievements();
    }
}

function resetBasicProgress() {
    gameState.points = 0;
    gameState.pointsPerClick = 1;
    
    upgrades.forEach(upgrade => {
        upgrade.owned = 0;
        upgrade.cost = upgrade.baseCost;
    });
    
    autoClickers.forEach(autoClicker => {
        autoClicker.owned = 0;
        autoClicker.cost = autoClicker.baseCost;
    });
}

function resetAllProgress() {
    resetBasicProgress();
    gameState.prestigeTokens = 0;
    gameState.prestigeLevel = 0;
    
    prestigeUpgrades.forEach(upgrade => {
        upgrade.owned = 0;
    });
}

function calculatePrestigeBonuses() {
    let multiplier = 1;
    prestigeUpgrades.forEach(upgrade => {
        if (upgrade.multiplier) {
            multiplier *= Math.pow(upgrade.multiplier, upgrade.owned);
        }
        if (upgrade.critMultiplier) {
            gameState.criticalMultiplier += upgrade.critMultiplier * upgrade.owned;
        }
    });
    multiplier *= (1 + gameState.prestigeLevel * 0.1);
    gameState.globalMultiplier = multiplier;
}

function calculateSuperPrestigeBonuses() {
    superPrestigeUpgrades.forEach(upgrade => {
        if (upgrade.owned > 0) {
            if (upgrade.globalBonus) {
                gameState.globalMultiplier *= Math.pow(upgrade.globalBonus, upgrade.owned);
            }
            if (upgrade.prestigeBonus) {
                gameState.prestigeTokens *= Math.pow(upgrade.prestigeBonus, upgrade.owned);
            }
        }
    });
}
