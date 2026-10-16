import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Citi Pharma Brand Palette
        pharma: {
          blue: "#123B63",
          "blue-dark": "#0A2138",
          "blue-hover": "#1A4E82",
          "blue-light": "#EBF2F8",
        },
        clinical: {
          white: "#F5F8FC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
        teal: {
          pharma: "#0F9D8A",
          "pharma-light": "#E6F7F4",
          "pharma-dark": "#0B7A6B",
        },
        warning: {
          amber: "#E7A23B",
          "amber-light": "#FEF7EC",
          "amber-dark": "#C2801F",
        },
        fail: {
          red: "#DC2626",
          "red-light": "#FEF2F2",
          "red-dark": "#B91C1C",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#123B63",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5F8FC",
          foreground: "#0F172A",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#0F9D8A",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
