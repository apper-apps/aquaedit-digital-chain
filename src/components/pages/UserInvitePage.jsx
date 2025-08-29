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
  getTeamWorkspaces,
  inviteTeamMember,
  getTeamInvitations,
  acceptTeamInvitation
} from "@/services/api/teamService";
import { toast } from "react-toastify";

const UserInvitePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  
  // Invite form state
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [inviteEmails, setInviteEmails] = useState([""]);
  const [selectedRole, setSelectedRole] = useState("editor");
  const [customMessage, setCustomMessage] = useState("");
  
  // Bulk invite state
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkInvite, setShowBulkInvite] = useState(false);

  useEffect(() => {
    loadInviteData();
    
    // If there's an invite token, handle acceptance
    if (inviteToken) {
      handleAcceptInvitation(inviteToken);
    }
  }, [inviteToken]);

  const loadInviteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const workspacesData = await getTeamWorkspaces();
      setWorkspaces(workspacesData);
      
      if (workspacesData.length > 0) {
        setSelectedWorkspace(workspacesData[0].Id.toString());
        const invitations = await getTeamInvitations(workspacesData[0].Id);
        setPendingInvitations(invitations);
      }
    } catch (err) {
      setError("Failed to load invitation data");
      toast.error("Failed to load workspace data");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (token) => {
    try {
      setLoading(true);
      const member = await acceptTeamInvitation(token);
      toast.success(`Welcome to the team! You've joined as ${member.role}.`);
      navigate('/teams');
    } catch (err) {
      toast.error(err.message || "Failed to accept invitation");
      setError("Invalid or expired invitation link");
    } finally {
      setLoading(false);
    }
  };

  const addEmailField = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const removeEmailField = (index) => {
    if (inviteEmails.length > 1) {
      const newEmails = inviteEmails.filter((_, i) => i !== index);
      setInviteEmails(newEmails);
    }
  };

  const updateEmailField = (index, value) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const handleSendInvitations = async () => {
    const validEmails = inviteEmails.filter(email => email.trim() && email.includes('@'));
    
    if (validEmails.length === 0) {
      toast.error("Please enter at least one valid email address");
      return;
    }
    
    if (!selectedWorkspace) {
      toast.error("Please select a workspace");
      return;
    }

    try {
      setLoading(true);
      
      const invitePromises = validEmails.map(email =>
        inviteTeamMember({
          workspaceId: parseInt(selectedWorkspace),
          email: email.trim(),
          role: selectedRole,
          message: customMessage,
          invitedBy: 1 // Current user ID
        })
      );
      
      await Promise.all(invitePromises);
      
      toast.success(`${validEmails.length} invitation(s) sent successfully!`);
      
      // Reset form
      setInviteEmails([""]);
      setCustomMessage("");
      
      // Reload pending invitations
      const invitations = await getTeamInvitations(parseInt(selectedWorkspace));
      setPendingInvitations(invitations);
      
    } catch (err) {
      toast.error("Failed to send invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkInvite = async () => {
    const emails = bulkEmails
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));
    
    if (emails.length === 0) {
      toast.error("Please enter valid email addresses");
      return;
    }

    try {
      setLoading(true);
      
      const invitePromises = emails.map(email =>
        inviteTeamMember({
          workspaceId: parseInt(selectedWorkspace),
          email,
          role: selectedRole,
          message: customMessage,
          invitedBy: 1
        })
      );
      
      await Promise.all(invitePromises);
      
      toast.success(`${emails.length} bulk invitation(s) sent!`);
      setBulkEmails("");
      setShowBulkInvite(false);
      
      // Reload pending invitations
      const invitations = await getTeamInvitations(parseInt(selectedWorkspace));
      setPendingInvitations(invitations);
      
    } catch (err) {
      toast.error("Failed to send bulk invitations");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { 
      id: 'admin', 
      name: 'Admin', 
      description: 'Can manage team members and workspace settings',
      permissions: ['Manage members', 'Workspace settings', 'All project access', 'Export controls']
    },
    { 
      id: 'editor', 
      name: 'Editor', 
      description: 'Can edit images and manage assigned projects',
      permissions: ['Edit images', 'Assigned projects', 'Apply presets', 'Standard exports']
    },
    { 
      id: 'reviewer', 
      name: 'Reviewer', 
      description: 'Can review and approve work before final export',
      permissions: ['Review projects', 'Approve exports', 'Comment on work', 'View analytics']
    },
    { 
      id: 'viewer', 
      name: 'Viewer', 
      description: 'View-only access to shared projects and images',
      permissions: ['View shared work', 'Download approved images', 'Basic comments']
    }
  ];

  if (loading && !inviteToken) {
    return (
      <div className="min-h-screen bg-slate-darker">
        <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
          <div className="px-6 py-3">
            <BreadcrumbNavigation />
          </div>
        </div>
        <Loading message="Loading invitation system..." />
      </div>
    );
  }

  if (error && !inviteToken) {
    return (
      <div className="min-h-screen bg-slate-darker">
        <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
          <div className="px-6 py-3">
            <BreadcrumbNavigation />
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <Error title="Invitation Error" message={error} onRetry={loadInviteData} />
        </div>
      </div>
    );
  }

  // If processing invite token
  if (inviteToken) {
    return (
      <div className="min-h-screen bg-slate-darker flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            {loading ? (
              <>
                <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <ApperIcon name="UserCheck" className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Processing Invitation...</h2>
                <p className="text-gray-400">Please wait while we add you to the team.</p>
              </>
            ) : error ? (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Invitation Error</h2>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button onClick={() => navigate('/teams')}>
                  Go to Teams
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
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

      <div className="container mx-auto px-6 py-8 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
            Invite Team Members
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Add underwater photographers to your collaborative workspace
          </p>
        </div>

        {/* Workspace Selection */}
        {workspaces.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Building2" className="w-5 h-5 text-ocean-teal" />
                <span>Select Workspace</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
              >
                {workspaces.map(workspace => (
                  <option key={workspace.Id} value={workspace.Id}>
                    {workspace.name} - {workspace.memberCount} members
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Shield" className="w-5 h-5 text-ocean-teal" />
              <span>Select Role</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    selectedRole === role.id
                      ? "border-ocean-teal bg-ocean-teal/10"
                      : "border-slate-dark bg-slate-darker hover:border-ocean-teal/50"
                  )}
                >
                  <h3 className="font-semibold text-white mb-1">{role.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{role.description}</p>
                  <div className="space-y-1">
                    {role.permissions.slice(0, 3).map((permission, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <ApperIcon name="Check" className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-gray-300">{permission}</span>
                      </div>
                    ))}
                    {role.permissions.length > 3 && (
                      <p className="text-xs text-gray-400">+{role.permissions.length - 3} more...</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Individual Invitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-5 h-5 text-ocean-teal" />
                <span>Send Invitations</span>
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowBulkInvite(!showBulkInvite)}
              >
                <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                Bulk Invite
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showBulkInvite ? (
              <>
                <div className="space-y-3">
                  <Label>Email Addresses</Label>
                  {inviteEmails.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={email}
                        onChange={(e) => updateEmailField(index, e.target.value)}
                        className="flex-1"
                      />
                      {inviteEmails.length > 1 && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => removeEmailField(index)}
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={addEmailField}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Another Email
                  </Button>
                </div>

                <div>
                  <Label htmlFor="customMessage">Personal Message (Optional)</Label>
                  <textarea
                    id="customMessage"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Join our underwater photography team! We're excited to collaborate with you..."
                    rows="4"
                    className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal outline-none resize-none mt-1"
                  />
                </div>

                <Button
                  onClick={handleSendInvitations}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Sending Invitations...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                      Send {inviteEmails.filter(e => e.trim()).length} Invitation(s)
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulkEmails">Bulk Email List</Label>
                  <textarea
                    id="bulkEmails"
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="Enter multiple email addresses separated by commas, semicolons, or line breaks:&#10;&#10;photographer1@example.com&#10;photographer2@example.com&#10;editor@divecenter.com"
                    rows="8"
                    className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal outline-none resize-none mt-1"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {bulkEmails.split(/[\n,;]/).filter(email => email.trim() && email.includes('@')).length} valid emails detected
                  </p>
                </div>

                <Button
                  onClick={handleBulkInvite}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Sending Bulk Invitations...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                      Send Bulk Invitations
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Clock" className="w-5 h-5 text-coral" />
                <span>Pending Invitations ({pendingInvitations.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingInvitations.map(invitation => (
                  <div key={invitation.Id} className="flex items-center justify-between p-3 bg-slate-darker rounded-lg">
                    <div>
                      <p className="font-medium text-white">{invitation.email}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span className="capitalize">{invitation.role}</span>
                        <span>•</span>
                        <span>Sent {new Date(invitation.invitedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Expires {new Date(invitation.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-coral/20 text-coral rounded text-xs">
                        Pending
                      </div>
                      <Button variant="ghost" size="small">
                        <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onboarding Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Lightbulb" className="w-5 h-5 text-coral" />
              <span>Onboarding Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Users" className="w-4 h-4 text-ocean-teal" />
                  <span className="font-medium text-white">Team Roles</span>
                </div>
                <p className="text-gray-400">
                  Start with Editor roles for new photographers. Promote to Admin as they prove themselves.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="BookOpen" className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-white">Training Resources</span>
                </div>
                <p className="text-gray-400">
                  New members receive workflow guides and underwater photography tutorials automatically.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Shield" className="w-4 h-4 text-coral" />
                  <span className="font-medium text-white">Permissions</span>
                </div>
                <p className="text-gray-400">
                  Customize access levels for each team member based on their responsibilities and experience.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MessageSquare" className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">Communication</span>
                </div>
                <p className="text-gray-400">
                  Include personal messages in invitations to explain team culture and expectations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInvitePage;