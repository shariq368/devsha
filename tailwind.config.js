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
            }
        },
    },
    plugins: [],
}
