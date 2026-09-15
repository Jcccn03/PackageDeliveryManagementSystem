const express = require('express');
const jwt = require('jsonwebtoken');
const { signUpUser, loginUser } = require('../firebase');
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

/**
 * Route to handle user signup.
 * Validates the username, password and confirmPassword and create a new user if validation passes.
 * @name POST /signup
 * @function
 * @param {string} path
 * @param {Function} callback
 * 
 * @example
 * // Request body
 * {
 *      "username": "user123",
 *      "password": "password1",
 *      "confirmPassword": "password1"
 * }
 */
router.post('/signup', async function(req, res){
    let user = req.body;

    // validation
    const isValidUsername = /^[A-Za-z0-9 ]{6,}$/.test(user.username);
    const isValidPassword = /^.{5,10}$/.test(user.password);

    console.log(isValidUsername);
    console.log(isValidPassword);

    if((!isValidUsername) || (!isValidPassword) ){
        return res.status(400).json({message: 'Invalid username or password'});
    } else if(user.password !== user.confirmPassword){
        return res.status(400).json({message: 'Passwords do not match'});
    }else{
        const result = await signUpUser(user.username, user.password);
        if (result.status == 'Signup successfully'){
            res.status(200).json({message: 'Sign up successfully'});
        }else{
            res.status(500).json({message: 'Error signing up'});
        }
    }
});

/**
 * Route to handle user login.
 * Validates the presence of username and password, and authenticates the user
 * Starts a session on successful login. 
 * @name POST /login
 * @function
 * @param {string} path
 * @param {Function} callback
 * 
 * @example
 * // Request body
 * {
 *      "username": "user123",
 *      "password": "password1"
 * }
 */
router.post('/login', async function (req, res) {
    const user = req.body;
    console.log(user);
    console.log(user.username);
    console.log(user.password);
    // user did not input one of username or password
    if (!user.username || !user.password){
        console.log('if (!user.username || !user.password)')
        return res.status(400).json({message: 'Username and password are required'});
    }

    try{
        console.log("try login user");
        const result = await loginUser(user.username, user.password);
        if(result.status === 'Login Successfully'){
            if (!jwtSecret) {
                return res.status(500).json({message: 'JWT secret is not configured'});
            }

            // Generate a JWT token upon successfully login
            const token = jwt.sign({username: user.username}, jwtSecret, {expiresIn: '5h'} );

            // send the token to the client
            res.status(200).json({token, message: result.status});
        }else{
            res.status(400).json({message: result.status});
        }
    } catch(err){
        res.status(500).json({message: 'Internal server error'});
    }
});

/**
 * Route to logout the user.
 * Validates the username, password and confirmPassword and create a new user if validation passes.
 * @name GET /logout
 * @function
 * @param {string} path
 * @param {Function} callback
 */
router.get('/logout', function(req, res){
    res.status(200).json({message: "Logout successfully"});
});

module.exports = router;