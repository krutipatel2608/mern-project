require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

require("./db/conn");
const registerEmp = require("./models/registers");
const async = require("hbs/lib/async");

const { count } = require("console");
const console = require("console");


const port = process.env.PORT || 7000;

const static_path = (path.join(__dirname,"../public"));
const template_path = (path.join(__dirname,"../src/templates/views"));
const partials_path = (path.join(__dirname,"../src/templates/partials"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

//console.log(process.env.SECRET_KEY);

 app.get("/", (req, res) => {
     res.render("home");
 })

 app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", async(req, res) => {
    try{
    //    const Password = req.body.password;
    //   const c_Password = req.body.passwordConf;

    //   if(Password === c_Password){

            const registerEmployee = new registerEmp({
                UserName: req.body.UserName,
                Email: req.body.email,
                Phone: req.body.PhoneNo,
                Gender: req.body.gender,
                Password: req.body.password,
                
            })
        //    console.log(registerEmployee);

            //password hashing(middleware)

            const token = await registerEmployee.generateAuthToken();
                
            const registerData = await registerEmployee.save();
            res.render("home");
            
        
        }catch(err){
         //   console.log(err,'errorlog');
              res.send(err);
        }
});


app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", async(req, res) => {
    try{
        const email = req.body.email;
        const pass = req.body.password;

        //got email from registration and checked if its same 
        const userEmail = await registerEmp.findOne({Email:email});
    //   console.log(userEmail.Password);

        const isMatch = await bcrypt.compare(pass, userEmail.Password);
    //   console.log(isMatch);
        const token = jwt.sign({pass}, process.env.SECRET_KEY);
         console.log("The token:"+token);
         console.log(process.env.SECRET_KEY);
        
        if(isMatch){                                    //(userEmail.Password === pass)
            res.render("home", {
                success:"login success."
            })
        }else{
            res.render("login", {
                error:"Invalid credentials!"
            })        
        }
      
    }catch(err){
        res.send(err);
    }
});


/*
const jwt = require("jsonwebtoken");
const createToken = async() => {
    const token = await jwt.sign({_id:"6268caf1924f028fa14a0c46"}, "thisamernbackendprojectcreatingwebtoken");
    console.log(token);

    const verifyToken = await jwt.verify(token, "thisamernbackendprojectcreatingwebtoken");
    console.log(verifyToken);
}  
createToken(); */

app.listen(port, () => {
    console.log(`listening to the port no ${port}`);
});
