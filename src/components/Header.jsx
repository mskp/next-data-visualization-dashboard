import { Raleway } from "next/font/google";

const raleway = Raleway({ weight: "200", subsets: ["latin"] });

export default function Header() {
    return (
        <header className="border-b border-b-slate-500 select-none mb-4">
            <h1 className={`${raleway.className} bg-green-900 text-center text-xl p-4`}>
                Data Visualizaton Dashboard
            </h1>
        </header>
    )
}