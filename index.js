const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const app = express();
app.use(cors())
app.use(express.json({limit : "10mb"}));

const PORT = process.env.PORT || 8080;

//MongoBD connection
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{console.log("connected to data base")})
.catch((err)=>{console.log(err)})

//schema
const userSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email:{
        type : String,
        unique : true
    },
    password:  String,
    confirmPassword : String,
    image : String
})
//===========================

 

//----------------------------------------------signup API--------------------------------------------------------
//model
const userModel = mongoose.model("user",userSchema)

// API connection
app.get('/',(req,res)=>{
    res.send('sever is running')
})

app.post('/signup',(req,res)=>{
    console.log(req.body)
    const {email} = req.body
    userModel.findOne({ email: email })
    .then((result) => {
      console.log('result', result);
  
      if (result) {
        res.send({ message: "Already had an account on this Email",alert : false });
      } else {
        const data = userModel(req.body);
        const dave = data.save();
        res.send({ message: "Account is created successfully",alert :  true });
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  
    
})
//----------------------------------------------log in api ----------------------------------
app.post('/login',(req,res)=>{
    console.log(req.body)
    const {email} = req.body
    userModel.findOne({ email: email})
    .then((result)=>{
         if(result){
        const dataSend = {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            image : result.image

        }
        console.log(dataSend)
       
            res.send({message: " login is Successfull", alert : true , data: dataSend})
        }
        else{
            res.send({message: "No account available on this Email", alert : false })
        }
    })
    .catch((err) => {
        console.log("err", err);
      });
})

//----------------------- product API-------------------------------------------

const schemaProduct = mongoose.Schema({
  name : String,
  category : String,
  image : String,
  price : String,
  description : String
})

const productModel = mongoose.model('Product', schemaProduct)


// save product in data base

app.post("/uploadProduct",async (req,res)=>{
  console.log(req.body)
const data = await productModel(req.body)
 const dataSave =  await data.save()
  res.send({message : "A New Product Uploaded Successfully"})
})

app.get("/product", async(req, res) => {
  const data = await productModel.find({}) 
  res.send(JSON.stringify(data))
})




app.listen(PORT,()=>{console.log(`listening on port ${PORT}`)})