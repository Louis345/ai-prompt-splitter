import React, { useState, useEffect } from "react";
import { IconButton, TextField } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save"; // <-- Add the SaveIcon import
import { Link } from "react-router-dom";

interface DrawerItemProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onDelete: () => void;
  id: string;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
  title,
  onUpdateTitle,
  onDelete,
  id,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showSaveIcon, setShowSaveIcon] = useState(false); // <-- State to control which icon is displayed

  useEffect(() => {
    if (tempTitle.trim() === "") {
      setShowSaveIcon(false);
    }
  }, [tempTitle]);

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
          onChange={(e) => {
            setTempTitle(e.target.value);
            setShowSaveIcon(true);
          }}
          onBlur={() => {
            setIsEditing(false);
            onUpdateTitle(tempTitle);
            setShowSaveIcon(false);
          }}
        />
      ) : (
        <Link
          style={{
            flexGrow: 1,
            marginLeft: "8px",
            textDecoration: "none",
          }}
          to={`/summary/${id}`}
        >
          {title}
        </Link>
      )}
      <IconButton onClick={() => setIsEditing(!isEditing)}>
        {showSaveIcon ? <SaveIcon /> : <EditIcon />}
      </IconButton>
      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DrawerItem;
