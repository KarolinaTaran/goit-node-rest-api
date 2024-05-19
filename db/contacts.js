import "dotenv/config";
import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
console.log(DB_URI);

// mongoose.connection.on("connected", () => {
//   console.log("Mongoose connected to DB Cluster");
// });

// mongoose.connection.on("error", (error) => {
//   console.error("Mongoose connection error:", error);
// });

// mongoose.connection.on("disconnected", () => {
//   console.log("Mongoose disconnected from DB Cluster");
// });

// async function run() {
//   try {
//     console.log(DB_URI);
//     await mongoose.connect(DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000, // Таймаут вибору сервера
//       socketTimeoutMS: 45000, // Таймаут сокету
//       connectTimeoutMS: 10000,
//     });
//     console.log("Database connection successful");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   } finally {
//     await mongoose.disconnect();
//     console.log("Disconnected from MongoDB");
//   }
// }

// run().catch((error) => console.error(error));

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successfully"))
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
