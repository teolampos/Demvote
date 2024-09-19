import pg from "pg";
import { User, PollFilters, VoteTypeEnum, SortByEnum, Poll } from "./entities";

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  ssl: false,
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
    throw err;
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
    throw err;
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
    throw err;
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
    throw err;
  }
}

export async function getPollById(pollId: number): Promise<any> {
  try {
    let res = await pool.query("SELECT * FROM polls where polls.id = $1", [
      pollId,
    ]);
    let poll = res.rows[0];
    return poll;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getPollsWithFilters(
  voteType: VoteTypeEnum,
  sortBy: SortByEnum,
  limit: number,
  offset: number,
  userId: number
) {
  let polls;
  try {
    if (voteType === VoteTypeEnum.VOTED) {
      if (sortBy === SortByEnum.NEWEST) {
        let res = await pool.query(
          "SELECT polls.id, title, description, posting_date, expiry_date FROM  polls JOIN votes ON polls.id = votes.poll_id  WHERE votes.user_id =  $1 GROUP BY polls.id ORDER BY posting_date DESC LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.OLDEST) {
        let res = await pool.query(
          "SELECT polls.id, title, description, posting_date, expiry_date FROM  polls JOIN votes ON polls.id = votes.poll_id  WHERE votes.user_id =  $1 GROUP BY polls.id ORDER BY posting_date ASC LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.MOST_VOTES) {
        let res = await pool.query(
          "SELECT polls.id , title, description ,posting_date, expiry_date , count(votes.id) FROM polls JOIN votes ON polls.id = votes.poll_id WHERE votes.user_id = $1 GROUP BY polls.id ORDER BY count(votes.id) DESC LIMIT $2 OFFSET $3",

          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.LEAST_VOTES) {
        let res = await pool.query(
          "SELECT polls.id , title, description ,posting_date, expiry_date , count(votes.id) FROM polls JOIN votes ON polls.id = votes.poll_id WHERE votes.user_id = $1 GROUP BY polls.id ORDER BY count(votes.id) ASC LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.EXPIRED) {
        let res = await pool.query(
          "SELECT polls.id , title, description ,posting_date, expiry_date  FROM polls JOIN votes ON polls.id = votes.poll_id WHERE votes.user_id = $1 AND expiry_date < CURRENT_DATE GROUP BY polls.id  LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.NOT_EXPIRED) {
        let res = await pool.query(
          "SELECT polls.id , title, description ,posting_date, expiry_date  FROM polls JOIN votes ON polls.id = votes.poll_id WHERE votes.user_id = $1 AND expiry_date > CURRENT_DATE GROUP BY polls.id  LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
    }

    if (voteType === VoteTypeEnum.UNVOTED) {
      if (sortBy === SortByEnum.NEWEST) {
        let res = await pool.query(
          "SELECT polls.id, title, description, posting_date, expiry_date FROM polls LEFT JOIN votes ON polls.id = votes.poll_id AND votes.user_id = $1 WHERE votes.poll_id IS NULL ORDER BY posting_date DESC LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        let polls = res.rows;

        return polls;
      }
      if (sortBy === SortByEnum.OLDEST) {
        let res = await pool.query(
          "SELECT polls.id, title, description, posting_date, expiry_date FROM polls LEFT JOIN votes ON polls.id = votes.poll_id AND votes.user_id = $1 WHERE votes.poll_id IS NULL ORDER BY posting_date ASC LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.MOST_VOTES) {
        let res = await pool.query(
          `SELECT polls.id, polls.title, polls.description, polls.posting_date, polls.expiry_date, COUNT(other_votes.poll_id) AS vote_count FROM polls
        LEFT JOIN votes AS user_votes ON polls.id = user_votes.poll_id AND user_votes.user_id = $1 
        LEFT JOIN votes AS other_votes ON polls.id = other_votes.poll_id 
        AND other_votes.user_id != $1
        WHERE user_votes.poll_id IS NULL
        GROUP BY polls.id, polls.title
        ORDER BY COUNT(other_votes.poll_id) DESC LIMIT $2 OFFSET $3`,
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.LEAST_VOTES) {
        let res = await pool.query(
          `SELECT polls.id, polls.title, polls.description, polls.posting_date, polls.expiry_date, COUNT(other_votes.poll_id) AS vote_count FROM polls
        LEFT JOIN votes AS user_votes ON polls.id = user_votes.poll_id AND user_votes.user_id = $1 
        LEFT JOIN votes AS other_votes ON polls.id = other_votes.poll_id 
        AND other_votes.user_id != $1
        WHERE user_votes.poll_id IS NULL
        GROUP BY polls.id, polls.title
        ORDER BY COUNT(other_votes.poll_id) ASC LIMIT $2 OFFSET $3`,
          [userId, limit, offset]
        );
        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.EXPIRED) {
        let res = await pool.query(
          "SELECT polls.id, title, description, posting_date, expiry_date FROM polls LEFT JOIN votes ON polls.id = votes.poll_id AND votes.user_id = $1 WHERE votes.poll_id IS NULL AND expiry_date < CURRENT_DATE ORDER BY posting_date DESC LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );

        polls = res.rows;
        return polls;
      }
      if (sortBy === SortByEnum.NOT_EXPIRED) {
        let res = await pool.query(
          "SELECT polls.id, title, description, posting_date, expiry_date FROM polls LEFT JOIN votes ON polls.id = votes.poll_id AND votes.user_id = $1 WHERE votes.poll_id IS NULL AND expiry_date > CURRENT_DATE ORDER BY posting_date DESC LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );

        polls = res.rows;
        return polls;
      }
    }
  } catch (err) {
    throw err;
  }
}

export async function createPoll(payload: Poll) {
  try {
    await pool.query(
      "INSERT INTO polls (type, title, description, expiry_date, userid, options) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        payload.type,
        payload.title,
        payload.description,
        payload.expiryDate,
        payload.userId,
        payload.options,
      ]
    );
  } catch (err) {
    console.error(err);
  }
}

export async function insertVote(
  userId: number,
  pollId: number,
  vote: string
): Promise<any> {
  try {
    const res = await pool.query(
      "INSERT INTO votes (user_id, poll_id, vote) VALUES ($1 , $2, $3)  RETURNING *",
      [userId, pollId, vote]
    );
    return res.rows[0];
  } catch (err) {
    throw err;
  }
}
