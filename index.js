//initializing
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6mxxl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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


    const taskCollection = client.db("taskDB").collection("createTask");


    //task related api
    app.get("/createTask", async (req, res) => {
      const cursor = taskCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/createTask', async (req, res) => {
      const newtask = req.body;
      console.log(newtask);
      const result = await taskCollection.insertOne(newtask);
      res.send(result);
    })


    app.put('/createTask/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatemarks = req.body
      const marks = {
        $set: {
          status: updatemarks.status,

        }
      }
      const result = await taskCollection.updateOne(filter, marks, options)
      res.send(result);
    })


    app.put('/taskUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatemarks = req.body
      const marks = {
        $set: {
          title: updatemarks.title,
          deadline: updatemarks.deadline,
          category: updatemarks.category,
          description: updatemarks.description,

        }
      }
      const result = await taskCollection.updateOne(filter, marks, options)
      res.send(result);
    })


    // Send a ping to confirm a successful connection

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Task server is running");
})

app.listen(port, () => {
  console.log((`Taskserver is running on port: ${port}`))
})