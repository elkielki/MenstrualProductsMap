import React, { useContext } from 'react';
import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Axios from '../axiosSetup';
import { UserContext } from '../context/userContext';

// Returns logout button
export default function Logout() {
    const navigate = useNavigate(); 
    const {user, setUser, loggedIn, setLogin} = useContext(UserContext);

    // Resets login variables and returns user to homepage
    const logoutUser = async (e) => {
        Axios.get('/logout')
        .then(res => {
            setLogin(false);
            window.localStorage.removeItem("logged-in");
            setUser(null);
            navigate('/');
        }).catch(err => console.log(err));  
    }

    return (
        <Button onClick={logoutUser}>Logout</Button>
    )
}