/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
    extend: {
        colors: {
            primary: {
                50: "#e0f9f1",
                100: "#b3f0d9",
                200: "#80e7c0",
                300: "#4ddda6",
                400: "#1ad48d",
                500: "#16c47f",
                600: "#13a16a",
                700: "#0f7d55",
                800: "#0b5940",
                900: "#07372b",
            },
            red: {
                500: "#f16053",
            },
            blue: {
                500: "#305c91",
            },
            bg: {
                50: "#f5fdfa",
            },
            accent: {
                500: "#ffd65a",
            },
        },
    },
};
export const plugins = [];