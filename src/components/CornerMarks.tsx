const spots = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
];

/** Tanda registrasi (silang kecil) di empat sudut container relatif. */
export function CornerMarks({ size = 14 }: { size?: number }) {
  return (
    <>
      {spots.map((pos) => (
        <svg
          key={pos}
          aria-hidden="true"
          width={size}
          height={size}
          viewBox="0 0 14 14"
          className={`absolute ${pos}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M7 0V14M0 7H14" />
        </svg>
      ))}
    </>
  );
}