function getData(id, sheetName) {
  const sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  const rows = sheet.getRange("B2:BI17").getValues();
  const keys = rows.splice(0, 1)[0];
  return rows.map(function(row) {
    let obj = {}
    obj[keys[3]] = [];
    obj[keys[10]] = [];
    obj[keys[13]] = [];
    obj[keys[37]] = [];
    obj[keys[57]] = [];
    row.map(function(item, index) {
        if (index >= 3 && index <= 9) {
          if (item != null && item != '') {
            obj[keys[3]].push(item)
          }
        } else if (index >= 10 && index <= 12) {
          if (item != null && item != '') {
            obj[keys[10]].push(item)
          }
        } else if (index >= 13 && index <= 36) {
          if (item != null && item != '') {
            obj[keys[13]].push(item)
          }
        } else if (index >= 37 && index <= 56) {
          if (item != null && item != '') {
            obj[keys[37]].push(item)
          }
        } else if (index >= 57) {
          if (item != null && item != '') {
            obj[keys[57]].push(item)
          }
        } else {
          obj[keys[index]] = item;
        }
    });
    return obj;
  });
}

function doGet(e) {
  const data = getData('1oxYgXhnUxgvUCjkEoTly46P1DzTe1DrPfg-J5VWZwEU', 'エンドロール');
  const gm = getGm('1oxYgXhnUxgvUCjkEoTly46P1DzTe1DrPfg-J5VWZwEU', 'GM一覧');
  const output = ContentService.createTextOutput(JSON.stringify({'data':data, 'gm':gm}, null, 2));
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}