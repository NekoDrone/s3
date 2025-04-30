import { FC, MouseEventHandler, ReactNode, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserData } from "@/entities/types/client";
import { redirect, RedirectType } from "next/navigation";
import { LucideTrash2 } from "@/components/Icons/LucideTrash2";

interface ReadoutProps {
    children?: ReactNode;
    handleDeletionClick: MouseEventHandler<HTMLDivElement>;
    displayName: string;
}

export const ProfileReadoutWithChildren: FC<ReadoutProps> = ({
    children,
    handleDeletionClick,
    displayName,
}) => {
    const userData = useLocalStorage<UserData>("userData")[0];

    const [showDelete, setShowDelete] = useState(false);

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);

    const handleMouseEnter = () => {
        setShowDelete(true);
    };

    const handleMouseLeave = () => {
        setShowDelete(false);
    };

    return (
        <div>
            <div
                className="border-ctp-overlay-0 flex justify-between p-3 pb-2 not-first:border-t-1 first:border-t-0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex gap-3">
                    {userData.avatar && (
                        <img
                            alt="Avatar"
                            src={userData.avatar}
                            className="h-10 w-10 rounded-full"
                        ></img>
                    )}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <p className="font-normal">{displayName}</p>
                            <p className="text-ctp-overlay-0 text-xs">
                                @{userData.identifier}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
                <div
                    className={`text-ctp-red pt-1 ${showDelete ? "visible" : "invisible"}`}
                    onClick={handleDeletionClick}
                >
                    <LucideTrash2 />
                </div>
            </div>
        </div>
    );
};
