const mongoose = require('mongoose');

console.log(process.argv.length);
if (process.argv.length<3) {
  console.log('give password as argument');
  process.exit(1);
}
else if (process.argv.length != 3 && process.argv.length != 5) {
    console.log('To print all documents:\n "node mongo.js password"');
    console.log('To add a document:\n "node mongo.js password name number"');
    process.exit(1);
}

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

const Person= mongoose.model('Person', personSchema);

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach( person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })
}
else if (process.argv.length == 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({name, number});
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
