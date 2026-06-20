import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ADMIN = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "Pass@1234",
  phone: "9999999999",
  role: "admin",
};

const createAdmin = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email: ADMIN.email });

    if (existingUser) {
      existingUser.name = ADMIN.name;
      existingUser.password = ADMIN.password;
      existingUser.phone = ADMIN.phone;
      existingUser.role = ADMIN.role;
      existingUser.isBlocked = false;
      await existingUser.save();

      console.log("Admin user updated:");
      console.log(`  Email: ${ADMIN.email}`);
      console.log(`  Role:  ${ADMIN.role}`);
      return;
    }

    await User.create(ADMIN);

    console.log("Admin user created:");
    console.log(`  Email: ${ADMIN.email}`);
    console.log(`  Role:  ${ADMIN.role}`);
  } catch (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createAdmin();
