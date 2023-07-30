/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            backgroundImage: {
                'mc-server-backdrop': 'url(\'./../public/mc-server-backdrop.gif\')'
            }
        },
    },
    plugins: [],
};
