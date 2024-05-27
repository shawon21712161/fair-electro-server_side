const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
// app.use(cors());
app.use(
  cors({
    origin: ["https://asssignment-10.web.app","http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d6dtwlx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
  

    const productsCollection = client.db("productDB").collection("products");
    const cartCollection = client.db("productDB").collection("cart");

    // get all products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single products
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const quarey = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(quarey);
      res.send(result);
    });

    app.get("/brand/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brand: brandName };
      const brandData = await productsCollection.find(query).toArray();
      res.send(brandData);
    });

    // post products data
    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      // console.log(newProducts);
      const result = await productsCollection.insertOne(newProducts);
      res.send(result);
    });

    // post cart product
    app.post("/cartItems", async (req, res) => {
      const cartItems = req.body;
      // console.log(cartItems);
      const result = await cartCollection.insertOne(cartItems);
      res.send(result);
    });

    // get cart products

    app.get("/cartItems", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete cart
    app.delete("/cartItems/:id", async (req, res) => {
      const id = req.params.id;
      const quarey = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(quarey);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
