import {Toaster} from "sonner";
import {useNavigation} from "./config/navigation-context";
import {CV} from "./pages/CV";
import {useColorScheme} from "./hooks/use-color-scheme";
import {Contact} from "./pages/Contact";
import Home from "./pages/Home";

export default function App() {
    useColorScheme();
    const {currentPage, setCurrentPage} = useNavigation();

    const renderPage = () => {
        const backToHome = () => setCurrentPage("home");

        switch (currentPage) {
            case "contact":
                return <Contact onClose={backToHome}/>;
            case "cv":
                return <CV onClose={backToHome}/>;
            default:
                return <Home/>;
        }
    };

    return (
        <>
            {renderPage()}
            <Toaster/>
        </>
    );
}