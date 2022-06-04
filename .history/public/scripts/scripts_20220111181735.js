//defined as properties excluded
let deviceDoesnotHave = 
{
          "smart lights": 
                    ["deviceTemperature","deviceVolume"],
          "HVAC":
                    ["deviceVolume"],
          "House surround": 
                    ["deviceTemperature"],
          "robo vacuum":
                    ["deviceTemperature","deviceVolume"],
          "smart door":
                    ["deviceTemperature","deviceVolume"],
          "smart TV":["deviceVolume"],
                    
          
}

function optionDisabler(selection,elmt,availableDevices)
{
         
          let temperature = elmt["deviceTemperature"]
          let  volume = elmt["deviceVolume"]
          let condition = elmt["deviceCondition"]
          let status= elmt["deviceStatus"]
        
          // for (let i=0; i < availableDevices.length; i++)
          // {

          // }

          if(selection == "smart lights")
          {
                    temperature.disabled=true
                    condition.disabled=false
                    volume.disabled = true

          }
          else if(selection=="smart door")
          {
                    temperature.disabled=true
                    condition.disabled=false
                   
                    volume.disabled = true
          }
          else if(selection=="robo vacuum")
          {
                    temperature.disabled=true
                    condition.disabled=false
                    volume.disabled = true
          }
          else if(selection=="HVAC")
          {
                    temperature.disabled=false
                    condition.disabled=false
                    volume.disabled = true
          }
          else if(selection=="House surround")
          {
                    temperature.disabled=true
                    condition.disabled=false
                    volume.disabled = false
          }
                    
          
}
function test()
{
          
          

          //1 - get all form elements in the tabs
          let deviceForms = document.getElementsByTagName("form")
          //2 - find the deviceName of each form 
          for(deviceForm of deviceForms)
          {
                    deviceFormElements = deviceForm.elements
                    
                    //3 - disable accordingly fields
                    //get the current deviceName 
                    let deviceName = deviceForm['deviceName'].value
                   
                    //now that we have the deviceName in consideration we need to find its available options

                    //this finds out which options are available for the particular device in the form Element of the page
                
                    deviceDoesnotHave[deviceName].forEach((property) => {
                              if(property in deviceFormElements) 
                              {
                                        
                                       deviceFormElements[property].disabled = true
                                           
                              }
                    })
          

          }

          // volume.onchange = (event) => 
          // {
          //           let volumeValue= event.target.value
          //           let volumeValueContainer = document.getElementById('volumeValueContainer')
          //           // let elmt = document.createElement('p')
          //           volumeValueContainer.innerHTML=''                    
                    
          //           // elmt.innerHTML+= volumeValue
          //           volumeValueContainer.innerHTML=volumeValue    
                    
          // }
}
function test2(e,availableDevices)
{
         
          e = e || window.event; 
          // get the caller element
          let callerElement = e.target || e.srcElement;
          // get the selectedDevice name
          let deviceName=callerElement.value
          //now that we have the name, appropriately disable properties
                    //1. get the form element

          let deviceForm = document.getElementById('registerDevice')
          let deviceFormElements = deviceForm.elements 
                    //2. figure out which props to disable
          optionDisabler(deviceName,deviceFormElements,availableDevices)


}

function dialogueWindow()
{
          
          confirm("Are you sure?")
          
}
//shit, need to take into account how many types of answers to give and return accordingly


function validateRegisterForm()
{
          // let deviceForm = document.getElementById("registerDevice")
          let deviceName = document.getElementById("selectDeviceName").value
          let deviceFormElements = document.getElementById('registerDevice').elements
          validateDevice(deviceName,deviceFormElements)         

}

function validateUpdateForm()
{
         
          
          let deviceName = document.getElementById("selectedDeviceName")
          //doesnt change form ID ! -- need to figure out a dynamic way 
          // what if the form was render according to the available options from database??? that should be easier 
          let deviceForm = document.getElementById("updateFormContainer").children[0]

          // //need to get the caller element
          console.log(deviceForm,deviceName)
          // let deviceFormElements = document.getElementById('updateDevice').elements
          // validateDevice(deviceName,deviceFormElements) 
}
 // By changing the devices list, this function broke  

let deviceHas = 
{
          "smart lights": 
                    ["deviceName","deviceStatus","deviceCondition"],
          "HVAC":
                    ["deviceName","deviceStatus","deviceCondition","deviceTemperature"],
          "House surround": 
                    ["deviceName","deviceStatus","deviceCondition","deviceVolume"],
          "robo vacuum":
                    ["deviceName","deviceStatus","deviceCondition"],
          "smart door":
                    ["deviceName","deviceStatus","deviceCondition"],
          "smart TV":
                    ["deviceName","deviceStatus","deviceCondition","deviceVolume"],
                    
          
}

function validateDevice(deviceName,deviceFormElements)
{
        
         
          for(device in deviceHas)
          {
                    //i guess i can refactor this ?
                    if(device==deviceName)
                    {
                              let deviceProperties = deviceHas[device]
                              //console.log(device)
                              
                              deviceProperties.forEach((deviceProperty)=>
                              {
                                        
                                        let value=deviceFormElements[deviceProperty].value
                                        // console.log(value)
                                        if(!validatePropertyValues(deviceProperty,value))
                                        {
                                                  
                                                  return wrongInput(deviceFormElements[deviceProperty],deviceProperty)
                                        }
                                        else if(deviceProperty=="deviceTemperature"||deviceProperty=="deviceVolume")
                                        {  
                                                  
                                                  return validInput(deviceFormElements,deviceProperty)
                              

                                        }          
                              })

                    }
                  
          }
          
}

function validInput(callerElement,inputElement)
{
          callerElement[inputElement].setAttribute('class','bg-mute')
}

function wrongInput(callerElement,inputEntry)
{
          alert("Please enter and appropriate entry for: "+ inputEntry)
          callerElement.setAttribute('class','bg-danger')
}
// JS type checking rocks - not. 
function validatePropertyValues(deviceProperty,propertyValue)
{
          if(propertyValue=="")
          {
                    return false
          }
          
          if(deviceProperty=="deviceName")
          {
                    console.log("validated name")
                    return typeof propertyValue == "string"
          }
          if(deviceProperty == "deviceTemperature")
          {
                   
                    console.log("validated temperature")
                    propertyValue = Number(propertyValue)

                    return typeof propertyValue == "number" && !isNaN(propertyValue)  
                    // I mean look at this. Just look at it. WHY ?
          }
          if(deviceProperty =="deviceVolume")
          {
                    console.log("validated volume")
                    
                    return typeof Number(propertyValue)=="number"
          }
          
          return true

}


// function deviceSelector()
// {
          
//           let selection = document.getElementById('selectDeviceName')
//           selection.onchange = (event) => 
//           {
                    
//                     let options = event.target.options
//                     let selectedIndex = event.target.selectedIndex
                    

//                     optionDisabler(options[selectedIndex].value)
//           }
// }

/*  form validation -event 

          registerDeviceForm.onsubmit = (event) => {
                    event.preventDefault()

                   
                   
                    if(!isNaN(Number(temperature.value)))          
                    {
                              console.log('ok')
                    } 
                    else 
                    {
                              
                              console.log(Error)
                    }

          } */