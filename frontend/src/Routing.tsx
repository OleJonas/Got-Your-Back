import React from 'react';
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom';

import {LandingView} from './views/landingView/LandingView'
import {Visualizer} from './views/simon/visualize'

const Routing = () => {
    return (
        <HashRouter>
            <Switch>
                {/*<Route component={Visualizer}/>*/}
                <Route component={LandingView}/>
            </Switch>
        </HashRouter>
    )
}

export default Routing;