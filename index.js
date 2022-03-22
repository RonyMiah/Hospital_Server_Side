
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const serviceCollection = database.collection("All_Services");
        const reviewsCollection = database.collection("Users_Reviews");

        app.post('/users', async (req, res) =>{
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.json(result)
            console.log(result);

        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            console.log(result);
            res.send(result);
          })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            console.log(result);
            res.send(result);
          })


            // Update User ......... Upsert User 
            app.put('/users', async (req, res) => {
                const user = req.body;
                const filter = { email: user.email };
                const options = { upsert: true };
                const updateDoc = { $set: user };
                const result = await userCollection.updateOne(filter, updateDoc, options);
                res.json(result)
            });
            // Admin Role add 
            app.put('/users/admin', async(req, res)=>{
                const user = req.body;
                const filter = {email: user.email};
                const updateDoc ={$set: {role: 'admin'}};
                const result = await userCollection.updateOne(filter, updateDoc)
                res.json(result)

            })
            app.get('/users/:email', async (req, res) => {
                const email = req.params.email;
                const query ={ email: email };
                const user = await userCollection.findOne(query)
                let isAdmin = false;
                if( user?.role === 'admin') {
                    isAdmin = true;
                }
                res.json({admin: isAdmin});
            })

            app.get('/services/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id)};
                const user = await serviceCollection.findOne(query);
                res.send(user)
                
            })

            app.get('/services', async (req, res) => {
                const cursor = serviceCollection.find({});
                const service = await cursor.toArray();
                res.send(service);
              })
            app.get('/reviews', async (req, res) => {
                const cursor = reviewsCollection.find({});
                const review = await cursor.toArray();
                res.send(review);
              })
                
              // Delete API 

              app.delete('/services/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)};
                const result = await serviceCollection.deleteOne(query);
                res.json(result)
              })

            app.put('/review/approve/:id', async(req, res)=>{
              const id = req.params.id;
              const query = {_id:ObjectId(id)};
              const result = await reviewsCollection.updateOne(query,{$set:{isPending:true}});
              res.json(result)
            })
        
  
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