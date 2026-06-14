import React from "react";
import "../styles/Note.css";

function Note({note, deleteNote}) {
    const formattedDate = new Date(note.created_at).toLocaleString();

    return (
    <div className="note-container">
        <p className="note-title">{note.title}</p>
        <p className="note-content">{note.content}</p>
        <p className="note-date">{formattedDate}</p>
        <button className="delete-button" onClick={() => deleteNote(note.id)}>
            Delete
        </button>
    </div>
    )
}

export default Note;
