'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  NumberedListIcon,
  CalculatorIcon,
  InboxArrowDownIcon,
  KeyIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import TeamDropdown from '@/app/dashboard/submit/team-dropdown';
import { submit_slip } from '@/app/lib/actions';
import { useActionState } from 'react';
 
export default function SlipForm(props: any) {
  const [errorMessage, formAction, isPending] = useActionState(
    submit_slip,
    undefined,
  );
 
  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-12 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Submit a Slip
        </h1>
        <div className="relative w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Team Name
            </label>
            <TeamDropdown teams={props.teams}/>
          </div>
        </div>
        <div className="relative top-12 w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="question_number"
            >
              Question Number
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="question_number"
                type="number"
                name="question_number"
                placeholder="Enter question number"
                required
                minLength={1}
                min={1}
                max={13}
              />
              <NumberedListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="relative top-12 w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="answer_min"
            >
              Minimum
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="answer_min"
                type="number"
                name="answer_min"
                placeholder="Start of range"
                required
                minLength={1}
                min={1}
              />
              <CalculatorIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="relative top-12 w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="answer_max"
            >
              Maximum
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="answer_max"
                type="number"
                name="answer_max"
                placeholder="End of range"
                required
                minLength={1}
                min={1}
              />
              <CalculatorIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="relative top-12 w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
                minLength={1}
              />
              <KeyIcon className="pointer-events-none absolute top-[10px] left-3 h-[18px] w-[18px]text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="relative top-14 mt-4 w-full" aria-disabled={isPending}>
          Submit Slip
          <InboxArrowDownIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="relative top-12 flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}