import React from 'react'
import 'src/components/DisplayRow.css'
import subtractIcon from "src/content/subtractIcon.png"
import addIcon from "src/content/addIcon.png"


function DisplayRow({ id, student, setStudents }) {
    function updateStudent(newData) {
        setStudents((old) => {
            let out = { ...old }
            out[id] = newData
            return out
        })
    }
    function changeTokens(amount) {
        updateStudent({ ...student, tokens: student.tokens + amount })
    }
    return (
        <>
            <div className='DisplayRowItem'><p>{student.name}</p></div>
            <div className='DisplayRowItem'><button onClick={() => changeTokens(-1)} className=''><img src={subtractIcon} alt="-" /></button><p>{student.tokens}</p><button onClick={() => changeTokens(1)} ><img src={addIcon} alt="-" /></button></div>
            <div className='DisplayRowItem'><input type='text' value={student.wanted} onChange={(e) => { updateStudent({ ...student, wanted: e.target.value }) }} /></div>
            {/* <div className='DisplayRowItem'><p>{student.wanted}</p></div> */}
            <div className='DisplayRowItem'><input type='text' value={student.prev} onChange={(e) => { updateStudent({ ...student, prev: e.target.value }) }} /></div>
        </>
    )
}

export default DisplayRow;





