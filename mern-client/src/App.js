import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import axios from 'axios'
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserContext from './context/UserContext'

import './style.css'

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    });
    
    useEffect(()=>{
        const checkedLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = '';
            }
            const tokenRes = await axios.post('http://localhost:5000/users/tokenIsValid', null, {headers: {
                "x-auth-token": token
            }});
            if (tokenRes.data) {
                const userRes = await axios.get('http://localhost:5000/users/', null, {headers: {
                    "x-auth-token": token
                }});
                setUserData({
                    token,
                    user: userRes.data
                })
            }
        };
        checkedLoggedIn()
    }, []);
    // Empty array (dependency array) means it only runs on mount not a state change
    return (
        <>
        {/* BrowserRouter gives access to routing for components inside */}
            <BrowserRouter> 
            <UserContext.Provider value={{userData, setUserData}}>
            <Header />
            {/* Switch gives access to the url */}
                <Switch>
                    <Route exact  path="/" component={Home} />
                    <Route path="/Login" component={Login} />
                    <Route path="/Register" component={Register} />
                </Switch>
            </UserContext.Provider>
            </BrowserRouter>
        </>
    )
}
