const Express = require('express');
const JWT = require('jsonwebtoken');
const sha256 = require('js-sha256').sha256;
const Router = Express.Router();

Router.post('/api/login',
    function(req, res, next){
        // Determining if user exists!
        const userName = req.body.Username;
        const password = sha256(req.body.Password);
        req.app.get('db').query(
            'SELECT * FROM `log_in` WHERE userName = ? and password = ?',
            [userName, password],
            function(err, result, fields){
                if(err){
                    return res.status(500).json({"Error":err});
                }else{
                    if(result.length != 0){
                        res.locals.user = result[0];
                        next(); // Exists
                    }
                    else return res.status(404).json({"Message":"User or password is incorrect, please try again."});
                }
            }
    )
    },
    function(req, res) {
        // Determing type
        req.app.get('db').query(
            'SELECT * FROM `employers` where email = ?',
            [res.locals.user.email],
            function(err, result, fields){
                if(err){
                    return res.status(500).json({"Error":err});
                }else{
                    if(result.length != 0){
                        return res.status(200).json({
                            type: 'Employer',
                            id:result[0].E_id,
                            user: res.locals.user,
                            token: JWT.sign(
                                {
                                    type: 'Employer',
                                    id:result[0].E_id,
                                    user: res.locals.user
                                },
                                process.env['JWT_SECRET'],
                                {
                                    expiresIn: process.env['TOKEN_LIFETIME']+"m"
                                }
                            )
                        });
                    }
                }
            }
    );
    req.app.get('db').query(
        'SELECT * FROM `job_seekers` where email = ?',
        [res.locals.user.email],
        function(err, result, fields){
            if(err){
                return res.status(500).json({"Error":err});
            }else{
                if(result.length != 0){
                    return res.status(200).json({
                        type: 'JobSeeker',
                        id: result[0].JS_id,
                        user: res.locals.user,
                        token: JWT.sign(
                            {
                                type: 'JobSeeker',
                                id: result[0].JS_id,
                                user: res.locals.user
                            },
                            process.env['JWT_SECRET'],
                            {
                                expiresIn: process.env['TOKEN_LIFETIME']+"m"
                            }
                        )
                    });
                }
            }
        }
    )
  });

module.exports = Router;