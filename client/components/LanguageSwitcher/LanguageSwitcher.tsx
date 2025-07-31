"use client";

import { useTranslation } from "@/node_modules/react-i18next";
import React, { useEffect } from "react";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { sign } from "crypto";

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation('translation');

    const options = [
        { value: "en", label: "English" },
        { value: "fr", label: "Français" },
        { value: "hi", label: "हिंदी" },
        { value: "de", label: "Deutsch" },
        { value: "es", label: "Español" },
        { value: "ar", label: "الإنجليزية" },
    ];

    const handleSelect = (value: string) => {
        localStorage.setItem("language", value);
        i18n.changeLanguage(value);

        if (value === "ar") {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language");

        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);

            if (savedLanguage === "ar") {
                document.documentElement.dir = "rtl";
            } else {
                document.documentElement.dir = "ltr";
            }
        }
    }, []);

    return (
        <div>
            <CustomSelect
                arrayOfOptions={options}
                label={t('select-language')}
                selectColor="#2BD17E"
                selectTextColor="#FFFFFF"
                bgColor="#224957"
                height="150px"
                onSelect={handleSelect}
            />
        </div>
    );
};

export default LanguageSwitcher;
