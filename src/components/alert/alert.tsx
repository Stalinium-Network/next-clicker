import { useDispatch, useSelector } from "react-redux";

export default function AlertToast({ toasts }: { toasts: toastType[] }) {
  return (
    <div className=" absolute z-20">
      {toasts.map((toast, i) => {
        return (
          <div key={i} className=" z-10 bg-white rounded-lg border p-2 pl-4 pr-4 m-1 shadow-lg">
            {toast.text}
          </div>
        );
      })}
    </div>
  );
}

export type toastType = {
  text: string;
  type: "error" | "success";
};
