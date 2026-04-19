import { useState } from "react";

export default function CarControl() {
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [showIfModal, setShowIfModal] = useState(false);

  function add(cmd) {
    setSteps([...steps, { cmd, ms: 500 }]);
  }

  function addIf(choice) {
    // "wait" = หยุดรถ 3 วิ, "pass" = ไม่ทำอะไรเลย
    if (choice === "wait") {
      setSteps((prev) => [...prev, { cmd: "IF: wait 3s", ms: 3000 }]);
    } else {
      setSteps((prev) => [...prev, { cmd: "IF: pass", ms: 0 }]);
    }
    setShowIfModal(false);
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

  // สีของแถวใน queue ตามประเภทคำสั่ง
  function rowColor(cmd) {
    if (cmd === "IF: pass") return "#1e3a2f";
    if (cmd === "IF: wait 3s") return "#1e2a3a";
    return "#1e293b";
  }

  function cmdEmoji(cmd) {
    if (cmd === "IF: pass") return "⏭️";
    if (cmd === "IF: wait 3s") return "⏳";
    return null;
  }

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

        {/* ปุ่ม IF */}
        <button
          style={{ ...btn, background: "#0ea5e9", border: "2px dashed #38bdf8" }}
          onClick={() => setShowIfModal(true)}
        >
          🔀 IF
        </button>
      </div>

      <h2 style={{ marginTop: 35 }}>Program Queue</h2>

      {steps.map((item, i) => (
        <div
          key={i}
          style={{
            background: rowColor(item.cmd),
            padding: 15,
            borderRadius: 12,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: item.cmd.startsWith("IF:") ? "1px solid #0ea5e9" : "none",
          }}
        >
          <b style={{ width: 160, display: "flex", alignItems: "center", gap: 6 }}>
            {cmdEmoji(item.cmd) && (
              <span style={{ fontSize: 18 }}>{cmdEmoji(item.cmd)}</span>
            )}
            {item.cmd}
          </b>

          {/* IF: pass ไม่ต้องแสดง ms เพราะไม่ทำอะไร */}
          {item.cmd !== "IF: pass" && (
            <>
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
            </>
          )}

          <button
            onClick={() => remove(i)}
            style={{
              marginLeft: "auto",
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
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

      {/* Modal เลือก IF condition */}
      {showIfModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setShowIfModal(false)}
        >
          <div
            style={{
              background: "#1e293b",
              borderRadius: 20,
              padding: 36,
              width: 360,
              boxShadow: "0 0 40px rgba(14,165,233,0.3)",
              border: "1px solid #0ea5e9",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: 8, color: "#38bdf8" }}>
              🔀 IF Condition
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 28, fontSize: 15 }}>
              Choose a condition to add to the program
            </p>

            <button
              onClick={() => addIf("wait")}
              style={{
                ...btn,
                background: "#0369a1",
                width: "100%",
                marginBottom: 14,
                fontSize: 18,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 24 }}>⏳</span>
              <span>
                <div>Wait 3 sec for energy</div>
                <div style={{ fontSize: 13, fontWeight: "normal", color: "#bae6fd" }}>
                  The car will stop for 3 seconds
                </div>
              </span>
            </button>

            <button
              onClick={() => addIf("pass")}
              style={{
                ...btn,
                background: "#166534",
                width: "100%",
                fontSize: 18,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 24 }}>⏭️</span>
              <span>
                <div>Pass</div>
                <div style={{ fontSize: 13, fontWeight: "normal", color: "#bbf7d0" }}>
                  Skip — do nothing
                </div>
              </span>
            </button>

            <button
              onClick={() => setShowIfModal(false)}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "10px",
                borderRadius: 10,
                border: "1px solid #475569",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}