import createTables from './tables/index.js';

const bootstrapDatabase = async () => {
  try {
    console.log('Checking database tables...');
    await createTables();
    console.log('Database bootstrap completed');
  } catch (error) {
    console.error('Database bootstrap failed:', error.message);
    throw error;
  }
};

export default bootstrapDatabase;
