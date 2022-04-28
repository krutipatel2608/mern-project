const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const employeeSchema = new mongoose.Schema({
    UserName:{
        type: String,
        required: true,
    },

    Email:{
        type: String,
        required: true,
        unique: true
    },

    Phone: {
        type: Number,
        required: true,
        unique: true
    },
    
    Gender: {
        type: String,
        required: true,
    },

    Password: {
        type: String,
        required: true,
        unique: true,
    },

    token: [{
        token:{
            type: String,
            required: true,
        }

    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({id:this._id.toString()}, "thisamernbackendprojectcreatingwebtoken");
        this.token = this.token.concat({token});   //({schema token:the token that generated currently})
    //    console.log(token);
        await this.save();
    //   console.log(token);
    }catch(err){
        console.log(err,"error");
    }
}


        employeeSchema.pre("save",async function(next){
        if(this.isModified("Password")){
         //   const hashpassword = await bcrypt.hash(this.Password, 10)
         //   console.log(`the current password is ${this.Password}`);
            this.Password = await bcrypt.hash(this.Password, 10);
        
        //    console.log(`the current password is ${this.Password}`);
              
        }
        next();
    })



    const registerEmp = new mongoose.model("registerEmp", employeeSchema);

module.exports = registerEmp;