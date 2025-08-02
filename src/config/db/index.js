import mongoose from "mongoose";

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/minhduc-course', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connect success');
  } catch (error) {
    console.error('connect error:', error);
    throw error;
  }
}

export default { connect };
