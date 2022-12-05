const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const request = require("request");
const app = express();

const credentials = (
    require("fs").existsSync(path.join(__dirname, "credentials.js"))
    ? require("./credentials")
    : console.log("No credentials.js file present")
);

var corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const db = require('./models');

var useCloud = true;

const PORT = process.env.PORT || 8080;

db.mongoose.connect(useCloud ? db.cloudUrl : db.localUrl, {useUnifiedTopology : true})
    .then(() => {
        console.log("Connected to the Database!");
    })
    .catch(err => {
        console.log("Cannot connect to the Database!", err);
        process.exit();
    })

require("./models/doorModel");
require("./routes/doorRoutes")(app);

app.get("/token", (req, res) => {
    request.post(
        credentials.Authentication,
        { form: credentials.credentials },
        (error, response, body) => {
            if(!error && response.statusCode == 200){
                res.json(JSON.parse(body));
            }
        }
    )
});

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/client', 'build', 'index.html'));
    });
};

app.get("/", (req, res) => {
    res.json({message: "Welcome to Revit MongoDb Server"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});