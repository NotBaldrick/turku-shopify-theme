module.exports = {
	content: ["./theme/**/*.{html,js,liquid,json}"],
	theme: {
		container: {
			center: true,
			padding: "0.5rem",
		},
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1124px",
			"2xl": "1280px",
		},
	},
	daisyui: {
		themes: ["light"],
	},
	plugins: [require("daisyui"), require("tailwindcss-debug-screens")],
};
