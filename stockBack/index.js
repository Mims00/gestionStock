const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const syncDb = require('./config/syncDb');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const orderRoute=require('./routes/orderRoute');
const customerRoute=require('./routes/customerRoute');
const delivererRoute=require ('./routes/delivererRoute')
const notificationRoute = require('./routes/notificationRoute'); 
const predictionRoute=require('./routes/predictionRoute');
const login = require('./controllers/authController');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); 
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/customers', customerRoute);
app.use('/api/deliverers', delivererRoute);
app.use('/api/notifications', notificationRoute);
app.post('/api/auth',login);
app.use('/api/predictions', predictionRoute);
syncDb();


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
