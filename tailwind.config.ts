
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
        // Rook's brand colors
        rook: {
          red: "#dc2e3e",
          blue: "#0096d4",
          green: "#00d437",
          yellow: "#ffd800",
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: "#dc2e3e", // Rook red as primary
          foreground: "#fff", // White text on red
        },
        secondary: {
          DEFAULT: "#0096d4", // Rook blue as secondary
          foreground: "#fff",
        },
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#64748b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        accent: {
          DEFAULT: "#0096d4", // Rook blue as accent
          foreground: "#fff",
        },
        destructive: {
          DEFAULT: "#FF585D",
          foreground: "#fff"
        },
        popover: {
          DEFAULT: "#fff",
          foreground: "#0f172a"
        },
      },
      backgroundImage: {
        'gradient-app': 'linear-gradient(135deg, #f5f5f5 0%, #f9f9f9 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'card-soft': 'linear-gradient(135deg, #f5f5f5 0%, #ebebeb 100%)',
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
