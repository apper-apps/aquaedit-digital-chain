import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const CommunityPage = ({ className }) => {
  const [activeTab, setActiveTab] = useState('featured');

  const tabs = [
    { id: 'featured', label: 'Featured', icon: 'Star' },
    { id: 'recent', label: 'Recent', icon: 'Clock' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'following', label: 'Following', icon: 'Users' }
  ];

  const samplePosts = [
    {
      id: 1,
      author: 'MarinePhotographer',
      title: 'Manta Ray at Socorro Island',
      image: '/api/placeholder/300/200',
      likes: 156,
      comments: 23,
      preset: 'Deep Blue Enhanced'
    },
    {
      id: 2,
      author: 'CoralExplorer',
      title: 'Vibrant Reef Scene',
      image: '/api/placeholder/300/200',
      likes: 89,
      comments: 12,
      preset: 'Coral Pop'
    },
    {
      id: 3,
      author: 'TechDiver',
      title: 'Macro Shot - Nudibranch',
      image: '/api/placeholder/300/200',
      likes: 201,
      comments: 34,
      preset: 'Macro Magic'
    }
  ];

  return (
    <div className={cn("min-h-screen bg-slate-darker p-6", className)}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Community</h1>
            <p className="text-gray-400">Discover amazing underwater photography and share your work</p>
          </div>
          <Button>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Share Photo
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-dark/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-ocean-teal text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-dark"
              )}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-slate-dark relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-teal opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ApperIcon name="Image" className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white truncate">{post.title}</h3>
                  <Button variant="ghost" size="small" className="w-8 h-8 p-0">
                    <ApperIcon name="Heart" className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                  <ApperIcon name="User" className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Heart" className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="MessageCircle" className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="small" className="text-ocean-teal text-xs">
                    {post.preset}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="secondary">
            <ApperIcon name="ChevronDown" className="w-4 h-4 mr-2" />
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;