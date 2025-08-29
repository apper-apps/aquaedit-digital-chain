import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import BreadcrumbNavigation from "@/components/molecules/BreadcrumbNavigation";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { 
  getTeamMembers, 
  getTeamWorkspaces, 
  updateTeamMember, 
  removeTeamMember,
  getAuditLogs,
  inviteTeamMember
} from "@/services/api/teamService";
import { toast } from "react-toastify";

const TeamManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [members, setMembers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  
  // UI states
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'members');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadManagementData();
  }, []);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const loadManagementData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [workspacesData, membersData] = await Promise.all([
        getTeamWorkspaces(),
        getTeamMembers()
      ]);
      
      setWorkspaces(workspacesData);
      setMembers(membersData);
      
      if (workspacesData.length > 0) {
        setSelectedWorkspace(workspacesData[0]);
        const logs = await getAuditLogs(workspacesData[0].Id, { limit: 20 });
        setAuditLogs(logs);
      }
    } catch (err) {
      setError("Failed to load team management data");
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceChange = async (workspaceId) => {
    const workspace = workspaces.find(w => w.Id === workspaceId);
    setSelectedWorkspace(workspace);
    
    try {
      const [workspaceMembers, logs] = await Promise.all([
        getTeamMembers({ workspaceId }),
        getAuditLogs(workspaceId, { limit: 20 })
      ]);
      setMembers(workspaceMembers);
      setAuditLogs(logs);
    } catch (err) {
      toast.error("Failed to load workspace data");
    }
  };

  const handleUpdatePermissions = async (memberId, permissions) => {
    try {
      await updateTeamMember(memberId, { permissions });
      const updatedMembers = await getTeamMembers({ workspaceId: selectedWorkspace.Id });
      setMembers(updatedMembers);
      setShowPermissionModal(false);
      setSelectedMember(null);
      toast.success("Permissions updated successfully");
    } catch (err) {
      toast.error("Failed to update permissions");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await removeTeamMember(memberId);
        const updatedMembers = await getTeamMembers({ workspaceId: selectedWorkspace.Id });
        setMembers(updatedMembers);
        toast.success("Team member removed");
      } catch (err) {
        toast.error(err.message || "Failed to remove team member");
      }
    }
  };

  const handleInviteMember = async (invitationData) => {
    try {
      await inviteTeamMember({
        ...invitationData,
        workspaceId: selectedWorkspace.Id,
        invitedBy: 1 // Current user ID
      });
      setShowInviteModal(false);
      toast.success(`Invitation sent to ${invitationData.email}`);
    } catch (err) {
      toast.error("Failed to send invitation");
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesWorkspace = !selectedWorkspace || member.workspaceId === selectedWorkspace.Id;
    
    return matchesSearch && matchesRole && matchesWorkspace;
  });

  const roles = [
    { id: 'owner', name: 'Owner', description: 'Full workspace control', color: 'text-red-400' },
    { id: 'admin', name: 'Admin', description: 'Manage members and settings', color: 'text-orange-400' },
    { id: 'editor', name: 'Editor', description: 'Edit and export images', color: 'text-blue-400' },
    { id: 'reviewer', name: 'Reviewer', description: 'Review and approve work', color: 'text-green-400' },
    { id: 'viewer', name: 'Viewer', description: 'View-only access', color: 'text-gray-400' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-darker">
        <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
          <div className="px-6 py-3">
            <BreadcrumbNavigation />
          </div>
        </div>
        <Loading message="Loading team management..." />
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
          <Error title="Team Management Error" message={error} onRetry={loadManagementData} />
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
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
              Team Management
            </h1>
            <p className="text-gray-400 text-lg mt-2">
              Manage team members, permissions, and workspace settings
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {workspaces.length > 1 && (
              <select
                value={selectedWorkspace?.Id || ""}
                onChange={(e) => handleWorkspaceChange(parseInt(e.target.value))}
                className="bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
              >
                {workspaces.map(workspace => (
                  <option key={workspace.Id} value={workspace.Id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            )}
            
            <Button onClick={() => setShowInviteModal(true)}>
              <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-dark">
          <nav className="flex space-x-8">
            {[
              { id: 'members', name: 'Team Members', icon: 'Users' },
              { id: 'permissions', name: 'Permissions', icon: 'Shield' },
              { id: 'audit', name: 'Audit Log', icon: 'FileText' },
              { id: 'settings', name: 'Settings', icon: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-3 border-b-2 font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-ocean-teal text-ocean-teal"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                )}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search members by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                  >
                    <option value="all">All Roles</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Team Members ({filteredMembers.length})</span>
                  <Button variant="secondary" size="small" onClick={() => setShowInviteModal(true)}>
                    <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map(member => {
                    const role = roles.find(r => r.id === member.role);
                    return (
                      <div key={member.Id} className="flex items-center justify-between p-4 bg-slate-darker rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-ocean-gradient rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            <p className="text-sm text-gray-400">{member.email}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className={cn("text-xs font-medium px-2 py-1 rounded", 
                                role?.color, "bg-slate-dark"
                              )}>
                                {role?.name}
                              </span>
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                member.status === 'online' ? 'bg-emerald-400' : 'bg-gray-500'
                              )} />
                              <span className="text-xs text-gray-400">
                                {member.status === 'online' ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => {
                              setSelectedMember(member);
                              setShowPermissionModal(true);
                            }}
                          >
                            <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                            Permissions
                          </Button>
                          {member.role !== 'owner' && (
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleRemoveMember(member.Id)}
                            >
                              <ApperIcon name="UserMinus" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'audit' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="FileText" className="w-5 h-5 text-ocean-teal" />
                <span>Audit Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map(log => (
                  <div key={log.Id} className="flex items-start space-x-4 p-3 bg-slate-darker rounded-lg">
                    <div className="w-8 h-8 bg-ocean-teal/20 rounded-full flex items-center justify-center">
                      <ApperIcon name={
                        log.action.includes('member') ? 'User' :
                        log.action.includes('permission') ? 'Shield' :
                        'Activity'
                      } className="w-4 h-4 text-ocean-teal" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{log.details}</p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-400">
                        <span>by {log.userName}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>{log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Permission Modal */}
      {showPermissionModal && selectedMember && (
        <PermissionModal
          member={selectedMember}
          onUpdate={handleUpdatePermissions}
          onClose={() => {
            setShowPermissionModal(false);
            setSelectedMember(null);
          }}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onInvite={handleInviteMember}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

// Permission Modal Component
const PermissionModal = ({ member, onUpdate, onClose }) => {
  const [permissions, setPermissions] = useState(member.permissions);

  const permissionOptions = {
    projectAccess: {
      label: "Project Access",
      options: [
        { value: "none", label: "No Access" },
        { value: "limited", label: "Limited View" },
        { value: "view", label: "View Only" },
        { value: "assigned", label: "Assigned Projects" },
        { value: "full", label: "Full Access" }
      ]
    },
    imageAccess: {
      label: "Image Access",
      options: [
        { value: "none", label: "No Access" },
        { value: "limited", label: "Limited View" },
        { value: "view", label: "View Only" },
        { value: "assigned", label: "Assigned Images" },
        { value: "full", label: "Full Access" }
      ]
    },
    presetAccess: {
      label: "Preset Access",
      options: [
        { value: "none", label: "No Access" },
        { value: "view", label: "View Only" },
        { value: "apply", label: "Apply Presets" },
        { value: "modify", label: "Modify Existing" },
        { value: "full", label: "Create & Modify" }
      ]
    },
    exportAccess: {
      label: "Export Access",
      options: [
        { value: "none", label: "No Export" },
        { value: "standard", label: "Standard Quality" },
        { value: "high", label: "High Quality" },
        { value: "full", label: "All Formats" }
      ]
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Edit Permissions - {member.name}</span>
            <Button variant="ghost" size="small" onClick={onClose}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(permissionOptions).map(([key, config]) => (
            <div key={key}>
              <Label>{config.label}</Label>
              <select
                value={permissions[key]}
                onChange={(e) => setPermissions(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none mt-1"
              >
                {config.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          
          <div className="flex space-x-3 pt-4 border-t border-slate-dark">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => onUpdate(member.Id, permissions)} className="flex-1">
              Update Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Invite Modal Component
const InviteModal = ({ onInvite, onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [message, setMessage] = useState("");

  const roles = [
    { id: 'admin', name: 'Admin' },
    { id: 'editor', name: 'Editor' },
    { id: 'reviewer', name: 'Reviewer' },
    { id: 'viewer', name: 'Viewer' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite({ email, role, message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Invite Team Member</span>
            <Button variant="ghost" size="small" onClick={onClose}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="inviteRole">Role</Label>
              <select
                id="inviteRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
              <textarea
                id="inviteMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Join our underwater photography team..."
                rows="3"
                className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal outline-none resize-none"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                Send Invite
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagementPage;