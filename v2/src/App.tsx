import { useState } from "react";
import Home from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Toaster } from "./components/ui/toaster/toaster";
import { useColorScheme } from "./hooks/use-color-scheme";

export default function App() {
  useColorScheme();
  const [currentPage, setCurrentPage] = useState<"home" | "contact">("home");

  return (
    <>
      {currentPage === "home" ? (
        <Home onNavigateToContact={() => setCurrentPage("contact")} />
      ) : (
        <Contact onClose={() => setCurrentPage("home")} />
      )}
      <Toaster />
    </>
  );
}
