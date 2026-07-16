/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                dark: "#0A0A0A",
                light: "#FAFAFA",
                "brand-primary": "#22C55E",
                "brand-yellow": "#4ADE80",
                "brand-orange": "#F97316",
                "brand-pink": "#EC4899",
                "brand-cyan": "#06B6D4",
                "brand-green": "#22C55E",
                "dark-navy": "#0B0F1E",
                "dark-deep": "#070A13",
            }
        },
    },
    plugins: [],
}
