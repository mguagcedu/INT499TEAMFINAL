import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const SUBSCRIPTIONS = [
  {
    id: "basic",
    name: "Basic StreamList",
    price: 7.99,
    badge: "Starter",
    description: "One screen, HD where available, ad supported."
  },
  {
    id: "standard",
    name: "Standard StreamList",
    price: 13.99,
    badge: "Most popular",
    description: "Two screens at once, Full HD, fewer ads, offline lists."
  },
  {
    id: "premium",
    name: "Premium StreamList",
    price: 18.99,
    badge: "Cinematic",
    description: "Four screens, 4K where available, priority notification slots."
  }
];

const ShopPage = () => {
  const { cartItems, addSubscriptionToCart, cartCount } = useApp() || {};
  const navigate = useNavigate();

  const selectedId = cartItems && cartItems[0] ? cartItems[0].id : null;

  const handleSelect = (plan) => {
    if (!addSubscriptionToCart) return;
    addSubscriptionToCart(plan);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  return (
    <main className="page">
      <header className="page-header">
        <h2>Choose a subscription</h2>
        <p>
          For this capstone, StreamList assumes a single active subscription at
          a time. Selecting a new plan replaces any plan that is already in
          your cart so that billing stays clear for the demo.
        </p>
      </header>

      <section className="plan-grid">
        {SUBSCRIPTIONS.map((plan) => {
          const active = selectedId === plan.id;
          return (
            <article
              key={plan.id}
              className={active ? "plan-card active" : "plan-card"}
            >
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <span className="plan-badge">{plan.badge}</span>
              </div>
              <p className="plan-price">
                ${plan.price.toFixed(2)}{" "}
                <span className="plan-price-term">per month</span>
              </p>
              <p className="plan-description">{plan.description}</p>

              <button
                type="button"
                className={active ? "btn small" : "btn small secondary"}
                onClick={() => handleSelect(plan)}
              >
                {active ? "Selected" : "Select this plan"}
              </button>
            </article>
          );
        })}
      </section>

      <footer className="shop-footer">
        <span>
          Cart currently has {cartCount || 0} subscription
          {cartCount === 1 ? "" : "s"} selected.
        </span>
        <button
          type="button"
          className="btn small"
          onClick={handleGoToCart}
          disabled={!cartCount}
        >
          Review cart
        </button>
      </footer>
    </main>
  );
};

export default ShopPage;
