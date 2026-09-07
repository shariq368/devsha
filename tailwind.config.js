/** @type {import('tailwindcss').Config} */
export default {
    /*
     * Explicit source globs. The previous "./**\/*.{js,ts,jsx,tsx}" pattern
     * made Tailwind walk node_modules on every build/HMR pass.
     */
    content: [
        "./index.html",
        "./main.tsx",
        "./App.tsx",
        "./constants.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
                heading: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
            },
            colors: {
                dark: "#0A0A0A",
                light: "#FAFAFA",
                "brand-primary": "#22C55E",
                "brand-yellow": "#4ADE80",
                // Used by the WhatsApp cards in Contact + Footer. It was never
                // declared, so `text-brand-green` / `bg-brand-green/20` emitted
                // no CSS at all and those icons rendered uncolored.
                "brand-green": "#25D366",
            }
        },
    },
    plugins: [],
}
