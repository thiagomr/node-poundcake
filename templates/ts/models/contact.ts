import mongoose from 'mongoose';

const ContactSchema = mongoose.Schema({
    email: String
});

ContactSchema.index({ email: -1 });

export default mongoose.model('Contact', ContactSchema);
