import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import SingleUploadModal from '@/components/molecules/SingleUploadModal';
import { toast } from 'react-toastify';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileUpload = async (files) => {
    if (files.length > 0) {
      // Navigate to editor with the uploaded file
      navigate('/editor', { 
        state: { 
          uploadedFiles: files 
        } 
      });
    }
  };

  const features = [
    {
      icon: "Waves",
      title: "Underwater Specialized",
      description: "Professional tools designed specifically for underwater photography with advanced color correction algorithms."
    },
    {
      icon: "Palette",
      title: "Professional Presets",
      description: "Curated collection of underwater presets for different diving conditions, depths, and lighting scenarios."
    },
    {
      icon: "Layers",
      title: "Advanced Masking",
      description: "Precision masking tools with AI-powered subject detection for coral, fish, and underwater scenes."
    },
    {
      icon: "Zap",
      title: "Real-time Performance",
      description: "Optimized single-image workflow for smooth editing experience across desktop and mobile browsers."
    },
    {
      icon: "Image",
      title: "RAW Support",
      description: "Full support for professional camera RAW formats including DNG, CR2, NEF, and ARW files."
    },
    {
      icon: "Sparkles",
      title: "AI Enhancement",
      description: "Intelligent underwater condition analysis with automatic color cast correction and clarity enhancement."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Martinez",
      role: "Marine Photographer",
      content: "AquaEdit Pro transformed my underwater workflow. The specialized tools make color correction effortless.",
      image: "🤿"
    },
    {
      name: "David Chen",
      role: "Diving Instructor",
      content: "The single-image focus means I can quickly edit my dive photos without performance issues on any device.",
      image: "📸"
    },
    {
      name: "Maria Santos",
      role: "Underwater Filmmaker",
      content: "Professional-grade results with an intuitive interface. Perfect for both beginners and pros.",
      image: "🎬"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-darker">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-ocean-gradient rounded-2xl flex items-center justify-center">
                <ApperIcon name="Waves" className="w-10 h-10 text-white animate-float" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-ocean-teal to-coral bg-clip-text text-transparent">
              AquaEdit Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Professional underwater photo editing tools designed for diving photographers who demand excellence
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="large" 
              className="text-lg px-8 py-4"
              onClick={() => setShowUploadModal(true)}
            >
              <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
              Start Editing Now
            </Button>
            <Button 
              variant="secondary" 
              size="large" 
              className="text-lg px-8 py-4"
              onClick={() => navigate('/presets')}
            >
              <ApperIcon name="Palette" className="w-5 h-5 mr-2" />
              Explore Presets
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-ocean-teal">50+</div>
              <div className="text-gray-400">Professional Presets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral">100%</div>
              <div className="text-gray-400">Browser Compatible</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ocean-teal">⚡</div>
              <div className="text-gray-400">Real-time Editing</div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-ocean-teal/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-coral/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-ocean-deep/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-dark/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for Underwater Photography
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Every tool and feature is specifically designed to bring out the best in your underwater captures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:border-ocean-teal/50 transition-all duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple Three-Step Process
            </h2>
            <p className="text-lg text-gray-400">
              From upload to export in minutes, not hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Upload Your Photo</h3>
              <p className="text-gray-400">
                Drag and drop your underwater photo. Supports JPEG, PNG, and all major RAW formats.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-coral-gradient rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Edit with Precision</h3>
              <p className="text-gray-400">
                Apply professional underwater presets or fine-tune with advanced editing tools.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Export & Share</h3>
              <p className="text-gray-400">
                Export in high quality with custom watermarks and metadata preservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-slate-dark/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Underwater Photographers
            </h2>
            <p className="text-lg text-gray-400">
              See what professionals are saying about AquaEdit Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:border-ocean-teal/50 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-ocean-gradient rounded-full flex items-center justify-center">
                      <span className="text-2xl">{testimonial.image}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-ocean-teal">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-400 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-ocean-gradient/10 border-ocean-teal/20">
            <CardContent className="p-12 space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Ready to Transform Your Underwater Photos?
              </h2>
              <p className="text-lg text-gray-300">
                Join thousands of diving photographers who trust AquaEdit Pro for their editing needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="large" 
                  className="text-lg px-8 py-4"
                  onClick={() => setShowUploadModal(true)}
                >
                  <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
                  Upload Your First Photo
                </Button>
                <Button 
                  variant="secondary" 
                  size="large" 
                  className="text-lg px-8 py-4"
                  onClick={() => navigate('/gallery')}
                >
                  <ApperIcon name="Images" className="w-5 h-5 mr-2" />
                  View Sample Gallery
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upload Modal */}
      <SingleUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default LandingPage;