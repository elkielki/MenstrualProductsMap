import React, { useContext } from 'react';
import { Input } from '@chakra-ui/react';
import Axios from '../axiosSetup';
import { UserContext } from '../context/userContext';

// Returns a search bar to search for a specific station for the list view 
export default function SearchBar() {

    const {
        user, setUser, 
        loggedIn, setLoggedIn, 
        stationList, setStationList
    } =  useContext(UserContext);

    /* val - user input
        Search function
    */
    const handleInput = (val) => {
        // If no input, then list all the locations
        if (val.length == 0) {
            Axios.get('/getStations')  
            .then(function (response) {
                setStationList(response.data);  
            })
            .catch(function (error) {
                console.log(error);
            })
        } // If at least two letters were inputted, then return locations starting with those letters
        else if (val.length > 2) {
            Axios.get('/getSearch', {params: {searchInput: val}})
            .then(function(response) {
                setStationList(response.data);
            }).catch(function (error) {
                console.log(error);
            })
        } else {
            return;
        }  
    }

    return (
        <Input placeholder='Search' onChange={(e) => handleInput(e.target.value)} />
    )
}