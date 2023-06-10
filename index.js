require('dotenv').config()
require('express-async-errors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const dbConnect = require('./database/db');
const port = process.env.PORT;


/* importing routes */
const userRoute = require('./src/modules/users/user.router');
const postRoute = require('./src/modules/posts/post.router');
const commentRoute = require('./src/modules/comments/comment.router');
const reviewRoute = require('./src/modules/reviews/review.router');



/* middleWares */
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('dev'));
app.use(cors());
dbConnect();

/* routing */
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/comment', commentRoute);
app.use('/api/v1/review', reviewRoute);

/* globalErrorHandling */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        staus: statusCode,
        message: err.message || 'internal server error',
        errors: err.errors || []
    })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});