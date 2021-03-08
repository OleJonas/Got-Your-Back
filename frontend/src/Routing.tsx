import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

import {LandingView} from './views/landingView/LandingView'
import {Visualizer} from './views/simon/visualize'

const Routing = () => {
    return (
        <BrowserRouter>
            <Switch>
                {/*<Route component={Visualizer}/>*/}
                <Route component={LandingView}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Routing;