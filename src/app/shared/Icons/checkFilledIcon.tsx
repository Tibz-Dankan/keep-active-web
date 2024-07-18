import React from "react";
import { twMerge } from "tailwind-merge";

interface CheckFilledIconProps {
  className?: string;
}

export const CheckFilledIcon: React.FC<CheckFilledIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 0 48 48"
      className={twMerge(`text-color-text-primary`, props.className)}
    >
      <defs>
        <mask id="ipSCheckOne0">
          <g fill="none" stroke-linejoin="round" stroke-width="4">
            <path
              fill="#fff"
              stroke="#fff"
              d="M24 44a19.937 19.937 0 0 0 14.142-5.858A19.937 19.937 0 0 0 44 24a19.938 19.938 0 0 0-5.858-14.142A19.937 19.937 0 0 0 24 4A19.938 19.938 0 0 0 9.858 9.858A19.938 19.938 0 0 0 4 24a19.937 19.937 0 0 0 5.858 14.142A19.938 19.938 0 0 0 24 44Z"
            />
            <path stroke="#000" stroke-linecap="round" d="m16 24l6 6l12-12" />
          </g>
        </mask>
      </defs>
      <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSCheckOne0)" />
    </svg>
  );
};
