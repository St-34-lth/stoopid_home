const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require('path')
const app = express()
const port = 8089

// Setup the db
const db = mysql.createConnection({
          port: 3306,
          name: 'home_db',
          host: 'localhost',
          user: 'root',
          password: '1337ub3r',
          database: 'home'
})
// Connect to the db
db.connect((err) => {
          if (err) {
                    console.log(err);
                    throw err
          }
          else {
                    console.log('Connected to database');
          }
})
// make the db engine instance a global node variable
global.db = db
// set the express template engine views path
app.set('views', __dirname + '/views')
// set the express template engine as ejs 
app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)

// set the express app's path for static files 
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// get the routes handler module exported from main.js
const homeController = require('./routes/main.js')

// register it with the express engine
app.use('/', homeController)

// set the port the express engine listens to for HTTP requests
app.listen(port, () => console.log(`listening on port ${port}!`));


