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

export const Login = () => {
    const [showAppPassword, setShowAppPassword] = useState(false);

    const handleLogin = (formData: FormData) => {
        const username = formData.get("username");
        const appPassword = formData.get("appPassword");
        const password = formData.get("password");
    };

    return (
        <form className="flex flex-col gap-2" action={handleLogin}>
            <div className="font-light text-sm flex flex-col align-middle h-fit gap-0.5">
                <p className="">Handle</p>
                <div className="rounded-2xl bg-ctp-crust pl-3 pr-4 p-2 flex items-center gap-2">
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
                className="text-sm rounded-2xl h-8 bg-gradient-to-br from-ctp-pink via-ctp-lavender to-ctp-mauve text-ctp-crust flex items-center justify-center gap-2 hover:underline group"
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
        <div className="font-light text-sm flex flex-col align-middle h-fit gap-0.5">
            <p className="">App Password</p>
            <div className="rounded-2xl bg-ctp-crust pl-3 pr-4 p-2 flex items-center gap-2">
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
                        <LucideEyeOff className="w-4 h-4" />
                    ) : (
                        <LucideEye className="w-4 h-4" />
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
                    <motion.button
                        onClick={handleAppPassTooltipToggle}
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ y: 1 }}
                    >
                        <LucideCircleHelp className="text-ctp-mauve w-4 h-4 cursor-help" />
                    </motion.button>
                    <AnimatePresence initial={false}>
                        {isAppPassTooltipVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-2 left-6 bg-ctp-mantle outline-ctp-mauve outline-1 rounded-2xl h-fit w-96 p-4 flex flex-col gap-2"
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
                                        href="https://serenity.tgirl.gay/"
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
        <div className="font-light text-sm flex flex-col align-middle h-fit gap-0.5">
            <p className="">Password</p>
            <div className="rounded-2xl bg-ctp-crust pl-3 pr-4 p-2 flex items-center gap-2">
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
                        <LucideEyeOff className="w-4 h-4" />
                    ) : (
                        <LucideEye className="w-4 h-4" />
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
                    <motion.button
                        onClick={handlePasswordTooltipToggle}
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ y: 1 }}
                    >
                        <LucideCircleHelp className="text-ctp-mauve w-4 h-4 cursor-help" />
                    </motion.button>
                    <AnimatePresence initial={false}>
                        {isPasswordTooltipVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-2 left-6 bg-ctp-mantle outline-ctp-mauve outline-1 rounded-2xl h-fit w-96 p-4 flex flex-col gap-2"
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
                                        href="https://serenity.tgirl.gay/"
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
