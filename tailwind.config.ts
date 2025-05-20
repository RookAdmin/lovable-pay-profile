
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '0',
      screens: {
        '2xl': '100%'
      }
    },
    extend: {
      colors: {
        // New custom palette
        red: "#dc2e3e",
        blue: "#0096d4",
        green: "#00d437",
        yellow: "#ffd800",
        
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: "#dc2e3e", // Red as primary
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0096d4", // Blue as secondary
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f3f4f6", // Light gray for muted
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#ffd800", // Yellow as accent
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#dc2e3e", // Red for destructive
          foreground: "#ffffff"
        },
        popover: {
          DEFAULT: "#fff",
          foreground: "#000000"
        },
      },
      backgroundImage: {
        'gradient-app': 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'card-soft': 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        'heading-gradient': 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        'heading-soft-gradient': 'linear-gradient(135deg, #222222 0%, #444444 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'accordion-down': {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        'accordion-up': {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      textColor: {
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #333333 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
