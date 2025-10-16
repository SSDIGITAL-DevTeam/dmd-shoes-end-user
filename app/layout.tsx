import "./global.css";
import {
    inter, assistant, lato, poppins, plusJakartaSans,
} from "@/config/font";

export const metadata = {
    title: "DMD ShoeParts Manufacturing",
    description: "E-commerce sepatu by DMD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id">
            <body
                className={[
                    inter.className,
                    assistant.variable,
                    lato.variable,
                    poppins.variable,
                    plusJakartaSans.variable,
                    "antialiased min-h-screen bg-[var(--surface)] text-[var(--text-primary)]",
                ].join(" ")}
            >
                {children}
            </body>
        </html>
    );
}
