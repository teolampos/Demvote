"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginSchema, User } from "./entities";
import { createUser, getUserByEmail, getUserByUsername } from "./db";
import * as bcrypt from "bcrypt";
import { signToken } from "./helpers";

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
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
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
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
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
