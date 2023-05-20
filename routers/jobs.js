const Express = require('express');
const JWT = require('jsonwebtoken');
const Router = Express.Router();
const auth = require('../middlewares/auth.js');

const checkJobOwnership = function(req, res, next){
    // Checking if he is authroized to delete(Has same employer ID as the job)
    if(res.locals.currentJob.E_id == res.locals.user.id){
        // Authorized
        next()
    }else{
        // Not Authorized
        return res.status(401).send("You cannot access this job because it does not belong to you.");
    } 
}

const checkJobExist = function(req, res, next){
    // Checking if job exists
    req.app.get('db').query(
        'SELECT * from jobs where J_id = ?',
        [req.params.id],
        function(err, result){
            console.log(req.params.id);
            if(err){
                return res.status(500).json({"Error":err});
            }else{
                if(result.length == 0){
                    return res.status(404).json({"Message":"Job not found, try different ID"});
                }else{
                    res.locals.currentJob = result[0];
                    next();
                }
            }
        }
    )
}

const employerCheck = function(req, res, next){
    if(res.locals.user.type != "Employer"){
        return res.status(400).json({"Message":"You can't post a job because you are not an employer"});
    }

    next();
}


Router.get('/api/jobs/search', async function(req, res){
    var listedSearchProps = Object.keys(req.query);

    if(listedSearchProps.includes('page')){
        page = req.query['page'];
    }
    if(listedSearchProps.includes('pagingSize')){
        pagingSize = req.query['pagingSize'];
    }
    req.app.get('db').query('SELECT * FROM JOBS ORDER BY date_posted', function(err, result){
        if(err){
            console.log(err);
        }else{
            if(listedSearchProps.length > 0){
                result = result.filter(
                    (entry)=>{
                        for(i=0; i<listedSearchProps.length; i++){
                            console.log(req.query[listedSearchProps[i]]);
                            if(!Object.keys(entry).includes(listedSearchProps[i])){
                                continue;
                            }
                            if(!isNaN(req.query[listedSearchProps[i]])){
                                if(req.query[listedSearchProps[i]] == entry[listedSearchProps[i]]){
                                    return true;
                                }
                            }else{
                                if(entry[listedSearchProps[i]].toLowerCase().includes(req.query[listedSearchProps[i]].toLowerCase())){
                                    return true;
                                }
                            }

                        }
                        return false;
                    }
                );
            }
            return res.status(200).json(result);
        }
    });    
});

Router.get('/api/jobs', auth, employerCheck, function(req, res) {
    req.app.get('db').query(
        'SELECT * FROM jobs WHERE E_id = ?',
        [res.locals.user.id],
        function(err, result){
            if(err){
                return res.status(500).json({"Error":err});
            }else{
                if(result.length == 0){
                    return res.status(404).send('Job not found');
                }else{
                    return res.status(200).json(result);
                }
            }
        });
});

Router.get('/api/jobs/:id', auth, function(req, res) {
    req.app.get('db').query(
        'SELECT * FROM jobs WHERE J_id = ?',
        [req.params.id],
        function(err, result){
            if(err){
                return res.status(500).json({"Error":err});
            }else{
                if(result.length == 0){
                    return res.status(404).send('Job not found');
                }else{
                    return res.status(200).json(result[0]);
                }
            }
        });
});

Router.post('/api/jobs', auth, employerCheck,
    function(req, res){
        if(!req.body.title || !req.body.description || !req.body.requirement || !req.body.salary_range_min || !req.body.salary_range_max || !req.body.salary_range_max || !req.body.location){
            return res.status(400).json({"Error": "There is insufficient information, please try again"});
        }
        req.app.get('db').query(
            'INSERT INTO `jobs` (`E_id`, `title`, `description`, `requirement`, `salary_range_min`, `salary_range_max`, `location`, `date_posted`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                res.locals.user.id,
                req.body.title,
                req.body.description,
                req.body.requirement,
                req.body.salary_range_min,
                req.body.salary_range_max,
                req.body.location,
                new Date()
            ],
             function(err){
                if(err){
                    return res.status(500).json({"Error":err});
                }else{
                    return res.status(200).json({"Message":"OK"});
                }
             });
});

Router.delete('/api/jobs/:id', auth, employerCheck, checkJobExist, checkJobOwnership,
function(req, res, next){
    // Checking if he is authroized to delete(Has same employer ID as the job)
    if(res.locals.currentJob.E_id == res.locals.user.id){
        // Authorized
        req.app.get('db').query('DELETE FROM jobs WHERE J_id = ?',
        [res.locals.currentJob.J_id],
        function(err){
            if(err){
                return res.status(500).json({"Error":err});
            }else{
                return res.status(200).send('');
            }
        }
        )
    }else{
        // Not Authorized
        return res.status(401).send("You cannot delete this job because it does not belong to you.");
    }
});

Router.put('/api/jobs/:id', auth, employerCheck, checkJobExist, checkJobOwnership,
    function(req, res){
        if(Object.keys(req.body).length == 0)
            return res.status(200).send('No changes');
        const listToUpdate = Object.keys(req.body);
        var list = []
        listToUpdate.forEach((currentValue, index, arr) =>{
            list.push(req.body[currentValue]);
        });
        var query = 'UPDATE jobs SET ';
        index = 0;
        while(listToUpdate.length > index){
            query = query + listToUpdate[index]+'= ?';
            if(index != listToUpdate.length-1)
                query = query + ','
            index++;
        }
        query += ' WHERE J_id = '+req.params.id;

        req.app.get('db').query(query, list, function(err, result){
            if(err){
                return res.status(500).json({"Error":err});
            }else{
                return res.status(200).send('Updated');
            }
    });
});


module.exports = Router;