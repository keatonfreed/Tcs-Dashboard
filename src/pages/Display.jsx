import React from 'react'
import DisplayRow from '../components/DisplayRow'
import './Display.css'

function Display() {
    let data = []

    return (
        <div className='flex flex-col h-full'>
            <header className='w-full h-14 bg-primary text-gray-200 font-extrabold text-2xl flex flex-row'>
                <div className='h-full border-b border-black w-1/4 text-center flex items-center justify-center'>Name</div>
                <div className='h-full border-b border-l border-black w-1/4 text-center flex items-center justify-center'>Tokens</div>
                <div className='h-full border-b border-l border-black w-1/4 text-center flex items-center justify-center'>Print Wanted</div>
                <div className='h-full border-b border-l border-black w-1/4 text-center flex items-center justify-center'>Prev Prints</div>
            </header>
            <div className='DisplayTable grid grid-cols-4 w-full'>
                {data.map((item) => {
                    return (<DisplayRow {...item} ></DisplayRow>)
                })}
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
                <div className=''>Bob</div>
                <div className=''>10</div>
                <div className=''>test</div>
                <div className=''>none</div>
            </div>
        </div>
    )
}

export default Display