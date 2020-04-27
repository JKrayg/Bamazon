var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Rootpassword3574",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connection Successful!");
    establishedConnection()
    //connection.end();
})

function establishedConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end(); 
    });
    
}