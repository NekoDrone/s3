"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { redirect, RedirectType } from "next/navigation";

const Home = () => {
    const appPasswordFromStorage = useLocalStorage<{ appPassword: string }>(
        "appPassword",
    )[0];

    if (!appPasswordFromStorage) redirect("/", RedirectType.replace);
    return <></>;
};

export default Home;
