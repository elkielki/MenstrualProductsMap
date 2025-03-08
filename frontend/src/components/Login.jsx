import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Axios from '../axiosSetup';
import { UserContext } from '../context/userContext';
import { Flex, Box, FormControl, FormLabel, Button, Input, Heading } from '@chakra-ui/react';
import '../theme/Theme';

// Returns the login form
export default function Login() {
    const navigate = useNavigate(); 

    // Stores the login information
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const {user, setUser, loggedIn, setLogin} = useContext(UserContext);

    const loginUser = async (e) => {
        e.preventDefault(); 
        const {email, password} = data
        try {
            // Checks if login information is correct
            const {data} = await Axios.post('/login', {
                email,
                password,
            });
            // Return error message if incorrect login information
            if (data.error) {
                toast.error(data.error)
            } else {
                // resets form and sets login variables
                setData({
                    email: '',
                    password: '',
                });
                setLogin(true);
                window.localStorage.setItem("logged-in", true);
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
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
            <Heading as='h1' size='lg' paddingTop='1%' marginBottom='5%' textAlign='center'>Login</Heading>
            <FormControl>
                {/* Email Section */}
                <FormLabel fontWeight='bold' >Email</FormLabel>
                <Input type='email' id='loginEmail' placeholder='enter email...' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} color='#E0FBFC' />
                
                {/* Password Section */}
                <FormLabel  fontWeight='bold' marginTop='3%' >Password</FormLabel>
                <Input type='password' id='loginPassword' placeholder='enter password...' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} color='#E0FBFC' />
                
                {/* Submit Button */}
                <Flex justifyContent='end'>
                    <Button onClick={loginUser} marginY='5%'>Submit</Button>
                </Flex>
            </FormControl>
        </Box>
    )
}    