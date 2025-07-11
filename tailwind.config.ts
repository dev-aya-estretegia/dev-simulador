import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
        background: "#0d0f12", // Fundo (preto)
        foreground: "#f7faf7", // Texto (branco)
        primary: {
          DEFAULT: "#17c442", // Destaque primário (verde escuro)
          foreground: "#f7faf7", // Texto sobre o primário (branco)
        },
        secondary: {
          DEFAULT: "#8bdc61", // Destaque secundário (verde claro)
          foreground: "#0d0f12", // Texto sobre o secundário (preto)
        },
        destructive: {
          DEFAULT: "#ff4d4f",
          foreground: "#f7faf7",
        },
        muted: {
          DEFAULT: "#2a2a2a",
          foreground: "#a1a1a1",
        },
        accent: {
          DEFAULT: "#8bdc61",
          foreground: "#0d0f12",
        },
        card: "#161a1d",
        border: "#2a2a2a",
        popover: {
          DEFAULT: "#161a1d",
          foreground: "#f7faf7",
        },
        input: {
          DEFAULT: "#2a2a2a",
          foreground: "#f7faf7",
        },
        ring: "#17c442",

        // Cores necessárias para os componentes shadcn/ui
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",

        // Cores de estado
        success: {
          DEFAULT: "#10b981",
          foreground: "#f7faf7",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#0d0f12",
        },
        info: {
          DEFAULT: "#3b82f6",
          foreground: "#f7faf7",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
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
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        "slide-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-to-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "slide-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-to-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-to-top": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        "slide-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-to-bottom": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        "slide-from-left": "slide-from-left 0.3s ease-out",
        "slide-to-left": "slide-to-left 0.3s ease-out",
        "slide-from-right": "slide-from-right 0.3s ease-out",
        "slide-to-right": "slide-to-right 0.3s ease-out",
        "slide-from-top": "slide-from-top 0.3s ease-out",
        "slide-to-top": "slide-to-top 0.3s ease-out",
        "slide-from-bottom": "slide-from-bottom 0.3s ease-out",
        "slide-to-bottom": "slide-to-bottom 0.3s ease-out",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      },
      gridTemplateColumns: {
        sidebar: "220px auto",
        "sidebar-collapsed": "80px auto",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
