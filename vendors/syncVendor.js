const express = require('express');
const app = express();

app.use(express.json());

app.post('/fetch',(req,res) =>{
    res.json({data: `Cleaned Sync response for ${JSON.stringify(req.body.payload)}`});

})

app.listen(3001);