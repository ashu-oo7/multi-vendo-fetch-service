import redis from 'redis';
import axios from 'axios';

import connectAll from '../utils/connection'

const {mongoClient,redisClient,mongoDB} = connectAll('vendor');

( async()=>{

    while(true){
        const response = await redisClient.xRead({streams: {jobs: '>'}},{COUNT:1,BLOCK:5000});
        if(!response)continue;

        const [stream,entries] = response[0];
        const [id,fields] = entries[0];
        const requestId = fields.requestId;
        const payload = JSON.parse(fields.payload);

        await mongoDB.collection('jobs').updateOne({requestId},{$set: {status:'processing'}});

        const vendorUrl = payload.async
        ? "http://async-vendor:3002/fetch"
        : "http://sync-vendor:3001/fetch";

        try{
            if(payload.async){
                await axios.post(vendorUrl,{requestId,payload})
            }
            else{
                const result = await axios.get(vendorUrl,{payload});
                await mongoDB.collection('jobs').updateOne({requestId},{$set: {status: 'complete', result: result.data}});
            }
        }
        catch(err){
            await mongoDB.collection('jobs').updateOne({requestId},{$set: {status: 'failed'}});
        }  
    }
})();