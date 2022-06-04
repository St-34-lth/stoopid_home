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
                    options:["settings"]
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
                    options:["temperature"],
                    restrictions:{"temperature":[18,30]}

          },
          {
                    name:"Smart refrigerator",
                    options:["temperature"],
                    restrictions:{"temperature":[0,6]}
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
                    options:["settings"]
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
          },
          {
                    name:"Smart TV",
                    options:["settings","volume"]
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
          let query = (c,v) => 
          { 
                    columns = ""
                    values = ""
                    
                    console.log(c,v)
                    if (c.length >2 && v.length >2)
                    {
                              c.forEach((item,index) => 
                              {
                                        if(index!=c.length-1)
                                        {          
                                                  columns+= item+","
                                                  values+= v[index]+","
                                        }
                                        else 
                                        {
                                                  columns+= item
                                                  values+= v[index]
                                        }
                                        
                              });
                    }
                   

                    console.log(columns,values)
                    q = `insert into devices(${columns}) values(${values});`
                    return q 
          }
          values = [`'${deviceName}'`]
          columns = ['name']
          
          deviceProperties = getDeviceProps(deviceName,availableDevices)
          deviceProperties= deviceProperties.deviceProperties
          
          for(property in deviceProperties)
          {         
                    let deviceProperty = deviceProperties[property]
                    
                    switch(deviceProperty)
                    {
                              
                                        
                              case "condition":
                                        columns.push(deviceProperty.slice(0,5))
                                        values.push(`'${data[deviceProperty]}'`)
                                        break;
                              case "status":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "volume":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "temperature":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "luminosity":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "settings":
                                        columns.push(deviceProperty)
                                        values.push(1)
                                        break;
                              case "openclose":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "action":
                                        columns.push(deviceProperty)
                                        values.push(`'${data[deviceProperty]}'`)
                                        break;
                             
                              default:
                                        continue
                    }
          }
         
          q = query(columns,values) 
          console.log(q) 
          return q
}

function makeUpdateQuery(deviceName,data)
{
          let query = (c,v) => 
          { 
                    
                    let params = "" 
                    console.log(c,v)
                    // column=value, column=value
                    if (c.length >1 && v.length >1)
                    {
                              c.forEach((item,index) => 
                              {
                                        if(index!=c.length-1)
                                        {          
                                                  params += `${item}=${v[index]},`
                                                  
                                        }
                                        else 
                                        {
                                                 params += `${item}=${v[index]}`
                                        }
                                        
                              });
                    }
                   

                    
                    q = `update devices set ${params} where id=${data.deviceID};`
                    return q 
          }
          values = ['']
          columns = ['']
          availableProperties = ["condition","","volume","temperature","luminosity","settings","action","openclose"]
          deviceProperties = getDeviceProps(deviceName,availableDevices)
          deviceProperties= deviceProperties.deviceProperties
          
          for(property in deviceProperties)
          {         
                    let deviceProperty = deviceProperties[property]
                    
                    switch(deviceProperty)
                    {
                              
                                        
                              case "condition":
                                        columns.push(deviceProperty.slice(0,5))
                                        values.push(`'${data[deviceProperty]}'`)
                                        break;
                              case "status":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "volume":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "temperature":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "luminosity":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "settings":
                                        columns.push(deviceProperty)
                                        values.push(1)
                                        break;
                              case "openclose":
                                        columns.push(deviceProperty)
                                        values.push(data[deviceProperty])
                                        break;
                              case "action":
                                        columns.push(deviceProperty)
                                        values.push(`'${data[deviceProperty]}'`)
                                        break;
                             
                              default:
                                        continue
                    }
          }
         
          q = query(columns,values) 
          console.log(q) 
          return q
            
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
//Register device page
homeAdmin.post('/registerDevice', async (req,res,next) => 
{
      
          
          let query = makeInsertQuery(req.body.deviceName,req.body)
          console.log(query)
          global.db.query(`${query}`,(err,result) =>
                              {
                                        if(err) throw err;
                                        else console.log(result)
                              })
          res.redirect('/addDevice')

          
          
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
