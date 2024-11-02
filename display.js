function updateDisplay() {
    updateMainDisplay();
    updateUpgradesDisplay();
    updateAutoClickersDisplay();
    updatePrestigeDisplay();
    updateSuperPrestigeDisplay();
    updateAchievementsDisplay();
    updateBuffsDisplay();
    updateChallengesDisplay();
}

function updateMainDisplay() {
    document.getElementById('points').textContent = formatNumber(gameState.points);
    document.getElementById('pointsPerClick').textContent = formatNumber(calculatePoints());
    document.getElementById('prestigeTokens').textContent = formatNumber(gameState.prestigeTokens);
    document.getElementById('superPrestigePoints').textContent = formatNumber(gameState.superPrestigePoints);
    document.getElementById('achievementPoints').textContent = formatNumber(gameState.achievementPoints);
    document.getElementById('globalMultiplier').textContent = formatNumber(gameState.globalMultiplier, 2);
    document.getElementById('critChance').textContent = formatNumber(gameState.criticalChance, 1);
    
    const autoClicksPerSecond = calculateAutoClickerProduction();
    document.getElementById('pointsPerSecond').textContent = formatNumber(autoClicksPerSecond);
}

function updateUpgradesDisplay() {
    const upgradesDiv = document.getElementById('upgrades');
    upgradesDiv.innerHTML = '';
    
    upgrades.forEach(upgrade => {
        const button = createUpgradeButton(upgrade, 'upgrade');
        upgradesDiv.appendChild(button);
    });
}

function updatePrestigeDisplay() {
    const prestigeLevel = document.getElementById('prestigeLevel');
    const nextPrestigeBonus = document.getElementById('nextPrestigeBonus');
    const prestigeButton = document.getElementById('prestigeButton');
    
    if (prestigeLevel) prestigeLevel.textContent = formatNumber(gameState.prestigeLevel);
    if (nextPrestigeBonus) nextPrestigeBonus.textContent = formatNumber(calculatePrestigeBonuses(), 2);
    
    if (prestigeButton) {
        prestigeButton.disabled = gameState.points < PRESTIGE_REQUIREMENT;
        prestigeButton.innerHTML = `Prestige (Requires ${formatNumber(PRESTIGE_REQUIREMENT)} points)`;
    }

    const prestigeUpgradesDiv = document.getElementById('prestigeUpgrades');
    if (prestigeUpgradesDiv) {
        prestigeUpgradesDiv.innerHTML = '';
        prestigeUpgrades.forEach(upgrade => {
            const button = createUpgradeButton(upgrade, 'prestige-upgrade');
            prestigeUpgradesDiv.appendChild(button);
        });
    }
}

function updateAutoClickersDisplay() {
    const autoClickersDiv = document.getElementById('autoUpgrades');
    autoClickersDiv.innerHTML = '';
    
    autoClickers.forEach(autoClicker => {
        const button = createUpgradeButton(autoClicker, 'auto-clicker');
        autoClickersDiv.appendChild(button);
    });
}

function createUpgradeButton(item, type) {
    const button = document.createElement('button');
    button.className = type === 'upgrade' ? 'upgrade' : 'auto-clicker';
    button.disabled = gameState.points < item.cost || item.owned >= item.maxOwned;
    
    const description = type === 'auto-clicker' 
        ? `CPS: ${formatNumber(item.cps)}`
        : `Bonus: +${formatNumber(item.pointsToAdd || item.critAdd || 0)}`;
        
    button.innerHTML = `
        <div class="upgrade-name">${item.name}</div>
        <div class="upgrade-info">
            <div>${description}</div>
            <div>Cost: ${formatNumber(item.cost)}</div>
            <div>Owned: ${item.owned}/${item.maxOwned}</div>
        </div>
    `;
    
    button.onclick = () => type === 'upgrade' ? purchaseUpgrade(item) : purchaseAutoClicker(item);
    
    return button;
}

function formatNumber(num, decimals = 0) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(decimals);
}

function createFloatingText(text, x, y, color = '#ffffff') {
    const element = document.createElement('div');
    element.className = 'floating-text';
    element.textContent = text;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.color = color;
    
    document.body.appendChild(element);
    
    setTimeout(() => element.remove(), 1000);
}

setInterval(updateDisplay, 100);
