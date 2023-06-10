require('dotenv').config()

const mongoose = require('mongoose');

const dbConnect=()=>{
    mongoose.connect(process.env.URL).then(()=>{
    console.log('db conecconnect successfully');
});
}

module.exports =dbConnect;