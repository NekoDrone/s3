"use client";

import { LucidePlus } from "@/components/Icons/LucidePlus";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, FC, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Calendar } from "@/components/DateTime/Calendar";

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
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    const handleBackdropClose = () => {
        setIsModalOpen(false);
    };

    useHotkeys("esc", () => {
        handleBackdropClose();
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleBackdropClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            />
            <motion.div
                className="z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
                <Calendar
                    selected={selectedDate}
                    setSelected={setSelectedDate}
                />
            </motion.div>
        </div>
    );
};
