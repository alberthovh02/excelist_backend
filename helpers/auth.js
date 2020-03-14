const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  if(!bearerHeader){
    res.sendStatus(403)
  }else{
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next()
  }
}
