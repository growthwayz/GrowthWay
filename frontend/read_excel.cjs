const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:/Users/Dell/Contacts/Desktop/GrowthWay/Growthway_Implementation_Tracker.xlsx');
const sheet_name_list = workbook.SheetNames;
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log(JSON.stringify(data, null, 2));
