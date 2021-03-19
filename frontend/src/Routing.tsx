import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

// Views
import {HomeView} from './views/HomeView/HomeView'
import {HistoryView} from './views/HistoryView/HistoryView'
import {AboutView} from './views/AboutView/AboutView'

const Routing = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={HomeView}/>
                <Route exact path="/history" component={HistoryView}/>
                <Route exact path="/about" component={AboutView}/>
            </Switch>
        </HashRouter>
    )
}

export default Routing;