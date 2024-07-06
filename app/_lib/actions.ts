"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginSchema, Poll, SortByEnum, User, VoteTypeEnum } from "./entities";
import {
  createPoll,
  createUser,
  getPollById,
  getPollsWithFilters,
  getUserByEmail,
  getUserByUsername,
  insertVote,
  pool,
} from "./db";
import * as bcrypt from "bcrypt";
import { isAuthenticated, pollMapper, signToken } from "./helpers";

export async function signUpUser(initialState: any, formData: FormData) {
  try {
    const validateFields = User.safeParse({
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
    });

    if (!validateFields.success) {
      const errors: any = {};

      validateFields.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      return errors;
    }

    let user = await getUserByUsername(formData.get("username") as string);
    if (user) return { err: "Username already exists" };

    user = await getUserByEmail(formData.get("email") as string);
    if (user) return { err: "Email address already in use" };

    let hashedPassword = await bcrypt.hash(
      formData.get("password") as string,
      10
    );

    user = await createUser({
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: hashedPassword,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
    });

    let userInfo = {
      id: user.id,
    };

    const jwt = await signToken(userInfo);

    cookies().set("SESSION_INFO", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 1000,
    });
  } catch (err) {
    console.log(err);
    return err;
  }
  redirect("/dashboard");
}

export async function loginUser(initialState: any, formData: FormData) {
  try {
    const validateLoginFields = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validateLoginFields.success) {
      const errors: any = {};

      validateLoginFields.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      return errors;
    }

    let user = await getUserByEmail(formData.get("email") as string);
    if (!user) return { err: "User Not Found" };

    if (
      await bcrypt.compare(formData.get("password") as string, user.password)
    ) {
      let userInfo = {
        id: user.id,
      };

      const jwt = await signToken(userInfo);

      cookies().set("SESSION_INFO", jwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 1000,
      });
    } else {
      return { err: "Invalid Password" };
    }
  } catch (err) {
    return err;
  }
  redirect("/dashboard");
}

export async function logout(data?: any) {
  cookies().delete("SESSION_INFO");
  redirect("/login");
}

export async function fetchPollData(pollId: number) {
  let client;
  const { id } = await isAuthenticated();

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const res1 = await client.query("SELECT * FROM polls where polls.id = $1", [
      pollId,
    ]);
    const res2 = await client.query(
      "SELECT vote , COUNT(vote) from votes WHERE poll_id = $1 GROUP BY vote",
      [pollId]
    );
    const res3 = await client.query(
      "SELECT gender, COUNT(votes) FROM polls JOIN votes ON polls.id = votes.poll_id JOIN users ON votes.user_id = users.id WHERE  polls.id = $1 GROUP BY gender",
      [pollId]
    );
    const res4 = await client.query(
      "SELECT vote FROM  votes JOIN polls ON polls.id = votes.poll_id WHERE votes.user_id = $1 AND polls.id = $2",
      [id, pollId]
    );

    await client.query("COMMIT");
    const pollInfo = res1.rows[0];
    const poll = pollMapper(pollInfo);

    const votingMap = new Map();
    const votingData = res2.rows;
    for (let item of votingData) {
      votingMap.set(item.vote, Number(item.count));
    }

    const genderVotingMap = new Map();
    const genderVotingData = res3.rows;
    for (let item of genderVotingData) {
      genderVotingMap.set(item.gender, Number(item.count));
    }
    const userVote = res4.rows[0];

    return { poll, votingMap, genderVotingMap, userVote };
  } catch (err) {
    await client?.query("ROLLBACK");
    throw err;
  } finally {
    client?.release();
  }
}

export async function fetchPollsAction(formData: FormData): Promise<any> {
  try {
    const voteType = formData.get("voteType") as VoteTypeEnum;
    const sortBy = formData.get("sortBy") as SortByEnum;
    const limit = formData.get("limit");
    const offset = formData.get("offset");
    const { id } = await isAuthenticated();

    const polls = await getPollsWithFilters(
      voteType,
      sortBy,
      Number(limit),
      Number(offset),
      id
    );

    return { polls };
  } catch (err) {
    throw err;
  }
}

export async function fetchDashboardData(): Promise<any> {
  let client;
  const { id } = await isAuthenticated();

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const res1 = await client.query(
      "SELECT username, firstname, lastname, dateofbirth, gender FROM users WHERE users.id  = $1",
      [id]
    );
    const res2 = await client.query(
      "SELECT COUNT(votes) FROM votes WHERE user_id = $1 ",
      [id]
    );

    const res3 = await client.query(
      "SELECT count(polls) FROM polls where userid = $1",
      [id]
    );

    await client.query("COMMIT");
    const userInfo = res1.rows[0];
    const userParticipationInPolls = res2.rows[0].count;
    const createdPollsCount = res3.rows[0].count;

    return {
      userInfo,
      userParticipationInPolls,
      createdPollsCount,
    };
  } catch (err) {
    await client?.query("ROLLBACK");
    throw err;
  } finally {
    client?.release();
  }
}

export const fetchCreatedPolls = async (limit: number, offset: number) => {
  const { id } = await isAuthenticated();
  try {
    const res = await pool.query(
      "SELECT polls.id, title, description, posting_date, expiry_date, type FROM polls WHERE userid = $1 LIMIT $2 OFFSET $3",
      [id, limit, offset]
    );
    const polls = res.rows;
    return { polls };
  } catch (err) {
    throw err;
  }
};

export async function voteAction(formData: FormData) {
  const { id } = await isAuthenticated();
  try {
    const vote = formData.get("vote") as string;
    const pollId = Number(formData.get("pollId"));
    await insertVote(id, pollId, vote);
  } catch (err) {
    throw err;
  }
  redirect("/dashboard");
}

export async function submitPollAction(formData: FormData) {
  try {
    const { id } = await isAuthenticated();

    const payload = {
      type: formData.get("pollType"),
      title: formData.get("pollTitle"),
      description: formData.get("pollDescription"),
      expiryDate: formData.get("expiryDate"),
      userId: id,
      options: formData.get("options") as string,
    } as any;

    await createPoll(payload);
  } catch (err) {
    throw err;
  }
}
