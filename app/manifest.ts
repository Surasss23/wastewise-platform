import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WasteWise",
    short_name: "WasteWise",
    description: "Community-driven smart waste management",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8F6",
    theme_color: "#202923"
  };
}
