import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const PlannerPage = () => {
  const { plannerItems, setPlannerItems } = useApp() || {};
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !setPlannerItems) return;

    const newItem = {
      id: Date.now(),
      text: trimmed
    };

    setPlannerItems([...(plannerItems || []), newItem]);
    setText("");
  };

  const handleRemove = (id) => {
    if (!setPlannerItems) return;
    setPlannerItems((plannerItems || []).filter((item) => item.id !== id));
  };

  return (
    <main className="page">
      <header className="page-header">
        <h2>Streaming night planner</h2>
        <p>
          Use this lightweight planner to jot down nights, people, and titles.
          Items are stored in localStorage so they remain between sessions in
          your current browser.
        </p>
      </header>

      <form className="planner-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>What do you want to plan?</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: Friday &mdash; Loki with the kids"
          />
          <p className="field-hint">
            Press Enter or click Add to capture the item.
          </p>
        </label>
        <button type="submit" className="btn small">
          Add
        </button>
      </form>

      <section className="planner-list">
        {!plannerItems || plannerItems.length === 0 ? (
          <p>No planner items yet. Add one above to get started.</p>
        ) : (
          <ul className="simple-list">
            {plannerItems.map((item) => (
              <li key={item.id}>
                <span className="list-primary">{item.text}</span>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default PlannerPage;
