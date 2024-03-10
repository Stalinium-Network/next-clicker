import "./style.css";
import formatMoney from "@/scripts/formated-money";

export default function Leaderboard({ leaderboard }: { leaderboard: any[] }) {
  return (
    <div className="">
      {leaderboard.map((user, index) => {
        return (
          <div key={index} className="flex flex-row sm:w-96 items-center m-2">
            <p className=" w-7 flex justify-center">{index + 1}</p>
            <div
              key={index}
              className="flex flex-row justify-between border border-solid flex-1 p-1.5 pl-2.5 pr-2.5 rounded-lg shadow-md"
            >
              <p className="text-nowrap max-w-60 overflow-hidden relative w-full">
                {user.id}
                <div className="gradient" />
              </p>
              <p className="text-nowrap">${formatMoney(user.balance)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
