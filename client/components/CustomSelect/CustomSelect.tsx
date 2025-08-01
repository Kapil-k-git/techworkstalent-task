import React, { useState } from "react";
import { useTranslation } from "@/node_modules/react-i18next";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    arrayOfOptions: Option[];
    label?: string;
    selectColor?: string;
    selectTextColor?: string;
    bgColor?: string;
    height?: string;
    onSelect: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    arrayOfOptions,
    label,
    selectColor = "#2BD17E",
    selectTextColor = "#ffffff",
    bgColor = "#224957",
    height = "150px",
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>("");

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectValueFun = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        onSelect(value);
    };

    return (
        <div className="relative mt-1 mb-5">
            <button
                onClick={toggleDropdown}
                style={{ backgroundColor: selectColor, color: selectTextColor }}
                className="block min-w-[200px] h-[40px] sm:h-[50px] p-2 sm:p-4 font-bold text-sm text-center  shadow-md rounded-[10px]  custom-select"
            >
                {selectedValue
                    ? arrayOfOptions.find((opt) => opt.value === selectedValue)?.label
                    : label || arrayOfOptions[0]?.label}
                <svg
                    className="w-5 h-5 inline ml-2 float-right"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    style={{ height: height, backgroundColor: bgColor }}
                    className="absolute mt-2 w-full shadow-lg rounded-[10px] z-10 custom-scrollbar overflow-auto"
                >
                    <div className="px-1">
                        {arrayOfOptions.map((ele) => (
                            <div
                                key={ele.value}
                                onClick={() => selectValueFun(ele.value)}
                                className="h-[49px] flex justify-start items-center p-4 text-white font-bold text-[14px] cursor-pointer rounded-md"
                            >
                                {ele.label.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
