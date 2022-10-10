const express = require('express')
const app = express()
var fs = require('fs')
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
	res.render('index')
})
app.get('/admin', (req,res)=>{
	let json = getJson(req.query.code)
	if(json.admincode == req.query.admincode){
		res.render('admin',{admincode: req.query.admincode,code:req.query.code});
	}else{
		res.render('adminDecline',{code:req.query.code})
	}
})
app.get('/join', (req, res) => {
	res.render('joinFamily')
})
app.get('/create', (req, res) => {
	res.render('createFamily', { code: newCode() })
})
app.get('/settings',(req,res)=>{
	res.render('settings', {code:req.query.code});
})
app.get('/newfamily', (req, res) => {
	createFamily(req.query.code, req.query.name,req.query.admincode)
	res.redirect('/family?code=' + req.query.code)
})
app.get('/reset', (req, res) =>{
	res.render('reset');
})
app.get('/family', (req, res) => {
	try{
	getJson(req.query.code);
	}catch(e){
	res.redirect('reset');
		return
	}
	let admin = false;
	var json = getJson(req.query.code);
	if(req.query.admincode == json.admincode) admin = true;
	res.render('family', {
		code: req.query.code,
		name:json.name,
		admin:admin,
		sunday:json.sunday,
		monday:json.monday,
		tuesday:json.tuesday,
		wednesday:json.wednesday,
		thursday:json.thursday,
		friday:json.friday,
		saturday:json.saturday
	})
})
app.get('/load',(req,res)=>{
	res.redirect('/family?code='+req.query.code)
})
app.get('/save', (req, res) => {
	let code = req.query.code
	let json = getJson(code)
	//fix
	json.sunday = req.query.sunday;
	json.monday = req.query.monday;
	json.tuesday = req.query.tuesday;
	json.wednesday = req.query.wednesday;
	json.thursday = req.query.thursday;
	json.friday = req.query.friday;
	json.saturday = req.query.saturday;
	fs.writeFile(getFamilyPath(req.query.code), JSON.stringify(json), function() { })
	res.redirect('/family?code=' + req.query.code)
})
function getFamilyPath(code) {
	return 'Families/' + code + '.json'
}
function getJson(code) {
	let bufferdata = fs.readFileSync(getFamilyPath(code))
	let str = bufferdata.toString()
	return JSON.parse(str)
}
function newCode() {
	let r = (Math.random() + 1).toString(36).substring(7)
	return r
}
function getDay(day, json) {
	let jsonDay;
	if (day == 'sunday') { jsonDay = json.sunday };
	if (day == 'monday') { jsonDay = json.monday };
	if (day == 'tuesday') { jsonDay = json.tuesday };
	if (day == 'wednesday') { jsonDay = json.wednesday };
	if (day == 'thursday') { jsonDay = json.thursday };
	if (day == 'friday') { jsonDay = json.friday };
	if (day == 'saturday') { jsonDay = json.saturday };
	return jsonDay
}
function defaultJson(name,admincode) {
	let json = {
		'name': name,
		'admincode': admincode,
		'sunday': '',
		'monday': '',
		'tuesday': '',
		'wednesday': '',
		'thursday': '',
		'friday': '',
		'saturday': '',
		'options':[]
	}
	return json
}
function createFamily(code, name, admincode) {
	fs.open('Families/' + (code + '.json'), 'w', function(err, file) {
		if (err) throw err
	})
	fs.appendFile('Families/' + (code + '.json'), JSON.stringify(defaultJson(name,admincode)), function(err, file) {
		if (err) throw err
	})
}
app.listen(3000, {})