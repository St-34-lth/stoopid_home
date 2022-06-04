var express = require('express');


homeAdmin = express.Router();
// var main = require('')




//Home page
let indexContent = 
{
          title: 'Home',
          content:
          {
                home:false  ,
                main: '<h1>home</h1>'
          }
          
}

homeAdmin.get('/',async (req,res) => {
          indexContent.content.home=true;
          res.render('./../views/home.html',await indexContent)
         
}) 
//About page 
let aboutContent = 
{
          title:'about',
          content: 
          {
                    about:false,
                    main: '<h1>about</h1>'
          }
               
}

homeAdmin.get('/about',async (req,res) => {
          aboutContent.content.about=true;
          res.render('./../views/about.html', await aboutContent)
})
//Devices page 
let deviceContent= 
{
          title:'about',
          content:
          {
                    devicePage:false,
                    deviceListItems: undefined
          }
          
}

homeAdmin.get('/devices', async (req,res) => {
          
          deviceContent.content.devicePage=true;
          let dbquery = "SELECT * FROM devices"
         
          try
          {
                    deviceContent.content.deviceListItems = await asyncQuery(dbquery);
                    if(deviceContent.content.deviceListItems!=undefined)
                    {
                              res.render('./../views/devices.html',await deviceContent)
                    }
          }
          catch(error)
          {
                    res.render('./../views/error.html',{title:"error",content:""})
          }
         
})
//refactor
//refactor
var availableDevices = 
[
          {
                    
                    name:"Smart lights",
                    options:["status","condition"]

          },
          {
                    
                    name:"Smart door",
                    options:["status","condition"]
          },
          {
                   
                    name:"Robo vacuum",
                    options:["status","condition"]
          },
          {
                    
                    name:"HVAC",
                    options:["status","condition","temperature"]
          },
           {
                  
                    name:"House surround",
                    options:["status","condition","volume"]
          },
          {
                    name:"Smart thermostat",
                    options:["status","condition"]
          },
          {
                    name:"Smart refrigerator",
                    options:["status","condition","temperature"]
          },
          {
                    name:"Smart doorbell",
                    options:["status","condition","volume"]
          },
          {
                    name:"Smart key chain",
                    options:["status","location"]
          },
          {
                    name:"Smart cameras",
                    options:["status","condition"]
          },
          {
                    name:"Smart sensors",
                    options:["status","condition"]
          },
          {
                    
                    name:"Smart garage door",
                    options:["status","condition"]
          },   
]

//Add device page 
let addDeviceContent =
{
          title:'add device',
          content:
          {
                    addDevice:false,
                    availableDevices: availableDevices
          }
          
}
homeAdmin.get('/addDevice' , async (req,res) => {
          addDeviceContent.content.addDevice=true;
          
          res.render('./../views/addDevice.html',await addDeviceContent)
})

//Update page
let updateDeviceContent = 
{
          title:'upd device',
          content:
          {
                    updDevice:false,
                    deviceListItems:undefined,
          }

}

homeAdmin.get('/updDevice', async (req,res) => {
          updateDeviceContent.content.updDevice=true;
          
          let dbquery = 
          {
                    sql:"SELECT * FROM devices",
                    timeout:500
          }
          
          try
          {
                    updateDeviceContent.content.deviceListItems = await asyncQuery(dbquery)
                    console.log(updateDeviceContent.content.deviceListItems)
                    res.render('./../views/updDevice.html',updateDeviceContent)
          }
          catch(error)
          {
                    res.render('./../views/error')
          }
          
})
      


//Delete page
let delDeviceContent = 
{
          title:'del device',
          content:
          {
                    delDevice:false,
                    deviceListItems:undefined,
          }
}

homeAdmin.get('/delDevice', async (req,res) => {
          delDeviceContent.content.delDevice=true;
          let dbquery = "SELECT * FROM devices"
          
          
          try 
          {
                    
                    delDeviceContent.content.deviceListItems = await asyncQuery(dbquery)
                    
                    
                    res.render('./../views/delDevice.html',delDeviceContent)
          }
          catch(error)
          {
                    res.render('./../views/error.html',{title:"error",content:""})
          }
          
          
})


homeAdmin.post('/delAction', async (req,res)=>
{
          let incrIndexQuery = "select id from devices where id=(select max(id) from devices);"
          
          console.log(req.body.deviceID)
          
          let dbquery = `DELETE FROM devices WHERE id =${req.body.deviceID}`
        
          try
          {
                    
                    global.db.query(dbquery,(err,result)=>
                    {
                              if(err) throw err; 
                              else return
                    })
                    //let incr_index = await asyncQuery(incrIndexQuery)
                    // dialogueWindow()
                    global.db.query('alter table devices drop id;') 
                    //global.db.query(`alter table devices auto_increment=${incr_index[0].id}`)
                    global.db.query('alter table devices add id bigint(200) not null auto_increment first, add primary key (id);')

                    res.redirect("/")
          }
          catch(error)
          {
                    console.log(error)
                    
          }

})

   
//Register device page
homeAdmin.post('/registerDevice', async (req,res,next) => 
{
          /*
          let query = await queryController.select("books","*")
          res.send(req.body);
          res.send(query)
          console.log(query)
          global.db.query("SELECT * FROM devices",(err,result) => {
                    if(err) throw err
                    res.send(result)
          })
          let result = queryController.select("books","*")
          res.send(result)
          console.log(result)
          */
          let deviceName = req.body.deviceName
          let deviceStatus = req.body.deviceStatus 
          let deviceCondition = req.body.deviceCondition
          
          let deviceTemp = req.body.deviceTemperature 
          // let deviceVol = req.body.deviceVolume!= "" ? req.body.deviceVol : null  
          deviceTemp = isNaN(Number(deviceTemp)) ? null : Number(deviceTemp) 
          console.log(deviceTemp,deviceName,deviceStatus,deviceCondition)
          
          
          //refactor validation 
          if(deviceTemp== "" || deviceTemp != null)
          {
                   
                    //addDeviceContent.content.error = false 
                   
                    global.db.query(`insert into devices(name,condi,status) values('${deviceName}','${deviceCondition}','${deviceStatus}');`,(err,result) =>
                              {
                                        if(err) throw err;
                                        else console.log(result)
                              })
                    res.redirect('/addDevice')
                    // addDeviceContent.content.error = true 
                    // throw Error('input wrong')
                    //res.render("./../views/addDevice.html",addDeviceContent)
          
          }
          else{
                    
                    //throw Error("Wrong input")
                    res.redirect('/devices')
          }
          
})

function asyncQuery(dbquery)
{
          return new Promise((resolve,reject)=> {
                    global.db.query(dbquery,(err,result)=>{
                              if(err) return reject(error)
                              return resolve(result)
                    })
          })
}


module.exports = homeAdmin;
