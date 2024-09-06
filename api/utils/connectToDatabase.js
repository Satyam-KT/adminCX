import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://skt1082:gFibN3TqhqnpzyqH@codxo.f4xb4vo.mongodb.net/internPortal?retryWrites=true&w=majority&appName=Codxo';

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};
