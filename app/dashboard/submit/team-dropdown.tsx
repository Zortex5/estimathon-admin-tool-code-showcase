'use client';

import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Team } from '@/app/lib/definitions';

export default function TeamDropdown(props: any) {
    return (
        <div className="relative">
            <select name="name" id="name" className='absolute left-0 top-1/2 peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'>
                {
                    props.teams.map((team: Team) => {
                        return (<option value={team.name} key={team.name}>{team.name}</option>);
                    })
                }
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
}