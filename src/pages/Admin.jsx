import React, { useState, useRef, useEffect } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from 'src/firebase'
import "src/pages/Admin.css"
import Password from 'src/components/Password'

const SchoolName = "Walnut Creek"


function Admin() {
    const [addingStudents, setAddingStudents] = useState([]);
    const [invalid, setInvalid] = useState(false);
    const [globalLog, setGlobalLog] = useState({});

    const fetchStudents = async () => {
        console.log("fetching", db)
        const docRef = doc(db, "Schools", SchoolName);
        return await getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    let newData = docSnapshot.data()
                    if (newData.students) {
                        let expandedData = { ...newData.students };
                        console.log(expandedData)
                        setGlobalLog(newData.globalLog);
                        return expandedData;
                    }
                } else {
                    console.error("No doc found for school:", SchoolName);
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });

    }

    useEffect(() => {
        fetchStudents()

    }, []);

    const updateStudentsWithData = async (studentData, override) => {
        console.log("updating", db)
        if ((!studentData || !Object.keys(studentData).length) && !override) return;
        const docRef = doc(db, "Schools", SchoolName);
        await updateDoc(docRef, {
            students: studentData
        })
            .then((resp) => {
                // setStudents(students);
                console.log("Good updating document:", resp);
            })
            .catch((error) => {
                console.log("Error updating document:", error);
            });
    }
    const addStudents = async () => {
        let toAddStudents;
        try {
            toAddStudents = JSON.parse(addingStudents)
        } catch (error) {
            console.log("adding students error:", error)
        }
        if (!toAddStudents || !toAddStudents.length) return console.log("not sending, no data")
        let studentsWithIds = toAddStudents?.reduce((acc, student) => {
            let newStudentId = Math.random().toString().substring(3, 20);
            acc[newStudentId] = student;
            return acc;
        }, {})
        console.log("adding", studentsWithIds)
        let students = await fetchStudents();
        await updateStudentsWithData({ ...students, ...studentsWithIds });
    }

    const fileImportRef = useRef()
    const addStudentsInput = useRef()

    const [fileImportData, setfileImportData] = useState();

    const formatCSVToJSON = (csvText) => {
        let out = []
        csvText = csvText.split("\n").slice(2)
        if (!csvText) return

        csvText.forEach(line => {
            let columns = line.split(',').slice(0, 24); // Get first 24 columns
            for (let i = 0; i < columns.length; i += 4) {
                let name = columns[i].trim();
                let tokens = parseInt(columns[i + 1].trim()) || 0;
                let wanted = columns[i + 2].trim();
                let prev = columns[i + 3].trim();

                if (name) {
                    out.push({
                        name: name,
                        schedule: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][Math.floor(i / 4)]],
                        tokens: tokens,
                        wanted: wanted,
                        prev: prev
                    });
                }
            }
        });
        return out
    }

    const fileImportChange = (event) => {
        const fileUploaded = event.target.files[0];
        var reader = new FileReader();

        reader.addEventListener('load', function (e) {
            setfileImportData(e.target.result.toString());
            setAddingStudents(JSON.stringify(formatCSVToJSON(e.target.result.toString())))
            event.target.value = null
        });
        console.log("reading", fileUploaded)
        reader.readAsBinaryString(fileUploaded);

    }

    function deleteAllStudents() {
        if (!window.confirm("ARE YOU SURE?")) return
        if (!window.confirm("Click OK to continue...")) return
        // if (window.confirm("Click CANCEL to continue...")) return
        if (!window.confirm("FINAL CONFIRM: This will permanently DELETE ALL user data through the entire database, and cannot be undone. Do not activate unless completely sure.")) return
        updateStudentsWithData({}, true)
        window.alert("ALL data cleared, if this was an issue please check in with help asap.")
    }


    const [imageLoaded, setImageLoaded] = useState(false);
    const [showGlobalLog, setShowGlobalLog] = useState(false);

    if (!imageLoaded) {
        return < Password setImageLoaded={setImageLoaded} />
    }
    return (
        <div className='flex flex-col h-full items-center'>
            <header className='w-full min-h-14 bg-primary text-gray-200 font-extrabold text-2xl flex items-center justify-center'>Tcs Dashboard</header>
            {showGlobalLog && <p className='mt-24 w-full px-20 text-slate-700 text-sm'>
                {Object.entries(globalLog).length ? Object.entries(globalLog).sort((a, b) => b[0] - a[0]).map(([date, log]) => {
                    return <div key={date} className='px-4 w-full flex justify-between mb-1 pt-1 border-t border-text last:border-b last:pb-1'>
                        <h1>{new Date(Number(date)).toLocaleString()}</h1>
                        <p>{log}</p>
                    </div>
                }) : "No log"}
            </p>}
            <button className='p-3 px-8 mt-8 mb-4 bg-primary rounded-md text-white font-bold text-2xl' onClick={() => fileImportRef?.current?.click()}>Import CSV</button>
            <p className='mt-2 px-20 text-slate-700 text-sm '>{fileImportData}</p>
            <textarea ref={addStudentsInput} className={`w-3/4 h-96 flex-grow mt-8 bg-slate-300 rounded-xl p-2 outline-none ${invalid ? "invalid" : ""}`} value={addingStudents} onChange={(e) => {
                try { setAddingStudents(e.target.value); JSON.parse(e.target.value); setInvalid(false) } catch (e) { setInvalid(true) }
            }}></textarea>
            <button className='p-3 px-8 mt-2 bg-primary rounded-md text-white font-bold text-2xl' disabled={invalid} onClick={() => addStudents()}>Add</button>
            <input type='file' accept=".csv" className='hidden' onChange={fileImportChange} ref={fileImportRef} ></input>
            <button className='p-3 px-8 fixed mt-14 top-4 left-4 mb-8 bg-blue-600 rounded-md text-white font-bold text-2xl' onClick={() => setShowGlobalLog((old) => { setShowGlobalLog(!old) })}>Global Update Log</button>
            <button className='p-3 px-8 mt-40 mb-8 bg-red-600 rounded-md text-white font-bold text-2xl' onClick={() => deleteAllStudents()}>!Delete All!</button>
        </div>
    )
}

export default Admin