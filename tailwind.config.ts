import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Add color variables for our multiplier colors
        gray: {
          "400": "hsl(var(--gray-400))",
          "500": "hsl(var(--gray-500))",
        },
        red: {
          "500": "hsl(var(--red-500))",
          "700": "hsl(var(--red-700))",
        },
        orange: {
          "500": "hsl(var(--orange-500))",
        },
        amber: {
          "500": "hsl(var(--amber-500))",
        },
        yellow: {
          "500": "hsl(var(--yellow-500))",
        },
        lime: {
          "500": "hsl(var(--lime-500))",
        },
        green: {
          "600": "hsl(var(--green-600))",
        },
        emerald: {
          "500": "hsl(var(--emerald-500))",
        },
        teal: {
          "500": "hsl(var(--teal-500))",
        },
        cyan: {
          "500": "hsl(var(--cyan-500))",
        },
        sky: {
          "500": "hsl(var(--sky-500))",
        },
        blue: {
          "600": "hsl(var(--blue-600))",
        },
        indigo: {
          "500": "hsl(var(--indigo-500))",
        },
        violet: {
          "500": "hsl(var(--violet-500))",
        },
        purple: {
          "500": "hsl(var(--purple-500))",
        },
        fuchsia: {
          "500": "hsl(var(--fuchsia-500))",
        },
        pink: {
          "500": "hsl(var(--pink-500))",
        },
        rose: {
          "500": "hsl(var(--rose-500))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
