"use client";

import "./globals.css";
import { FC, ReactNode } from "react";
import { lexend } from "@/styles/font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export interface LayoutProps {
    children: ReactNode;
}

const RootLayout: FC<LayoutProps> = ({ children }) => {
    const reactQuery = new QueryClient();

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width" />
                <title>Serenity&apos;s Skeet Scheduler</title>
            </head>
            <body
                className={`${lexend.className} antialiased bg-ctp-crust text-ctp-text font-light`}
            >
                <QueryClientProvider client={reactQuery}>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </body>
        </html>
    );
};

export default RootLayout;
