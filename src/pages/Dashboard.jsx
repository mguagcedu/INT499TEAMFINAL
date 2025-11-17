import React from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

function Dashboard() {
  const { user } = useAuth();
  const { favorites, plannerItems, cart } = useApp();

  return (
    <section className="page">
      <h2>Dashboard</h2>
      <p className="muted">
        This protected view summarizes your activity to show authentication in
        the final project.
      </p>
      <ul className="list">
        <li className="list-row">
          <strong>User</strong>
          <span>{user?.email}</span>
        </li>
        <li className="list-row">
          <strong>Favorites saved</strong>
          <span>{favorites.length}</span>
        </li>
        <li className="list-row">
          <strong>Planner items</strong>
          <span>{plannerItems.length}</span>
        </li>
        <li className="list-row">
          <strong>Items currently in cart</strong>
          <span>{cart.length}</span>
        </li>
      </ul>
    </section>
  );
}

export default Dashboard;
