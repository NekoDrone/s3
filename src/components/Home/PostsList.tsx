import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { DeletePostOpts } from "@/app/api/posts/delete/route";
import { agent } from "@/functions/atproto";

export const PostsList = () => {
    const userData = useLocalStorage<UserData>("userData")[0];

    if (!userData || !userData.appPassword || !userData.identifier)
        redirect("/", RedirectType.replace);

    const queryClient = useQueryClient();

    const getPosts = async () => {
        const { identifier } = userData;
        const req = new Request(`/api/posts/list?identifier=${identifier}`);
        const { data } = (await (await fetch(req)).json()) as ApiResponse;
        return data as PostsResponse;
    };

    const {
        data: posts,
        isFetched: isPostsFetched,
        isPending: isPostsPending,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    const deletePost = async (id: number, account: number) => {
        const body: DeletePostOpts = {
            id,
            account,
        };
        const req = new Request("/api/posts/delete", {
            method: "DELETE",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        await fetch(req);
    };

    const deletePostMutation = useMutation({
        mutationFn: (opts: { id: number; account: number }) => {
            const { id, account } = opts;
            return deletePost(id, account);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });
        },
    });

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

    const { data: displayName, isPending: isDisplayNamePending } = useQuery({
        queryFn: getDisplayName,
        queryKey: ["displayName"],
    });

    return (
        <div>
            <Suspense fallback={<Loading />}>
                <div className="border-ctp-overlay-0 flex flex-col justify-center gap-0 rounded-4xl border-1 p-4 pt-2">
                    {isPostsPending || (isDisplayNamePending && <Loading />)}
                    {posts &&
                        isPostsFetched &&
                        posts.map((post) => {
                            return (
                                <div key={post.id}>
                                    {displayName && (
                                        <ProfileReadoutWithChildren
                                            handleDeletionClick={() => {
                                                deletePostMutation.mutate({
                                                    id: post.id,
                                                    account: post.account,
                                                });
                                            }}
                                            displayName={displayName}
                                        >
                                            <p className="flex items-center gap-1 text-sm">
                                                <span className="text-ctp-mauve">
                                                    <LucideCalendar />
                                                </span>
                                                {format(
                                                    post.postOn,
                                                    "do LLLL yyyy",
                                                    {
                                                        locale: enGB,
                                                    },
                                                )}{" "}
                                                <span className="text-ctp-green">
                                                    <LucideClock />
                                                </span>
                                                {format(
                                                    post.postOn,
                                                    "hh:mm aaa",
                                                    {
                                                        locale: enGB,
                                                    },
                                                )}
                                            </p>
                                            <div className="flex flex-col gap-1">
                                                <p className="w-96">
                                                    {post.postContent}
                                                </p>
                                            </div>
                                        </ProfileReadoutWithChildren>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </Suspense>
        </div>
    );
};
