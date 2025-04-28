"use client";

import { LucideAtSign } from "@/components/Icons/LucideAtSign";
import { LucideKeyRound } from "@/components/Icons/LucideKeyRound";
import { LucideCircleHelp } from "@/components/Icons/LucideCircleHelp";
import { LucideArrowRight } from "@/components/Icons/LucideArrowRight";
import { LucideEye } from "@/components/Icons/LucideEye";
import { useState } from "react";
import { LucideEyeOff } from "@/components/Icons/LucideEyeOff";

export const Login = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isAppPasswordVisible, setIsAppPasswordVisible] = useState(false);

    const handlePasswordVisibleToggle = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleAppPasswordVisibleToggle = () => {
        setIsAppPasswordVisible(!isAppPasswordVisible);
    };

    return (
        <form className="flex flex-col gap-2">
            <div className="font-light text-sm flex flex-col align-middle h-fit gap-0.5">
                <p className="">Handle</p>
                <div className="rounded-2xl bg-ctp-crust pl-3 pr-4 p-2 flex items-center gap-2">
                    <LucideAtSign className="text-ctp-blue" />
                    <input
                        type="text"
                        id="login-username"
                        required
                        placeholder="username.bsky.social"
                        className="focus:outline-0"
                    />
                </div>
            </div>
            <div className="font-light text-sm flex flex-col align-middle h-fit gap-0.5">
                <p className="">App Password</p>
                <div className="rounded-2xl bg-ctp-crust pl-3 pr-4 p-2 flex items-center gap-2">
                    <LucideKeyRound className="text-ctp-green" />
                    <input
                        type={isAppPasswordVisible ? "text" : "password"}
                        id="login-app-password"
                        required
                        placeholder="a1b2-c3d4-e5f6-g7h8"
                        className="focus:outline-0"
                    />
                    <div onClick={handleAppPasswordVisibleToggle}>
                        {isAppPasswordVisible ? (
                            <LucideEyeOff className="w-4 h-4" />
                        ) : (
                            <LucideEye className="w-4 h-4" />
                        )}
                    </div>
                    <a href="https://bsky.app/settings/app-passwords">
                        <LucideCircleHelp className="text-ctp-mauve w-4 h-4" />
                    </a>
                </div>
            </div>
            <div className="font-light text-sm flex flex-col align-middle h-fit gap-0.5">
                <p className="">Password (optional)</p>
                <div className="rounded-2xl bg-ctp-crust pl-3 pr-4 p-2 flex items-center gap-2">
                    <LucideKeyRound className="text-ctp-green" />
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="login-app-password"
                        required
                        placeholder="a1b2-c3d4-e5f6-g7h8"
                        className="focus:outline-0"
                    />
                    <div onClick={handlePasswordVisibleToggle}>
                        {isPasswordVisible ? (
                            <LucideEyeOff className="w-4 h-4" />
                        ) : (
                            <LucideEye className="w-4 h-4" />
                        )}
                    </div>
                    <a href="https://bsky.app/settings/app-passwords">
                        <LucideCircleHelp className="text-ctp-mauve w-4 h-4" />
                    </a>
                </div>
            </div>

            <button className="text-sm rounded-2xl h-8 bg-gradient-to-br from-ctp-pink via-ctp-lavender to-ctp-mauve text-ctp-crust flex items-center justify-center gap-2 hover:underline group">
                <p>Sign in</p>
                <LucideArrowRight />
            </button>
        </form>
    );
};
