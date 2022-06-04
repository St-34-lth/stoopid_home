                              /* Helpers */

// Disables options according to which device is selected. Used in the addDevice page.
// Takes in the selected device, the collection of html elements in the form,  an array of device objects with their properties and their corresponding SVG assets. 
function addPageOptionDisabler(selection,elmts,availableDevices,optionAssets)
{
          
          availableDevices= JSON.parse(availableDevices)
          optionAssets = JSON.parse(optionAssets)
          let deviceProperties = getDeviceProps(selection,availableDevices)
          disabledProperties = deviceProperties.disabledProps
          deviceProperties = deviceProperties.deviceProperties
                           
          for (i in deviceProperties)
          {         
                    let deviceProperty = deviceProperties[i]
                    
                    if( elmts.namedItem(deviceProperty)) 
                    {
                              elmts.namedItem(deviceProperty).disabled=false
                              
                              assignOptionAssets(deviceProperty,optionAssets)      
                              
                              
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
                              // demonstrating capability to hide instead of disable
                              if(disabledProperty=="openclose") 
                              {
                                        let openClosedadioDiv = elmts.namedItem(disabledProperty).parentElement.parentElement.hidden=true
                                        
                              }
                              else 
                              {
                                        assignOptionAssets(disabledProperty,optionAssets)  
                                        elmts.namedItem(disabledProperty).disabled=true
                              }
                             
                              
                    }
          }
                       
}
// hides/displays the device properties in the update page according to which device is selected.  Takes in a stringified version of the available devices object.
function updatePageOptionDisabler(availableDevices)
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
                    let deviceProperties = getDeviceProps(deviceName,availableDevices)
                    let disabledProperties = deviceProperties.disabledProps
                    deviceProperties = deviceProperties.deviceProperties

                    disabledProperties.forEach((disabledProperty)=>{
                             
                              
                              if (deviceFormElements[disabledProperty])
                              {
                                        deviceFormElements[disabledProperty].disabled = true
                              //          or I could hide the property instead here. 
                              }

                    })
                    deviceProperties.forEach((deviceProperty)=>{
                             
                              
                              if (deviceFormElements[deviceProperty])
                              {
                                        deviceFormElements[deviceProperty].disabled = false
                              //          or enable it. 
                              }
                              
                    })

          }
}


// Assigns SVGs to device properties.
// Takes in a deviceProperty string and optionAssets object. 
function assignOptionAssets(deviceProperty,optionAssets)          
{
          if(deviceProperty == "condition" )
          {
                    return 
          }
          if (optionAssets[deviceProperty]!=undefined)
          {
                    document.getElementById(`${deviceProperty}`+'Image').src = optionAssets[deviceProperty]
          }
}                    


// Assigns SVGs to each device in the devices page.
// Takes in two asset objects that contain URIs per device/option
function getdeviceListings(optionAssets,deviceAssets)
{
          optionAssets= JSON.parse(optionAssets)
          deviceAssets = JSON.parse(deviceAssets)
          deviceListingsCollection = document.getElementsByTagName('img')
         
          for(let i =0; i < deviceListingsCollection.length; i++ )
          {
                    let imgElmt= deviceListingsCollection[i]
                    let propertyID= imgElmt.id.split('Image',1)[0]
                    
                    switch(propertyID)
                    {
                              case "device":
                                        if(deviceAssets[imgElmt.name] !=undefined)
                                        imgElmt.src = deviceAssets[imgElmt.name]
                                        break;
                              case "status":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                             
                              case "condition":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                              case "status":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                              case "volume":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                              case "temperature":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                              case "luminosity":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                              
                              case "openclose":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                              case "action":
                                        imgElmt.src = optionAssets[propertyID]
                                        break;
                              case "settings":
                                        imgElmt.src =optionAssets[propertyID]
                              default:
                                        continue;
                    }
          }
}

// Submits the provided named form element and informs of the action with an alert.
function submitValidInput(callerFormName,callerElement)
{
          
          let form = document.getElementsByName(`${callerFormName}`)
          form[callerElement].submit()
          alert('Action complete!') 
}


// Takes in the http element and its invalid entry. Outputs an alert accordingly and displays the element in red.
function wrongInput(callerElement,elementName)
{
          alert("Please enter and appropriate entry for: "+ elementName)
          callerElement.setAttribute('class','bg-danger')
}

// Returns an object with available and disabled properties for the device.
// Takes in a deviceName, a stringified object of available devices, common properties to all devices, if any, and specific device properties. 
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
                              
                              return {
                                        disabledProps:disabledProperties,
                                        deviceProperties:deviceProperties,
                                        deviceRestrictions:deviceRestrictions
                              }
                    }
          }
}
        
          
                    /* Event handlers/listeners */

// Generic event handler. Handles the DOMContentLoaded event. 
function eventHandler(event,optionAssets,deviceAssets)
{
          
                    if(event.type='DOMContentLoaded')
                    {
                              if(event.path[0].URL.includes('addDevice'))
                              {
                                        addPageEventListener(event,availableDevices)
                              }
                              
                    }
          
         
         
          
}

// Keeps track of and updates the volume slider value where required
function updateVolumeEventListener(e,value)
{
          
          if(value==undefined) e.nextElementSibling.innerHTML= e.value
          else e.nextElementSibling.innerHTML= value
         
}

// Keeps track of and updates the volume slider value where required
function updateLuminosityEventListener(e,value)
{
          
          if(value==undefined) e.nextElementSibling.innerHTML= e.value
          else e.nextElementSibling.innerHTML= value
}
//dialogue window event listener. Displays a confirm dialogue and submits a formtarget element if yes, cancels otherwise.
function dialogueWindow(e)
{
          
          if(confirm("Are you sure?")) e.form.submit()

          else return
          
}

// Handles the add device page events. Calls the option disabler and updateVolume/Luminosity event handlers when fired( This is ensure their values reset when a different device is selected )
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

                    updateVolumeEventListener(e.srcElement.form.volume,'')
                    updateLuminosityEventListener(e.srcElement.form.luminosity,'')
          }
         
          // get the selectedDevice name
          let deviceName=callerElement.value
          //now that we have the name, appropriately disable properties
                    //1. get the form element

          let deviceForm = document.getElementsByClassName('property')
          
         
          //2. figure out which props to disable and add assets
         
          addPageOptionDisabler(deviceName,deviceForm,availableDevices,optionAssets)
}


                    /* Validation handlers */ 

// validates form entries for device registration before submission. Takes in the stringified available devices object
function validateRegisterForm(availableDevices)
{
          
          let deviceName = document.getElementById("selectDeviceName").value
          let deviceFormElement = document.getElementById('registerDevice')
          validateRegisterDevice(deviceName,deviceFormElement,availableDevices)         

}


// Validates the entries for a device before submission to the database. Checks for restrictions etc.
// takes in a device name, the form element used, and a list of available devices.
//  calls the submitValidInput after checks complete or returns an alert message if an entry is wrong.
function validateRegisterDevice(deviceName,deviceFormElement,availableDevices)
{
        
          // all devices have status and condition so no need to filter for it.
          formElements = deviceFormElement.elements
          availableDevices = JSON.parse(availableDevices)
          
          let deviceProperties= getDeviceProps(deviceName,availableDevices)
          let deviceRestrictions = deviceProperties.deviceRestrictions
          deviceProperties = deviceProperties.deviceProperties
          let restrictedValue;
          
          for (deviceProperty of deviceProperties)
          {
                    
                    
                    if (deviceProperty=='status' || deviceProperty=="settings")
                    {
                              continue
                    }
                    let value=formElements[deviceProperty].value
                    
                    // Since most of the entries for a device are fixed or ranged, this is to demonstrate exercise of restricted values.
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

//  validates the Update device form entries before submission to the database.
// Takes in a stringified object of available devices and the caller form's ID.
// Submits the form if all entries are correct or returns an alert message.
function validateUpdateDevice(availableDevices,formID)
{
          let deviceName 
          let deviceFormElement= document.getElementById(`updateDevice${formID}`)
          
          let formElements = deviceFormElement.elements
          
          deviceName= formElements['selectedDeviceName'].value  

          let deviceProperties = getDeviceProps(deviceName,JSON.parse(availableDevices))
          let deviceRestrictions = deviceProperties.deviceRestrictions
          deviceProperties = deviceProperties.deviceProperties
          let restrictedValue
          
          for(deviceProperty of deviceProperties)
          {
                    if (deviceProperty=='settings') continue
                    let propertyValue;
                    let propertyElement = formElements[deviceProperty]
                    if(deviceProperty=="openclose") 
                    {
                              
                              propertyValue = formElements[deviceProperty].value  
                              
                    }
                    else 
                    {
                             
                              propertyValue = propertyElement.value 
                    }
                    
                
                    
                    if (deviceProperty =='temperature')
                    {
                              

                              restrictedValue = checkPropertyValues(deviceProperty,deviceRestrictions,propertyValue)

                    }
                    
          
                    if(!validatePropertyValueTypes(deviceProperty,propertyValue) 
                              || restrictedValue==true)
                    {
                              
                              return wrongInput(propertyElement,deviceName)
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

 