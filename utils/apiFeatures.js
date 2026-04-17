
class ApiFeatures
{
    constructor(query,queryString)
    {
        this.query = query;
        this.queryString = queryString;
    }

    filter()
    {
          // //BUILD  the query
        const queryObject = {...this.queryString};
        const excludedfield = ['sort','page','fields','limit'];
        excludedfield.forEach(el => delete queryObject[el]);
        
        //advance filtering
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sorting()
    {
        //sorting 
    if(this.queryString.sort)
    { 
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
    }else{
       this.query =  this.query.sort('-createdAt');
    }
    return this;
    }

    fields()
    {
        //field
    if(this.queryString.fields)
    {
        const includefield = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(includefield);
    }else{
        this.query = this.query.select('-__v');
    }
    return this;
    }

    paging()
    {
          //pagination
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page-1) * limit;
    
    this.query = this.query.skip(skip).limit(limit);
    return this;
    }
}


module.exports = ApiFeatures;