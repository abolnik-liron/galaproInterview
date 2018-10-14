
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require("mongoose");
const urlModel = require('./url.model');
const defaultUrlModel = require('./defaultUrl.model');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
// Working local requires cors.
app.use(cors());

// Mongoose connection.
connectionString = 'mongodb://localhost:27017/galapro'
mongoose.connect(connectionString).then(() => {
    console.log('DB connection successes')
}).catch(err => {
    console.log('DB connection failed.', {
        err: err
    });
});

// Default url in case url is not valid.
const defaultUrl = 'https://google.com';

// Method handle URL verification.
const verifyUrl = (data) => {
    return new Promise(async (resolve, reject) => {
        // If not data reject.
        if (!data) {
            reject('no data');
        }

        // Check if the value is valid URL
        let isUrl = await isURL(data.url);
        let response = {};

        // If the value is valid resolve.
        if (isUrl) {
            response = {
                url: data.url,
                isValid: true
            }
            resolve(response);

        } else {
            // If the value is not valid look for default value in DB
            let defaultUrl = await findDefaultUrl();

            if (defaultUrl) {
                response = {
                    url: defaultUrl.url,
                    isValid: false
                }
                resolve(response);

            } else {
                reject('No default URL in DB');
            }

        }
    })
}
// Method to find and update mongoDB table of URL
const findByUrl = (url) => {
    return new Promise(async (resolve, reject) => {
        var query = { url: url },
            update = { url: url },
            options = { upsert: true, new: true };

        // Find the document
        urlModel.findOneAndUpdate(query, update, options, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    })
}

// Method to find default URL in DB
findDefaultUrl = () => {
    return new Promise(async (resolve, reject) => {
        defaultUrlModel.findOne({ url: 'https://google.com' }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

// Method to create default URL in DB
createDefaultUrl = (defaultUrl) => {
    return new Promise(async (resolve, reject) => {
        var query = { url: defaultUrl },
            update = { url: defaultUrl },
            options = { upsert: true, new: true };

        // Find the document
        defaultUrlModel.findOneAndUpdate(query, update, options, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    })
}
// Method to check with regex if the URL is valid.
const isURL = (str) => {
    return new Promise(async (resolve, reject) => {
        var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        var url = new RegExp(urlRegex, 'i');
        resolve(str.length < 2083 && url.test(str));
    })
}

// Express routing and bussniss logic handling.
app.post('/verifyUrl', async (req, res) => {
    let body = req.body.data;

    try {
        let verifiedUrl = await verifyUrl(body);

        if (body.isRedirect) {

            let resultUrl = await findByUrl(verifiedUrl.url);
            if (!resultUrl) {
                res.status(500).json({ message: 'error', data: 'error fetching data from mongodb' })
            }

            res.status(200).json({ message: 'successes', data: verifiedUrl })

        } else {
            res.status(500).json({ message: 'error', data: 'Redirect checkbox is not checked' })
        }
    } catch (error) {
        res.status(500).json({ message: 'error', data: error });
    }

});


// Creatre Express server.
const server = app.listen(8080, () => {
    var host = server.address().address
    var port = server.address().port
    createDefaultUrl('https://google.com');
    console.log("App listening at http://%s:%s", host, port)
})


