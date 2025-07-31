"use client";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer/Footer";
import { Provider } from "react-redux";
import { store } from "./utils/store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import "../i18n";
import { useEffect } from "react";
import { useTranslation } from "@/node_modules/react-i18next";

// const inter = Inter({ subsets: ["latin"] });
const monteserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <html lang="en">
      <body className={monteserrat.className}>
        <Provider store={store}>
          <main className="bg-[#093545]">
            <ToastContainer />
            {children}
          </main>
        </Provider>
        <Footer />
      </body>
    </html>
  );
}
