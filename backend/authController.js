// This file contains all the functions related to connecting with the database.
const User = require('./Models/User');
const Station = require('./Models/Station');
const { hashPassword, comparePassword} = require('./auth');
const jwt = require('jsonwebtoken');

// Creates and adds user information to database
const registerUser = async (req, res) => {
    try {
       const {email, password, accessCode} = req.body;
        // Check password requirements
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required to be at least 6 characters long'
            })
        }
        else if (!email) {
            return res.json({
                error: 'Email is required.'
            })
        } // TODO - probably should have a function to create unique access codes
        else if (accessCode != 'cake') {
            return res.json({
                error: 'Access code is invalid.'
            })
        };
        // Check if user already exists
        const exist = await User.findOne({email})
        if (exist) {
            return res.json({
                error: 'Email is taken already'
            })
        }
        // Create user
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            email: email, 
            password: hashedPassword,
        })
    } catch (error) {
        console.log(error);
    }
};

// Checks if user login information matches a user in the database
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.json({
                error: 'No user found'
            })
        }

        // If passwords match as well, then generate and sign jwt token
        const match = await comparePassword(password, user.password);
        if (match) {
            const accessToken = jwt.sign(
                {
                    email: user.email, 
                    id: user._id, 
                }, 
                process.env.JWT_SECRET, 
                {
                    expiresIn: '30min'
                }
            )
            const refreshToken = jwt.sign(
                {
                    email: user.email, 
                    id: user._id, 
                }, 
                process.env.JWT_REFRESH_SECRET, 
                {
                    expiresIn: '3d'
                }
            )   
            res.cookie('accessToken', accessToken, {
                sameSite: 'none', 
                secure: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            }).json(user) 
            res.cookie('refreshToken', refreshToken, {
                sameSite: 'none', 
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }).json(user)   
        } 
        else {
            res.json({
                error: "Passwords do not match"
            })
        }
    } catch(error) {
        console.log(error)
    }  
};

// Removes token at logout
const logoutUser = async (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
}

// Gets user information
const getProfile = async (req, res) => {
    // Checks if access token or refresh token is valid before sending user info
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.json({valid: false, message: "No refresh token"})
        } else {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
                if (err) {
                    return res.json({valid: false, message: "Invalid Refresh Token"})
                } else {
                    const accessToken = jwt.sign({
                        email: user.email, 
                        id: user._id, 
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '3d'
                    })
                    res.cookie('accessToken', accessToken, {maxAge: 24 * 60 * 60 * 1000})
                }
            })
        }
    } else {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => { 
            if (err) {
                return res.json({valid: false, message: "Invalid Token"})
            } else {
                res.json(user)
            }
        })
    }
}

// Gets all the list of stations 
const getStationList = async (req, res) => {
    const station = await Station.find();
    if (!station) {
        return res.json({
            error: 'No stations found'
        })
    }
    else {
        return res.json(station);
    }
}

// Adds a new station to the database
const addNewStation = async (req, res) => {
    try {
        const {name, pads, tampons, other, lat, long} = req.body;
        if (name == '') {
            return res.json({
                error: 'Name is empty.'
            })
        }
        const exist = await Station.findOne({name});
        if (exist) {
            return res.json({
                error: 'Name is taken already'
            })
        }
        const newStation = await Station.create({
            name: name,
            padQuantity: pads,
            tamponQuantity: tampons,
            otherQuantity: other,
            location: { 
                type: 'Point', 
                coordinates: [long, lat] 
            }
        })
        return res.json(newStation);
    } catch (error) {
        console.log(error);
    }
}

// Finds station by name and updates menstrual product quantities to given inputs
const editStation = async (req, res) => {
    try {
        const {name, pads, tampons, other} = req.body;
        const update = await Station.findOneAndUpdate(
            {name: name},
            {
                padQuantity: pads,
                tamponQuantity: tampons,
                otherQuantity: other,
            },
            {new: true}
        )
        return res.json(update);
    } catch (error) {
        console.log(error);
    }
}

// Deletes a station from the database
const deleteStation = async (req, res) => {
    try {
        const {name} = req.body;
        const update = await Station.deleteOne({name: name})
        return res.json(update);
    } catch (error) {
        console.log(error);
    }
}

// Gets list of locations with locations closest to the current user first
const sortDistance = async (req, res) => {
    try {
        const update = await Station.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [req.query.long, req.query.lat],
                    },
                },
            },
        })
        return res.json(update);
    } catch (error) {
        console.log(error);
    }
}

// Gets list of locations in alphabetical order
const sortAlphabetical = async (req, res) => {
    try {
        const update = await Station.find().collation({locale:'en',strength: 2}).sort({name:1})
        return res.json(update);
    } catch (error) {
        console.log(error);
    }
}

// Gets all locations that start with the given search input
const getSearch = async (req, res) => {
    try {
        const update = await Station.find({name: { $regex: req.query.searchInput, $options: "i" }})
        return res.json(update);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
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
}