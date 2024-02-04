import React from 'react'
import 'src/components/DisplayRow.css'
import subtractIcon from "src/content/subtractIcon.png"
import addIcon from "src/content/addIcon.png"
import adjustIcon from "src/content/adjustIcon.png"


// function RowInput() {
//     const [val, setVal] = useState(value);
//     const updateVal = (val) => {
//         setVal(val);
//         onChange(val);

//     };

//     return (
//         <input value={val} onChange={(e) => updateVal(e.target.value)} />;
//         )
// }


function DisplayRow({ studentId, student, updateStudent, pageActive, adjustMenuRef, setAdjustStudentId }) {

    function changeTokens(amount) {
        updateStudent(studentId, { ...student, tokens: student.tokens + amount })
    }
    return (
        <>
            <div className={`DisplayRowItem`}><button onClick={() => { setAdjustStudentId(studentId); adjustMenuRef.current?.showModal() }} className={`adjustMenuButton w-12 ${pageActive}`}><img draggable="false" src={adjustIcon} alt="edit" /></button><input type='text' defaultValue={student.name} onChange={(e) => { updateStudent(studentId, { ...student, name: e.target.value }) }} /></div>
            <div className={`DisplayRowItem`}><button onClick={() => changeTokens(-1)} className={`changeTokenButton ${pageActive}`}><img draggable="false" src={subtractIcon} alt="-" /></button><p>{student.tokens}</p><button onClick={() => changeTokens(1)} className={`changeTokenButton ${pageActive}`} ><img draggable="false" src={addIcon} alt="-" /></button></div>
            <div className={`DisplayRowItem`}><input type='text' defaultValue={student.wanted} onChange={(e) => { updateStudent(studentId, { ...student, wanted: e.target.value }) }} /></div>
            {/* <div className={`DisplayRowItem`}><p>{student.wanted}</p></div> */}
            <div className={`DisplayRowItem`}><input type='text' defaultValue={student.prev} onChange={(e) => { updateStudent(studentId, { ...student, prev: e.target.value }) }} /></div>
        </>
    )
}

export default DisplayRow;




