import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

import {LandingView} from './views/landingView/LandingView'
import {visualizer} from './views/simon/visualize'

const Routing = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route component={visualizer}/>
                {/*<Route exact path="/dashboard" render={(props) => (<PrivateRoute path="/dashboard" component={DashboardView} />)} />*/}
            </Switch>
        </BrowserRouter>
    )
}

export default Routing;