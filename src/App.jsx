import { useState } from "react";

export default function Home() {
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState("Ready");

  function add(cmd) {
    setSteps([...steps, { cmd, ms: 500 }]);
  }

  function updateTime(index, value) {
    const arr = [...steps];
    arr[index].ms = value;
    setSteps(arr);
  }

  function remove(index) {
    const arr = [...steps];
    arr.splice(index, 1);
    setSteps(arr);
  }

  async function runProgram() {
    setStatus("Sending...");

    await fetch("/api/queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ steps }),
    });

    setStatus("Program Sent ✅");
  }

  const btn = {
    padding: "16px 24px",
    fontSize: "20px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: 42 }}>🚗 ESP32 Car Studio</h1>
      <p>Create movement sequence and send to ESP32</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
        <button style={{ ...btn, background: "#22c55e" }} onClick={() => add("fwd")}>
          Forward
        </button>

        <button style={{ ...btn, background: "#ef4444" }} onClick={() => add("back")}>
          Back
        </button>

        <button style={{ ...btn, background: "#3b82f6" }} onClick={() => add("left")}>
          Left
        </button>

        <button style={{ ...btn, background: "#a855f7" }} onClick={() => add("right")}>
          Right
        </button>

        <button style={{ ...btn, background: "#f59e0b" }} onClick={() => add("stop")}>
          Stop
        </button>
      </div>

      <h2 style={{ marginTop: 35 }}>Program Queue</h2>

      {steps.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#1e293b",
            padding: 15,
            borderRadius: 12,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <b style={{ width: 80 }}>{item.cmd}</b>

          <input
            type="number"
            value={item.ms}
            onChange={(e) => updateTime(i, Number(e.target.value))}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "none",
              width: 100,
            }}
          />

          <span>ms</span>

          <button
            onClick={() => remove(i)}
            style={{
              marginLeft: "auto",
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            Delete
          </button>
        </div>
      ))}

      <button
        onClick={runProgram}
        style={{
          marginTop: 25,
          ...btn,
          background: "#06b6d4",
          width: "100%",
          fontSize: 24,
          padding: 20,
        }}
      >
        ▶ Run Program
      </button>

      <h2 style={{ marginTop: 25 }}>{status}</h2>
    </div>
  );
}