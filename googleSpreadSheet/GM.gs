function getGm(id, sheetName) {
  var sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  var rows = sheet.getRange("B2:AF11").getValues();
  var keys = rows.splice(0, 1)[0];
  return rows.map(function(row) {
    var obj = {}
    obj[keys[1]] = [];
    row.map(function(item, index) {
        if (index >= 1) {
          if (item != null && item != '') {
            obj[keys[1]].push(item)
          }
        } else {
          obj[keys[index]] = item;
        }
    });
    return obj;
  });
}