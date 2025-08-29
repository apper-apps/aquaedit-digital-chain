import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import BreadcrumbNavigation from "@/components/molecules/BreadcrumbNavigation";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { createTeamWorkspace } from "@/services/api/teamService";
import { toast } from "react-toastify";

const TeamWorkspaceCreationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [workspaceData, setWorkspaceData] = useState({
    // Step 1: Basic Information
    name: "",
    description: "",
    operationType: "dive-center",
    teamSize: "small",
    
    // Step 2: Branding
    logoUrl: "",
    primaryColor: "#0d9488",
    secondaryColor: "#f59e0b",
    
    // Step 3: Settings
    defaultPresets: [],
    exportStandards: "high-quality",
    qualityRequirements: "professional",
    approvalWorkflow: true,
    
    // Step 4: Initial Team
    adminEmail: "",
    inviteEmails: [""]
  });

  const totalSteps = 4;

  const operationTypes = [
    { id: "dive-center", name: "Dive Center", description: "Commercial diving operation", icon: "Building2" },
    { id: "photography-business", name: "Photography Business", description: "Professional underwater photographer", icon: "Camera" },
    { id: "research-team", name: "Research Team", description: "Marine biology or conservation", icon: "Microscope" },
    { id: "enthusiast-group", name: "Enthusiast Group", description: "Hobbyist diving community", icon: "Users" }
  ];

  const teamSizes = [
    { id: "small", name: "Small Team", description: "2-5 members", icon: "Users" },
    { id: "medium", name: "Medium Team", description: "6-15 members", icon: "Users" },
    { id: "large", name: "Large Organization", description: "16+ members", icon: "Building" }
  ];

  const handleInputChange = (field, value) => {
    setWorkspaceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setWorkspaceData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addInviteEmail = () => {
    setWorkspaceData(prev => ({
      ...prev,
      inviteEmails: [...prev.inviteEmails, ""]
    }));
  };

  const removeInviteEmail = (index) => {
    if (workspaceData.inviteEmails.length > 1) {
      setWorkspaceData(prev => ({
        ...prev,
        inviteEmails: prev.inviteEmails.filter((_, i) => i !== index)
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      setLoading(true);
      const workspace = await createTeamWorkspace(workspaceData);
      toast.success(`Workspace "${workspace.name}" created successfully!`);
      navigate("/teams");
    } catch (error) {
      toast.error("Failed to create workspace");
      console.error("Workspace creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return workspaceData.name.trim() && workspaceData.description.trim();
      case 2:
        return true; // Branding is optional
      case 3:
        return true; // Settings have defaults
      case 4:
        return workspaceData.adminEmail.trim();
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="workspaceName">Workspace Name *</Label>
              <Input
                id="workspaceName"
                placeholder="e.g., Coral Dive Center, Marine Photography Studio"
                value={workspaceData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                className="flex min-h-20 w-full rounded-lg border border-slate-dark bg-slate-darker px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your underwater photography team and goals..."
                value={workspaceData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div>
              <Label>Operation Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {operationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange("operationType", type.id)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      workspaceData.operationType === type.id
                        ? "border-ocean-teal bg-ocean-teal/10"
                        : "border-slate-dark bg-slate-darker hover:border-ocean-teal/50"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-ocean-teal/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name={type.icon} className="w-4 h-4 text-ocean-teal" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{type.name}</h3>
                        <p className="text-xs text-gray-400">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Team Size</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {teamSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleInputChange("teamSize", size.id)}
                    className={cn(
                      "p-4 rounded-lg border text-center transition-all",
                      workspaceData.teamSize === size.id
                        ? "border-ocean-teal bg-ocean-teal/10"
                        : "border-slate-dark bg-slate-darker hover:border-ocean-teal/50"
                    )}
                  >
                    <div className="w-8 h-8 bg-ocean-teal/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name={size.icon} className="w-4 h-4 text-ocean-teal" />
                    </div>
                    <h3 className="font-medium text-white text-sm">{size.name}</h3>
                    <p className="text-xs text-gray-400">{size.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="logoUpload">Workspace Logo</Label>
              <div className="mt-2 border-2 border-dashed border-slate-dark rounded-lg p-6 text-center hover:border-ocean-teal/50 transition-colors cursor-pointer">
                <ApperIcon name="Upload" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Click to upload logo or drag & drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG up to 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="color"
                    id="primaryColor"
                    value={workspaceData.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    className="w-16 h-10 border border-slate-dark rounded-lg bg-slate-darker cursor-pointer"
                  />
                  <Input
                    value={workspaceData.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    placeholder="#0d9488"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={workspaceData.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    className="w-16 h-10 border border-slate-dark rounded-lg bg-slate-darker cursor-pointer"
                  />
                  <Input
                    value={workspaceData.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    placeholder="#f59e0b"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-darker rounded-lg border border-slate-dark">
              <h3 className="font-medium text-white mb-3">Preview</h3>
              <div 
                className="p-4 rounded-lg text-white text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${workspaceData.primaryColor} 0%, ${workspaceData.secondaryColor} 100%)` 
                }}
              >
                <div className="font-semibold">{workspaceData.name || "Your Workspace"}</div>
                <div className="text-sm opacity-80 mt-1">{workspaceData.description || "Workspace preview"}</div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Export Standards</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {[
                  { id: "web-optimized", name: "Web Optimized", description: "JPEG, sRGB, 1920px" },
                  { id: "high-quality", name: "High Quality", description: "TIFF, Adobe RGB, 4K" },
                  { id: "print-ready", name: "Print Ready", description: "TIFF, ProPhoto RGB, 300 DPI" }
                ].map((standard) => (
                  <button
                    key={standard.id}
                    onClick={() => handleInputChange("exportStandards", standard.id)}
                    className={cn(
                      "p-4 rounded-lg border text-center transition-all",
                      workspaceData.exportStandards === standard.id
                        ? "border-ocean-teal bg-ocean-teal/10"
                        : "border-slate-dark bg-slate-darker hover:border-ocean-teal/50"
                    )}
                  >
                    <h3 className="font-medium text-white text-sm">{standard.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{standard.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Quality Requirements</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {[
                  { id: "standard", name: "Standard", description: "Basic quality control" },
                  { id: "professional", name: "Professional", description: "Advanced quality checks" },
                  { id: "commercial", name: "Commercial", description: "Strict quality standards" }
                ].map((quality) => (
                  <button
                    key={quality.id}
                    onClick={() => handleInputChange("qualityRequirements", quality.id)}
                    className={cn(
                      "p-4 rounded-lg border text-center transition-all",
                      workspaceData.qualityRequirements === quality.id
                        ? "border-ocean-teal bg-ocean-teal/10"
                        : "border-slate-dark bg-slate-darker hover:border-ocean-teal/50"
                    )}
                  >
                    <h3 className="font-medium text-white text-sm">{quality.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{quality.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Workflow Settings</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="approvalWorkflow"
                    checked={workspaceData.approvalWorkflow}
                    onChange={(e) => handleInputChange("approvalWorkflow", e.target.checked)}
                    className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                  />
                  <Label htmlFor="approvalWorkflow">Require approval for final exports</Label>
                </div>
                <p className="text-xs text-gray-400 ml-6">
                  All exported images must be approved by workspace owners or admins
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="adminEmail">Your Email Address *</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@example.com"
                value={workspaceData.adminEmail}
                onChange={(e) => handleInputChange("adminEmail", e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">You will be the workspace owner</p>
            </div>

            <div>
              <Label>Invite Initial Team Members (Optional)</Label>
              <div className="space-y-3 mt-2">
                {workspaceData.inviteEmails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="team-member@example.com"
                      value={email}
                      onChange={(e) => handleArrayInputChange("inviteEmails", index, e.target.value)}
                    />
                    {workspaceData.inviteEmails.length > 1 && (
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => removeInviteEmail(index)}
                      >
                        <ApperIcon name="X" className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="secondary" size="small" onClick={addInviteEmail}>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Another Email
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Invitation emails will be sent once the workspace is created
              </p>
            </div>

            <div className="p-4 bg-ocean-teal/10 border border-ocean-teal/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Info" className="w-4 h-4 text-ocean-teal" />
                <span className="font-medium text-ocean-teal">Workspace Summary</span>
              </div>
              <div className="space-y-1 text-sm text-gray-300">
                <p><strong>Name:</strong> {workspaceData.name}</p>
                <p><strong>Type:</strong> {operationTypes.find(t => t.id === workspaceData.operationType)?.name}</p>
                <p><strong>Team Size:</strong> {teamSizes.find(s => s.id === workspaceData.teamSize)?.name}</p>
                <p><strong>Initial Members:</strong> {workspaceData.inviteEmails.filter(email => email.trim()).length + 1}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Basic Information",
    "Branding & Customization",
    "Workspace Settings",
    "Team Setup"
  ];

  return (
    <div className="min-h-screen bg-slate-darker">
      <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
        <div className="px-6 py-3">
          <BreadcrumbNavigation />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-ocean-teal bg-clip-text text-transparent">
            Create Team Workspace
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Set up your collaborative underwater photography environment
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                index + 1 < currentStep
                  ? "bg-ocean-teal text-white"
                  : index + 1 === currentStep
                    ? "bg-ocean-teal/20 text-ocean-teal border-2 border-ocean-teal"
                    : "bg-slate-dark text-gray-400 border border-slate-dark"
              )}>
                {index + 1 < currentStep ? (
                  <ApperIcon name="Check" className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < totalSteps - 1 && (
                <div className={cn(
                  "w-16 h-0.5 mx-2 transition-all",
                  index + 1 < currentStep ? "bg-ocean-teal" : "bg-slate-dark"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Settings" className="w-5 h-5 text-ocean-teal" />
              <span>Step {currentStep}: {stepTitles[currentStep - 1]}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-dark">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleCreateWorkspace}
                  disabled={!isStepValid() || loading}
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Creating Workspace...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                      Create Workspace
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                  <ApperIcon name="ChevronRight" className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamWorkspaceCreationPage;