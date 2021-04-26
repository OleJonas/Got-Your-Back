import { Route, HashRouter, Switch } from "react-router-dom";

// Views
import { HomeView } from "./views/HomeView/HomeView";
import { HistoryView } from "./views/HistoryView/HistoryView";
import { HelpView } from "./views/HelpView/HelpView";
import { ReportView } from "./views/ReportView/ReportView";

const Routing = () => {
	return (
		<HashRouter>
			<Switch>
				<Route exact path="/" component={HomeView} />
				<Route exact path="/history" component={HistoryView} />
				<Route exact path="/help" component={HelpView} />
				<Route exact path="/report" component={ReportView} />
			</Switch>
		</HashRouter>
	);
};

export default Routing;
