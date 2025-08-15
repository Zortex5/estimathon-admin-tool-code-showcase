'use server';

import SlipForm from './submit-form';
import { fetchUnfinishedTeams } from "@/app/lib/data";
import { unstable_noStore } from 'next/cache';
 
export default async function SubmitPage() {
  unstable_noStore();
  const teams = await fetchUnfinishedTeams();

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <SlipForm teams={teams} />
      </div>
    </main>
  );
}