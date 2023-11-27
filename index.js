require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

// Custom  morgan token for logging
morgan.token('body', function getBody (req) {
    return Object.keys(req.body).length == 0 ? '' : JSON.stringify(req.body);
})

// Middleware
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body[req]'));
app.use(cors());
app.use(express.static('dist'));

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
];

// Routes---------------

app.get('/', (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then( persons => {
        res.json(persons);
    })
})

app.get('/info', (req, res) => {
    const date = new Date().toDateString();
    console.log(date);
    Person.find({}).then( persons => {
        res.send(`<p> Phonebook has info for ${persons.length} people. </p>
                <p> ${date} </p>`);
    })
    
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findById(id)
    .then( person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).send(`Person with id ${id} not found!`);
        }
        
    })
    .catch((error) => {
        console.log(error);
        res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    contacts = contacts.filter(contact => contact.id !== id);
    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body.name) {
        res.status(400).send("Name missing from request body!");
    }
    else if (!body.number) {
        res.status(400).send("Number missing from request body!");
    }
    else {
        const person = new Person({
            name: body.name,
            number: body.number,
        })
        person.save().then(savedPerson => {
            res.json(savedPerson);
        })
    }
})

// End of routes----------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
