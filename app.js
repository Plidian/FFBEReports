const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//const fs = require('fs');
//const mime = require('mime-types');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
require('./config/passport')(passport);
//const sessions = require('client-sessions');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const sql = require('mssql');
const alasql = require('alasql');
//const config = require('./config.js');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const ns = require("./public/javascripts/common.js");
const masterStaticMateria = require ('./assets/static/flattenedStaticMateria.json');
const masterStaticItems = require('./assets/static/flattenedStaticItems.json');
const masterStaticUnits = require('./assets/static/flattenedStaticUnits.json');
const masterStaticEquipment = require('./assets/static/flattenedStaticEquipment.json');
const masterSkillPassive = require('./assets/static/flattenedStaticPassives.json');
const masterSkillActive = require('./assets/static/flattenedStaticAbility.json');
const masterSkillMagic = require('./assets/static/flattenedStaticMagic.json');
const masterLimitBursts = require('./assets/static/flattenedLimitBursts.json');
//const MssqlStore = require('./server/lib/sql_session')(session);
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
connectDB();
//parameters for accessing the SQL Server.
const dbData = require('./server/dbconfig.json');
const user=dbData.user;
const password=dbData.password;
const server=dbData.server;
const database=dbData.database;
const options=dbData.options;
var writeToSql="true";
const dbConfig = {
	user: user,
	password: password,
	server:server,
	database:database,
	options:options
	};
var outsideCSVpots;
var outsideJSONpots;
var outsideCSVcactuars;
var outsideJSONcactuars;
var outsideCSVmoogles;
var outsideJSONmoogles;
var outsideCSVUnits;
var outsideJSONUnits;
var outsideCSVinventory;
var outsideJSONinventory;
var outsideCSVconsumables;
var outsideJSONconsumables;
var outsideUserName;
var outsideDownloadJSONinventory;

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//Logging
app.use(morgan('dev'));

// view engine setup
app.set('view engine', '.ejs');


// Session middleware
app.use(
 session({
   secret: 'cattitude',
	 genid: function(req){
//		 return genuuid() //use UUIDs for session eqIds
	 },
	 name: "plidiname",
	 cookie: {
		 httpOnly: true,
		 secure: true,
		 sameSite: true,
		 maxAge: 600000 // Time is in miliseconds
 		},
   resave: false,
   saveUninitialized: false,
   store: new MongoStore({ mongooseConnection: mongoose.connection }),
 })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static Folder
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/', indexRouter);
app.use('/auth', require('./routes/auth'));
app.use('/users', usersRouter);
app.use(fileUpload());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});


app.post('/upload_grid', async (req, res) => {
  try {//test if the files had anything in them
		if (!req.files) {
			res.send({
				status:false,
				message: 'No files were uploaded. req.files was falsey'
			});
	} else if (Object.keys(req.files).length === 0){
		res.send({
			status:false,
			message:'No files were uploaded. req.files length was 0'
		});
	} else if(!req.body.user){
		res.send({
			status: false,
			message:'No userName specified.'
		});
	} else {
	let username = req.body.user;
	console.log('user value',req.body.user);
	console.log('req.body.db',req.body.db);
	console.log('req.body.files',req.files);
	console.log('the type is',typeof req.files.unitlist);
	if(typeof req.body.db != 'undefined'){writeToSql= req.body.db;}
	var unitFile = [];
	var parsedUnits = [];
	var inventoryFile=[];
	var parsedInventory=[];
	var consumablesFile=[];
	var parsedConsumables=[];
if(!req.files.inventory){
	//create a dummy file if one isn't uploaded
	console.log('no inventory file was provided');
	inventoryFile=[
	{
		"id": "-9",
		"count": 0,
		"enhancements": [
			"0",
			"0",
			"0"
		]
	}];
	parsedInventory=inventoryFile;
	}
	else if(typeof req.files.inventory != 'undefined')//ok so it wasn't empty so now check if it's undefined and if it does put it into inventoryFile array
	{inventoryFile=req.files.inventory;
	parsedInventory=JSON.parse(inventoryFile.data.toString("utf-8"));//parse the file data after turning it into a string so now we should have a JSON variable
	}
	let flattenedInventory=ns.flattenOwnedEquipment(parsedInventory,username);//flatten the JSON object using my flattenOwnedEquipment Function
	let namedInventory=_.sortBy(alasql('select COALESCE(b.equipName,c.materiaName) as Name,'+
	' Coalesce(i.rarity,h.rarity,g.rarity,b.rarity,c.rarity) as rarity'+
	' ,a.numberOwned as NumberOwned, d.skillName as Enhancement0, e.skillName as Enhancement1, f.skillName as Enhancement2 , a.id as itemId, case when i.abilityId is not null then "Ability" when h.magicId is not null then h.magicType when g.skillId is not null then "Passive" when b.equipId is not null then b.itemType end as InventoryType, a.Enhancement0 as Enhancement0Id, a.Enhancement1 as Enhancement1Id, a.Enhancement2 as Enhancement2Id '+
	' from ? as a'+
	' left join ? as b on a.id=b.equipId'+
	' left join ? as c on a.id=c.materiaId'+
	' left join ? as d on d.skillId=a.Enhancement0'+
	' left join ? as e on e.skillId=a.Enhancement1'+
	' left join ? as f on f.skillId=a.Enhancement2'+
	' left join ? as g on g.skillId=c.skills'+
	' left join ? as h on h.magicId=c.skills'+
	' left join ? as i on i.abilityId=c.skills'+
	' where 1=1',[flattenedInventory.ret,masterStaticEquipment,masterStaticMateria,masterSkillPassive,masterSkillPassive,masterSkillPassive,masterSkillPassive,masterSkillMagic,masterSkillActive]),['InventoryType','rarity','Name']);
if(!req.files.consumable){
	//console.log("This should show if the test for not req.files.consumable tested true");
	consumablesFile=[
	{
		"itemId": "-9",
		"itemQty": 0,
		"effects": "",
		"desc_short":""
	}
];
	parsedConsumables=consumablesFile;
	//console.log("At this point there should be a value in parsedConsumables",parsedConsumables);
	}
	else if(typeof req.files.consumable != 'undefined')
	{consumablesFile=req.files.consumable;
		//console.log("this should show if typeof req.files.consumable!= undefined");
	parsedConsumables=JSON.parse(consumablesFile.data.toString("utf-8"));
	}
	let flattenedConsumables=ns.flattenOwnedConsumables(parsedConsumables,username);
	let namedConsumables=(alasql('select b.itemName'+
	' ,b.effects'+
	' ,a.numberOwned as NumberOwned'+
	' ,b.desc_short'+
	'	,a.id as itemId'+
	' from ? as a'+
	' left join ? as b on a.id=b.itemId'+
	' where 1=1',[flattenedConsumables.ret,masterStaticItems]));

if(!req.files.unitlist){
	console.log('No unit file was uploaded');
	unitFile=[
		{
			"id": "-9",

		}
	];
	parsedUnits=unitFile;
}
else if (typeof req.files.unitlist != 'undefined'){
	unitFile=req.files.unitlist;
	console.log('unitfile looks like it is this long',unitFile.length);
parsedUnits=JSON.parse(unitFile.data.toString("utf-8"));}
	let flattenedOwnedUnits=ns.flattenOwnedUnits(parsedUnits,username);
	let flattenedOwned=flattenedOwnedUnits.flattenedOwnedUnits;
	let moogles=flattenedOwnedUnits.moogles;
	let pots= flattenedOwnedUnits.pots;
	let cactuars=flattenedOwnedUnits.cactuars;
console.log('flattenedOwnedUnits has This many records',flattenedOwnedUnits.length);
console.log('flattenedOwned has This many records',flattenedOwned.length);
console.log('moogles has This many records',moogles.length);
console.log('pots has This many records',pots.lenhth);
console.log('cactuars has This many records',cactuars.length);
var items;
var sortedItems;
	if(flattenedOwned[0].id!=="-9"){//ifthe flattenedOwned is not empty then do some SQL
 items=(alasql('select'+
' b.unitId, b.unitName, b.rarity, b.roles, b.rarityMin, b.rarityMax, b.tmrId, b.stmrId,  a.id, b.compendiumId, b.attackFrames,'+
' b.HPpotsMax, b.HPdoorsMax, b.MPpotsMax, b.MPdoorsMax, b.ATKpotsMax, b.ATKdoorsMax, b.DEFpotsMax, b.DEFdoorsMax, b.MAGpotsMax, b.MAGdoorsMax, b.SPRpotsMax, b.SPRdoorsMax,'+
' uniqueId, stmr, tmr, level, HPpotsUsed, MPpotsUsed, ATKpotsUsed, DEFpotsUsed, MAGpotsUsed, SPRpotsUsed, HPdoorsUsed, MPdoorsUsed, ATKdoorsUsed, DEFdoorsUsed, MAGdoorsUsed, SPRdoorsUsed,'+
' Enhancement0, Enhancement1, Enhancement2, Enhancement3, Enhancement4, Enhancement5,Enhancement6, Enhancement7, Enhancement8, Enhancement9, Enhancement10, Enhancement11, Enhancement12,' +
' Enhancement13, Enhancement14, userName, c.maxLevel as LBMaxLevel, a.LBLevel, a.LBExp, a.exRank, a.nva, a.nvRarity, a.totalExp, a.currentLevelExp'+
' from ? as a'+
' left join ? as b on a.id=b.id'+
' left join ? as c on c.limitBurstId=a.id',[flattenedOwned,masterStaticUnits,masterLimitBursts]));
console.log('how big is items',items.length);
 sortedItems=JSON.stringify(_.sortBy(items,['unitId','id']), null,2);
 console.log('how big is sortedItems',sortedItems.length);
}//close out the if statement for flattenedOwned being prsent
else { items=flattenedOwned;
 sortedItems=items;}
if(writeToSql=="true"){
var connection = new sql.ConnectionPool(dbConfig, function(err)
{
	//... error checks, meaning what? print the err?
	if(err!=null){console.log("a connection error might end up here",err);}
	if(sortedItems[0].id!=-9){
	var request = new sql.Request(connection);
	request.input('json', sql.NVarChar(sql.MAX),sortedItems);
	request.input('userName',sql.NVarChar(64),username);
	request.execute('dbo.updtOwnedUnits', function (err,result)
	{
		if(err!=null){console.log("error from execute",err);}
		if(result!=null){console.log("result is not falsey",result);}
		else if(result){
		console.log(result);
		if(result.recordsets.lenght==null){console.log(result.recordsets.length,"count of recordsets returned by procedure");} // count of recordsets returned by the procedure
    console.log(result.recordsets[0].length); // count of rows contained in first recordset
		if(result.recordset!=null){console.log(result.recordset,"first recordset from result.recordsets");} // first recordset from result.recordsets
		if(result.returnValue!=null){console.log(result.returnValue,"Procedure return value");} // procedure return value
		if(result.output!=null){console.log(result.output,"key value collection of output values");} // key/value collection of output values
		if(result.rowsAffected!=null){console.log(result.rowsAffected,"Array of numbers, each number represents the number of rows affected by executed statements");} // array of numbers, each number represents the number of rows affected by executed statemens
	}
	});//close out the stored procedure request
}

if(namedInventory[0].itemId!="-9"){
	var request2 = new sql.Request(connection);
	request2.input('json', sql.NVarChar(sql.MAX),JSON.stringify(namedInventory));
	request2.input('userName',sql.NVarChar(64),username);
	request2.execute('dbo.updtOwnedInventory', function (err,result)
	{
		//if(err!=null){console.log("error from execute",err);}
		//if(result!=null){console.log("result is not falsey",result);}
		//else if(result){
		//console.log(result);
		//if(result.recordsets.lenght==null){console.log(result.recordsets.length,"count of recordsets returned by procedure");} // count of recordsets returned by the procedure
    //console.log(result.recordsets[0].length) // count of rows contained in first recordset
		//if(result.recordset!=null){console.log(result.recordset,"first recordset from result.recordsets");} // first recordset from result.recordsets
		//if(result.returnValue!=null){console.log(result.returnValue,"Procedure return value");} // procedure return value
		//if(result.output!=null){console.log(result.output,"key value collection of output values");} // key/value collection of output values
		//if(result.rowsAffected!=null){console.log(result.rowsAffected,"Array of numbers, each number represents the number of rows affected by executed statements");} // array of numbers, each number represents the number of rows affected by executed statemens
	//}
	});//close out the stored procedure request
}
if(namedConsumables[0].itemId!="-9"){
	var request3 = new sql.Request(connection);
	request3.input('json', sql.NVarChar(sql.MAX),JSON.stringify(namedConsumables));
	request3.input('userName',sql.NVarChar(64),username);
	request3.execute('dbo.updtOwnedConsumables', function (err,result)
	{
	});//close out the stored procedure request
}
});//close out the connection I guess
}
if(!pots[0].UnitName){outsideCSVpots=[]; outsideJSONpots=[];}
else {outsideCSVpots=ns.ConvertPotsToCSV(_.sortBy(pots,['Stat','effect']));outsideJSONpots=pots;}
if(!cactuars[0].UnitName){outsideCSVcactuars=[]; outsideJSONcactuars=[];}
else {outsideCSVcactuars=ns.ConvertCactuarsToCSV(cactuars);outsideJSONcactuars=cactuars;}
if(!moogles[0].UnitName){outsideCSVmoogles=[];outsideJSONmoogles=[];}
else {outsideCSVmoogles=ns.ConvertMooglesToCSV(moogles);outsideJSONmoogles=moogles;}
if(sortedItems[0].id==-9){outsideCSVUnits=[];outsideJSONUnits=[];}
else {outsideCSVUnits=ns.ConvertToCSV(items);outsideJSONUnits=sortedItems;}
if(namedInventory[0].itemId==-9){outsideCSVinventory=[]; outsideJSONinventory=[]; outsideDownloadJSONinventory=[];}
else {outsideCSVinventory=ns.ConvertInventoryToCSV(namedInventory);outsideDownloadJSONinventory=JSON.stringify(_.sortBy(namedInventory,['InventoryType','rarity','Name']), null,2);outsideJSONinventory=namedInventory;}
if(namedConsumables[0].itemId==-9){outsideCSVconsumables=[]; outsideJSONconsumables=[];}
else {outsideCSVconsumables=ns.ConvertConsumablesToCSV(namedConsumables);outsideJSONconsumables=namedConsumables;}
outsideUserName=username;
res.redirect("upload_grid");
}//close out the else for the file value being null
}//close out the try started just after the POST
catch(err)
{res.status(500).send(err);}
});//end of post for upload_grid
app.get("/upload_grid",function(req,res){
	res.render("upload_grid",{potsCSV:outsideCSVpots,potsJSON:outsideJSONpots,cactuarsCSV:outsideCSVcactuars,cactuarsJSON:outsideJSONcactuars,mooglesCSV:outsideCSVmoogles,mooglesJSON:outsideJSONmoogles,unitsCSV:outsideCSVUnits,unitsJSON:outsideJSONUnits,inventoryCSV:outsideCSVinventory,inventoryJSON:outsideJSONinventory,inventoryDownloadJSON:outsideDownloadJSONinventory,consumablesCSV:outsideCSVconsumables,consumablesJSON:outsideJSONconsumables,userName:outsideUserName});
});
app.get('/tabulator.min.css',function(req,res){res.sendFile(path.join(__dirname + '/node_modules/tabulator-tables/dist/css/tabulator.min.css'));});
app.get('/tabulator.min.js',function(req,res){res.sendFile(path.join(__dirname + '/node_modules/tabulator-tables/dist/js/tabulator.min.js'));});

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  next(createError(404));
});
*/
// error handler
/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
//module.exports = app;

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'dev';
console.log("PORT all upper case equals",PORT, "while the environment is ",NODE_ENV);
app.listen(PORT,console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`));
