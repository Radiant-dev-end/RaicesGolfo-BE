const { sequelize } = require('../models/index');

async function fixUsuarioIndexes() {
  try {
    await sequelize.authenticate();
    console.log('Database connection validated.');

    // Retrieve current indexes on usuarios table
    const [indexes] = await sequelize.query('SHOW INDEX FROM usuarios');
    const emailIdx = indexes.filter(i => i.Column_name === 'email' && i.Key_name !== 'PRIMARY');
    console.log('Existing email indexes:', emailIdx.map(i => i.Key_name));

    // Drop duplicate email indexes if any
    for (const idx of emailIdx) {
      const dropSql = `DROP INDEX \`${idx.Key_name}\` ON usuarios`;
      console.log('Dropping index:', dropSql);
      await sequelize.query(dropSql);
    }

    // Ensure a single unique index on email
    console.log('Adding unique index on email (if not exists)');
    await sequelize.query('ALTER TABLE usuarios ADD UNIQUE (email)');
    console.log('Unique index on email ensured.');
  } catch (error) {
    console.error('Error fixing usuarios indexes:', error);
  } finally {
    await sequelize.close();
  }
}

fixUsuarioIndexes();
