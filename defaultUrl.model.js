
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const defaultUrlSchema = new Schema({
    url: {
        type: Schema.Types.String,
    },
});

const defaultUrlModel = mongoose.model("defaultUrlModel", defaultUrlSchema);

module.exports = defaultUrlModel;
