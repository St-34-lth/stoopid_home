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
                    options:[]

          },
          {
                    
                    name:"Smart door",
                    options:[]
          },
          {
                   
                    name:"Robo vacuum",
                    options:[]
          },
          {
                    
                    name:"HVAC",
                    options:["temperature"]
          },
           {
                  
                    name:"House surround",
                    options:["volume"]
          },
          {
                    name:"Smart thermostat",
                    options:[]
          },
          {
                    name:"Smart refrigerator",
                    options:["temperature"]
          },
          {
                    name:"Smart doorbell",
                    options:["volume"]
          },
          {
                    name:"Smart key chain",
                    options:["status","location"]
          },
          {
                    name:"Smart cameras",
                    options:[]
          },
          {
                    name:"Smart sensors",
                    options:[]
          },
          {
                    
                    name:"Smart garage door",
                    options:[]
          }   
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
         
          
          console.log(req.body.deviceID)
          
          let dbquery = `DELETE FROM devices WHERE id =${req.body.deviceID}`
        
          try
          {
                    
                    global.db.query(dbquery,(err,result)=>
                    {
                              if(err) throw err; 
                              else return
                    })
                    
                    
                    global.db.query('alter table devices drop id;') 
                    
                    global.db.query('alter table devices add id bigint(200) not null auto_increment first, add primary key (id);')

                    res.redirect("/delDevice")
          }
          catch(error)
          {
                    console.log(error)
                    
          }

})


function getDeviceProps(deviceName,availableDevices,basicProps,extraProps)
{
          let basicProperties = basicProps
          let extraProperties = extraProps 

          for(device in availableDevices)
          {
                    
                    if(availableDevices[device].name==deviceName)
                    {
                              let deviceExtraProps = availableDevices[device].options

                              let deviceProperties = basicProperties.concat(deviceExtraProps)
                              // console.log(availableDevices[device].options)
                              
                              let disabledProperties = extraProperties.filter(item=> !deviceProperties.includes(item))
                              
                              return {disabledProps:disabledProperties,deviceProperties:deviceProperties}
                    }
          }
}
function makeQuery(deviceName,data)
{
          let query;
          let basicProps = ['status','condition','name']
          let extendedProps = ["temperature","volume"]
          
          deviceProps = getDeviceProps(deviceName,availableDevices,basicProps,extendedProps)
          if( deviceProps.deviceProperties.includes('volume'))
          {
                    query = `insert into devices(name,condi,status,volume) values('${deviceName}','${data.condition}',${data.status},${data.volume})`
          }
          else if(deviceProps.deviceProperties.includes('temperature'))
          {
                    query = `insert into devices(name,condi,status,temperature) values('${deviceName}','${data.condition}',${data.status},${data.temperature});`
          }
          else 
          {
                    query= `insert into devices(name,condi,status) values('${deviceName}','${data.condition}','${data.status}');`
          }
          return query 
}
//Register device page
homeAdmin.post('/registerDevice', async (req,res,next) => 
{
      
          // let deviceName = req.body.deviceName
          // let deviceStatus = req.body.status 
          // let deviceCondition = req.body.condition
          // let deviceTemp = req.body.temperature 
          // let deviceVol = req.body.volume
          let query = makeQuery(req.body.deviceName,req.body)
          //console.log(deviceTemp,deviceName,deviceStatus,deviceCondition,deviceVol)
          global.db.query(`${query}`,(err,result) =>
                              {
                                        if(err) throw err;
                                        else console.log(result)
                              })
          res.redirect('/addDevice')

          // make a function to check bla bla here and give the query
          // every other device
          // if(deviceTemp == null )
          // {
                   
                   
                   
          //           global.db.query(`insert into devices(name,condi,status) values('${deviceName}','${deviceCondition}','${deviceStatus}');`,(err,result) =>
          //                     {
          //                               if(err) throw err;
          //                               else console.log(result)
          //                     })
          //           res.redirect('/addDevice')
                   
          //           return
          // }
          // // devices with volume
          // if(deviceVol != undefined || deviceVol!= null )
          // {
          //            global.db.query(`insert into devices(name,condi,status,volume) values('${deviceName}','${deviceCondition}',${deviceStatus},${deviceVol});`,(err,result) =>
          //                     {
          //                               if(err) throw err;
          //                               else console.log(result)
          //                     })
          //           res.redirect('/addDevice')
                    
          //           return
          // }
          // // devices with temp
          // if(deviceTemp != null )
          // {
          //            global.db.query(`insert into devices(name,condi,status,temperature) values('${deviceName}','${deviceCondition}',${deviceStatus},${deviceTemp});`,(err,result) =>
          //                     {
          //                               if(err) throw err;
          //                               else console.log(result)
          //                     })
          //           res.redirect('/addDevice')
                  
          //           return
          // }
          
    
          
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
