import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserData } from "@/entities/types/client";
import { redirect, RedirectType } from "next/navigation";
import { ApiResponse, PostsResponse } from "@/entities/types/responses";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Suspense } from "react";
import { Loading } from "@/components/Misc/Loading";
import { ProfileReadoutWithChildren } from "@/components/Home/ProfileReadoutWithChildren";
import { LucideCalendar } from "@/components/Icons/LucideCalendar";
import { LucideClock } from "@/components/Icons/LucideClock";

export const PostsList = () => {
    const userData = useLocalStorage<UserData>("userData")[0];

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);

    const getPosts = async () => {
        const { identifier } = userData;
        const req = new Request(`/api/posts/list?identifier=${identifier}`);
        const { data } = (await (await fetch(req)).json()) as ApiResponse;
        return data as PostsResponse;
    };

    const {
        data: posts,
        isFetched: isPostsFetched,
        isPending,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    return (
        <div>
            <Suspense fallback={<Loading />}>
                <div className="border-ctp-overlay-0 flex flex-col justify-center gap-0 rounded-4xl border-1 p-4 pt-2">
                    {isPending && <Loading />}
                    {posts &&
                        isPostsFetched &&
                        posts.map((post) => {
                            return (
                                <ProfileReadoutWithChildren key={post.id}>
                                    <p className="flex items-center gap-1 text-sm">
                                        <span className="text-ctp-mauve">
                                            <LucideCalendar />
                                        </span>
                                        {format(post.postOn, "do LLLL yyyy", {
                                            locale: enGB,
                                        })}{" "}
                                        <span className="text-ctp-green">
                                            <LucideClock />
                                        </span>
                                        {format(post.postOn, "hh:mm aaa", {
                                            locale: enGB,
                                        })}
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        <p className="max-w-96">
                                            {post.postContent}
                                        </p>
                                    </div>
                                </ProfileReadoutWithChildren>
                            );
                        })}
                </div>
            </Suspense>
        </div>
    );
};
