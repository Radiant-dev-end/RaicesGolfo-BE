const sequelize = require('./src/config/db');

async function fixTable() {
  try {
    await sequelize.authenticate();
    await sequelize.query('ALTER TABLE opiniones MODIFY imagen LONGTEXT;');
    console.log("Table altered successfully.");
  } catch (error) {
    console.error("Error altering table:", error);
  } finally {
    process.exit();
  }
}

fixTable();
