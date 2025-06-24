const express = require('express')
const axios = require('axios')

const app = express()

app.use(express.json())

app.post('/fetch',(req,res) =>{
    const {requestId,payload} = req.body;
    setTimeout(()=>{
        axios.post("http://api:3000/vendor-webhook/async",{
            requestId,
            result: `Cleaned Async Response for ${JSON.stringify(payload)}`          
        })
    },5000);
    res.sendStatus(202);
});

app.listen(3002);