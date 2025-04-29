"use client";

import { Login } from "@/components/Auth/Login";
import { Footer } from "@/components/Misc/Footer";
import { Register } from "@/components/Auth/Register";
import { Dispatch, FC, useState } from "react";
import { motion } from "motion/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { redirect, RedirectType } from "next/navigation";
import { UserData } from "@/entities/types/client";

export default function Index() {
    const [showLogin, setShowLogin] = useState(false);
    const userData = useLocalStorage<UserData>("userData")[0];

    if (userData && userData.identifier && userData.appPassword) {
        redirect("/home", RedirectType.replace);
    }

    return (
        <div className="bg-ctp-base flex min-h-screen flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center">
                <p className="text-2xl font-medium">
                    Serenity&#39;s Skeet Scheduler
                </p>
                <p className="text-sm font-light">
                    Schedule your Skeets with Serenity :D
                </p>
            </div>
            <div
                className={`${showLogin ? "outline-ctp-mauve" : "outline-ctp-green"} flex flex-col items-center justify-center gap-2 rounded-2xl p-8 pt-7 pb-7 outline-1`}
            >
                {showLogin ? <Login /> : <Register />}
                <div className="flex flex-col items-center gap-2 pt-2 text-sm">
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
        <div className="grid grid-cols-3 items-center gap-2 text-sm">
            <div>
                <p>Register</p>
            </div>
            <div className="flex justify-center">
                <motion.button
                    onClick={handleToggle}
                    className={`bg-ctp-overlay-0 flex w-11 rounded-3xl p-1 ${showLogin ? loginPosition : registerPosition}`}
                >
                    <motion.span
                        className={`h-4 w-4 rounded-full ${showLogin ? loginGradient : registerGradient}`}
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
