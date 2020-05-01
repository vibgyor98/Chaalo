//API's features
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //filtering
  filter() {
    //build query and Filtering
    const queryObj = { ...this.queryString }; //ES6 Destructuring
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((ele) => delete queryObj[ele]);

    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //regular expression
    console.log(JSON.parse(queryStr));

    //identifying particular filter query
    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this; //return object
  }
  //Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this; //return object
  }
  //Field Limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // query = query.select('name duration price');
      this.query = this.query.select(
        'name price ratingsAverage summary difficulty'
      );
    } else {
      this.query = this.query.select('-__v');
    }
    return this; //return object
  }
  //Pagination
  paginate() {
    const page = this.queryString.page * 1 || 1; //converting string to int
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; //Basic formula

    //page=2&limit=10 :- 1-10 page1, 11-20 page2, ...
    this.query = this.query.skip(skip).limit(limit);

    return this; //return object
  }
}

module.exports = APIFeatures;
