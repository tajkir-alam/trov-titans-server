const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
require('dotenv').config()

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h2ziqne.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const ShopByCategory = client.db("TrovTitans").collection("ShopByCategory");
        // const okTry = client.db("TrovTitans").collection("oktry");

        const indexKeys = { name: 1 };
        const indexOptions = { name: "searchingToys" };
        const indexCreating = await ShopByCategory.createIndex(indexKeys, indexOptions);

        app.get('/alltoys', async (req, res) => {

            const limitIs = parseInt(req.query.limit)
            const categoryName = req.query.categoryname;
            const toyName = req.query.searchtoy;

            let limit = 1000000000;
            let query = {};

            if (limitIs) {
                limit = limitIs;
            }

            if (categoryName) {
                query = { subCategory: categoryName };
            }

            if (toyName) {
                query = { name: { $regex: toyName, $options: 'i' } };
            }

            const cursor = ShopByCategory.find(query).limit(limit);
            const result = await cursor.toArray();
            res.send(result);
        })

        // app.get('/oktry', async(req, res) => {
        //     const cursor = okTry.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ShopByCategory.findOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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