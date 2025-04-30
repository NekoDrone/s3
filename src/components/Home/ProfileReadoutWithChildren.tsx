import { FC, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserData } from "@/entities/types/client";
import { agent } from "@/functions/atproto";
import { useQuery } from "@tanstack/react-query";
import { redirect, RedirectType } from "next/navigation";
import { Loading } from "@/components/Misc/Loading";

interface ReadoutProps {
    children?: ReactNode;
}

export const ProfileReadoutWithChildren: FC<ReadoutProps> = ({ children }) => {
    const [userData, setUserData] = useLocalStorage<UserData>("userData");

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);

    const getDisplayName = async () => {
        const { identifier, appPassword, did } = userData;
        await agent.login({
            identifier,
            password: appPassword,
        });
        return (
            (await agent.getProfile({ actor: did })).data.displayName ??
            identifier
        );
    };

    const {
        data: displayName,
        isFetched: isDisplayNameFetched,
        isPending,
    } = useQuery({
        queryFn: getDisplayName,
        queryKey: ["displayName"],
    });

    return (
        <div>
            {isPending ? (
                <Loading />
            ) : (
                <div className="border-ctp-overlay-0 flex gap-3 p-3 pb-2 not-first:border-t-1 first:border-t-0">
                    {userData.avatar && (
                        <img
                            alt="Avatar"
                            src={userData.avatar}
                            className="h-10 w-10 rounded-full"
                        ></img>
                    )}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            {displayName && isDisplayNameFetched && (
                                <p className="font-normal">{displayName}</p>
                            )}
                            <p className="text-ctp-overlay-0 text-xs">
                                @{userData.identifier}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};
