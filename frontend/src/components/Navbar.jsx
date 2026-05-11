import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-heading text-black tracking-tight">TaskBoard</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            Teyzix Core
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-black">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
