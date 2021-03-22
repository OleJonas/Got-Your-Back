import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
export const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#EDB93C",
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
		/*
    error: {
      main: '#EA526F',
    },
    success: {
      main: '#50C878',
    },
    */
	},
	typography: {
		fontFamily: "Nunito",
		h1: {
			fontSize: "2.5rem",
			fontWeight: 600,
			lineHeight: "2em",
		},
		h2: {
			fontSize: "1.75rem",
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
			fontSize: "1.25rem",
			fontWeight: 300,
		},
		h6: {
			fontSize: "1rem",
			fontWeight: 700,
			color: "black",
		},
		subtitle1: {
			fontSize: "7.5rem",
			fontWeight: 600,
			lineHeight: "1em",
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
			fontSize: "0.9rem",
			fontWeight: 300,
		},
		body2: {
			fontSize: "0.75rem",
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
		},
	},
});
