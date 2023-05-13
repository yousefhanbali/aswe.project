
module.exports = (req, res, next) => 
{
    req.app.get('db').query('SELECT * FROM `log_in` WHERE username = ? OR email = ?',
    [req.body.Username, req.body.Email],
    (err, result, fields)=>{
        if(err){
            return res.status(500).json({"Error":err});
        }else{
            if(result.length != 0){
                return res.status(400).json({"Error":"User or email already used."});
            } else next();
        }
    })

}