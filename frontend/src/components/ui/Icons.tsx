import type { CSSProperties } from "react";

export function Icon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  const style: CSSProperties | undefined = filled
    ? { fontVariationSettings: '"FILL" 1' }
    : undefined;
  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  );
}
