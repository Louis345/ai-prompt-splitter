import React, { useState } from "react";
import { IconButton, TextField } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface DrawerItemProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onDelete: () => void;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
  title,
  onUpdateTitle,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        backgroundColor: "#fff",
      }}
    >
      <IconButton>
        <ChatIcon />
      </IconButton>
      {isEditing ? (
        <TextField
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onUpdateTitle(tempTitle);
          }}
        />
      ) : (
        <span style={{ flexGrow: 1, marginLeft: "8px" }}>{title}</span>
      )}
      <IconButton onClick={() => setIsEditing(!isEditing)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DrawerItem;
