import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../axiosSetup';
import { UserContext } from '../context/userContext';
import { 
    Flex, Box, Heading,
    FormControl, FormLabel,
    Button,  Input 
} from '@chakra-ui/react';

// Returns the user registration form
export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const navigate = useNavigate();
    const {user, setUser, loggedIn, setLogin} = useContext(UserContext);

    // Sends user info to backend to check if user exists and to store info in database
    const registerUser = (e) => {
        e.preventDefault();
        Axios.post('/register', {email, password, accessCode})
        .then(res => {
            setLogin(true);
            window.localStorage.setItem("logged-in", JSON.stringify(true));
            navigate('/');
        }).catch(err => console.log(err))
    }

    return (
        <Box
            paddingY='3vh'
            paddingX='5vw'
            w='80vw'
            marginTop='10vh'
            marginX='10vw'
            border='2px' 
        >   
            <Heading as='h1' size='lg' marginTop='1%' marginBottom='5%' textAlign='center'>Register</Heading>
            <FormControl>
                <FormLabel fontWeight='bold'>Email</FormLabel>
                <Input type='email' id='registerEmail' placeholder='enter email...' value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormLabel fontWeight='bold' marginTop='3%' >Password</FormLabel>
                <Input type='password' id='registerPassword' placeholder='enter password...' value={password} onChange={(e) => setPassword(e.target.value)} />
                <FormLabel fontWeight='bold' marginTop='3%' >Access Code</FormLabel>
                <Input type='text' id='accessCode' placeholder='enter access code...' value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
            </FormControl>
            <Flex justifyContent='end'>
                <Button onClick={registerUser} marginY='5%'>Submit</Button>
            </Flex>
        </Box>
    )
}