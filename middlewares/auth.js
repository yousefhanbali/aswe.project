const JWT = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(401).json({error : "Not Authorized"});
    }
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env['JWT_SECRET']);
        res.locals.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        if(err.name == 'TokenExpiredError'){
            return res.status(401).json({ message: "Your token has expired, please login another time and try again." });
        }else if(err.name == 'JsonWebTokenError'){
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}