import React from 'react'
import 'src/components/DisplayRow.css'
import subtractIcon from "src/content/subtractIcon.png"
import addIcon from "src/content/addIcon.png"
import adjustIcon from "src/content/adjustIcon.png"
// import downIcon from "src/content/downIcon.png"

import { useMediaQuery } from 'react-responsive'

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


function DisplayRow({ studentId, student, updateStudent, pageActive, adjustMenuRef, setAdjustStudentId, studentTypingData }) {
    const smallScreen = useMediaQuery({ query: '(max-width: 640px)' })

    // const [historyOpen, setHistoryOpen] = useState(false);

    function changeTokens(amount) {
        updateStudent(studentId, { ...student, tokens: student.tokens + amount })
    }
    return (
        // <div className={`DisplayRow  min-w-full w-full ${historyOpen ? "rowExpanded" : ""}`}>
        <div className={`DisplayRow  min-w-full w-full`}>
            <div className='grid grid-cols-2 sm:grid-cols-5 w-full'>
                <div className='DisplayRowItem'><button onClick={() => { setAdjustStudentId(studentId); adjustMenuRef.current?.showModal() }} className={`adjustMenuButton w-fit lg:w-12 ${pageActive}`}><img draggable="false" src={adjustIcon} alt="edit" /></button><input type='text' defaultValue={student.name} onChange={(e) => { updateStudent(studentId, { ...student, name: e.target.value }) }} /></div>
                <div className='DisplayRowItem'><button onClick={() => changeTokens(-1)} className={`changeTokenButton ${pageActive}`}><img draggable="false" src={subtractIcon} alt="-" /></button><input className="!min-w-[unset] !w-20 !shadow-none" type="text" inputMode="numeric" pattern="[0-9]*" value={student.tokens.toString()} onChange={(e) => { updateStudent(studentId, { ...student, tokens: Number(e.target.value) || e.target.value }) }} /><button onClick={() => changeTokens(1)} className={`changeTokenButton ${pageActive}`} ><img draggable="false" src={addIcon} alt="-" /></button></div>
                {!smallScreen && <div className='DisplayRowItem '><p style={{ whiteSpace: "pre-wrap" }}>{student?.typerID ? studentTypingData ? `Rank #${studentTypingData?.["DASH_RankIndex"]}:   ${studentTypingData?.["DASH_BestTest"]?.["wpm"]}wpm` : "No Data" : "Not Connected"}</p></div>}
                {!smallScreen && <div className='DisplayRowItem '><input type='text' defaultValue={student.wanted} onChange={(e) => { updateStudent(studentId, { ...student, wanted: e.target.value }) }} /></div>}
                {/* <div className='DisplayRowItem'><p>{student.wanted}</p></div> */}
                {/* {!smallScreen && <div className='DisplayRowItem'><button onClick={() => { setHistoryOpen((old) => !old) }} className={`historyDropButton w-fit lg:w-12 ${pageActive}`}><img draggable="false" src={downIcon} alt="history" /></button><input type='text' defaultValue={student.prev} onChange={(e) => { updateStudent(studentId, { ...student, prev: e.target.value }) }} /></div>} */}
                {!smallScreen && <div className='DisplayRowItem'><input type='text' defaultValue={student.prev} onChange={(e) => { updateStudent(studentId, { ...student, prev: e.target.value }) }} /></div>}

            </div>
            {/* <div className={`DisplayRowHistory w-full max-h-40 ${historyOpen ? "rowExpanded" : ""}`}> */}
            <div className={`DisplayRowHistory w-full max-h-40`}>
                <div className="flex font-bold flex-col">
                    {student.history && Object.entries(student.history).length ? Object.entries(student.history).map(([date, log]) => {
                        return (
                            <div className='w-full flex justify-center' key={date + log}>
                                <p className='pr-4 w-1/2 text-right'>{new Date(Number(date)).toDateString()}</p>
                                <p className='pl-4 w-1/2 border-l border-black'>{"10 -> 5"}</p>
                            </div>
                        )
                    }) : ""}
                </div>
            </div>
        </div>
    )
}

export default DisplayRow;




