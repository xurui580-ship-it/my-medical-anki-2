import type { SVGProps } from "react";

export function StethoscopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a2 2 0 1 0 4 0V6a2 2 0 1 0-4 0" />
      <path d="M8 6V4a2 2 0 1 0-4 0v2" />
      <path d="M6 14v6" />
      <path d="M6 20h12" />
      <path d="M18 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
  );
}

export function BrainIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.23a4.5 4.5 0 0 1 0 8.54V16a2.5 2.5 0 0 1-5 0v-1.07A4.5 4.5 0 0 1 7 6.73V4.5A2.5 2.5 0 0 1 9.5 2z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1.23a4.5 4.5 0 0 0 0 8.54V16a2.5 2.5 0 0 0 5 0v-1.07A4.5 4.5 0 0 0 17 6.73V4.5A2.5 2.5 0 0 0 14.5 2z" />
        <path d="M12 16.5V22" />
        <path d="M12 4.5a2.5 2.5 0 0 1-2.5-2.5" />
        <path d="M12 4.5a2.5 2.5 0 0 0 2.5-2.5" />
      </svg>
    )
  }
  
  export function DnaIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14.5A4.5 4.5 0 0 1 8.5 10H10a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8.5A4.5 4.5 0 0 1 4 14.5z" />
        <path d="M15.5 14H14a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3h1.5A4.5 4.5 0 0 1 20 9.5a4.5 4.5 0 0 1-4.5 4.5z" />
        <path d="M10 13V5" />
        <path d="M14 11v8" />
      </svg>
    )
  }