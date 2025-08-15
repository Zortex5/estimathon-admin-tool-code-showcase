'use server';

import { db, sql } from '@vercel/postgres';
import { Team, User, Slip, MAX_SUBMISSIONS, QUESTION_COUNT } from './definitions';
import questions from './questions';
import bcrypt from 'bcrypt';

const client = await db.connect();

export async function authenticate(password: string) {
  try {
    const data = await client.sql<User>`SELECT * FROM estimathon_admins`;
    const admins = data.rows;
    if (data.rowCount == null) {
      console.error('No admins in database.');
      throw new Error('No admins found in database.');
    }
    for (let i = 0; i < data.rowCount; ++i) {
      const compare = await bcrypt.compare(password, admins[i].password);
      console.log(compare);
      if (compare) {
        console.log("Correct password.");
        return true;
      }
    }
    console.log("Wrong password in authenticate.");
    return false;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch admins.');
  }
}

export async function fetchTeams() {
  try {
    const data = await client.sql<Team>`SELECT * FROM estimathon_teams`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch teams.');
  }
}

export async function fetchUnfinishedTeams() {
  try {
    const data = await client.sql<Team>`SELECT * FROM estimathon_teams WHERE slips <= 18`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch teams.');
  }
}

export async function fetchSlips(team_name: string) {
  try {
    const data = await client.sql<Slip>`SELECT * FROM estimathon_slips WHERE team_id IN (SELECT id FROM estimathon_teams WHERE name=${team_name})`;
    console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch team slip submissions.');
  }
}

export async function fetchTeamsByScore() {
  try {
    const data = await client.sql<Team>`SELECT * FROM estimathon_teams ORDER BY score`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch teams by score.');
  }
}

export async function addTeam(formData: FormData) {
  try {
    const team_name = String(formData.get('name'));
    const password = String(formData.get('password'));

    const auth = await authenticate(password);
    if (!auth) {
      console.log("Wrong pass in teams.");
      return false;
    }

    await client.sql`INSERT INTO estimathon_teams (name, slips, score) VALUES (${team_name}, ${0}, ${0})`;
    return true;
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error('Failed to add team.');
  }
}

export async function fetchID(team_name: string) {
  // get team id
  try {
    const ids = await client.sql`SELECT id FROM estimathon_teams WHERE name=${team_name}`;
    console.log("Id: ", ids.rows[0]);
    const id = Number(ids.rows[0].id);
    console.log('Id: %d Name: %s', id, team_name);
    return id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch team ID.');
  }
}

export async function fetchSubmissionCount(team_name: string) {
  // get number of total submissions for a team
  try {
    const slipCounts = await client.sql`SELECT slips FROM estimathon_teams WHERE name=${team_name}`;
    const slip_count = Number(slipCounts.rows[0].slips);
    console.log('Slip Count: ', slip_count);
    return slip_count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch team submission count.');
  }
}

export async function fetchResubmission(team_name: string, question_number: number) {
  // get number of previous submissions to this question
  try {
    const prev_submissions = await client.sql`SELECT COUNT(*) FROM estimathon_slips WHERE team_id IN (SELECT id FROM estimathon_teams WHERE name=${team_name}) AND question_number=${question_number}`;
    const prev_submission = Number(prev_submissions.rows[0].count);
    console.log('Previous Submission Count: ', prev_submission);
    return prev_submission;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch previous submission count for the question.');
  }
}

export async function fetchQuestionsAnswered(team_name: string) {
  // count how many distinct questions a team has answered (duplicate slips already handled during slip submission)
  try {
    const data = await client.sql`SELECT COUNT(*) FROM estimathon_slips WHERE team_id IN (SELECT id FROM estimathon_teams WHERE name=${team_name})`;
    const questionsAnswered = Number(data.rows[0].count);
    return questionsAnswered;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch questions answered.');
  }
}

export async function updateSlip(team_id: number, question_number: number, min: number, max: number) {
  // replace old slip for a question with new one
  try {
    await client.sql`UPDATE estimathon_slips SET range_min=${min}, range_max=${max} WHERE team_id=${team_id} AND question_number=${question_number}`;
    console.log('Updated slip');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to replace old slip of the question with latest slip.');
  }
}

export async function insertSlip(team_id: number, question_number: number, min: number, max: number) {
  try {
    console.log('Inserting ', team_id, question_number, min, max);
    await client.sql`INSERT INTO estimathon_slips (team_id, question_number, range_min, range_max) VALUES (${team_id}, ${question_number}, ${min}, ${max})`;
    console.log('Inserted slip');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert slip.');
  }
}

export async function incrementSubmissions(team_id: number, slip_count: number) {
  // increment submission count
  try {
    await client.sql`UPDATE estimathon_teams SET slips=${slip_count + 1} WHERE id=${team_id}`;
    console.log('Incremented slips');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to increment submission count.');
  }
}

export async function updateScore(team_id: number, score: number) {
  // change team's score after a regrade
  try {
    await client.sql`UPDATE estimathon_teams SET score=${score} WHERE id=${team_id}`;
    console.log('Updated score to ', score);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update score.');
  }
}

export async function submitSlip(formData: FormData) {
  try {
    const team_name = String(formData.get('name'));
    const question_number = Number(formData.get('question_number'));
    const min = Number(formData.get('answer_min'));
    const max = Number(formData.get('answer_max'));
    const password = String(formData.get('password'));

    const auth = await authenticate(password);
    if (!auth) {
      console.log("Wrong pass in slips.");
      return false;
    }

    console.log("Team Name: ", team_name);
    console.log("Question Number: ", question_number);
    console.log("Range Min: ", min);
    console.log("Range Max: ", max);

    // fetch all data in parallel
    let [team_id, slip_count, prev_submissions, slips, questionsAnswered] = await Promise.all([
      fetchID(team_name),
      fetchSubmissionCount(team_name),
      fetchResubmission(team_name, question_number),
      fetchSlips(team_name),
      fetchQuestionsAnswered(team_name)
    ]).then((values) => {return values});

    console.log("Slips: ", slips);

    team_id = Number(team_id);
    slip_count = Number(slip_count);
    prev_submissions = Number(prev_submissions);
    questionsAnswered = Number(questionsAnswered);

    console.log("Team ID: ", team_id);
    console.log("Slip Count: ", slip_count);
    console.log("Previous Submissions: ", prev_submissions);
    console.log("Questions Answered: ", questionsAnswered);

    // prevent team from going over max allowed submissions
    if (slip_count > MAX_SUBMISSIONS) throw new Error('This team has reached the maximum allowed number of submissions.');

    // add new slip to database or replace previous entry if duplicate answer to a question
    if (prev_submissions > 0) {
      await Promise.all([
        updateSlip(team_id, question_number, min, max),
        incrementSubmissions(team_id, slip_count)
      ]);
    }
    else {
      await Promise.all([
        insertSlip(team_id, question_number, min, max),
        incrementSubmissions(team_id, slip_count)
      ])
    }

    console.log("Incremented slip count");

    // grade team, score update handled in grade()
    await grade(team_id, slips, question_number, min, max);
    return true;
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error('Failed to submit slip.');
  }
}

export async function grade(team_id: number, slips: Slip[], question_number: number, min: number, max: number) {
  // regrade the team by estimathon grading rules
  console.log("Grading", question_number);

  let score = 0.0;
  let good_intervals = 0;

  slips.forEach((slip: Slip) => {
    console.log("Grading question ", slip.question_number);
    let answer = questions[slip.question_number - 1].answer;
    if (slip.range_min <= answer && answer <= slip.range_max) {
      score += Math.floor(slip.range_max / slip.range_min);
      good_intervals++;
      console.log("Correct");
    }
  });

  let answer = questions[question_number - 1].answer;
  if (min <= answer && answer <= max) {
    score += Math.floor(max / min);
    good_intervals++;
  }

  score += 10;
  score *= Math.pow(2, QUESTION_COUNT - good_intervals);

  console.log("Score is: ", score);

  await updateScore(team_id, Math.round(score));
}