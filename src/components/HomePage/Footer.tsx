import Image from "next/image";

export const Footer = () => {
    return (
        <div className="flex gap-1 pt-4">
            <p className="text-sm font-light">Built with</p>
            <Image
                src="https://emoji.lgbt/assets/svg/lesbian-heart.svg"
                alt="Lesbian heart!"
                width="16"
                height="16"
            />
            <Image
                src="https://emoji.lgbt/assets/svg/trans-heart.svg"
                alt="Trans heart!"
                width="16"
                height="16"
            />
            <Image
                src="https://emoji.lgbt/assets/svg/gay-heart.svg"
                alt="Gay heart!"
                width="16"
                height="16"
            />
            <p className="text-sm font-light">by </p>
            <a
                className="text-sm font-light text-ctp-lavender underline"
                href="https://serenity.tgirl.gay"
            >
                Serenity
            </a>
        </div>
    );
};
