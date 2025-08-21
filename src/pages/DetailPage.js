// pages/DetailPage.js
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

const Page = styled.div`max-width:720px;margin:48px auto;padding:16px;`;

export default function DetailPage() {
  const { id } = useParams();
  const todoList = JSON.parse(localStorage.getItem("TODO_APP") || "[]");
  const todo = todoList.find(t => t.id === id);

  if (!todo) {
    debugger;
    return (
      <Page>
        <h1>❌ Không tìm thấy công việc</h1>
        <Link to="/">⬅️ Quay lại danh sách</Link>
      </Page>
    );
  }

  return (
    <Page>
      <h1>📄 Chi tiết công việc</h1>
      <p><b>Tên:</b> {todo.name}</p>
      <p><b>Trạng thái:</b> {todo.isCompleted ? "✅ Hoàn thành" : "⏳ Chưa xong"}</p>
      {todo.note && <p><b>Ghi chú:</b> {todo.note}</p>}
      <p><b>Ngày tạo:</b> {new Date(todo.createdAt).toLocaleString()}</p>

      <Link to="/">⬅️ Quay lại danh sách</Link>
    </Page>
  );
}
