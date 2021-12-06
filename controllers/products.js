const Product = require('../models/product')

const getAllProductsStatic = async(req, res) => {
    const products = await Product.find({});
    res.status(200).json({ products });
}


const getAllProducts = async(req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {}


    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    if (company) {
        queryObject.company = company
    }

    if (name) {
        // to make shorter searches according to the words we are using regex
        queryObject.name = { $regex: name, $options: 'i' }
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',

        }
        const regEx = /\b(<|>|<=|>=|=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value) }
            }
        })



    }

    console.log(queryObject);
    let result = Product.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt')
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }

    if (limit) {
        result = result.limit(limit);
    }

    if (skip) {
        result = result.skip(skip);
    }

    const products = await result
    res.status(200).json({ products });
}

module.exports = { getAllProducts, getAllProductsStatic };