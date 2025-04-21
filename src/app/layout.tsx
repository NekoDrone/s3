"use client";

import "./globals.css";
import { ReactNode } from "react";
import { lexend } from "@/styles/font";

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
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
}
