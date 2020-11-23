// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_Adbit_db";
import UserModel from "../models/Adbit_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.Adbit_db.host +
        ":" +
        properties.Adbit_db.port +
        "//" +
        properties.Adbit_db.user +
        "@" +
        properties.Adbit_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.Adbit_db.name,
      properties.Adbit_db.user,
      properties.Adbit_db.password,
      {
        host: properties.Adbit_db.host,
        dialect: properties.Adbit_db.dialect,
        port: properties.Adbit_db.port,
        logging: false
      }
    );
    this.dbConnection_Adbit_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_Adbit_db;
  }
}

export default new Database();
