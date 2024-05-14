const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express()
const corsOption = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOption))
app.use(express.json())

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrw2ki7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const foodCollection = client.db('foodDonate').collection('allFood');

    app.get('/food', async (req, res) => {
      const result = await foodCollection.find().toArray()
      res.send(result)
    })
    // add food 
    app.post("/addFood", async (req, res) => {
      console.log(req.body)
      const result = await foodCollection.insertOne(req.body)
      console.log(result)
      res.send(result)
    })
    // manage food related
    app.get("/manageFood/:email", async (req, res) => {
      console.log(req.params.email)
      const result = await foodCollection.find({ email: req.params.email }).toArray()
      res.send(result)
    })
    // single card products
    app.get("/singleFood/:id", async (req, res) => {
      const result = await foodCollection.findOne({ _id: new ObjectId(req.params.id) })
      res.send(result)
    })
    // update
    app.get("/updateFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(query);
      res.send(result)
    })
    app.put('/updateFood/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedDonate=req.body;
      const update = {
        $set: {
          photo:updatedDonate.photo,
          name:updatedDonate.name,
          location:updatedDonate.location,
          quantity:updatedDonate.quantity,
          date:updatedDonate.date,
          notes:updatedDonate.notes,
          email:updatedDonate.email,
          donar:updatedDonate.donar,
          dname:updatedDonate.dname
        }

      }
 const result=await foodCollection.updateOne(filter,update,options)
res.send(result)
    })
    // delete
    app.delete("/delete/:id", async (req, res) => {
      const result = await foodCollection.deleteOne({ _id: new ObjectId(req.params.id) })
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hello form food donate')
})

app.listen(port, () => console.log(`server running on port ${port}`))