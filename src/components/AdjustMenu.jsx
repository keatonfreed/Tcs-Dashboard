import React, { useState } from 'react'

function AdjustMenu({ adjustMenuRef, onDelete, onEdit }) {
    const [selectedDay, setSelectedDay] = useState("");

    const handleDelete = () => {
        onDelete();
        adjustMenuRef.current?.close();
    };

    const handleEdit = () => {
        onEdit(selectedDay);
        adjustMenuRef.current?.close();
    };

    return (
        <dialog ref={adjustMenuRef} onClick={(e) => { if (e.target === adjustMenuRef.current) e.currentTarget.close() }}>
            <button onClick={handleDelete}>Delete Student</button>
            <div>
                <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>
                <button onClick={handleEdit} disabled={!selectedDay}>Edit Day</button>
            </div>
        </dialog>
    );
}

export default AdjustMenu
