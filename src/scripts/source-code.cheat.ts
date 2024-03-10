

async function updateUserData(userObj, socket) {
    const user = await db.get(userObj.username);
    const newGameStats = userObj.gameStats;

    if (user && user.password && (validateUserWithSocket(userObj.username, socket.id))) {

        socket.emit('updatedStats', user.gameStats)
        await setUser(user.username, user.password, user.gameStats, user.suspentionStatus);

        const validityCheck = checkUpdateValidity(userObj.gameStats, user.gameStats, userObj.username);

        if ((serverCheatDetection === true) && (validityCheck.cheating === true)) {
            const message = `Detected attempting to cheat $${validityCheck.details.margin} worth of assets.\nMaximum generated: ${validityCheck.details.maximumGenerated}\nMaximum clicked: ${validityCheck.details.maximumClicked}\nMaximum auto'ed: ${validityCheck.details.maximumAuto}\nMoney hacked: ${validityCheck.details.moneyHacked}\nMinimum spent: ${validityCheck.details.minimumSpent}\nMPC spent: ${validityCheck.details.mpcSpent}\nAutoclicker spent: ${validityCheck.details.autoSpent}\nSuperclicker spent: ${validityCheck.details.superAutoSpent}\nTriple spent: ${validityCheck.details.tripleSpent}`;

            logModeration(`${userObj.username}: ${message}`);
            modifyAccountSuspention(userObj.username, true, message);
            socket.emit('suspended');
        } else {
            socket.emit('updatedStats', newGameStats);
            await setUser(user.username, user.password, newGameStats, user.suspentionStatus);
        }
    }
}

function checkUpdateValidity(newGameStats, oldGameStats, username) {
    // Account for reuglar upgrades
    var autoSpent;
    var mpcSpent;
    var superAutoSpent;
    var tripleSpent;

    // Account for reset
    if (oldGameStats.reset.minCost == newGameStats.reset.minCost) {
        autoSpent = calculateSpent((newGameStats.auto.value - oldGameStats.auto.value), 200, oldGameStats.auto.value, 1.145);
        mpcSpent = calculateSpent((newGameStats.mpc.value - oldGameStats.mpc.value), 50, oldGameStats.mpc.value, 1.1);
        superAutoSpent = calculateSpent((newGameStats.superAuto.value - oldGameStats.superAuto.value), 10000, oldGameStats.superAuto.value, 1.145);
        tripleSpent = calculateSpent((newGameStats.triple.value - oldGameStats.triple.value), 500, oldGameStats.triple.value, 1.145);
    } else {
        autoSpent = calculateSpent(newGameStats.auto.value, 200, 0, 1.145);
        mpcSpent = calculateSpent(newGameStats.mpc.value, 50, 0, 1.1);
        superAutoSpent = calculateSpent(newGameStats.superAuto.value, 10000, 0, 1.145);
        tripleSpent = calculateSpent(newGameStats.triple.value, 500, 0, 1.145);
    }

    var minimumSpent = autoSpent + mpcSpent + superAutoSpent + tripleSpent;

    // Account for other upgrades
    if ((newGameStats.otherUpgrades.higherHackAmount == true) && (oldGameStats.otherUpgrades.higherHackAmount == false)) minimumSpent += 1000000;

    if ((newGameStats.otherUpgrades.betterFirewall == true) && (oldGameStats.otherUpgrades.betterFirewall == false)) minimumSpent += 1000000;

    if ((newGameStats.otherUpgrades.covertHacks == true) && (oldGameStats.otherUpgrades.covertHacks == false)) minimumSpent += 1000000;

    if ((newGameStats.otherUpgrades.doubleHacks == true) && (oldGameStats.otherUpgrades.doubleHacks == false)) minimumSpent += 10000000;

    // Account for money hacked
    var moneyHacked = 0;

    if (gameHacks.has(username)) {
        const hack = gameHacks.get(username);
        if (hack.accountedFor == false) {
            moneyHacked = hack.value;
        }
        gameHacks.delete(username);
    }

    const secondsBetweenUpdate = 30;

    const maximumClicked = (newGameStats.mpc.amount * secondsBetweenUpdate * maximumAvgPerSecond);
    const maximumAuto = ((newGameStats.auto.amount + (newGameStats.triple.amount * 3) + (newGameStats.superAuto.amount * newGameStats.mpc.amount)) * secondsBetweenUpdate * newGameStats.speed.multiplier);

    const maximumGenerated = maximumClicked + maximumAuto;
    const totalMax = oldGameStats.money + (maximumGenerated - minimumSpent);

    const cheatingDetected = (newGameStats.money > (totalMax));

    const returnObj = {
        cheating: cheatingDetected,
        details: {
            margin: newGameStats.money - (oldGameStats.money + maximumGenerated - minimumSpent),
            maximumGenerated: maximumGenerated,
            maximumClicked: maximumClicked,
            maximumAuto: maximumAuto,
            minimumSpent: minimumSpent,
            autoSpent: autoSpent,
            mpcSpent: mpcSpent,
            superAutoSpent: superAutoSpent,
            tripleSpent: tripleSpent
        }
    }

    return (returnObj);
}

function calculateSpent(amount, basePrice, beginningAmount, incrementalExponenent) {
    var total = 0;
    for (let purchases = 0; purchases < amount; purchases++) {
        total += Math.round(basePrice * (incrementalExponenent ** (beginningAmount + purchases)));
    }
    return (total);
}
