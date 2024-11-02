const SAVE_KEY = 'clickerGameSaveV3';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

function saveGame() {
    const saveData = {
        gameState: gameState,
        upgrades: upgrades,
        autoClickers: autoClickers,
        prestigeUpgrades: prestigeUpgrades,
        superPrestigeUpgrades: superPrestigeUpgrades,
        challenges: challenges,
        unlockedAchievements: Array.from(gameState.unlockedAchievements),
        version: '3.0.0'
    };
    
    localStorage.setItem(SAVE_KEY, btoa(JSON.stringify(saveData)));
    showSaveIndicator();
}

function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const save = JSON.parse(atob(savedData));
            
            if (save.version !== '3.0.0') {
                convertSaveData(save);
            }
            
            loadGameState(save);
            loadUpgrades(save);
            loadPrestige(save);
            loadAchievements(save);
            
            calculateGlobalMultiplier();
            updateDisplay();
        }
    } catch (error) {
        console.error('Error loading save:', error);
        createBackup();
    }
}

function loadGameState(save) {
    Object.assign(gameState, save.gameState);
    gameState.unlockedAchievements = new Set(save.unlockedAchievements);
}

function loadUpgrades(save) {
    upgrades.forEach((upgrade, index) => {
        if (save.upgrades[index]) {
            upgrade.owned = save.upgrades[index].owned;
            upgrade.cost = save.upgrades[index].cost;
        }
    });
    
    autoClickers.forEach((clicker, index) => {
        if (save.autoClickers[index]) {
            clicker.owned = save.autoClickers[index].owned;
            clicker.cost = save.autoClickers[index].cost;
        }
    });
}

function loadPrestige(save) {
    prestigeUpgrades.forEach((upgrade, index) => {
        if (save.prestigeUpgrades[index]) {
            upgrade.owned = save.prestigeUpgrades[index].owned;
        }
    });
    
    superPrestigeUpgrades.forEach((upgrade, index) => {
        if (save.superPrestigeUpgrades[index]) {
            upgrade.owned = save.superPrestigeUpgrades[index].owned;
        }
    });
}

function loadAchievements(save) {
    if (save.challenges) {
        challenges.forEach((challenge, index) => {
            if (save.challenges[index]) {
                challenge.isComplete = save.challenges[index].isComplete;
            }
        });
    }
}

function exportSave() {
    const saveString = localStorage.getItem(SAVE_KEY);
    const element = document.createElement('textarea');
    element.value = saveString;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
    
    showNotification('Save data copied to clipboard!');
}

function importSave() {
    const saveString = prompt('Paste your save data:');
    if (saveString) {
        localStorage.setItem(SAVE_KEY, saveString);
        location.reload();
    }
}

function createBackup() {
    const timestamp = new Date().toISOString();
    localStorage.setItem(`${SAVE_KEY}_backup_${timestamp}`, localStorage.getItem(SAVE_KEY));
}

function showSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.textContent = 'Game Saved';
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 2000);
}

// Auto-save
setInterval(saveGame, AUTO_SAVE_INTERVAL);

// Save before closing
window.onbeforeunload = saveGame;
