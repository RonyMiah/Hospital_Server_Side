
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT  || 5000



// Middle ware 

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzdlp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        
        const database = client.db("BD_Hospital");
        const userCollection = database.collection("users");

        app.post('/users', async (req, res) =>{
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.json(result)
            console.log(result);

        });
    }
    finally{
    //   await client.connect();
     
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello Hospital BD!')
})

app.listen(port, () => {
  console.log(` Test app listening on port ${port}`)
})