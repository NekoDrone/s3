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

export const ProfileReadout: FC<ReadoutProps> = ({ children }) => {
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
                <div className="flex items-center gap-4">
                    {userData.avatar && (
                        <img
                            alt="Avatar"
                            src={userData.avatar}
                            className="h-16 w-16 rounded-full"
                        ></img>
                    )}
                    <div>
                        {displayName && isDisplayNameFetched && (
                            <p className="text-lg font-medium">{displayName}</p>
                        )}
                        <p className="text-ctp-overlay-0 text-sm">
                            @{userData.identifier}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
