                              /* Helpers */

function optionDisabler(selection,elmts,availableDevices)
{
          
          availableDevices= JSON.parse(availableDevices)

          let deviceProperties = getDeviceProps(selection,availableDevices)
          disabledProperties = deviceProperties.disabledProps
          deviceProperties = deviceProperties.deviceProperties
                           
          for (i in deviceProperties)
          {         
                    let deviceProperty = deviceProperties[i]
                    
                    if( elmts.namedItem(deviceProperty)) 
                    {
                              elmts.namedItem(deviceProperty).disabled=false
                              if(deviceProperty=="openclose") 
                              {
                                        let openClosedradioDiv = elmts.namedItem(deviceProperty).parentElement.parentElement.hidden=false
                                        
                              }
                    }

          }
          for (i in disabledProperties)
          {
                    let disabledProperty = disabledProperties[i]
                    
                    if(elmts.namedItem(disabledProperty))
                    {
                              if(disabledProperty=="openclose") 
                              {
                                        let openClosedadioDiv = elmts.namedItem(disabledProperty).parentElement.parentElement.hidden=true
                                        
                              }
                              else 
                              {
                                        elmts.namedItem(disabledProperty).disabled=true
                              }
                             
                              
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

// Takes in the http element and its invalid entry. Outputs an alert accordingly and displays the element in red.
function wrongInput(callerElement,inputEntry)
{
          alert("Please enter and appropriate entry for: "+ inputEntry)
          callerElement.setAttribute('class','bg-danger')
}

// maybe export this in the global scoped module
// Takes in a deviceName, the list of available devices, common properties to all devices, if any, and specific device properties. Returns an object with available and disabled properties for the device.
// NOTE: available devices must be a json object NOT stringified. 
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
        
                    /* Event handlers/listeners */

function eventHandler(event)
{
          
          
          if(event.type='DOMContentLoaded')
          {
                   
                    addPageEventListener(event,availableDevices)
          }
          
}

// updates the next element sibling (volumeValueContainer) of the slider on value change
function updateVolumeEventListener(e)
{
          e.nextElementSibling.innerHTML= e.value
}

function updateLuminosityEventListener(e)
{
          e.nextElementSibling.innerHTML= e.value
}
//dialogue window event listener. Displays a confirm dialogue and submits a formtarget element if yes, cancels otherwise.
function dialogueWindow(e)
{
          
          if(confirm("Are you sure?")) e.form.submit()

          else return
          
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
          let callerElement;

          // get the caller element
          if (e.type =="DOMContentLoaded")
          {
                   callerElement = document.getElementById('selectDeviceName')
          }
          else if(e.type=="change")
          {
                    callerElement = e.target || e.srcElement;
                    e = e || window.event; 
          }
         
          // get the selectedDevice name
          let deviceName=callerElement.value
          //now that we have the name, appropriately disable properties
                    //1. get the form element

          let deviceForm = document.getElementsByClassName('property')
          // let deviceFormElements = deviceForm.elements 
         
          //2. figure out which props to disable
          optionDisabler(deviceName,deviceForm,availableDevices)
}


                    /* Validation handlers */ 

function validateRegisterForm(availableDevices)
{
          
          let deviceName = document.getElementById("selectDeviceName").value
          let deviceFormElement = document.getElementById('registerDevice')
          validateRegisterDevice(deviceName,deviceFormElement,availableDevices)         

}

// takes in a device name, the form element used, and a list of available devices.
// runs entry data checks and calls the wrongInput or submitValidInput functions accordingly. 
function validateRegisterDevice(deviceName,deviceFormElement,availableDevices)
{
        
          // all devices have status and condition so no need to filter for it.
          formElements = deviceFormElement.elements
          availableDevices = JSON.parse(availableDevices)
          
         
          
          let deviceProperties= getDeviceProps(deviceName,availableDevices)
          let deviceRestrictions = deviceProperties.deviceRestrictions
          let restrictedValue;
          for (i in deviceProperties.deviceProperties)
          {
                    let deviceProperty = deviceProperties.deviceProperties[i]
                    
                    if (deviceProperty=='status' || deviceProperty=="settings")
                    {
                              
                              continue
                    }
                    let value=formElements[deviceProperty].value
                    console.log(deviceProperty,formElements[deviceProperty],formElements[deviceProperty].value)
          //          could make an additional abstraction for restrictions here
                    if (deviceProperty =='temperature')
                    {
                              restrictedValue= checkPropertyValues(deviceProperty,deviceRestrictions,value)
                    }
                    
                    if(!validatePropertyValueTypes(deviceProperty,value)|| restrictedValue ==true)
                    {
                              
                              return wrongInput(formElements[deviceProperty],deviceProperty)
                              
                              
                    }
                    
          }
          return submitValidInput(deviceFormElement.name,0)
                    
}
function validateUpdateForm(availableDevices,formID)
{
          let deviceName 
          let deviceFormElement = document.getElementById(`updateDevice${formID}`).elements
         
          deviceName= deviceFormElement['selectedDeviceName'].value  

          let deviceProperties = getDeviceProps(deviceName,JSON.parse(availableDevices))
          let deviceRestrictions = deviceProperties.deviceRestrictions
          deviceProperties = deviceProperties.deviceProperties
          let restrictedValue
          
          for(property of deviceProperties)
          {
                    propertyElement = deviceFormElement[property]
                    
                    
                    if (property =='temperature')
                    {
                              
                              restrictedValue = checkPropertyValues(property,deviceRestrictions,deviceProperty.value)
                    }
                    console.log(propertyElement,propertyElement.name)
                    if(!validatePropertyValueTypes(propertyElement.name,propertyElement.value) 
                              || restrictedValue==true)
                    {
                              
                              return wrongInput(propertyElement,propertyElement.name)
                    }

          }

          let deviceFormName = document.getElementById(`updateDevice${formID}`).name
          formID = formID== 0 ? 0 : formID-1
          
          return submitValidInput(deviceFormName,formID)          
}

function checkPropertyValues(property,deviceRestrictions,value)
{
          
          if (property =='temperature')
          { 
                    let min = deviceRestrictions[property][0]
                    let max = deviceRestrictions[property][1]
                    console.log('here',max,min)
                    if (value <= max && value >= min ) return false 
                    else return true 
          }
          return false          
}

// JS type checking rocks - not. 
// Takes in a deviceProperty name and its value. Returns false if the value is empty or of an incorrect type, otherwise true.

function validatePropertyValueTypes(deviceProperty,propertyValue)
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
          if(deviceProperty =="action")
          {
                    propertyValue = Number(propertyValue)

                    return !(typeof propertyValue == "number" && !isNaN(propertyValue)) 
          }
          

          return true 
          

}

 