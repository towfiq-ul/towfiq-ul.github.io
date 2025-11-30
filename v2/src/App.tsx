import {useState} from "react";
import Home from "./pages/Home";
import {Contact} from "./pages/Contact";
import {CV} from "./pages/CV";
import {Toaster} from "./components/ui/toaster/toaster";
import {useColorScheme} from "./hooks/use-color-scheme";

export default function App() {
    useColorScheme();
    const [currentPage, setCurrentPage] = useState<"home" | "contact" | "cv">("home");

    return (
        <>
            {currentPage === "home" ? (
                <Home
                    onNavigateToContact={() => setCurrentPage("contact")}
                    onNavigateToCV={() => setCurrentPage("cv")}
                />
            ) : currentPage === "contact" ? (
                <Contact onClose={() => setCurrentPage("home")}/>
            ) : (
                <CV onClose={() => setCurrentPage("home")}/>
            )}
            <Toaster/>
        </>
    );
}
