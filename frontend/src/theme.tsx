import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
export const theme = createMuiTheme({
	palette: {
		primary: {
			light: "#ccc",
			main: "#EDB93C",
			dark: "#a37f2a",
		},
		secondary: {
			main: "#23BFC1",
			light: "#A5C8D1",
		},
		background: {
			paper: "#0a2339",
		},
		text: {
			primary: "#FFF", // white
			secondary: "#000", // black
		},
	},
	overrides: {
		MuiCssBaseline: {
			"@global": {
				body: {},
			},
		},
		MuiIconButton: {
			root: {
				"&.Mui-disabled": {
					backgroundColor: "rgba(60, 60, 60, 0.5)",
				},
			},
		},
		MuiInputLabel: { root: { color: "white" } },
		MuiButton: {
			root: {
				minWidth: "0px",
			},
		},
	},
	typography: {
		fontFamily: "Nunito",
		h1: {
			fontSize: "2.5rem",
			fontWeight: 600,
			lineHeight: "2em",
		},
		h2: {
			fontSize: "1.5rem",
			fontWeight: 400,
			color: "white",
		},
		h3: {
			fontSize: "1.25rem",
			fontWeight: 300,
		},
		h4: {
			fontSize: "1rem",
			fontWeight: 300,
		},
		h5: {
			fontSize: "1rem",
			fontWeight: 300,
			color: "white",
		},
		h6: {
			fontSize: "1rem",
			fontWeight: 700,
			color: "black",
		},
		subtitle1: {
			fontSize: "8.5rem",
			fontWeight: 600,
			lineHeight: "1.2em",
		},
		subtitle2: {
			fontSize: "5rem",
			fontWeight: 600,
			lineHeight: "1em",
		},
		caption: {
			// NavBar links
			fontSize: "1.1rem",
			fontWeight: 600,
		},
		body1: {
			fontSize: "1rem",
			fontWeight: 300,
		},
		body2: {
			fontSize: "0.95rem",
			fontWeight: 200,
		},
		overline: {
			fontSize: "1rem",
			fontWeight: 400,
			fontStyle: "italic",
			textTransform: "none",
		},
		button: {
			fontSize: "1rem",
			fontWeight: 700,
			padding: "10px",
			textTransform: "none",
			textShadow: "0px 0px 1px rgba(0, 0, 0, 1)",
		},
	},
});
export default theme;
