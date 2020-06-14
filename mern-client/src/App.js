import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import './style.css'

export default function App() {
    return (
        <>
        {/* BrowserRouter gives access to routing for components inside */}
            <BrowserRouter> 
            <Header />
            {/* Switch gives access to the url */}
                <Switch>
                    <Route exact  path="/" component={Home} />
                    <Route path="/Login" component={Login} />
                    <Route path="/Register" component={Register} />
                </Switch>
            </BrowserRouter>
        </>
    )
}
