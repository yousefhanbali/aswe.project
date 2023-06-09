const Express = require('express');
const Router = Express.Router();
const Validator = require('../middlewares/signUpInputValidation');
const UserExist = require('../middlewares/UserExist.js');
const sha256 = require('js-sha256').sha256;

Router.post('/api/signup/employer', Validator, UserExist,function(req, res, next){
    // Validating 
    if(!req.body.CompanyName){
        return res.status(400).json({"Error": "There is insufficient information, please try again"});
    }

    // Inserting into Login Table
    req.app.get('db').query('insert into log_in(username, email, password) values(?,?,?)',
    [req.body.Username, req.body.Email, sha256(req.body.Password)],
    (error) => {
        if(error){
            return res.status(500).json({"Error":err});
        }else{
            next();   
        }
    });
},
function(req, res){
    // Inserting into employers table
    req.app.get('db').query('INSERT INTO `employers` (`Name`, `email`, `password`, `phone`, `Company_Name`) VALUES(?,?,?,?,?)',
    [req.body.Name, req.body.Email, sha256(req.body.Password), req.body.Phone, req.body.CompanyName],
    (error) => {
        if(error){
            return res.status(500).json({"Error":err});
        }else{
            return res.status(200).json({user: req.body}) 
        }
    });
});

Router.post('/api/signup/seeker', Validator, UserExist,function(req, res, next){
    // Inserting into Login Table
    req.app.get('db').query('insert into log_in(username, email, password) values(?,?,?)',
    [req.body.Username, req.body.Email, sha256(req.body.Password)],
    (error) => {
        if(error){
            return res.status(500).json({"Error":err});
        }else{
            next();   
        }
    });
},
function(req, res){
    // Inserting into employers table
    req.app.get('db').query('INSERT INTO `job_seekers` (`Name`, `email`, `password`, `phone`) VALUES(?,?,?,?)',
    [req.body.Name, req.body.Email, sha256(req.body.Password), req.body.Phone],
    (error) => {
        if(error){
            return res.status(500).json({"Error":err});
        }else{
            return res.status(200).json({user: req.body}) 
        }
    });
});

module.exports = Router;