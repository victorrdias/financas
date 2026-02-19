import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarClock, Receipt } from "lucide-react";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link--active" : ""}`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/mensais"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link--active" : ""}`
            }
          >
            <CalendarClock size={16} />
            Mensais
          </NavLink>
          <NavLink
            to="/avulsas"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link--active" : ""}`
            }
          >
            <Receipt size={16} />
            Avulsas
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
