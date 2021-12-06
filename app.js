const express = require('express');
const app = express();

require('dotenv').config()
require('express-async-errors')
    // async errors


const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

const connectDB = require('./db/connect');
const productRouter = require('./routes/products');

// middleware
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.send('<h1>Store API </h1> ');
})

app.use('/api/v1/products', productRouter)

app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 3000;
// console.log(process.env.MONGO_URI);

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening to the port ${port}`))
    } catch (error) {
        console.log(error);
    }
}


start();