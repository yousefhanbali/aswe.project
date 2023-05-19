const Express = require('express');
const JWT = require('jsonwebtoken');
const multer = require("multer");
const { resume } = require('../database/connection');
const auth = require('../middlewares/auth.js');
const Router = Express.Router();

const upload = multer();



Router.post('/api/jobs/:jobId/apply', auth,upload.array("files",2), async (req, res) => {
    try {
      const { jobId } = req.params;
      const  coverLetter  = req.files[1].buffer;
      const  resume  = req.files[0].buffer; 
      

    // Check if the job listing exists
        await req.app.get("db").query('SELECT * FROM jobs WHERE J_id = ?', [jobId], function(error,result){
        if (error){
            return res.status(500).json({Message: 'an error occured1'})
        }
        if (result.length === 0) {
            return res.status(404).json({ Message: 'Job not found, try a different ID' });
          }
    });

    // Create a new application
    const dateApplied = new Date().toISOString();
    const status = 'Submitted';
    const query = `INSERT INTO job_applications (J_id, JS_id, resume_url, cover_title, date_applied, status)
      VALUES (?, ?, ?, ?, ?, ?)`;
      console.log(jobId, res.locals.user.id, resume, coverLetter, dateApplied, status);
    const values = [jobId, res.locals.user.id, resume, coverLetter, dateApplied, status];
    await req.app.get("db").query(query, values, function(error,result){
        if (error){
            console.log(error);
            return res.status(500).json({Message: 'an error occured2'})
        }
        return res.status(201).json({ Message: 'Application submitted successfully' });

    });

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: 'An error occurred while submitting the application' });
  }
});


// Retrieve a job application by ID
Router.get('/api/job_applications/:applicationId', auth, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const query = 'SELECT * FROM job_applications WHERE JA_id = ?';
     await req.app.get("db").query(query, [applicationId], function(error,result){
        if (error){
            return res.status(500).json({Message: 'an error occured'})
        }
        if (result.length === 0) {
            return res.status(404).json({ Message: 'Job application not found' });
          }
        console.log(result);
        console.log(error);
        return res.status(200).json(result);
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: 'An error occurred while retrieving the job application' });
  }
});


// Update a job application
Router.put('/api/job_applications/:applicationId', auth, upload.array("files",2), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const  coverLetter  = req.files[1].buffer;
      const  resume  = req.files[0].buffer; 
      const { status } = req.body; 
       
      const query = `UPDATE job_applications SET resume_url = ?, cover_title = ?, status = ? WHERE JA_id = ?`;
      const values = [resume, coverLetter, status, applicationId];
      await req.app.get("db").query(query, values, function(error,result){
        if (error){
            return res.status(500).json({Message: 'an error occured'})
        }
        return res.status(200).json({ Message: 'Job application updated successfully' });
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ Error: 'An error occurred while updating the job application' });
    }
  });


  // Delete a job application
Router.delete('/api/job_applications/:applicationId', auth, async (req, res) => {
    try {
      const { applicationId } = req.params;
  
      const query = 'DELETE FROM job_applications WHERE JA_id = ?';
      await req.app.get("db").query(query, [applicationId], function(error,result){
        if (error){
            return res.status(500).json({Message: 'an error occured'})
        }
        return res.status(200).json({ Message: 'Job application deleted successfully' })
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ Error: 'An error occurred while deleting the job application' });
    }
  });
  
  module.exports = Router;