"use client";

import { LucideAtSign } from "@/components/Icons/LucideAtSign";
import { LucideKeyRound } from "@/components/Icons/LucideKeyRound";
import { LucideCircleHelp } from "@/components/Icons/LucideCircleHelp";
import { LucideArrowRight } from "@/components/Icons/LucideArrowRight";
import { LucideEye } from "@/components/Icons/LucideEye";
import { Dispatch, FC, useState } from "react";
import { LucideEyeOff } from "@/components/Icons/LucideEyeOff";
import { LucideInfo } from "@/components/Icons/LucideInfo";
import { AnimatePresence, motion } from "motion/react";
import { LucideArrowRightLeft } from "@/components/Icons/LucideArrowRightLeft";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserData } from "@/entities/types/client";
import { ApiResponse, LoginResponse } from "@/entities/types/responses";
import { redirect, RedirectType } from "next/navigation";
import { agent } from "@/functions/atproto";
import { LoginOpts } from "@/entities/types/api";

export const Login = () => {
    const [showAppPassword, setShowAppPassword] = useState(false);

    const setUserData = useLocalStorage<UserData>("userData")[1];

    const handleLogin = async (formData: FormData) => {
        const identifier = String(formData.get("username"));
        const appPassword = String(formData.get("appPassword"));
        const password = String(formData.get("password"));

        if (password && appPassword == "null") {
            const loginBody: LoginOpts = {
                identifier,
                password,
            };

            const loginReq = new Request("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(loginBody),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const res: ApiResponse = await (await fetch(loginReq)).json();
            if (res.data) {
                const data = res.data as LoginResponse;
                setUserData({
                    identifier,
                    appPassword: data.appPassword,
                    avatar: data.avatarUri,
                    did: data.did,
                });
            }
        }

        if (appPassword != "null") {
            await agent.login({
                identifier,
                password: appPassword,
            });

            const did = (await agent.resolveHandle({ handle: identifier })).data
                .did;
            const avatarUri = (await agent.getProfile({ actor: did })).data
                .avatar;
            setUserData({ identifier, appPassword, avatar: avatarUri, did });
        }

        redirect("/home", RedirectType.push);
    };

    return (
        <form className="flex flex-col gap-2" action={handleLogin}>
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
            <div className="flex">
                {showAppPassword ? (
                    <AppPasswordInput
                        setShowAppPassword={setShowAppPassword}
                        showAppPassword={showAppPassword}
                    />
                ) : (
                    <PasswordInput
                        setShowAppPassword={setShowAppPassword}
                        showAppPassword={showAppPassword}
                    />
                )}
            </div>

            <motion.button
                className="from-ctp-pink via-ctp-lavender to-ctp-mauve text-ctp-crust group flex h-8 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br text-sm hover:underline"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                type="submit"
            >
                <p>Sign in</p>
                <LucideArrowRight />
            </motion.button>
        </form>
    );
};

interface InputProps {
    setShowAppPassword: Dispatch<boolean>;
    showAppPassword: boolean;
}

const AppPasswordInput: FC<InputProps> = ({
    setShowAppPassword,
    showAppPassword,
}) => {
    const [isAppPasswordVisible, setIsAppPasswordVisible] = useState(false);
    const [isAppPassTooltipVisible, setIsAppPassTooltipVisible] =
        useState(false);

    const handleAppPasswordVisibleToggle = () => {
        setIsAppPasswordVisible(!isAppPasswordVisible);
    };

    const handleAppPassTooltipToggle = () => {
        setIsAppPassTooltipVisible(!isAppPassTooltipVisible);
    };

    const handleToggleShowAppPassword = () => {
        setShowAppPassword(!showAppPassword);
    };

    return (
        <div className="flex h-fit flex-col gap-0.5 align-middle text-sm font-light">
            <p className="">App Password</p>
            <div className="bg-ctp-crust flex items-center gap-2 rounded-2xl p-2 pr-4 pl-3">
                <LucideKeyRound className="text-ctp-mauve" />
                <input
                    type={isAppPasswordVisible ? "text" : "password"}
                    id="login-app-password"
                    name="appPassword"
                    placeholder="a1b2-c3d4-e5f6-g7h8"
                    className="focus:outline-0"
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
                <motion.div
                    onClick={handleToggleShowAppPassword}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ y: 2 }}
                >
                    <LucideArrowRightLeft className="text-ctp-pink" />
                </motion.div>
                <div className="relative">
                    <motion.div
                        onClick={handleAppPassTooltipToggle}
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ y: 1 }}
                    >
                        <LucideCircleHelp className="text-ctp-mauve h-4 w-4 cursor-help" />
                    </motion.div>
                    <AnimatePresence initial={false}>
                        {isAppPassTooltipVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="bg-ctp-mantle outline-ctp-mauve absolute -top-2 left-6 flex h-fit w-96 flex-col gap-2 rounded-2xl p-4 outline-1"
                            >
                                <LucideInfo />
                                <p>
                                    If you&#39;ve set a password, press{" "}
                                    <span className="text-ctp-mauve inline-block align-middle">
                                        <LucideArrowRightLeft />
                                    </span>{" "}
                                    to sign in using that.
                                </p>
                                <p>
                                    If you&#39;ve not, and you&#39;ve forgotten
                                    your App Password, please contact me at{" "}
                                    <a
                                        href="https://bsky.app/profile/sylfr.dev"
                                        className="hover:text-ctp-blue underline"
                                    >
                                        my Bluesky
                                    </a>
                                    .
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const PasswordInput: FC<InputProps> = ({
    setShowAppPassword,
    showAppPassword,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordTooltipVisible, setIsPasswordTooltipVisible] =
        useState(false);

    const handlePasswordVisibleToggle = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handlePasswordTooltipToggle = () => {
        setIsPasswordTooltipVisible(!isPasswordTooltipVisible);
    };

    const handleToggleShowAppPassword = () => {
        setShowAppPassword(!showAppPassword);
    };

    return (
        <div className="flex h-fit flex-col gap-0.5 align-middle text-sm font-light">
            <p className="">Password</p>
            <div className="bg-ctp-crust flex items-center gap-2 rounded-2xl p-2 pr-4 pl-3">
                <LucideKeyRound className="text-ctp-pink" />
                <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="login-password"
                    name="password"
                    placeholder="**********"
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
                <motion.div
                    onClick={handleToggleShowAppPassword}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ y: 2 }}
                >
                    <LucideArrowRightLeft className="text-ctp-mauve" />
                </motion.div>
                <div className="relative">
                    <motion.div
                        onClick={handlePasswordTooltipToggle}
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ y: 1 }}
                    >
                        <LucideCircleHelp className="text-ctp-mauve h-4 w-4 cursor-help" />
                    </motion.div>
                    <AnimatePresence initial={false}>
                        {isPasswordTooltipVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="bg-ctp-mantle outline-ctp-mauve absolute -top-2 left-6 flex h-fit w-96 flex-col gap-2 rounded-2xl p-4 outline-1"
                            >
                                <LucideInfo />
                                <p>
                                    If you&#39;ve not set a password, press{" "}
                                    <span className="text-ctp-mauve inline-block align-middle">
                                        <LucideArrowRightLeft />
                                    </span>{" "}
                                    to sign in using an App Password.
                                </p>
                                <p>
                                    If you&#39;ve forgotten your App Password,
                                    please contact me at{" "}
                                    <a
                                        href="https://bsky.app/profile/sylfr.dev"
                                        className="hover:text-ctp-blue underline"
                                    >
                                        my Bluesky
                                    </a>
                                    .
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
