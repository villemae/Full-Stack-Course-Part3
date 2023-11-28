const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  });

function numberValidator (number) {
  const parts = number.split('-');
  // Check that there is one and only one '-' in the string
  if (parts.length !== 2) {
    console.log(parts);
    return false;
  }
  // Check that the first part has either two or three numbers
  else if (parts[0].length !== 2 && parts[0].length !== 3) {
    console.log(parts, parts[0], parts[1]);
    return false;
  }
  // Check that string has only numbers
  else if (!Number(parts[0]) || !Number(parts[1])) {
    console.log(Number(parts[0]), Number(parts[1]));
    return false;
  }
  return true;
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 9,
    validate: {
      validator: numberValidator,
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Person', personSchema);