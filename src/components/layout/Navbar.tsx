import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, Receipt, Wallet } from 'lucide-react';

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Wallet size={22} strokeWidth={2.2} />
          <span>Finanças</span>
        </div>
        <nav className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink to="/mensais" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
            <CalendarClock size={16} />
            Mensais
          </NavLink>
          <NavLink to="/avulsas" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
            <Receipt size={16} />
            Avulsas
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
