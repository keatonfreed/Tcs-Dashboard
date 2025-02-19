import React, { useState, useEffect, useCallback } from 'react'
import { doc, collection, getDocs, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from 'src/firebase'
import "src/pages/Admin.css"
import Password from 'src/components/Password'
import sha256 from 'js-sha256';

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function Admin() {
    const imageLoader = "424ba93db407edb4c0e1529df9dbe9e23d20eba4f6471144b707068b56fd9f05"

    function testPassword(pass = "") {
        if (!pass) return;
        var hash = sha256.create();
        hash.update(pass);
        let final = hash.hex();
        return imageLoader === final
    }


    const [renamingSchool, setRenamingSchool] = useState("")
    const [renameInput, setRenameInput] = useState("")
    const [openEditor, setOpenEditor] = useState(false)
    const [createInput, setCreateInput] = useState("New School")
    const [openCreator, setOpenCreator] = useState(false)
    const [loading, setLoading] = useState(true)
    const [schools, setSchools] = useState([])

    // const mediumScreen = useMediaQuery({ query: '(max-width: 1200px)' })
    // const smallScreen = useMediaQuery({ query: '(max-width: 640px)' })

    const fetchSchools = useCallback(async () => {
        setLoading(true)
        console.log("fetching", db)
        // const docRef = doc(db, "Schools");
        // not doc but get list of docs in schools folder
        const colRef = collection(db, "Schools")
        await getDocs(colRef).then((querySnapshot) => {
            let tempSchools = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                tempSchools.push(doc.id)
            });
            setSchools(tempSchools)
        }
        ).catch((error) => {
            console.log("Error getting document:", error);
        });
        setLoading(false)
    }, []);

    useEffect(() => {
        fetchSchools()
    }, [fetchSchools])

    const addSchool = async (schoolName) => {
        console.log("adding", db)
        if (!schoolName) return;
        const docRef = doc(db, "Schools", schoolName);
        await setDoc(docRef, {
            globalLog: {},
            students: {
                "11111": {
                    highlight: false,
                    history: {},
                    name: "First Student",
                    prev: "",
                    schedule: [],
                    tokens: 10,
                    wanted: ""
                }
            }
        })
            .then((resp) => {
                // setStudents(students);
                console.log("Good updating document:", resp);
                fetchSchools()
            })
            .catch((error) => {
                console.log("Error updating document:", error);
            });
    }

    const renameSchool = async (oldSchoolName, newSchoolName) => {
        if (!oldSchoolName || !newSchoolName) return;

        const oldDocRef = doc(db, "Schools", oldSchoolName);
        const newDocRef = doc(db, "Schools", newSchoolName);

        try {
            // Fetch old data
            const docSnap = await getDoc(oldDocRef);
            if (!docSnap.exists()) {
                console.error("Old school does not exist.");
                return;
            }

            const schoolData = docSnap.data();

            // Create new document with new ID
            await setDoc(newDocRef, schoolData);

            // Delete old document
            await deleteDoc(oldDocRef);

            // Update schools list
            fetchSchools();
            console.log("School renamed successfully!");
        } catch (error) {
            console.error("Error renaming school:", error);
        }
    };


    const [imageLoaded, setImageLoaded] = useState(false);

    if (!imageLoaded) {
        return < Password setImageLoaded={setImageLoaded} />
    }
    return (
        <div className='flex flex-col h-full items-center'>
            <header className='w-full min-h-14 bg-primary text-gray-200 font-extrabold text-2xl flex items-center justify-center'>TCS Admin Dashboard</header>
            {loading && <h1>Loading...</h1>}
            <div className=' mt-14 p-8  h-full w-full flex flex-row items-center flex-wrap justify-center'>
                {schools.map((schoolName) => {
                    return (<div key={schoolName} className='m-4 p-5 w-96 min-h-60 py-10 px-8 relative cursor-pointer rounded-lg bg-tint-background border-4 border-secondary flex flex-col gap-6 items-center align-center' onClick={() => { setRenamingSchool(schoolName); setRenameInput(schoolName); setOpenEditor(true) }}>

                        <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${schoolName}`} crossOrigin='anonymous' alt="School" className='rounded-md w-56 h-56' />
                        <h1 className='text-2xl font-bold text-secondary flex items-center gap-2'>{schoolName}<span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil " strokeWidth={4} viewBox="0 0 16 16">
                                <path strokeWidth={4} d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                            </svg>
                        </span></h1>

                    </div>)
                }
                )}
            </div>
            <button className='p-3 px-8 fixed bottom-0 right-0 m-6 bg-primary rounded-md text-white font-bold text-2xl' onClick={() => setOpenCreator(true)}>Add School</button>
            {openEditor && <div className='fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-40 backdrop-filter backdrop-blur-sm' onClick={(e) => { if (e.target === e.currentTarget) setOpenEditor(false) }}>
                <div className='w-96 bg-accent rounded-xl p-8 flex flex-col gap-4 justify-between '>
                    <h1 className='font-bold text-3xl mb-4 select-none text-white text-center'>Rename School</h1>
                    <input type="text" className='font-bold p-4 rounded-md bg-primary border-4 border-secondary text-white outline-none' value={renameInput} onChange={(e) => { setRenameInput(toTitleCase(e.target.value)) }} />
                    <button className='p-2 px-4 text-white text-xl font-bold rounded-lg bg-primary border-4 border-secondary' onClick={() => {
                        if (renameInput === renamingSchool) {
                            setOpenEditor(false);
                            return;
                        }
                        if (renameInput && renameInput.length > 0 && renameInput.length < 20 && !schools.includes(toTitleCase(renameInput)) && renameInput.match(/^[a-zA-Z0-9_ ]*$/) && renameInput !== "New School") {
                            renameSchool(renamingSchool, renameInput);
                            setOpenEditor(false);
                        } else {
                            alert("Invalid name, must be between 1 and 20 characters, cannot already exist, and must only contain letters and numbers.")
                        }
                    }}>
                        Save
                    </button>
                    <button className='p-2 px-4 text-white text-xl font-bold rounded-lg bg-red-500 border-4 border-red-600' onClick={() => {
                        if (window.confirm("Are you sure you want to DELETE this school and ALL OF ITS DATA?")) {
                            if (testPassword(window.prompt("Enter the admin password to DELETE ALL DATA (This is not a joke and cannot be undone):"))) {
                                deleteDoc(doc(db, "Schools", renamingSchool)).then(() => {
                                    fetchSchools();
                                    setOpenEditor(false);
                                }).catch((error) => {
                                    console.error("Error deleting document:", error);
                                });
                            } else {
                                alert("Incorrect password, deletion cancelled. Please do not attempt to delete data without proper authorization.")
                            }
                        }
                    }}>
                        DELETE SCHOOL
                    </button>


                </div>
            </div>}
            {openCreator && <div className='fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-40 backdrop-filter backdrop-blur-sm' onClick={(e) => { if (e.target === e.currentTarget) setOpenCreator(false) }}>
                <div className='w-96 bg-accent rounded-xl p-8 flex flex-col gap-4 justify-between '>
                    <h1 className='font-bold text-3xl mb-4 select-none text-white text-center'>Create School</h1>
                    <input type="text" className='font-bold p-4 rounded-md bg-primary border-4 border-secondary text-white outline-none' value={createInput} onChange={(e) => { setCreateInput(toTitleCase(e.target.value)) }} />
                    <button className='p-2 px-4 text-white text-xl font-bold rounded-lg bg-primary border-4 border-secondary' onClick={() => {
                        if (createInput && createInput.length > 0 && createInput.length < 20 && !schools.includes(toTitleCase(createInput)) && createInput.match(/^[a-zA-Z0-9_ ]*$/) && createInput !== "New School") {
                            addSchool(createInput);
                            setOpenCreator(false);
                        } else {
                            alert("Invalid name, must be between 1 and 20 characters, cannot already exist, and must only contain letters and numbers.")
                        }
                    }}>
                        Save
                    </button>

                </div>
            </div>}
        </div>
    )
}

export default Admin