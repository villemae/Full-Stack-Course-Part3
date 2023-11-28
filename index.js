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
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body[req]'));
app.use(cors());

// Routes---------------

app.get('/', (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
    .then( persons => {
        res.json(persons);
    })
    .catch(error => next(error));
})

app.get('/info', (req, res) => {
    const date = new Date().toDateString();
    console.log(date);
    Person.find({}).then( persons => {
        res.send(`<p> Phonebook has info for ${persons.length} people. </p>
                <p> ${date} </p>`);
    })
    
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then( person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).send(`Person with id ${id} not found!`);
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then( person => {
        console.log(person);
        res.status(204).end();
    })
    .catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
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
        person.save()
        .then(savedPerson => {
            res.json(savedPerson);
        })
        .catch(error => next(error));
    }
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
    .then( updatedContact => {
        console.log(updatedContact);
        res.json(updatedContact);
    })
    .catch(error => next(error));
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'});
}

app.use(unknownEndpoint);

// End of routes----------------

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ReferenceError') {
        return res.status(400).send({ error: 'id not defined' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
  
    next(error);
}

app.use(errorHandler);
  
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
