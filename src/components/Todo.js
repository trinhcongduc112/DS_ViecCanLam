import React, { useState } from "react";
import Button from "@atlaskit/button";
import CheckIcon from "@atlaskit/icon/glyph/check";
import EditIcon from "@atlaskit/icon/glyph/edit";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import MoreIcon from "@atlaskit/icon/glyph/more";
import Textfield from "@atlaskit/textfield";
import DropdownMenu, { DropdownItemGroup, DropdownItem } from "@atlaskit/dropdown-menu";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";

const Row = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(9,30,66,0.08);
  padding: 8px 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
`;


const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  ${(p) =>
    p.$isCompleted &&
    css`
      text-decoration: line-through;
      color: var(--muted);
      opacity: 0.7;
    `}
`;

const CheckButton = styled.button`
  border: 1px solid var(--border);
  background: #fafbfc;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 120ms ease;
  &:hover { transform: translateY(-1px); }
`;

const InlineActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Note = styled.div`
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
  white-space: pre-wrap;
`;

export default function Todo({ todo, onCheckBtnClick, onDelete, onRename }) {
  // trong component Todo
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.name);

  const [isNoteEditing, setIsNoteEditing] = useState(false);
  const [noteDraft, setNoteDraft] = useState(todo.note || "");

  const saveName = () => {
    const name = draft.trim();
    if (!name) return;
    onRename(todo.id, name);
    setIsEditing(false);
  };
  const cancelName = () => {
    setDraft(todo.name);
    setIsEditing(false);
  };

  const saveNote = () => {
    onRename(todo.id, todo.name, noteDraft);
    setIsNoteEditing(false);
  };
  const cancelNote = () => {
    setNoteDraft(todo.note || "");
    setIsNoteEditing(false);
  };

  return (
    <Row>
      <div>
        <Name $isCompleted={todo.isCompleted}>
          <CheckButton
            aria-label={todo.isCompleted ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành"}
            onClick={(e) => {
              e.stopPropagation();
              onCheckBtnClick(todo.id);
            }}
            title="Hoàn thành"
          >
            <CheckIcon label="" size="small" />
          </CheckButton>

          {isEditing ? (
            <Textfield
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") cancelName();
              }}
              elemAfterInput={
                <>
                  <Button appearance="primary" spacing="compact" onClick={saveName}>Lưu</Button>
                  <Button spacing="compact" onClick={cancelName}>Hủy</Button>
                </>
              }
            />
          ) : (
            <span>{todo.name}</span>
          )}
        </Name>

        {/* Hiển thị ghi chú */}
        {!isNoteEditing && !!(todo.note && todo.note.trim()) && (
          <Note>📝 {todo.note}</Note>
        )}

        {/* Ô nhập ghi chú */}
        {isNoteEditing && (
          <div style={{ marginTop: 8 }}>
            <Textfield
              placeholder="Nhập ghi chú..."
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveNote();
                if (e.key === "Escape") cancelNote();
              }}
              elemAfterInput={
                <>
                  <Button appearance="primary" spacing="compact" onClick={saveNote}>Lưu</Button>
                  <Button spacing="compact" onClick={cancelNote}>Hủy</Button>
                </>
              }
            />
          </div>
        )}
      </div>

      <InlineActions>
        {!isEditing && (
          <>
            {/* 
            <Button
              spacing="compact"
              appearance="subtle"
              onClick={() => setIsEditing(true)}
              iconBefore={<EditIcon label="Sửa" />}
            >
              Sửa
            </Button>
            <Button
              spacing="compact"
              appearance="danger"
              onClick={() => onDelete(todo.id)}
              iconBefore={<TrashIcon label="Xóa" />}
            >
              Xóa
            </Button>
            */}

            <DropdownMenu
                placement="bottom-end"
                trigger={({ triggerRef, ...triggerProps }) => (
                  <Button
                    {...triggerProps}         // phải spread props từ DropdownMenu
                    ref={triggerRef}
                    appearance="subtle"
                    iconBefore={<MoreIcon label="Thêm" />}
                  />
                )}
              >
                <DropdownItemGroup>
                  <DropdownItem onClick={() => setIsEditing(true)}>✏️ Sửa tên</DropdownItem>
                  <DropdownItem onClick={() => onDelete(todo.id)}>🗑️ Xóa công việc</DropdownItem>
                  <DropdownItem onClick={() => setIsNoteEditing(true)}>📝 Ghi chú</DropdownItem>
                  <DropdownItem onClick={() => navigate(`/detail/${todo.id}`)}>📄 Chi tiết</DropdownItem>
                </DropdownItemGroup>
              </DropdownMenu>

          </>
        )}
      </InlineActions>
    </Row>
  );
}
