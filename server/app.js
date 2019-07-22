let express = require('express');
let app = express();
let cors = require('cors')

const twitterApp = require('./twitterapp')
app.use(cors())

app.use('/api',twitterApp,(req,res,next)=>{})

module.exports = app;