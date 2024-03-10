import { userDataType } from "@/lib/store";

export function buyMoneyPerClick(userData: userDataType, updateUserData: (newData: any) => void) {
    const cost = userData.gameStats.mpc.cost;
    if (cost > userData.gameStats.balance) return;

    userData.gameStats.balance -= cost;
    console.log(`before ${userData.gameStats.mpc.cost}`);
    userData.gameStats.mpc.cost *= UpgradeNums.mpcSpent;
    console.log(`after ${userData.gameStats.mpc.cost}`);
    userData.gameStats.mpc.value++;
    userData.gameStats.mpc.amount++;

    const updatedUserData = {
        ...userData,
        gameStats: {
            ...userData.gameStats,
        },
    };
    updateUserData(updatedUserData);
}

export function buyAutoClicker(userData: userDataType, updateUserData: (newData: any) => void) {
    const cost = userData.gameStats.auto.cost;
    if (cost > userData.gameStats.balance) return;

    userData.gameStats.balance -= cost;
    userData.gameStats.auto.cost *= UpgradeNums.autoSpent;
    userData.gameStats.auto.value++;
    userData.gameStats.auto.amount++;

    const updatedUserData = {
        ...userData,
        gameStats: {
            ...userData.gameStats,
        },
    };
    updateUserData(updatedUserData);
}

export function buyTripleClicker(userData: userDataType, updateUserData: (newData: any) => void) {
    const cost = userData.gameStats.triple.cost;
    if (cost > userData.gameStats.balance) return;

    userData.gameStats.balance -= cost;
    userData.gameStats.triple.cost *= UpgradeNums.superAutoSpent;
    userData.gameStats.triple.value++;
    userData.gameStats.triple.amount++;

    console.log(userData.gameStats.superAuto)

    const updatedUserData = {
        ...userData,
        gameStats: {
            ...userData.gameStats,
        },
    };
    updateUserData(updatedUserData);
}


export function buySuperAutoClicker(userData: userDataType, updateUserData: (newData: any) => void) {
    const cost = userData.gameStats.superAuto.cost;
    if (cost > userData.gameStats.balance) return;

    userData.gameStats.balance -= cost;
    userData.gameStats.superAuto.cost *= UpgradeNums.tripleSpent;
    userData.gameStats.superAuto.value++;
    userData.gameStats.superAuto.amount++;

    const updatedUserData = {
        ...userData,
        gameStats: {
            ...userData.gameStats,
        },
    };
    updateUserData(updatedUserData);
}

export function resetPrices(userData: userDataType, updateUserData: (newData: any) => void) {
    userData.gameStats.mpc.cost = 50;
    userData.gameStats.auto.cost = 200;
    userData.gameStats.triple.cost = 500;
    userData.gameStats.superAuto.cost = 10_000;
    userData.gameStats.balance -= userData.gameStats.reset.minCost;

    userData.gameStats.reset.minCost *= 80;

    const updatedUserData = {
        ...userData,
        gameStats: {
            ...userData.gameStats,
        },
    };

    updateUserData(updatedUserData);
}

enum UpgradeNums {
    autoSpent = 1.145,
    mpcSpent = 1.1,
    superAutoSpent = 1.145,
    tripleSpent = 1.145
}
