"use client";

import { LucidePlus } from "@/components/Icons/LucidePlus";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, FC, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Calendar } from "@/components/DateTime/Calendar";
import { TimePicker } from "@/components/DateTime/TimePicker";
import { PostContent } from "@/components/Home/PostContent";
import { LucideCheck } from "@/components/Icons/LucideCheck";

export const SchedulePost = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    useHotkeys("n", () => {
        handleModalOpen();
    });

    return (
        <div>
            <motion.button
                className="from-ctp-green via-ctp-blue to-ctp-mauve text-ctp-crust flex items-center gap-2 rounded-4xl bg-gradient-to-tr p-3 pr-5 pl-5"
                onClick={handleModalOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <LucidePlus className="text-lg" />
                <p className="pr-8">Schedule a skeet </p>
                <div className="bg-ctp-surface-2/20 text-ctp-base flex items-center justify-center rounded-sm p-1 pt-0 pb-0">
                    N
                </div>
            </motion.button>
            <AnimatePresence initial={false}>
                {isModalOpen && (
                    <SchedulePostModal setIsModalOpen={setIsModalOpen} />
                )}
            </AnimatePresence>
        </div>
    );
};

interface ModalProps {
    setIsModalOpen: Dispatch<boolean>;
}

const SchedulePostModal: FC<ModalProps> = ({ setIsModalOpen }) => {
    const currDate = useMemo(() => new Date(), []);
    const [textContent, setTextContent] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date>(currDate);
    const [selectedTime, setSelectedTime] = useState("00:00");
    const [isPostReady, setIsPostReady] = useState(false);

    useEffect(() => {
        console.log("rerendering due to change");
        if (textContent != "" && selectedTime != "00:00") {
            setIsPostReady(true);
        } else {
            setIsPostReady(false);
        }
    }, [textContent, selectedTime, currDate]);

    const handleBackdropClose = () => {
        setIsModalOpen(false);
    };

    useHotkeys("esc", () => {
        handleBackdropClose();
    });

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2">
            <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleBackdropClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            />
            <motion.div
                className="bg-ctp-surface-0 z-10 flex flex-col gap-1 rounded-2xl p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
                <PostContent setContent={setTextContent} />
                <div className="bg-ctp-base flex gap-2 rounded-2xl p-4">
                    <Calendar
                        selected={selectedDate}
                        setSelected={setSelectedDate}
                    />
                    <TimePicker setSelected={setSelectedTime} />
                </div>
            </motion.div>
            <AnimatePresence initial={false}>
                {isPostReady && (
                    <motion.div
                        className="from-ctp-tellow via-ctp-maroon to-ctp-pink z-0 flex flex-col gap-1 rounded-4xl bg-gradient-to-br p-4 pt-3 pb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: "tween",
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                    >
                        <button className="text-ctp-base flex items-center justify-center gap-2">
                            <p>Schedule</p>
                            <LucideCheck />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
