import { SVGProps } from 'react';

export function CrescentMoon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function IslamicStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  );
}

export function Pattern(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="100%" height="100%" {...props}>
      <defs>
        <pattern
          id="islamic-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0L40 20L20 40L0 20L20 0Z"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
          <circle cx="20" cy="20" r="5" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  );
}

export function Divider(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      preserveAspectRatio="none"
      {...props}
    >
      <path d="M0 5h45l5-3 5 3h45" />
    </svg>
  );
}
