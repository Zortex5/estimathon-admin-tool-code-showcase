import Link from 'next/link';

  const links = [
    {
      key: 'home',
      name: 'Home',
      href: '/dashboard',
    },
    {
      key: 'competition',
      name: 'Competition Questions',
      href: '/dashboard/competition',
    },
    {
      key: 'teams',
      name: 'Add Team',
      href: '/dashboard/teams',
    },
    {
      key: 'slips',
      name: 'Submit Slips',
      href: '/dashboard/submit',
    }
  ];
  
  export default function NavLinks() {
    return (
      <>
        {links.map((link) => {
          return (
            <Link
              key={link.key}
              href={link.href}
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
        <Link
          key={'Leaderboard'}
          href={'/leaderboard'}
          className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          target="_blank"
        >
          <p className="hidden md:block">{'Leaderboard'}</p>
        </Link>
      </>
    );
  }
  