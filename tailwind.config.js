/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f5f7ff',
                    100: '#ebf0fe',
                    200: '#ced9fd',
                    300: '#b1c2fb',
                    400: '#7695f8',
                    500: '#3b68f5',
                    600: '#6366f1', // Our Signature Electric Indigo
                    700: '#2b4bb1',
                    800: '#213885',
                    900: '#1b2d6d',
                    accent: '#10b981', // Sustainable Mint
                }
            },
            borderRadius: {
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
