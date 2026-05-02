import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { toggleSidebar } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { ROLES } from '../../constants/roles';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const menuItems = {
    [ROLES.ADMIN]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { name: 'User Management', icon: Users, path: '/admin/users' },
    ],
    [ROLES.PRINCIPAL]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/principal/dashboard' },
      { name: 'Faculty', icon: Users, path: '/principal/faculty' },
      { name: 'Interviews', icon: Calendar, path: '/principal/interviews' },
    ],
    [ROLES.RO]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/ro/dashboard' },
    ],
    [ROLES.CANDIDATE]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/candidate/dashboard' },
      { name: 'Job Ads', icon: Briefcase, path: '/candidate/ads' },
      { name: 'Applications', icon: FileText, path: '/candidate/applications' },
    ],
  };

  const currentMenuItems = menuItems[role] || [];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-primary text-white transition-all duration-300 z-50 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {isSidebarOpen && <span className="font-bold text-xl tracking-tight">DTE Portal</span>}
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-2">
        {currentMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center p-3 rounded-lg transition-all group",
              isActive ? "bg-accent text-white" : "hover:bg-white/5 text-white/70 hover:text-white"
            )}
          >
            <item.icon size={22} className={cn("min-w-[24px]", isSidebarOpen && "mr-4")} />
            {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => dispatch(logout())}
          className={cn(
            "flex items-center w-full p-3 rounded-lg text-white/70 hover:text-white hover:bg-red-500/20 transition-all group",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut size={22} className={cn("min-w-[24px]", isSidebarOpen && "mr-4")} />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
