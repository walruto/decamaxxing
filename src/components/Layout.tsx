import {
  LayoutDashboard,
  BookOpen,
  Target,
  Trophy,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedCluster: string;
  onClusterChange: (cluster: string) => void;
  children: React.ReactNode;
}

const CLUSTERS = ["Entrepreneurship", "Marketing", "Finance", "Hospitality", "Business Admin"];

export default function Layout({
  activeTab,
  onTabChange,
  selectedCluster,
  onClusterChange,
  children
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024); // Show sidebar on larger screens by default
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle window resize to adjust sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true);
        setIsMobileMenuOpen(false);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any; label: string; id: string }) => {
    const isActive = activeTab === id;
    const activeClasses: Record<string, string> = {
      'Entrepreneurship': 'bg-orange-600 text-white shadow-lg shadow-orange-200',
      'Marketing': 'bg-blue-600 text-white shadow-lg shadow-blue-200',
      'Finance': 'bg-green-600 text-white shadow-lg shadow-green-200',
      'Hospitality': 'bg-purple-600 text-white shadow-lg shadow-purple-200',
      'Business Admin': 'bg-red-600 text-white shadow-lg shadow-red-200',
    };

    return (
      <button
        onClick={() => {
          onTabChange(id);
          if (window.innerWidth < 1024) {
            setIsMobileMenuOpen(false);
          }
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? activeClasses[selectedCluster] || activeClasses['Entrepreneurship']
            : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-colors duration-300"
            style={{ backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
          >
            DM
          </div>
          <span
            className="text-lg font-black uppercase transition-colors duration-300"
            style={{ color: `var(--cluster-text-${selectedCluster.replace(/\s+/g, '-')})` }}
          >
            DecaMaxxing
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-all duration-300"
            style={{ background: `linear-gradient(to top right, var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')}), var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})88)` }}
          ></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile when menu is closed */}
        {(isSidebarOpen || isMobileMenuOpen) && (
          <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed lg:relative inset-y-0 z-20 ${
            isMobileMenuOpen && !isSidebarOpen ? 'w-64' : isSidebarOpen ? 'w-64' : 'w-0'
          } lg:w-64 p-4 lg:p-4 overflow-y-auto`}>
            <div className="hidden lg:flex items-center gap-2 px-2 mb-10">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-colors duration-300"
                style={{ backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
              >
                DM
              </div>
              <span
                className="text-xl font-black tracking-tight uppercase transition-colors duration-300"
                style={{ color: `var(--cluster-text-${selectedCluster.replace(/\s+/g, '-')})` }}
              >
                DecaMaxxing
              </span>
            </div>

            <nav className="flex-1 space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" id="home" />
              <SidebarItem icon={BookOpen} label="Practice Mode" id="practice" />
              <SidebarItem icon={Target} label="Full Test" id="fullTest" />
              <SidebarItem icon={Trophy} label="Analytics" id="analytics" />
            </nav>

            <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors duration-300"
                  style={{ backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
                >🔥</div>
                <span className="font-bold text-sm">Keep Learning!</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full w-2/3 transition-colors duration-300"
                  style={{ backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
                ></div>
              </div>
            </div>
          </aside>
        )}

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'ml-0' : ''
        } lg:ml-0`}>
          {/* Desktop Top Navbar - Hidden on mobile */}
          <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 px-8 items-center justify-between">
            <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                className="bg-transparent border-none focus:outline-none text-sm w-64"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {CLUSTERS.map(c => (
                  <button
                    key={c}
                    onClick={() => onClusterChange(c)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      selectedCluster === c ? 'bg-white shadow' : 'text-slate-500'
                    }`}
                    style={selectedCluster === c ? { color: `var(--cluster-text-${c.replace(/\s+/g, '-')})` } : {}}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-bold leading-none">Student</p>
                  <p className="text-xs text-slate-500">DECA Member</p>
                </div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 transition-all duration-300"
                  style={{ background: `linear-gradient(to top right, var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')}), var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})88)` }}
                ></div>
              </div>
            </div>
          </header>

          {/* Mobile Top Navbar - Visible on mobile */}
          <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-xs w-24"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {CLUSTERS.slice(0, 2).map(c => (
                  <button
                    key={c}
                    onClick={() => onClusterChange(c)}
                    className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                      selectedCluster === c ? 'bg-white shadow' : 'text-slate-500'
                    }`}
                    style={selectedCluster === c ? { color: `var(--cluster-text-${c.replace(/\s+/g, '-')}` } : {}}
                  >
                    {c.charAt(0)}
                  </button>
                ))}
                <select
                  value={selectedCluster}
                  onChange={(e) => onClusterChange(e.target.value)}
                  className="bg-slate-100 border-none focus:outline-none text-xs font-bold px-1"
                >
                  {CLUSTERS.slice(2).map(c => (
                    <option key={c} value={c}>{c.charAt(0)}</option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
