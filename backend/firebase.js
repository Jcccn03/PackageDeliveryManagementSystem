/**
 * This module provides the functions to interact with Firebase Firestore for user management and CRUD operation counters.
 * The functions include incrementing counters for CRUD operations, user sign-up and login functionality.
 */
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function loadServiceAccount() {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    }

    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, 'service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
        return JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    }

    throw new Error('Firebase service account credentials are not configured.');
}

// initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount()),
});

// create a firebase instance
const db = admin.firestore();

// firebase functions to increment counters
/**
 * Increment the counter for a specific CRUD operation in the Firestore database
 * 
 * This function updates the operation count for Create, Retrieve, Update, Delete in the 'operationCounts' collection.
 * If the document does not exists, it initializes the document with 0.
 * @param {string} operation - The CRUD operation to increment (e.g., 'create', 'retrieve', 'update', 'delete')
 */
async function incrementCRUDCounter(operation) {
    const docRef = db.collection('operationCounts').doc('stats');
    try{
        const doc = await docRef.get();
        if (doc.exists){
            let data = doc.data();
            data[operation] = (data[operation] || 0) + 1;
            await docRef.update({[operation]: data[operation]});
        } else{
            // if the doc does not exist, create it with initial values
            await docRef.set({
                create: 0,
                retrieve: 0,
                update: 0,
                delete: 0
            });
        }
    } catch(err){
        console.log(`Error updating CRUD counter: ${err}`);
    }
};

/**
 * Check if a user exists with the given username and password.
 * @param {string} username
 * @param {string} password 
 * @returns {boolean} - returns true if a matching user is found and the password is correct, false otherwise
 */
async function checkUserExist(username, password) {
    // searches the 'users' collection for a document where the 'username' field matches the username passed in
    // there may be same username but not the same person trying to sign up/login
    // so password also need to be verified
    if (username && password){
        const userCollection = await db.collection('users').where('username', '==', username).get();
        if (!userCollection.empty){
            for( let doc of userCollection.docs){
                const userData = doc.data();
                if(userData.password === password){
                    console.log("user exists");
                    return true;
                }
            }
        }
        return false; 
    } else{
        return false;
    }
    
};

/**
 * Sign up a new user with the provided username and password.
 * This function first check if the user already exists. If not, it creates a new user document
 * in the 'users' collection with the provided username and password.
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns {status: string} - Returns an object with status of the signup operation
 */
async function signUpUser(username, password) {
    try{
        const userExists = await checkUserExist(username, password);
        if(userExists){
            return {status: 'User already exists. Please login.'};
        }else{
            // create a new document for the new user in the 'users' collection of the firestore
            await db.collection('users')
                .doc()
                .set({
                    username: username,
                    password: password
                });
            console.log('Signup successfully');
            return {status: 'Signup successfully'};
        }
    }catch(err){
        console.log('Error adding user:', err);
        return {status: 'Error signing up user'};
    }
};

/**
 * Log in a user with the provided username and password
 * This function check if the user exists and the provided password matches the stored password
 * @param {*} username 
 * @param {*} password 
 * @returns {status: string} ' returns an object with the status of the login operation
 */
async function loginUser(username, password) {
    try{
        const userExist = await checkUserExist(username, password);
        if(userExist){
            console.log('Login Successfully');
            return {status: 'Login Successfully'};
        } else{
            console.log('Wrong username or password');
            return {status: 'Wrong username or password'};
        }
        
    } catch(err){
        console.log('Error logging in:', err);
        return {status: 'Error logging in'};
    }
}

// export functions and firestore database instance for use in other modules
module.exports = {incrementCRUDCounter, db, signUpUser, loginUser};