import { LucideGithub } from "@/components/Icons/LucideGithub";

export const Footer = () => {
    return (
        <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
                <p className="text-sm font-light">Built with 💜 by</p>
                <a
                    className="hover:text-ctp-lavender text-sm font-light underline"
                    href="https://serenity.tgirl.gay"
                >
                    Serenity
                </a>
            </div>
            <p>•</p>
            <div>
                <a
                    href="https://github.com/NekoDrone/s3"
                    className="hover:text-ctp-lavender text-lg underline"
                >
                    <LucideGithub />
                </a>
            </div>
        </div>
    );
};
