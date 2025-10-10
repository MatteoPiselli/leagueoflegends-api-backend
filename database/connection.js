const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));

// Close the Mongoose connection when Ctrl+C is pressed
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit(0);
});

module.exports = mongoose;
