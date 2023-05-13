module.exports = (req, res, next) =>{
    if(!req.body.Username || !req.body.Password || !req.body.Email || !req.body.Name  || !req.body.Phone)
        return res.status(400).json({"Error": "There is insufficient information, please try again"});
    if(req.body.Password.length < 8){
        return res.status(400).json({"Error": "The password is too short." });
    }

    next()
}