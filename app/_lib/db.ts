import pg from "pg";
import { User } from "./entities";

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
});

export async function getUserById(userId: number) {
  try {
    const res = await pool.query("SELECT * FROM users WHERE id = $1 ", [
      userId,
    ]);
    let data = res.rows[0];
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserByUsername(username: string) {
  try {
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    let data = res.rows[0];
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    let data = res.rows[0];
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function createUser(userData: User) {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      dateOfBirth,
      gender,
    } = userData;
    const res = await pool.query(
      "INSERT INTO users  (firstname, lastname, username,  email, password, dateOfBirth, gender) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [firstname, lastname, username, email, password, dateOfBirth, gender]
    );

    let user = res.rows[0];
    return user;
  } catch (err) {
    console.error(err);
  }
}
