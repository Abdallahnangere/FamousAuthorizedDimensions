import pg from 'pg';

const { Pool } = pg;

// Singleton pattern for the database connection
let pool: pg.Pool;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Neon and many cloud providers
      },
    });
  } else {
    console.warn('DATABASE_URL not set. Database operations will fail.');
    // Fallback or mock for build time if needed, but runtime will fail without DB
    pool = new Pool({
      connectionString: 'postgres://user:pass@localhost:5432/db',
    });
  }
} catch (error) {
  console.error('Failed to initialize database pool:', error);
}

export const prisma = {
  $executeRawUnsafe: async (query: string, ...params: any[]) => {
    try {
      const client = await pool.connect();
      try {
        // Convert ? to $1, $2, etc. for Postgres compatibility if needed
        // But better-sqlite3 uses ?, pg uses $1, $2.
        // We need to handle this conversion or assume the user writes $1.
        // The previous code used ?. I should probably convert ? to $n.
        
        let formattedQuery = query;
        let paramIndex = 1;
        while (formattedQuery.includes('?')) {
          formattedQuery = formattedQuery.replace('?', `$${paramIndex++}`);
        }

        const result = await client.query(formattedQuery, params);
        return result.rowCount;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Database error in $executeRawUnsafe:', error);
      throw error;
    }
  },
  $queryRawUnsafe: async <T = any>(query: string, ...params: any[]) => {
    try {
      const client = await pool.connect();
      try {
        let formattedQuery = query;
        let paramIndex = 1;
        while (formattedQuery.includes('?')) {
          formattedQuery = formattedQuery.replace('?', `$${paramIndex++}`);
        }

        const result = await client.query(formattedQuery, params);
        return result.rows as T[];
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Database error in $queryRawUnsafe:', error);
      throw error;
    }
  },
};
