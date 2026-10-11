import React from "react";

const TildeIcon = ({
    size = 24,
    color = "currentColor",
    strokeWidth = 2.5,
    className,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-label="Tilde"
            role="img"
        >
            <path
                d="M4 14C6 8 9 8 12 12S18 16 20 10"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
        </svg>
    );
};

export default TildeIcon;