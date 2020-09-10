/**
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @version 1.0
 */
const mongoose = require('mongoose');

/**
 * 
 * @function connection
 * @param {*} callback 
 * @todo Connect to mongodb in the cloud
 */

async function connection(callback) {
    const  url = "mongodb+srv://enduser:vmVl5EPLOnm5yZKV@endpointclust.i2opo.mongodb.net/EndpointStore?retryWrites=true&w=majority";
    await mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});
    await callback(mongoose);
};

module.exports = connection
