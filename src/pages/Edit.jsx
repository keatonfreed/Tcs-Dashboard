import React, { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from 'src/firebase'
import "src/pages/Edit.css"

const SchoolName = "Walnut Creek"


function Edit() {
    const [addingStudents, setAddingStudents] = useState([]);
    const [students, setStudents] = useState({});
    const [invalid, setInvalid] = useState(false);

    const fetchStudents = async () => {
        console.log("fetching", db)
        const docRef = doc(db, "Schools", SchoolName);
        await getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    let newData = docSnapshot.data()
                    if (newData.students) {
                        let expandedData = { ...newData.students };
                        console.log(expandedData)
                        setStudents(expandedData);
                    }
                } else {
                    console.error("No doc found for school:", SchoolName);
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });

    }
    const updateStudents = async () => {
        console.log("updating", db)
        const docRef = doc(db, "Schools", SchoolName);
        await updateDoc(docRef, {
            students: students
        })
            .then(() => {
                // setStudents(students);
            })
            .catch((error) => {
                console.log("Error updating document:", error);
            });
    }

    useEffect(() => {
        fetchStudents();
    }, [])

    return (
        <div className='flex flex-col h-full items-center'>
            <header className='w-full min-h-14 bg-primary text-gray-200 font-extrabold text-2xl flex items-center justify-center'>Tcs Dashboard</header>
            <textarea className={`w-3/4 flex-grow mt-8 bg-slate-300 rounded-xl p-2 outline-none ${invalid ? "invalid" : ""}`} value={addingStudents} onChange={(e) => {
                try { setAddingStudents(e.target.value); JSON.parse(e.target.value); setInvalid(false) } catch (e) { setInvalid(true) }
            }}></textarea>
            <button className='p-3 px-8 mt-2 bg-primary rounded-md text-white font-bold text-2xl' onClick={() => { updateStudents(...students, addingStudents) }}>Add</button>
        </div>
    )
}

export default Edit