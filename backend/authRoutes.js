// This file contains all the get, put, and post requests.
const express = require('express');
const router = express.Router({mergeParams: true});
const cors = require('cors');
const { 
    logoutUser, 
    registerUser, 
    loginUser, 
    getProfile, 
    getStationList, 
    addNewStation, 
    editStation, 
    deleteStation, 
    sortDistance, 
    sortAlphabetical, 
    getSearch 
} = require('./authController');

router.use(
    cors({
        credentials: true,
        origin: 'https://localhost:5173'
    })
) 

router.get('/getSearch', getSearch);
router.get('/getStations', getStationList);
router.get('/logout', logoutUser);
router.get('/profile', getProfile);
router.get('/sortAlphabetical', sortAlphabetical);
router.get('/sortDistance', sortDistance);

router.post('/addNewStation', addNewStation);
router.post('/login', loginUser);
router.post('/register', registerUser);

router.put('/editStation', editStation);
router.put('/deleteStation', deleteStation);

module.exports = router