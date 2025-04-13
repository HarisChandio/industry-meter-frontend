import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/auth/authSlice";
import { UserRole } from "@/store/slices/auth/authTypes";
import { useState, useEffect } from "react";

// Icons
import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  HardHat,
  Gauge,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  allowedRoles?: UserRole[];
}

// Organized navigation items by category with role-based access
const navItems: {
  main: NavItem[];
  settings: NavItem[];
} = {
  main: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      allowedRoles: ["ADMIN", "MANAGER", "ENGINEER"],
    },
    {
      name: "Managers",
      href: "/managers",
      icon: <Users size={18} />,
      allowedRoles: ["ADMIN"],
    },
    {
      name: "Engineers",
      href: "/engineers",
      icon: <HardHat size={18} />,
      allowedRoles: ["ADMIN", "MANAGER"],
    },
  ],
  settings: [
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings size={18} />,
      allowedRoles: ["ADMIN", "MANAGER", "ENGINEER"],
    },
  ],
};

export default function Sidebar() {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role || "Engineer";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth > 768) {
        setCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/sign-in");
  };

  // Filter navigation items based on user role
  const getFilteredItems = (items: NavItem[]) => {
    return items.filter(
      (item) =>
        !item.allowedRoles || item.allowedRoles.includes(userRole as UserRole)
    );
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Extract this to a component to avoid repetition
  const NavLinks = ({ items, title }: { items: NavItem[]; title?: string }) => {
    const filteredItems = getFilteredItems(items);

    if (filteredItems.length === 0) return null;

    return (
      <div className="mb-6">
        {title && (
          <h2 className="text-xs uppercase text-gray-400 font-semibold px-4 mb-3">
            {title}
          </h2>
        )}
        <nav className="space-y-1 px-2">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors group ${
                  isActive
                    ? "bg-accent-color text-white font-medium"
                    : "text-gray-300 hover:bg-gray-700/70"
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  };

  // Get role color based on user role
  const getRoleColor = () => {
    switch (userRole) {
      case "ADMIN":
        return "bg-red-500";
      case "MANAGER":
        return "bg-blue-500";
      case "ENGINEER":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? collapsed
              ? "hidden"
              : "fixed inset-0 z-40"
            : "w-64 min-h-screen relative"
        } transition-all duration-300 ease-in-out`}
      >
        <div
          className={`${
            isMobile && !collapsed ? "w-64" : "w-full"
          } h-full bg-gray-800 border-r border-gray-700 flex flex-col shadow-xl`}
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-center">
              <Gauge className="mr-2 text-accent-color" size={35} />
              <h1 className="text-xl font-bold">Smart Meter</h1>
            </div>
          </div>

          <div className="py-6 px-2 flex-1 overflow-y-auto">
            <NavLinks items={navItems.main} title="Main" />
            <NavLinks items={navItems.settings} title="Settings" />
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center">
                <div
                  className={`h-9 w-9 ${getRoleColor()} rounded-md flex items-center justify-center truncate text-white font-semibold shadow-md`}
                >
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.username || "User"}
                  </p>
                  <span className="text-xs text-gray-400 flex items-center">
                    <span
                      className={`h-2 w-2 rounded-full ${getRoleColor()} mr-1.5`}
                    ></span>
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white hover:text-red-600"
              >
                <LogOut className="size-5" />
                {/* <span>Logout</span> */}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        ></div>
      )}
    </>
  );
}
