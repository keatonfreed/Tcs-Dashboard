import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from 'src/firebase'
import { useMediaQuery } from 'react-responsive'

import mainIconWide from "src/content/mainIconWide.png"

import 'src/pages/Home.css'




function Home() {

    const navigate = useNavigate()

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


    // const [imageLoaded, setImageLoaded] = useState(false);

    // if (!imageLoaded) {
    //     return < Password setImageLoaded={setImageLoaded} />
    // }

    return (
        <div className='pt-24 flex flex-col h-full'>
            <div className='fixed z-40 top-0 h-24 w-full bg-dark-background flex justify-center items-center'><img src={mainIconWide} draggable="false" alt="logo" className='sm:h-4/6 h-1/2 max-w-[90%]' /></div>
            <header className=' DisplayHeader fixed w-full z-10 h-14 min-h-14 bg-primary drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)] text-gray-200 font-extrabold text-2xl flex items-center justify-center'>
                <h1>Schools</h1>
            </header>
            <div className=' mt-14 p-8  h-full w-full flex flex-row items-center flex-wrap justify-center'>
                {loading && <h1>Loading...</h1>}
                {schools.map((schoolName) => {
                    return (<div key={schoolName} className='m-4 p-5 w-96 min-h-60 py-10 px-8 relative cursor-pointer rounded-lg bg-tint-background border-4 border-secondary flex flex-col gap-6 items-center align-center' onClick={() => { navigate("/" + schoolName) }}>
                        <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${schoolName}`} crossOrigin='anonymous' alt="School" className='rounded-md w-56' />
                        <h1 className='text-2xl font-bold text-secondary'> {schoolName}</h1>
                    </div>)
                }
                )}
            </div>
            <button className='fixed bottom-0 right-0 m-2 p-2 px-4 text-white text-xl font-bold rounded-lg bg-primary border-4 border-secondary' onClick={() => { navigate("/admin") }}>
                Admin
            </button>
        </div>
    )
}

export default Home