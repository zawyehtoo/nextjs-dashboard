"use client"

import { signIn } from "next-auth/react"

export function GithubSignInButton(){
    const handleClick =()=>{
        signIn("github")
    }
    return(
        <button
         onClick={handleClick}
         className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200">Continue with Github</button>
    )
}