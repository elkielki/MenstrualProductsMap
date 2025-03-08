import Axios from '../axiosSetup.jsx';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({})

export function UserContextProvider({children}) {
    const [stationList, setStationList] = useState([]);
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(() => {
        const logValue = window.localStorage.getItem("logged-in");
        return logValue !== null
          ? JSON.parse(logValue)
          : false;
      });
    
    const setLogin = (val) => {
        window.localStorage.setItem("logged-in", JSON.stringify(val));
        setLoggedIn(val);
    };

    // Gets user information
    useEffect(() => {
        if (loggedIn) {
            Axios.get('/profile').then(({data}) => {
                setUser(data)
            })
        }
    }, [loggedIn]) 
    
    // Get the list of all the stations
    useEffect(() => {
        Axios.get('/getStations')  
        .then(function (response) {
            setStationList(response.data);  
        })
        .catch(function (error) {
            console.log(error);
        })
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, loggedIn, setLogin, stationList, setStationList}}>
            {children}
        </UserContext.Provider>
    )
}