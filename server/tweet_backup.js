let express = require('express');
let pg = require('pg');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());

let pool = new pg.Pool({
    host : "localhost",
    port : 5432,
    user : "postgres",
    password : "root",
    database : "pepper_cloud",
    min: 10
})

var Twit = require('twit')

var T = new Twit({
    consumer_key:      '0XG5299e6oSESyHvLGIMGmwW3',
    consumer_secret:   'kh08Sydpo5hYYr0DCY8i7oJRAbxNkI1NKNpdStVi08ICIwBUOW',
    access_token:       '3097151617-91Ayf0gu7O81oe6ae3quLPX5cxYkf7pZlkNZ09h',
    access_token_secret:  'TPnK7IgPW0TB0m9NemXiyKAlZC6rBRpqi56w7sDhVxEgl',

})

router.get('/get-twitter-api',async(req,res,next) => {
  let searchkey = req.query.q
  let item_result="";
  try {
    let stream = T.stream('statuses/filter', { track: searchkey })
    var client = await pool.connect()
    let query = `insert into tbl_twitter_message(name,description,created_time,read_status) values($1,$2,$3,$4) returning id`
    let select_query = `select *  from tbl_twitter_message limit $1`
      stream.on('tweet', async (tweet) => {
       if([tweet].length>0) {
            Promise.all([tweet.user].map(async(item) => {
               item_result = await client.query(query,[item.name,item.description,new Date(),1])
           }))
        }
        if(item_result) {
            let select_result = await client.query(select_query,[25])
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(select_result.rows))
        }
    })
  } catch(err) {
     res.status(404).send({message: "data not found"})
  }  
})



 module.exports = router





 //Second Backup
 let express = require('express');
let pg = require('pg');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());

let pool = new pg.Pool({
    host : "localhost",
    port : 5432,
    user : "postgres",
    password : "root",
    database : "pepper_cloud",
    min: 10
})

var Twit = require('twit')

var T = new Twit({
    consumer_key:      '0XG5299e6oSESyHvLGIMGmwW3',
    consumer_secret:   'kh08Sydpo5hYYr0DCY8i7oJRAbxNkI1NKNpdStVi08ICIwBUOW',
    access_token:       '3097151617-91Ayf0gu7O81oe6ae3quLPX5cxYkf7pZlkNZ09h',
    access_token_secret:  'TPnK7IgPW0TB0m9NemXiyKAlZC6rBRpqi56w7sDhVxEgl',

})

getTweetsByKeyWord = async(searchkey) => {
 try {
    let client = await pool.connect()
    let select_query = `select *  from tbl_twitter_message where name ilike $1 limit $2`
    let select_result = await client.query(select_query,['%'+searchkey+'%',25])
    return select_result.rows
  } catch(err) {
    throw err;
  }
 
}
router.get('/get-twitter-api',async(req,res,next) => {
  let searchkey = req.query.q
  let item_result="";
  let query = `insert into tbl_twitter_message(name,description,created_time,read_status) values($1,$2,$3,$4) returning id`
  try {
    let client = await pool.connect()
    let result = await getTweetsByKeyWord(searchkey)
    if(result.length>0) {
        res.status(200).send(result)
        res.end()
    } else {
     console.log(searchkey)
      let stream = T.stream('statuses/filter', { track: searchkey })
      stream.on('tweet', async (tweet) => {
        if([tweet].length>0) {
            Promise.all([tweet.user].map(async(item) => {
               item_result = await client.query(query,[item.name,item.description,new Date(),1])
           }))
        }
        if(item_result) {
         console.log("called second")
          let result = await getTweetsByKeyWord(searchkey)
          console.log(JSON.stringify(result,null,2))
          // res.status(200).send(result)
          // res.end()
        }
      })
    }
  } catch(err) {
     res.status(404).send({message: "data not found"})
  }  
})

router.get('/get-all-tweets',async(req,res) => {
  let client = await pool.connect()
  let select_query = `select *  from tbl_twitter_message where read_status=$1`
  try {
    let select_result = await client.query(select_query,[1])
    res.status(200).send(select_result.rows)
    res.end()
  } catch(err) {
    res.status(500).send(err)
  }
})

router.put('/update-read-tweets/',async(req,res) => {
  let id  = req.query.q[0]
  let name = req.query.q[1]
  
  let client = await pool.connect()
  let update_query = `update tbl_twitter_message set read_status=$1 where id=$2 returning id`
  try {
    let update_result = await client.query(update_query,[0,id])
    if(update_result.rows.length>0) {
      let result = await getTweetsByKeyWord(name)
      res.status(200).send(result)
      res.end()
    }
   
  } catch(err) {
    res.status(500).send(err)
  }
})


 module.exports = router