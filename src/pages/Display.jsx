import React, { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';

import DisplayRow from '../components/DisplayRow'
import uploadIcon from "../content/uploadIcon.png"
import searchIcon from "../content/searchIcon.png"
import './Display.css'

const SchoolName = "Walnut Creek"

function isDeepEqual(obj1, obj2) {
    // Check if both arguments are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
        return obj1 === obj2;
    }

    // Compare if they have the same number of keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Recursively compare each key in obj1 with obj2
    for (let key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!isDeepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

function Display() {
    const [storedStudents, setStoredStudents] = useState({});
    const [updatedData, setUpdatedData] = useState(false);
    const [students, setStudents] = useState({});

    const [updating, setUpdating] = useState(false);

    const fetchStudents = async () => {
        setUpdating(true)
        console.log("fetching", db)
        const docRef = doc(db, "Schools", SchoolName);
        await getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    let newData = docSnapshot.data()
                    if (newData.students) {
                        let expandedData = { ...newData.students };
                        console.log(expandedData)
                        setStoredStudents(expandedData);
                        setStudents(expandedData);
                        setUpdating(false);
                    }
                } else {
                    console.error("No doc found for school:", SchoolName);
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
                setUpdating(false)
            });

    }
    const updateStudents = async () => {
        setUpdating(true)
        console.log("updating", db)
        const docRef = doc(db, "Schools", SchoolName);
        await updateDoc(docRef, {
            students: students
        })
            .then(() => {
                setStoredStudents(students);
                setUpdating(false);
            })
            .catch((error) => {
                console.log("Error updating document:", error);
                setUpdating(false)
            });
    }


    useEffect(() => {
        fetchStudents();
    }, [])

    function searchStudents() {

    }

    // let data = [{ name: "bob joe", tokens: 50, wanted: "cow", prev: "frog" }, { name: "josh 2", tokens: 150, wanted: "toad", prev: "pig" }, { name: "smith joe", tokens: 0, wanted: "dragon", prev: "egg" }]

    let iteratedStudents = Object.entries(students)

    useEffect(() => {
        setUpdatedData(!isDeepEqual(students, storedStudents))
    }, [students, storedStudents]);
    useEffect(() => {
        function beforeUnload(e) {
            if (!updatedData) return;
            e.preventDefault();
        }

        window.addEventListener('beforeunload', beforeUnload);

        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
            console.log("Locking page exit, unsaved changes..")
        };
    }, [updatedData]);

    // let updatedData = !isDeepEqual(students, storedStudents)

    // if (updatedData) {
    //     window.addEventListener('beforeunload', beforeUnload);
    //     // window.onbeforeunload = function () {
    //     //     return "Are you sure you want to navigate away test?";
    //     // }
    // } else {
    //     window.removeEventListener('beforeunload', beforeUnload);
    //     // window.onbeforeunload = function () {
    //     //     return "";
    //     // }
    // }

    return (
        <div className='flex flex-col h-full'>
            <header className='DisplayHeader w-full h-14 bg-primary text-gray-200 font-extrabold text-2xl flex flex-row'>
                <button onClick={() => { searchStudents() }} className='headerIcon'><img src={searchIcon} alt="search" /></button>
                <div className='h-full border-b border-black w-1/4 text-center flex items-center justify-center'>Name</div>
                <div className='h-full border-b border-l border-black w-1/4 text-center flex items-center justify-center'>Tokens</div>
                <div className='h-full border-b border-l border-black w-1/4 text-center flex items-center justify-center'>Print Wanted</div>
                <div className='h-full border-b border-l border-black w-1/4 text-center flex items-center justify-center'>Prev Prints</div>
                <button disabled={updating} onClick={() => { if (!updatedData) return; updateStudents() }} className='headerIcon'>{updatedData ? <div className='headerIconDot'></div> : ""}<img src={uploadIcon} alt="upload" /></button>
            </header>
            <div className='DisplayTable grid grid-cols-4 w-full'>
                {iteratedStudents.length ? iteratedStudents.map(([id, student]) => {
                    return (<DisplayRow key={id} id={id} student={student} setStudents={setStudents} ></DisplayRow>)
                }) : <h1 className='text-center w-screen mt-2 text-2xl'>No Students</h1>}
                {/* {JSON.stringify(students)} */}
            </div>
        </div>
    )
}

export default Display