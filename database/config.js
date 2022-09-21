const mongoose = require("mongoose");

const dbConnection = async () => {
  // Como es una conexion a una base de datos que yo no tengo el control absoluto,
  // me conviene hacer un try/catch pq puede fallar
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Base de datos online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

module.exports = {
  dbConnection,
};
