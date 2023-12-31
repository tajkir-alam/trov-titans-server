const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
// app.use(cors());
const corsConfig = {
    origin: '*',
    Credential: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig));

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


        // ------------------->>>>>> Index was did for 1 time then I turn it off.
        // const indexKeys = { name: 1 };
        // const indexOptions = { name: "searchingToys" };
        // const indexCreating = await ShopByCategory.createIndex(indexKeys, indexOptions);

        app.get('/alltoys', async (req, res) => {

            const limitIs = parseInt(req.query.limit)
            const categoryName = req.query.categoryname;
            const toyName = req.query.searchtoy;
            const getEamil = req.query.email;
            const sortToys = req.query.sorttoys;

            let limit = 1000000000;
            let query = {};
            let sortIs = {};

            if (limitIs) {
                limit = limitIs;
            }

            if (categoryName) {
                query = { subCategory: categoryName };
            }

            if (toyName) {
                query = { name: { $regex: toyName, $options: 'i' } };
            }

            if (getEamil) {
                query = { sellerEmail: getEamil }
            }

            if (sortToys) {
                sortIs = { price: sortToys }
            }

            const cursor = ShopByCategory.find(query).limit(limit).sort(sortIs);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ShopByCategory.findOne(query);
            res.send(result)
        })

        app.post('/alltoys', async (req, res) => {
            const allToys = req.body;
            const result = await ShopByCategory.insertOne(allToys);
            res.send(result);
        })

        app.put('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const toy = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    details: updatedToy.details,
                },
            };
            const result = await ShopByCategory.updateOne(filter, toy, options);
            res.send(result);
        })


        app.delete('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await ShopByCategory.deleteOne(filter);
            res.send(result);
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
    const all_Toys = 'https://trov-titans-server-data.vercel.app/alltoys'
    const single_Toy = 'https://trov-titans-server-data.vercel.app/alltoys/64684820d42658e60f48d02c'
    // const text = 'All toys https://trov-titans-server-data.vercel.app/alltoys'
    const text = {all_Toys, single_Toy}
    res.send({text})
})

app.listen(port, () => {
    console.log("Server is running on port: ", port);
})