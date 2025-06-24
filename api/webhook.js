import express from 'express';
import connectAll from "../utils/connection";

const {mongoClient, mongoDB} = connectAll('vendor')
const app = express()
app.use(express.json())


app.post('/vendor-webhook/:vendor',async(req,res)=>{
    const {requestId,result} = req.body;

    await mongoDB.collection('jobs').updateOne({requestId},{$set:{status:'complete',result}});
    res.sendStatus(200);
})

app.listen(3003);