import React, { useState } from 'react'
import sha256 from 'js-sha256';

export default function Password({ setImageLoaded }) {
    const [imageFailLoad, setImageFailLoad] = useState(false);
    const imageLoader = "424ba93db407edb4c0e1529df9dbe9e23d20eba4f6471144b707068b56fd9f05"

    const [password, setPassword] = useState("");
    function testPassword() {
        var hash = sha256.create();
        hash.update(password);
        let final = hash.hex();
        setImageLoaded(imageLoader === final)
        console.log(imageLoader === final)
        setImageFailLoad(!(imageLoader === final))
    }
    return (
        <div className='w-full min-h-screen h-full bg-dark-background flex items-center justify-center'>
            <form className='p-16 rounded-xl min-w-96 flex items-center flex-col gap-2 bg-accent text-center text-white text-lg'>
                <h1 className='font-bold text-5xl mb-4 select-none'>Password</h1>
                <input type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} className={`bg-secondary rounded-lg w-full p-2 mt-4 select-none outline-none ${imageFailLoad ? "passwordOutline" : ""}`}></input>
                <button type="submit" onClick={(e) => { e.preventDefault(); testPassword() }} className='bg-primary rounded-lg p-2 mt-4 w-3/4 select-none'>Submit</button>
            </form>
        </div>
    )
}
