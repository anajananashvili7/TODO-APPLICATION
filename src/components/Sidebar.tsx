import Link from 'next/link';
import { SunIcon, StarIcon, CheckCircleIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

interface SidebarProps {
  currentPage: string;
  onLinkClick: () => void;
}

const Sidebar = ({ currentPage, onLinkClick }: SidebarProps) => {
  const linkClasses = 'flex items-center space-x-2 text-gray-800 hover:text-gray-600 cursor-pointer p-2 rounded-md';
  const activeTextClasses = 'bg-gray-200 px-2 py-1 rounded'; 
  

  return (
    <aside className="fixed top-0 left-0 w-64 bg-[#F6F6F7] min-h-screen h-full p-4 pt-6 border-r border-gray-300 transition-transform duration-300 ease-in-out md:relative md:w-64 md:block z-20">
      <Link href="/" passHref>
        <div className={linkClasses} onClick={onLinkClick}>
          <SunIcon className="w-6 h-6" />
          <span className={currentPage === '/' ? activeTextClasses : ''}>My Day</span>
        </div>
      </Link>
      <Link href="/important" passHref>
        <div className={linkClasses} onClick={onLinkClick}>
          <StarIcon className="w-6 h-6" />
          <span className={currentPage === '/important' ? activeTextClasses : ''}>Important</span>
        </div>
      </Link>
      <Link href="/complete" passHref>
        <div className={linkClasses} onClick={onLinkClick}>
          <CheckCircleIcon className="w-6 h-6" />
          <span className={currentPage === '/complete' ? activeTextClasses : ''}>Completed</span>
        </div>
      </Link>
      <Link href="/dashboard" passHref>
        <div className={linkClasses} onClick={onLinkClick}>
          <Squares2X2Icon className="w-6 h-6" />
          <span className={currentPage === '/dashboard' ? activeTextClasses : ''}>Dashboard</span>
        </div>
      </Link>
    </aside>
  );
};

export default Sidebar;
