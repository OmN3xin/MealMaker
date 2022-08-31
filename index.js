const { query } = require('express')
const express = require('express')
const app = express()
var fs = require('fs')
app.set('view engine', 'ejs')
app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/join', (req, res)=>{
    res.render('joinFamily')
})
app.get('/create', (req, res)=>{
    res.render('createFamily',{code:newCode()})
})
app.get('/newfamily',(req, res)=>{
    createFamily(req.query.code,req.query.name) 
    res.redirect('/family?code='+req.query.code)
})
app.get('/join',(req,res)=>{

})
app.get('/family',(req,res)=>{
    res.render('family.ejs',{code:req.query.code,
        name:getJson(req.query.code).name})
})
app.get('/day',(req,res)=>{
    let json = getJson(req.query.code)
    let jsonDay = getDay(req.query.day,json);
    res.render('day.ejs',{breakfast:jsonDay[0].breakfast,lunch:jsonDay[1].lunch,dinner:jsonDay[2].dinner,code:req.query.code,name:json.name,day:req.query.day})
})
app.get('/save',(req,res)=>{
    let code = req.query.code
    let json = getJson(code)
    let jsonDay = getDay(req.query.day,json)
    jsonDay[0].breakfast = req.query.breakfast
    jsonDay[1].lunch = req.query.lunch
    jsonDay[2].dinner = req.query.dinner
    fs.writeFile(getFamilyPath(req.query.code),JSON.stringify(json),function(){})
    res.redirect('/family?code='+req.query.code)
})
function getFamilyPath(code){
    return 'Families/'+code+'.json'
}
function getJson(code){
    let bufferdata = fs.readFileSync(getFamilyPath(code))
    let str = bufferdata.toString()
    return JSON.parse(str)
}
function newCode(){
    let r = (Math.random() + 1).toString(36).substring(7)
    return r
}
function getDay(day,json){
    jsonday = json.sunday
    let jsonDay = json.sunday
    if(day == 'sunday') jsonday = json.sunday
    if(day == 'monday') jsonday = json.monday
    if(day == 'tuesday') jsonday = json.tuesday
    if(day == 'wednesday') jsonday = json.wednesday
    if(day == 'thursday') jsonday = json.thursday
    if(day == 'friday') jsonday = json.friday
    if(day == 'saturday') jsonday = json.saturday
    return jsonDay
}
function defaultJson(name){
    let meal = [{'breakfast':''},{'lunch':''},{'dinner':''}]
    let json = {
        'name':name,
        'sunday':meal,
        'monday':meal,
        'tuesday':meal,
        'wednesday':meal,
        'thursday':meal,
        'friday':meal,
        'saturday':meal
        }
    return json
}
function createFamily(code,name){
    fs.open('Families/'+(code+'.json'),'w',function(err, file){
        if(err) throw err
    })
    fs.appendFile('Families/'+(code+'.json'),JSON.stringify(defaultJson(name)),function(err, file){
        if(err) throw err
    })
}
app.listen(3000,{})