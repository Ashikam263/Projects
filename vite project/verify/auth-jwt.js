//STep 1:import necessary modules
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

//Step 2 : secret key to sign the JWT
const SECRET_KEY = 'your_secret_key';

//Step 3: simulated user "database"
const fakeUser = {
  id: 1,
  username: 'user',
  password: 'password' 
};

//Step 4 : Login route - returns jwt if credentials are valid
app.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;

  //Step 5: Validate user credentials
  if (username === fakeUser.username && password === fakeUser.password) {
    //Step 6: Create a token payload
    const payload = { id:fakeUser.id, username: fakeUser.username };

    //Step 7: Sign the token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }

});

//Step 8 : Middleware to verify JWT
const verifyToken = (req, res, next) => {

    //Step 9: Get token from Authorization header
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];

        //Step 10: Verify token
        jwt.verify(token, SECRET_KEY, (err, authData) => {
            if(err) {
                res.status(403).json({ message: 'Invalid Credentials' });
            } else {

                //Step 11: Attach auth data to request object
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({ message: 'No token provided' });
    }
};

//Step 12: Protected route
app.get('/protected', verifyToken, (req, res) => {
    res.json({ 
        message: 'This is a protected route',
        user: req.user });
});

//Step 13: Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});