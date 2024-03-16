"use client";
import "./styles.css";
import AuthModal from "@/components/modals/auth/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import IndexContent from "../content";
import {
  __isAuthorized__,
  currentUserData_unsafe,
  gameStatsType,
  messageType,
  userDataType,
} from "@/lib/store";
import AlertToast, { toastType } from "../alert/alert";
import Logout from "../buton/logout/logout";
import ChatWindow from "../chat/chat";
import { nextTick } from "process";

let socket: any = null;

export default function App() {
  window.url = "http://localhost:3001";

  const [authModalVissible, setAuthModalVissibleModal] = useState(false);
  const [leaderboard, setLeaderoard] = useState([]);
  const userData = useSelector((state: any) => state.userData);
  const dispatch = useDispatch(); // Для отправки действий
  const [messages, setMessages] = useState<messageType[]>([]);
  const [toasts, setToasts] = useState<toastType[]>([]);

  function addToast(toast: toastType) {
    toasts.push(toast);
    setToasts([...toasts]);
  }

  function removeToast(index: number) {
    toasts.splice(index, 1);
    setToasts([...toasts]);
  }

  function onAuthSuccess() {
    setAuthModalVissibleModal(false);

    __isAuthorized__.value = true;
    connect2socket();
  }

  let connectTryCount = 0;

  const updateUserData = (newData: any) => {
    dispatch({
      type: "SET_USER_DATA",
      payload: newData,
    });
  };

  const addMessage = (msg: messageType) => {
    setMessages((prevMessages) => [...prevMessages, msg]);

    if (need2scroll()) scroll();
  };

  function scroll() {
    const messageArea: any = document.getElementById("message-area");
    console.log("scroll", messageArea);

    if (messageArea) {
      // nextTick заменен на setTimeout с задержкой 0, что эквивалентно nextTick во Vue
      setTimeout(() => {
        messageArea.scrollTop = messageArea.scrollHeight;
      }, 0);
    }
  }

  function need2scroll() {
    const messageArea: any = document.getElementById("message-area");
    return (
      messageArea?.scrollHeight - messageArea?.scrollTop <
      messageArea?.clientHeight + 50
    );
  }

  function connect2socket() {
    socket = io("http://localhost:3001", {
      query: {
        id: localStorage.getItem("id") || "",
        password: localStorage.getItem("password") || "",
      },
    });

    socket.on("error", (err) => {
      addToast({ text: err, type: "error" });

      setTimeout(() => {
        removeToast(toasts.length - 1);
      }, 4_000);

      if (err == "401") {
        connectTryCount++;
        setAuthModalVissibleModal(true);
      }
    });

    socket.on("data", (data: { userInfo: any; messages: any[] }) => {
      console.log(data);

      data.userInfo.gameStats.balance = parseInt(data.userInfo.gameStats.balance);
      
      updateUserData(data.userInfo);
      setMessages(data.messages);
      
      __isAuthorized__.value = true;
      socket.emit("getLeaderboard");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      __isAuthorized__.value = false;
    });

    socket.on("leaderboard", (data: any) => {
      data = JSON.parse(data);
      console.log("leaderboard: ", data);
      setLeaderoard(data);
    });

    socket.on("message", (msg: any) => {
      console.log(userData.messages);
      console.log(msg);
      addMessage(msg);
      console.log(userData.messages);
    });

    return socket;
  }

  useEffect(() => {
    const l_socket = io("http://localhost:3001/leaderboard", {
      // path: "/leaderboard",
    });
    l_socket.on("error", (err) => {
      console.log("error", err);
    });
    l_socket.on("connect_error", (err) => {
      console.log("connect_error", err);
    });
    l_socket.on("connect", () => {
      console.log(" -------- connected");
    });
    l_socket.on("connected", () => {
      console.log(" -------- connected");
    });

    connect2socket();

    // auto save
    const autoSaveInterval = setInterval(() => {
      if (__isAuthorized__.value === false) return;
      console.log("saveData");

      const unsaveData: gameStatsType = currentUserData_unsafe.gameStats;
      console.log(unsaveData);

      const stats2save = {
        balance: unsaveData.balance.toFixed(0),
        mpc: {
          cost: parseInt(unsaveData.mpc.cost.toFixed()),
          amount: parseInt(unsaveData.mpc.amount.toFixed()),
          value: parseInt(unsaveData.mpc.value.toFixed()),
        },
        auto: {
          cost: parseInt(unsaveData.auto.cost.toFixed()),
          amount: parseInt(unsaveData.auto.amount.toFixed()),
          value: parseInt(unsaveData.auto.value.toFixed()),
        },
        triple: {
          cost: parseInt(unsaveData.triple.cost.toFixed()),
          amount: parseInt(unsaveData.triple.amount.toFixed()),
          value: parseInt(unsaveData.triple.value.toFixed()),
        },
        superAuto: {
          cost: parseInt(unsaveData.superAuto.cost.toFixed()),
          amount: parseInt(unsaveData.superAuto.amount.toFixed()),
          value: parseInt(unsaveData.superAuto.value.toFixed()),
        },
        speed: {
          cost: parseInt(unsaveData.speed.cost.toFixed()),
          unlocked: unsaveData.speed.unlocked,
          multiplier: unsaveData.speed.multiplier,
        },
        reset: { minCost: parseInt(unsaveData.reset.minCost.toFixed()) },
        otherUpgrades: {
          higherHackAmount: unsaveData.otherUpgrades.higherHackAmount,
          betterFirewall: unsaveData.otherUpgrades.betterFirewall,
          covertHacks: unsaveData.otherUpgrades.covertHacks,
          doubleHacks: unsaveData.otherUpgrades.doubleHacks,
        },
      };

      socket.emit("saveData", stats2save);
      socket.emit("getLeaderboard");
    }, 1500);

    return () => {
      clearInterval(autoSaveInterval);
      socket.disconnect();
      l_socket.disconnect();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-between md:flex-row bg-line">
      <AlertToast toasts={toasts} />
      <Logout />
      {authModalVissible ? <AuthModal onAuthSuccess={onAuthSuccess} /> : ""}
      <IndexContent leaderboard={leaderboard} />
      <ChatWindow socket={socket} messages={messages} addMessage={addMessage} />
    </main>
  );
}
