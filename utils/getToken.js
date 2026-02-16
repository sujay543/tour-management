const jwt = require('jsonwebtoken');
module.exports = function(userId){
    return jwt.sign({id: userId},process.env.JWTSECRETKEY,{ expiresIn: process.env.JWTexpire });
}