import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import BreadcrumbNavigation from "@/components/molecules/BreadcrumbNavigation";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getTeamWorkspaces, getTeamStats, getTeamMembers } from "@/services/api/teamService";
import { toast } from "react-toastify";

const TeamDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [stats, setStats] = useState({});
  const [recentMembers, setRecentMembers] = useState([]);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [workspacesData, statsData, membersData] = await Promise.all([
        getTeamWorkspaces(),
        getTeamStats(),
        getTeamMembers({ limit: 5 })
      ]);
      
      setWorkspaces(workspacesData);
      setStats(statsData);
      setRecentMembers(membersData);
    } catch (err) {
      setError("Failed to load team data");
      toast.error("Failed to load team dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = () => {
    navigate("/teams/create-workspace");
  };

  const handleManageTeam = () => {
    navigate("/teams/management");
  };

  const handleInviteMembers = () => {
    navigate("/teams/invite");
  };

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/teams/workspace/${workspaceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-darker">
        <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
          <div className="px-6 py-3">
            <BreadcrumbNavigation />
          </div>
        </div>
        <Loading message="Loading your team dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-darker">
        <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
          <div className="px-6 py-3">
            <BreadcrumbNavigation />
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <Error title="Team Dashboard Error" message={error} onRetry={loadTeamData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-darker">
      <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
        <div className="px-6 py-3">
          <BreadcrumbNavigation />
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
              Team Collaboration
            </h1>
            <p className="text-gray-400 text-lg mt-2">
              Manage your underwater photography teams and workspaces
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={handleInviteMembers}>
              <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
              Invite Members
            </Button>
            <Button onClick={handleCreateWorkspace}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-ocean-teal/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Building2" className="w-6 h-6 text-ocean-teal" />
              </div>
              <h3 className="font-semibold text-white mb-1">Workspaces</h3>
              <p className="text-2xl font-bold text-ocean-teal">{stats.totalWorkspaces || 0}</p>
              <p className="text-xs text-gray-400">Active environments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Users" className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Team Members</h3>
              <p className="text-2xl font-bold text-emerald-400">{stats.totalMembers || 0}</p>
              <p className="text-xs text-gray-400">Across all workspaces</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="FolderOpen" className="w-6 h-6 text-coral" />
              </div>
              <h3 className="font-semibold text-white mb-1">Shared Projects</h3>
              <p className="text-2xl font-bold text-coral">{stats.sharedProjects || 0}</p>
              <p className="text-xs text-gray-400">Collaborative work</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Shield" className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Permissions</h3>
              <p className="text-2xl font-bold text-blue-400">{stats.activePermissions || 0}</p>
              <p className="text-xs text-gray-400">Custom access rules</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Workspaces */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Building2" className="w-5 h-5 text-ocean-teal" />
                  <span>Your Workspaces</span>
                </div>
                <Button variant="ghost" size="small" onClick={handleManageTeam}>
                  <ApperIcon name="Settings" className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workspaces.length === 0 ? (
                <Empty
                  icon="Building2"
                  title="No workspaces yet"
                  message="Create your first team workspace to start collaborating on underwater photography projects."
                  actionLabel="Create Workspace"
                  onAction={handleCreateWorkspace}
                />
              ) : (
                <div className="space-y-4">
                  {workspaces.map((workspace) => (
                    <div
                      key={workspace.Id}
                      className="p-4 border border-slate-dark rounded-lg hover:border-ocean-teal/50 transition-all cursor-pointer group"
                      onClick={() => handleWorkspaceClick(workspace.Id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-ocean-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name={workspace.icon || "Building2"} className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-ocean-teal transition-colors">
                              {workspace.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{workspace.description}</p>
                            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Users" className="w-3 h-3" />
                                <span>{workspace.memberCount} members</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="FolderOpen" className="w-3 h-3" />
                                <span>{workspace.projectCount} projects</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Crown" className="w-3 h-3" />
                                <span className="capitalize">{workspace.role}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            workspace.status === 'active' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {workspace.status}
                          </div>
                          <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400 group-hover:text-ocean-teal transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="UserCheck" className="w-5 h-5 text-ocean-teal" />
                <span>Recent Members</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMembers.map((member) => (
                  <div key={member.Id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-ocean-gradient rounded-full flex items-center justify-center text-sm font-medium text-white">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{member.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span className="capitalize">{member.role}</span>
                        <span>•</span>
                        <span>{member.workspaceName}</span>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === 'online' ? 'bg-emerald-400' : 'bg-gray-500'
                    }`} />
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4" onClick={handleManageTeam}>
                  View All Members
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-coral" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="secondary" className="h-auto p-4 flex-col space-y-2" onClick={handleCreateWorkspace}>
                <ApperIcon name="Plus" className="w-8 h-8 text-ocean-teal" />
                <span>Create New Workspace</span>
                <span className="text-xs text-gray-400">Set up team environment</span>
              </Button>
              <Button variant="secondary" className="h-auto p-4 flex-col space-y-2" onClick={handleInviteMembers}>
                <ApperIcon name="UserPlus" className="w-8 h-8 text-emerald-400" />
                <span>Invite Team Members</span>
                <span className="text-xs text-gray-400">Add photographers to workspace</span>
              </Button>
              <Button variant="secondary" className="h-auto p-4 flex-col space-y-2" onClick={handleManageTeam}>
                <ApperIcon name="Settings" className="w-8 h-8 text-coral" />
                <span>Manage Permissions</span>
                <span className="text-xs text-gray-400">Configure access levels</span>
              </Button>
              <Button variant="secondary" className="h-auto p-4 flex-col space-y-2" onClick={() => navigate("/teams/analytics")}>
                <ApperIcon name="BarChart3" className="w-8 h-8 text-blue-400" />
                <span>View Analytics</span>
                <span className="text-xs text-gray-400">Team usage insights</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamDashboardPage;