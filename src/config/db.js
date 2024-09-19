import mongoose from "mongoose";

const connectToDb = () => {
  if (mongoose.connection?.readyState === 1) {
    return;
  } else {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to DB !"))
      .catch((err) => console.log("Error connecting to DB => ", err));
  }
};

export default connectToDb;
