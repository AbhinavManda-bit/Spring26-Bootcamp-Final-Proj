
import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCartIcon, TagIcon } from '@heroicons/react/24/outline';

import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";
import { type Role } from "../types/index";

export default function SignupPage () {

    /*
        SIGNUP PAGE
        - Register new users
        - Collect:
            - Name
            - Email
            - Password
            - Role (Buyer/Seller)
        - Stores user in Firebase
    */

    const { currentUserData, loading, signupAndLogin } = useAuth();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("buyer");

    
        // Send the user away automatically once signed up
        // (!) Uncomment once logout feature is implemented
    useEffect(() => {
        if (loading) return;
        if (!currentUserData) return;
        console.log("Redirecting:", currentUserData.role);
        if (currentUserData.role === "buyer") {
            navigate("/products");
        } else {
            navigate("/seller-dash");
        }
    }, [navigate, currentUserData, loading]);
    

    const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await signupAndLogin(name, email, password, role);
            console.log("User signed up")
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-lvh w-full bg-terp-cream">
            {/* Left panel */}
            <div className="flex flex-col w-full md:w-1/2">
                {/* Decorative header */}
                <div className="flex h-4">
                    <div className="w-3/5 bg-terp-red"></div>
                    <div className="w-2/5 bg-terp-yellow"></div>
                </div>
                {/* Signup body */}
                <div className="flex flex-1 justify-center items-center">
                    <div className="flex flex-col w-2/3 ml-20 mr-5 my-10">
                        {/* Welcome message */}
                        <p className="text-4xl font-bold mb-6">Create an account</p>
                        {/* Role message */}
                        <p className="text-xl font-medium mb-2">Are you...</p>
                        {/* Role selection */}
                        <div className="flex justify-between items-center mb-6">
                            <button
                                className={`w-4/9 rounded-xl font-medium py-2 px-4 rounded-lg cursor-pointer
                                    ${(role === "buyer") ? "bg-terp-red text-white" : "bg-white hover:bg-gray-100 border border-terp-red text-terp-red"}
                                `}
                                onClick={() => setRole("buyer")}
                            >
                                <div className="flex justify-center items-center gap-x-2">
                                    <p>Buying</p>
                                    <ShoppingCartIcon className="h-4 w-4" />
                                </div>
                            </button>
                            <p>OR</p>
                            <button
                                className={`w-4/9 rounded-xl font-medium py-2 px-4 rounded-lg cursor-pointer
                                    ${(role === "seller") ? "bg-terp-red text-white" : "bg-white hover:bg-gray-100 border border-terp-red text-terp-red"}
                                `}
                                onClick={() => setRole("seller")}
                            >
                                <div className="flex justify-center items-center gap-x-2">
                                    <p>Selling</p>
                                    <TagIcon className="h-4 w-4" />
                                </div>
                            </button>
                        </div>
                        {/* Link to LoginPage */}
                        <div className="flex gap-x-1 mb-10">
                            <p className="font-light">Already have an account?</p>
                            <Link
                                to="/login"
                                className="underline cursor-pointer text-terp-red hover:text-terp-darkred"
                            >Login</Link>
                        </div>
                        <form 
                            className="flex flex-col"
                            onSubmit={handleAuth}
                        >
                            {/* Name field */}
                            <p className="text-sm mb-1">Name</p>
                            <input
                                className="focus:outline-none border border-gray-300 rounded-lg bg-white focus:bg-gray-100 transition-colors duration-500 text-sm text-black placeholder:text-gray-300 px-3 py-2 mb-5"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {/* Email field */}
                            <p className="text-sm mb-1">Email</p>
                            <input
                                className="focus:outline-none border border-gray-300 rounded-lg bg-white focus:bg-gray-100 transition-colors duration-500 text-sm text-black placeholder:text-gray-300 px-3 py-2 mb-5"
                                placeholder="jdoe@hackforimpact.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Password field */}
                            <p className="text-sm mb-1">Password</p>
                            <input
                                className="mt-1 focus:outline-none border border-gray-300 rounded-lg bg-white focus:bg-gray-100 transition-colors duration-500 text-sm text-black placeholder:text-gray-300 px-3 py-2 mb-5"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* Password instructions */}
                            <p className="text-xs text-gray-600 mb-10">Use 8 or more characters with a mix of letters, numbers, and symbols.</p>
                            {/* Signup */}
                            <button
                                className="rounded-xl bg-terp-red hover:bg-terp-darkred font-medium text-white py-2 px-4 rounded-lg cursor-pointer"
                                type="submit"
                            >Create an account</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Right panel */}
            <div className="hidden md:flex md:flex-col justify-center items-center w-1/2 bg-terp-red">
                <img 
                    src={Logo}
                    className="aspect-square w-1/3 mb-10"
                ></img>
                <p className="font-light text-white text-3xl">Your Campus Closet.</p>
            </div>
        </div>
    )

}
