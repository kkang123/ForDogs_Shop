/** @type {import('tailwindcss').Config} */
module.exports = {
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
        // 갈색 추가
        brown: {
          "50": "#f6f4f4",
          "100": "#edebea",
          "200": "#d6cbc6",
          "300": "#bfaba1",
          "400": "#8f7560",
          "500": "#5f3f1f",
          "600": "#4d3219",
          "700": "#392513",
          "800": "#26180d",
          "900": "#130c06",
        },
        btn: {
          // main: "#ff8000",
          main: "#DEEFFF",
        },
        // 밝은 파랑
        LightBlue: {
          "50": "#f2f2ff",
          "100": "#e6e6ff",
          "200": "#bfbfff",
          "300": "#9999ff",
          "400": "#4d4dff",
          "500": "#646cff",
          "600": "#1a1aff",
          "700": "#0000e6",
          "800": "#0000b3",
          "900": "#000080",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(0%)" },
          "22.22%": { transform: "translateX(0%)" },
          "33.33%": { transform: "translateX(-100%)" },
          "55.55%": { transform: "translateX(-100%)" },
          "66.66%": { transform: "translateX(-200%)" },
          "88.88%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(-300%)" },
        },

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
        slide: "slide 9s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
