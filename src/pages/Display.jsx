import React, { useState, useEffect, useRef, useCallback } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from 'src/firebase'
import AdjustMenu from 'src/components/AdjustMenu'
import DisplayRow from 'src/components/DisplayRow'
import Password from 'src/components/Password'
import { useMediaQuery } from 'react-responsive'

// import mainIcon from "src/content/mainIcon.png"
import mainIconWide from "src/content/mainIconWide.png"
// import mainIconWide from "src/content/mainIconWideBlack.png"
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
    const [globalLog, setGlobalLog] = useState({});

    const [typingData, setTypingData] = useState({});

    const [adjustStudentId, setAdjustStudentId] = useState();
    const adjustMenuRef = useRef(null)

    const deleteStudent = () => { updateStudent(adjustStudentId, null) };
    const changeSchedule = (days) => { updateStudent(adjustStudentId, { ...students[adjustStudentId], schedule: days }) };
    const changeTyperID = useCallback((id, studentId) => { updateStudent(studentId || adjustStudentId, { ...students[studentId || adjustStudentId], typerID: id }) }, [adjustStudentId, students]);


    const mediumScreen = useMediaQuery({ query: '(max-width: 1200px)' })
    const smallScreen = useMediaQuery({ query: '(max-width: 640px)' })

    // function filterBestTest(tests) {
    //     let bestTest = null;
    //     for (const test of tests) {
    //         if (test["accuracy"] >= 90 && !(test["wpm"] >= 200) && !(test["accuracy"] > 100)) {
    //             if (bestTest === null || test["wpm"] > bestTest["wpm"]) {
    //                 bestTest = {
    //                     wpm: test["wpm"],
    //                     accuracy: test["accuracy"],
    //                 };
    //             }
    //         }
    //     }
    //     return bestTest
    // }

    const fetchTyping = useCallback(async () => {
        console.log("fetching typing")
        await fetch("https://tcs-typer.netlify.app/api/leaderboard")
            .then(resp => resp.json())
            .then((typingResp) => {
                if (typingResp && typingResp.length) {
                    const entriesWithBestTest = typingResp.map(({ id, best_test, ...rest }) => {
                        // const bestTest = filterBestTest(rest?.tests);
                        // console.log("best:", best_test)
                        return { id, ...rest, DASH_BestTest: best_test };
                    });

                    // Step 2: Sort the array based on the best test's wpm
                    entriesWithBestTest.sort((a, b) => {
                        const wpmA = a.DASH_BestTest?.wpm ?? -Infinity;
                        const wpmB = b.DASH_BestTest?.wpm ?? -Infinity;
                        return wpmB - wpmA;
                    });

                    // Step 3: Add DASH_RankIndex to each entry based on the sorted order
                    entriesWithBestTest.forEach((entry, index) => {
                        entry.DASH_RankIndex = index + 1;
                    });

                    // Step 4: Convert the sorted array back into an object
                    const sortedNewData = entriesWithBestTest.reduce((acc, entry) => {
                        acc[entry.id] = entry;
                        // console.log(entry.id)
                        return acc;
                    }, {});

                    console.dir(sortedNewData);
                    setTypingData(sortedNewData);
                } else {
                    console.error("No typing data found:", typingResp);
                }
            })
            .catch((error) => {
                console.log("Error fetching typing data:", error);
            });

    }, []);

    const fetchStudents = useCallback(async () => {
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
                        setGlobalLog(newData.globalLog)
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

    }, []);
    const updateStudents = async () => {
        setUpdating(true)
        const newLog = { ...globalLog }

        let addedCount = 0
        let removedCount = 0
        let changedCount = 0
        let studentsList = Object.entries(students)
        let storedStudentsList = Object.entries(storedStudents)

        storedStudentsList.forEach(([studentId, student]) => {
            if (!students[studentId]) removedCount++

        })
        let studentsWithHistory = { ...students }
        studentsList.forEach(([studentId, student]) => {

            if (!studentsWithHistory[studentId].history) studentsWithHistory[studentId].history = {}
            if (storedStudents[studentId]) {
                if (storedStudents[studentId].tokens !== students[studentId].tokens) {
                    studentsWithHistory[studentId].history[Date.now()] = students[studentId].tokens
                }
            } else {
                studentsWithHistory[studentId].history[Date.now()] = students[studentId].tokens
            }

            if (!storedStudents[studentId]) return addedCount++
            if (!isDeepEqual(student, storedStudents[studentId])) changedCount++
        })
        setStudents(studentsWithHistory)

        const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;
        const currentTime = Date.now();
        newLog[currentTime] = `Updated Students from Main Page: ${addedCount} Added, ${removedCount} Removed, ${changedCount} Changed`;

        // Trim logs older than two months
        for (const timestamp in newLog) {
            if (currentTime - timestamp > MONTH_IN_MS) {
                delete newLog[timestamp];
            }
        }

        console.log("updating", db, newLog);
        setGlobalLog(newLog);

        const docRef = doc(db, "Schools", SchoolName);
        await updateDoc(docRef, {
            students: studentsWithHistory,
            globalLog: newLog
        })
            .then(() => {
                setStoredStudents(studentsWithHistory);
                setUpdating(false);
            })
            .catch((error) => {
                console.log("Error updating document:", error);
                setUpdating(false)
            });
    }

    const normalizeName = (name) => name.toLowerCase().replace(/[^a-zA-Z\s]/g, '').trim();


    const autoLinkTypers = useCallback(() => {
        console.log("LINKING student and typing data...")
        let typingDataList = Object.entries(typingData)

        let linkedCount = 0
        Object.entries(students).forEach(([studentId, student]) => {
            if (!student.name) return
            if (student.typerID) return

            const typerID = typingDataList?.find(
                ([, studentData]) => normalizeName(student?.name) === normalizeName(studentData.full_name)
            )?.[0];

            if (typerID) {
                changeTyperID(typerID, studentId);
                linkedCount++
                // console.log("Changing user:", student?.name, typerID)
            } else {
                // console.log("User not found:", student?.name)
            }
        })
        console.log("LINKED student and typing data:", linkedCount)
        setLinkedTypingData(true)
    }, [changeTyperID, students, typingData])

    const [linkedTypingData, setLinkedTypingData] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchTyping();
        const typingFetch = setInterval(() => {
            fetchTyping();
        }, 10000)
        return () => {
            clearInterval(typingFetch)
        }
    }, [fetchStudents, fetchTyping]);

    useEffect(() => {
        if (linkedTypingData) return
        if (Object.keys(students).length > 0 && Object.keys(typingData).length > 0) {
            autoLinkTypers();
        }
    }, [students, typingData, linkedTypingData, autoLinkTypers]);


    const [sortMethod, setSortMethod] = useState(false)
    const searchInput = useRef()
    const [searchOpen, setSearchOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState("All")

    function toggleSearchOpen() {
        setSearchOpen((old) => {
            if (!old) {
                setTimeout(() => {
                    searchInput.current?.focus()
                }, 150)
            } else {
                setStudentSearch("")
            };
            return !old
        })
    }

    const [sortedStudents, setSortedStudents] = useState([]);
    useEffect(() => {
        let alphSort = (list) => {

            if (sortMethod === "TOKEN") {
                return list.sort((a, b) => {
                    const tokensA = a[1].tokens;
                    const tokensB = b[1].tokens;

                    return tokensB - tokensA; // Alphabetical comparison
                })
            } else if (sortMethod === "TYPING") {
                return list.sort((a, b) => {
                    const rankA = typingData[a[1].typerID]?.["DASH_BestTest"]?.wpm ?? -Infinity;
                    const rankB = typingData[b[1].typerID]?.["DASH_BestTest"]?.wpm ?? -Infinity;

                    return rankB - rankA;
                });
            } else {
                return list.sort((a, b) => {
                    const nameA = a[1].name;
                    const nameB = b[1].name;

                    if (!nameA) return 1;
                    if (!nameB) return -1;

                    return nameA.localeCompare(nameB); // Alphabetical comparison
                })
            }
        };
        let dayFilter = ([, student], override) => {
            let studentName = student?.name?.toLowerCase()
            const todayDay = selectedDay
            if (studentSearch && !override) {
                if (!studentName) return false
                if (!student?.schedule?.length || (!student.schedule.includes(todayDay) && todayDay !== "All")) return false
                return studentName.includes(studentSearch.toLowerCase()) || studentSearch.toLowerCase().includes(studentName)
            } else {
                // const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                // const today = new Date().getDay();
                // const todayDay = weekday[today]
                if (!student?.schedule?.length || (!student.schedule.includes(todayDay) && todayDay !== "All")) return false
                return true
            }
        };
        let studentsEntries = alphSort(Object.entries(students))

        setSortedStudents([studentsEntries.filter((student) => dayFilter(student)), studentsEntries.filter((student) => !dayFilter(student, true))]);
    }, [sortMethod, students, studentSearch, selectedDay, setSortedStudents, typingData])


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
        if (!studentId) studentId = Math.random().toString().substring(3, 20)
        setStudents((old) => {
            let out = { ...old }
            out[studentId] = newData
            if (!newData) {
                delete out[studentId]
            }
            return out
        })
    }



    const [imageLoaded, setImageLoaded] = useState(false);

    if (!imageLoaded) {
        return < Password setImageLoaded={setImageLoaded} />
    }

    return (
        <div className='pt-24 flex flex-col h-full'>
            <div className='fixed z-40 top-0 h-24 w-full bg-dark-background flex justify-center items-center'><img src={mainIconWide} draggable="false" alt="logo" className='sm:h-4/6 h-1/2 max-w-[90%]' /></div>
            <header className='DisplayTabs fixed w-full z-10 h-14 min-h-14 bg-primary text-gray-200 font-extrabold text-2xl flex flex-row'>
                <button onClick={(e) => { setSelectedDay("All") }} className={`DisplayTab ${selectedDay === "All" ? "DisplayTabSelected" : ""}`}>{mediumScreen ? "*" : "All"}</button>
                <button onClick={(e) => { setSelectedDay("Monday") }} className={`DisplayTab ${selectedDay === "Monday" ? "DisplayTabSelected" : ""}`}>{mediumScreen ? "M" : "Monday"}</button>
                <button onClick={(e) => { setSelectedDay("Tuesday") }} className={`DisplayTab ${selectedDay === "Tuesday" ? "DisplayTabSelected" : ""}`}>{mediumScreen ? "T" : "Tuesday"}</button>
                <button onClick={(e) => { setSelectedDay("Wednesday") }} className={`DisplayTab ${selectedDay === "Wednesday" ? "DisplayTabSelected" : ""}`}>{mediumScreen ? "W" : "Wednesday"}</button>
                <button onClick={(e) => { setSelectedDay("Thursday") }} className={`DisplayTab ${selectedDay === "Thursday" ? "DisplayTabSelected" : ""}`}>{mediumScreen ? smallScreen ? "T" : "Th" : "Thursday"}</button>
                <button onClick={(e) => { setSelectedDay("Friday") }} className={`DisplayTab ${selectedDay === "Friday" ? "DisplayTabSelected" : ""}`}>{mediumScreen ? "F" : "Friday"}</button>
                <button onClick={(e) => { setSelectedDay("Saturday") }} className={`DisplayTab ${selectedDay === "Saturday" ? "DisplayTabSelected" : ""}`}>{mediumScreen ? "S" : "Saturday"}</button>
            </header>
            <header className='mt-14 DisplayHeader fixed w-full z-10 h-14 min-h-14 bg-primary drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)] text-gray-200 font-extrabold text-2xl flex flex-row'>
                {!searchOpen ? (<div onClick={() => { toggleSearchOpen() }} className={`DisplayHeaderItem ${smallScreen ? "smallScreen" : ""}`}>Name</div>) : (
                    <div className={`DisplayHeaderItem ${smallScreen ? "smallScreen" : ""}`}><input ref={searchInput} type="text" onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setStudentSearch("") } }} placeholder='Search Here' value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} /></div>
                )}
                <div className={`DisplayHeaderItem ${smallScreen ? "smallScreen" : ""}`}>Tokens<button onClick={() => { setSortMethod((old) => { return old === "TOKEN" ? false : "TOKEN" }) }} className={`headerInlineIcon ${smallScreen ? "smallScreen" : ""} ${pageActive} ${sortMethod === "TOKEN" ? "" : "inactiveInlineIcon"}`}><img draggable="false" src={filterIcon} alt="sort" /></button></div>
                {!smallScreen && <div className='DisplayHeaderItem'>Typing Test<button onClick={() => { setSortMethod((old) => { return old === "TYPING" ? false : "TYPING" }) }} className={`headerInlineIcon ${smallScreen ? "smallScreen" : ""} ${pageActive} ${sortMethod === "TYPING" ? "" : "inactiveInlineIcon"}`}><img draggable="false" src={filterIcon} alt="sort" /></button></div>}
                {!smallScreen && <div className='DisplayHeaderItem'>Print Wanted</div>}
                {!smallScreen && <div className='DisplayHeaderItem'>Prev Prints</div>}
                <button onClick={() => { toggleSearchOpen() }} className={`headerIcon ${pageActive}`} ><img draggable="false" src={searchIcon} alt="search" /></button>
                <button disabled={updating} onClick={() => { if (!updatedData) return; updateStudents() }} className={`headerIcon ${pageActive}`}>{updatedData ? <div className='headerIconDot'></div> : ""}<img draggable="false" src={uploadIcon} alt="upload" /></button>
            </header>
            <div className=' mt-28'>
                <div className={`${smallScreen ? "smallScreen" : ""} DisplayTable flex flex-col w-full`}>
                    {
                        !(!sortedStudents[0]?.length && !sortedStudents[1]?.length) ? (
                            sortedStudents[0]?.length ? sortedStudents[0]?.map(([studentId, student]) => {
                                return (<DisplayRow key={studentId} studentId={studentId} student={student} updateStudent={updateStudent} pageActive={pageActive} adjustMenuRef={adjustMenuRef} setAdjustStudentId={setAdjustStudentId} studentTypingData={typingData?.[student.typerID]}></DisplayRow>)
                            }) : ""
                        ) : <h1 className='text-center w-screen mt-2 text-2xl'>No Students</h1>
                    }
                </div>
                {selectedDay === "All" && sortedStudents[1]?.length && !studentSearch ? <h1 className='opacity-50 col-span-4 mt-8 pb-2 pl-4 border-b border-black font-bold text-2xl text-black'>No Schedule</h1> : ""}
                <div className='opacity-50 DisplayTable flex flex-col w-full'>
                    {
                        selectedDay === "All" && sortedStudents[1]?.length && !studentSearch ? sortedStudents[1]?.map(([studentId, student]) => {
                            return (<DisplayRow key={studentId} studentId={studentId} student={student} updateStudent={updateStudent} pageActive={pageActive} adjustMenuRef={adjustMenuRef} setAdjustStudentId={setAdjustStudentId} studentTypingData={typingData?.[student.typerID]}></DisplayRow>)
                        }) : ""
                    }
                </div>
                {/* {JSON.stringify(students)} */}
            </div>
            <button className={`fixed right-4 bottom-4 p-3 px-8 mt-2 bg-primary rounded-md text-white font-bold text-2xl active:brightness-90 select-none ${pageActive}`} onClick={() => {
                const newStudentId = Math.random().toString().substring(3, 20);
                updateStudent(newStudentId, { name: "", tokens: 0, wanted: "", prev: "", schedule: [] });
            }}>Add</button>
            <AdjustMenu
                adjustMenuRef={adjustMenuRef}
                student={students[adjustStudentId]}
                deleteStudent={deleteStudent}
                changeSchedule={changeSchedule}
                typingData={typingData}
                changeTyperID={changeTyperID}
            />
        </div>
    )
}

export default Display