"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { redirect, RedirectType } from "next/navigation";
import { UserData } from "@/entities/types/client";

const Home = () => {
    const userData = useLocalStorage<UserData>("userData")[0];

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);
    return <></>;
};

export default Home;
