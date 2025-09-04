import React, { useEffect, useState, useCallback } from "react";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import SectionMessage from "@atlaskit/section-message";
import styled, { createGlobalStyle } from "styled-components";
import { v4 as uuid } from "uuid";
import TodoList from "../components/TodoList";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TODO_APP_STORAGE_KEY = "TODO_APP";

// ================== STYLE ==================
const GlobalStyle = createGlobalStyle`
  :root {
    --bg:#f7f8fa; --card:#fff; --text:#172b4d; --muted:#6b778c; --primary:#0052cc; --border:#ebecf0;
  }
  html, body, #root { height:100%; }
  body { margin:0; background:var(--bg); color:var(--text); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
`;

const Page = styled.div`max-width:960px;margin:48px auto;padding:0 16px;`;
const Header = styled.header`display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;`;
const Title = styled.h1`font-size:24px;font-weight:700;margin:0;`;
const AddBar = styled.div`
  display:grid;grid-template-columns:1fr auto;gap:8px;background:var(--card);
  padding:12px;border:1px solid var(--border);border-radius:12px;box-shadow:0 1px 2px rgba(9,30,66,.08);
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 16px;
`;
const Sidebar = styled.div`display:flex;flex-direction:column;gap:24px;`;
const Card = styled.div`
  background: var(--card);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

// ================== COMPONENT ==================
export default function TodoListPage() {
  const [todoList, setTodoList] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(true); // popup mở khi restart
  const navigate = useNavigate();

  // ---------------- LOCAL STORAGE ----------------
  function loadTodos() {
    try {
      const storaged = localStorage.getItem(TODO_APP_STORAGE_KEY);
      if (storaged) {
        const parsed = JSON.parse(storaged);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Cannot parse TODO_APP:", e);
    }
    return [];
  }

  function saveTodos(list) {
    try {
      localStorage.setItem(TODO_APP_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Cannot save TODO_APP:", e);
    }
  }

  useEffect(() => {
    setTodoList(loadTodos());
  }, []);

  useEffect(() => {
    saveTodos(todoList);
  }, [todoList]);

  // ---------------- HANDLERS ----------------
  const addTodo = useCallback(() => {
    const name = textInput.trim();
    if (!name) return;

    const formatted = calendarDate.toISOString().split("T")[0];

    setTodoList(prev => [
      {
        id: uuid(),
        name,
        isCompleted: false,
        note: "",
        createdAt: Date.now(),
        dueDate: formatted,
        startTime: "",
        endTime: ""
      },
      ...prev,
    ]);
    setTextInput("");
  }, [textInput, calendarDate]);

  const handleCheck = useCallback(
    (id) => setTodoList(prev =>
      prev.map(t => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    ),
    []
  );

  const handleDelete = useCallback(
    (id) => setTodoList(prev => prev.filter(t => t.id !== id)),
    []
  );

  const handleRename = useCallback((id, name, note, startTime, endTime) => {
    setTodoList(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              ...(name !== undefined ? { name } : {}),
              ...(note !== undefined ? { note } : {}),
              ...(startTime !== undefined ? { startTime } : {}),
              ...(endTime !== undefined ? { endTime } : {}),
            }
          : t
      )
    );
  }, []);

  function handleKeyDown(e) {
    if (e.key === "Enter") addTodo();
  }

  function resetTodos() {
    const formatted = calendarDate.toISOString().split("T")[0];
    setTodoList(prev => prev.filter(t => t.dueDate !== formatted));
  }

  // ---------------- RENDER ----------------
  const formatted = calendarDate.toISOString().split("T")[0];
  const todayTodos = todoList.filter(t => t.dueDate === formatted);

  function renderHeader() {
    return (
      <Header>
        <Title>Danh sách việc cần làm trong ngày</Title>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color:"var(--muted)", fontSize:14 }}>
            {todayTodos.length} việc
          </span>
          {" | "}
          <Button appearance="warning" onClick={resetTodos}>
            🔄 Reset ngày {calendarDate.toLocaleDateString("vi-VN")}
          </Button>
        </div>
      </Header>
    );
  }

  function PerformanceChart({ todoList, calendarDate }) {
    const formatted = calendarDate.toISOString().split("T")[0];
    const todayTasks = todoList.filter(t => t.dueDate === formatted);

    const data = [
      {
        name: formatted,
        done: todayTasks.filter(t => t.isCompleted).length,
        pending: todayTasks.filter(t => !t.isCompleted).length,
      }
    ];

    return (
      <Card>
        <h3>📊 Hiệu suất</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="done" fill="#4caf50" name="Hoàn thành" />
            <Bar dataKey="pending" fill="#f44336" name="Chưa xong" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  }

  function renderAddBar() {
    return (
      <AddBar>
        <Textfield
          placeholder="Nhập việc cần làm..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <Button appearance="primary" onClick={addTodo}>Thêm</Button>
      </AddBar>
    );
  }

  function renderList() {
    if (todayTodos.length === 0) {
      return (
        <div style={{ marginTop:16 }}>
          <SectionMessage title="Chưa có việc nào" appearance="information">
            Hãy thêm việc ở ô phía trên để bắt đầu.
          </SectionMessage>
        </div>
      );
    }
    return (
      <TodoList
        todoList={todayTodos}
        onCheckBtnClick={handleCheck}
        onDelete={handleDelete}
        onRename={handleRename}
      />
    );
  }

  return (
    <Page>
      <GlobalStyle />
      {renderHeader()}

  {/* 🔔 Thông báo hiển thị trên đầu trang */}
  {showPopup && (
    <div
      style={{
        marginBottom: 16,
        padding: "12px 16px",
        borderRadius: 8,
        backgroundColor: "#e6f4ff",
        color: "#004085",
        fontWeight: 500,
        border: "1px solid #b6daff",
      }}
    >
      {todayTodos.length > 0 ? (
        <span>
          📌 Hôm nay bạn có <b>{todayTodos.length}</b> công việc cần làm.
        </span>
      ) : (
        <span>📝 Hôm nay bạn chưa có việc nào, hãy lập kế hoạch nhé!</span>
      )}
      {/* <Button
        spacing="compact"
        appearance="primary"
        style={{ marginLeft: 12 }}
        onClick={() => setShowPopup(false)}
      >
        Đóng
      </Button> */}
    </div>
  )}


      <Content>
        <div>
          {renderAddBar()}
          {renderList()}
        </div>

        <Sidebar>
          <Card>
            <h3>📅 Lịch</h3>
            <Calendar
              value={calendarDate}
              onChange={(date) => {
                setCalendarDate(date);
                const formatted =
                  date.getFullYear() +
                  "-" +
                  String(date.getMonth() + 1).padStart(2, "0") +
                  "-" +
                  String(date.getDate()).padStart(2, "0");
                navigate(`/calendar/${formatted}`);
              }}
            />
          </Card>
          <PerformanceChart todoList={todoList} calendarDate={calendarDate} />
        </Sidebar>
      </Content>
    </Page>
  );
}
