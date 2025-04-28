"use client";

import { Login } from "@/components/Auth/Login";
import { Footer } from "@/components/HomePage/Footer";
import { Register } from "@/components/Auth/Register";
import { Dispatch, FC, useState } from "react";
import { motion } from "motion/react";

export default function Home() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ctp-base gap-8">
            <div className="flex flex-col items-center">
                <p className="text-2xl font-medium">
                    Serenity&#39;s Skeet Scheduler
                </p>
                <p className="font-light text-sm">
                    Schedule your Skeets with Serenity :D
                </p>
            </div>
            <div
                className={`${showLogin ? "outline-ctp-mauve" : "outline-ctp-green"} outline-1 p-8 pt-7 pb-7 rounded-2xl flex flex-col justify-center items-center gap-2`}
            >
                {showLogin ? <Login /> : <Register />}
                <div className="text-sm pt-2 flex flex-col gap-2 items-center">
                    {showLogin ? (
                        <p>Don&#39;t have an account?</p>
                    ) : (
                        <p>Already have an account?</p>
                    )}
                    <LoginRegisterToggle
                        setShowLogin={setShowLogin}
                        showLogin={showLogin}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

interface ToggleProps {
    showLogin: boolean;
    setShowLogin: Dispatch<boolean>;
}

const LoginRegisterToggle: FC<ToggleProps> = ({ showLogin, setShowLogin }) => {
    const registerGradient =
        "bg-gradient-to-tl from-ctp-green via-ctp-sky to-ctp-blue";

    const loginGradient =
        "bg-gradient-to-br from-ctp-pink via-ctp-lavender to-ctp-mauve";

    const registerPosition = "justify-start";

    const loginPosition = "justify-end";

    const handleToggle = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="grid grid-cols-3 gap-2 text-sm items-center">
            <div>
                <p>Register</p>
            </div>
            <div className="flex justify-center">
                <motion.button
                    onClick={handleToggle}
                    className={`rounded-3xl bg-ctp-overlay-0 p-1 flex w-11 ${showLogin ? loginPosition : registerPosition}`}
                >
                    <motion.span
                        className={`rounded-full h-4 w-4 ${showLogin ? loginGradient : registerGradient}`}
                        layout="position"
                        transition={{
                            type: "spring",
                            duration: 0.3,
                            bounce: 0.5,
                        }}
                    ></motion.span>
                </motion.button>
            </div>
            <div>
                <p>Login</p>
            </div>
        </div>
    );
};
