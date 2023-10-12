// older way of importing modules (before es6)
const { v4: uuidv4 } = require('uuid');
// mongoose
const mongoose = require('mongoose');
const Customer = require('./models/customer');
mongoose.set('strictQuery', false);

// check if its production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// hard-coded data
const customers = [
  { name: 'Caleb', industry: 'music' },
  { name: 'John', industry: 'networking' },
  { name: 'Sal', industry: 'sports medicine' },
];

// import express package
const express = require('express');
// create a new instance of the express app
const app = express();
// define the Port - default 3000
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const customer = new Customer({
  name: 'Milosz',
  industry: 'Propaganda',
});

// browser by default sends a request as a get method
app.get('/', (req, res) => {
  res.send(customer);
});

app.get('/api/customers', async (req, res) => {
  try {
    const result = await Customer.find();
    res.send({ data: result });
  } catch (error) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/customers', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

// res - send back to the user
app.post('/', (req, res) => {
  res.send('This is a post method');
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);
    app.listen(PORT, () => {
      console.log('App is listening on the port', PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
