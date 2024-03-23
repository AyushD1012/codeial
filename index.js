const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 9356;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');


const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle= require('./config/passport-google-oauth2-strategy');

//setup chat server to used in socket.io
const chatServer= require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(7856);
console.log('chat server is listening on port number 7856');

const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'

}));

// mongo store to sign in untill sign out 
// const MongoStore = require('connect-mongo')(session);    

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);





// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeial',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },

    // mongo store
    store: new MongoStore(
        {

            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function (err) {
            console.log('err || connect-mongodbsetup');
        }
    )
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
