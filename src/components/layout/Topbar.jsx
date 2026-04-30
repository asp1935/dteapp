import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, Bell, UserCircle } from 'lucide-react';
import { toggleTheme } from '../../features/ui/uiSlice';
import { cn } from '../../utils/cn';

const Topbar = () => {
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-foreground hidden md:block">
          Welcome, {user?.name}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full hover:bg-muted transition-colors text-secondary"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="p-2 rounded-full hover:bg-muted transition-colors text-secondary relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>

        <div className="flex items-center space-x-3 border-l border-border pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-secondary">{user?.role}</p>
          </div>
          <UserCircle size={32} className="text-secondary" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
