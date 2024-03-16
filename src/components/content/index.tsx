import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import {
  currentUserData_unsafe,
  gameStatsType,
  userDataType,
} from "@/lib/store";
import {
  buyAutoClicker,
  buyMoneyPerClick,
  buySuperAutoClicker,
  buyTripleClicker,
  resetPrices,
} from "./fn";
import formatMoney from "@/scripts/formated-money";
import Leaderboard from "../leaderboard";

export default function IndexContent({ leaderboard }: { leaderboard: any[] }) {
  const userData = useSelector((state: any) => state.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    // autoInterval
    const autoInterval = setInterval(() => {
      const unsaveData = currentUserData_unsafe.gameStats;
      if (!unsaveData.auto.amount) return;

      const newBalance =
        unsaveData.auto.amount +
        unsaveData.triple.amount * 3 +
        unsaveData.superAuto.amount * unsaveData.mpc.amount;

      // Диспатчим новое значение баланса
      dispatch({
        type: "UPDATE_BALANCE",
        payload: unsaveData.balance + newBalance,
      });
    }, 1000);

    return () => clearInterval(autoInterval);
  }, []);

  function clickHandler() {
    const i = userData.gameStats.mpc.amount * 1_230_000_000_000_000;
    console.log(i.toString());
    const updatedUserData = {
      ...userData,
      gameStats: {
        ...userData.gameStats,
        balance: userData.gameStats.balance + i,
      },
    };
    updateUserData(updatedUserData);
  }

  const updateUserData = (newData: any) => {
    dispatch({
      type: "SET_USER_DATA",
      payload: newData,
    });
  };

  return (
    <>
      <Leaderboard leaderboard={leaderboard} />
      <div className="m-auto flex">
        <div className=" w-48 justify-center items-center flex flex-col">
          <div className="text-nowrap flex font-bold text-lg text-slate-600">
            Balance
            <p className="ml-1">${formatMoney(userData.gameStats.balance)}</p>
          </div>
          <button
            onClick={clickHandler}
            className="click-btn border h-28 w-28 rounded-full shadow-lg font-semibold text-2xl cursor-pointer text-white"
          >
            $
          </button>
        </div>
        <div className="ml-4 flex-col flex">
          <button
            className="button"
            onClick={() => buyMoneyPerClick(userData, updateUserData)}
          >
            Money per click <p>${formatMoney(userData.gameStats.mpc.cost)}</p>
          </button>
          <button
            className="button"
            onClick={() => buyAutoClicker(userData, updateUserData)}
          >
            Auto clicker<p>${formatMoney(userData.gameStats.auto.cost)}</p>
          </button>
          <button
            className="button"
            onClick={() => buyTripleClicker(userData, updateUserData)}
          >
            Triple clicker<p>${formatMoney(userData.gameStats.triple.cost)}</p>
          </button>
          <button
            className="button"
            onClick={() => buySuperAutoClicker(userData, updateUserData)}
          >
            Super clicker
            <p>${formatMoney(userData.gameStats.superAuto.cost)}</p>
          </button>
          <button onClick={() => resetPrices(userData, updateUserData)} className="border">
            Reset prices<p>${formatMoney(userData.gameStats.reset.minCost)}</p>
          </button>
        </div>
      </div>
    </>
  );
}
