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
})

function establishedConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        customerPrompt();
    });
    
}

function customerPrompt() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "What is the item ID of the product you would like to purchase?"
        },
        {
            type: "input",
            name: "units",
            message: "What is the quantity of this product you would like to purchase?"
        }
    ]).then(function(item) {
        var theItem = item.itemID;
        connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                id: theItem
            }
            ,function(err, res) {
                if (err) throw err;
                // if (item.units <= /*available stock || [ RowDataPacket { stock_quantity: 22 } ]*/ ) {
                //     connection.query(
                //         "UPDATE products SET ? WHERE ?", 
                //         [
                //             {
                //                 stock_quantity: /*stock_quantity - item.units*/
                //             },
                //             {
                //                 id: itemID
                //             }
                //         ]
                //     )
                // }
                console.log(res);
                connection.end();
            }
        )
    })
}