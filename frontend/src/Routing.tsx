import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

import {LandingView} from './views/landingView/LandingView'

const Routing = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route component={LandingView}/>
                {/*<Route exact path="/dashboard" render={(props) => (<PrivateRoute path="/dashboard" component={DashboardView} />)} />*/}
            </Switch>
        </BrowserRouter>
    )
}

export default Routing;