var express = require('express')
var axios = require('axios')
var app = express()
var bodyParser = require('body-parser')
var path = require("path")
const { Console } = require('console')
const { name } = require('ejs')

var base_url = "http://localhost:3000"
app.set("views", path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))
var Name_Customer
var Id_Customer
var random_id

function Register_Login() {
    app.get('/', (req, res) => res.render("Register_Login/index"))

    app.get('/Sign_in', async(req, res) => res.render("Register_Login/Sign_in"))

    app.get('/Sign_up', async(req, res) => res.render("Register_Login/Sign_up"))


    app.get('/Pawn_Shop', async(req, res) => {
        const respones = await axios.get(base_url + '/Customers')
        res.render("Shop_Index", { Customers: respones.data, Name: Name_Customer })
    })


    app.post('/Confrim_Register', async(req, res) => {
        try {


            const data_Customer = {
                Name: req.body.Name,
                Phone: req.body.Phone,
                Email: req.body.Email,
                Address: req.body.Address,
                Password: req.body.Password
            }
            Name_Customer = data_Customer.Name
            await axios.post(base_url + '/Customer_Post', data_Customer)
            const respones = await axios.get(base_url + '/Customers')
            res.render("Shop_Index", { Customers: respones.data, Name: Name_Customer })

        } catch (err) {
            console.error(err)
            res.status(500).send('Error Post Register')
        }

    })


    app.post('/Register_Customer', async(req, res) => {
        try {

            const data_Customer = {
                Name: req.body.Name,
                Phone: req.body.Phone,
                Email: req.body.Email,
                Address: req.body.Address,
                Password: req.body.Password
            }
            const respones = await axios.get(base_url + '/Customers')
            res.render("Register_Login/Check_Register", { Customer: data_Customer, Customers: respones.data })



        } catch (err) {
            console.error(err)
            res.status(500).send('Error3')
        }
    })
    app.post('/Login_Customer', async(req, res) => {
        try {

            const data_login = {
                Name: req.body.Name,
                Password: req.body.Password
            }
            if (data_login.Name == 'Admin' && data_login.Password == '11') res.render('admin')
            else {
                Name_Customer = data_login.Name
                const respones = await axios.get(base_url + '/Customers')
                res.render("Register_Login/Check_Login", { Customer: data_login, Customers: respones.data })
            }

        } catch (err) {
            console.error(err)
            res.status(500).send('Error3')
        }
    })
}

function Pawn_Product() {
    app.get('/Pawn_Product/:Name/:Id', async(req, res) => {
        Id_Customer = req.params.Id
        const respones_Employee = await axios.get(base_url + '/Employees')
        res.render("Pawn_Product/Pawn_Product", { Name: req.params.Name, Id: req.params.Id, Employees: respones_Employee.data })

    })

    app.post('/Data_Product', async(req, res) => {
        const data_Product = {
            Customer_Id: req.body.Customer_Id,
            Employee_Id: req.body.Employee_Id,
            Name: req.body.Name,
            Value: req.body.Value,
            Status: req.body.Status

        }

        const respones_Employee = await axios.get(base_url + '/Employees')

        let min = respones_Employee.data.length - respones_Employee.data.length
        let max = respones_Employee.data.length - 1
        random_id = Math.floor(Math.random() * (max - min + 1)) + min

        data_Product.Status = 'False'
        data_Product.Customer_Id = Id_Customer
        data_Product.Employee_Id = respones_Employee.data[random_id].Employee_Id


        await axios.post(base_url + '/Item_Post', data_Product)
        const respones_Item = await axios.get(base_url + '/Items')
        res.render("Pawn_Product/Ticket_Pawn", {
            Id_Customer: Id_Customer,
            Name: Name_Customer,
            Id_Employee: random_id,
            Item: respones_Item.data,
            Employee: respones_Employee.data
        })


    })


    app.get('/Record_Pawn/:Customer_Id', async(req, res) => {
        const respones_Item = await axios.get(base_url + '/Items')
        const respones_Ticket = await axios.get(base_url + '/Tickets')

        res.render("Pawn_Product/Record_Pawn", {
            Id: req.params.Customer_Id,
            Name: Name_Customer,
            Items: respones_Item.data,
            Tickets: respones_Ticket.data
        })
    })

    app.post('/Ticket_Pawn', async(req, res) => {
        const data_ticket = {
            Customer_Id: req.body.Customer_Id,
            Product_Id: req.body.Product_Id,
            Employee_Id: req.body.Employee_Id,
            Principle: req.body.Principle,
            Rate: req.body.Rate,
            Total: req.body.Total
        }
        const respones = await axios.get(`${base_url}/Items`)
        data_ticket.Customer_Id = Id_Customer
        data_ticket.Product_Id = respones.data[respones.data.length - 1].Product_Id
        data_ticket.Employee_Id = random_id

        await axios.post(base_url + '/Ticket_Post', data_ticket)
        res.redirect("/Pawn_Shop")
    })

}

function Customer() {

    app.get('/Customer_Page', async(req, res) => {
        const respones = await axios.get(base_url + '/Customers')
        res.render("Customer/Customer", { Customers: respones.data })
    })

    app.get('/Update_Customer/:Customer_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Customer/' + req.params.Customer_Id)
        res.render("Customer/Update_Customer", { Customer: respones.data })
    })

    app.post('/Put_Customer/:Customer_Id', async(req, res) => {
        const data_Customer = {
            Name: req.body.Name,
            Phone: req.body.Phone,
            Email: req.body.Email,
            Address: req.body.Address,
            Password: req.body.Password
        }

        Name_Customer = req.body.Name
        await axios.put(base_url + '/Customer_Update/' + req.params.Customer_Id, data_Customer)
        const respones_Cus = await axios.get(base_url + '/Customers')
        res.render("Shop_Index", { Name: Name_Customer, Customers: respones_Cus.data })
    })

    app.get('/delete/:Customer_Id', async(req, res) => {

        await axios.delete(base_url + '/Customer_Delete/' + req.params.Customer_Id)
        res.redirect('/')
    })

}

function Employee() {
    app.get('/Employee_Page', async(req, res) => {
        const respones = await axios.get(base_url + '/Employees')
        res.render("Employee/Employee", { Employees: respones.data })
    })

    app.get('/Create_Employee', async(req, res) => {
        res.render("Employee/Create_Employee")
    })

    app.post('/Employee_Post', async(req, res) => {
        const data_Employee = {
            Name: req.body.Name,
            Phone: req.body.Phone,
            Salary: req.body.Salary,
            Post: req.body.Post
        }
        await axios.post(base_url + '/Employee_Post', data_Employee)
        res.redirect("Employee_Page")
    })



    app.get('/Update_Employee/:Employee_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Employee/' + req.params.Employee_Id)
        res.render("Employee/Update_Employee", { Employee: respones.data })
    })

    app.post('/Put_Employee/:Employee_Id', async(req, res) => {
        const data_Employee = {
            Name: req.body.Name,
            Phone: req.body.Phone,
            Salary: req.body.Salary,
            Post: req.body.Post
        }

        await axios.put(base_url + '/Employee_Update/' + req.params.Employee_Id, data_Employee)
        res.redirect('/Employee_Page')

    })

    app.get('/Delete_Employee/:Employee_Id', async(req, res) => {

        await axios.delete(base_url + '/Employee_Delete/' + req.params.Employee_Id)
        res.redirect('/Employee_Page')
    })

}

function Item() {
    app.get('/Item_Page', async(req, res) => {

        const respones_Items = await axios.get(base_url + '/Items')
        const respones_Customers = await axios.get(base_url + '/Customers')
        res.render("Item/Item", {
            Items: respones_Items.data,
            Customers: respones_Customers.data
        })
    })

    app.get('/Update_Item/:Product_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Item/' + req.params.Product_Id)
        res.render("Item/Update_Item", { Item: respones.data })
    })

    app.post('/Put_Item/:Product_Id', async(req, res) => {
        const data_Item = {
            Name: req.body.Name,
            Value: req.body.Value
        }
        const data_Ticket = {
            Principle: req.body.Principle,
            Rate: req.body.Rate,
            Total: req.body.Total
        }
        await axios.put(base_url + '/Item_Update/' + req.params.Product_Id, data_Item)
        const respones_Ticket = await axios.get(base_url + '/Tickets')

        data_Ticket.Principle = req.body.Value
        Calrate(data_Ticket)
        let count = 0
        respones_Ticket.data.map(x => {
            if (req.params.Product_Id == x.Product_Id) count += 1
        })
        if (count == 1) {
            axios.put(base_url + '/Ticket_Update/' + req.params.Product_Id, data_Ticket)
            res.redirect("/Item_Page")
        } else res.render("Error_Page")




    })

    function Calrate(data) {
        var value = [1000, 3000, 5000, 7000]
        var rate = [0.1, 0.2, 0.3, 0.4, 0.5]
        let total = 0
        for (let i = 0; i < value.length; i++) {
            if (data.Principle < value[i]) {
                data.Rate = rate[i]
                break
            }
        }
        if (data.Principle >= 7000) data.Rate = rate[4]
        total = data.Principle * data.Rate
        data.Total = total + parseInt(data.Principle)

    }

    app.get('/Delete_Item/:Product_Id', async(req, res) => {

        await axios.delete(base_url + '/Item_Delete/' + req.params.Product_Id)
        res.redirect("/Item_Page")
    })

}

function Ticket() {

    app.get('/Ticket', async(req, res) => {
        const respones_Ticket = await axios.get(base_url + '/Tickets')
        const respones_Customer = await axios.get(base_url + '/Customers')
        const respones_Item = await axios.get(base_url + '/Items')
        const respones_Employee = await axios.get(base_url + '/Employees')
        res.render("Ticket/Ticket", {
            Tickets: respones_Ticket.data,
            Customers: respones_Customer.data,
            Items: respones_Item.data,
            Employees: respones_Employee.data,

        })
    })

    app.get('/Delete_Ticket/:Ticket_Id', async(req, res) => {
        axios.delete(base_url + '/Ticket_Delete/' + req.params.Ticket_Id)
        res.redirect("/Ticket")
    })


}

function admin() {

    app.get('/admin', async(req, res) => {
        res.render("admin")
    })
    app.get('/Check_Pawn', async(req, res) => {
        const respones_items = await axios.get(base_url + '/Items')
        const respones_Customers = await axios.get(base_url + '/Customers')
        res.render("Check_Pawn", {
            Items: respones_items.data,
            Customers: respones_Customers.data
        })
    })

    app.get('/Confirm/:Product_Id', async(req, res) => {

        const data = {

            Status: req.body.Status
        }
        data.Status = 'True'

        axios.put(base_url + '/Item_Update/' + req.params.Product_Id, data)

        res.redirect('/Check_Pawn')
    })

}

Register_Login()
Pawn_Product()
Customer()
Employee()
Item()
Ticket()
admin()

app.listen(5500, () => console.log(`Listening on port 5500`))