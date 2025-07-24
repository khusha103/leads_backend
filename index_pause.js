const { OpenAI } = require('openai');
const express = require('express');
const multer = require('multer');
const https = require('https');
const http = require('http');
const path = require('path')
const fs = require('fs')
var cors = require('cors');
var bodyparser = require('body-parser');
const PORT = process.env.PORT || 4444 ;
const app = express();

const axios = require('axios');

const openai = new OpenAI({
  apiKey: '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', // Replace with your OpenAI API key
});

const mysql = require('mysql');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cors());
app.use('/video', express.static(path.join(__dirname, 'uploads')));


app.use(function(req, res, next) {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ekreps_ekarigar_project',
    password: '2a41bl13c9',
    database: 'ekreps_ekarigar_project'
  });
  connection.connect((err)=> {
    if(!err)
    {
        console.log("connected");
        
    }
    else{
        console.log("error" + json.stringify(err, undefined,2));
    }
  });




app.all('/form',function(req, res){
// res.sendFile(__dirname+"/form.html");
res.setHeader('Content-Type', 'text/plain');
res.setHeader('Access-Control-Allow-Origin', '*'); //config.allowedDomains
res.setHeader('Access-Control-Allow-Credentials', true);
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Requested-By');
res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
connection.query('select * from products',(err, rows, fields)=>{
  if (!err) 

  res.send(rows);
  else{
    console.log(err);
  }
});
});


app.all('/get_variety_asc',function(req, res){
connection.query('select * from products ORDER BY `products`.`variety` ASC',(err, rows, fields)=>{
  if (!err) 

  res.send(rows);
  else{
    console.log(err);
  }
});
});

app.all('/get_lead_id_data/:id',function(req, res){
    var id = req.params.id;
connection.query('select * from leads where id=?',id,(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});
app.all('/get_old_lead_id_data/:id',function(req, res){
    var id = req.params.id;
connection.query('select * from old_data where id=?',id,(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});

app.all('/get_shopify_id_data/:id',function(req, res){
    var id = req.params.id;
connection.query('select * from shopify_data where id=?',id,(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});

app.post('/addproduct',function(req, res){
// res.sendFile(__dirname+"/form.html");

 var formData = {
    first_name: req.body.product,
    last_name: req.body.variety,
	 price: req.body.price,
    gender: req.body.sale
  };

connection.query(`INSERT INTO products ( product_kind, variety, price, main_month_of_sale) VALUES ("${formData.first_name}", "${formData.last_name}","${formData.price}", "${formData.gender}")`,(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.post('/adduser',function(req, res){
// res.sendFile(__dirname+"/form.html");

 var formData = {
    username: req.body.username,
    password: req.body.password,
  };

connection.query(`INSERT INTO users ( username, password) VALUES ("${formData.username}", "${formData.password}")`,(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.delete('/delete_product/:id',function(req, res){
var id = req.params.id;
connection.query('delete from products where id=?',id,(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.delete('/delete_user/:id',function(req, res){
var id = req.params.id;
connection.query('delete from users where id=?',id,(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.delete('/delete_lead/:id',function(req, res){
var id = req.params.id;
connection.query('delete from leads where id=?',id,(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.put('/update_product/:id',function(req, res){
var id = req.params.id;
var product_kind=req.body.product_kind;
var variety=req.body.variety;
var price=req.body.price;
var main_month_of_sale =req.body.main_month_of_sale;
// var months =main_month_of_sale.join(', ');
if (Array.isArray(main_month_of_sale)) {
var months =main_month_of_sale.join(', ');
}
else
{
var months =req.body.main_month_of_sale;
}
connection.query('update products set product_kind=?,variety=?,price=?,main_month_of_sale=? where id=?',[product_kind,variety,price,months,id],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.put('/update_user/:id',function(req, res){
var id = req.params.id;
var username=req.body.username;
var password=req.body.password;
connection.query('update users set username=?,password=? where id=?',[username,password,id],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});
let date_ob = new Date();
date_ob=date_ob.toISOString().slice(0,10);
app.get('/get_date_data/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select * from leads WHERE date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data_india_mart/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="India Mart" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_india_mart/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="India Mart" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});








app.get('/get_source_data_Facebook/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="Facebook" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_facebook/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="Facebook" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});


app.get('/get_source_data_Whatsapp/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="Whatsapp" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_Whatsapp/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="Whatsapp" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});










app.get('/get_source_data_Google/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="Google" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_google/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="Google" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data_Trade_India/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="Trade India" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_Trade_India/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="Trade_India" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data_Amazon/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="Amazon" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data_Flipkart/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="Flipkart" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data_Website/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="Website" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});


app.get('/get_source_data_shopify/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select * from shopify_data WHERE remark="Interested" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_notinterested_data_shopify/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select * from shopify_data WHERE remark="Does Not Want" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});
app.get('/get_noanswer_data_shopify/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select * from shopify_data WHERE remark="No Answer" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_Website/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="Website" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data_InBond/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="InBond" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_InBond/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="InBond" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_data_OutBond/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select source from leads WHERE remark="Interested" AND source="OutBond" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_source_amount_data_OutBond/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND source="OutBond" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_data/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_old_data/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from old_data WHERE status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_shopify_data/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from shopify_data WHERE status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_ranjna/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND username="sudipto" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_shopify_data_ranjna/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from shopify_data WHERE username="sudipto"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});


app.get('/get_amount_rupali/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND username="gaurav" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_old_data_rupali/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from old_data WHERE username="gaurav"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_shopify_data_rupali/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from shopify_data WHERE username="gaurav"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_heena/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND username="gsi.gaurav@gmail.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_priyanka/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND username="telecaller4@ekarigar.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});
app.get('/get_amount_aradhana/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from leads WHERE status="Completed" AND username="telecaller5@ekarigar.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_old_data_heena/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from old_data WHERE username="gsi.gaurav@gmail.com"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_old_data_aradhana/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from old_data WHERE username="telecaller5@ekarigar.com"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_old_data_priyanka/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from old_data WHERE username="telecaller4@ekarigar.com"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_amount_shopify_data_heena/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from shopify_data WHERE username="gsi.gaurav@gmail.com"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});
app.get('/get_amount_shopify_data_aradhana/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from shopify_data WHERE username="telecaller5@ekarigar.com"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});
app.get('/get_amount_shopify_data_priyanka/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select SUM(report) from shopify_data WHERE username="telecaller4@ekarigar.com"  AND  status="Completed" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows[0]);
  }
  
  else{
    console.log(err);
  }
});
});

app.get('/get_date_data_user/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var username=date.slice(20);
if(end_ == ""){
   end_date= date_ob;

}
else{
    var end_date=end_.slice(0 ,10);
}
connection.query('select * from leads WHERE username=? AND date BETWEEN ? AND  ?', [username,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAllDataDate/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from leads WHERE date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAllOldData/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from old_data WHERE date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAllShopifydata/',function(req, res){

connection.query('select * from shopify_data ',(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});











app.get('/getranjnaShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="sudipto" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getranjnainterestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="sudipto" AND remark="Interested" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getranjna_not_interestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="sudipto" AND remark="Does Not Want" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getranjnanoanswerShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="sudipto" AND remark="No Answer" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});









app.get('/getAradhanaShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller5@ekarigar.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAradhanainterestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller5@ekarigar.com" AND remark="Interested" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAradhana_not_interestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller5@ekarigar.com" AND remark="Does Not Want" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAradhananoanswerShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller5@ekarigar.com" AND remark="No Answer" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});





app.get('/getPriyankaShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller4@ekarigar.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getPriyankainterestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller4@ekarigar.com" AND remark="Interested" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getPriyanka_not_interestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller4@ekarigar.com" AND remark="Does Not Want" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getPriyankanoanswerShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="telecaller4@ekarigar.com" AND remark="No Answer" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});











app.get('/getrupaliShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gaurav" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getrupaliinterestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gaurav" AND remark="Interested" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getrupali_not_interestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gaurav" AND remark="Does Not Want" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getrupalinoanswerShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gaurav" AND remark="No Answer" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});


app.get('/getheenaShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gsi.gaurav@gmail.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getheenainterestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gsi.gaurav@gmail.com" AND remark="Interested" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getheena_not_interestedShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gsi.gaurav@gmail.com" AND remark="Does Not Want" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getheenanoanswerShopifydata/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from shopify_data WHERE username="gsi.gaurav@gmail.com" AND remark="No Answer" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});




app.get('/getAllOldData_rupali/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from old_data WHERE username="gaurav" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAllOldData_heena/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from old_data WHERE username="gsi.gaurav@gmail.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAllOldData_aradhana/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from old_data WHERE username="telecaller5@ekarigar.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/getAllOldData_priyanka/:date',function(req, res){
var date = req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
var end_date=end_.slice(0 ,10);
connection.query('select * from old_data WHERE username="telecaller4@ekarigar.com" AND date BETWEEN ? AND  ?', [start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.all('/get_data_user/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
//   console.log(end_date);
}
else{
    var end_date=end_.slice(0 ,10);
    //  console.log(end_date);
}
var username="gaurav";
connection.query(`select * from leads WHERE username=? AND date BETWEEN ? AND ?`, [username,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.all('/get_data_user_ranjna/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="sudipto";
connection.query(`select * from leads WHERE username=? AND date BETWEEN ? AND ?`, [username,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});












app.all('/get_data_user_heena/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
connection.query(`select * from leads WHERE username=? AND date BETWEEN ? AND ?`, [username,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_heena_Interested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
var remark="Interested";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_heena_Interested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
var remark="Interested";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_heena_Interested_shopify_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
var remark="Interested";
connection.query(`select * from shopify_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});








app.all('/get_data_user_priyanka/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
connection.query(`select * from leads WHERE username=? AND date BETWEEN ? AND ?`, [username,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_priyanka_Interested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
var remark="Interested";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_priyanka_Interested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
var remark="Interested";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_priyanka_Interested_shopify_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
var remark="Interested";
connection.query(`select * from shopify_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});






app.all('/get_data_user_aradhana/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
connection.query(`select * from leads WHERE username=? AND date BETWEEN ? AND ?`, [username,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_aradhana_Interested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
var remark="Interested";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_aradhana_Interested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
var remark="Interested";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_aradhana_Interested_shopify_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
var remark="Interested";
connection.query(`select * from shopify_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});















app.get('/get_data_user_ranjna_Interested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
// console.log(start_date);
var end_=date.slice(10);
// console.log(end_date);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="sudipto";
var remark="Interested";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_rupali_Interested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gaurav";
var remark="Interested";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_rupali_Interested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gaurav";
var remark="Interested";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_rupali_notInterested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gaurav";
var remark="Does Not Want";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_rupali_notInterested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gaurav";
var remark="Does Not Want";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_ranjna_notInterested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="sudipto";
var remark="Does Not Want";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_heena_notInterested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
var remark="Does Not Want";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_heena_notInterested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
var remark="Does Not Want";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});


app.get('/get_data_user_priyanka_notInterested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
var remark="Does Not Want";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_priyanka_notInterested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
var remark="Does Not Want";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_aradhana_notInterested/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
var remark="Does Not Want";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_aradhana_notInterested_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
var remark="Does Not Want";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});






app.get('/get_data_user_rupali_noAnswer/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gaurav";
var remark="No Answer";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_rupali_noAnswer_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gaurav";
var remark="No Answer";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_ranjna_noAnswer/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="sudipto";
var remark="No Answer";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_heena_noAnswer/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
var remark="No Answer";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_priyanka_noAnswer/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
var remark="No Answer";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_aradhana_noAnswer/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
var remark="No Answer";
connection.query(`select * from leads WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_heena_noAnswer_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="gsi.gaurav@gmail.com";
var remark="No Answer";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_priyanka_noAnswer_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller4@ekarigar.com";
var remark="No Answer";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/get_data_user_aradhana_noAnswer_old_data/:date',function(req, res){
var date= req.params.date;
var start_date=date.slice(0 ,10);
var end_=date.slice(10);
if(end_ == ""){
   end_date= date_ob;
}
else{
    var end_date=end_.slice(0 ,10);
}
var username="telecaller5@ekarigar.com";
var remark="No Answer";
connection.query(`select * from old_data WHERE username=? AND remark=? AND date BETWEEN ? AND ?`, [username,remark,start_date, end_date],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.put('/update_lead/:id',function(req, res){
var id = req.params.id;
var name=req.body.name;
var telephone=req.body.telephone.split(" ").join("")
// var telephone=req.body.telephone;
var city=req.body.city;
var state =req.body.state;
var quantity =req.body.quantity;
var date =req.body.date;
var source =req.body.source;
var product =req.body.variety;
if (Array.isArray(product)) {
var variety =product.join(', ');
}
else
{
    var variety =req.body.variety;
}
// var variety =product.join(', ');
var remark =req.body.remark;
var f1 =req.body.f1;
var f2 =req.body.f2;
var f3 =req.body.f3;
var status =req.body.status;
var report =req.body.report;
connection.query('update leads set name=?,telephone=?,city=?,state=? ,quantity=? ,date=? ,source=? ,variety=?,remark=?,f1=?,f2=?,f3=?,status=?,report=? where id=?',[name, telephone, city, state,quantity,date,source,variety,remark,f1,f2,f3,status,report,id],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});


app.put('/update_shopify_lead/:id',function(req, res){
var id = req.params.id;
var name=req.body.name;
var phone_no=req.body.phone_no.split(" ").join("");
// var telephone=req.body.telephone;
var city=req.body.city;
var state =req.body.state;
var quantity =req.body.quantity;
var date =req.body.date;
var product =req.body.variety;
if (Array.isArray(product)) {
var variety =product.join(', ');
}
else
{
    var variety =req.body.variety;
}
// var variety =product.join(', ');
var remark =req.body.remark;
var f1 =req.body.f1;
var f2 =req.body.f2;
var method =req.body.method;
var status =req.body.status;
var report =req.body.report;
var username =req.body.username;
connection.query('update shopify_data set name=?,phone_no=?,city=?,state=? ,quantity=? ,date=?,variety=?,remark=?,f1=?,f2=?,method=?,status=?,report=?,username=? where id=?',[name, phone_no, city, state,quantity,date,variety,remark,f1,f2,method,status,report,username,id],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.put('/update_old_lead/:id',function(req, res){
var id = req.params.id;
var quantity =req.body.quantity;
var date =req.body.date;
// var source =req.body.source;
var product =req.body.variety;
if (Array.isArray(product)) {
var variety =product.join(', ');
}
else
{
    var variety =req.body.variety;
}
// var variety =product.join(', ');
var remark =req.body.remark;
var f1 =req.body.f1;
var f2 =req.body.f2;
var f3 =req.body.f3;
var status =req.body.status;
var report =req.body.report;
var username =req.body.username;
connection.query('update old_data set quantity=? ,date=? ,variety=?,remark=?,f1=?,f2=?,f3=?,status=?,report=?,username=? where id=?',[quantity,date,variety,remark,f1,f2,f3,status,report,username,id],(err, rows, fields)=>{
  if (!err) 
  {
 // res.redirect('/form');
  res.send(rows);
//   console.log(rows);
  }
  else{
    console.log(err);
  }
});
});

app.post('/addlead',function(req, res){
// res.sendFile(__dirname+"/form.html");
var telephone=req.body.telephone.split(" ").join("")
 var formData = {
    name: req.body.name,
    telephone: telephone,
	city: req.body.city,
    state: req.body.state,
    quantity: req.body.quantity,
    date: req.body.date,
    source: req.body.source,
    variety: req.body.variety,
    remark: req.body.remark,
    username: req.body.username,
    f1: req.body.f1,
    f2: req.body.f2,
    f3: req.body.f3,
    status: req.body.status,
    report: req.body.report,
    
  };

connection.query(`INSERT INTO leads ( name, telephone, city, state,quantity,date,source,variety,remark,username,f1,f2,f3,status,report) VALUES ("${formData.name}", "${formData.telephone}","${formData.city}", "${formData.state}", "${formData.quantity}", "${formData.date}", "${formData.source}", "${formData.variety}", "${formData.remark}","${formData.username}","${formData.f1}","${formData.f2}","${formData.f3}","${formData.status}","${formData.report}")`,(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.post('/get_data',function(req, res){
 var formData = {
    state: req.body.state,
    variety: req.body.variety,
    
  };

connection.query('select * from leads where state=? AND  FIND_IN_SET (?,variety)  AND  remark="Interested"', [req.body.state, req.body.variety],(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.get('/All_data_for_msg',function(req, res){

connection.query('select * from leads where  remark="Interested"',(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});



app.post('/select_state_for_msg',function(req, res){

connection.query('select * from leads where state=? AND  remark="Interested"',req.body.state,(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.post('/select_variety_for_msg',function(req, res){

connection.query('select * from leads where variety=? AND  remark="Interested"',req.body.variety,(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});


app.post('/add_google_leads_status',function(req, res){


 var formData = {
    name: req.body.name,
    requirement: "on",
  };

connection.query(`INSERT INTO google_leads ( name, requirement) VALUES ("${formData.name}", "${formData.requirement}")`,(err, rows, fields)=>{
  if (!err) 
  {
  res.send(rows);
  }
  else{
    console.log(err);
  }
});
});

app.all('/getgoogleleads',function(req, res){
// res.sendFile(__dirname+"/form.html");
connection.query('select name,requirement from google_leads  ',(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});

const sslServer = https.createServer(
  {
  key: fs.readFileSync(path.join(__dirname,'certificate','key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'certificate','cert.pem'))
  },
  app
);

app.all('/getleads/:username',function(req, res){
// res.sendFile(__dirname+"/form.html");
var username = req.params.username;
connection.query('select * from leads where username=? ',username,(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});

app.all('/getAllLeads',function(req, res){
// res.sendFile(__dirname+"/form.html");
connection.query('select * from leads ',(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});

app.all('/get_not_intersted_Old_Data/:month',function(req, res){
var month = req.params.month;
var username = "admin";
connection.query('select * from old_data where main_month_of_sale=? And remark="Does Not Want" ',month,(err, rows, fields)=>{
  if (!err) 
{
    // console.log(rows.length);
    starting_data=Math.floor(rows.length / 3);
   filter_ranjna= rows.slice(0, starting_data+1);
   second= rows.slice(starting_data);
   filter_rupali= second.slice(0, starting_data+1);
   third= rows.slice(starting_data*2);
   filter_heena= third.slice(0, starting_data+1);
   if(username == "admin")
   {
     res.send(rows);
   }
  else{
    console.log(err);
  }
  
}
  else{
    console.log(err);
  }
});
});


app.all('/getCompleted_Old_Data/:month',function(req, res){
var month = req.params.month;
var username = "admin";
connection.query('select * from old_data where main_month_of_sale=? And status="Completed" ',month,(err, rows, fields)=>{
  if (!err) 
{
    // console.log(rows.length);
    starting_data=Math.floor(rows.length / 3);
   filter_ranjna= rows.slice(0, starting_data+1);
   second= rows.slice(starting_data);
   filter_rupali= second.slice(0, starting_data+1);
   third= rows.slice(starting_data*2);
   filter_heena= third.slice(0, starting_data+1);
   if(username == "admin")
   {
     res.send(rows);
   }
  else{
    console.log(err);
  }
  
}
  else{
    console.log(err);
  }
});
});

app.all('/getOld_Data/:month',function(req, res){
var month = req.params.month;
var username = "admin";
connection.query('select * from old_data where main_month_of_sale=? And remark IN ("Interested","No Answer"," ")  ',month,(err, rows, fields)=>{
  if (!err) 
{
    // console.log(rows.length);
    starting_data=Math.floor(rows.length / 3);
   filter_ranjna= rows.slice(0, starting_data+1);
   second= rows.slice(starting_data);
   filter_rupali= second.slice(0, starting_data+1);
   third= rows.slice(starting_data*2);
   filter_heena= third.slice(0, starting_data+1);
   if(username == "admin")
   {
     res.send(rows);
   }
  else if(username == "sudipto")
       {
        res.send(filter_ranjna);
       }
  else if(username == "gaurav")
       {
        res.send(filter_rupali);
       }
  else if(username == "gsi.gaurav@gmail.com")
       {
        res.send(filter_heena);
       }
  else{
    console.log(err);
  }
  
}
  else{
    console.log(err);
  }
});
});

app.all('/getOld_Data_ranjna/:month',function(req, res){
var month = req.params.month;
var username = "sudipto";
connection.query('select * from old_data where main_month_of_sale=? ',month,(err, rows, fields)=>{
  if (!err) 
{
//     starting_data=Math.floor(rows.length / 3);
//   filter_ranjna= rows.slice(0, starting_data+1);

//     res.send(filter_ranjna);


  
}
  else{
    console.log(err);
  }
});
});

app.all('/getOld_Data_rupali/:month',function(req, res){
var month = req.params.month;
var username = "gaurav";
connection.query('select * from old_data where main_month_of_sale=? ',month,(err, rows, fields)=>{
  if (!err) 
{
    starting_data=Math.floor(rows.length / 4);
   filter_rupali= rows.slice(0, starting_data);
    res.send(filter_rupali);
  
}
  else{
    console.log(err);
  }
});
});

app.all('/getOld_Data_heena/:month',function(req, res){
var month = req.params.month;
var username = "gsi.gaurav@gmail.com";
connection.query('select * from old_data where main_month_of_sale=? ',month,(err, rows, fields)=>{
  if (!err) 
{
    starting_data=Math.floor(rows.length / 4);
   filter_heena= rows.slice(starting_data, starting_data*2);
//   second= rows.slice(starting_data);
//   filter_heena= second.slice(0, starting_data+1);
   
    res.send(filter_heena);

}
  else{
    console.log(err);
  }
});
});

app.all('/getOld_Data_priyanka/:month',function(req, res){
var month = req.params.month;
var username = "telecaller4@ekarigar.com";
connection.query('select * from old_data where main_month_of_sale=? ',month,(err, rows, fields)=>{
  if (!err) 
{
    starting_data=Math.floor(rows.length / 4);
   filter_priyanka= rows.slice(starting_data*2, starting_data*3);
    res.send(filter_priyanka);

}
  else{
    console.log(err);
  }
});
});

app.all('/getOld_Data_aradhana/:month',function(req, res){
var month = req.params.month;
var username = "telecaller5@ekarigar.com";
connection.query('select * from old_data where main_month_of_sale=? ',month,(err, rows, fields)=>{
  if (!err) 
{
    starting_data=Math.floor(rows.length / 4);
   filter_aradhana= rows.slice(starting_data*3, starting_data*4+2);
    res.send(filter_aradhana);

}
  else{
    console.log(err);
  }
});
});


app.get('/login',function(req, res){
// res.sendFile(__dirname+"/form.html");
connection.query('select * from login_admin ',(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});


app.get('/getusers',function(req, res){
// res.sendFile(__dirname+"/form.html");
connection.query('select * from users ',(err, rows, fields)=>{
  if (!err) 
{
  res.send(rows);
}
  else{
    console.log(err);
  }
});
});




app.get('/live_recording',function(req, res){
res.sendFile(__dirname+"/form.html")
});

app.get('/video',function(req, res){
res.sendFile(__dirname+"/full.html")
});




// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original filename
  }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload', upload.single('videoFile'), (req, res) => {
  res.send('File uploaded successfully');
});

const uploads = multer({ dest: 'uploads/' });




app.post('/api/conciseness', async (req, res) => {
  const originalContent = req.body.content;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Concise the following paragraph:\n\n${originalContent}` },
      ],
      max_tokens: 150,
      temperature: 0.5,
    });

    const concisedContent = response.choices[0].message.content.trim();

    res.json({ concised: concisedContent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});




const TAP_SECRET_KEY = 'sk_test_ParN2MZDGgdbkqLcmIuznVTH'; // Replace with your Tap secret key

// Endpoint to create a payment request
app.post('/create-payment', async (req, res) => {
    const { amount, currency, customer } = req.body;

const paymentData = {
    amount: amount, // For example, $10 or 1000 cents (check API documentation)
    currency: currency,
    customer: {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: {
            country_code: "965",
            number: "12345678"
        },
        threeDSecure: true,
        save_card: false,
        description: "Payment description"
    },
    source: {
        id: "src_all" // This needs to be a valid payment method ID from your system (replace with correct ID)
    },
    redirect: {
        url: "getglowcustomer://tabs/tab1"
    }
};


    try {
        const response = await axios.post(
            'https://api.tap.company/v2/charges',paymentData,
            // {
            //     amount,
            //     currency,
            //     threeDSecure: true,
            //     save_card: false,
            //     description: 'Payment description',
            //     customer,
            //     source: {
            //         id: 'src_all',
            //     },
            //     redirect: {
            //         url: 'http://localhost:8100/payment-page', // Frontend success page
            //     },
            // },
// {
//     "amount": 1000,
//     "currency": "USD",
//     "customer": {
//         "first_name": "John",
//         "last_name": "Doe",
//         "email": "john.doe@example.com",
//         "phone": {
//             "country_code": "965",
//             "number": "12345678"
//         },
//         "threeDSecure": true,
//         "save_card": false,
//         "description": "Payment description"
//     },
//     "source": {
//         "id": "src_all"
//     },
//     "redirect": {
//         "url": "http://localhost:8100/payment-page"
//     }
// },            
            
            {
                headers: {
                    Authorization: `Bearer ${TAP_SECRET_KEY}`,
                },
            }
        );

        res.status(200).send(response.data);
    } catch (error) {
        console.error(error.response.data);
        res.status(500).send({ error: error.response.data });
    }
});

















// Function to extract audio from video
// function extractAudio(videoPath, outputPath) {
//     return new Promise((resolve, reject) => {
//         ffmpeg(videoPath)
//             .output(outputPath)
//             .on('end', () => resolve(outputPath))
//             .on('error', (err) => reject(err))
//             .run();
//     });
// }

// Function to transcribe audio to text using Google Cloud Speech-to-Text
// async function transcribeAudio(audioPath) {
//     const client = new speechToText.SpeechClient();
//     const audio = {
//         content: fs.readFileSync(audioPath).toString('base64'),
//     };
//     const config = {
//         encoding: 'LINEAR16',
//         sampleRateHertz: 16000,
//         languageCode: 'en-US',
//     };
//     const request = {
//         audio: audio,
//         config: config,
//     };
//     const [response] = await client.recognize(request);
//     const transcription = response.results
//         .map((result) => result.alternatives[0].transcript)
//         .join('\n');
//     return transcription;
// }

// Function to analyze text and return results
// function analyzeText(transcription) {
//     // Placeholder implementation for analysis
//     const fillerWords = ['like', 'um', 'uh', 'you know']; // Replace with your logic
//     const weakWords = ['maybe', 'probably', 'just']; // Replace with your logic
//     const smilingPercentage = 75; // Placeholder value
//     const wpm = 120; // Placeholder value
//     return { fillerWords, weakWords, smilingPercentage, wpm };
// }

// Route for file upload and analysis
app.post('/upload_video', uploads.single('videoFile'), async (req, res) => {
    try {
        const videoPath = req.file.path;
        const audioPath = `${videoPath}.wav`;

        // Extract audio from video
        await extractAudio(videoPath, audioPath);

        // Transcribe audio to text
        const transcription = await transcribeAudio(audioPath);

        // Analyze text
        const analysisResults = analyzeText(transcription);

        // Send analysis results
        res.json(analysisResults);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    }
});










sslServer.listen(4444, () => console.log('Secure serve on port 4444'));

//     var request = http.request(sslServer);
// request.setHeader('Access-Control-Allow-Origin', '*'); //config.allowedDomains
// request.setHeader('Access-Control-Allow-Credentials', true);
// request.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Requested-By');
// request.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');







// var express = require("express");
// var cors = require('cors');
// var app = express();
// const http = require('http');
// const path = require('path');
// var https = require('https');
// var bodyparser = require('body-parser');
// const PORT = process.env.PORT || 8080
// app.use(bodyparser.urlencoded({extended:true}));
// app.use(bodyparser.json());
// var fs = require('fs');

// var options =http.createServer ( {
//   key: fs.readFileSync(path.join(__dirname,'certificate','key.pem')),
//   cert: fs.readFileSync(path.join(__dirname,'certificate','cert.pem'))
// },
// app
// );

// //  app.use(cors(
// //   {
// //         origin: "https://ek-reps.com/"
// //     }
// //  ));
// app.use(cors());


// const mysql = require('mysql');

// // http.createServer(function (request, response) {
// // response.writeHead(200, {
// //     'Content-Type': 'text/plain',
// //     'Access-Control-Allow-Origin' : 'https://ek-reps.com/',
// //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
// // });

// // });

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'ekreps_angular',
//     password: '2a41bl13c9',
//     database: 'ekreps_angular'
//   });

  
//   connection.connect((err)=> {
//     if(!err)
//     {
//         console.log("connected");
        
// //         connection.query('select * from products ORDER BY id DESC',(err, rows, fields)=>{
// //   if (!err) 

// //   console.log(rows);
// //   else{
// //     console.log(err);
// //   }
// // })
        
//     }
//     else{
//         console.log("error" + json.stringify(err, undefined,2));
//     }
//   });
// // https.createServer(options, app).listen(PORT,console.log('running'));
// var options= app.listen(PORT,console.log('running'));

//     var request = http.request(options);
// request.setHeader('Access-Control-Allow-Origin', 'https://ek-reps.com/'); //config.allowedDomains
// request.setHeader('Access-Control-Allow-Credentials', true);
// request.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Requested-By');
// request.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');

// app.all('/form',function(req, res){
// // res.sendFile(__dirname+"/form.html");
// res.setHeader('Content-Type', 'text/plain');
// connection.query('select * from products ORDER BY id DESC',(err, rows, fields)=>{
//   if (!err) 

//   res.send(rows);
//   else{
//     console.log(err);
//   }
// });
// });

// app.post('/addproduct',function(req, res){
// // res.sendFile(__dirname+"/form.html");

//  var formData = {
//     first_name: req.body.product,
//     last_name: req.body.variety,
// 	 price: req.body.price,
//     gender: req.body.sale
//   };

// connection.query(`INSERT INTO products ( product_kind, variety, price, main_month_of_sale) VALUES ("${formData.first_name}", "${formData.last_name}","${formData.price}", "${formData.gender}")`,(err, rows, fields)=>{
//   if (!err) 
//   {
//   console.log("inserted");
//   }
//   else{
//     console.log(err);
//   }
// });
// });

// app.delete('/delete_product/:id',function(req, res){
// var id = req.params.id;
// connection.query('delete from products where id=?',id,(err, rows, fields)=>{
//   if (!err) 
//   {
//  // res.redirect('/form');
//   res.send("deleted");
//   console.log(rows);
//   }
//   else{
//     console.log(err);
//   }
// });
// });


// app.put('/update_product/:id',function(req, res){
// var id = req.params.id;
// var product_kind=req.body.product_kind;
// var variety=req.body.variety;
// var price=req.body.price;
// var main_month_of_sale=req.body.main_month_of_sale;
// connection.query('update products set product_kind=?,variety=?,price=?,main_month_of_sale=? where id=?',[product_kind,variety,price,main_month_of_sale,id],(err, rows, fields)=>{
//   if (!err) 
//   {
//  // res.redirect('/form');
//   res.send("updated");
//   console.log(rows);
//   }
//   else{
//     console.log(err);
//   }
// });
// });


// const http = require('http')
// const hostname = '127.0.0.1';
// // const port = 8080;
// const PORT = process.env.PORT || 8080

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World! NodeJS \n');
// });

// server.listen(PORT, hostname, () => {
//   console.log(`Server running at http://${hostname}:${PORT}/`);
// });


