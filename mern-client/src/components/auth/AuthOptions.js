import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom';
import userContext from '../../context/UserContext';

export default function AuthOptions() {
    const {userData, setUserData} = useContext(userContext);

    const history = useHistory();
    const register = () => history.push('/register');
    const login = () => history.push('/login');

    return (
        <nav className="auth-options">
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
        </nav>
    )
}
