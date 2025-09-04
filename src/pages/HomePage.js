// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import Button from "@atlaskit/button";

const TODO_APP_STORAGE_KEY = "TODO_APP";

// Hàm load dữ liệu từ localStorage
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

export default function HomePage() {
  const [todos, setTodos] = useState(loadTodos());
  const [showPopup, setShowPopup] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayTodos = todos.filter((t) => t.dueDate === todayStr);


}
