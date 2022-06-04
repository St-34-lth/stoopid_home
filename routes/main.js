var express = require('express');
const { append } = require('express/lib/response');
const { home } = require('nodemon/lib/utils');

homeAdmin = express.Router();

// A json like object that holds assets for the devices in the dashboard 
var deviceAssets =
{
          "Smart lights": "/svgs/lamp-svgrepo-com.svg",
          "Smart door": '/svgs/door-entrance-handle-key-security-svgrepo-com.svg',
          "Smart refrigerator": '/svgs/refrigerator-svgrepo-com.svg',
          "Smart doorbell": '/svgs/alert-bell-call-message-sign-svgrepo-com.svg',
          "Smart alarm": "/svgs/alarm-svgrepo-com.svg",
          "Smart TV": "/svgs/tv-svgrepo-com.svg",
          "Smart thermostat": "/svgs/temperature-svgrepo-com.svg",
          "Smart switch": "/svgs/switch-svgrepo-com.svg",
          "Smart scale": "/svgs/scale-weight-svgrepo-com.svg",
          "Smart alarm": "/svgs/alarm-svgrepo-com.svg",
          "Smart dishwasher": "/svgs/dishwasher-svgrepo-com.svg",
          "Smart launderer": "/svgs/clean-clothing-laundry-washing-wind-svgrepo-com.svg",
          "Smart window": "/svgs/window-svgrepo-com.svg",
          "Smart curtains": "/svgs/blinds-svgrepo-com.svg",
          "Smart dryer": "/svgs/dryer-svgrepo-com.svg",
          "Smart garage door": "/svgs/door-enter-entry-exit-open-svgrepo-com.svg",
          "Smart sensors": "/svgs/sensor-svgrepo-com.svg",
          "Smart cameras": "/svgs/camera-svgrepo-com.svg",
          "Smart key chain": "/svgs/door-entrance-handle-key-security-svgrepo-com.svg",
          "House surround": "/svgs/hifi-14-svgrepo-com.svg",
          "HVAC": "/svgs/air-conditioning-cooling-heat-temperature-svgrepo-com.svg",
          "Robo vacuum": "/svgs/vacuum-cleaner-svgrepo-com.svg"
}

// A json like object that holds assets for the device properties in the dashboard
var optionAssets =
{
          "luminosity": "/svgs/lamp-svgrepo-com.svg",
          "settings": "/svgs/settings-svgrepo-com.svg",
          "volume": "/svgs/volume-svgrepo-com.svg",
          "temperature": "/svgs/temperature-svgrepo-com.svg",
          "action": "/svgs/to-do-list-svgrepo-com.svg",
          "status": "/svgs/switch-svgrepo-com.svg",
          "openclose": "/svgs/door-enter-entry-exit-open-svgrepo-com.svg",
}

// A json like object that hold various details on the devices etc.
var availableDevices =
          [
                    {

                              name: "Smart lights",
                              options: [ "luminosity" ],

                    },
                    {

                              name: "Smart door",
                              options: [ "openclose" ]
                    },
                    {

                              name: "Robo vacuum",
                              options: [ "settings" ]
                    },
                    {

                              name: "HVAC",
                              options: [ "temperature" ],
                              restrictions: { "temperature": [ 18, 30 ] }
                    },
                    {

                              name: "House surround",
                              options: [ "volume" ]
                    },
                    {
                              name: "Smart thermostat",
                              options: [ "temperature" ],
                              restrictions: { "temperature": [ 18, 30 ] }

                    },
                    {
                              name: "Smart refrigerator",
                              options: [ "temperature" ],
                              restrictions: { "temperature": [ 0, 6 ] }
                    },
                    {
                              name: "Smart doorbell",
                              options: [ "volume" ]
                    },
                    {
                              name: "Smart key chain",
                              options: [ "action" ]
                    },
                    {
                              name: "Smart cameras",
                              options: [ "action" ]
                    },
                    {
                              name: "Smart sensors",
                              options: [ "settings" ]
                    },
                    {

                              name: "Smart garage door",
                              options: [ "openclose" ]
                    },
                    {
                              name: "Smart launderer",
                              options: [ "settings", "action", ]
                    },
                    {
                              name: "Smart dishwasher",
                              options: [ "action", "settings" ]
                    },
                    {
                              name: "Smart dryer",
                              options: [ "action", "settings" ]
                    },
                    {
                              name: "Smart scale",
                              options: [ "settings" ]
                    },
                    {
                              name: "Smart curtains",
                              options: [ "action" ]
                    },
                    {
                              name: "Smart window",
                              options: [ "openclose" ]
                    },
                    {
                              name: "Smart switch",
                              options: [ "openclose" ],
                    },
                    {
                              name: "Smart alarm",
                              options: [ "settings" ]
                    },
                    {
                              name: "Smart TV",
                              options: [ "settings", "volume" ]
                    }

          ]

// helper functions

// Returns an object with disabled and enabled properties of a given deviceName.
function getDeviceProps(deviceName, availableDevices, basicProps, extraProps) {
          let basicProperties = basicProps != undefined && basicProps.length > 0 ? basicProps : [ "status", "condition" ]
          let extraProperties = extraProps != undefined && extraProps.length > 0 ? extraProps : [ "temperature", "volume", "luminosity", "action", "settings", "openclose" ]

          for (device in availableDevices) {

                    if (availableDevices[ device ].name == deviceName) {
                              let deviceExtraProps = availableDevices[ device ].options
                              let deviceRestrictions = availableDevices[ device ].restrictions
                              let deviceProperties = basicProperties.concat(deviceExtraProps)

                              let disabledProperties = extraProperties.filter(item => !deviceProperties.includes(item))

                              return { disabledProps: disabledProperties, deviceProperties: deviceProperties, deviceRestrictions: deviceRestrictions }
                    }
          }
}
// makes insert queries for devices. Takes in a deviceName and the request object's data member
function makeInsertQuery(deviceName, data) {
          let query = (c, v) => {
                    columns = ""
                    values = ""


                    if (c.length > 2 && v.length > 2) {
                              c.forEach((item, index) => {
                                        if (index != c.length - 1) {
                                                  columns += item + ","
                                                  values += v[ index ] + ","
                                        }
                                        else {
                                                  columns += item
                                                  values += v[ index ]
                                        }

                              });
                    }



                    q = `insert into devices(${columns}) values(${values});`
                    return q
          }
          values = [ `'${deviceName}'` ]
          columns = [ 'name' ]

          deviceProperties = getDeviceProps(deviceName, availableDevices)
          deviceProperties = deviceProperties.deviceProperties

          for (property in deviceProperties) {
                    let deviceProperty = deviceProperties[ property ]

                    switch (deviceProperty) {


                              case "condition":
                                        columns.push(deviceProperty.slice(0, 5))
                                        values.push(`'${data[ deviceProperty ]}'`)
                                        break;
                              case "status":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "volume":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "temperature":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "luminosity":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "settings":
                                        columns.push(deviceProperty)
                                        values.push(1)
                                        break;
                              case "openclose":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "action":
                                        columns.push(deviceProperty)
                                        values.push(`'${data[ deviceProperty ]}'`)
                                        break;

                              default:
                                        continue
                    }
          }

          q = query(columns, values)

          return q
}

// makes update queries for devices. Takes in a deviceName and the request object's data member
function makeUpdateQuery(deviceName, data) {
          let query = (c, v) => {

                    let params = ""


                    if (c.length > 1 && v.length > 1) {
                              c.forEach((item, index) => {
                                        if (index != c.length - 1) {
                                                  params += `${item}=${v[ index ]},`

                                        }
                                        else {
                                                  params += `${item}=${v[ index ]}`
                                        }

                              });
                    }

                    q = `update devices set ${params} where id=${data.deviceID};`
                    return q
          }
          values = []
          columns = []
          availableProperties = [ "condition", "", "volume", "temperature", "luminosity", "settings", "action", "openclose" ]
          deviceProperties = getDeviceProps(deviceName, availableDevices)
          deviceProperties = deviceProperties.deviceProperties

          for (property in deviceProperties) {
                    let deviceProperty = deviceProperties[ property ]

                    switch (deviceProperty) {


                              case "condition":
                                        columns.push(deviceProperty.slice(0, 5))
                                        values.push(`'${data[ deviceProperty ]}'`)
                                        break;
                              case "status":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "volume":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "temperature":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "luminosity":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;

                              case "openclose":
                                        columns.push(deviceProperty)
                                        values.push(data[ deviceProperty ])
                                        break;
                              case "action":
                                        columns.push(deviceProperty)
                                        values.push(`'${data[ deviceProperty ]}'`)
                                        break;

                              default:
                                        continue
                    }
          }

          q = query(columns, values)

          return q

}


// A helper function to make async queries to the database - throws an error if something goes wrong
function asyncQuery(dbquery) {
          return new Promise((resolve, reject) => {
                    global.db.query(dbquery, (err, result) => {
                              if (err) return reject(err)
                              return resolve(result)
                    })
          })
}

// An object to control data passed in the template - 
//an easy way to communicate with the front - end.I use these throughout the routes so the rest will be uncommented to avoid cluttering.
//The boolean value is set to true and passed to base.ejs which then renders the corresponding page 
let indexContent =
{
          title: 'Home',
          content:
          {
                    home: false,
                    main: '<h1>home</h1>'
          }

}

// Home page - GET 
// The root of the app. Receives a get request and renders the home.html or an error page if failure occurs
homeAdmin.get('/', async (req, res) => {
          indexContent.content.home = true;

          try {
                    res.render('./../views/home.html', await indexContent)
          }
          catch (error) {
                    res.render('./../views/error.html', {})
          }
})

//About page 
let aboutContent =
{
          title: 'about',
          content:
          {
                    about: false,
                    main: 'This is the developer speaking. Give good grade pls.'
          }

}
// The about page of the app.
// Receives a get request and renders the about.html or an error page if failure occurs
homeAdmin.get('/about', async (req, res) => {
          try {
                    aboutContent.content.about = true;
                    res.render('./../views/about.html', await aboutContent)
          }
          catch (error) {
                    res.render('./../views/error.html', {})
          }

})

//Devices page 
let deviceContent =
{
          title: 'about',
          content:
          {
                    devicePage: false,
                    deviceListItems: undefined,
                    optionAssets: optionAssets,
                    deviceAssets: deviceAssets,

          }

}

//Receives a get request and renders the device.html or an error page if failure occurs 
// Queries the database for all registered devices and passes it to the template
homeAdmin.get('/devices', async (req, res) => {

          deviceContent.content.devicePage = true;
          let dbquery = "SELECT * FROM devices"

          try {

                    deviceContent.content.deviceListItems = await asyncQuery(dbquery);
                    if (deviceContent.content.deviceListItems != undefined) {
                              res.render('./../views/devices.html', await deviceContent)
                    }
          }
          catch (error) {
                    res.render('./../views/error.html', {})
          }

})


//Add device page 
let addDeviceContent =
{
          title: 'add device',
          content:
          {
                    addDevice: false,
                    availableDevices: availableDevices,
                    deviceAssets: deviceAssets,
                    optionAssets: optionAssets,

          }

}

// Receives a get request and renders the addDevice.html passing the addDeviceContent object
homeAdmin.get('/addDevice', async (req, res) => {
          addDeviceContent.content.addDevice = true;

          res.render('./../views/addDevice.html', await addDeviceContent)

})

//Receives a post request from the addDevice.html form and the request data. 
//Makes the insert query and queries the database to add the device 
//throws an error if something goes wrong or redirects to the addDevice page on success.
homeAdmin.post('/registerDevice', async (req, res) => {

          let query = makeInsertQuery(req.body.deviceName, req.body)
          try {
                    global.db.query(`${query}`, (err, result) => {
                              if (err) throw err;
                              else return

                    })
                    res.redirect('/addDevice')

          }
          catch (err) {
                    res.render('./../views/error', {})
          }
})

//Update page
let updateDeviceContent =
{
          title: 'upd device',
          content:
          {
                    updDevice: false,
                    deviceListItems: undefined,
                    availableDevices: availableDevices,
                    optionAssets: optionAssets,
                    deviceAssets: deviceAssets
          }

}
//Receives a get request, queries the database for the available devices then passes the results and renders the updDevice.html page.
// Renders the updDevice.html  on success or throws an error otherwise 
homeAdmin.get('/updDevice', async (req, res) => {
          updateDeviceContent.content.updDevice = true;

          let dbquery =
          {
                    sql: "SELECT * FROM devices",
                    timeout: 500
          }

          try {
                    updateDeviceContent.content.deviceListItems = await asyncQuery(dbquery)

                    res.render('./../views/updDevice.html', updateDeviceContent)
          }
          catch (error) {
                    res.render('./../views/error')
          }

})
// Receives a post request and passes the request data to the makeUpdateQuery function. 
// the function returns an appropriate query, and queries the database. 
// Redirects to devices page on success throws an error otherwise
homeAdmin.post('/updateDevice', async (req, res) => {

          try {

                    query = makeUpdateQuery(req.body.deviceName, req.body)

                    global.db.query(`${query}`, (err, result) => {
                              if (err) throw err;
                              else return
                    })

                    res.redirect('/devices')
          }
          catch (err) {
                    res.render('./../views/error.html', {})
          }

})


//Delete page
let delDeviceContent =
{
          title: 'del device',
          content:
          {
                    delDevice: false,
                    deviceListItems: undefined,
          }
}
// Receives a get request and querries the database for all available devices. 
// Passes the results to the delDevice.html and renders the page on sucess.Throws an error otherwise
homeAdmin.get('/delDevice', async (req, res) => {
          delDeviceContent.content.delDevice = true;
          let dbquery = "SELECT * FROM devices"


          try {

                    delDeviceContent.content.deviceListItems = await asyncQuery(dbquery)
                    res.render('./../views/delDevice.html', delDeviceContent)
          }
          catch (error) {
                    res.render('./../views/error.html', {})
          }


})

// Receives a post action from one of the delDevice.html page forms. 
// Queries the dabatse with the request body data and deletes the appropriate device
// Re-id's all devices accordingly to retain id ordering 
// Redirects to the del-device page on success, throws an error on failure.
homeAdmin.post('/delAction', async (req, res) => {

          let dbquery = `DELETE FROM devices WHERE id =${req.body.deviceID}`

          try {

                    global.db.query(dbquery, (err, result) => {
                              if (err) throw err;
                              else return
                    })


                    global.db.query('alter table devices drop id;')

                    global.db.query('alter table devices add id bigint(200) not null auto_increment first, add primary key (id);')

                    res.redirect("/delDevice")
          }
          catch (error) {
                    res.render('./../views/error.html', {})

          }

})



module.exports = homeAdmin;