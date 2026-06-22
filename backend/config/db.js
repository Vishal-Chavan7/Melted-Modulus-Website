import mongoose from "mongoose";
import Contact from "../models/contact.model.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);

    const legacyReadResult = await Contact.updateMany(
      { status: "read" },
      { $set: { status: "pending" } },
    );
    if (legacyReadResult.modifiedCount > 0) {
      console.log(`Migrated ${legacyReadResult.modifiedCount} contact message(s) from read to pending`);
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
