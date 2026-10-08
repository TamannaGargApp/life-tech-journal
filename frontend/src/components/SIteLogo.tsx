/* eslint-disable @next/next/no-img-element */

// Site logo. "auto" swaps between the light and dark artwork with the theme;
// "dark" always uses the dark artwork (for areas with a dark background, like the admin panel).
export default function SiteLogo({ height = 52, variant = "auto" }: { height?: number; variant?: "auto" | "dark" }) {
  const style = { height, width: "auto", display: "block" } as const;
  if (variant === "dark") {
    return <img src="/logo-dark.png" alt="Life & Tech Journal" className="logo-img logo-dark-only" style={style} />;
  }
  return (
    <>
      <img src="/logo-light.png" alt="Life & Tech Journal" className="logo-img logo-for-light" style={style} />
      <img src="/logo-dark.png"  alt="Life & Tech Journal" className="logo-img logo-for-dark"  style={style} />
    </>
  );
}
