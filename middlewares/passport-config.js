const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const Admin = require('../db/models/admin');

module.exports = function (app) {
    app.use(session({
        secret: `${process.env.SS}`,
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
            mongoUrl: `${process.env.MONGOURL}`,
            autoIndex: false, 
            collection: 'sessions',
            ttl: 14 * 24 * 60 * 60, 
            cookie: {
                expires: false, 
            }
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser(Admin.serializeUser());
    passport.deserializeUser(Admin.deserializeUser());

    passport.use(new LocalStrategy(Admin.authenticate())); 

}
