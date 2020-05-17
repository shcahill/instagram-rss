/**
 * シートの内容をコピーします
 */
function copySheet(sheet, destSheetName) {
  var orgVal = sheet.getDataRange().getValues()
  
  var dest = getSheet(destSheetName)
  dest.getRange(1, 1, orgVal.length, orgVal[0].length).setValues(orgVal)
}