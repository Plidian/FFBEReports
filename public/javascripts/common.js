const fs = require('fs');
var request = require('request');
var _ = require('lodash');
const constants = require ('../../assets/static/constants.json');
const masterStaticMateria = require ('../../assets/static/flattenedStaticMateria.json');
//const masterStaticItems = require('./static/flattenedStaticItems.json');
//const masterStaticUnits = require('./static/flattenedStaticUnits.json');
const masterStaticEquipment = require('../../assets/static/flattenedStaticEquipment.json');
const masterBraveAbilities = require('../../assets/static/brave_abilities.json');
//const masterSkillPassive = require('./static/flattenedStaticPassives.json');
//const masterSkillActive = require('./static/flattenedStaticAbility.json');
//const masterSkillMagic = require('./static/flattenedStaticMagic.json');
//const masterLimitBursts = require('./static/flattenedLimitBursts.json');
const filterGame = [20001, 20002, 20007, 20008, 20011, 20012];
const filterUnits = ["100014604","100014504","100014703","100014405", "199000101", "332000105", "256000301", "204002104", "204002003", "204001904", "204001805", "100017005", "307000303", "307000404", "307000204", "100027005", "318000205"];
const nfetch = require('node-fetch');
var alasql = require('alasql');
/*
var dev = process.argv.length > 2 && process.argv[2] == "dev";
if (dev) {
    console.log("dev mode : ON");
} else {
    console.log("dev mode : OFF");
}
*/
exports.ConvertPotsToCSV= function(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = 'Name,NumberOwned,Stat,Value'+'\r\n';
	for (var i = 0; i < array.length; i++)
		{
		var line = '';
		for (var index in array[i])
			{
				if(array[i].hasOwnProperty(index)){
			if (line != '') {
				line += ',';
				line += array[i][index];
			}
		}
	}
		str += line + '\r\n';
		}
	return str;
};
exports.ConvertInventoryToCSV= function(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = 'Name,Rarity,NumberOwned,Enhancement0,Enhancement1,Enhancement2,itemId,InventoryType,Enhancement0Id,Enhancement1Id,Enhancement2Id'+'\r\n';
	for (var i = 0; i < array.length; i++)
		{
      if(!array[i].Enhancement0){array[i].Enhancement0="";}
      if(!array[i].Enhancement1){array[i].Enhancement1="";}
      if(!array[i].Enhancement2){array[i].Enhancement2="";}
      if(!array[i].Enhancement0Id){array[i].Enhancement0Id=0;}
      if(!array[i].Enhancement1Id){array[i].Enhancement1Id=0;}
      if(!array[i].Enhancement2Id){array[i].Enhancement2Id=0;}
      var entryData =
    {
    'Name':(array[i].Name),
    'Rarity':(array[i].rarity),
    'NumberOwned':(array[i].NumberOwned),
    'Enhancement0':array[i].Enhancement0,
    'Enhancement1':array[i].Enhancement1,
    'Enhancement2':array[i].Enhancement2,
    'itemId':array[i].itemId,
    'InventoryType':array[i].InventoryType,
    'Enhancement0Id':array[i].Enhancement0Id,
    'Enhancement1Id':array[i].Enhancement1Id,
    'Enhancement2Id':array[i].Enhancement2Id
  };
		var line = '';
		for (var index in entryData) {
			if (entryData.hasOwnProperty(index)){
				if (line != ''){
					 line += ',';
					 line += entryData[index];
				 }
			}
		}
		str += line + '\r\n';
	}
	return str;
};
exports.ConvertCactuarsToCSV= function(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = 'Name,NumberOwned,Level'+'\r\n';
	for (var i = 0; i < array.length; i++)
		{
		var line = '';
		for (var index in array[i]) {
			if(array[i].hasOwnProperty(index)){
			if (line != ''){
				line += ',';
				line += array[i][index];
			}
			}
		}
		str += line + '\r\n';
		}
	return str;
};
exports.ConvertConsumablesToCSV= function(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var newchar = '|';
  var str = 'Name,Effects,NumberOwned,Description'+'\r\n';
	for (var i = 0; i < array.length; i++)
		{
    if(!array[i].effects){array[i].effects="";}
    if(!array[i].desc_short){array[i].desc_short="";}
    if(array[i].effects.indexOf(','!=1)){array[i].effects= array[i].effects.split(',').join(newchar);}
    if(array[i].desc_short.indexOf(','!=1)){array[i].desc_short= array[i].desc_short.split(',').join(newchar);}
      var entryData =
  	{
  	'Name':(array[i].itemName),
    'Effects':(array[i].effects),
    'NumberOwned':(array[i].NumberOwned),
    'desc_short': array[i].desc_short
  };
		var line = '';
		for (var index in entryData) {
			if (entryData.hasOwnProperty(index)){
				if (line != ''){
					line += ',';
					line += entryData[index];
				}//Close out the if statement checking for empty lines
			}//close out the if statement checking that the array has an index value
		}//close out the for loop iterating through each value in the arrays
		str += line + '\r\n';
	}//close out the for loop for each value in the Object
	return str;
};
exports.ConvertMooglesToCSV= function(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = 'Name,Count,TrustValue,TrustName'+'\r\n';
	for (var i = 0; i < array.length; i++)
		{
		var line = '';
		for (var index in array[i]){
			if(array[i].hasOwnProperty(index)){
				if (line != ''){
					line += ',';
					line += array[i][index];
				}
			}
		}
		str += line + '\r\n';
		}
	return str;
};
exports.ConvertToCSV= function(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var newchar = '|';
  var str = 'unitId,unitName,rarity,roles,rarityMin,rarityMax,tmrId,stmrId,id,compendiumId,attackFrames,HPpotsMax,HPdoorsMax,MPpotsMax,MPdoorsMax,ATKpotsMax,ATKdoorsMax,DEFpotsMax,DEFdoorsMax,MAGpotsMax,MAGdoorsMax,SPRpotsMax,SPRdoorsMax,uniqueId,stmr,tmr,level,HPpotsUsed,MPpotsUsed,ATKpotsUsed,DEFpotsUsed,MAGpotsUsed,SPRpotsUsed,HPdoorsUsed,MPdoorsUsed,ATKdoorsUsed,DEFdoorsUsed,MAGdoorsUsed,SPRdoorsUsed,enhancement0,enhancement1,enhancement2,enhancement3,enhancement4,enhancement5,username,LBMaxLevel,LBLevel,LBExp'+'\r\n';
	for (var k = 0; k < array.length; k++)
		{
    if(!array[k].stmrId){array[k].stmrId="";}
    if(!array[k].tmrId){array[k].tmrId="";}
    if(!array[k].LBMaxLevel){array[k].LBMaxLevel=0;}
    if(!array[k].LBLevel){array[k].LBLevel=0;}
    if(!array[k].LBExp){array[k].LBExp=0;}
    if(array[k].unitName.indexOf(','!=1)){array[k].unitName= array[k].unitName.split(',').join(newchar);}
    var entryData =
	{
	'unitId':Number(array[k].unitId),
	'unitName':array[k].unitName,
	'rarity':array[k].rarity,
	'roles':array[k].roles,
	'rarityMin':array[k].rarityMin,
	'rarityMax':array[k].rarityMax,
	'tmrId':array[k].tmrId,
	'stmrId':array[k].stmrId,
	'id': Number(array[k].id),
	'compendiumId':array[k].compendiumId,
	'attackFrames':array[k].attackFrames,
	'HPpotsMax':array[k].HPpotsMax,
	'HPdoorsMax':array[k].HPdoorsMax,
	'MPpotsMax':array[k].MPpotsMax,
	'MPdoorsMax':array[k].MPdoorsMax,
	'ATKpotsMax':array[k].ATKpotsMax,
	'ATKdoorsMax':array[k].ATKdoorsMax,
	'DEFpotsMax':array[k].DEFpotsMax,
	'DEFdoorsMax':array[k].DEFdoorsMax,
	'MAGpotsMax':array[k].MAGpotsMax,
	'MAGdoorsMax':array[k].MAGdoorsMax,
	'SPRpotsMax':array[k].SPRpotsMax,
	'SPRdoorsMax':array[k].SPRdoorsMax,
	'uniqueId':array[k].uniqueId,
	'stmr': array[k].stmr,
	'tmr': array[k].tmr,
	'level': array[k].level,
	'HPpotsUsed': array[k].HPpotsUsed,
	'MPpotsUsed': array[k].MPpotsUsed,
	'ATKpotsUsed': array[k].ATKpotsUsed,
	'DEFpotsUsed': array[k].DEFpotsUsed,
	'MAGpotsUsed': array[k].MAGpotsUsed,
	'SPRpotsUsed': array[k].SPRpotsUsed,
	'HPdoorsUsed': array[k].HPdoorsUsed,
	'MPdoorsUsed': array[k].MPdoorsUsed,
	'ATKdoorsUsed': array[k].ATKdoorsUsed,
	'DEFdoorsUsed': array[k].DEFdoorsUsed,
	'MAGdoorsUsed': array[k].MAGdoorsUsed,
	'SPRdoorsUsed': array[k].SPRdoorsUsed,
	'Enhancement0': array[k].Enhancement0,
	'Enhancement1': array[k].Enhancement1,
	'Enhancement2': array[k].Enhancement2,
	'Enhancement3': array[k].Enhancement3,
	'Enhancement4': array[k].Enhancement4,
	'Enhancement5': array[k].Enhancement5,
	'userName': array[k].userName,
  'LBMaxLevel': array[k].LBMaxLevel,
  'LBLevel': array[k].LBLevel,
  'LBExp': array[k].LBExp
	};//end of entryData object declaration
		var line = '';
		for (var index in entryData){
			if(entryData.hasOwnProperty(index)){
				if (line != ''){
					line += ',';
					line += entryData[index];
				}
			}
		}
		str += line + '\r\n';
		}
	return str;
};
function getData(filename, callback) {
    if (1==1) {
        request.get('https://raw.githubusercontent.com/aEnigmatic/ffbe/master/' + filename, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(filename + " downloaded");
                var result = JSON.parse(body);
                callback(result);
            } else {
                console.log(error);
            }
        });
    } else {
        fs.readFile('./sources/' + filename, function (err, content) {
            var result = JSON.parse(content);
            callback(result);
        });
    }
}
async function checkVersion(filename, callback) {
  const response = await nfetch("https://api.github.com/repos/aEnigmatic/ffbe/contents", {
    headers: {
      authorization: "token 6c2d981923b4122f9056ab2a5d76837360c85336"
    }
  });
  const tree = (await response.json());
	//console.log(tree);
  var tkeys = Object.keys(tree);
  //create the loop that goes through the tree
  for (let i = 0; i < tkeys.length; i++) {
    if (tree[i].name == 'limitbursts.json') {
      var lbsha = tree[i].sha;
      var lbsize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var lbfvkeys = Object.keys(fileVersions);
      for (let lb = 0; lb < lbfvkeys.length; lb++) {
        if (fileVersions[lb].path == "limitbursts.json") {
          if (fileVersions[lb].sha == lbsha) {
            console.log("limitbursts.json matches.");
          } else if (fileVersions[lb].sha != lbsha) {
            console.log("limitbursts.json does not match.");
            fileVersions[lb].sha = lbsha;
            fileVersions[lb].size = lbsize;
            getData('limitbursts.json', function(limitbursts) {
                let staticLimitBurstArray = [];
                let lbret = [];
                var lbIds = Object.keys(limitbursts);
                for (let lb = 0; lb < lbIds.length; lb++) {
                  let limitBurstId = lbIds[lb];
                  if (!limitbursts[limitBurstId].name) {limitbursts[limitBurstId].name = "";}
                  if (!limitbursts[limitBurstId].damage_type) {limitbursts[limitBurstId].damage_type = "";}
                  var limitBurstData = {
                    "limitBurstId": Number(limitBurstId),
                    "limitName": limitbursts[limitBurstId].name,
                    "damageType": limitbursts[limitBurstId].damage_type,
                    "maxLevel": limitbursts[limitBurstId].levels.length
                  }; //end of the equipData object defenition
                  lbret.push(limitBurstData);
                } //end of the equipment for loop
                staticLimitBurstArray = _.flattenDeep(lbret);
                fs.writeFileSync("./assets/static/flattenedLimitBursts.json", JSON.stringify(staticLimitBurstArray));
              } //end of the get data async function
            ); //end of getData for limitbursts.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being limitburts.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being limitbursts.
    if (tree[i].name == 'equipment.json') {
      var esha = tree[i].sha;
      var esize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var equipfvkeys = Object.keys(fileVersions);
      for (let e = 0; e < equipfvkeys.length; e++) {
        if (fileVersions[e].path == "equipment.json") {
          if (fileVersions[e].sha == esha) {
            console.log("equipment.json matches.");
          } else if (fileVersions[e].sha != esha) {
            console.log("equipment.json does not match.");
            fileVersions[e].sha = esha;
            fileVersions[e].size = esize;
            getData('equipment.json', function(equipment) {
                let staticEquipArray = [];
                let eret = [];
                var eqIds = Object.keys(equipment);
                for (let i = 0; i < eqIds.length; i++) {
                  let equipmentId = eqIds[i];
                  if (!equipment[equipmentId].name) {equipment[equipmentId].name = "";}
                  if (!equipment[equipmentId].type) {equipment[equipmentId].type = "";}
                  if (!equipment[equipmentId].compendium_id) {equipment[equipmentId].compendium_id = 0;}
                  if (!equipment[equipmentId].effects) {equipment[equipmentId].effects = "";}
                  if (!equipment[equipmentId].rarity) {equipment[equipmentId].rarity = 0;}
                  var equipData = {
                    "equipId": Number(equipmentId),
                    "equipName": equipment[equipmentId].name,
                    "itemType": equipment[equipmentId].type,
                    "compendiumId": equipment[equipmentId].compendium_id,
                    "effects": equipment[equipmentId].effects[0],
                    "rarity": equipment[equipmentId].rarity,
                    "HP": equipment[equipmentId].stats.HP,
                    "MP": equipment[equipmentId].stats.MP,
                    "ATK": equipment[equipmentId].stats.ATK,
                    "DEF": equipment[equipmentId].stats.DEF,
                    "MAG": equipment[equipmentId].stats.MAG,
                    "SPR": equipment[equipmentId].stats.SPR
                  }; //end of the equipData object defenition
                  eret.push(equipData);
                } //end of the equipment for loop
                staticEquipArray = _.flattenDeep(eret);
                fs.writeFileSync("./assets/static/flattenedStaticEquipment.json", JSON.stringify(staticEquipArray));
              } //end of the get data async function
            ); //end of getData for equipment.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being equipment.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being equipment.
    if (tree[i].name == 'expeditions.json') {
      var expsha = tree[i].sha;
      var expsize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var expeditionsfvkeys = Object.keys(fileVersions);
      for (let x = 0; x < expeditionsfvkeys.length; x++) {
        if (fileVersions[x].path == "expeditions.json") {
          if (fileVersions[x].sha == expsha) {
            console.log("expeditions.json matches.");
          } else if (fileVersions[x].sha != expsha) {
            console.log("expeditions.json does not match.");
            fileVersions[x].sha = expsha;
            fileVersions[x].size = expsize;
            getData('expeditions.json', function(expeditions) {
                let staticexpeditionsArray = [];
                let expret = [];
                var expeditionIds = Object.keys(expeditions);
                for (let i = 0; i < expeditionIds.length; i++) {
                  let expeditionId = expeditionIds[i];
                  if (!expeditions[expeditionId].name) {expeditions[expeditionId].name = "";}
                  if (!expeditions[expeditionId].rarity) {expeditions[expeditionId].rarity = 0;}
                  if (!expeditions[expeditionId].strings.desc[0]) {expeditions[expeditionId].strings.desc[0] = "";}
                  if (!expeditions[expeditionId].item_bonus) {expeditions[expeditionId].item_bonus = [{
                      "id": -9,
                      "name": "No Item",
                      "amount": 0
                    }];
                  }
                  var expeditionData = {
                    "expeditionId": Number(expeditionId),
                    "expeditionName": expeditions[expeditionId].name,
                    "cost": expeditions[expeditionId].cost,
                    "rank": expeditions[expeditionId].rank,
                    "difficulty": expeditions[expeditionId].difficulty,
                    "desc": expeditions[expeditionId].strings.desc[0],
                    "duration": expeditions[expeditionId].duration,
                    "itemId": expeditions[expeditionId].item_bonus[0].id,
                    "itemAmount": expeditions[expeditionId].item_bonus[0].amount,
                    "rarity": 0
                  }; //end of the expeditionData object defenition
                  expret.push(expeditionData);
                } //end of the expedition for loop
                staticexpeditionsArray = _.flattenDeep(expret);
                fs.writeFileSync("./assets/static/flattenedStaticExpeditions.json", JSON.stringify(staticexpeditionsArray));
              } //end of the get data async function
            ); //end of getData for expeditions.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being expeditions.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being expeidtions
    if (tree[i].name == 'materia.json') {
      var msha = tree[i].sha;
      var msize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var materiafvkeys = Object.keys(fileVersions);
      for (let m = 0; m < materiafvkeys.length; m++) {
        if (fileVersions[m].path == "materia.json") {
          if (fileVersions[m].sha == msha) {
            console.log("materia.json matches.");
          } else if (fileVersions[m].sha != msha) {
            console.log("materia.json does not match.");
            fileVersions[m].sha = msha;
            fileVersions[m].size = msize;
            getData('materia.json', function(materia) {
                let staticmateriaArray = [];
                let mret = [];
                var materiaIds = Object.keys(materia);
                for (let i = 0; i < materiaIds.length; i++) {
                  let materiaId = materiaIds[i];
                  if (!materia[materiaId].name) {materia[materiaId].name = "";}
                  if (!materia[materiaId].type) {materia[materiaId].type = "";}
                  if (!materia[materiaId].compendium_id) {materia[materiaId].compendium_id = 0;}
                  if (!materia[materiaId].effects[0]) {materia[materiaId].effects = 0;}
                  if (!materia[materiaId].rarity) {materia[materiaId].rarity = 0;}
                  if (!materia[materiaId].strings.names[0]) {materia[materiaId].strings.names[0] = "";}
                  if (!materia[materiaId].strings.desc_short[0]) {materia[materiaId].strings.desc_short[0] = "";}
                  if (!materia[materiaId].strings.desc_long[0]) {materia[materiaId].strings.desc_long[0] = "";}
                  var materiaData = {
                    "materiaId": Number(materiaId),
                    "materiaName": materia[materiaId].name,
                    "skills": materia[materiaId].skills[0],
                    "effects": materia[materiaId].effects[0],
                    "compendiumId": materia[materiaId].compendium_id,
                    "desc_short": materia[materiaId].strings.desc_short[0],
                    "desc_long": materia[materiaId].strings.desc_long[0],
                    "rarity": 0
                  }; //end of the materiaData object defenition
                  mret.push(materiaData);
                } //end of the materia for loop
                staticmateriaArray = _.flattenDeep(mret);
                fs.writeFileSync("./assets/static/flattenedStaticMateria.json", JSON.stringify(staticmateriaArray));
              } //end of the get data async function
            ); //end of getData for materia.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being materia.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being materia.
    if (tree[i].name == 'skills_passive.json') {
      var spsha = tree[i].sha;
      var spsize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var spfvkeys = Object.keys(fileVersions);
      for (let sp = 0; sp < spfvkeys.length; sp++) {
        if (fileVersions[sp].path == "skills_passive.json") {
          if (fileVersions[sp].sha == spsha) {
            console.log("skills_passive.json matches.");
          } else if (fileVersions[sp].sha != spsha) {
            console.log("skills_passive.json does not match.");
            fileVersions[sp].sha = spsha;
            fileVersions[sp].size = spsize;
            getData('skills_passive.json', function(passives) {
                let staticPassivesArray = [];
                let spret = [];
                var passivesIds = Object.keys(passives);
                for (let i = 0; i < passivesIds.length; i++) {
                  var hpPercent = 0;
                  var mpPercent = 0;
                  var atkPercent = 0;
                  var defPercent = 0;
                  var magPercent = 0;
                  var sprPercent = 0;
                  let passivesId = passivesIds[i];
									const found = masterBraveAbilities.includes(passivesId);
                  if (!passives[passivesId].name) {passives[passivesId].name = "";}
                  if (!passives[passivesId].compendium_id) {passives[passivesId].compendium_id = 0;}
                  if (!passives[passivesId].effects[0]) {passives[passivesId].effects = "";}
                  if (!passives[passivesId].rarity) {passives[passivesId].rarity = 0;}
                  if (passives[passivesId].effects_raw[0][1] == 3 && passives[passivesId].effects_raw[0][2] == 1) {
                    hpPercent = passives[passivesId].effects_raw[0][3][4];
                    mpPercent = passives[passivesId].effects_raw[0][3][5];
                    atkPercent = passives[passivesId].effects_raw[0][3][0];
                    defPercent = passives[passivesId].effects_raw[0][3][1];
                    magPercent = passives[passivesId].effects_raw[0][3][2];
                    sprPercent = passives[passivesId].effects_raw[0][3][3];
                  }
                  var spData = {
                    "skillId": Number(passivesId),
                    "skillName": passives[passivesId].name,
                    "icon": passives[passivesId].icon,
                    "effects": passives[passivesId].effects[0],
                    "compendiumId": passives[passivesId].compendium_id,
                    "effects_raw": passives[passivesId].effects_raw,
                    "rarity": passives[passivesId].rarity,
                    "hpPercent": hpPercent,
                    "mpPercent": mpPercent,
                    "atkPercent": atkPercent,
                    "defPercent": defPercent,
                    "magPercent": magPercent,
                    "sprPercent": sprPercent,
										"brave": String(found)
                  }; //end of the passivesobject defenition
                  spret.push(spData);
                } //end of the passives for loop
                staticPassivesArray = _.flattenDeep(spret);
                fs.writeFileSync("./assets/static/flattenedStaticPassives.json", JSON.stringify(staticPassivesArray));
              } //end of the get data async function
            ); //end of getData for materia.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being materia.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being skills_passive
    if (tree[i].name == 'skills_magic.json') {
      var mgsha = tree[i].sha;
      var mgsize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var magicfvkeys = Object.keys(fileVersions);
      for (let m = 0; m < magicfvkeys.length; m++) {
        if (fileVersions[m].path == "skills_magic.json") {
          if (fileVersions[m].sha == mgsha) {
            console.log("skills_magic.json matches.");
          } else if (fileVersions[m].sha != mgsha) {
            console.log("skills_magic.json does not match.");
            fileVersions[m].sha = mgsha;
            fileVersions[m].size = mgsize;
            getData('skills_magic.json', function(magic) {
                let staticmagicArray = [];
                let mgret = [];
                var magicIds = Object.keys(magic);
                for (let i = 0; i < magicIds.length; i++) {
                  let magicId = magicIds[i];
									const found = masterBraveAbilities.includes(magicId);
									if (!magic[magicId].name) {magic[magicId].name = "";}
                  if (!magic[magicId].magic_type) {magic[magicId].magic_type = "";}
                  if (!magic[magicId].compendium_id) {magic[magicId].compendium_id = 0;}
                  if (!magic[magicId].effects) {magic[magicId].effects = "";}
                  if (!magic[magicId].rarity) {magic[magicId].rarity = 0;}
                  if (!magic[magicId].element_inflict) {magic[magicId].element_inflict = "";}
                  var magicData = {
                    "magicId": Number(magicId),
                    "magicName": magic[magicId].name,
                    "magicType": magic[magicId].magic_type,
                    "compendiumId": magic[magicId].compendium_id,
                    "effects": magic[magicId].effects[0],
                    "rarity": magic[magicId].rarity,
                    "element": magic[magicId].element_inflict,
										"brave": String(found)
                  }; //end of the magicData object defenition
                  mgret.push(magicData);
                } //end of the magic for loop
                staticmagicArray = _.flattenDeep(mgret);
                fs.writeFileSync("./assets/static/flattenedStaticmagic.json", JSON.stringify(staticmagicArray));
              } //end of the get data async function
            ); //end of getData for skills_magic.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being skills_magic.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being skills_magic.
    if (tree[i].name == 'skills_ability.json') {
      var asha = tree[i].sha;
      var asize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var abilityfvkeys = Object.keys(fileVersions);
      for (let a = 0; a < abilityfvkeys.length; a++) {
        if (fileVersions[a].path == "skills_ability.json") {
          if (fileVersions[a].sha == asha) {
            console.log("skills_ability.json matches.");
          } else if (fileVersions[a].sha != asha) {
            console.log("skills_ability.json does not match.");
            fileVersions[a].sha = asha;
            fileVersions[a].size = asize;
            getData('skills_ability.json', function(ability) {
                let staticAbilityArray = [];
                let aret = [];
                var abilityIds = Object.keys(ability);
                for (let i = 0; i < abilityIds.length; i++) {
									let abilityId = abilityIds[i];
									const found = masterBraveAbilities.includes(abilityId);
                  if (!ability[abilityId].name) {ability[abilityId].name = "";}
                  if (!ability[abilityId].type) {ability[abilityId].type = "";}
                  if (!ability[abilityId].compendium_id) {ability[abilityId].compendium_id = 0;}
                  if (!ability[abilityId].effects) {ability[abilityId].effects = "";}
                  if (!ability[abilityId].rarity) {ability[abilityId].rarity = 0;}
                  var abilityData = {
                    "abilityId": Number(abilityId),
                    "abilityName": ability[abilityId].name,
                    "abilityType": ability[abilityId].effect_type,
                    "compendiumId": ability[abilityId].compendium_id,
                    "effects": ability[abilityId].effects[0],
                    "rarity": ability[abilityId].rarity,
										"brave": String(found)
                  }; //end of the abiltyData object defenition
                  aret.push(abilityData);
                } //end of the Ability for loop
                staticAbilityArray = _.flattenDeep(aret);
                fs.writeFileSync("./assets/static/flattenedStaticAbility.json", JSON.stringify(staticAbilityArray));
              } //end of the get data async function
            ); //end of getData for skills_ability.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being skills_ability.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being skills_ability.
    if (tree[i].name == 'items.json') {
      var isha = tree[i].sha;
      var isize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var itemfvkeys = Object.keys(fileVersions);
      for (let k = 0; k < itemfvkeys.length; k++) {
        if (fileVersions[k].path == "items.json") {
          if (fileVersions[k].sha == isha) {
            console.log("items.json matches.");
          } else if (fileVersions[k].sha != isha) {
            console.log("item.json does not match.");
            fileVersions[k].sha = isha;
            fileVersions[k].size = isize;
            getData('items.json', function(items) {
                let staticItemArray = [];
                let iret = [];
                var itemIds = Object.keys(items);
                for (let i = 0; i < itemIds.length; i++) {
                  let itemId = itemIds[i];
                  if (!items[itemId].name) {items[itemId].name = "";}
                  if (!items[itemId].type) {items[itemId].type = "";}
                  if (!items[itemId].compendium_id) {items[itemId].compendium_id = 0;}
                  if (!items[itemId].effects) {items[itemId].effects = "";}
                  if (!items[itemId].stack_size) {items[itemId].stack_size = 0;}
                  if (!items[itemId].strings.desc_short) {items[itemId].strings.desc_short = "";}
                  var itemData = {
                    "itemId": Number(itemId),
                    "itemName": items[itemId].name,
                    "itemType": items[itemId].type,
                    "compendiumId": items[itemId].compendium_id,
                    "effects": items[itemId].effects[0],
                    "stackSize": items[itemId].stack_size,
                    "desc_short": items[itemId].strings.desc_short[0]
                  }; //end of theitemData object defenition
                  iret.push(itemData);
                } //end of the item for loop
                staticItemArray = _.flattenDeep(iret);
                fs.writeFileSync("./assets/static/flattenedStaticItems.json", JSON.stringify(staticItemArray));
              } //enf ot eh get data async function
            ); //end of getData for items.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of if statment for fileVersions being items.json
      } //end of looping through the fileVersions object
    } //end of loop for tree value being items.
		if (tree[i].name == 'enhancements.json') {
			var ensha = tree[i].sha;
			var ensize = tree[i].size;
			let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
			let fileVersions = JSON.parse(rawdata);
			var enhfvkeys = Object.keys(fileVersions);
			for (let e = 0; e < enhfvkeys.length; e++) {
				if (fileVersions[e].path == "enhancements.json") {
					if (fileVersions[e].sha == ensha) {
						console.log("enhancements.json matches.");
					} else if (fileVersions[e].sha != ensha) {
						console.log("enhancements.json does not match.");
						fileVersions[e].sha = ensha;
						fileVersions[e].size = ensize;
						getData('enhancements.json', function(enhancements) {
							let staticEnhancementsArray = [];
							let brave_abilities=[];
							let forticite=[271000100,271000200,271000300,271000400,271000500,271000600,271000700,271000800,271000900,271001000,271001100,271001200,271001300,271001400,271001500,271001600,271001700,271001800];
							let t1material = [271000100,271000400,271000700,271001000,271001300,271001600,270004600,270002600,270004100,270000100,270000600,270001100,270003100,270003600];
							let t2material = [271000200,271000500,271000800,271001100,271001400,271001700,270002700,270004200,270000200,270000700,270001200,270003200,270003700,270004700];
							let t3material = [271000300,271000600,271000900,271001200,271001500,271001800,270000300,270000800,270001300,270003300,270003800,270004300,270004800,270002800];
							let eret = [];
							var enhancementsIds = Object.keys(enhancements);
							for (let n = 0; n < enhancementsIds.length; n++) {
								let mretIds=[0,0];//theIds of each Material
								let mretCounts=[0,0];//the counts of each material needed
								let rmret=[[0,0],[0,0]]; //the array to hold arrays of pairs
								let enhancementsId = enhancementsIds[n];//get the key value
								_.each(enhancements[enhancementsId].units, function(value){
									var materialsIds = Object.keys(enhancements[enhancementsId].cost.materials);
									const found = materialsIds.some(r=> forticite.includes(Number(r)));
									var materials=enhancements[enhancementsId].cost.materials;
	    if(found==true){
				brave_abilities.indexOf(Number(enhancements[enhancementsId].skill_id_old)) === -1 ? brave_abilities.push(Number(enhancements[enhancementsId].skill_id_old)):console.log();
	    	for (let m = 0; m < materialsIds.length; m++) {
	      	var braveMaterialsId = Number(materialsIds[m]);
	        var matOrder;
	        var braveMaterialsCount = materials[braveMaterialsId];
	        var ist1=t1material.includes(braveMaterialsId);
	        var ist2=t2material.includes(braveMaterialsId);
	        var ist3=t3material.includes(braveMaterialsId);
	        if(ist1==true){matOrder = 0;}
	        if(ist2==true){matOrder = 1;}
					if(ist3==true){matOrder = 2;}
	        if(ist1!=true && ist2!=true && ist3!=true){matOrder=materialsIds.length-1;}
	        rmret[matOrder] = ([braveMaterialsId,braveMaterialsCount]);
	        mretIds[matOrder]=(braveMaterialsId);
	        mretCounts[matOrder] = (braveMaterialsCount);
	        }
				}else if(found==false){
	      	for (let m1 = 0; m1 < materialsIds.length; m1++) {
	        	var materialsId = Number(materialsIds[m1]);
	          var materialsCount = materials[materialsId];
	          rmret[m1]=([materialsId,materialsCount]);
						mretIds[m1]=(materialsId);
						mretCounts[m1]=(materialsCount);
	          }
	        }
					var descriptionIds = Object.keys(enhancements[enhancementsId].strings.description);
					var descriptionObj = enhancements[enhancementsId].strings.description;
					var engDescription;
					for (let d=0; d < descriptionIds.length; d++){
	        	let descriptionId = descriptionIds[d];
	          if(descriptionId=="0" && descriptionObj[descriptionId]){engDescription=descriptionObj[descriptionId];}
					}
	        var thisskill_old_id = [];
	        thisskill_old_id[0]=enhancements[enhancementsId].skill_id_old;
	        if(!rmret[2]){rmret[2]=[0,0];}
	        if(!rmret[3]){rmret[3]=[0,0];}
	        if(!rmret[4]){rmret[4]=[0,0];}
	        var enhancementsData = {
	        	"enhancementsId": Number(enhancementsId),
	          "enhancementUniqueId": (enhancementsId.concat('-',value)),
	          "enhancementsName": enhancements[enhancementsId].name,
	          "skill_id_old": Number(enhancements[enhancementsId].skill_id_old),
	          "skill_id_new": Number(enhancements[enhancementsId].skill_id_new),
	          "enhancementDescript":engDescription,
	          "unit":Number(value),
	          "gil":Number(enhancements[enhancementsId].cost.gil),
	          "firstMaterialId" : Number(rmret[0][0]),
	          "firstMaterialCount" : Number(rmret[0][1]),
	          "secondMaterialId": Number(rmret[1][0]),
	          "secondMaterialCount" : Number(rmret[1][1]),
	          "thirdMaterialId" : Number(rmret[2][0]),
	          "thirdMaterialCount" : Number(rmret[2][1]),
	          "fourthMaterialId" : Number(rmret[3][0]),
	          "fourthMaterialCount" : Number(rmret[3][1]),
	          "fifthMaterialId" :  Number(rmret[4][0]),
	          "fifthMaterialCount" : Number(rmret[4][1]),
	          "brave" : String(found)
										}; //end of the enhancementsData object defenition
										//console.log("enhancement data object",enhancementsData);
										eret.push(enhancementsData);
		                }
									);//end of units loop
									} //end of the enhancements for loop
								staticEnhancementsArray = _.flattenDeep(eret);
	             var tierdAbilities=alasql(
	'SELECT distinct a.enhancementsId, a.enhancementUniqueId, a.enhancementsName, a.skill_id_old, a.skill_id_new, a.enhancementDescript, a.unit, a.gil, a.firstMaterialId, a.firstMaterialCount '+
	',a.secondMaterialId, a.secondMaterialCount, a.thirdMaterialId, a.thirdMaterialCount, a.fourthMaterialId, a.fourthMaterialCount, a.fifthMaterialId, a.fifthMaterialCount, a.brave '+
	'	, CASE WHEN a.brave = "true" THEN CASE WHEN t1_test.skill_id_old IS NULL THEN "Level 2" ELSE CASE WHEN t2_test.skill_id_old IS NULL THEN "Level3" ELSE CASE WHEN t3_test.skill_id_old IS NULL THEN "Level4" ELSE "Level5" END END END ELSE CASE WHEN t1_test.skill_id_old IS NULL THEN "+1" ELSE CASE WHEN t2_test.skill_id_old IS NULL THEN "+2" END END END AS AbilityRank '+
	'FROM ? AS a '+
	'LEFT JOIN ? AS t1_test ON t1_test.skill_id_new = a.skill_id_old '+
	'LEFT JOIN ? AS t2_test ON t2_test.skill_id_new = t1_test.skill_id_old '+
	'LEFT JOIN ? AS t3_test ON t3_test.skill_id_new = t2_test.skill_id_old '+
	'LEFT JOIN ? AS t4_test ON t4_test.skill_id_new = t3_test.skill_id_old '+
	'WHERE 1 = 1 '+
	'AND a.enhancementDescript IS NOT NULL',[staticEnhancementsArray,staticEnhancementsArray,staticEnhancementsArray,staticEnhancementsArray,staticEnhancementsArray]);

							fs.writeFileSync("./assets/static/flattenedStaticEnhancements.json", JSON.stringify(tierdAbilities));
							fs.writeFileSync("./assets/static/brave_abilities.json", JSON.stringify(brave_abilities));
					} //end of the get data async function
				); //end of getData for enhancements.json
				fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
			} //end of if statement for new file
		} //end of if statment for fileVersions being enhancements.json
	} //end of looping through the fileVersions object
} //end of loop for tree value being enhancements.
    if (tree[i].name == 'units.json') {
      var usha = tree[i].sha;
      var usize = tree[i].size;
      let rawdata = fs.readFileSync("./assets/static/fileVersions.json");
      let fileVersions = JSON.parse(rawdata);
      var ufvkeys = Object.keys(fileVersions);
      for (let j = 0; j < ufvkeys.length; j++) {
        if (fileVersions[j].path == 'units.json') {
          if (fileVersions[j].sha == usha) {
            console.log("units.json matches.");
          } else if (fileVersions[j].sha != usha) {
						console.log("units.json does not match.");
            fileVersions[j].sha = usha;
            fileVersions[j].size = usize;
            getData('units.json', function(units) {
                let staticUnitsArray = [];
                let unitIds = [];
                for (var unitId in units) {
									if(units.hasOwnProperty(unitId)){
                  var unitIn = units[unitId];
                  if (!filterGame.includes(unitIn["game_id"]) && unitIn.name && !filterUnits.includes(unitId)) {
                    unitIds.push(unitId);
                  }
								}
                }
                var uret = []; //declare outside the for loop to put values into
                //create the loop that goes through the jsonObj
                for (let i = 0; i < unitIds.length; i++)
                //the things to do for each key
                {
                  //a variable named unitId that will be given the key of the Unit
                  let unitId = unitIds[i];
                  if (!units[unitId].rarity_min) {units[unitId].rarity_min = 0;}
                  let rarity_min = units[unitId].rarity_min;
                  if (!units[unitId].rarity_max) {units[unitId].rarity_max = 0;}
                  let rarity_max = units[unitId].rarity_max;
                  if (!units[unitId].name) {units[unitId].name = "NoName";}
                  let name = units[unitId].name;
                  if (!units[unitId].roles) {units[unitId].roles = [];}
                  let roles = _.join(units[unitId].roles, ': ');
                  if (!units[unitId].TMR) {units[unitId].TMR = [];}
                  let tmr = units[unitId].TMR[1];
                  if (!units[unitId].sTMR) {units[unitId].sTMR = [];}
                  let stmr = units[unitId].sTMR[1];
                  if (!units[unitId].entries) {units[unitId].entries = {};}
                  let units1 = units[unitId].entries;
                  var ekeys = Object.keys(units1);
                  var eret = [];
                  for (let j = 0; j < ekeys.length; j++) { //start of the entryFor Loop
                    let entryId = ekeys[j];
                    if (!units1[entryId].compendium_id) {units1[entryId].compendium_id = 0;}
                    let compendium_id = units1[entryId].compendium_id;
                    let attackFrames = units1[entryId].attack_frames.slice(-1)[0];
                    if (!units1[entryId].rarity) {units1[entryId].rarity = 0;}
                    let rarity = units1[entryId].rarity;
                    if (rarity == 4 && name.includes("Mini Tough Pot")) {name = "Tough Pot";
                    } else if (rarity == 5 && name.includes("Mini Tough Pot")) {name = "King Tough Pot";
                    } else if (rarity == 4 && name.includes("Mini Magi Pot")) {name = "Magi Pot";
                    } else if (rarity == 5 && name.includes("Mini Magi Pot")) {name = "King Magi Pot";
                    } else if (rarity == 4 && name.includes("Mini Power Pot")) {name = "Power Pot";
                    } else if (rarity == 5 && name.includes("Mini Power Pot")) {name = "King Power Pot";
                    } else if (rarity == 4 && name.includes("Mini Shield Pot")) {name = "Shield Pot";
                    } else if (rarity == 5 && name.includes("Mini Shield Pot")) {name = "King Shield Pot";
                    } else if (rarity == 4 && name.includes("Mini Smart Pot")) {name = "Smart Pot";
                    } else if (rarity == 5 && name.includes("Mini Smart Pot")) {name = "King Smart Pot";
                    } else if (rarity == 4 && name.includes("Mini Soul Pot")) {name = "Sould Pot";
                    } else if (rarity == 5 && name.includes("Mini Soul Pot")) {name = "King Soul Pot";
                    } else if (rarity == 4 && name.includes("Mini Burst Pot")) {name = "Burst Pot";
                    } else if (rarity == 5 && name.includes("Mini Burst Pot")) {name = "King Burst Pot";
                    } else if (rarity == 2 && name.includes("Mini Tough Door")) {name = "Tough Door";
                    } else if (rarity == 2 && name.includes("Mini Magi Door")) {name = "Magi Door";
                    } else if (rarity == 2 && name.includes("Mini Power Door")) {name = "Power Door";
                    } else if (rarity == 2 && name.includes("Mini Shield Door")) {name = "Shield Door";
                    } else if (rarity == 2 && name.includes("Mini Smart Door")) {name = "Smart Door";
                    } else if (rarity == 2 && name.includes("Mini Soul Door")) {name = "Soul Door";
                    }
                    if (!units1[entryId].stats.HP[2]) {units1[entryId].stats.HP[2] = 0;}
                    let hpPot = units1[entryId].stats.HP[2];
                    if (!units1[entryId].stats.HP[3]) {units1[entryId].stats.HP[3] = 0;}
                    let hpDoor = units1[entryId].stats.HP[3];
                    if (!units1[entryId].stats.MP[2]) {units1[entryId].stats.MP[2] = 0;}
                    let mpPot = units1[entryId].stats.MP[2];
                    if (!units1[entryId].stats.MP[3]) {units1[entryId].stats.MP[3] = 0;}
                    let mpDoor = units1[entryId].stats.MP[3];
                    if (!units1[entryId].stats.ATK[0]) {units1[entryId].stats.ATK[0] = 0;}
                    let atkPot = units1[entryId].stats.ATK[2];
                    if (!units1[entryId].stats.ATK[3]) {units1[entryId].stats.ATK[3] = 0;}
                    let atkDoor = units1[entryId].stats.ATK[3];
                    if (!units1[entryId].stats.DEF[2]) {units1[entryId].stats.DEF[2] = 0;}
                    let defPot = units1[entryId].stats.DEF[2];
                    if (!units1[entryId].stats.DEF[3]) {units1[entryId].stats.DEF[3] = 0;}
                    let defDoor = units1[entryId].stats.DEF[3];
                    if (!units1[entryId].stats.MAG[2]) {units1[entryId].stats.MAG[2] = 0;}
                    let magPot = units1[entryId].stats.MAG[2];
                    if (!units1[entryId].stats.MAG[3]) {units1[entryId].stats.MAG[3] = 0;}
                    let magDoor = units1[entryId].stats.MAG[3];
                    if (!units1[entryId].stats.SPR[2]) {units1[entryId].stats.SPR[2] = 0;}
                    let sprPot = units1[entryId].stats.SPR[2];
                    if (!units1[entryId].stats.SPR[3]) {units1[entryId].stats.SPR[3] = 0;}
                    let sprDoor = units1[entryId].stats.SPR[3];
										let fragmentId=0;

										console.log('entryId and math.floor',entryId, entryId%100);
										if (units1[entryId].nv_upgrade){
											fragmentId = Object.keys(units1[entryId].nv_upgrade[0].materials).filter(id => units1[entryId].nv_upgrade[0].materials[id] % 25 === 0)[0];
										console.log('object keys',Object.keys(units1[entryId].nv_upgrade[0].materials));
										console.log('updated FragmentId',fragmentId);
										}
                    var entryData = {
                      "unitId": Number(unitId),
                      "unitName": name,
                      'rarity': rarity,
                      "roles": roles,
                      "rarityMin": rarity_min,
                      "rarityMax": rarity_max,
                      "tmrId": tmr,
                      "stmrId": stmr,
                      'id': Number(entryId),
                      'compendiumId': compendium_id,
                      'attackFrames': attackFrames,
                      'HPpotsMax': hpPot,
                      'HPdoorsMax': hpDoor,
                      'MPpotsMax': mpPot,
                      'MPdoorsMax': mpDoor,
                      'ATKpotsMax': atkPot,
                      'ATKdoorsMax': atkDoor,
                      'DEFpotsMax': defPot,
                      'DEFdoorsMax': defDoor,
                      'MAGpotsMax': magPot,
                      'MAGdoorsMax': magDoor,
                      'SPRpotsMax': sprPot,
                      'SPRdoorsMax': sprDoor,
											'fragmentId': fragmentId
                    }; //end of entryData object declaration
                    eret.push(entryData);
                  } //end of the entry ForLoop
                  uret.push(eret);
                } //close out the forEach unit loop
                staticUnitsArray = _.flattenDeep(uret);
                fs.writeFileSync("./assets/static/flattenedStaticUnits.json", JSON.stringify(staticUnitsArray));
              } //end of the flatten unit function
            ); //end of getData for units.json
            fs.writeFileSync("./assets/static/fileVersions.json", JSON.stringify(fileVersions));
          } //end of if statement for new file
        } //end of checking if the file is units.json
      } //end of for loop for each of the values in the fileVersions local filterEnhancers
    } //end of if statement for if the tree value is units.json
  } //end of the for loop for each tree entry
} //end of the checkVersion function definition
checkVersion('units.json',function(result){});
exports.flattenOwnedUnits = function(e,username) {
    let lines = e;
    //console.log("lines variable",lines);
    for (var z=0; z<lines.length;z++)
    {
      if(!lines[z].tmrId){lines[z].tmrId=0;}
      if(lines[z].tmrId){lines[z].tmrId=Number(lines[z].tmrId);}
      if(!lines[z].stmrId){lines[z].stmrId=0;}
      if(lines[z].stmrId){lines[z].stmrId=Number(lines[z].stmrId);}
      if(lines[z].LBMaxLevel){lines[z].LBMaxLevel=Number(lines[z].LBMaxLevel);}
      if(lines[z].LBLevel){lines[z].LBLevel=Number(lines[z].LBLevel);}
      if(lines[z].LBExp){lines[z].LBExp=Number(lines[z].LBExp);}
      lines[z].id=Number(lines[z].id);
      lines[z].uniqueId=Number(lines[z].uniqueId);
      lines[z].tmr=Number(lines[z].tmr);
      lines[z].stmr=Number(lines[z].stmr);
    }
    var newArr=lines;
    var ret=[];
    let staticEnhancers=constants;
    var moogles = _.sortBy(alasql(
    'select b.unitName as UnitName, count(*) as NumberOwned, case when a.id in (906000103,906000104,906000105) then a.stmr else a.tmr end as Trust, case when c.materiaName is null and d.equipName is null then "All" when c.materiaName is null and d.equipName is not null then d.equipName when d.eqipName is null and c.materiaName is not null then c.materiaName else "I do not know what happened" end as TrustName'+
    ' from ? as a'+
    ' join ? as b on a.id=b.id'+
    ' left join ? as c on c.materiaId=case when a.tmrId=0 then a.stmrId else a.tmrId end'+
    ' left join ? as d on d.equipId=case when a.tmrId=0 then a.stmrId else a.tmrId end'+
    ' where 1=1'+
    ' and a.id in (904000101,904000103,904000104,904000105,904000115,906000103,906000104,906000105)'+
    ' group by case when a.id in (906000103,906000104,906000105) then a.stmr else a.tmr end , b.unitName, a.level,c.materiaName, d.equipName, a.tmrId,'+
    ' case when c.materiaName is null and d.equipName is null then "All" when c.materiaName is null and d.equipName is not null then d.equipName when d.eqipName is null and c.materiaName is not null then c.materiaName else "I do not know what happened" end',[newArr,staticEnhancers,masterStaticMateria,masterStaticEquipment,masterStaticEquipment]),['UnitName','TrustName','Trust']);
    var cactuars = _.sortBy(alasql('select b.unitName as UnitName, count(*) as NumberOwned, a.level as Level from ? as a join ? as b on a.id=b.id where 1=1 and a.id in (900020101,900020201,900020301,900020401,900010101,900010201,900010301,900010401,900010501) group by b.unitName, a.level',[newArr,staticEnhancers]),['UnitName','Level']);
    var pots = _.sortBy(alasql('select b.unitName as UnitName, count(*) as NumberOwned, b.stat as Stat, b.effect+(pots->hp)+(pots->mp)+(pots->atk)+(pots->def)+(pots->mag)+(pots->spr) as [effect] from ? as a join ? as b on a.id=b.id where 1=1 and a.id in (900000101,900000201,900000301,900001101,900001201,900001301,900002101,900002201,900002301,900003101,900003201,900003301,900004101,900004201,900004301,900005101,900005201,900005301,903001101,903001102,903001201,903001202,903001301,903001302,903001401,903001402,903001501,903001502,903001601,903001602,905000102,905000103,905000104) group by b.unitName, a.level,b.stat,b.effect+(pots->hp)+(pots->mp)+(pots->atk)+(pots->def)+(pots->mag)+(pots->spr)',[newArr,staticEnhancers]),['Stat','effect']);
    //console.log("the enhancement units",moogles,cactuars,pots);
    for (var i = 0; i < newArr.length; i++)
  {//start of for loop for each object
    if ([900000101,900000201,900000301,900001101,900001201,900001301,900002101,900002201,900002301,900003101,900003201,900003301,900004101,900004201,900004301,900005101,900005201,900005301,900010101,900010201,900010301,900010401,900010501,900020101,900020201,900020301,900020401,903001101,903001102,903001201,903001202,903001301,903001302,903001401,903001402,903001501,903001502,903001601,903001602,904000101,904000103,904000104,904000105,904000115,905000102,905000103,905000104,906000103,906000104,906000105].includes(newArr[i].id)) {continue;}
    let id=newArr[i].id;
    var hp=0;
    var mp=0;
    var atk=0;
    var def=0;
    var mag=0;
    var spr=0;
    var doors_hp=0;
    var doors_mp=0;
    var doors_atk=0;
    var doors_def=0;
    var doors_mag=0;
    var doors_spr=0;
    if(!newArr[i].pots){newArr[i].pots={"hp":0,"mp":0,"atk":0,"def":0,"mag":0,"spr":0};}
    if(!newArr[i].doors){newArr[i].doors={"hp":0,"mp":0,"atk":0,"def":0,"mag":0,"spr":0};}
    if(!newArr[i].enhancements){newArr[i].enhancements=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];}
    if(!newArr[i].level){newArr[i].level=0;}
    if(!newArr[i].uniqueId){newArr[i].uniqueId=0;}
    if(!newArr[i].stmr){newArr[i].stmr=0;}
    if(!newArr[i].tmr){newArr[i].tmr=0;}
    if(!newArr[i].lbLevel){newArr[i].lbLevel=0;}
    if(!newArr[i].unitLb){newArr[i].unitLb=0;}
    let level=newArr[i].level;
    if(!newArr[i].pots.hp||newArr[i].pots.hp===0){hp=0;}else{hp=newArr[i].pots.hp;}
    if(!newArr[i].pots.mp||newArr[i].pots.mp===0){mp=0;}else{mp=newArr[i].pots.mp;}
    if(!newArr[i].pots.atk||newArr[i].pots.atk===0){atk=0;}else{atk=newArr[i].pots.atk;}
    if(!newArr[i].pots.def||newArr[i].pots.def===0){def=0;}else{def=newArr[i].pots.def;}
    if(!newArr[i].pots.mag||newArr[i].pots.mag===0){mag=0;}else{mag=newArr[i].pots.mag;}
    if(!newArr[i].pots.spr||newArr[i].pots.spr===0){spr=0;}else{spr=newArr[i].pots.spr;}
    if(!newArr[i].doors.hp||newArr[i].doors.hp===0){doors_hp=0;}else{doors_hp=newArr[i].doors.hp;}
    if(!newArr[i].doors.mp||newArr[i].doors.mp===0){doors_mp=0;}else{doors_mp=newArr[i].doors.mp;}
    if(!newArr[i].doors.atk||newArr[i].doors.atk===0){doors_atk=0;}else{doors_atk=newArr[i].doors.atk;}
    if(!newArr[i].doors.def||newArr[i].doors.def===0){doors_def=0;}else{doors_def=newArr[i].doors.def;}
    if(!newArr[i].doors.mag||newArr[i].doors.mag===0){doors_mag=0;}else{doors_mag=newArr[i].doors.mag;}
    if(!newArr[i].doors.spr||newArr[i].doors.spr===0){doors_spr=0;}else{doors_spr=newArr[i].doors.spr;}
    let tmr=newArr[i].tmr;
    let stmr=newArr[i].stmr;
    let uniqueId=newArr[i].uniqueId;
    if(!newArr[i].enhancements[0]){newArr[i].enhancements[0]=0;}
    let enhancement0=newArr[i].enhancements[0];
    if(!newArr[i].enhancements[1]){newArr[i].enhancements[1]=0;}
    let enhancement1=newArr[i].enhancements[1];
    if(!newArr[i].enhancements[2]){newArr[i].enhancements[2]=0;}
    let enhancement2=newArr[i].enhancements[2];
    if(!newArr[i].enhancements[3]){newArr[i].enhancements[3]=0;}
    let enhancement3=newArr[i].enhancements[3];
    if(!newArr[i].enhancements[4]){newArr[i].enhancements[4]=0;}
    let enhancement4=newArr[i].enhancements[4];
    if(!newArr[i].enhancements[5]){newArr[i].enhancements[5]=0;}
    let enhancement5=newArr[i].enhancements[5];
		if(!newArr[i].enhancements[6]){newArr[i].enhancements[6]=0;}
    let enhancement6=newArr[i].enhancements[6];
		if(!newArr[i].enhancements[7]){newArr[i].enhancements[7]=0;}
    let enhancement7=newArr[i].enhancements[7];
		if(!newArr[i].enhancements[8]){newArr[i].enhancements[8]=0;}
    let enhancement8=newArr[i].enhancements[8];
		if(!newArr[i].enhancements[9]){newArr[i].enhancements[9]=0;}
    let enhancement9=newArr[i].enhancements[9];
		if(!newArr[i].enhancements[10]){newArr[i].enhancements[10]=0;}
    let enhancement10=newArr[i].enhancements[10];
		if(!newArr[i].enhancements[11]){newArr[i].enhancements[11]=0;}
    let enhancement11=newArr[i].enhancements[11];
		if(!newArr[i].enhancements[12]){newArr[i].enhancements[12]=0;}
    let enhancement12=newArr[i].enhancements[12];
		if(!newArr[i].enhancements[13]){newArr[i].enhancements[13]=0;}
    let enhancement13=newArr[i].enhancements[13];
		if(!newArr[i].enhancements[14]){newArr[i].enhancements[14]=0;}
    let enhancement14=newArr[i].enhancements[14];
  var unitData ={
    'id': id,
    'uniqueId':uniqueId,
    'stmr':stmr,
    'tmr':tmr,
    'level':level,
    'HPpotsUsed':hp,
    'MPpotsUsed':mp,
    'ATKpotsUsed':atk,
    'DEFpotsUsed':def,
    'MAGpotsUsed':mag,
    'SPRpotsUsed':spr,
    'HPdoorsUsed':doors_hp,
    'MPdoorsUsed':doors_mp,
    'ATKdoorsUsed':doors_atk,
    'DEFdoorsUsed':doors_def,
    'MAGdoorsUsed':doors_mag,
    'SPRdoorsUsed':doors_spr,
    'Enhancement0':Number(enhancement0),
    'Enhancement1':Number(enhancement1),
    'Enhancement2':Number(enhancement2),
    'Enhancement3':Number(enhancement3),
    'Enhancement4':Number(enhancement4),
    'Enhancement5':Number(enhancement5),
		'Enhancement6':Number(enhancement6),
    'Enhancement7':Number(enhancement7),
    'Enhancement8':Number(enhancement8),
    'Enhancement9':Number(enhancement9),
    'Enhancement10':Number(enhancement10),
    'Enhancement11':Number(enhancement11),
		'Enhancement12':Number(enhancement12),
    'Enhancement13':Number(enhancement13),
    'Enhancement14':Number(enhancement14),
    'userName':username,
    'LBLevel':newArr[i].lbLevel,
    'LBExp':newArr[i].currentLbLevelExp,
		'exRank': newArr[i].exRank,
		'nva': newArr[i].nva,
		'nvRarity': newArr[i].nvRarity,
		'totalExp': newArr[i].totalExp,
		'currentLevelExp': newArr[i].currentLevelExp
    };
    ret.push(unitData);//push data into the ret array
  }//end of the for loop
  return {
    "flattenedOwnedUnits":ret,
    "moogles":moogles,
    "cactuars":cactuars,
    "pots":pots
  };
};//end of function flattenOwnedUnits
exports.flattenOwnedEquipment= function(e,username) {
    var newArr = e;
    var ret=[];
    var itemData={};
    for (var i = 0; i < newArr.length; i++)
  {//start of for loop for each object
    let invId=newArr[i].id;
    if (newArr[i].hasOwnProperty('enhancements')){
    itemData =
    {
      'id': Number(invId),
      'numberOwned':newArr[i].count,
      'Enhancement0':Number(newArr[i].enhancements[0]),
      'Enhancement1':Number(newArr[i].enhancements[1]),
      'Enhancement2':Number(newArr[i].enhancements[2]),
      'userName':username
    };
    ret.push(itemData);//push data into the ret array
    } else {itemData ={
      'id': Number(invId),
      'numberOwned':newArr[i].count,
      'userName':username
      };
      ret.push(itemData);//push data into the ret array
    }//close out the else condition
    }//end of the for loop
    return{ret};
  };//end of function flattenOwnedEquipment
exports.flattenOwnedConsumables= function(e,username) {
      var newArr = e;
      var ret=[];
      var consumablesData={};
      for (var i = 0; i < newArr.length; i++)
    {//start of for loop for each object
      let consId=newArr[i].itemId;
      consumablesData ={
        'id': Number(consId),
        'numberOwned':Number(newArr[i].itemQty),
        'userName':username
        };
        ret.push(consumablesData);//push data into the ret array
      }//end of the for loop
      return{ret};
    };//end of function flattenOwnedConsumables
