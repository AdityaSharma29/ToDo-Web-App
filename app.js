const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

var myConnection = mysql.createConnection({
    host : '',
    username : '',
    password : '',
    database : '',
    port : 8888
});

myConnection.connect((err) => {
    if(err) throw err;
    console.log("Database Connected");
});

app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static('assets'));


app.get('/', (req,res) => {
    res.render('index');
})



//  UPDATION
//  UPDATE `sampletb` SET `NAME` = '' WHERE `sampletb`.`ID` = ;

//  DELETION
//  DELETE FROM `sampletb` WHERE `ID` = ;

//  INSERT INTO `admin_table` (`ID`, `TASK`) VALUES (NULL, 'test task');


app.get('/signin', (req,res) => {
    res.render('signin');
})

app.get('/signup', (req,res) => {
    res.render('signup');
})

app.get('/error', (req,res) => {
    res.render('error_page');
})

app.get('/todo/:user', (req,res) => {
    let username = req.params.user;
    let sql = `SELECT * FROM \`${username}_table\` WHERE 1`;
    let query = myConnection.query(sql, (err,results) => {
        if(err) throw err;
        res.render('todo', {
            title : username,
            users : results  
        })
    });
});

app.post('/add-user', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql1 = `INSERT INTO \`users_table\` (\`USERNAME\`, \`PASSWORD\`) VALUES ('${username}', '${password}');`;
    let query1 = myConnection.query(sql1, (err) => {
        if(err) throw err;
    });
    let sql2 = `CREATE TABLE \`my_own\`.\`${username}_table\` ( \`ID\` INT NULL AUTO_INCREMENT , \`TASK\` VARCHAR(50) NULL , PRIMARY KEY (\`ID\`)) ENGINE = InnoDB;`;
    let query2 = myConnection.query(sql2, (err) => {
        if(err) throw err;
    });
    res.redirect('/');
})


app.post('/check', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = `SELECT \`USERNAME\` FROM \`users_table\` WHERE ( \`USERNAME\` = '${username}' AND \`PASSWORD\` = '${password}' );`;
    
    let query = myConnection.query(sql, (err,results) => {
        if(err) throw err;
        const user = results.length ? results[0].USERNAME : undefined ;
        if(user !== undefined ) {
            console.log(user + " Logged In.");
            res.redirect(`/todo/${user}`);
        };
        if ( user == undefined ){
            console.log("User Not Found");
            res.redirect('/error');
        }
    });
});


app.listen(3000, console.log("App Running"));