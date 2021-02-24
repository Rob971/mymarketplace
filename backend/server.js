const PORT = 5000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = express.Router();

// custom routes
app.use("/api",routes);

// body-parser
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());
const jsonParser = bodyParser.json();

//cors
routes.use(cors());

// mongodb client
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://roberto:root@clustermymultiverse.4vhri.mongodb.net/mymultiverse?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true });
const DB_NAME = "mymultiverse";
// connect to server
app.listen(PORT, () => {
    console.log(`Server up and running on http://localhost:${PORT}`);
});

// connect to DB
client.connect((err) => {
    if(err){
        throw Error(err);
    }
    !err && console.log("Successfully connected to DB");
    // perform actions on the collection object

    const products = client.db(DB_NAME).collection("products");
    routes.get("/products",
        (req, res) => {
        products.find()
            .toArray()
            .then((error,results) =>{
            if(error) {res.send(error)}
            res.status(200).send({results});
        }).catch((err) => res.send(err));
    });


    const exampleObj = {
        "id": 499999,
        "category": "Clothes",
        "name": "Leather MEN Wallet Brown Style",
        "price": 19
    };
    routes.post('/products/add',
        jsonParser,
        (req,
         res) => {
                        products
                            .insertOne(req.body)
                            .then(() => res.status(200).send('successfully inserted new document'))
                            .catch((err) => {
                                console.log(err);
                                res.send(err);
                            });
        });
});

// route
routes.get("/", (req, res) => {
    res.send("Hello World!");
});