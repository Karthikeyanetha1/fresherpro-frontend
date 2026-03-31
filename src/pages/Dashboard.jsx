import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../api/auth';
import { getMyResumes, deleteResume } from '../api/resumes';
import { getMyPortfolio } from '../api/portfolios';
import { FileText, Briefcase, Eye, Plus, LogOut, Trash2, Edit, Download, TrendingUp, Users, Calendar, MoreVertical, Search, Bell } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, resumesRes] = await Promise.all([
        getMe(),
        getMyResumes()
      ]);
      
      setUser(userRes.data.user);
      setResumes(resumesRes.data.resumes);

      try {
        const portfolioRes = await getMyPortfolio();
        setPortfolio(portfolioRes.data.portfolio);
      } catch (err) {
        console.log('No portfolio yet');
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const downloadResumePDF = (resume) => {
    const doc = new jsPDF();
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text(resume.personalInfo.fullName || 'Resume', 20, 25);
    doc.setFontSize(10);
    doc.text(resume.personalInfo.email || '', 20, 33);
    doc.save(`${resume.title}.pdf`);
    toast.success('Resume downloaded!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await deleteResume(id);
      toast.success('Resume deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FresherPro</h1>
              <p className="text-xs text-gray-500">Resume Builder</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('resumes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'resumes'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              My Resumes
              <span className="ml-auto bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                {resumes.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'portfolio'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Portfolio
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resumes, templates..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => navigate('/resume/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  <Plus className="w-4 h-4" />
                  Create New
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {activeTab === 'overview' && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-gray-600">Here's what's happening with your resumes today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      +12%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{resumes.length}</p>
                  <p className="text-sm text-gray-600">Total Resumes</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {portfolio ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{portfolio ? '1' : '0'}</p>
                  <p className="text-sm text-gray-600">Portfolio</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      +8%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{portfolio?.views || 0}</p>
                  <p className="text-sm text-gray-600">Portfolio Views</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Download className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => navigate('/resume/new')}
                  className="group bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 text-left hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                      <Plus className="w-7 h-7 text-white" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">→</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Create New Resume</h3>
                  <p className="text-indigo-100 text-sm">Build ATS-friendly resume with AI assistance</p>
                </button>

                <button
                  onClick={() => navigate('/portfolio/new')}
                  className="group bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 text-left hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                      {portfolio ? <Edit className="w-7 h-7 text-white" /> : <Plus className="w-7 h-7 text-white" />}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">→</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {portfolio ? 'Edit Portfolio' : 'Create Portfolio'}
                  </h3>
                  <p className="text-purple-100 text-sm">Showcase your projects with stunning portfolio</p>
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View All
                  </button>
                </div>
                {resumes.length > 0 ? (
                  <div className="space-y-4">
                    {resumes.slice(0, 3).map((resume) => (
                      <div key={resume._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{resume.title}</p>
                          <p className="text-sm text-gray-500">
                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/resume/${resume._id}`)}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No activity yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'resumes' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">My Resumes</h2>
                  <p className="text-gray-600">Manage and download your documents</p>
                </div>
                <button
                  onClick={() => navigate('/resume/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                >
                  <Plus className="w-5 h-5" />
                  New Resume
                </button>
              </div>

              {resumes.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
                  <p className="text-gray-600 mb-6">Create your first professional resume with AI</p>
                  <button
                    onClick={() => navigate('/resume/new')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Resume
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((resume) => (
                    <div
                      key={resume._id}
                      className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => downloadResumePDF(resume)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/resume/${resume._id}`)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(resume._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                        {resume.personalInfo?.fullName}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(resume.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                          {resume.template}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'portfolio' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Portfolio</h2>
                  <p className="text-gray-600">Showcase your work to the world</p>
                </div>
                {portfolio && (
                  <button
                    onClick={() => navigate('/portfolio/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Portfolio
                  </button>
                )}
              </div>

              {!portfolio ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No portfolio yet</h3>
                  <p className="text-gray-600 mb-6">Create your portfolio to showcase projects</p>
                  <button
                    onClick={() => navigate('/portfolio/new')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                  >
                    <Plus className="w-5 h-5" />
                    Create Portfolio
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{portfolio.personalInfo.fullName}</h3>
                      <p className="text-gray-600 mb-2">{portfolio.personalInfo.tagline}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                          {portfolio.views} views
                        </span>
                        <span className="text-indigo-600 font-medium">
                          fresherpro.com/{portfolio.username}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(`http://localhost:5001/api/portfolios/${portfolio.username}`, '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                    >
                      View Public Portfolio
                    </button>
                    <button
                      onClick={() => navigate('/portfolio/new')}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
