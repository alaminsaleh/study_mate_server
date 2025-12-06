const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
// console.log(process.env);

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j5lpy.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db('studymate_db');
        const partnerCollection = db.collection('partners');


        // Users APIs
        app.post('/users', async (req, res) => {
            const newUser = req.body;

            const email = req.body.email;
            const query = { email: email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                res.send({ message: 'User already exist. Do not need to insert again' })
            }
            else {
                const result = await userCollection.insertOne(newUser);
                res.send(result);
            }

        })

        // Partners APIs
        app.get('/', (req, res) => {
            res.send('Study Mate Server is running');
        });

        app.get('/partners', async (req, res) => {
            // const projectField = { name: 1 }
            // const cursor = partnerCollection.find().sort({ rating: -1 }).skip(9).limit(2).project(projectField);
            console.log(req.query);
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }

            const cursor = partnerCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/top-study-partners', async (req, res) => {
            const cursor = partnerCollection.find().sort({ rating: -1 }).limit(3);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/partners/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await partnerCollection.findOne(query);
            res.send(result);
        })

        app.post('/partners', async (req, res) => {
            const newPartner = req.body;
            const result = await partnerCollection.insertOne(newPartner);
            res.send(result);
        });





        console.log(" Connected to MongoDB successfully!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
    //  await client.close();
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Study Mate is running on port: ${port}`);
});




