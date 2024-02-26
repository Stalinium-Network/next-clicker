"use client";
import axios from "axios";
import "./style.css";
import ModalWrapper from "@/components/common/modal-wrapper";
import { useState } from "react";

export default function AuthModal() {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  async function auth(mode: "login" | "signup") {
    const res = await axios.post(`${window.url}/${mode}`, {
      username: "test",
      password: "test",
    })
    .catch(err => {
      console.log(err)
    })

    console.log(res)
  }

  return (
    <ModalWrapper>
      <div className="bg-white p-4 rounded-lg flex flex-col">
        <p className=" font-semibold text-lg mb-3">Авторизация</p>
        <input
          onInput={(v) => setUsernameValue(v.currentTarget.value)}
          className="input"
          placeholder="ник"
        />
        <input
          onInput={(v) => setPasswordValue(v.currentTarget.value)}
          className="input"
          placeholder="пароль"
        />
        <button
          onClick={() => auth("login")}
          className="btn mt-3 bg-black font-medium rounded-lg text-white p-1.5 focus:outline-slate-400 focus:outline-2 focus:outline-offset-2"
        >
          Login
        </button>
        <button
          onClick={() => auth("signup")}
          className="btn mt-1.5 font-medium border rounded-lg p-1"
        >
          SignUp
        </button>
      </div>
    </ModalWrapper>
  );
}
