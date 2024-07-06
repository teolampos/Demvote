import { boolean, z } from "zod";

export const User = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.string(),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof User>;

export enum ButtonTypeEnum {
  LOGIN = "Login",
  SIGN_UP = "Sign up",
}

export enum VoteTypeEnum {
  VOTED = "voted",
  UNVOTED = "unvoted",
}
export enum SortByEnum {
  NEWEST = "newest",
  OLDEST = "oldest",
  MOST_VOTES = "mostVotes",
  LEAST_VOTES = "leastVotes",
  EXPIRED = "expired",
  NOT_EXPIRED = "notExpired",
}

export enum PollTypeEnum {
  SIMPLE_VOTING = "simpleVoting",
  REFERENDUM = "referendum",
}

export type PollFilters = {
  voteType: VoteTypeEnum;
  sortBy: SortByEnum;
};

export type Option = {
  id: string;
  title: string;
};

export type Poll = {
  id?: string;
  type: PollTypeEnum;
  title: string;
  description: string;
  postingDate: string;
  expiryDate: string;
  options: { id: string; title: string }[];
  userId: string;
  expired?: boolean;
};
