import React from "react";
import { twMerge } from "tailwind-merge";

interface InfoIconProps {
  className?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 0 512 512"
      className={twMerge(`text-color-text-primary`, props.className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184s184-82.39 184-184S349.61 64 248 64Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M220 220h32v116"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M208 340h88"
      />
      <path
        fill="currentColor"
        d="M248 130a26 26 0 1 0 26 26a26 26 0 0 0-26-26"
      />
    </svg>
  );
};
