import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const CartPage = () => {
  const { cartItems, cartTotal, clearCart } = useApp() || {};
  const navigate = useNavigate();

  const hasItems = cartItems && cartItems.length > 0;
  const plan = hasItems ? cartItems[0] : null;

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required.";

    const digitsOnly = cardNumber.replace(/\s+/g, "");
    if (!/^[0-9]{13,19}$/.test(digitsOnly)) {
      newErrors.cardNumber =
        "Card number should contain 13 to 19 digits for demo purposes.";
    }

    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) {
      newErrors.expiry = "Use MM/YY format (for example, 04/28).";
    }

    if (!/^[0-9]{3,4}$/.test(cvv)) {
      newErrors.cvv = "CVV should be 3 or 4 digits.";
    }

    if (!/^[0-9]{5}$/.test(zip)) {
      newErrors.zip = "ZIP code should be 5 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!hasItems) return;
    if (!validate()) return;

    // Educational only – no real payment processing, no data persisted
    alert(
      "Payment details passed front-end validation. In production this step would send data to a PCI compliant payment provider. " +
        "For this capstone project, no card information is transmitted or stored."
    );

    if (clearCart) clearCart();
    setNameOnCard("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setZip("");

    navigate("/home");
  };

  return (
    <main className="page cart-page">
      <header className="page-header">
        <h2>Checkout</h2>
        <p>
          This page demonstrates a credit card entry flow for the capstone.
          Validation happens entirely in the browser and no payment is
          processed.
        </p>
      </header>

      {!hasItems ? (
        <p>
          Your cart is empty. Visit the <Link to="/shop">Shop</Link> tab to pick
          a plan before checking out.
        </p>
      ) : (
        <div className="checkout-grid">
          <section className="cart-summary">
            <h3>Selected plan</h3>
            <div style={{ marginBottom: 10 }}>
              <strong>{plan.name}</strong>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                ${plan.price.toFixed(2)} per month
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
                {plan.description}
              </div>
            </div>
            <hr style={{ borderColor: "rgba(148,163,184,0.35)" }} />
            <p style={{ fontWeight: 600 }}>
              Monthly total: ${cartTotal.toFixed(2)}
            </p>
          </section>

          <section className="card-form">
            <h3>Card details (demo only)</h3>
            <p className="field-hint">
              This form is for educational purposes only. Do not enter a real
              card number. No data leaves your browser.
            </p>

            <form onSubmit={handleCheckout} className="form-grid">
              <label className="field">
                <span>Name on card</span>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  autoComplete="cc-name"
                />
                {errors.nameOnCard && (
                  <p className="error-text">{errors.nameOnCard}</p>
                )}
              </label>

              <label className="field">
                <span>Card number</span>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                />
                {errors.cardNumber && (
                  <p className="error-text">{errors.cardNumber}</p>
                )}
              </label>

              <div className="field-row">
                <label className="field">
                  <span>Expiry (MM/YY)</span>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="04/28"
                    autoComplete="cc-exp"
                  />
                  {errors.expiry && (
                    <p className="error-text">{errors.expiry}</p>
                  )}
                </label>

                <label className="field">
                  <span>CVV</span>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                  {errors.cvv && (
                    <p className="error-text">{errors.cvv}</p>
                  )}
                </label>
              </div>

              <label className="field">
                <span>Billing ZIP</span>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  maxLength={5}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
                {errors.zip && <p className="error-text">{errors.zip}</p>}
              </label>

              <button type="submit" className="btn">
                Complete mock checkout
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

export default CartPage;
