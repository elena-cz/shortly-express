const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser.js');

module.exports.createSession = (req, res, next) => {
  console.log('req.cookies', req.cookies);
  
  if (req.cookies.shortlyid) {
    // at this point, they have a cookie (they've been to the site before)
    // Get Sessions data for shortlyid (i.e. hash) from DB
    return models.Sessions.get({hash: req.cookies.shortlyid})
    .then( (session) => {
      // now we have the session object
      // we know user has been here before b/c a session object exists for this shortlyId
      // we know this user is ALSO logged in if session.user exists
      req.session = session;
      res.session = session;
    // this next line checks whether they have userID stored in Sessions for hash, which would mean they are logged in
      
      models.Sessions.isLoggedIn(session);
    })
    .then( (isLoggedInResult) => {
      next();
      
    })
    .catch();
      
 
  } else {
    models.Sessions.create()
    .then( (createResult) => {
      return models.Sessions.get({id: createResult.insertId});
    })
    .then((sessionDbResult) => {
      res.cookies.shortlyid = {value: sessionDbResult.hash};
      req.session = sessionDbResult;
      next();
    });
  }
  
};


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

