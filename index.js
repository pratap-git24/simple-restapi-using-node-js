const express = require('express')
const fs = require("fs")
const mongoose = require("mongoose")
const users = require('./MOCK_DATA.json')

const app = express()
const port = 4000

// mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/students')
.then(()=>console.log("mongodb connected"))
.catch(err=>console.log("Error",err))

// create mongoose schema

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
});

// create model
const User = mongoose.model('user',schema)

//for html
app.get('/users', async (req,res)=>{
    const allUsers = await User.find({})
    const html = `
    <ul>
        ${allUsers.map(user => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `
    return res.send(html)
})
//end here

//middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
bodyParser = require('body-parser').json();

app.use((req,res,next)=>{
    console.log("middleware 1")
    /* return res.json({
        msg:'msg from middleware 1'
    }) */
    next()
})
// crud function
const listAllUser = async (req,res)=>{
    const allUsers = await User.find({})
    return res.json(allUsers)
}
const listUserById = async (req,res)=>{
    const id = await User.findById(req.params.id);
    
    if(!id){
        return res.status(404).json({
            status : 'failed',
            message: `No user found on ${id}`
        })
    } 
    return res.json(id)
}
const createUser = async (req,res)=>{
    const body = req.body;

   const result =  await User.create({
        firstName : body.first_name,
        lastName : body.last_name,
        email : body.email
    })
    console.log(result)
    return res.status(201).json("new user created")
}
const updateUser = async (req,res)=>{
    
    let id = await User.findByIdAndUpdate(req.params.id,{lastName:'Puchu'});
   
    if(!id){
        return res.status(404).json({
            status : 'failed',
            message: `No user found on ${id}`
        })
    } 
    res.status(200).json({
        status:"success",
        msg:"user updated"
    })
}
const deleteUser = async (req,res)=>{
    const id = await User.findByIdAndDelete(req.params.id)
    if(!User.findById()){
        res.status(404).json({
            status:'failed',
            message : `user not found on ${deleteId}`,
        })
    }
    res.status(200).json({
        status:"success",
        msg:"user deleted"
    })
}
//using route
app.route('/api/users').get(listAllUser).post(createUser);
app.route('/api/users/:id').get(listUserById).patch(updateUser).delete(deleteUser)

// list all user
//app.get('/api/users',listAllUser)
//list user by id
//app.get('/api/users/:id',listUserById)
// create new user
//app.post('/api/users',createUser)
//edit/update a user
//app.patch('/api/users/:id',bodyParser, updateUser)
//delete user
//app.delete('/api/users/:id',deleteUser)

app.listen(port,()=>{
    console.log(`running on ${port}`)
})