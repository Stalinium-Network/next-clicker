"use client";
import { createStore } from "redux";

export let currentUserData_unsafe: any = {}
export const __isAuthorized__ = { value: false }

const initialState = {
    userData: {
        _id: "",
        gameStats: {
            balance: 0,
            mpc: { cost: 0, amount: 0, value: 0 },
            auto: { cost: 0, amount: 0, value: 0 },
            triple: { cost: 0, amount: 0, value: 0 },
            superAuto: { cost: 0, amount: 0, value: 0 },
            speed: { cost: 0, unlocked: false, multiplier: 0 },
            reset: { minCost: 0 },
            otherUpgrades: {
                higherHackAmount: false,
                betterFirewall: false,
                covertHacks: false,
                doubleHacks: false,
            }
        }
    }
};

export type userDataType = {
    _id: string,
    gameStats: gameStatsType
}
export type gameStatsType = {
    balance: number,
    mpc: { cost: number, amount: number, value: number },
    auto: { cost: number, amount: number, value: number },
    triple: { cost: number, amount: number, value: number },
    superAuto: { cost: number, amount: number, value: number },
    speed: { cost: number, unlocked: boolean, multiplier: number },
    reset: { minCost: number },
    otherUpgrades: {
        higherHackAmount: boolean,
        betterFirewall: boolean,
        covertHacks: boolean,
        doubleHacks: boolean,
    }
}

function rootReducer(state = initialState, action: { type: string; payload: any }) {
    switch (action.type) {
        case "SET_USER_DATA":
            currentUserData_unsafe = action.payload
            return {
                ...state,
                userData: action.payload,
            };
        case "UPDATE_BALANCE":
            currentUserData_unsafe.gameStats.balance = action.payload
            return {
                ...state,
                userData: {
                    ...state.userData,
                    gameStats: {
                        ...state.userData.gameStats,
                        balance: action.payload,
                    },
                },
            };
        default:
            return state;
    }
}


const store = createStore(rootReducer)

export default store