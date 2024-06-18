const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, default: null },
  birthDate: { type: Date, required: true },
  inn: { type: String, required: true },
  innType: { type: String, required: true },
  responsiblePerson: { type: String, required: true },
  status: { type: String, default: 'Не в работе' }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;