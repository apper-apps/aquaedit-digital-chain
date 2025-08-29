import { delay } from "./projectService";

// Mock data for team workspaces
let teamWorkspaces = [
  {
    Id: 1,
    name: "Coral Dive Center",
    description: "Professional diving operation specializing in underwater photography tours and training.",
    operationType: "dive-center",
    teamSize: "medium",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    ownerId: 1,
    memberCount: 8,
    projectCount: 23,
    role: "owner",
    icon: "Building2",
    branding: {
      primaryColor: "#0d9488",
      secondaryColor: "#f59e0b",
      logoUrl: null
    },
    settings: {
      exportStandards: "high-quality",
      qualityRequirements: "professional",
      approvalWorkflow: true
    }
  },
  {
    Id: 2,
    name: "Marine Photography Studio",
    description: "Award-winning underwater photographers creating stunning marine life portfolios.",
    operationType: "photography-business",
    teamSize: "small",
    status: "active",
    createdAt: "2024-02-10T14:20:00Z",
    ownerId: 1,
    memberCount: 4,
    projectCount: 15,
    role: "admin",
    icon: "Camera",
    branding: {
      primaryColor: "#1e3a8a",
      secondaryColor: "#f59e0b",
      logoUrl: null
    },
    settings: {
      exportStandards: "print-ready",
      qualityRequirements: "commercial",
      approvalWorkflow: true
    }
  }
];

// Mock data for team members
let teamMembers = [
  {
    Id: 1,
    name: "Sarah Thompson",
    email: "sarah@coraldive.com",
    role: "owner",
    workspaceId: 1,
    workspaceName: "Coral Dive Center",
    status: "online",
    joinedAt: "2024-01-15T10:30:00Z",
    lastActive: "2024-03-15T16:45:00Z",
    permissions: {
      projectAccess: "full",
      imageAccess: "full",
      presetAccess: "full",
      exportAccess: "full",
      adminAccess: "full"
    },
    profile: {
      specialization: "Cave Diving Photography",
      certification: "PADI Instructor",
      avatar: null,
      bio: "20+ years underwater photography experience"
    }
  },
  {
    Id: 2,
    name: "Mike Rodriguez",
    email: "mike@coraldive.com",
    role: "admin",
    workspaceId: 1,
    workspaceName: "Coral Dive Center",
    status: "offline",
    joinedAt: "2024-01-20T09:15:00Z",
    lastActive: "2024-03-14T18:20:00Z",
    permissions: {
      projectAccess: "full",
      imageAccess: "full",
      presetAccess: "modify",
      exportAccess: "full",
      adminAccess: "partial"
    },
    profile: {
      specialization: "Macro Photography",
      certification: "PADI Advanced Open Water",
      avatar: null,
      bio: "Specialized in marine life macro photography"
    }
  },
  {
    Id: 3,
    name: "Emma Wilson",
    email: "emma@marinestudio.com",
    role: "editor",
    workspaceId: 2,
    workspaceName: "Marine Photography Studio",
    status: "online",
    joinedAt: "2024-02-12T11:30:00Z",
    lastActive: "2024-03-15T15:10:00Z",
    permissions: {
      projectAccess: "assigned",
      imageAccess: "assigned",
      presetAccess: "apply",
      exportAccess: "standard",
      adminAccess: "none"
    },
    profile: {
      specialization: "Color Correction",
      certification: "Adobe Certified Expert",
      avatar: null,
      bio: "Expert in underwater color correction and enhancement"
    }
  }
];

// Mock data for team invitations
let teamInvitations = [
  {
    Id: 1,
    workspaceId: 1,
    email: "newdiver@example.com",
    role: "editor",
    status: "pending",
    invitedBy: 1,
    invitedAt: "2024-03-10T10:00:00Z",
    expiresAt: "2024-03-17T10:00:00Z",
    token: "inv_abc123"
  }
];

// Mock data for audit logs
let auditLogs = [
  {
    Id: 1,
    workspaceId: 1,
    userId: 1,
    userName: "Sarah Thompson",
    action: "member_invited",
    details: "Invited newdiver@example.com as Editor",
    timestamp: "2024-03-10T10:00:00Z",
    ipAddress: "192.168.1.1"
  },
  {
    Id: 2,
    workspaceId: 1,
    userId: 2,
    userName: "Mike Rodriguez",
    action: "permission_changed",
    details: "Updated Emma Wilson's preset permissions from 'view' to 'apply'",
    timestamp: "2024-03-09T14:30:00Z",
    ipAddress: "192.168.1.2"
  }
];

// Workspace management functions
export const getTeamWorkspaces = async () => {
  await delay(300);
  return [...teamWorkspaces];
};

export const getTeamWorkspaceById = async (id) => {
  await delay(250);
  const workspace = teamWorkspaces.find(w => w.Id === parseInt(id));
  if (!workspace) {
    throw new Error(`Workspace with Id ${id} not found`);
  }
  return { ...workspace };
};

export const createTeamWorkspace = async (workspaceData) => {
  await delay(500);
  const highestId = Math.max(...teamWorkspaces.map(w => w.Id), 0);
  const newWorkspace = {
    Id: highestId + 1,
    ...workspaceData,
    status: "active",
    createdAt: new Date().toISOString(),
    memberCount: 1,
    projectCount: 0,
    role: "owner",
    icon: workspaceData.operationType === "dive-center" ? "Building2" : 
          workspaceData.operationType === "photography-business" ? "Camera" :
          workspaceData.operationType === "research-team" ? "Microscope" : "Users"
  };
  teamWorkspaces.push(newWorkspace);
  
  // Create owner as first member
  const ownerId = Math.max(...teamMembers.map(m => m.Id), 0) + 1;
  teamMembers.push({
    Id: ownerId,
    name: "Workspace Owner",
    email: workspaceData.adminEmail,
    role: "owner",
    workspaceId: newWorkspace.Id,
    workspaceName: newWorkspace.name,
    status: "online",
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    permissions: {
      projectAccess: "full",
      imageAccess: "full",
      presetAccess: "full",
      exportAccess: "full",
      adminAccess: "full"
    },
    profile: {
      specialization: "",
      certification: "",
      avatar: null,
      bio: ""
    }
  });
  
  return { ...newWorkspace };
};

export const updateTeamWorkspace = async (id, workspaceData) => {
  await delay(400);
  const index = teamWorkspaces.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Workspace with Id ${id} not found`);
  }
  teamWorkspaces[index] = {
    ...teamWorkspaces[index],
    ...workspaceData,
    updatedAt: new Date().toISOString()
  };
  return { ...teamWorkspaces[index] };
};

export const deleteTeamWorkspace = async (id) => {
  await delay(300);
  const index = teamWorkspaces.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Workspace with Id ${id} not found`);
  }
  
  // Remove workspace and associated data
  teamWorkspaces.splice(index, 1);
  teamMembers = teamMembers.filter(m => m.workspaceId !== parseInt(id));
  teamInvitations = teamInvitations.filter(i => i.workspaceId !== parseInt(id));
  auditLogs = auditLogs.filter(l => l.workspaceId !== parseInt(id));
  
  return true;
};

// Team member management functions
export const getTeamMembers = async (filters = {}) => {
  await delay(300);
  let filteredMembers = [...teamMembers];
  
  if (filters.workspaceId) {
    filteredMembers = filteredMembers.filter(m => m.workspaceId === filters.workspaceId);
  }
  
  if (filters.role) {
    filteredMembers = filteredMembers.filter(m => m.role === filters.role);
  }
  
  if (filters.limit) {
    filteredMembers = filteredMembers.slice(0, filters.limit);
  }
  
  return filteredMembers;
};

export const getTeamMemberById = async (id) => {
  await delay(200);
  const member = teamMembers.find(m => m.Id === parseInt(id));
  if (!member) {
    throw new Error(`Team member with Id ${id} not found`);
  }
  return { ...member };
};

export const updateTeamMember = async (id, memberData) => {
  await delay(350);
  const index = teamMembers.findIndex(m => m.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Team member with Id ${id} not found`);
  }
  
  teamMembers[index] = {
    ...teamMembers[index],
    ...memberData,
    updatedAt: new Date().toISOString()
  };
  
  // Log permission changes
  if (memberData.permissions) {
    const logId = Math.max(...auditLogs.map(l => l.Id), 0) + 1;
    auditLogs.push({
      Id: logId,
      workspaceId: teamMembers[index].workspaceId,
      userId: 1, // Current user - would be from context
      userName: "Current User",
      action: "permission_changed",
      details: `Updated ${teamMembers[index].name}'s permissions`,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1"
    });
  }
  
  return { ...teamMembers[index] };
};

export const removeTeamMember = async (id) => {
  await delay(300);
  const index = teamMembers.findIndex(m => m.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Team member with Id ${id} not found`);
  }
  
  const member = teamMembers[index];
  if (member.role === "owner") {
    throw new Error("Cannot remove workspace owner");
  }
  
  teamMembers.splice(index, 1);
  
  // Log member removal
  const logId = Math.max(...auditLogs.map(l => l.Id), 0) + 1;
  auditLogs.push({
    Id: logId,
    workspaceId: member.workspaceId,
    userId: 1, // Current user
    userName: "Current User",
    action: "member_removed",
    details: `Removed ${member.name} from workspace`,
    timestamp: new Date().toISOString(),
    ipAddress: "127.0.0.1"
  });
  
  return true;
};

// Team invitation functions
export const inviteTeamMember = async (invitationData) => {
  await delay(400);
  const invitationId = Math.max(...teamInvitations.map(i => i.Id), 0) + 1;
  const invitation = {
    Id: invitationId,
    ...invitationData,
    status: "pending",
    invitedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    token: `inv_${Math.random().toString(36).substring(2)}`
  };
  
  teamInvitations.push(invitation);
  
  // Log invitation
  const logId = Math.max(...auditLogs.map(l => l.Id), 0) + 1;
  auditLogs.push({
    Id: logId,
    workspaceId: invitation.workspaceId,
    userId: invitation.invitedBy,
    userName: "Current User",
    action: "member_invited",
    details: `Invited ${invitation.email} as ${invitation.role}`,
    timestamp: new Date().toISOString(),
    ipAddress: "127.0.0.1"
  });
  
  return { ...invitation };
};

export const getTeamInvitations = async (workspaceId) => {
  await delay(250);
  return teamInvitations.filter(i => i.workspaceId === workspaceId);
};

export const acceptTeamInvitation = async (token) => {
  await delay(300);
  const invitation = teamInvitations.find(i => i.token === token);
  if (!invitation) {
    throw new Error("Invalid invitation token");
  }
  
  if (invitation.status !== "pending") {
    throw new Error("Invitation already processed");
  }
  
  if (new Date(invitation.expiresAt) < new Date()) {
    throw new Error("Invitation has expired");
  }
  
  // Create new team member
  const memberId = Math.max(...teamMembers.map(m => m.Id), 0) + 1;
  const workspace = teamWorkspaces.find(w => w.Id === invitation.workspaceId);
  
  const newMember = {
    Id: memberId,
    name: "New Member", // Would be filled from user registration
    email: invitation.email,
    role: invitation.role,
    workspaceId: invitation.workspaceId,
    workspaceName: workspace?.name || "",
    status: "online",
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    permissions: getDefaultPermissions(invitation.role),
    profile: {
      specialization: "",
      certification: "",
      avatar: null,
      bio: ""
    }
  };
  
  teamMembers.push(newMember);
  
  // Update invitation status
  invitation.status = "accepted";
  invitation.acceptedAt = new Date().toISOString();
  
  // Update workspace member count
  if (workspace) {
    workspace.memberCount = teamMembers.filter(m => m.workspaceId === workspace.Id).length;
  }
  
  return { ...newMember };
};

// Statistics and analytics functions
export const getTeamStats = async () => {
  await delay(200);
  return {
    totalWorkspaces: teamWorkspaces.length,
    totalMembers: teamMembers.length,
    sharedProjects: teamWorkspaces.reduce((total, w) => total + (w.projectCount || 0), 0),
    activePermissions: teamMembers.filter(m => m.permissions).length
  };
};

export const getWorkspaceAnalytics = async (workspaceId) => {
  await delay(300);
  const workspace = teamWorkspaces.find(w => w.Id === parseInt(workspaceId));
  const members = teamMembers.filter(m => m.workspaceId === parseInt(workspaceId));
  
  return {
    memberActivity: members.map(m => ({
      memberId: m.Id,
      name: m.name,
      role: m.role,
      lastActive: m.lastActive,
      status: m.status
    })),
    roleDistribution: {
      owner: members.filter(m => m.role === "owner").length,
      admin: members.filter(m => m.role === "admin").length,
      editor: members.filter(m => m.role === "editor").length,
      reviewer: members.filter(m => m.role === "reviewer").length,
      viewer: members.filter(m => m.role === "viewer").length
    },
    projectCount: workspace?.projectCount || 0,
    storageUsage: Math.floor(Math.random() * 1000), // Mock data
    monthlyActivity: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      edits: Math.floor(Math.random() * 50),
      uploads: Math.floor(Math.random() * 20),
      exports: Math.floor(Math.random() * 30)
    })).reverse()
  };
};

// Audit log functions
export const getAuditLogs = async (workspaceId, filters = {}) => {
  await delay(250);
  let filteredLogs = auditLogs.filter(l => l.workspaceId === workspaceId);
  
  if (filters.action) {
    filteredLogs = filteredLogs.filter(l => l.action === filters.action);
  }
  
  if (filters.userId) {
    filteredLogs = filteredLogs.filter(l => l.userId === filters.userId);
  }
  
  if (filters.limit) {
    filteredLogs = filteredLogs.slice(0, filters.limit);
  }
  
  return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Helper function for default permissions
const getDefaultPermissions = (role) => {
  const permissionSets = {
    owner: {
      projectAccess: "full",
      imageAccess: "full",
      presetAccess: "full",
      exportAccess: "full",
      adminAccess: "full"
    },
    admin: {
      projectAccess: "full",
      imageAccess: "full",
      presetAccess: "modify",
      exportAccess: "full",
      adminAccess: "partial"
    },
    editor: {
      projectAccess: "assigned",
      imageAccess: "assigned",
      presetAccess: "apply",
      exportAccess: "standard",
      adminAccess: "none"
    },
    reviewer: {
      projectAccess: "view",
      imageAccess: "view",
      presetAccess: "view",
      exportAccess: "none",
      adminAccess: "none"
    },
    viewer: {
      projectAccess: "limited",
      imageAccess: "limited",
      presetAccess: "view",
      exportAccess: "none",
      adminAccess: "none"
    }
  };
  
  return permissionSets[role] || permissionSets.viewer;
};