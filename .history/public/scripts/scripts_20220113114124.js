

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

function optionDisabler(selection,elmts,availableDevices)
{
          let availableOptions = ["temperature","volume"]
          availableDevices= JSON.parse(availableDevices)
          for (d in availableDevices)
          {                   
                    if(availableDevices[d].name == selection) 
                    {// unpack the options from the list of availableDevices for the particular device the user selects
                              hasOptions = availableDevices[d].options
                              let disabledOpts = availableOptions.filter(item=> !hasOptions.includes(item))
                              
                              for (opt in hasOptions)
                              {         if( elmts.namedItem(hasOptions[opt])) 
                                        {
                                                  elmts.namedItem(hasOptions[opt]).disabled=false
                                        }   
                              }
                              for (opt in disabledOpts)
                              {
                                        if(elmts.namedItem(disabledOpts[opt]))
                                        {
                                                  elmts.namedItem(disabledOpts[opt]).disabled=true
                                        }
                              }
                              break; 
                    }

          }
          
          
        
}


// maybe export this in the global scoped module
// Takes in a deviceName, the list of available devices, common properties to all devices, if any, and specific device properties. Returns an object with available and disabled properties for the device.
// NOTE: available devices must be a json object NOT stringified. 
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

function updatePageEventListener(availableDevices)
{
          availableDevices = JSON.parse(availableDevices)
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
                    let deviceProps = getDeviceProps(deviceName,availableDevices,["status","condition"],["temperature","volume"])
                    
                    deviceProps.disabledProps.forEach((property)=>{
                             
                              
                              if (deviceFormElements[property])
                              {
                                        deviceFormElements[property].disabled = true
                                       
                              }
                    })

          }

}
function addPageEventListener(e,availableDevices)
{
         
          e = e || window.event; 
          // get the caller element
          let callerElement = e.target || e.srcElement;
          // get the selectedDevice name
          let deviceName=callerElement.value
          //now that we have the name, appropriately disable properties
                    //1. get the form element

          let deviceForm = document.getElementsByClassName('choice')
          // let deviceFormElements = deviceForm.elements 
         
                    //2. figure out which props to disable
          optionDisabler(deviceName,deviceForm,availableDevices)


}

function dialogueWindow(e)
{
          
          if(confirm("Are you sure?")) document.getElementsByName(e.formTarget)[0].submit()
          else return
          
}

function validateRegisterForm(availableDevices)
{
          // let deviceForm = document.getElementById("registerDevice")
          let deviceName = document.getElementById("selectDeviceName").value
          let deviceFormElement = document.getElementById('registerDevice')
          validateRegisterDevice(deviceName,deviceFormElement,availableDevices)         

}

function validateUpdateForm(availableDevices,formID)
{
          let deviceName 
          let deviceFormElement = document.getElementById(`updateDevice${formID}`).elements
          // console.log(deviceFormElement)
          deviceName= deviceFormElement['selectedDeviceName'].value  

          let deviceProps = getDeviceProps(deviceName,JSON.parse(availableDevices),["status","condition"],["temperature","volume"])
          for(d of deviceProps.deviceProperties)
          {
                    deviceProperty = deviceFormElement[d]
                    if (deviceProperty=='status')
                    {
                             if(deviceProperty[0].checked)
                             {
                              //          device is on
                             }
                             else 
                             {
                              //          device is off
                             }
                    }
                    
                    if(!validatePropertyValues(deviceProperty.name,deviceProperty.value))
                    {
                              
                              return wrongInput(deviceProperty,deviceProperty.name)
                    }

          }
          let deviceFormName = document.getElementById(`updateDevice${formID}`).name
          formID = formID== 0 ? 0 : formID-1
          console.log(formID)
          return validInput(deviceFormName,formID)          
         
         
}
// takes in a device name, the form element used, and a list of available devices.
// runs entry data checks and calls the wrongInput or validInput functions accordingly. 
function validateRegisterDevice(deviceName,deviceFormElement,availableDevices)
{
        
          // all devices have status and condition so no need to filter for it.
          formElements = deviceFormElement.elements
          availableDevices = JSON.parse(availableDevices)
          
          let availableProperties = ["temperature","volume"]
          let basicProperties =["status","condition"]
          for(device in availableDevices)
          {
                    //i guess i can refactor this ?
                    getDeviceProps()
                    if(availableDevices[device].name==deviceName)
                    {
                              let deviceExtraProps = availableDevices[device].options

                              let deviceProperties = basicProperties.concat(deviceExtraProps)
                            
                              let disabledProperties = availableProperties.filter(item=> !deviceProperties.includes(item))
                            

                              for (i in deviceProperties)
                              {
                                        let deviceProperty = deviceProperties[i]
                             
                                        if (deviceProperty=='status')
                                        {
                                                   continue
                                        }
                                        console.log(deviceProperty,formElements[deviceProperty])
                                        let value=formElements[deviceProperty].value
                                     
                                      
                                        if(!validatePropertyValues(deviceProperty,value))
                                        {
                                                  
                                                  return wrongInput(formElements[deviceProperty],deviceProperty)
                                                  
                                                 
                                        }
                                        
                              }
                              return validInput(deviceFormElement.name,0)
                               
                    }
                  
          }
          
}

// Takes in a form element's name attribute and an index. 
// then submits the form element  
function submitValidInput(callerFormName,inputElement)
{
          
          let form = document.getElementsByName(`${callerFormName}`)
          console.log(form[inputElement])
          form[inputElement].submit() 
}
// Takes in the http element and its invalid entry. Outputs an alert accordingly.
function wrongInput(callerElement,inputEntry)
{
          alert("Please enter and appropriate entry for: "+ inputEntry)
          callerElement.setAttribute('class','bg-danger')
}
// JS type checking rocks - not. 
// Takes in a deviceProperty name and its value. Returns false if the value is empty or of an incorrect type, otherwise true.
function validatePropertyValues(deviceProperty,propertyValue)
{
          if(propertyValue=="")
          {
                    return false
          }
       
          if(deviceProperty == "temperature")
          {
                   
                    
                    propertyValue = Number(propertyValue)
                    return (typeof propertyValue == "number" && !isNaN(propertyValue)) 
                    
                    // I mean look at this. Just look at it. WHY ?
          }
          if(deviceProperty =="volume")
          {
                    
                    return typeof Number(propertyValue)=="number"
          }
          return true 
          

}

