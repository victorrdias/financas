import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarClock, Receipt, BarChart2 } from "lucide-react";

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
          <NavLink
            to="/graficos"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link--active" : ""}`
            }
          >
            <BarChart2 size={16} />
            Gráficos
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
