import Routing from "./Routing";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
import HomeShade from "./components/HomeShade/HomeShade.component";

const App = () => {
	return (
		<>
			<ThemeProvider theme={theme}>
				<HomeShade />
				<Routing />
			</ThemeProvider>
		</>
	);
};

export default App;
