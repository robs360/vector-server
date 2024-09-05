const express=require("express");
const app=express();

const cors=require("cors")
require('dotenv').config()
const port =process.env.PORT || 5000

app.use(cors())
app.use(express.json())


// https://blog.hubspot.com/blog/tabid/6307/bid/34143/12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require("express");
const uri = "mongodb+srv://Vector:w5OsTYnCFcwHD1Lv@cluster0.tju8r4h.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const postCollection = client.db('vector').collection('post')
    const userCollection = client.db('vector').collection('user')
    
    app.get('/read_post', async (req,res)=>{
        const result=await postCollection.find().toArray()
        res.send(result)
    })
    app.post('/users',async (req,res)=>{
        const user=req.body;
        console.log("User info",user)
        const email=user.Email;
        console.log("it is email ",email)
        const query={Email:email}
        const exist=await userCollection.findOne(query)
        if(exist){
          return res.status(401).send({ message: "User already exists" });
        }
        else{
           const result=await userCollection.insertOne(user)
           res.send(result)
        }
    })
    
    app.put('/react/:id', async (req,res)=>{
         const id=req.params.id;
         const query = { _id: new ObjectId(id) };
         const updateDoc={
           $inc:{react:1}
         };
         const result=await postCollection.updateOne(query,updateDoc)
         res.send(result)
    })

    app.put('/liked/:id',async (req,res)=>{
        const email=req.params.id
        console.log("it is id ",email)
        const query = {Email:email }  
        const options = { upsert: true }     
        const update=req.body;
        console.log("it is update ",update)
        
        const updateDoc = {
          $set: {
             liked:update
          }
        }
        const result= await userCollection.updateOne(query,updateDoc,options)
        res.send(result)
    })
    
    app.get('/get_user',async (req,res)=>{
        const result=await userCollection.find().toArray()
        res.send(result)
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send("vector server is running")
})

app.listen(port, ()=>{
    console.log(`it is running on port ${port}`)
})