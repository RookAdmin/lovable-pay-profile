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
          DEFAULT: "#0097A7",
          foreground: "#D4F1F4",
        },
        secondary: {
          DEFAULT: "#005F6A",
          foreground: "#D4F1F4",
        },
        muted: {
          DEFAULT: "#D4F1F4",
          foreground: "#005F6A",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#003D40",
        },
        accent: {
          DEFAULT: "#003D40",
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
      },
      backgroundImage: {
        'gradient-app': 'linear-gradient(135deg, #D4F1F4 0%, #0097A7 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'card-soft': 'linear-gradient(135deg, #D4F1F4 0%, #005F6A 100%)',
        'heading-gradient': 'linear-gradient(135deg, #1A1F2C 0%, #403E43 50%, #333333 100%)',
        'heading-soft-gradient': 'linear-gradient(135deg, #221F26 0%, #403E43 50%, #222222 100%)',
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
        'gradient-dark': 'linear-gradient(135deg, #1A1F2C 0%, #403E43 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
