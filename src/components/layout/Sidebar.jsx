import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  BookOpen,
  Calendar, 
  LogOut,
  Sparkles,
  ClipboardList,
  School,
  Calculator,
  UserCheck,
  Award
} from 'lucide-react';
import { setSidebar } from '../../features/ui/uiSlice';
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
      { name: 'Courses', icon: GraduationCap, path: '/admin/courses' },
      { name: 'Institutes', icon: Building2, path: '/admin/institutes' },
      { name: 'Advertisements', icon: FileText, path: '/admin/ads' },
      { name: 'Billing', icon: Briefcase, path: '/admin/billing' },
      { name: 'Faculty Calculator', icon: Calculator, path: '/admin/ai-assistant' },
    ],
    [ROLES.PRINCIPAL]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/principal/dashboard' },
      { name: 'Faculty', icon: Users, path: '/principal/faculty' },
      { name: 'Vacancy Assessment', icon: UserCheck, path: '/principal/vacancies' },
      { name: 'Candidate Selection', icon: Award, path: '/principal/selection' },
      { name: 'Applications', icon: FileText, path: '/principal/applications' },
      { name: 'Interviews', icon: Calendar, path: '/principal/interviews' },
      { name: 'Work Logs', icon: ClipboardList, path: '/principal/work-logs' },
      { name: 'Billing', icon: Briefcase, path: '/principal/billing' },
    ],
    [ROLES.RO]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/ro/dashboard' },
    ],
    [ROLES.CANDIDATE]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/candidate/dashboard' },
      { name: 'Job Ads', icon: Briefcase, path: '/candidate/ads' },
      { name: 'Applications', icon: FileText, path: '/candidate/applications' },
    ],
    [ROLES.FACULTY]: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/faculty/dashboard' },
      { name: 'Timetable', icon: Calendar, path: '/faculty/timetable' },
      { name: 'Work Logs', icon: ClipboardList, path: '/faculty/dashboard' },
    ],
  };

  const currentMenuItems = menuItems[role] || [];
  const isExpanded = isSidebarOpen;

  return (
    <aside 
      onMouseEnter={() => dispatch(setSidebar(true))}
      onMouseLeave={() => dispatch(setSidebar(false))}
      className={cn(
        "fixed left-0 top-0 h-full bg-primary text-white transition-all duration-500 ease-in-out z-50 flex flex-col shadow-2xl",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex items-center h-16 border-b border-white/10 overflow-hidden">
        <div className="min-w-[32px] flex justify-center">
          <School size={24} className="text-accent" />
        </div>
        <span className={cn(
          "ml-4 font-bold text-lg tracking-tight transition-all duration-500 whitespace-nowrap",
          isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
        )}>
          DTE Portal
        </span>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {currentMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center p-3 rounded-lg transition-all duration-300 group overflow-hidden",
              isActive ? "bg-accent text-white shadow-lg" : "hover:bg-white/10 text-white/70 hover:text-white"
            )}
          >
            <div className="min-w-[24px] flex justify-center">
              <item.icon size={22} />
            </div>
            <span className={cn(
              "ml-4 font-medium whitespace-nowrap transition-all duration-500",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="h-12 border-t border-white/10 flex items-center px-4">
        <button 
          onClick={() => dispatch(logout())}
          className="flex items-center w-full p-3 rounded-lg text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-300 group overflow-hidden"
        >
          <div className="min-w-[24px] flex justify-center text-red-400 group-hover:text-white transition-colors">
            <LogOut size={22} />
          </div>
          <span className={cn(
            "ml-4 font-medium transition-all duration-500",
            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
          )}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
