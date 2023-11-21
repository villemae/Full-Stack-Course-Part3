const express = require('express');

const app = express();

app.use(express.json());

let notes = [
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

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.get('/api/persons', (req, res) => {
    res.json(notes);
})

app.get('/info', (req, res) => {
    const date = new Date().toDateString();
    console.log(date);
    res.send(`<p> Phonebook has info for ${notes.length} people. </p>
                <p> ${date} </p>`);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);
    note ? res.send(note) : res.status(404).end();
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
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
    else if (notes.find(note => note.name == body.name)) {
        res.status(400).send("Error: Name must be unique!");
    }
    else if (notes.find(note => note.id == id)) {
        res.status(400).send("Error: ID must be unique!");
    }
    else {
        const newPerson = {
            id: id,
            name: body.name,
            number: body.number
        };
        notes.push(newPerson);
        res.send(notes);
    }
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

