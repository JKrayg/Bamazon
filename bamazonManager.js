var mysql = require("mysql");
var inquirer = require("inquirer");
//var arr = ["Football", "Laptop", "Computer Desk", "50' Hose", "Hand Soap", "Lamp", "Basketball Net", "13'' Pan", "55'' HD Flatscreen", "Educational Book"]
var arr = []

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

connection.query("SELECT product_name FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) { 
       arr.push(res[i].product_name)
    }
    
})


function establishedConnection() {
    inquirer.prompt([
        {
            type: "list",
            name: "input",
            message: "Actions: ",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (choice) {
        switch (choice.input) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;
        }

    });

}


function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}


function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 15) {
                console.log(res[i].product_name + " - " + res[i].stock_quantity + " - low!");
            }
        }
        connection.end();
    });
}


function addInventory() {
    inquirer.prompt([
        {
            type: "list",
            name: "items",
            message: "What item would you like to update inventory for?",
            choices: arr
        },
        {
            type: "input",
            name: "amount",
            message: "How many would you like to add?"
        }
    ]).then(function (input) {
        connection.query("SELECT * FROM products", function (err, res) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === input.items) {
                    connection.query("UPDATE products SET ? WHERE ?",
                            [{
                                    stock_quantity: res[i].stock_quantity + parseInt(input.amount)
                                },
                                {
                                    product_name: input.items
                                }
                            ]
                        ),
                        function (err, res) {
                            if (err) throw err;
                            
                        }
                }
            }
            console.log("The inventory has been updated for " + input.items + "!");
            checkInventory();
        });
    });
}


function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "What product would you like to add?"
        },
        {
            type: "input",
            name: "department",
            message: "What department does this product belong to?"
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of this product?"
        },
        {
            type: "input",
            name: "stock",
            message: "How much of this product do we have?"
        }
    ]).then(function (input) {
        connection.query("INSERT INTO products SET ?", 
        {
            product_name: input.product,
            department_name: input.department,
            price: input.price,
            stock_quantity: input.stock
        }
        ,function (err, res) {
            if (err) throw err;
            //getAllProducts()
            console.log("Your product was submitted into the inventory");
            checkInventory();
        });
    });
    
}


function checkInventory() {
    inquirer.prompt(
        {
            type: "confirm",
            name: "check",
            message: "Would you like to check the inventory?"
        }
    ).then(function(confirm) {
        if(confirm.check = "Yes") {
            viewProducts();
        } else {
            connection.end();
        }
    })
}
