import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../App.jsx";

const nav = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/section/hero", label: "Hero" },
  { to: "/section/highlights", label: "What we do" },
  { to: "/section/site", label: "Site settings" },
  { to: "/section/footer", label: "Footer" },
  { to: "/clients", label: "Clients" },
  { to: "/testimonials", label: "Testimonials" },
];

export default function Layout() {
  const { logout } = useAuth();
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">DIGInvictus</div>
        <nav>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="logout" onClick={logout}>
          Log out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
