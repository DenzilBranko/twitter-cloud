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
  min: 100
})

const Twit = require('twit')
const T = new Twit({
    consumer_key:     "", 
    consumer_secret:   '',
    access_token:       '',
    access_token_secret:  '',
})

getKeyWordCount = async(client,searchkey) => {
  try {
    let count_query = `select count(*) as total_count from tbl_twitter_message where search_keyword ilike $1`
    let count_result = await client.query(count_query,['%'+searchkey+'%'])
    return count_result.rows
  } catch(err) {
    throw err;
  }
}

getTweetsByKeyWord = async(client,searchkey) => {
  try {
    let select_query = `select *  from tbl_twitter_message where search_keyword ilike $1 limit $2`
    let select_result = await client.query(select_query,['%'+searchkey+'%',25])
    return select_result.rows
  } catch(err) {
    throw err;
  }
}
//
router.get('/get-twitter-api',async(req,res,next) => {
  let searchkey = req.query.q
  let item_result="";
  let query = `insert into tbl_twitter_message(name,description,created_time,search_keyword,read_status) values($1,$2,$3,$4,$5) returning id`
  try {
    let client = await pool.connect()
      let stream = T.stream('statuses/filter', { track: searchkey })
      stream.on('tweet', async (tweet) => {
        if([tweet].length>0) {
            Promise.all([tweet.user].map(async(item) => {
               item_result = await client.query(query,[item.name,item.description,new Date(),searchkey,1])
           }))
        }
        if(item_result) {
          let result = await getTweetsByKeyWord(client,searchkey)
          let count = await getKeyWordCount(client,searchkey)
          req.app.io.emit('twitterSend', count);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ result: result }));
        }
      })
    } catch(err) {
     res.status(500).send({message: "oops..! something went wrong"})
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