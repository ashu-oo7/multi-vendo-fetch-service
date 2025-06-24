import express from 'express';
import connectAll from '../utils/connection';
import {v4 as uuidv4} from 'uuid';


const {redisClient,mongoClient, mongoDB} = connectAll('vendor')
const app = express();


app.post('/jobs',async(req,res)=>{
    const requestId = uuidv4();
    await redisClient.xadd('jobs','*',{
        requestId,
        payload: JSON.stringify(req.body),    
    });

    await mongoDB.collection('jobs').insertOne({requestId,status:'pending'});
    res.json({request_id: requestId});

});

app.get('/jobs/:requestId',async(req,res)=>{
    const job = await mongoDB.collection('jobs').findOne({requestId: req.params.requestId});
    if(!job)return res.status(404).send('Not Found');

    if(job.status === 'complete') res.json({status:'complete',result:job.result});
    else res.json({status: job.status});

});



app.listen(3000,()=>console.log('Server is running'));