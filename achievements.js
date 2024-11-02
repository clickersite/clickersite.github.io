const achievements = [
    { id: 'ach1', name: 'Beginner Clicker', description: 'Reach 1,000 points', requirement: () => gameState.points >= 1000, reward: 1 },
    { id: 'ach2', name: 'Dedicated Clicker', description: 'Reach 1,000,000 points', requirement: () => gameState.points >= 1000000, reward: 2 },
    { id: 'ach3', name: 'Upgrade Master', description: 'Own 50 total upgrades', requirement: () => upgrades.reduce((sum, u) => sum + u.owned, 0) >= 50, reward: 2 },
    { id: 'ach4', name: 'Automation King', description: 'Own 50 total auto-clickers', requirement: () => autoClickers.reduce((sum, a) => sum + a.owned, 0) >= 50, reward: 2 },
    { id: 'ach5', name: 'Prestige Pioneer', description: 'Prestige for the first time', requirement: () => gameState.prestigeLevel >= 1, reward: 3 },
    { id: 'ach6', name: 'Super Human', description: 'Reach Super Prestige', requirement: () => gameState.superPrestigeLevel >= 1, reward: 5 },
    { id: 'ach7', name: 'Speed Demon', description: 'Reach 1M points per second', requirement: () => calculateAutoClickerProduction() >= 1000000, reward: 3 },
    { id: 'ach8', name: 'Critical Master', description: 'Reach 50% critical chance', requirement: () => gameState.criticalChance >= 50, reward: 4 },
    { id: 'ach9', name: 'Millionaire', description: 'Have 100 prestige tokens', requirement: () => gameState.prestigeTokens >= 100, reward: 4 },
    { id: 'ach10', name: 'Ultimate Collector', description: 'Unlock all other achievements', requirement: () => gameState.unlockedAchievements.size >= 9, reward: 10 }
];

const challenges = [
    {
        id: 'challenge1',
        name: 'Speed Run',
        description: 'Reach 1M points in under 5 minutes',
        isComplete: false,
        reward: { type: 'multiplier', value: 2 },
        check: () => {
            if (gameState.points >= 1000000 && gameState.statistics.totalTimePlayed <= 300) {
                return true;
            }
            return false;
        }
    },
    {
        id: 'challenge2',
        name: 'No Automation',
        description: 'Reach 100K points without auto-clickers',
        isComplete: false,
        reward: { type: 'criticalChance', value: 5 },
        check: () => {
            if (gameState.points >= 100000 && autoClickers.every(ac => ac.owned === 0)) {
                return true;
            }
            return false;
        }
    },
    {
        id: 'challenge3',
        name: 'Perfect Critical',
        description: 'Get 100 critical hits in a row',
        isComplete: false,
        reward: { type: 'criticalMultiplier', value: 1.5 },
        criticalStreak: 0
    }
];

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.unlockedAchievements.has(achievement.id) && achievement.requirement()) {
            unlockAchievement(achievement);
        }
    });
}

function unlockAchievement(achievement) {
    gameState.unlockedAchievements.add(achievement.id);
    gameState.achievementPoints += achievement.reward;
    
    showAchievementNotification(achievement);
    playAchievementSound();
    updateDisplay();
    saveGame();
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <h3>Achievement Unlocked!</h3>
        <p>${achievement.name}</p>
        <p>+${achievement.reward} Achievement Points</p>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function checkChallenges() {
    challenges.forEach(challenge => {
        if (!challenge.isComplete && challenge.check()) {
            completeChallenge(challenge);
        }
    });
}

function completeChallenge(challenge) {
    challenge.isComplete = true;
    applyReward(challenge.reward);
    showChallengeNotification(challenge);
    saveGame();
}

function applyReward(reward) {
    switch(reward.type) {
        case 'multiplier':
            gameState.globalMultiplier *= reward.value;
            break;
        case 'criticalChance':
            gameState.criticalChance += reward.value;
            break;
        case 'criticalMultiplier':
            gameState.criticalMultiplier *= reward.value;
            break;
    }
}
