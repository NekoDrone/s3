"use client";

import "./globals.css";
import { FC, ReactNode } from "react";
import { lexend } from "@/styles/font";

export interface LayoutProps {
    children: ReactNode;
}

const RootLayout: FC<LayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width" />
                <title>Serenity&apos;s Skeet Scheduler</title>
            </head>
            <body
                className={`${lexend.className} antialiased bg-ctp-crust text-ctp-text`}
            >
                {children}
            </body>
        </html>
    );
};

export default RootLayout;
