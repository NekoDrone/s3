"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { LucideChevronLeft } from "@/components/Icons/LucideChevronLeft";
import { LucideChevronRight } from "@/components/Icons/LucideChevronRight";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { LucideCalendar } from "@/components/Icons/LucideCalendar";
import { AnimatePresence, motion } from "motion/react";

interface CalendarProps {
    selected: Date;
    setSelected: Dispatch<SetStateAction<Date>>;
}
export const Calendar: FC<CalendarProps> = ({ selected, setSelected }) => {
    const [showCalendar, setShowCalendar] = useState(false);

    const handleShowModal = () => {
        setShowCalendar(!showCalendar);
    };

    return (
        <div className="relative flex flex-col justify-between gap-2 rounded-2xl">
            <div className="flex items-center gap-2">
                <p>Post on</p>
                <button
                    className="bg-ctp-crust flex rounded p-1 pr-1.5 pl-1.5"
                    onClick={handleShowModal}
                >
                    <p className="w-5 text-center">
                        {selected?.getDate().toString().padStart(2, "0")}
                    </p>
                    /
                    <p className="w-5 text-center">
                        {selected &&
                            (selected.getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}
                    </p>
                    /
                    <p className="w-9 text-center">{selected?.getFullYear()}</p>
                </button>
                <button>
                    <LucideCalendar
                        className="text-ctp-mauve"
                        onClick={handleShowModal}
                    />
                </button>
            </div>
            <AnimatePresence initial={false}>
                {showCalendar && (
                    <div
                        className="fixed inset-0 z-0"
                        key="modal overlay"
                        onClick={handleShowModal}
                    ></div>
                )}
                {showCalendar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            type: "tween",
                            duration: 0.2,
                            ease: "easeIn",
                        }}
                        className="bg-ctp-surface-0 absolute top-8 z-10 w-74 rounded-2xl p-4 pb-6"
                    >
                        <DayPicker
                            mode="single"
                            selected={selected}
                            onSelect={setSelected}
                            required
                            showOutsideDays={true}
                            classNames={{
                                button_previous:
                                    "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 absolute left-1 top-0 transition text-ctp-blue",
                                button_next:
                                    "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 absolute right-1 top-0 transition text-ctp-blue",
                                nav: "flex items-center w-auto h-fit relative",
                                month: "flex flex-col items-center gap-4",
                                month_grid: "w-full grid gap-2",
                                week: "grid grid-cols-7 gap-4",
                                weeks: "flex flex-col gap-4",
                                weekdays:
                                    "grid grid-cols-7 gap-4 text-ctp-mauve",
                                day: "text-center rounded-full hover:bg-ctp-overlay-0 aria-selected:bg-ctp-green transition",
                                selected: "text-ctp-crust transition",
                                outside:
                                    "text-muted-foreground opacity-40 hover:bg-transparent",
                                day_button: "w-full h-full",
                                today: "bg-ctp-pink text-ctp-crust",
                                disabled:
                                    "text-muted-foreground opacity-40 hover:bg-transparent",
                            }}
                            components={{
                                PreviousMonthButton: ({
                                    className,
                                    ...props
                                }) => (
                                    <button
                                        {...props}
                                        className={`${className} flex h-4 w-4 items-center justify-center`}
                                    >
                                        <LucideChevronLeft />
                                    </button>
                                ),
                                NextMonthButton: ({ className, ...props }) => (
                                    <button
                                        {...props}
                                        className={`${className} flex h-4 w-4 items-center justify-center`}
                                    >
                                        <LucideChevronRight />
                                    </button>
                                ),
                            }}
                            disabled={{ before: new Date() }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
