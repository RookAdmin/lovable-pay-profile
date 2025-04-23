
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
      padding: '0',  // Remove padding
      screens: {
        '2xl': '100%'  // Ensure full width
      }
    },
    extend: {
      colors: {
        // Custom palette
        lightblue: "#D4F1F4",
        cyan: "#0097A7",
        teal: "#005F6A",
        darkteal: "#003D40",

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: "#0097A7",           // Cyan
          foreground: "#D4F1F4",        // Light blue for text on cyan
        },
        secondary: {
          DEFAULT: "#005F6A",           // Deep teal
          foreground: "#D4F1F4",        // Light blue
        },
        muted: {
          DEFAULT: "#D4F1F4",           // Light blue
          foreground: "#005F6A",
        },
        card: {
          DEFAULT: "#ffffff",           // White cards to lift above backgrounds
          foreground: "#003D40",        // Strongest for contrast
        },
        accent: {
          DEFAULT: "#003D40",           // Darkest for accent
          foreground: "#D4F1F4",
        },
        destructive: {
          DEFAULT: "#FF585D",
          foreground: "#fff"
        },
        popover: {
          DEFAULT: "#fff",
          foreground: "#003D40"
        },
        sidebar: {
          DEFAULT: "#D4F1F4",
          foreground: "#003D40",
          primary: "#0097A7",
          'primary-foreground': "#D4F1F4",
          accent: "#005F6A",
          'accent-foreground': "#D4F1F4",
          border: "#D4F1F4",
          ring: "#0097A7"
        },
        brand: {
          cyan: "#0097A7",
          lightblue: "#D4F1F4",
          teal: "#005F6A",
          darkteal: "#003D40",
        },
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
      backgroundImage: {
        'gradient-app': 'linear-gradient(135deg, #D4F1F4 0%, #0097A7 100%)',
        'card-soft': 'linear-gradient(135deg, #D4F1F4 0%, #005F6A 100%)'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
