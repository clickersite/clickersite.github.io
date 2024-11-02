const upgrades = [
    { id: 'click1', name: 'Better Clicks', cost: 15, pointsToAdd: 1, owned: 0, baseCost: 15, maxOwned: 100 },
    { id: 'click2', name: 'Super Clicks', cost: 100, pointsToAdd: 5, owned: 0, baseCost: 100, maxOwned: 100 },
    { id: 'click3', name: 'Mega Clicks', cost: 1000, pointsToAdd: 25, owned: 0, baseCost: 1000, maxOwned: 100 },
    { id: 'click4', name: 'Ultra Clicks', cost: 10000, pointsToAdd: 125, owned: 0, baseCost: 10000, maxOwned: 100 },
    { id: 'click5', name: 'Cosmic Clicks', cost: 100000, pointsToAdd: 625, owned: 0, baseCost: 100000, maxOwned: 100 },
    { id: 'click6', name: 'Quantum Clicks', cost: 1000000, pointsToAdd: 3125, owned: 0, baseCost: 1000000, maxOwned: 100 },
    { id: 'click7', name: 'Infinity Clicks', cost: 10000000, pointsToAdd: 15625, owned: 0, baseCost: 10000000, maxOwned: 100 },
    { id: 'crit1', name: 'Critical Training', cost: 5000, critAdd: 1, owned: 0, baseCost: 5000, maxOwned: 25 }
];

const autoClickers = [
    { id: 'auto1', name: 'Basic Bot', cost: 50, cps: 0.1, owned: 0, baseCost: 50, maxOwned: 100 },
    { id: 'auto2', name: 'Advanced Bot', cost: 500, cps: 1, owned: 0, baseCost: 500, maxOwned: 100 },
    { id: 'auto3', name: 'Super Bot', cost: 5000, cps: 10, owned: 0, baseCost: 5000, maxOwned: 100 },
    { id: 'auto4', name: 'Mega Bot', cost: 50000, cps: 100, owned: 0, baseCost: 50000, maxOwned: 100 },
    { id: 'auto5', name: 'Ultra Bot', cost: 500000, cps: 1000, owned: 0, baseCost: 500000, maxOwned: 100 },
    { id: 'auto6', name: 'Quantum Bot', cost: 5000000, cps: 10000, owned: 0, baseCost: 5000000, maxOwned: 100 }
];

function purchaseUpgrade(upgrade) {
    if (gameState.points >= upgrade.cost && upgrade.owned < upgrade.maxOwned) {
        gameState.points -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
        
        updateUpgradeEffects(upgrade);
        playPurchaseSound();
        updateDisplay();
        saveGame();
    }
}

function updateUpgradeEffects(upgrade) {
    if (upgrade.pointsToAdd) {
        updatePointsPerClick();
    }
    if (upgrade.critAdd) {
        calculateCriticalChance();
    }
}

function purchaseAutoClicker(autoClicker) {
    if (gameState.points >= autoClicker.cost && autoClicker.owned < autoClicker.maxOwned) {
        gameState.points -= autoClicker.cost;
        autoClicker.owned++;
        autoClicker.cost = Math.floor(autoClicker.baseCost * Math.pow(1.15, autoClicker.owned));
        
        playPurchaseSound();
        updateDisplay();
        saveGame();
    }
}

function calculateAutoClickerProduction() {
    let production = 0;
    autoClickers.forEach(ac => {
        production += ac.owned * ac.cps;
    });
    return production * calculatePoints();
}

function playPurchaseSound() {
    const audio = new Audio('sounds/purchase.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
}

function processAutoClickers() {
    const autoClickPoints = calculateAutoClickerProduction() / 10;
    if (autoClickPoints > 0) {
        addPoints(autoClickPoints);
    }
}

// Auto-clicker interval
setInterval(processAutoClickers, 100);
