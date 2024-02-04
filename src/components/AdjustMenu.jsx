import React from 'react'
import 'src/components/AdjustMenu.css'

function AdjustMenu({ adjustMenuRef, student, deleteStudent, changeSchedule }) {

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${student?.name || "this student"}, it cannot be undone.`)) {
            deleteStudent();
            adjustMenuRef.current?.close();
        }
    };

    const handleEdit = (day) => {
        let old = student?.schedule || []
        if (typeof old !== "object") old = [old]
        if (old.includes(day)) {
            let index = old.indexOf(day)
            if (index > -1) {
                old.splice(index, 1);
            }
        } else {
            old.push(day)
        }
        changeSchedule(old);
        // adjustMenuRef.current?.close();
    };

    return (
        <dialog ref={adjustMenuRef} onClick={(e) => { if (e.target === adjustMenuRef.current) e.currentTarget.close() }} className='m-auto bg-transparent'>
            <div className='p-8 rounded-xl w-80 flex flex-col gap-1 bg-accent text-center text-white text-lg'>
                <h1 className='font-bold text-3xl underline mb-4 select-none'>{student?.name || "Student"}</h1>
                {/* <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select> */}
                <button onClick={() => handleEdit("Monday")} className={`adjustSelect ${student?.schedule?.includes("Monday") ? "adjustSelected" : ""}`}>Monday</button>
                <button onClick={() => handleEdit("Tuesday")} className={`adjustSelect ${student?.schedule?.includes("Tuesday") ? "adjustSelected" : ""}`}>Tuesday</button>
                <button onClick={() => handleEdit("Wednesday")} className={`adjustSelect ${student?.schedule?.includes("Wednesday") ? "adjustSelected" : ""}`}>Wednesday</button>
                <button onClick={() => handleEdit("Thursday")} className={`adjustSelect ${student?.schedule?.includes("Thursday") ? "adjustSelected" : ""}`}>Thursday</button>
                <button onClick={() => handleEdit("Friday")} className={`adjustSelect ${student?.schedule?.includes("Friday") ? "adjustSelected" : ""}`}>Friday</button>
                <button onClick={() => handleEdit("Saturday")} className={`adjustSelect ${student?.schedule?.includes("Saturday") ? "adjustSelected" : ""}`}>Saturday</button>
                <button onClick={handleDelete} className='bg-red-500 rounded-lg p-2 mt-4 select-none'>Delete Student</button>
            </div>
        </dialog>
    );
}

export default AdjustMenu
