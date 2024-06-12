"use client"
/*
Stuff still broken, form submission not working
*/

import express, {
    Response
} from "express";
import { useRouter } from "next/navigation"
import {useEffect, useState} from "react"

export default function DevSignupForm () {

    const router = useRouter()

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [age, setage] = useState("")
    const [firstname, setfirstname] = useState("")
    const [lastname, setlastname] = useState("")
    const [email, setemail] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    // @ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const signup= {username, password, email, age, firstname, lastname}
        console.log("submitted")
        try{
            const res: Response = fetch("http://localhost:9000/api/registration", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(signup)


            })

            if (res.status === 200) {
                router.refresh()
                router.push("/")
            }
            else if(res.status === 404){
                router.refresh()
                router.push("/signup")
            }
            else {
                router.refresh()
                router.push("/")

            }

        }
        catch (e: any | unknown) {
            console.log(e)

        }


    }




    return (
        <form onSubmit={handleSubmit}  className={"h-[28rem] flex-none ml-10"}>
            <label className={"text-xl"}>Username</label><br />
            <input
                required={true}
                onChange={(e)=> setusername(e.target.value)}
                value={username}
                type={"text"}
                className={
                    "mt-2 input input-bordered caret-black input-secondary text-black w-full max-w-xs z-50"
                }
                disabled={false}
                placeholder={"Username"}
            ></input><br />
            <div className={"mt-3"}></div>
            <label className={"text-xl"}>Password</label> <br />
            <input
                required={true}
                onChange={(e)=> setpassword(e.target.value)}
                value={password}
                type={"password"}
                className={
                    "mt-2 input input-bordered caret-black input-secondary text-black w-full max-w-xs z-50"
                }
                disabled={false}
                placeholder={"Password"}
            ></input> <br />
            <div className={"mt-3"}></div>
            <label className={"text-xl"}>Email</label> <br />
            <input
                required={true}
                onChange={(e)=> setemail(e.target.value)}
                value={email}
                type={"email"}
                className={
                    "mt-2 input input-bordered caret-black input-secondary text-black w-full max-w-xs z-50"
                }
                disabled={false}
                placeholder={"Email"}
            ></input> <br />
            <div className={"mt-3"}></div>
            <label className={"text-xl"}>Age</label> <br />
            <input
                required={true}
                onChange={(e)=> setage(e.target.value)}
                value={age}
                type={"number"}
                min={0}
                className={
                    "mt-2 input input-bordered caret-black input-secondary text-black w-full max-w-xs z-50"
                }
                disabled={false}
                placeholder={"Age"}
            ></input> <br />
            <div className={"mt-3"}></div>
            <label className={"text-xl"}>Firstname</label> <br />
            <input
                required={true}
                onChange={(e)=> setfirstname(e.target.value)}
                value={age}
                type={"text"}
                min={0}
                className={
                    "mt-2 input input-bordered caret-black input-secondary text-black w-full max-w-xs z-50"
                }
                disabled={false}
                placeholder={"Firstname"}
            ></input> <br />
            <div className={"mt-3"}></div>
            <label className={"text-xl"}>Lastname</label> <br />
            <input
                required={true}
                onChange={(e)=> setlastname(e.target.value)}
                value={age}
                type={"text"}
                min={0}
                className={
                    "mt-2 input input-bordered caret-black input-secondary text-black w-full max-w-xs z-50"
                }
                disabled={false}
                placeholder={"Lastname"}
            ></input> <br />

            <div className={"mt-3 flex my-auto justify-items-center"}>
                <button type={"submit"}
                        disabled={isLoading}

                        className="overflow-hidden w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group active:scale-90 transition-transform"
                >
                    {isLoading && <span>Good</span>}
                    {!isLoading && <span>Sign Up</span>}

                    <span
                        className="absolute w-36 h-32 -top-8 -left-2 bg-sky-200 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right"
                    ></span>
                    <span
                        className="absolute w-36 h-32 -top-8 -left-2 bg-sky-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right"
                    ></span>
                    <span
                        className="absolute w-36 h-32 -top-8 -left-2 bg-sky-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right"
                    ></span>
                    <span
                        className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10"
                    >Yes do it</span
                    >
                </button></div>

        </form>
    )
}