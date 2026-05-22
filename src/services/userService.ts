import pool from '../config/db';

export interface User {
  uid: string;
  email: string | null;
  display_name: string | null;
  photo_url: string | null;
  provider: string;
  created_at: Date;
  updated_at: Date;
}

export async function upsertUser(
  uid: string,
  email: string | null,
  displayName: string | null,
  photoUrl: string | null,
  provider: string
): Promise<User> {
  const { rows } = await pool.query<User>(
    `INSERT INTO users (uid, email, display_name, photo_url, provider)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (uid) DO UPDATE SET
       email        = EXCLUDED.email,
       display_name = EXCLUDED.display_name,
       photo_url    = EXCLUDED.photo_url,
       updated_at   = NOW()
     RETURNING *`,
    [uid, email, displayName, photoUrl, provider]
  );
  return rows[0];
}

export async function getUserByUid(uid: string): Promise<User | null> {
  const { rows } = await pool.query<User>(
    'SELECT * FROM users WHERE uid = $1',
    [uid]
  );
  return rows[0] ?? null;
}

export async function deleteUser(uid: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    'DELETE FROM users WHERE uid = $1',
    [uid]
  );
  return (rowCount ?? 0) > 0;
}
