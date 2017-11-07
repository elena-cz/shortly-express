const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser.js');

module.exports.createSession = (req, res, next) => {
  console.log('req.cookies', req.cookies);
  
  if (req.cookies.shortlyid) {
    
    return models.Sessions.get({hash: req.cookies.shortlyid})
    .then( (session) => {
      res.session = session;
      models.Sessions.isLoggedIn(session);
    })
    .then( (result) => {
      
      
    })
    .catch();
      
    // } else {
      
    // }
  } else {
    console.log('In create session');
    models.Sessions.create()
    .then( (result) => {
      return models.Sessions.get({id: result.insertId});
    })
    .then((result) => {
      console.log('result from creating session: \n\n', JSON.stringify(result, null, 2));
      req.session = result;
      next();
    });
  }
  
};


// module.exports.checkSession = (req, res, next) => {
//   // We have cookies, not literally
//   // Get shortlyid
//   // Query the DB for session ID (Session.get({id: sessionID}))
//   // return true or false if exists
  
//   return new Promise(function(resolve, reject) {
//     let result;
//     if (req.cookies.shortlyid) {
//       models.sessions.get();
      
//     } else {
      
//     }
    
//     resolve(result);
    
//   });
  
  
//   console.log('req.cookies', req.cookies);
  
// };

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

