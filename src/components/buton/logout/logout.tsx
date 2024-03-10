import { SvgLogout } from "@/components/svg/logout";

export default function Logout() {
  function logout() {
    window.localStorage.removeItem("id");
    window.localStorage.removeItem("password");
    window.location.reload();
  }

  return (
    <button
      onClick={logout}
      className=" absolute right-0 top-0 m-3 border p-1 pl-3 pr-3 flex items-center rounded-lg"
    >
      <SvgLogout className="mr-1" />
      LogOut
    </button>
  );
}
