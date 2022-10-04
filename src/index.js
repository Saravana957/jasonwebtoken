require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const { fakeDB } = require('./fakeDB.js');

//1. Register a user
//2. Login a user
//3. Logout a user
//4. setup a protected route 
//5. Get a new access token with a refresh token.

const server = express();

//Use express middleware for easier cookie handling
server.use(cookieParser());

server.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

//needed to be able to read json body data
server.use(express.json());//to support json encoded bodies. 
server.use(express.urlencoded({extended: true})); //support url encoded bodies. 

//1. Register a user
server.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try{
        // 1. check if the user exist
        const user = fakeDB.find(user => user.email === email)
        if (user) throw new Error('User already exist');
        const hashedPassword = await hash(password, 10);
        fakeDB.push({
            id: fakeDB.length,
            email,
            password: hashedPassword,
        })
        res.send({message: 'User Created'})
        console.log(fakeDB); 
    } catch(err){
        res.send({
            error: `${err.message}`,
        })
    }
})


server.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
})