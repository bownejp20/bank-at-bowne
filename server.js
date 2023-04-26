const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {MongoClient, ObjectId} = require('mongodb')

require('dotenv').config() // how to import the .env file

var db, collection;

const url = process.env.URL
const dbName = process.env.DBNAME

app.listen(4000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('transactions').find().toArray((err, result) => {
    if (err) return console.log(err)
  //  const ttl = db.collection('transactions').aggregate([
  //     {$group:{
  //       _id: null, ttlAmount: {$sum:'$amount'}
  //     }}
  //   ])
  //   console.log(ttl.ttlAmount)
console.log(result)
    res.render('index.ejs', {
      user: {
        name: 'Jessica'
      },
      transactions: result,
      balance: result.reduce((accum, num) => accum + num.amount, 0)
    })
  })
})

app.post('/transactions', (req, res) => {
  const {type, amount, comment} = req.body
  console.log(req.body)
  db.collection('transactions').insertOne({type, amount, comment}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.post('/transactions/withdrawl', (req, res) => {
  const {type, amount, comment} = req.body
  console.log(req.body)
  db.collection('transactions').insertOne({type, amount, comment}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/transactions', (req, res) => {
  console.log(req.body)
  const {comment, id} = req.body
  console.log(id)
  db.collection('transactions')
    .findOneAndUpdate({"_id":ObjectId(id) }, {
      $set: {
        comment: comment 
      }
    }, {
      // sort: { _id: -1 },
      returnOriginal : false
      // upsert: true //if record not found then create one 
    }, (err, result) => {
      if (err) return res.send(err)
      console.log(result)
      res.send(result)
    })
})

app.put('/messages/thumbDown', (req, res) => {
  db.collection('messages')
    .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
      $inc: {
        thumbDown: - 1
      }
    }, {
      sort: { _id: -1 },
      upsert: true  //might be a bug later on that leon leaves and you need to fix
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/transactions', (req, res) => {
  const {id} = req.body
  db.collection('transactions').findOneAndDelete({_id:ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('transaction deleted!')
  })
})
