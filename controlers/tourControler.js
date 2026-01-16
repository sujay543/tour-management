
const Tour = require('../models/tourModels.js');


exports.aliasTopTour = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}





exports.checkBody = (req,res,next) => {
    if(!req.body.name){
        return res.status(400).json(
            {
                status: 'failed',
                message: 'please include name'
            }
    )}
    next();
}


exports.getTour = async (req,res) =>{ 

    // //BUILD  the query
    const queryObject = {...req.query};
    const excludedfield = ['sort','page','field','limit'];
    excludedfield.forEach(el => delete queryObject[el]);
    const query = Tour.find(queryObject);

    //Execute the query
    const tours = await query;

    //send response
    res.status(200).json({
        status: 'success',
        results: tours.length,
        body: {
            tours
        }
    })
}

exports.createTour = async (req,res) =>{
    try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: newTour
    })
    }catch (err) {
        console.log(err);
        res.status(404).json(
            {
                status: "failed",
                message: err
            }
        )
    }
    
}

exports.getspecificTour = async (req,res) =>{
    try {
    const newTour = await Tour.findById(req.params.id);
    res.status(201).json(
        {
        status: "success",
        data: newTour
        }
    )
    }catch(err){
        res.status(404).json(
            {
                status: 'failed',
                message: err
            }
        )
    }
    
}

exports.updateTour = async (req,res) =>{
    console.log(req.params.id);
    try{
    const newTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    });
    res.status(201).json(
        {
            status: 'success',
            newTour
        }
    );
    }catch(err){
        console.log(err);
        res.status(404).json({
            status: 'failed',
            err: err
        })
    }

}

exports.deleteTour = async (req,res)=>{
   
    try{
      const newTour = await Tour.findByIdAndDelete(req.params.id);
        res.status(200).send('success');
    }catch(err){
        res.status(404).json(
            {
                status: "failed",
            }
        )
    }


}

exports.getTourStats = async (req,res) => {
    try{
    const status = Tour.aggregate([
        {
            $match : { ratingAverage: { $gte: 4.5 } }
        }
    ])


    }catch(err)
    {
        res.status(404).json(
        {
            status: "failed",
        })
    }
}