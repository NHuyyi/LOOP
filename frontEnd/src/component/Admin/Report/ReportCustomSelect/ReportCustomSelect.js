import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ReportCustomSelect.module.css";
import { ChevronDown } from "lucide-react";

const cx = classNames.bind(styles);

function ReportCustomSelect({ options, value, onChange, placeholder = "Chọn..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className={cx("custom-select-wrapper")} ref={dropdownRef}>
            <div 
                className={cx("custom-select-trigger")}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={cx("select-text")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className={cx("arrow-icon", { open: isOpen })} />
            </div>

            {isOpen && (
                <div className={cx("custom-options-list")}>
                    {options.map((option) => (
                        <div 
                            key={option.value}
                            className={cx("custom-option", { selected: value === option.value })}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReportCustomSelect;