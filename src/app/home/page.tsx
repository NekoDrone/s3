"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { redirect, RedirectType } from "next/navigation";
import { UserData } from "@/entities/types/client";
import { SchedulePost } from "@/components/Home/SchedulePost";
import { Footer } from "@/components/Misc/Footer";

const Home = () => {
    const userData = useLocalStorage<UserData>("userData")[0];

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);

    return (
        <div className="bg-ctp-base flex min-h-screen flex-col items-center justify-center gap-8">
            <p>S3</p>
            <p>Your scheduled skeets</p>
            <SchedulePost />
            <Footer />
        </div>
    );
};

export default Home;
