import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

// Team Workspaces Service - Uses team_workspaces_c table
export const getTeamWorkspaces = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('team_workspaces_c', {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "operation_type_c"}},
        {"field": {"Name": "team_size_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "member_count_c"}},
        {"field": {"Name": "project_count_c"}},
        {"field": {"Name": "icon_c"}},
        {"field": {"Name": "branding_primary_color_c"}},
        {"field": {"Name": "branding_secondary_color_c"}},
        {"field": {"Name": "branding_logo_url_c"}},
        {"field": {"Name": "settings_export_standards_c"}},
        {"field": {"Name": "settings_quality_requirements_c"}},
        {"field": {"Name": "settings_approval_workflow_c"}}
      ],
      orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
    });

    if (!response.success) {
      console.error(`Failed to fetch team workspaces:`, response);
      toast.error(response.message);
      return [];
    }

    return response.data?.map(workspace => ({
      Id: workspace.Id,
      name: workspace.name_c,
      description: workspace.description_c,
      operationType: workspace.operation_type_c,
      teamSize: workspace.team_size_c,
      status: workspace.status_c,
      createdAt: workspace.CreatedOn,
      memberCount: workspace.member_count_c || 0,
      projectCount: workspace.project_count_c || 0,
      role: "owner", // Would be determined by current user
      icon: workspace.icon_c || "Building2",
      branding: {
        primaryColor: workspace.branding_primary_color_c,
        secondaryColor: workspace.branding_secondary_color_c,
        logoUrl: workspace.branding_logo_url_c
      },
      settings: {
        exportStandards: workspace.settings_export_standards_c,
        qualityRequirements: workspace.settings_quality_requirements_c,
        approvalWorkflow: workspace.settings_approval_workflow_c
      }
    })) || [];
  } catch (error) {
    console.error("Error fetching team workspaces:", error?.response?.data?.message || error);
    return [];
  }
};

export const getTeamWorkspaceById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('team_workspaces_c', parseInt(id), {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "operation_type_c"}},
        {"field": {"Name": "team_size_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "member_count_c"}},
        {"field": {"Name": "project_count_c"}},
        {"field": {"Name": "icon_c"}}
      ]
    });

    if (!response.success) {
      console.error(`Failed to fetch workspace with Id: ${id}:`, response);
      toast.error(response.message);
      return null;
    }

    const workspace = response.data;
    return {
      Id: workspace.Id,
      name: workspace.name_c,
      description: workspace.description_c,
      operationType: workspace.operation_type_c,
      teamSize: workspace.team_size_c,
      status: workspace.status_c,
      memberCount: workspace.member_count_c || 0,
      projectCount: workspace.project_count_c || 0,
      icon: workspace.icon_c || "Building2"
    };
  } catch (error) {
    console.error(`Error fetching workspace ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const createTeamWorkspace = async (workspaceData) => {
  try {
    const apperClient = getApperClient();
    const icon = workspaceData.operationType === "dive-center" ? "Building2" : 
                 workspaceData.operationType === "photography-business" ? "Camera" :
                 workspaceData.operationType === "research-team" ? "Microscope" : "Users";

    const params = {
      records: [{
        name_c: workspaceData.name,
        description_c: workspaceData.description || '',
        operation_type_c: workspaceData.operationType,
        team_size_c: workspaceData.teamSize,
        status_c: "active",
        member_count_c: 1,
        project_count_c: 0,
        icon_c: icon,
        branding_primary_color_c: workspaceData.branding?.primaryColor || "#0d9488",
        branding_secondary_color_c: workspaceData.branding?.secondaryColor || "#f59e0b",
        settings_export_standards_c: workspaceData.settings?.exportStandards || "high-quality",
        settings_quality_requirements_c: workspaceData.settings?.qualityRequirements || "professional",
        settings_approval_workflow_c: workspaceData.settings?.approvalWorkflow || true
      }]
    };

    const response = await apperClient.createRecord('team_workspaces_c', params);

    if (!response.success) {
      console.error(`Failed to create workspace:`, response);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      if (successful.length > 0) {
        const newWorkspace = successful[0].data;
        toast.success(`Workspace "${newWorkspace.name_c}" created successfully!`);
        return {
          Id: newWorkspace.Id,
          name: newWorkspace.name_c,
          description: newWorkspace.description_c,
          operationType: newWorkspace.operation_type_c,
          teamSize: newWorkspace.team_size_c,
          status: newWorkspace.status_c,
          createdAt: newWorkspace.CreatedOn,
          memberCount: 1,
          projectCount: 0,
          role: "owner",
          icon: icon
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating workspace:", error?.response?.data?.message || error);
    return null;
  }
};

export const updateTeamWorkspace = async (id, workspaceData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Id: parseInt(id),
        name_c: workspaceData.name,
        description_c: workspaceData.description,
        operation_type_c: workspaceData.operationType,
        team_size_c: workspaceData.teamSize,
        status_c: workspaceData.status
      }]
    };

    const response = await apperClient.updateRecord('team_workspaces_c', params);

    if (!response.success) {
      console.error(`Failed to update workspace:`, response);
      toast.error(response.message);
      return null;
    }

    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error("Error updating workspace:", error?.response?.data?.message || error);
    return null;
  }
};

export const deleteTeamWorkspace = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('team_workspaces_c', {
      RecordIds: [parseInt(id)]
    });

    if (!response.success) {
      console.error(`Failed to delete workspace:`, response);
      toast.error(response.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting workspace:", error?.response?.data?.message || error);
    return false;
  }
};

// Team Members Service - Uses team_members_c table
export const getTeamMembers = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    let where = [];
    
    if (filters.workspaceId) {
      where.push({
        "FieldName": "workspace_id_c",
        "Operator": "EqualTo",
        "Values": [filters.workspaceId],
        "Include": true
      });
    }

    if (filters.role) {
      where.push({
        "FieldName": "role_c",
        "Operator": "EqualTo",
        "Values": [filters.role],
        "Include": true
      });
    }

    const params = {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "role_c"}},
        {"field": {"Name": "workspace_id_c"}},
        {"field": {"Name": "workspace_name_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "joined_at_c"}},
        {"field": {"Name": "last_active_c"}},
        {"field": {"Name": "permissions_project_access_c"}},
        {"field": {"Name": "permissions_image_access_c"}},
        {"field": {"Name": "permissions_preset_access_c"}},
        {"field": {"Name": "permissions_export_access_c"}},
        {"field": {"Name": "permissions_admin_access_c"}},
        {"field": {"Name": "profile_specialization_c"}},
        {"field": {"Name": "profile_certification_c"}},
        {"field": {"Name": "profile_bio_c"}}
      ],
      where,
      pagingInfo: filters.limit ? {"limit": filters.limit, "offset": 0} : undefined
    };

    const response = await apperClient.fetchRecords('team_members_c', params);

    if (!response.success) {
      console.error(`Failed to fetch team members:`, response);
      return [];
    }

    return response.data?.map(member => ({
      Id: member.Id,
      name: member.name_c,
      email: member.email_c,
      role: member.role_c,
      workspaceId: member.workspace_id_c,
      workspaceName: member.workspace_name_c,
      status: member.status_c,
      joinedAt: member.joined_at_c,
      lastActive: member.last_active_c,
      permissions: {
        projectAccess: member.permissions_project_access_c,
        imageAccess: member.permissions_image_access_c,
        presetAccess: member.permissions_preset_access_c,
        exportAccess: member.permissions_export_access_c,
        adminAccess: member.permissions_admin_access_c
      },
      profile: {
        specialization: member.profile_specialization_c,
        certification: member.profile_certification_c,
        avatar: member.profile_avatar_c,
        bio: member.profile_bio_c
      }
    })) || [];
  } catch (error) {
    console.error("Error fetching team members:", error?.response?.data?.message || error);
    return [];
  }
};

export const getTeamMemberById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('team_members_c', parseInt(id), {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "role_c"}},
        {"field": {"Name": "workspace_id_c"}},
        {"field": {"Name": "permissions_project_access_c"}},
        {"field": {"Name": "permissions_image_access_c"}},
        {"field": {"Name": "permissions_preset_access_c"}},
        {"field": {"Name": "permissions_export_access_c"}},
        {"field": {"Name": "permissions_admin_access_c"}}
      ]
    });

    if (!response.success) {
      console.error(`Failed to fetch team member with Id: ${id}:`, response);
      toast.error(response.message);
      return null;
    }

    const member = response.data;
    return {
      Id: member.Id,
      name: member.name_c,
      email: member.email_c,
      role: member.role_c,
      workspaceId: member.workspace_id_c,
      permissions: {
        projectAccess: member.permissions_project_access_c,
        imageAccess: member.permissions_image_access_c,
        presetAccess: member.permissions_preset_access_c,
        exportAccess: member.permissions_export_access_c,
        adminAccess: member.permissions_admin_access_c
      }
    };
  } catch (error) {
    console.error(`Error fetching team member ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const updateTeamMember = async (id, memberData) => {
  try {
    const apperClient = getApperClient();
    const updateData = {
      Id: parseInt(id)
    };

    // Map permissions if provided
    if (memberData.permissions) {
      updateData.permissions_project_access_c = memberData.permissions.projectAccess;
      updateData.permissions_image_access_c = memberData.permissions.imageAccess;
      updateData.permissions_preset_access_c = memberData.permissions.presetAccess;
      updateData.permissions_export_access_c = memberData.permissions.exportAccess;
      updateData.permissions_admin_access_c = memberData.permissions.adminAccess;
    }

    // Map other fields
    if (memberData.name) updateData.name_c = memberData.name;
    if (memberData.email) updateData.email_c = memberData.email;
    if (memberData.role) updateData.role_c = memberData.role;

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord('team_members_c', params);

    if (!response.success) {
      console.error(`Failed to update team member:`, response);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      if (successful.length > 0) {
        toast.success("Permissions updated successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error updating team member:", error?.response?.data?.message || error);
    return null;
  }
};

export const removeTeamMember = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('team_members_c', {
      RecordIds: [parseInt(id)]
    });

    if (!response.success) {
      console.error(`Failed to remove team member:`, response);
      toast.error(response.message);
      return false;
    }

    toast.success("Team member removed");
    return true;
  } catch (error) {
    console.error("Error removing team member:", error?.response?.data?.message || error);
    return false;
  }
};

// Team Invitations Service - Uses team_invitations_c table
export const inviteTeamMember = async (invitationData) => {
  try {
    const apperClient = getApperClient();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const params = {
      records: [{
        workspace_id_c: invitationData.workspaceId,
        email_c: invitationData.email,
        role_c: invitationData.role,
        status_c: "pending",
        invited_by_c: invitationData.invitedBy || 1,
        invited_at_c: new Date().toISOString(),
        expires_at_c: expiresAt.toISOString(),
        token_c: `inv_${Math.random().toString(36).substring(2)}`
      }]
    };

    const response = await apperClient.createRecord('team_invitations_c', params);

    if (!response.success) {
      console.error(`Failed to create invitation:`, response);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      if (successful.length > 0) {
        const invitation = successful[0].data;
        toast.success(`Invitation sent to ${invitationData.email}`);
        return {
          Id: invitation.Id,
          workspaceId: invitation.workspace_id_c,
          email: invitation.email_c,
          role: invitation.role_c,
          status: invitation.status_c,
          invitedBy: invitation.invited_by_c,
          invitedAt: invitation.invited_at_c,
          expiresAt: invitation.expires_at_c,
          token: invitation.token_c
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating invitation:", error?.response?.data?.message || error);
    return null;
  }
};

export const getTeamInvitations = async (workspaceId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('team_invitations_c', {
      fields: [
        {"field": {"Name": "workspace_id_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "role_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "invited_at_c"}},
        {"field": {"Name": "expires_at_c"}}
      ],
      where: [{
        "FieldName": "workspace_id_c",
        "Operator": "EqualTo",
        "Values": [workspaceId],
        "Include": true
      }]
    });

    if (!response.success) {
      console.error(`Failed to fetch invitations:`, response);
      return [];
    }

    return response.data?.map(invitation => ({
      Id: invitation.Id,
      workspaceId: invitation.workspace_id_c,
      email: invitation.email_c,
      role: invitation.role_c,
      status: invitation.status_c,
      invitedAt: invitation.invited_at_c,
      expiresAt: invitation.expires_at_c
    })) || [];
  } catch (error) {
    console.error("Error fetching invitations:", error?.response?.data?.message || error);
    return [];
  }
};

export const acceptTeamInvitation = async (token) => {
  try {
    const apperClient = getApperClient();
    
    // First, find the invitation by token
    const invitationResponse = await apperClient.fetchRecords('team_invitations_c', {
      fields: [
        {"field": {"Name": "workspace_id_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "role_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "expires_at_c"}}
      ],
      where: [{
        "FieldName": "token_c",
        "Operator": "EqualTo",
        "Values": [token],
        "Include": true
      }]
    });

    if (!invitationResponse.success || !invitationResponse.data?.length) {
      throw new Error("Invalid invitation token");
    }

    const invitation = invitationResponse.data[0];
    
    if (invitation.status_c !== "pending") {
      throw new Error("Invitation already processed");
    }

    if (new Date(invitation.expires_at_c) < new Date()) {
      throw new Error("Invitation has expired");
    }

    // Update invitation status to accepted
    const updateResponse = await apperClient.updateRecord('team_invitations_c', {
      records: [{
        Id: invitation.Id,
        status_c: "accepted"
      }]
    });

    if (!updateResponse.success) {
      throw new Error("Failed to update invitation status");
    }

    toast.success("Invitation accepted successfully");
    return {
      email: invitation.email_c,
      role: invitation.role_c,
      workspaceId: invitation.workspace_id_c
    };
  } catch (error) {
    console.error("Error accepting invitation:", error?.response?.data?.message || error);
    throw error;
  }
};

// Statistics and analytics
export const getTeamStats = async () => {
  try {
    const [workspacesData, membersData] = await Promise.all([
      getTeamWorkspaces(),
      getTeamMembers()
    ]);

    return {
      totalWorkspaces: workspacesData.length,
      totalMembers: membersData.length,
      sharedProjects: workspacesData.reduce((total, w) => total + (w.projectCount || 0), 0),
      activePermissions: membersData.filter(m => m.permissions).length
    };
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return {
      totalWorkspaces: 0,
      totalMembers: 0,
      sharedProjects: 0,
      activePermissions: 0
    };
  }
};

// Audit logs - Uses audit_logs_c table
export const getAuditLogs = async (workspaceId, filters = {}) => {
  try {
    const apperClient = getApperClient();
    let where = [{
      "FieldName": "workspace_id_c",
      "Operator": "EqualTo",
      "Values": [workspaceId],
      "Include": true
    }];

    if (filters.action) {
      where.push({
        "FieldName": "action_c",
        "Operator": "EqualTo",
        "Values": [filters.action],
        "Include": true
      });
    }

    if (filters.userId) {
      where.push({
        "FieldName": "user_id_c",
        "Operator": "EqualTo",
        "Values": [filters.userId],
        "Include": true
      });
    }

    const params = {
      fields: [
        {"field": {"Name": "workspace_id_c"}},
        {"field": {"Name": "user_id_c"}},
        {"field": {"Name": "user_name_c"}},
        {"field": {"Name": "action_c"}},
        {"field": {"Name": "details_c"}},
        {"field": {"Name": "timestamp_c"}},
        {"field": {"Name": "ip_address_c"}}
      ],
      where,
      orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
      pagingInfo: filters.limit ? {"limit": filters.limit, "offset": 0} : undefined
    };

    const response = await apperClient.fetchRecords('audit_logs_c', params);

    if (!response.success) {
      console.error(`Failed to fetch audit logs:`, response);
      return [];
    }

    return response.data?.map(log => ({
      Id: log.Id,
      workspaceId: log.workspace_id_c,
      userId: log.user_id_c,
      userName: log.user_name_c,
      action: log.action_c,
      details: log.details_c,
      timestamp: log.timestamp_c,
      ipAddress: log.ip_address_c
    })) || [];
  } catch (error) {
    console.error("Error fetching audit logs:", error?.response?.data?.message || error);
    return [];
  }
};