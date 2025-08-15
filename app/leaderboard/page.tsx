'use server';

import { fetchTeamsByScore } from "../lib/data";

import { unstable_noStore } from 'next/cache';

export default async function Leaderboard() {
    unstable_noStore();
    const teams = await fetchTeamsByScore();

    return (
        <>
        <div className="w-screen h-screen">
            <h1 className="relative top-8 text-4xl flex flex-col items-center my-auto">Leaderboard</h1>
            <div className="relative top-12 overflow-x:auto; items-center flex flex-col my-auto">
                <table className="w-1/2 divide-y-4 divide-blue-600 text-xl">
                    <thead>
                        <tr className="bg-slate-400">
                            <th className="bg-yellow-400">Place</th>
                            <th className="bg-orange-400">Group</th>
                            <th className="bg-red-400">Score</th>
                        </tr>
                    </thead>
                    <tbody className="bg-blue-100 border-2 divide-x-2 divide-y-2 divide-slate-800">
                        {teams.map((team, index) => {
                            return (
                                <tr key={team.name} className="divide-x-2 divide-slate-800">
                                    <td>{index + 1}</td>
                                    <td>{team.name}</td>
                                    <td>{team.score}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}