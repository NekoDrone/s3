"use client";

import { LucidePlus } from "@/components/Icons/LucidePlus";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, FC, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Calendar } from "@/components/DateTime/Calendar";
import { TimePicker } from "@/components/DateTime/TimePicker";
import { PostContent } from "@/components/Home/PostContent";
import { LucideCheck } from "@/components/Icons/LucideCheck";
import {
    timeStringToDateSpecified,
    timeStringToDateToday,
} from "@/functions/dates";
import { SchedulePostOpts } from "@/app/api/posts/schedule/route";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserData } from "@/entities/types/client";
import { redirect, RedirectType } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    const userData = useLocalStorage<UserData>("userData")[0];

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);

    const startDate = useMemo(() => new Date(), []);
    const currTime = useMemo(() => {
        const currHour = startDate.getHours().toString().padStart(2, "0");
        const currMins = startDate.getMinutes().toString().padStart(2, "0");
        return `${currHour}:${currMins}`;
    }, [startDate]);

    const [textContent, setTextContent] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date>(startDate);
    const [selectedTime, setSelectedTime] = useState(currTime);

    const [isPostReady, setIsPostReady] = useState(false);

    const queryClient = useQueryClient();

    useEffect(() => {
        const currTime = timeStringToDateToday(selectedTime);
        if (textContent != "" && currTime > startDate) {
            setIsPostReady(true);
        } else {
            setIsPostReady(false);
        }
    }, [textContent, selectedTime, startDate]);

    const handleBackdropClose = () => {
        setIsModalOpen(false);
    };

    useHotkeys("esc", handleBackdropClose);

    const scheduleNewPost = async () => {
        const postDate = timeStringToDateSpecified(selectedTime, selectedDate);
        const body: SchedulePostOpts = {
            postOn: postDate,
            postContent: textContent,
            identifier: userData.identifier,
        };
        const req = new Request("/api/posts/schedule", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        handleBackdropClose();
        await fetch(req);
    };

    const schedulePostMutation = useMutation({
        mutationFn: scheduleNewPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
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
                className="bg-ctp-surface-0 outline-ctp-overlay-0 z-10 flex flex-col gap-1 rounded-2xl p-4 outline-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
                <PostContent setContent={setTextContent} />
                <div className="bg-ctp-base outline-ctp-surface-2 flex gap-2 rounded-2xl p-3 outline-1">
                    <Calendar
                        selected={selectedDate}
                        setSelected={setSelectedDate}
                    />
                    <TimePicker setSelected={setSelectedTime} />
                </div>
            </motion.div>
            {isPostReady && (
                <motion.button
                    className="text-ctp-base from-ctp-tellow via-ctp-maroon to-ctp-pink z-0 flex items-center justify-center gap-2 rounded-4xl bg-gradient-to-br p-4 pt-3 pb-3"
                    onClick={() => {
                        schedulePostMutation.mutate();
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        type: "spring",
                        duration: 0.3,
                        bounce: 0.2,
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                >
                    <p>Schedule</p>
                    <LucideCheck />
                </motion.button>
            )}
        </div>
    );
};
