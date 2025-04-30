"use client";

import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { LucideClock } from "@/components/Icons/LucideClock";

interface PickerProps {
    setSelected: Dispatch<SetStateAction<string>>;
}

export const TimePicker: FC<PickerProps> = ({ setSelected }) => {
    const now = new Date();
    const [currHour, setCurrHour] = useState(
        now.getHours().toString().padStart(2, "0"),
    );
    const [currMinute, setCurrMinute] = useState(
        now.getMinutes().toString().padStart(2, "0"),
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const newTime = val.split(":");

        const newHour = newTime[0] ?? "";
        setCurrHour(newHour.padStart(2, "0"));

        const newMinute = newTime[1] ?? "";
        setCurrMinute(newMinute.padStart(2, "0"));
        setSelected(`${newHour ?? "00"}:${newMinute ?? "00"}`);
    };

    return (
        <div className="flex items-center gap-2">
            <p>at</p>
            <input
                defaultValue={`${currHour}:${currMinute}`}
                onChange={handleChange}
                type="time"
                className="bg-ctp-crust rounded p-1 pr-1.5 pl-1.5 focus:outline-0"
            />
            <LucideClock className="text-ctp-green" />
        </div>
    );
};
