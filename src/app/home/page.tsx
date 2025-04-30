"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { redirect, RedirectType } from "next/navigation";
import { UserData } from "@/entities/types/client";
import { SchedulePost } from "@/components/Home/SchedulePost";
import { Footer } from "@/components/Misc/Footer";
import { PostsList } from "@/components/Home/PostsList";
import { ProfileReadout } from "@/components/Home/ProfileReadout";

const Home = () => {
    const userData = useLocalStorage<UserData>("userData")[0];

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);

    return (
        <div className="bg-ctp-base flex min-h-screen flex-col items-center justify-center gap-8">
            <p className="text-lg font-medium">
                Serenity&#39;s Skeet Scheduler
            </p>
            <ProfileReadout />

            <PostsList />
            <SchedulePost />
            <Footer />
        </div>
    );
};

export default Home;
