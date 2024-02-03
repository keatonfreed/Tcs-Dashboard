import React, { useState, useEffect, useRef } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from 'src/firebase'
import AdjustMenu from 'src/components/AdjustMenu'
import DisplayRow from 'src/components/DisplayRow'

import mainIcon from "src/content/mainIcon.png"
import mainIconWide from "src/content/mainIconWide.png"
import uploadIcon from "src/content/uploadIcon.png"
import searchIcon from "src/content/searchIcon.png"
import filterIcon from "src/content/filterIcon.png"
import 'src/pages/Display.css'

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

    const [studentSearch, setStudentSearch] = useState("");

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


    const [tokenSort, setTokenSort] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState("All")

    const [sortedStudents, setSortedStudents] = useState([]);
    useEffect(() => {
        let alphSort = (list) => {
            if (tokenSort) {
                return list.sort((a, b) => {
                    const tokensA = a[1].tokens;
                    const tokensB = b[1].tokens;

                    return tokensB - tokensA; // Alphabetical comparison
                })
            }
            return list.sort((a, b) => {
                const nameA = a[1].name;
                const nameB = b[1].name;

                if (!nameA) return 1;
                if (!nameB) return -1;

                return nameA.localeCompare(nameB); // Alphabetical comparison
            })
        };
        let dayFilter = ([, student], override) => {
            let studentName = student?.name?.toLowerCase()
            const todayDay = selectedDay
            if (studentSearch && !override) {
                if (!studentName) return false
                // console.log("has", studentName, studentSearch, studentName.includes(studentSearch.toLowerCase()) || studentSearch.toLowerCase().includes(studentName))
                if (!student.schedule || (student.schedule !== todayDay && todayDay !== "All")) return false
                return studentName.includes(studentSearch.toLowerCase()) || studentSearch.toLowerCase().includes(studentName)
            } else {
                // const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                // const today = new Date().getDay();
                // const todayDay = weekday[today]

                if (!student.schedule || (student.schedule !== todayDay && todayDay !== "All")) return false
                // console.log(todayDay, student.schedule, student.schedule !== todayDay);
                return true
            }
        };
        let studentsEntries = alphSort(Object.entries(students))

        setSortedStudents([studentsEntries.filter((student) => dayFilter(student)), studentsEntries.filter((student) => !dayFilter(student, true))]);
    }, [tokenSort, students, studentSearch, selectedDay, setSortedStudents])


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

    const [pageActive, setpageActive] = useState("");

    useEffect(() => {
        const handleBlur = () => {
            setpageActive("inactiveHide");
        };

        const handleFocus = () => {
            setpageActive("");
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    function updateStudent(studentId, newData) {
        if (!studentId) studentId = Math.random().toString().substring(3, 8)
        setStudents((old) => {
            let out = { ...old }
            out[studentId] = newData
            if (!newData) {
                delete out[studentId]
            }
            return out
        })
    }


    const [adjustStudentId, setAdjustStudentId] = useState();
    const adjustMenuRef = useRef(null)

    const deleteStudent = () => { updateStudent(adjustStudentId, null) };
    const changeSchedule = (day) => { updateStudent(adjustStudentId, { ...students[adjustStudentId], schedule: day }) };


    return (
        <div className='pt-0 flex flex-col h-full'>
            {/* <div className='fixed top-0 h-0 w-full bg-dark-background flex justify-center items-center'><img src={mainIcon} alt="logo" className='h-4/6  ' /></div> */}
            <header className='DisplayTabs fixed w-full z-10 h-14 min-h-14 bg-primary text-gray-200 font-extrabold text-2xl flex flex-row'>
                <button onClick={(e) => { setSelectedDay("All") }} className={`DisplayTab ${selectedDay === "All" ? "DisplayTabSelected" : ""}`}>All</button>
                <button onClick={(e) => { setSelectedDay("Monday") }} className={`DisplayTab ${selectedDay === "Monday" ? "DisplayTabSelected" : ""}`}>Monday</button>
                <button onClick={(e) => { setSelectedDay("Tuesday") }} className={`DisplayTab ${selectedDay === "Tuesday" ? "DisplayTabSelected" : ""}`}>Tuesday</button>
                <button onClick={(e) => { setSelectedDay("Wednesday") }} className={`DisplayTab ${selectedDay === "Wednesday" ? "DisplayTabSelected" : ""}`}>Wednesday</button>
                <button onClick={(e) => { setSelectedDay("Thursday") }} className={`DisplayTab ${selectedDay === "Thursday" ? "DisplayTabSelected" : ""}`}>Thursday</button>
                <button onClick={(e) => { setSelectedDay("Friday") }} className={`DisplayTab ${selectedDay === "Friday" ? "DisplayTabSelected" : ""}`}>Friday</button>
                <button onClick={(e) => { setSelectedDay("Saturday") }} className={`DisplayTab ${selectedDay === "Saturday" ? "DisplayTabSelected" : ""}`}>Saturday</button>
            </header>
            <header className='mt-14 DisplayHeader fixed w-full z-10 h-14 min-h-14 bg-primary drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)] text-gray-200 font-extrabold text-2xl flex flex-row'>
                {!searchOpen ? (<div className='DisplayHeaderItem'>Name</div>) : (
                    <div className='DisplayHeaderItem'><input type="text" onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setStudentSearch("") } }} placeholder='Search Here' value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} /></div>
                )}
                <div className='DisplayHeaderItem'>Tokens<button onClick={() => { setTokenSort((old) => !old) }} className={`headerInlineIcon ${pageActive} ${tokenSort ? "" : "inactiveInlineIcon"}`}><img src={filterIcon} alt="sort" /></button></div>
                <div className='DisplayHeaderItem'>Print Wanted</div>
                <div className='DisplayHeaderItem'>Prev Prints</div>
                <button onClick={() => { setSearchOpen((old) => !old) }} className={`headerIcon ${pageActive}`} ><img draggable="false" src={searchIcon} alt="search" /></button>
                <button disabled={updating} onClick={() => { if (!updatedData) return; updateStudents() }} className={`headerIcon ${pageActive}`}>{updatedData ? <div className='headerIconDot'></div> : ""}<img src={uploadIcon} alt="upload" /></button>
            </header>
            <div className=' mt-28'>
                <div className='DisplayTable grid grid-cols-4 w-full '>
                    {
                        !(!sortedStudents[0]?.length && !sortedStudents[1]?.length) ? (
                            sortedStudents[0]?.length ? sortedStudents[0]?.map(([studentId, student]) => {
                                return (<DisplayRow key={studentId} studentId={studentId} student={student} updateStudent={updateStudent} pageActive={pageActive} adjustMenuRef={adjustMenuRef} setAdjustStudentId={setAdjustStudentId}></DisplayRow>)
                            }) : ""
                        ) : <h1 className='text-center w-screen mt-2 text-2xl'>No Students</h1>
                    }
                </div>
                {selectedDay === "All" && sortedStudents[1]?.length && !studentSearch ? <h1 className='opacity-50 col-span-4 mt-8 pb-2 pl-4 border-b border-black font-bold text-2xl text-black'>No Schedule</h1> : ""}
                <div className='opacity-50 DisplayTable grid grid-cols-4 w-full '>
                    {
                        selectedDay === "All" && sortedStudents[1]?.length && !studentSearch ? sortedStudents[1]?.map(([studentId, student]) => {
                            return (<DisplayRow key={studentId} studentId={studentId} student={student} updateStudent={updateStudent} pageActive={pageActive} adjustMenuRef={adjustMenuRef} setAdjustStudentId={setAdjustStudentId}></DisplayRow>)
                        }) : ""
                    }
                </div>
                {/* {JSON.stringify(students)} */}
            </div>
            <button className={`fixed right-4 bottom-4 p-3 px-8 mt-2 bg-primary rounded-md text-white font-bold text-2xl active:brightness-90 select-none ${pageActive}`} onClick={() => {
                const newStudentId = Math.random().toString().substring(3, 8);
                updateStudent(newStudentId, { name: "", tokens: 0, wanted: "", prev: "" });
            }}>Add</button>
            <AdjustMenu
                adjustMenuRef={adjustMenuRef}
                student={students[adjustStudentId]}
                deleteStudent={deleteStudent}
                changeSchedule={changeSchedule}
            />
        </div>
    )
}

export default Display