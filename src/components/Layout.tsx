import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  Trophy,
  Search
} from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedCluster: string;
  onClusterChange: (cluster: string) => void;
  children: React.ReactNode;
  isSidebarOpen?: boolean;
}

const CLUSTERS = ["Entrepreneurship", "Marketing", "Finance", "Hospitality", "Business Admin"];

export default function Layout({
  activeTab,
  onTabChange,
  selectedCluster,
  onClusterChange,
  children,
  isSidebarOpen = true
}: LayoutProps) {
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
        onClick={() => onTabChange(id)}
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
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} p-4`}>
        <div className="flex items-center gap-2 px-2 mb-10">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-colors duration-300"
            style={{ backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
          >
            DM
          </div>
          {isSidebarOpen && (
            <span 
              className="text-xl font-black tracking-tight uppercase transition-colors duration-300"
              style={{ color: `var(--cluster-text-${selectedCluster.replace(/\s+/g, '-')})` }}
            >
              DecaMaxxing
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="home" />
          <SidebarItem icon={BookOpen} label="Practice Mode" id="practice" />
          <SidebarItem icon={Target} label="Full Test" id="fullTest" />
          <SidebarItem icon={Trophy} label="Analytics" id="analytics" />
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
          {isSidebarOpen && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-300"
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
            </>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
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

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
