//preview
function doGet() {
  //connection with list of names/emails
  var sheetInvitees = SpreadsheetApp.getActiveSpreadsheet()
  var receivers = sheetInvitees.getSheetByName("SendInvitation");
  var receiverRange = receivers.getRange(2,1, receivers.getLastRow()-1, 1).getValues();
 
  var receiverName = 0
 
  var subject = "The last update Weekly Event Status"
  
  var activeRange = receivers.getActiveCell();
  var rowNumber = activeRange.getRow()-2;
  
  var row = receiverRange[rowNumber]//receiverRange[0]
  
  
  //conection HTML
  var htmlOutput = HtmlService.createTemplateFromFile("TableDesign/table")
  var events = loadEvents()
  htmlOutput.events = events

  var subject = ["Hello"," ",row[receiverName]].join('');

  htmlOutput.fn = row[receiverName];

  var htmlMessage = htmlOutput.evaluate();
 
  htmlMessage.setWidth(1000)
  htmlMessage.setHeight(800)
  SpreadsheetApp.getUi()
  .showModalDialog(htmlMessage, subject)
}

//Email Table
function sendTableByEmail(){
  
    var receivers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SendInvitation");
    var receiverRange = receivers.getRange(2,1, receivers.getLastRow()-1, receivers.getLastColumn()).getValues();
    
    var receiverName = 0 
    var receiverEmail = 1
    
    var subject = "The last update Weekly Event Status"
  
    receiverRange.forEach((row) => {
                          
      var htmlOutput = HtmlService.createTemplateFromFile("TableDesign/table")
    
      var events = loadEvents()
      
      htmlOutput.events = events
      
      htmlOutput.fn = row[receiverName];
      
      const emailTemplate = htmlOutput.evaluate().getContent();
      
      GmailApp.sendEmail(
        row[receiverEmail],
        subject,
        "Your email does not support HTML",
        {
          htmlBody:emailTemplate
        }
      )
    })
}

//loadData
function loadEvents(){
  
  var eventDataSheet = SpreadsheetApp.getActive().getSheetByName("Events");
  var eventValues = eventDataSheet.getRange(2,1, eventDataSheet.getLastRow()-1, eventDataSheet.getLastColumn()).getDisplayValues();
  
  var apms = loadAPM()
  var ars = loadAR()

  var events = eventValues.map((row)=>{
   var event = {
      eventId:row[0],
      startDate:row[1],
      eventName: row[2],
      eventPOC: row[3],
      targetAudience: row[4],
      marketingObjectives: row[5],
      productFocus:row[6],
      briefingLocal:row[7],
      relevance:row[8],
      weeksToEvent:row[9],
      apms:apms[row[0]] || [],
      ars:ars[row[0]] || [],
    }
    //console.log("return",events)
    return event     
  })    
  return events
  
}

function loadAPM(){

  var apmDataSheet = SpreadsheetApp.getActive().getSheetByName("DataAPMTrackings");
  var apmValues = apmDataSheet.getRange(2,1,apmDataSheet.getLastRow()-1,apmDataSheet.getLastColumn()).getDisplayValues();
  //console.log("apm values", apmValues)

  var apms = apmValues.map((row)=>{
    
    var apm = {
      eventId:row[0],
      status:row[1],
    }
    return apm;
  })
  
  //console.log("apms", apms)
  const grouppedAPM = {}
  
  apms.forEach((apm)=>{
  if(grouppedAPM[apm.eventId]){
      grouppedAPM[apm.eventId].push(apm)
  }else{
      grouppedAPM[apm.eventId] = [apm]
  
  }
  })
  //console.log("grouppedAPM", grouppedAPM)
  return grouppedAPM
}


function loadAR(){

  var arDataSheet = SpreadsheetApp.getActive().getSheetByName("DataARTrackings");
  var arValues = arDataSheet.getRange(2,1,arDataSheet.getLastRow()-1,arDataSheet.getLastColumn()).getDisplayValues();
  //console.log("ar values", arValues)

  var ars = arValues.map((row)=>{
    var ar = {
      eventId:row[0],
      status:row[1],
    }
    return ar
  })
  //console.log("ars", ars)
  const grouppedAR = {}
 
  ars.forEach((ar)=>{
   if(grouppedAR[ar.eventId]){
    grouppedAR[ar.eventId].push(ar)
  }else{
    grouppedAR[ar.eventId] = [ar]
  }             
  })
  //console.log("grouppedAR", grouppedAR)
  return grouppedAR
}
