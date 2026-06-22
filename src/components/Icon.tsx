import type { SVGProps } from "react";

type IconName =
  | "alert"
  | "x"
  | "trash"
  | "checklist"
  | "spinner"
  | "calendar"
  | "arrowRight"
  | "arrowLeft"
  | "face"
  | "menu";

const PATHS: Record<IconName, { viewBox: string; children: JSX.Element }> = {
  alert: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  x: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ),
  },
  trash: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    ),
  },
  checklist: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    ),
  },
  spinner: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
  },
  calendar: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  arrowRight: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    ),
  },
  arrowLeft: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    ),
  },
  face: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  menu: {
    viewBox: "0 0 24 24",
    children: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16m-7 6h7"
      />
    ),
  },
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon = ({ name, className = "w-4 h-4", ...props }: IconProps) => {
  const icon = PATHS[name];
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox={icon.viewBox}
      {...props}
    >
      {icon.children}
    </svg>
  );
};
