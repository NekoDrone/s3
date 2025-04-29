"use client";

import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { LucideChevronLeft } from "@/components/Icons/LucideChevronLeft";
import { LucideChevronRight } from "@/components/Icons/LucideChevronRight";
import { Dispatch, FC, SetStateAction } from "react";

export interface CalendarProps {
    selected: Date | undefined;
    setSelected: Dispatch<SetStateAction<Date | undefined>>;
}
export const Calendar: FC<CalendarProps> = ({ selected, setSelected }) => {
    const defaultClasses = getDefaultClassNames();
    return (
        <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            required
            showOutsideDays={true}
            components={{
                PreviousMonthButton: ({ className, ...props }) => (
                    <button
                        {...props}
                        className={`${className} h-4 w-4 flex justify-center items-center`}
                    >
                        <LucideChevronLeft />
                    </button>
                ),
                NextMonthButton: ({ className, ...props }) => (
                    <button
                        {...props}
                        className={`${className} h-4 w-4 flex justify-center items-center`}
                    >
                        <LucideChevronRight />
                    </button>
                ),
            }}
            className="bg-ctp-surface-0 rounded-2xl p-4 pb-6 outline-2 outline-ctp-mauve"
            classNames={{
                button_previous:
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 top-0 transition text-ctp-blue",
                button_next:
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 top-0 transition text-ctp-blue",
                nav: "flex items-center w-auto h-fit relative",
                root: `${defaultClasses.root}`,
                month: "flex flex-col items-center gap-4",
                month_grid: "w-full grid gap-2",
                week: "grid grid-cols-7 gap-4",
                weeks: "flex flex-col gap-4",
                weekdays: "grid grid-cols-7 gap-4 text-ctp-mauve",
                day: "text-center rounded-full hover:bg-ctp-overlay-0 aria-selected:bg-ctp-green transition",
                selected: "text-ctp-crust transition",
                outside:
                    "text-muted-foreground opacity-40 hover:bg-transparent",
                day_button: "w-full h-full",
                today: "bg-ctp-pink text-ctp-crust",
            }}
        />
    );
};
