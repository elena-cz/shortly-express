const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser.js');

var setSessionAndCookie = function(req, res, next) {
  models.Sessions.create()
    .then( (createResult) => {
      return models.Sessions.get({id: createResult.insertId});
    })
    .then((sessionDbResult) => {
      var cookie = sessionDbResult.hash;
      req.cookies.shortlyid = cookie;
      res.cookies.shortlyid = {value: cookie};
      req.session = sessionDbResult;
      next();
    });
};


module.exports.createSession = (req, res, next) => {
  if (req.cookies.shortlyid) {
    // at this point, they have a cookie (they've been to the site before)
    // Get Sessions data for shortlyid (i.e. hash) from DB
    return models.Sessions.get({hash: req.cookies.shortlyid})
    .then( (session) => {
      if (!session) {
        setSessionAndCookie(req, res, next);
      } else {
        // now we have the session object
        // we know user has been here before b/c a session object exists for this shortlyId
        // we know this user is ALSO logged in if session.user exists
        req.session = session;
        res.session = session;
        // this next line checks whether they have userID stored in Sessions for hash, which would mean they are logged in
        models.Sessions.isLoggedIn(session);
        next();
      }
    })
    // .then( (isLoggedInResult) => {
    //   next();
    // })
    .catch();
  } else {
    setSessionAndCookie(req, res, next);
  }
};







/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

