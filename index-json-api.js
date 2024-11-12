const express = require('express')
const users = require('./MOCK_DATA.json')
const fs = require("fs")

const app = express()
const port = 4000

//for html
app.get('/users',(req,res)=>{
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
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
    return res.json({
        msg:'msg from middleware 1'
    })
    //next()
})
// crud function
const listAllUser = (req,res)=>{
    return res.json(users)
}
const listUserById = (req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user => user.id === id))
    if(!user){
        return res.status(404).json({
            status : 'failed',
            message: `No user found on ${id}`
        })
    } 
    return res.json(user)
}
const createUser = (req,res)=>{
    const body = req.body;
    
    users.push({...body,id:users.length + 1})
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        return res.json("new user created")
    })    
}
const updateUser = (req,res)=>{
    
    let id = Number(req.params.id);
    let updateUser = users.find(user => user.id === id)
    
    if(!updateUser){
        return res.status(404).json({
            status : 'failed',
            message: `No user found on ${id}`
        })
    } 
    let userIndex = users.indexOf(updateUser)
    Object.assign(updateUser,req.body)
    users[userIndex] = updateUser

    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        res.status(200).json({
            status:'success',
            data:{
                users : updateUser
            }
        })
    })    
}
const deleteUser = (req,res)=>{
    const id = Number(req.params.id);
    const deleteId = users.find(user => user.id === id)
    const index = users.indexOf(deleteId)
    if(!deleteId){
        res.status(404).json({
            status:'failed',
            message : `user not found on ${deleteId}`,
        })
    }
    users.splice(index,1)

    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        res.status(201).json({
            status:'user deleted',
            data:{
                users:deleteId
            }
        })
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