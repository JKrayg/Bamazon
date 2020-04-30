var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Rootpassword3574",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    establishedConnection()
})

function establishedConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        console.log("WELCOME TO BAMAZON!");
        customerPrompt();
    });

}

function customerPrompt() {
    inquirer.prompt([{
            type: "input",
            name: "itemID",
            message: "What is the ID of the product you would like to purchase?"
        },
        {
            type: "input",
            name: "units",
            message: "How many would you like to purchase?"
        }
    ]).then(function (item) {
        var theItem = item.itemID;
        connection.query(
            "SELECT stock_quantity FROM products WHERE ?", {
                id: theItem
            },
            function (err, res) {
                if (err) throw err;
                var itemsLeft = res[0].stock_quantity;
                if (item.units <= itemsLeft) {
                    console.log("Your purchase was successful, check your email for shipping information!");
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{
                                stock_quantity: itemsLeft - item.units
                            },
                            {
                                id: theItem
                            }
                        ]
                    )
                    continueShopping();
                } else {
                    console.log("We're sorry! There isnt enough in stock!")
                    continueShopping();
                }
                //console.log(res);
                //connection.end();
            }
        )
    })
}

function continueShopping() {
    inquirer.prompt({
        type: "list",
        name: "keepShopping",
        message: "Continue shopping?",
        choices: ["Yes", "No"]
    }).then(function (item) {
        if (item.keepShopping === "Yes") {
            establishedConnection();
        } else {
            connection.end();
        }
    })
}