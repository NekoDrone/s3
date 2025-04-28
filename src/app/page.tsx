import { Login } from "@/components/Auth/Login";
import { Footer } from "@/components/HomePage/Footer";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ctp-mantle gap-8">
            <div className="flex flex-col items-center">
                <p className="text-2xl font-medium">
                    Serenity&#39;s Skeet Scheduler
                </p>
                <p className="font-light text-sm">
                    Schedule your Skeets with Serenity :D
                </p>
            </div>
            <div className="outline-ctp-mauve outline-1 p-8 rounded-2xl flex flex-col justify-center items-center gap-4">
                <Login />
                <p>Don&#39;t have an account?</p>
            </div>
            <Footer />
        </div>
    );
}
