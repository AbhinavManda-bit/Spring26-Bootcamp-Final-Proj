
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";

export default function LoginPage () {

    /* 
        LOGIN PAGE
        - Allows users to log in with email and password
        - Redirects to CatalogPage after login
        - Links to SignupPage
    */

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);

    const { currentUserData, loading, login } = useAuth();

    const navigate = useNavigate();

    /**
        Send the user away automatically once signed up
        (!) Uncomment once logout feature is implemented
    useEffect(() => {
        if (loading) return;
        if (!currentUserData) return;
        console.log("Redirecting:", currentUserData.role);
        if (currentUserData.role === "buyer") {
            navigate("/catalog");
        } else {
            navigate("/dashboard");
        }
    }, [navigate, currentUserData, loading]);
    **/

    const handleAuth = async () => {
        try {
            await login(email, password);
            console.log("User logged in");
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
                {/* Login body */}
                <div className="flex flex-1 justify-center items-center">
                    <div className="flex flex-col w-2/3 ml-20 mr-5 my-10">
                        {/* Welcome message */}
                        <p className="text-4xl font-bold mb-10">Welcome Back, Terp</p>
                        {/* Link to SignupPage */}
                        <div className="flex gap-x-1 mb-10">
                            <p className="font-light">Don't have an account?</p>
                            <Link
                                to="/signup"
                                className="underline cursor-pointer text-terp-red hover:text-terp-darkred"
                            >Create now</Link>
                        </div>
                        <form 
                            className="flex flex-col"
                            onSubmit={handleAuth}
                        >
                            {/* Username field */}
                            <p className="text-sm mb-1">Email</p>
                            <input
                                className="focus:outline-none border border-gray-300 rounded-lg bg-white focus:bg-gray-100 transition-colors duration-500 text-sm text-black placeholder:text-gray-300 px-3 py-2 mb-5"
                                placeholder="someone@hackforimpact.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Password field */}
                            <p className="text-sm mb-1">Password</p>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full focus:outline-none border border-gray-300 rounded-lg bg-white focus:bg-gray-100 transition-colors duration-500 text-sm text-black placeholder:text-gray-300 px-3 py-2 mb-5 mt-1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => {setShowPassword(!showPassword)}}
                                    className="absolute right-2 top-1/2 transform translate-x-2 -translate-y-14 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >{showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}</button>
                            </div>
                            {/* Link to ForgotPassword */}
                            <div className="flex justify-end mb-10">
                                <Link
                                    to="/recover"
                                    className="underline cursor-pointer text-terp-red hover:text-terp-darkred"
                                >Forgot password?</Link>
                            </div>
                            {/* Login */}
                            <button
                                className="rounded-xl bg-terp-red hover:bg-terp-darkred font-medium text-white py-2 px-4 rounded-lg cursor-pointer"
                                type="submit"
                            >
                                Sign in
                            </button>
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
