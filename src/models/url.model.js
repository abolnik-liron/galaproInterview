
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const urlSchema = new Schema({
    url: {
        type: Schema.Types.String,
    },
});


const urlModel = mongoose.model("urlModel", urlSchema);

module.exports = urlModel;
