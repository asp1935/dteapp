import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '../../utils/cn';

const DashboardLayout = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <div 
        className={cn(
          "transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <Topbar />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <footer className="p-4 text-center text-xs text-secondary border-t border-border bg-background">
          &copy; {new Date().getFullYear()} Department of Technical Education. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
