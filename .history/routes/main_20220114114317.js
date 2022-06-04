var express = require('express');
const { append } = require('express/lib/response');
const { home } = require('nodemon/lib/utils');

homeAdmin = express.Router();

var availableDevices = 
[
          {
                    
                    name:"Smart lights",
                    options:["luminosity"],

          },
          {
                    
                    name:"Smart door",
                    options:["openclose"]
          },
          {
                   
                    name:"Robo vacuum",
                    options:["setting"]
          },
          {
                    
                    name:"HVAC",
                    options:["temperature"],
                    restrictions:{"temperature":[18,30]}
          },
           {
                  
                    name:"House surround",
                    options:["volume"]
          },
          {
                    name:"Smart thermostat",
                    options:["temperature"]

          },
          {
                    name:"Smart refrigerator",
                    options:["temperature"],
                    restrictions:{"temperature":[-5,6]}
          },
          {
                    name:"Smart doorbell",
                    options:["volume"]
          },
          {
                    name:"Smart key chain",
                    options:["action"]
          },
          {
                    name:"Smart cameras",
                    options:["action"]
          },
          {
                    name:"Smart sensors",
                    options:["setting"]
          },
          {
                    
                    name:"Smart garage door",
                    options:["openclose"]
          },
          {
                    name:"Smart launderer",
                    options:["settings","action",]
          },
          {
                    name:"Smart dishwasher",
                    options:["action","settings"]
          },
          {
                    name:"Smart dryer",
                    options:["action","settings"]
          },
          {
                    name:"Smart scale",
                    options:["settings"]
          },
          {
                    name:"Smart curtains",
                    options:["action"]    
          },
          {
                    name:"Smart window",
                    options:["openclose"] 
          },
          {
                    name:"Smart switch",
                    options:["openclose"],
          },
          {
                    name:"Smart alarm",
                    options:["settings"]
          }

]
function getDeviceProps(deviceName,availableDevices,basicProps,extraProps)
{
          let basicProperties = basicProps!=undefined && basicProps.length > 0  ? basicProps : ["status","condition"] 
          let extraProperties = extraProps!=undefined &&  extraProps.length > 0  ? extraProps : ["temperature","volume","luminosity","action","settings","openclose"] 

          for(device in availableDevices)
          {
                    
                    if(availableDevices[device].name==deviceName)
                    {
                              let deviceExtraProps = availableDevices[device].options
                              let deviceRestrictions = availableDevices[device].restrictions
                              let deviceProperties = basicProperties.concat(deviceExtraProps)
                              
                              let disabledProperties = extraProperties.filter(item=> !deviceProperties.includes(item))
                              
                              return {disabledProps:disabledProperties,deviceProperties:deviceProperties,deviceRestrictions:deviceRestrictions}
                    }
          }
}
function makeInsertQuery(deviceName,data)
{
          let query = (columns,values) => 
          { 
                    q = `insert into devices(${columns}) values(${values});`

                    if (columns.length >1 &&values.length >1)
                    {
                              columns.forEach(item => 
                              {
                                        q = `insert into devices(${columns}) values(${values})`
                              });
                    }
                   
                    return q 
          }
          values =''
          columns = ''
          extraProperties = ["volume","temperature","luminosity","settings","action","openclose"]
          deviceProperties = getDeviceProps(deviceName,availableDevices)
          deviceProperties= deviceProperties.deviceProperties
          
          for(property in deviceProperties)
          {         
                    let deviceProperty = deviceProperties[property]
                    switch(deviceProperty)
                    {
                              case "volume":
                                        columns+=deviceProperty+" "
                                        values+= data.volume+" "
                                        break;
                              case "temperature":
                                        columns+=deviceProperty+" "
                                        values+=data.temperature+" "
                                        break;
                              case "luminosity":
                                        columns+=deviceProperty+" "
                                        values+=data.luminosity+" "
                                        break;
                              case "settings":
                                        columns+=deviceProperty+" "
                                        values+= data.settings+" "
                                         break;
                              case "openclose":
                                        columns+=deviceProperty+" "
                                        values+= data.openclose+" "
                                        break;
                              case "action":
                                        columns+=deviceProperty+" "
                                        values+= data.action+" "
                                        break;
                              default:
                                        continue
                    }
                    
                    
          }
         
          
          // if( deviceProps.deviceProperties.includes('volume'))
          // {
          //           query = `insert into devices(name,condi,status,volume) values('${deviceName}','${data.condition}',${data.status},${data.volume});`
          // }
          // else if(deviceProps.deviceProperties.includes('temperature'))
          // {
          //           query = `insert into devices(name,condi,status,temperature) values('${deviceName}','${data.condition}',${data.status},${data.temperature});`
          // }
          // else if(deviceProps.deviceProperties.includes('luminosity'))
          // {
          //           query = `insert into devices(name,condi,status,luminosity) values('${deviceName}','${data.condition}',${data.status},${data.luminosity});`
          // }
          // else 
          // {
          //           query= `insert into devices(name,condi,status) values('${deviceName}','${data.condition}','${data.status}');`
          // }
          return query(columns,values)
}


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


//Add device page 
let addDeviceContent =
{
          title:'add device',
          content:
          {
                    addDevice:false,
                    availableDevices: availableDevices,
                    
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
                    availableDevices:availableDevices
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
      
homeAdmin.post('/updateDevice',async (req,res) =>
{
          console.log(req.body)
          try {
                    // update the database 
                    query = makeUpdateQuery(req.body.deviceName,req.body)
                    console.log(query)
                    // global.db.query(`${query}`,(err,result)=>
                    // {
                    //           if(err) throw err; 
                    //           else console.log(result)
                    // })
                    
                    res.redirect('/devices')
          }
          catch(error){
                    throw error;
          }
          
})

function makeUpdateQuery(deviceName,data)
{
          let query;
          let basicProps = ['status','condition']
          let extendedProps = ["temperature","volume"]
          deviceProps = getDeviceProps(deviceName,availableDevices,basicProps,extendedProps)
          
          // unpack data and send query as is- easier than checking what changed bla bla bla 
          updParams=`condi='${data.condition}',status=${data.status}`
          

          if( deviceProps.deviceProperties.includes('volume'))
          {
                    updParams = updParams.concat(`,volume=${data.volume}`)
          }
          if(deviceProps.deviceProperties.includes('temperature'))
          {
                    updParams = updParams.concat(`,temperature=${data.temperature}`)
          }
          
          query= `update devices set ${updParams} where id=${data.deviceID};`
          return query  
            
}
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


//Register device page
homeAdmin.post('/registerDevice', async (req,res,next) => 
{
      
          
          let query = makeInsertQuery(req.body.deviceName,req.body)
         
          global.db.query(`${query}`,(err,result) =>
                              {
                                        if(err) throw err;
                                        else console.log(result)
                              })
          res.redirect('/addDevice')

          
          
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
