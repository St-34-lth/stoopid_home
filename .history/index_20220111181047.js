const express = require('express')

const mysql = require('mysql')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require('path')
const app = express()
const port = 8089
const ejsLint = require('ejs-lint')
const db = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '1337ub3r',
          database: 'home'})

db.connect((err) => {
          if(err)
          {
                    console.log(err);
                    throw err                   
          }
          else 
          {
                    console.log('Connected to database');
          }})

global.db = db
 

app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html',ejs.renderFile)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

// const queryController = require('./models/test.js')
const homeController = require('./routes/main.js')

// app.use('/test',testQuery)

app.use('/',homeController)

app.listen(port,() => console.log(`listening on port ${port}!`));

// console.log(ejsLint('./views/templates/del.ejs',{}))
