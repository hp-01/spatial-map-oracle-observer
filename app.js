const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const viewpath = __dirname + '/public/';
app.use(express.static(viewpath));

app.post("/spatial-data", async (req, res) => {
    const { user, password, connectString, tableName } = req.body;
    oracledb.getConnection({ user: user, password: password, connectString: connectString })
        .then(connection => {
            connection.execute(`select * from ${tableName}`)
                .then(result => {
                    connection.close();
                    return res.status(200).send(result);
                })
                .catch(err => res.status(400).send(err));
        })
        .catch(err => res.status(404).send(err));
});

app.listen(5000, () => {
    console.log("Listening on port 5000");
});