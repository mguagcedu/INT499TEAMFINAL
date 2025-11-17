import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const app = useApp ? useApp() : null;
  const cartItems = app?.cartItems || [];
  const subscriptions = cartItems.filter((i) => i.type === "subscription");
  const addOns = cartItems.filter((i) => i.type !== "subscription");

  const selectedPlan =
    subscriptions[0] || {
      id: "basic-streamlist",
      name: "Basic StreamList",
      price: 7.99,
      description: "One screen, HD where available, ad supported.",
    };

  const addOnTotal = addOns.reduce((sum, item) => sum + (item.price || 0), 0);
  const monthlyTotal = (selectedPlan.price || 0) + addOnTotal;

  const [form, setForm] = useState({
    name: "",
    number: "",
    exp: "",
    cvc: "",
    zip: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Demo only – no real payment happens.
    setSubmitted(true);
    setTimeout(() => {
      navigate("/home");
    }, 900);
  }

  return (
    <div className="checkout-page-shell">
      <div className="checkout-header-row">
        <div className="step-pill">
          <span className="step-pill-number">2</span>
          <span>Step 2 of 2 · Payment details</span>
        </div>
        <div className="security-pill" aria-label="PCI demo notice">
          <span className="security-pill-icon">🔒</span>
          <span>Demo only · No card data is stored or sent to a server.</span>
        </div>
      </div>

      <div className="checkout-grid">
        {/* LEFT: Selected plan + review summary */}
        <section className="cart-summary checkout-card checkout-fade-in">
          <div className="checkout-card-header">
            <div className="checkout-card-icon">📺</div>
            <div>
              <h2>Selected plan</h2>
              <p className="checkout-subtitle">
                Review the subscription and add-ons before you confirm.
              </p>
            </div>
          </div>

          <div className="plan-row">
            <div className="plan-main">
              <div className="plan-name">{selectedPlan.name}</div>
              <div className="plan-desc">{selectedPlan.description}</div>
            </div>
            <div className="plan-price">
              {formatCurrency(selectedPlan.price || 0)}
              <span className="plan-price-period">/mo</span>
            </div>
          </div>

          {addOns.length > 0 && (
            <div className="addons-block">
              <div className="addons-title">Add-ons</div>
              <ul className="addons-list">
                {addOns.map((item) => (
                  <li key={item.id} className="addons-item">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.price || 0)}/mo</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="summary-divider" />

          <div className="summary-row">
            <span>Monthly total</span>
            <span className="summary-total">
              {formatCurrency(monthlyTotal)}
              <span className="plan-price-period">/mo</span>
            </span>
          </div>

          <div className="summary-row summary-row-small">
            <span>Billing starts after your free trial, if applicable.</span>
          </div>

          <div className="pci-badge">
            <div className="pci-icon">✅</div>
            <div className="pci-text">
              <div className="pci-title">PCI DSS friendly demo</div>
              <div className="pci-caption">
                This screen is designed to show a PCI-compliant flow. In a real
                deployment, card data would be tokenized and handled by a
                payment provider instead of this app.
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Card details form */}
        <section className="card-form checkout-card checkout-slide-in">
          <div className="checkout-card-header">
            <div className="checkout-card-icon card-icon">💳</div>
            <div>
              <h2>Card details (demo only)</h2>
              <p className="checkout-subtitle">
                Enter sample values to walk through the flow. Do not use a real
                card number.
              </p>
            </div>
          </div>

          <form className="card-form-grid" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Name on card</span>
              <input
                type="text"
                name="name"
                autoComplete="cc-name"
                placeholder="Jane Streamer"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Card number</span>
              <input
                type="text"
                name="number"
                autoComplete="cc-number"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={form.number}
                onChange={handleChange}
                required
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Expiry (MM/YY)</span>
                <input
                  type="text"
                  name="exp"
                  autoComplete="cc-exp"
                  placeholder="04/28"
                  value={form.exp}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="field">
                <span className="field-label">CVC</span>
                <input
                  type="password"
                  name="cvc"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  placeholder="123"
                  value={form.cvc}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="field">
              <span className="field-label">Billing ZIP</span>
              <input
                type="text"
                name="zip"
                autoComplete="postal-code"
                placeholder="90210"
                value={form.zip}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="primary-submit-btn">
              {submitted ? "Processing…" : "Start streaming"}
            </button>

            <p className="tiny-caption">
              By continuing, you are confirming this is a test transaction only.
              No real payment is processed.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
