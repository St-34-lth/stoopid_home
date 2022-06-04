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
function deviceChosen(e,availableDevices)
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
          "Smart lights": 
                    ["deviceName","status","deviceCondition"],
          "HVAC":
                    ["deviceName","status","deviceCondition","deviceTemperature"],
          "House surround": 
                    ["deviceName","status","deviceCondition","deviceVolume"],
          "Robo vacuum":
                    ["deviceName","status","deviceCondition"],
          "Smart door":
                    ["deviceName","status","deviceCondition"],
          "Smart TV":
                    ["deviceName","status","deviceCondition","deviceVolume"],
                    
          
}

function validateDevice(deviceName,deviceFormElements)
{
        
         
          for(device in deviceHas)
          {
                    //i guess i can refactor this ?
                    if(device==deviceName)
                    {
                              let deviceProperties = deviceHas[device]
                              console.log(device)
                              console.log(deviceFormElements)
                              deviceProperties.forEach((deviceProperty)=>
                              {
                                        
                                        // console.log(deviceFormElements[deviceProperty])

                                        // console.log(deviceFormElements[deviceProperty])
                                        let value=deviceFormElements[deviceProperty].value
                                        // console.log(value)
                                        if(value !=undefined) 
                                        {
                                        if(!validatePropertyValues(deviceProperty,value))
                                        {
                                                  
                                                  return wrongInput(deviceFormElements[deviceProperty],deviceProperty)
                                        }
                                        else if(deviceProperty=="deviceTemperature"||deviceProperty=="deviceVolume")
                                        {  
                                                  
                                                  return validInput(deviceFormElements,deviceProperty)
                              

                                        }          
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