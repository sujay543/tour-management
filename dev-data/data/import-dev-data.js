const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModels.js');
dotenv.config({path:'./../../config.env'});
const mongoose = require('mongoose')


mongoose.connect(process.env.DATABASE).then((con) => {
     console.log('databse successfully connected');
}).catch((err)=>{
     console.log(err);
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));
const insertData = async (req,res) => {
    try{
        await Tour.create(tours);
        console.log('data has successfully inserted');
          process.exit();
    }catch(err){
        console.log(err);
    }
}

const deleteData = async (req,res) => {
    try{
        await Tour.deleteMany();
        console.log('data has successfully deleted');
          process.exit();
    }catch(err){
        console.log(err);
    }
}

if(process.argv[2]== '__insert'){
    insertData();
  
}else if(process.argv[2]=== '__delete'){
    deleteData();
}






