import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";

const shouldRenderNavBar = () => {
  if (
    window.location.pathname.includes("/signup") ||
    window.location.pathname.includes("/signin") ||
    window.location.pathname.includes("/setup") ||
    window.location.pathname.includes("/forgot-password") ||
    window.location.pathname.includes("/reset-password") ||
    window.location.pathname.includes("/reset-password-check-expiry") ||
    window.location.pathname.includes("/verify-email")
  ) {
    return false;
  }

  return true;
};

export default function DefaultLayout({ isLoggedIn, user, onLogout }) {
  return (
    <div className="lg:flex">
      {isLoggedIn && shouldRenderNavBar() && (
        <div className="hidden lg:block w-1/4">
          <NavBar user={user} onLogout={onLogout} />
        </div>
      )}

      <div className="w-full min-h-screen sm:h-screen overflow-y-scroll overflow-x-scroll p-4 lg:px-12 lg:py-14">
        <Outlet />
      </div>
    </div>
  );
}
