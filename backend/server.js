const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/crud')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define User schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// CRUD operations:

// Create user

app.post('/signup', async (req, res) => {
  try {
    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password
    });
    user = await user.save();
    console.log('User created:', user);  // Log the created user
    res.status(201).json({msg:'User created', data:user});
  } catch (err) {
    console.log('Error creating user:', err);  // Log any errors
    res.status(400).send(err);
  }
});


// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log('Users fetched:', users);  // Log the fetched users
    res.status(200).json(users);
  } catch (err) {
    console.log('Error fetching users:', err);  // Log any errors
    res.status(500).send(err);
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('User updated:', user);  // Log the updated user
    res.status(200).json(user);
  } catch (err) {
    console.log('Error updating user:', err);  // Log any errors
    res.status(400).send(err);
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log('User deleted:', req.params.id);  // Log the deleted user ID
    res.status(200).json('User deleted');
  } catch (err) {
    console.log('Error deleting user:', err);  // Log any errors
    res.status(400).json(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
