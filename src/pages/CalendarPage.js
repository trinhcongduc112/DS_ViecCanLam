// pages/CalendarPage.js
import React from "react";
import { useParams, Link } from "react-router-dom";

const TODO_APP_STORAGE_KEY = "TODO_APP";

export default function CalendarPage() {
  const { date } = useParams();  // yyyy-mm-dd
  const storaged = localStorage.getItem(TODO_APP_STORAGE_KEY);
  const todos = storaged ? JSON.parse(storaged) : [];

  // lọc việc theo dueDate
  const filteredTodos = todos.filter(t => t.dueDate === date);

  return (
    <div style={{ padding: 24 }}>
      <h1>📅 Công việc ngày {date}</h1>

      {filteredTodos.length === 0 ? (
        <p>Không có việc nào.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredTodos.map((t, idx) => (
            <li
              key={t.id}
              style={{
                marginBottom: "12px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {t.isCompleted ? "✅" : "⏳"} {t.name}
              </div>

              {t.note && (
                <div style={{ fontSize: 14, color: "gray" }}>📝 {t.note}</div>
              )}

              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                📌 Bắt đầu: {t.startTime || "—"} | ⏰ Kết thúc: {t.endTime || "—"}
              </div>

              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Việc số {idx + 1} • Ngày: {t.dueDate}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link to="/" style={{ display: "inline-block", marginTop: 16 }}>
        ⬅️ Quay lại danh sách
      </Link>
    </div>
  );
}
