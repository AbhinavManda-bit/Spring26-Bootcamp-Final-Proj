
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";

export default function ForgotPasswordPage () {

    /*
        FORGOT PASSWORD
        - Allows users to create a new password if they forget their old one
        - Collects email to send reset link
        - Link to LoginPage
    */

    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const { currentUserData, loading, sendResetPWEmail } = useAuth();

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
            await sendResetPWEmail(email);
            setSent(true);
            console.log("User password recovery email sent");
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
                {/* Recovery body */}
                <div className="flex flex-1 justify-center items-center">
                    <div className="flex flex-col w-2/3 ml-20 mr-5 my-6">
                        {/* Recovery message */}
                        <p className="text-4xl font-bold mb-10">Forgot password</p>
                        {/* Recovery instructions */}
                        <p className="font-light mb-10">Locked out? We've got you! Enter your email address, and we'll send you a link to reset your password.</p>
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
                            {/* Login */}
                            <button
                                className="rounded-xl bg-terp-red hover:bg-terp-darkred font-medium text-white py-2 px-4 rounded-lg cursor-pointer mb-5"
                                type="submit"
                            >
                                Send reset link
                            </button>
                        </form>
                        {/* Link to LoginPage */}
                        <div className="flex gap-x-1">
                            <p className="font-light">Remember your password?</p>
                            <Link
                                to="/"
                                className="underline cursor-pointer text-terp-red hover:text-terp-darkred"
                            >Login</Link>
                        </div>
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