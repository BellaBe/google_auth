const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('./models/User');
require('./config/passport')(passport);

const auth = require('./routes/auth');
const keys = require('./config/keys');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
.then(() =>{
  console.log('MongoDB connected');
})
.catch(err => console.log(err));

const app = express();

app.get('/', (req, res)=>{
  res.send('it works');
});

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next)=>{
  res.locals.user = req.user || null;
  next();
});

app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
  console.log(`App is running on port ${port}`);
});