import Questions from './questions';
 
export default function CompetitionPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full h-full max-w-[1200px] flex-col space-y-2.5 p-4 md:-mt-32">
        <Questions/>
        Sample questions from the University of Akron.
      </div>
    </main>
  );
}