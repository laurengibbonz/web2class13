const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const mongoose = require('mongoose');
const port = process.env.PORT;
const root = require('path').join(__dirname, 'portfolio', 'build');
const uri = process.env.ATLAS_URI;
const cors = require('cors');
app.use(cors());

// was missing this code from class 12
app.use(express.json());

mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log('DB connected')
);

const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});

const Contact = mongoose.model("Contact", contactSchema);

app.get('/contacts', (req, res) => {
    Contact.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error' + err));
});

app.post('/contacts/add', (req, res) => {
    const newContact = new Contact(req.body);
  
    newContact.save()
      .then(() => res.json('Contact added!'))
      .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/contacts/delete/:id', (req, res) => {
    Contact.findByIdAndDelete(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
});


app.listen(
    port,
    () => console.log(`Listening: ${port}`)
);