import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CreditCardForm from "../components/CreditCardForm";

function CreditCardPage() {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSuccess = () => {
    clearCart();
    navigate("/dashboard");
  };

  if (cart.length === 0) {
    return (
      <section className="page">
        <h2>Checkout</h2>
        <p className="muted">
          You have no items in your cart. Add a plan or movie before checking
          out.
        </p>
      </section>
    );
  }

  return (
    <section className="page">
      <CreditCardForm total={total} onSuccess={handleSuccess} />
    </section>
  );
}

export default CreditCardPage;
