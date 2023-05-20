const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
require('dotenv').config()

// Middleware
app.use(cors());
app.use(express.json());


// TrovTitans
// OlzIpl43mniy9ZDW

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://TrovTitans:OlzIpl43mniy9ZDW@cluster0.h2ziqne.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // Server Auto off / can't get data error solution code
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const ShopByCategory = client.db("TrovTitans").collection("ShopByCategory");
        const okTry = client.db("TrovTitans").collection("oktry");

        app.get('/shopbycategory', async (req, res) => {
            const limitIs = parseInt(req.query.limit)
            const categoryName = req.query.categoryname;
            console.log(categoryName);
            let limit = 1000000000;
            if (limitIs) {
                limit = limitIs;
            }

            let query = {};
            if (categoryName) {
                query = { subCategory: categoryName };
                // console.log(categoryName);
            }

            const cursor = ShopByCategory.find(query).limit(limit);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/oktry', async(req, res) => {
            const cursor = okTry.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is working')
})

app.listen(port, () => {
    console.log("Server is running on port: ", port);
})

















