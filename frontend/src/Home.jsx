import React, { useContext, useState } from 'react'
import { Center, Flex, HStack, VStack, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import Axios from './axiosSetup';
import { UserContext } from './context/userContext';
import Logout from './components/Logout';
import NewLocationForm from './components/NewLocationForm';
import StationList from './components/StationList';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';

export default function Home() {
    const navigate = useNavigate();

    // Gets user and station list info
    const {
        user, setUser, 
        loggedIn, setLoggedIn, 
        stationList, setStationList
    } =  useContext(UserContext);

    // Stores current coordinates of user
    const [currPosition, setCurrPosition] = useState(null);

    // Updates current coordinates of user from map container
    const handleCurrPositionCallback = (coords) => {
        setCurrPosition(coords);
    }
    
    // On click sends user to register page
    const handleRegisterPage = () => {
        navigate('/register');
    }

    // On click sends user to login page
    const handleLoginPage = () => {
        navigate('/login');
    }

    // Sorts station list by alphabetical order
    const sortAlphabetical = () => {
        Axios.get('/sortAlphabetical')
        .then(function(response) {
            setStationList(response.data);
            console.log("data: " + JSON.stringify(response.data));
        }).catch(function (error) {
            console.log(error);
        })
    }

    // Sorts station list by distance from user
    const sortDistance = () => {
        Axios.get('/sortDistance', {params: {long: currPosition.lng, lat: currPosition.lat}})
        .then(function(response) {
            setStationList(response.data);
        }).catch(function (error) {
            console.log(error);
        })
    }

    return (
        <Center>
            <VStack>
                {/* Register and login buttons */}
                <HStack width='90vw' justifyContent='end' marginTop='1vh'>
                    {!loggedIn && <Button onClick={handleRegisterPage}>Register</Button>}
                    {!loggedIn && <Button onClick={handleLoginPage}>Login</Button>}
                    {loggedIn && <Logout />}
                </HStack>
                
                {loggedIn && 
                    <Flex justifyContent='space-between' width='90vw' marginTop='3vh'>    
                        {/* Sort menu */}
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                Sort
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={sortAlphabetical}>Alphabetical</MenuItem>
                                <MenuItem onClick={sortDistance}>Distance</MenuItem>
                            </MenuList>
                        </Menu>
                        {/* Form to add new menstrual product station */}
                        <NewLocationForm />
                    </Flex>
                }
                <SearchBar />
                <StationList />
                <MapView coordinates={handleCurrPositionCallback} />
            </VStack>
        </Center>
    )
}