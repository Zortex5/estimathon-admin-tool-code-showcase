'use server';

import { addTeam } from '@/app/lib/data';
import { submitSlip } from '@/app/lib/data';

export async function add_team(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const result = await addTeam(formData);
    if (!result) {
      return "Invalid password.";
    }
    return;
  } catch (error) {
    return 'Something went wrong.';
  }
}

export async function submit_slip(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const result = await submitSlip(formData);
    if (!result) {
      return "Invalid password.";
    }
    return;
  } catch (error) {
    return 'Something went wrong.';
  }
}