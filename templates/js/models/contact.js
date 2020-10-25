const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    email: String
});

ContactSchema.index({ email: -1 });

module.exports = mongoose.model('Contact', ContactSchema);
