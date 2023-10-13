// older way of importing modules (before es6)
const { v4: uuidv4 } = require('uuid');
// mongoose
const mongoose = require('mongoose');
const Customer = require('./models/customer');
mongoose.set('strictQuery', false);

// import cors to make backend accessible for client with diff port
const cors = require('cors');

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
app.use(cors());

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

// creating parametrized URL and query parameters
app.get('/api/customers/:id', async (req, res) => {
  // req.params and req.query

  try {
    const { id: customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      // Customer not found, respond with a 404 status and an error message
      return res.status(404).json({ error: 'User not found' });
    } else {
      // Customer found, respond with the customer data
      res.json({ customer });
    }
  } catch (e) {
    // Handle any other errors and respond with a 500 status and an error message
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// patch --- partially update
// put --- replace or complete update

// updating data with PUT method
app.put('/api/customers/:id', async (req, res) => {
  const { id: customerId } = req.params;
  // replace entire customer object
  try {
    const result = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    res.json({ customer: result });
  } catch (error) {
    res.start(500).json({ error: 'Something went wrong' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id: customerId } = req.params;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.json(500).json({ error: 'Something went wrong' });
  }
});

// create a new customer
app.post('/api/customers', async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);

  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (e) {
    res.start(400).json({ error: e.message });
  }
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
