var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'dhfldpsxm!@#'
});

var db = server.use('o2'); //Control o2's Database using var db
// db.record.get('#19:0')
// .then(function(record){
//   console.log('Loaded record:', record);
// });

// //CREATE
// var sql = 'SELECT FROM topic';
// db.query(sql).then(function(results){
//   console.log(results);
// });

// var sql = 'SELECT FROM topic WHERE @rid=:rid'
// var param = {
//   params:{
//     rid:'#19:0'
//   }
// };
// db.query(sql, param).then(function(results){
//   console.log(results);
// });

// //INSERT
// var sql = "INSERT INTO topic (title, description) VALUES(:title, :desc)";
// var param = {
//   params:{
//     title:'Express',
//     desc:'Express is framework for web'
//   }
// }
// db.query(sql, param).then(function(results){
//   console.log(results);//results show info about inserted data
// })

// //UPDATE
// var sql = "UPDATE topic SET title=:title WHERE @rid=:rid";
// var param = {
//   params:{
//     title:'Expressjs',
//     rid:'#20:0'
//   }
// }
// db.query(sql, param).then(function(results){
//   console.log(results); //results how many data change
// })

//UPDATE
var sql = "DELETE FROM topic WHERE @rid=:rid";
var param = {
  params:{
    rid:'#20:0'
  }
}
db.query(sql, param).then(function(results){
  console.log(results); //results how many data delete
})
