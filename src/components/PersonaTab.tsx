import React from 'react';
import { User, Star, Briefcase, GraduationCap } from 'lucide-react';

const PersonaTab: React.FC = () => {
  const idealSkills = [
    { name: 'React', importance: 5, required: true },
    { name: 'TypeScript', importance: 4, required: true },
    { name: 'Node.js', importance: 4, required: false },
    { name: 'Python', importance: 3, required: false },
    { name: 'SQL', importance: 4, required: true },
    { name: 'AWS', importance: 3, required: false }
  ];

  const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Ideal Candidate Profile */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Ideal Candidate Profile</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Experience Requirements */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900">Experience Requirements</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Minimum Experience:</span>
                <span className="ml-2 text-sm text-gray-600">0-2 years</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Preferred Experience:</span>
                <span className="ml-2 text-sm text-gray-600">1-3 years</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Industry Experience:</span>
                <span className="ml-2 text-sm text-gray-600">Technology, Startups</span>
              </div>
            </div>
          </div>

          {/* Education Requirements */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900">Education Requirements</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Minimum Education:</span>
                <span className="ml-2 text-sm text-gray-600">Bachelor's Degree</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Preferred Field:</span>
                <span className="ml-2 text-sm text-gray-600">Computer Science, Engineering</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Additional Certifications:</span>
                <span className="ml-2 text-sm text-gray-600">Python, Java, AWS, React, Any relevant tech certifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills Matrix & Importance</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Skill</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Importance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Required</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Proficiency Level</th>
              </tr>
            </thead>
            <tbody>
              {idealSkills.map((skill, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StarRating rating={skill.importance} />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      skill.required 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {skill.required ? 'Required' : 'Preferred'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {skill.importance >= 4 ? 'Advanced' : skill.importance >= 3 ? 'Intermediate' : 'Beginner'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cultural Fit Criteria */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultural Fit Criteria</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Personality Traits</h4>
            <div className="space-y-2">
              {['Self-motivated', 'Team player', 'Problem solver', 'Adaptable', 'Detail-oriented'].map((trait, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{trait}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Work Style Preferences</h4>
            <div className="space-y-2">
              {['Remote-friendly', 'Collaborative', 'Independent', 'Growth-oriented', 'Innovation-focused'].map((style, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{style}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Reset to Default
        </button>
        <button className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm">
          Save Persona
        </button>
      </div>
    </div>
  );
};

export default PersonaTab;