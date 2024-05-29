import React, { useState, useEffect } from 'react'
import 'src/components/AdjustMenu.css'

function AdjustMenu({ adjustMenuRef, student, deleteStudent, changeSchedule, typingData, changeTyperID }) {
    const [typerSelectOpen, setTyperSelectOpen] = useState(false)
    const [typerSelectManual, setTyperSelectManual] = useState(false)

    useEffect(() => {
        adjustMenuRef.current.onclose = (e) => {
            setTyperSelectOpen(false)
            setTyperSelectManual(false)
        }
    }, [adjustMenuRef]);

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

    const normalizeName = (name) => name.toLowerCase().replace(/[^a-zA-Z\s]/g, '').trim();


    return (
        <dialog ref={adjustMenuRef} onClick={(e) => { if (e.target === adjustMenuRef.current) e.currentTarget.close() }} className='m-auto bg-transparent'>
            <div className={`p-8 rounded-xl ${!typerSelectOpen ? "w-80" : "w-auto"} flex flex-col gap-1 bg-accent text-center text-white text-lg`}>
                <h1 className='font-bold text-3xl underline mb-4 select-none'>{student?.name || "Student"}</h1>
                {!typerSelectOpen ? <>
                    <button onClick={() => handleEdit("Monday")} className={`adjustSelect ${student?.schedule?.includes("Monday") ? "adjustSelected" : ""}`}>Monday</button>
                    <button onClick={() => handleEdit("Tuesday")} className={`adjustSelect ${student?.schedule?.includes("Tuesday") ? "adjustSelected" : ""}`}>Tuesday</button>
                    <button onClick={() => handleEdit("Wednesday")} className={`adjustSelect ${student?.schedule?.includes("Wednesday") ? "adjustSelected" : ""}`}>Wednesday</button>
                    <button onClick={() => handleEdit("Thursday")} className={`adjustSelect ${student?.schedule?.includes("Thursday") ? "adjustSelected" : ""}`}>Thursday</button>
                    <button onClick={() => handleEdit("Friday")} className={`adjustSelect ${student?.schedule?.includes("Friday") ? "adjustSelected" : ""}`}>Friday</button>
                    <button onClick={() => handleEdit("Saturday")} className={`adjustSelect ${student?.schedule?.includes("Saturday") ? "adjustSelected" : ""}`}>Saturday</button>
                    <button onClick={() => setTyperSelectOpen(true)} className={`mt-4 adjustSelect ${student?.typerID ? "adjustSelected" : ""}`}>Tcs Typer</button>
                    <button onClick={handleDelete} className='bg-red-500 rounded-lg p-2 mt-4 select-none'>Delete Student</button>
                </> : <>
                    <button onClick={() => setTyperSelectOpen(false)} className='bg-red-800 rounded-lg p-1 mb-4 select-none w-96'>Cancel</button>
                    <button onClick={() => {
                        setTyperSelectManual(false)
                        if (student?.typerID) {
                            changeTyperID(false)
                        } else {
                            const typerID = Object.entries(typingData).find(
                                ([, studentData]) => normalizeName(student?.name) === normalizeName(studentData.full_name)
                            )?.[0];

                            if (typerID) {
                                changeTyperID(typerID);
                            } else {
                                console.log("User not found:", student?.name)
                                setTyperSelectManual(true)
                                window.open("https://tcs-typer.netlify.app/api/users")
                            }
                        }
                    }} className={` adjustSelect ${!student?.typerID ? "adjustSelected" : ""}`}>{student?.typerID ? `Unlink "${student?.name}"` : `Find "${student?.name}"`}</button>
                    <h1 className='mt-4'>User ID: {student?.typerID || "None"}</h1>
                    <h1 className=''>Name: {typingData[student?.typerID]?.full_name || "None"}</h1>
                    <h1 className=''>Username: {typingData[student?.typerID]?.username || "None"}</h1>
                    <h1 className=''>Password: {typingData[student?.typerID]?.password || "None"}</h1>
                    {typerSelectManual && <input type="number" onChange={(e) => {
                        let manualNum = e.target.valueAsNumber
                        if (manualNum && manualNum > 0) {
                            changeTyperID(manualNum);
                        } else {
                            changeTyperID(false);
                        }
                    }} placeholder='Input ID Manually' className={`mt-4 bg-red-600 text-center rounded-lg p-1`} />}
                </>}
            </div>
        </dialog>
    );
}

export default AdjustMenu
