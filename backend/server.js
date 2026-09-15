const express = require('express');
const mongoose = require('mongoose');
let path = require('path');

const driverRouter = require('./controllers/driver-controller');
const packageRouter = require('./controllers/package-controller');
const userRouter = require('./controllers/user-route');
const {db} = require('./firebase');
const http = require('http');
const PORT_NUMBER = 8080;
const app = express();
const url = process.env.MONGO_URI || 'mongodb://localhost:27017/a2PDMAapp';
const server = http.createServer(app);
const jwt = require('jsonwebtoken');

// import the google cloud client library
const {Translate} = require('@google-cloud/translate').v2;
// instantiates a client
const translate = new Translate();

const fs = require('fs');
// imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// instantiates a client
const client = new textToSpeech.TextToSpeechClient();

const { Server } = require('socket.io');
const io = new Server(server);

const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini_api_key = process.env.GEMINI_API_KEY;

if (!gemini_api_key) {
    throw new Error('GEMINI_API_KEY is required.');
}

const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
    geminiConfig,
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/output.mp3', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

// socket io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('translateRequest', async({description, language}) => {
        console.log(description);
        console.log(language);
        try{
            const [translation] = await translate.translate(description, language);
            socket.emit('translationResponse', {translatedText: translation});
        } catch(error){
            console.error('Error translating text:', error);
            socket.emit('translationResponse', {translatedText: 'Error in translation'});
        }
    });

    socket.on('text2speechRequest', async({driverLicense}) => {
        const text = driverLicense;
        const request = {
            input: {text: text},
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            audioConfig: {audioEncoding: 'MP3'},
        };

        client.synthesizeSpeech(request, (err, response) => {
            if(err){
                console.error("ERROR:", err);
                return;
            }

            const audioFileName = 'output.mp3';
            const audioFilePath = path.join(__dirname, '..', 'public', audioFileName);

            fs.writeFile(audioFilePath, response.audioContent, 'binary', (err) => {
                if(err){
                    console.error("ERROR:", err);
                    return;
                }

                console.log("Audio content written to file:", audioFilePath);

                const audioFileUrl = `/${audioFileName}?t=${Date.now()}`; // append a timestamp as a query parameter
                socket.emit('text2speechResponse', {audioFileUrl});
            });
        });
    });

    socket.on('distanceRequest', async({location}) => {
        const result = await geminiModel.generateContent(`What is the distance in kilometres from ${location} to Melbourne?`);
        // console.log(result.response.text());
        socket.emit('distanceResponse', {aiResponse: result.response.text()});
    })
});

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    if(!token){
        return res.status(401).json({message: 'Access denied'});
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({message: 'JWT secret is not configured'});
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if(err){
            return res.status(403).json({message: "Invalid token"}); 
        }
        req.user = user; // set the user in the request
        next();
    });
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./dist/asgn3/browser'));

app.use(function(req, res, next){
    console.log(req.url);
    next();
});

server.listen(PORT_NUMBER, function(){
    console.log(`Listening on port ${PORT_NUMBER}`)
});


async function connect(){
    await mongoose.connect(url);
    return "Connected Successfully";
}

connect().catch((err) => {console.log(err);})

app.get('/api/v1/drivers', authenticateToken, driverRouter.getAllDrivers);
app.get('/api/v1/drivers/:id', authenticateToken, driverRouter.getOne);
app.post('/api/v1/drivers', authenticateToken, driverRouter.createDriver);
app.delete('/api/v1/drivers/:id', authenticateToken, driverRouter.deleteDriverById);
app.put('/api/v1/drivers/:id', authenticateToken, driverRouter.updateById);

app.get('/api/v1/packages', authenticateToken, packageRouter.getAllPackages);
app.get('/api/v1/packages/:id', authenticateToken, packageRouter.getOne);
app.post('/api/v1/packages', authenticateToken, packageRouter.createPackage);
app.delete('/api/v1/packages/:id', authenticateToken, packageRouter.deletePackageById);
app.put('/api/v1/packages/:id', authenticateToken, packageRouter.updateById);

app.get('/api/v1/stats', authenticateToken, async function(req, res){
    const docRef = db.collection('operationCounts').doc('stats');
    const doc = await docRef.get();

    // check if the document exists
    if(doc.exists){
        let counters = doc.data();
        res.status(200).json({
            create: counters.create, 
            retrieve: counters.retrieve, 
            update: counters.update, 
            delete: counters.delete});
    }else{
        res.status(200).json({
            "create": 0, 
            "retrieve": 0, 
            "update": 0, 
            "delete": 0});
    }
});

app.use('/api/v1/users', userRouter);