import React, { useState } from "react";

function CreditCardForm({ total, onSuccess }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 400);
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <p className="muted">
        This is a non production demo form that simulates PCI awareness only.
      </p>

      <label>
        Card number
        <input
          required
          inputMode="numeric"
          maxLength={19}
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </label>

      <div className="card-row">
        <label>
          Expiry
          <input
            required
            maxLength={5}
            placeholder="12/28"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </label>
        <label>
          CVC
          <input
            required
            maxLength={4}
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
        </label>
        <label>
          ZIP
          <input
            required
            maxLength={10}
            placeholder="48192"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </label>
      </div>

      <button className="btn-primary" type="submit" disabled={submitted}>
        Pay ${total.toFixed(2)}
      </button>
    </form>
  );
}

export default CreditCardForm;
