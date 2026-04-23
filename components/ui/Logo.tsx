import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Use white text (for dark backgrounds like sidebar / hero) */
  white?: boolean;
  /** Wrap in a link to home */
  href?: string;
  className?: string;
}

const SIZES = {
  sm: { img: 28, wrapper: "h-7" },
  md: { img: 36, wrapper: "h-9" },
  lg: { img: 48, wrapper: "h-12" },
  xl: { img: 64, wrapper: "h-16" },
};

function LogoImage({ size = "md", white, className = "" }: LogoProps) {
  const { img, wrapper } = SIZES[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/Zoro Logo-01.png"
        alt="Zoro UAE"
        width={img}
        height={img}
        className={`${wrapper} w-auto object-contain ${white ? "brightness-0 invert" : ""}`}
        priority
      />
    </div>
  );
}

export function Logo({ href = "/", size = "md", white, className }: LogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center ${className ?? ""}`}>
      <LogoImage size={size} white={white} />
    </Link>
  );
}

export { LogoImage };
