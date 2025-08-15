export const MAX_SUBMISSIONS = 18;
export const QUESTION_COUNT = 13;

export type Team = {
  id: number;
  name: string;
  submissions: number;
  score: number;
};

export type Slip = {
  team_id: number;
  question_number: number;
  range_min: number;
  range_max: number;
}

export type User = {
  name: string;
  password: string;
}