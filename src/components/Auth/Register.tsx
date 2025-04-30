"use client";

import { LucideAtSign } from "@/components/Icons/LucideAtSign";
import { LucideKeyRound } from "@/components/Icons/LucideKeyRound";
import { LucideCircleHelp } from "@/components/Icons/LucideCircleHelp";
import { LucideArrowRight } from "@/components/Icons/LucideArrowRight";
import { LucideEye } from "@/components/Icons/LucideEye";
import { useState } from "react";
import { LucideEyeOff } from "@/components/Icons/LucideEyeOff";
import { LucideInfo } from "@/components/Icons/LucideInfo";
import { AnimatePresence, motion } from "motion/react";
import { RegisterOpts } from "@/app/api/auth/register/route";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserData } from "@/entities/types/client";
import { redirect, RedirectType } from "next/navigation";
import { ApiResponse, RegisterResponse } from "@/entities/types/responses";

export const Register = () => {
    const [isAppPasswordVisible, setIsAppPasswordVisible] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordTooltipVisible, setIsPasswordTooltipVisible] =
        useState(false);

    const handleAppPasswordVisibleToggle = () => {
        setIsAppPasswordVisible(!isAppPasswordVisible);
    };

    const handlePasswordVisibleToggle = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handlePasswordTooltipToggle = () => {
        setIsPasswordTooltipVisible(!isPasswordTooltipVisible);
    };

    const setUserData = useLocalStorage<UserData>("userData")[1];

    const handleRegister = async (formData: FormData) => {
        const identifier = String(formData.get("username"));
        const appPassword = String(formData.get("appPassword"));
        const password = String(formData.get("password"));

        const registerBody: RegisterOpts = {
            identifier,
            appPassword,
            password,
        };

        const registerReq = new Request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(registerBody),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const res: ApiResponse = await (await fetch(registerReq)).json();
        if (res.data && "id" in res.data) {
            const data: RegisterResponse = res.data;
            setUserData({
                identifier,
                appPassword,
                avatar: data.avatarUri,
                did: data.did,
            });
            redirect("/home", RedirectType.push);
        }
    };

    return (
        <form className="flex flex-col gap-2" action={handleRegister}>
            <div className="flex h-fit flex-col gap-0.5 align-middle text-sm font-light">
                <p className="">Handle</p>
                <div className="bg-ctp-crust flex items-center gap-2 rounded-2xl p-2 pr-4 pl-3">
                    <LucideAtSign className="text-ctp-blue" />
                    <input
                        type="text"
                        id="login-username"
                        name="username"
                        required
                        placeholder="username.bsky.social"
                        className="focus:outline-0"
                    />
                </div>
            </div>
            <div className="flex h-fit flex-col gap-0.5 align-middle text-sm font-light">
                <p className="">App Password</p>
                <div className="bg-ctp-crust flex items-center gap-2 rounded-2xl p-2 pr-4 pl-3">
                    <LucideKeyRound className="text-ctp-green" />
                    <input
                        type={isAppPasswordVisible ? "text" : "password"}
                        id="login-app-password"
                        name="appPassword"
                        placeholder="a1b2-c3d4-e5f6-g7h8"
                        className="focus:outline-0"
                        required
                    />
                    <motion.div
                        onClick={handleAppPasswordVisibleToggle}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ y: 2 }}
                    >
                        {isAppPasswordVisible ? (
                            <LucideEyeOff className="h-4 w-4" />
                        ) : (
                            <LucideEye className="h-4 w-4" />
                        )}
                    </motion.div>
                    <motion.a
                        href="https://bsky.app/settings/app-passwords"
                        target="_blank"
                        whileHover={{ scale: 1.05 }}
                    >
                        <LucideCircleHelp className="text-ctp-green h-4 w-4" />
                    </motion.a>
                </div>
            </div>
            <div className="flex h-fit flex-col gap-0.5 align-middle text-sm font-light">
                <p className="">Password (optional)</p>
                <div className="bg-ctp-crust flex items-center gap-2 rounded-2xl p-2 pr-4 pl-3">
                    <LucideKeyRound className="text-ctp-pink" />
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="login-password"
                        name="password"
                        placeholder="Optional password"
                        className="focus:outline-0"
                    />
                    <motion.div
                        onClick={handlePasswordVisibleToggle}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ y: 2 }}
                    >
                        {isPasswordVisible ? (
                            <LucideEyeOff className="h-4 w-4" />
                        ) : (
                            <LucideEye className="h-4 w-4" />
                        )}
                    </motion.div>
                    <div className="relative">
                        <motion.div
                            onClick={handlePasswordTooltipToggle}
                            className="flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ y: 1 }}
                        >
                            <LucideCircleHelp className="text-ctp-green h-4 w-4 cursor-help" />
                        </motion.div>
                        <AnimatePresence initial={false}>
                            {isPasswordTooltipVisible && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="bg-ctp-mantle outline-ctp-green absolute -top-2 left-6 flex h-fit w-96 flex-col gap-2 rounded-2xl p-4 outline-1"
                                >
                                    <LucideInfo />
                                    <p>
                                        You may <em>optionally</em> set a
                                        password to access this app again, since
                                        you cannot see an App Password provided
                                        by Bluesky after you&#39;ve closed the
                                        initial creation dialog.
                                    </p>
                                    <p>
                                        If you&#39;ve logged in before, either
                                        an App Password or the password
                                        you&#39;ve set will do :)
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <motion.button
                className="from-ctp-green via-ctp-sky to-ctp-blue text-ctp-crust group flex h-8 items-center justify-center gap-2 rounded-2xl bg-gradient-to-tl text-sm hover:underline"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                type="submit"
            >
                <p>Register</p>
                <LucideArrowRight />
            </motion.button>
        </form>
    );
};
