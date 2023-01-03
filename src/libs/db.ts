import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true,
  },
});

export default async function dbQuery(query) {
  try {
    const results = await db.query(query);
    await db.end();
    return { data: results };
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}
