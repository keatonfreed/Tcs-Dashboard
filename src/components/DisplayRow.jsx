import React from 'react'
import 'src/components/DisplayRow.css'
import subtractIcon from "src/content/subtractIcon.png"
import addIcon from "src/content/addIcon.png"
import adjustIcon from "src/content/adjustIcon.png"


function DisplayRow({ studentId, student, updateStudent, pageActive, adjustMenuRef }) {

    function changeTokens(amount) {
        updateStudent(studentId, { ...student, tokens: student.tokens + amount })
    }
    return (
        <>
            <div className='DisplayRowItem'><button onClick={() => adjustMenuRef.current?.showModal()} className={`adjustMenuButton ${pageActive}`}><img src={adjustIcon} alt="edit" /></button><input type='text' value={student.name} onChange={(e) => { updateStudent(studentId, { ...student, name: e.target.value }) }} /></div>
            <div className='DisplayRowItem'><button onClick={() => changeTokens(-1)} className={`changeTokenButton ${pageActive}`}><img src={subtractIcon} alt="-" /></button><p>{student.tokens}</p><button onClick={() => changeTokens(1)} className={`changeTokenButton ${pageActive}`} ><img src={addIcon} alt="-" /></button></div>
            <div className='DisplayRowItem'><input type='text' value={student.wanted} onChange={(e) => { updateStudent(studentId, { ...student, wanted: e.target.value }) }} /></div>
            {/* <div className='DisplayRowItem'><p>{student.wanted}</p></div> */}
            <div className='DisplayRowItem'><input type='text' value={student.prev} onChange={(e) => { updateStudent(studentId, { ...student, prev: e.target.value }) }} /></div>
        </>
    )
}

export default DisplayRow;




