"use client";
"use client";
import App from "@/components/app/app";
import store from "@/lib/store";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
