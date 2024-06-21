import { cookies } from "next/headers";
import * as jose from "jose";

export async function signToken(payload: any) {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

  const alg = "HS256";
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .sign(secret);

  return jwt;
}

export async function isAuthenticated(): Promise<any> {
  try {
    const token = cookies().get("SESSION_INFO")?.value;
    if (!token) return false;

    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    if (payload) {
      return payload;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}
