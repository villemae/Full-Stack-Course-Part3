const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Custom  morgan token for logging
morgan.token('body', function getBody (req) {
    return Object.keys(req.body).length == 0 ? '' : JSON.stringify(req.body);
})

// Middleware
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body[req]'));
app.use(cors());

// Hard-coded list of contacts
let contacts = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
      },
      {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
      }
]

// Routes---------------

app.get('/', (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
})

app.get('/api/persons', (req, res) => {
    res.json(contacts);
})

app.get('/info', (req, res) => {
    const date = new Date().toDateString();
    console.log(date);
    res.send(`<p> Phonebook has info for ${contacts.length} people. </p>
                <p> ${date} </p>`);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find(contact => contact.id === id);
    contact ? res.send(contact) : res.status(404).end();
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    contacts = contacts.filter(contact => contact.id !== id);
    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const id = Math.ceil(Math.random()*100);
    const body = req.body;
    if (!body.name) {
        res.status(400).send("Name missing from request body!");
    }
    else if (!body.number) {
        res.status(400).send("Number missing from request body!");
    }
    else if (contacts.find(contact => contact.name == body.name)) {
        res.status(400).send("Error: Name must be unique!");
    }
    else if (contacts.find(contact => contact.id == id)) {
        res.status(400).send("Error: ID must be unique!");
    }
    else {
        const newPerson = {
            id: id,
            name: body.name,
            number: body.number
        };
        contacts.push(newPerson);
        res.json(newPerson);
    }
})

// End of routes----------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
