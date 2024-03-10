
const defaultGameStats = {
    money: 0,
    mpc: { cost: 50, amount: 1, value: 0 },
    auto: { cost: 200, amount: 0, value: 0 },
    triple: { cost: 500, amount: 0, value: 0 },
    superAuto: { cost: 10000, amount: 0, value: 0 },
    speed: { cost: 500000, unlocked: false, multiplier: 1 },
    reset: { minCost: 1000000 },
    otherUpgrades: {
        higherHackAmount: false,
        betterFirewall: false,
        covertHacks: false,
        doubleHacks: false
    }
}


interface UpgradeStats {
    cost: number;
    amount: number;
    value: number;
}

interface SpeedStats {
    cost: number;
    unlocked: boolean;
    multiplier: number;
}

interface ResetStats {
    minCost: number;
}

interface OtherUpgrades {
    higherHackAmount: boolean;
    betterFirewall: boolean;
    covertHacks: boolean;
    doubleHacks: boolean;
}

interface GameStats {
    money: number;
    mpc: UpgradeStats;
    auto: UpgradeStats;
    triple: UpgradeStats;
    superAuto: UpgradeStats;
    speed: SpeedStats;
    reset: ResetStats;
    otherUpgrades: OtherUpgrades;
}


export type UpdateUserDataObjType = {
    oldStats: GameStats;
    username: string;
    gameStats: GameStats;
}


type defaultUserType = {
    username: string,
    password: string,
    gameStats: {
        money: 0,
        mpc: { cost: 50, amount: 1, value: 0 },
        auto: { cost: 200, amount: 0, value: 0 },
        triple: { cost: 500, amount: 0, value: 0 },
        superAuto: { cost: 10000, amount: 0, value: 0 },
        speed: { cost: 500000, unlocked: false, multiplier: 1 },
        reset: { minCost: 1000000 },
        otherUpgrades: {
            higherHackAmount: false,
            betterFirewall: false,
            covertHacks: false,
            doubleHacks: false,
        },
    },
}