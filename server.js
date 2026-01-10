
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const app = require('./index.js');
const mongoose = require('mongoose')


mongoose.connect(process.env.DATABASE).then((con) => {
     console.log('databse successfully connected');
}).catch((err)=>{
     console.log(err);
     console.log('error');
})


const port = process.env.port || 8000;


app.listen(port, ()=>{
     console.log(`server is running on port ${port}....`);
})