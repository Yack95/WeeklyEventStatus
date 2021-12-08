function onOpen(){
    loadMenu_()
}
function loadMenu_(){
    var ui = SpreadsheetApp.getUi();
    var menu = ui.createMenu("Actions");
    menu.addItem("Send Event Status by E-Mail", "sendTableByEmail")
    menu.addItem("Preview", "doGet")
    .addToUi()
}