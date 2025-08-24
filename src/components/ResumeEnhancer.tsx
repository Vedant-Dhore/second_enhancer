import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, CheckCircle, XCircle, RotateCcw, User, Mail, Phone, Linkedin, Github, GraduationCap, Briefcase, Code, Trophy, FileText, Save } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  jobId: string;
  stage: string;
  matchPercentage?: number;
  status: string;
  avatar?: string;
  skills: string[];
  fitmentScore: number;
  fitmentSummary: string;
  profileImage: string;
  statusColor: string;
}

interface ResumeEnhancerProps {
  candidate?: Candidate;
  onSave?: (candidateId: string, newScore: number, enhancedResume?: any) => void;
  onClose: () => void;
}

const ResumeEnhancer: React.FC<ResumeEnhancerProps> = ({ candidate, onSave, onClose }) => {
  const [currentFitmentScore, setCurrentFitmentScore] = useState(candidate?.fitmentScore || 85);
  const [enhancedSections, setEnhancedSections] = useState<{[key: string]: any}>({});
  const [sectionStates, setSectionStates] = useState<{[key: string]: 'accepted' | 'rejected' | 'editing' | 'original'}>({});
  const [editingContent, setEditingContent] = useState<{[key: string]: any}>({});
  const [projectHyperlinks, setProjectHyperlinks] = useState<{[key: string]: string}>({});
  const [sectionScoreImpacts, setSectionScoreImpacts] = useState<{[key: string]: number}>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Get resume data for the candidate
  const getResumeData = () => {
    if (!candidate) {
      return {
        name: "Sample Candidate",
        email: "sample@email.com",
        contact: "+91 9876543210",
        linkedin: "linkedin.com/in/sample",
        github: "github.com/sample",
        education: "Bachelor of Computer Science, Sample University (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Developed a Blood Bank Management System using Java and MySQL",
          "Created responsive web interfaces using HTML, CSS, and JavaScript"
        ],
        skills: ["Java", "React", "SQL"],
        projects: [
          "Blood Bank Management System - Java application with database integration",
          "E-commerce Website - Frontend development with responsive design"
        ],
        achievements: [
          "Dean's List for 2 consecutive semesters",
          "Winner of College Technical Fest 2023"
        ]
      };
    }

    const candidateResumes: { [key: string]: any } = {
      '1': {
        name: "Janhavi Sharma",
        email: "janhavi.sharma@email.com",
        contact: "+91 9876543210",
        linkedin: "linkedin.com/in/janhavisharma",
        github: "",
        education: "Bachelor of Computer Science, Pune University (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Developed a Blood Bank Management System using Java and MySQL",
          "Created responsive web interfaces using HTML, CSS, and JavaScript"
        ],
        skills: ["Java", "React", "SQL"],
        projects: [
          "Blood Bank Management System - Java application with database integration",
          "E-commerce Website - Frontend development with responsive design"
        ],
        achievements: [
          "Dean's List for 2 consecutive semesters",
          "Winner of College Technical Fest 2023"
        ]
      }
    };

    // Personalized suggestions based on candidate's specific resume
    const candidateSpecificSuggestions: { [key: string]: any } = {
      '1': { // Janhavi Sharma - has Java, React, SQL but missing Git, JavaScript
        education: {
          original: candidateResumes[candidate.id]?.education || candidateResumes['1'].education,
          enhanced: "Bachelor of Computer Science, Pune University (2021-2025)\nRelevant Coursework: Data Structures, Algorithms, Database Management, Software Engineering\nGPA: 8.5/10"
        },
        summary: {
          original: candidateResumes[candidate.id]?.summary || candidateResumes['1'].summary,
          enhanced: "Passionate Computer Science student with hands-on experience in full-stack web development and programming. Proficient in Java backend development, React frontend frameworks, and SQL database management. Demonstrated ability to build scalable applications with strong problem-solving skills and attention to detail."
        },
        experience: {
          original: candidateResumes[candidate.id]?.experience || candidateResumes['1'].experience,
          enhanced: [
            "• Developed a Blood Bank Management System using Java and MySQL, implementing secure authentication, inventory tracking, and donor management features with responsive UI design",
            "• Created responsive web interfaces using HTML, CSS, and JavaScript, optimizing user experience across multiple devices and browsers with modern design principles"
          ]
        },
        projects: {
          original: candidateResumes[candidate.id]?.projects || candidateResumes['1'].projects,
          enhanced: [
            "• Blood Bank Management System - Java application with database integration using MySQL, featuring donor registration, blood inventory tracking, and admin dashboard with secure authentication",
            "• E-commerce Website - Frontend development with responsive design using React.js, implementing shopping cart functionality, product catalog, and payment gateway integration"
          ]
        },
        skills: {
          original: candidateResumes[candidate.id]?.skills || candidateResumes['1'].skills,
          suggested: ["JavaScript", "Git", "HTML/CSS", "Node.js"] // Skills missing from original
        },
        achievements: {
          original: candidateResumes[candidate.id]?.achievements || candidateResumes['1'].achievements,
          enhanced: [
            "• Dean's List for 2 consecutive semesters (2022-2023)",
            "• Winner of College Technical Fest 2023 - Best Project Award",
            "• Completed Oracle Java SE 11 Developer Certification"
          ]
        }
      },
      '2': { // Aarya Ranpise - has Python, Django, HTML, CSS but missing React, SQL, JavaScript
        education: {
          original: candidateResumes[candidate.id]?.education || candidateResumes['1'].education,
          enhanced: "Bachelor of Technology, MIT WPU (2021-2025)\nRelevant Coursework: Web Development, Database Systems, Software Engineering, Python Programming\nGPA: 8.2/10"
        },
        summary: {
          original: candidateResumes[candidate.id]?.summary || candidateResumes['1'].summary,
          enhanced: "Motivated Computer Science student with strong foundation in Python web development and backend systems. Experienced in Django framework development and responsive web design. Eager to expand skills in modern frontend frameworks and database management."
        },
        experience: {
          original: candidateResumes[candidate.id]?.experience || candidateResumes['1'].experience,
          enhanced: [
            "• Built scalable web applications using Python and Django framework, implementing MVC architecture, user authentication, and RESTful API endpoints",
            "• Created responsive web interfaces using HTML, CSS, and JavaScript, ensuring cross-browser compatibility and mobile-first design principles"
          ]
        },
        projects: {
          original: candidateResumes[candidate.id]?.projects || candidateResumes['1'].projects,
          enhanced: [
            "• Library Management System - Full-stack Python Django application with user authentication, book catalog management, and automated fine calculation system",
            "• Personal Portfolio Website - Responsive frontend development showcasing modern design principles with interactive elements and optimized performance"
          ]
        },
        skills: {
          original: candidateResumes[candidate.id]?.skills || candidateResumes['1'].skills,
          suggested: ["React", "SQL", "JavaScript", "Git", "Node.js"] // Skills missing from original
        },
        achievements: {
          original: candidateResumes[candidate.id]?.achievements || candidateResumes['1'].achievements,
          enhanced: [
            "• Certificate of Merit in Academics for 2 consecutive years (2022-2024)",
            "• IBM Java Certification Course - Successfully completed with distinction",
            "• Hackathon Participant - College Level Web Development Competition 2023"
          ]
        }
      },
      '3': { // Priya Patel - has Python, Django, HTML, CSS but missing React, SQL, JavaScript
        education: {
          original: candidateResumes[candidate.id]?.education || candidateResumes['1'].education,
          enhanced: "Bachelor of Information Technology, Mumbai University (2021-2025)\nRelevant Coursework: Web Technologies, Database Management, Software Development, Python Programming\nGPA: 8.4/10"
        },
        summary: {
          original: candidateResumes[candidate.id]?.summary || candidateResumes['1'].summary,
          enhanced: "Dedicated IT student with expertise in Python web development and modern web technologies. Strong foundation in Django framework and responsive design. Passionate about learning new technologies and building user-centric applications."
        },
        experience: {
          original: candidateResumes[candidate.id]?.experience || candidateResumes['1'].experience,
          enhanced: [
            "• Developed robust web applications using Python and Django, implementing secure user authentication, data validation, and efficient database queries",
            "• Designed and implemented responsive web interfaces using HTML5, CSS3, and JavaScript, focusing on user experience and accessibility standards"
          ]
        },
        projects: {
          original: candidateResumes[candidate.id]?.projects || candidateResumes['1'].projects,
          enhanced: [
            "• Library Management System - Comprehensive Django application featuring book inventory, member management, and automated notification system",
            "• Personal Portfolio Website - Modern, responsive website showcasing technical skills with interactive animations and optimized loading performance"
          ]
        },
        skills: {
          original: candidateResumes[candidate.id]?.skills || candidateResumes['1'].skills,
          suggested: ["React", "SQL", "JavaScript", "Git", "MongoDB"] // Skills missing from original
        },
        achievements: {
          original: candidateResumes[candidate.id]?.achievements || candidateResumes['1'].achievements,
          enhanced: [
            "• Certificate of Honour in Academics for 2 consecutive years (2022-2024)",
            "• IBM Python Certification Course - Completed with excellence",
            "• Best Project Award - University Level Technical Exhibition 2023"
          ]
        }
      },
      '4': { // Rahul Singh - has JavaScript, Node.js, MongoDB but missing React, SQL, Git
        education: {
          original: candidateResumes[candidate.id]?.education || candidateResumes['1'].education,
          enhanced: "Bachelor of Computer Applications, Delhi University (2021-2025)\nRelevant Coursework: Web Development, Database Systems, JavaScript Programming, Software Engineering\nGPA: 8.1/10"
        },
        summary: {
          original: candidateResumes[candidate.id]?.summary || candidateResumes['1'].summary,
          enhanced: "Skilled Computer Science student specializing in JavaScript and backend development. Proficient in Node.js and NoSQL databases with experience in building scalable web applications. Strong problem-solving abilities and passion for modern web technologies."
        },
        experience: {
          original: candidateResumes[candidate.id]?.experience || candidateResumes['1'].experience,
          enhanced: [
            "• Developed robust REST APIs using Node.js and Express.js, implementing authentication middleware, data validation, and error handling mechanisms",
            "• Built responsive web interfaces using modern JavaScript, HTML5, and CSS3, ensuring optimal performance and user experience across devices"
          ]
        },
        projects: {
          original: candidateResumes[candidate.id]?.projects || candidateResumes['1'].projects,
          enhanced: [
            "• Chat Application - Real-time messaging system using Node.js, Socket.io, and MongoDB with user authentication and message persistence",
            "• E-commerce Website - Full-stack application with product catalog, shopping cart functionality, and secure payment integration"
          ]
        },
        skills: {
          original: candidateResumes[candidate.id]?.skills || candidateResumes['1'].skills,
          suggested: ["React", "SQL", "Git", "Python", "Express.js"] // Skills missing from original
        },
        achievements: {
          original: candidateResumes[candidate.id]?.achievements || candidateResumes['1'].achievements,
          enhanced: [
            "• Best Project Award in Web Development Course - University Recognition 2023",
            "• Merit Certificate at Academic Program - NIT Goa 2024",
            "• JavaScript Fundamentals Certification - Online Course Completion"
          ]
        }
      },
      '5': { // Anita Desai - has React, JavaScript, CSS, HTML but missing backend skills, SQL, Git
        education: {
          original: candidateResumes[candidate.id]?.education || candidateResumes['1'].education,
          enhanced: "Bachelor of Computer Science, Bangalore University (2021-2025)\nRelevant Coursework: Frontend Development, JavaScript Programming, Web Design, User Interface Design\nGPA: 8.6/10"
        },
        summary: {
          original: candidateResumes[candidate.id]?.summary || candidateResumes['1'].summary,
          enhanced: "Creative Computer Science student with strong expertise in frontend development and modern JavaScript frameworks. Proficient in React development and responsive design with keen eye for user experience. Eager to expand into full-stack development."
        },
        experience: {
          original: candidateResumes[candidate.id]?.experience || candidateResumes['1'].experience,
          enhanced: [
            "• Developed interactive and responsive user interfaces using React.js, implementing component-based architecture and state management with hooks",
            "• Created modern, accessible web designs using advanced CSS techniques, ensuring cross-browser compatibility and mobile-first approach"
          ]
        },
        projects: {
          original: candidateResumes[candidate.id]?.projects || candidateResumes['1'].projects,
          enhanced: [
            "• Weather App - Dynamic React application with API integration, real-time data fetching, and responsive design with interactive charts",
            "• Portfolio Website - Modern, performance-optimized website showcasing frontend skills with smooth animations and excellent user experience"
          ]
        },
        skills: {
          original: candidateResumes[candidate.id]?.skills || candidateResumes['1'].skills,
          suggested: ["Node.js", "SQL", "Git", "Python", "MongoDB"] // Skills missing from original
        },
        achievements: {
          original: candidateResumes[candidate.id]?.achievements || candidateResumes['1'].achievements,
          enhanced: [
            "• Outstanding Student in Frontend Development - Department Recognition 2023",
            "• Udemy React Certification Course - Completed with distinction",
            "• UI/UX Design Competition - Second Place at University Level 2023"
          ]
        }
      },
      '6': { // Vikram Kumar - has JavaScript, Node.js, MongoDB but missing React, SQL, Git
        education: {
          original: candidateResumes[candidate.id]?.education || candidateResumes['1'].education,
          enhanced: "Bachelor of Computer Applications, Delhi University (2022-2026)\nRelevant Coursework: Web Development, JavaScript Programming, Database Systems, Software Engineering\nGPA: 8.3/10"
        },
        summary: {
          original: candidateResumes[candidate.id]?.summary || candidateResumes['1'].summary,
          enhanced: "Enthusiastic Computer Science student with solid foundation in JavaScript and backend development. Experienced in Node.js and NoSQL databases with passion for building scalable web applications. Strong analytical skills and commitment to continuous learning."
        },
        experience: {
          original: candidateResumes[candidate.id]?.experience || candidateResumes['1'].experience,
          enhanced: [
            "• Architected and developed RESTful APIs using Node.js and Express.js, implementing robust authentication, data validation, and comprehensive error handling",
            "• Built dynamic, responsive web interfaces using modern JavaScript ES6+, HTML5, and CSS3, focusing on performance optimization and user experience"
          ]
        },
        projects: {
          original: candidateResumes[candidate.id]?.projects || candidateResumes['1'].projects,
          enhanced: [
            "• Chat Application - Scalable real-time messaging platform using Node.js, Socket.io, and MongoDB with advanced features like file sharing and group chats",
            "• E-commerce Website - Comprehensive full-stack application with product management, user authentication, and integrated payment processing"
          ]
        },
        skills: {
          original: candidateResumes[candidate.id]?.skills || candidateResumes['1'].skills,
          suggested: ["React", "SQL", "Git", "Python", "TypeScript"] // Skills missing from original
        },
        achievements: {
          original: candidateResumes[candidate.id]?.achievements || candidateResumes['1'].achievements,
          enhanced: [
            "• Best Project Award in Web Development Hackwithme - 2024 Winner",
            "• Coursera JavaScript Certification - Successfully completed advanced course",
            "• Open Source Contributor - Active participant in GitHub community projects"
          ]
        }
      }
    };

    return candidateSpecificSuggestions[candidate?.id || '1'] || candidateSpecificSuggestions['1'];
  };

  const resumeData = candidateResumes[candidate?.id || '1'] || candidateResumes['1'];

  // Enhanced suggestions for each section
  const getEnhancementSuggestions = () => {
    const suggestions = getResumeData();
    return suggestions;
  };

  // Initialize enhancements on component mount
  useEffect(() => {
    const suggestions = getEnhancementSuggestions();
    setEnhancedSections(suggestions);
    
    // Set initial score impacts for each section
    const impacts = {
      education: 2,
      summary: 3,
      experience: 4,
      projects: 3,
      skills: 2,
      achievements: 1
    };
    setSectionScoreImpacts(impacts);
    
    // Initialize selected skills as empty
    setSelectedSkills([]);
  }, []);

  const handleSectionAction = (section: string, action: 'accept' | 'reject' | 'edit' | 'undo') => {
    const currentState = sectionStates[section] || 'original';
    const scoreImpact = sectionScoreImpacts[section] || 0;
    
    if (action === 'accept') {
      setSectionStates(prev => ({ ...prev, [section]: 'accepted' }));
      if (currentState !== 'accepted') {
        setCurrentFitmentScore(prev => Math.min(100, prev + scoreImpact));
      }
    } else if (action === 'reject') {
      setSectionStates(prev => ({ ...prev, [section]: 'rejected' }));
      if (currentState === 'accepted') {
        setCurrentFitmentScore(prev => Math.max(0, prev - scoreImpact));
      }
    } else if (action === 'edit') {
      setSectionStates(prev => ({ ...prev, [section]: 'editing' }));
      setEditingContent(prev => ({
        ...prev,
        [section]: enhancedSections[section]?.enhanced
      }));
    } else if (action === 'undo') {
      if (currentState === 'accepted') {
        setCurrentFitmentScore(prev => Math.max(0, prev - scoreImpact));
      }
      setSectionStates(prev => ({ ...prev, [section]: 'original' }));
      setEditingContent(prev => {
        const newContent = { ...prev };
        delete newContent[section];
        return newContent;
      });
    }
  };

  const handleSaveEdit = (section: string) => {
    const editedContent = editingContent[section];
    setEnhancedSections(prev => ({
      ...prev,
      [section]: { ...prev[section], enhanced: editedContent }
    }));
    setSectionStates(prev => ({ ...prev, [section]: 'accepted' }));
    const scoreImpact = sectionScoreImpacts[section] || 0;
    setCurrentFitmentScore(prev => Math.min(100, prev + scoreImpact));
    setEditingContent(prev => {
      const newContent = { ...prev };
      delete newContent[section];
      return newContent;
    });
  };

  const handleSectionEdit = (section: string, newContent: any) => {
    setEditingContent(prev => ({ ...prev, [section]: newContent }));
  };

  const handleProjectHyperlinkChange = (projectIndex: number, hyperlink: string) => {
    setProjectHyperlinks(prev => ({
      ...prev,
      [`project_${projectIndex}`]: hyperlink
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => {
      const isSelected = prev.includes(skill);
      let newSelectedSkills;
      
      if (isSelected) {
        // Remove skill
        newSelectedSkills = prev.filter(s => s !== skill);
        // Decrease score by 1%
        setCurrentFitmentScore(prevScore => Math.max(0, prevScore - 1));
      } else {
        // Add skill
        newSelectedSkills = [...prev, skill];
        // Increase score by 1%
        setCurrentFitmentScore(prevScore => Math.min(100, prevScore + 1));
      }
      
      return newSelectedSkills;
    });
  };

  const handleSaveEnhancements = () => {
    if (candidate && onSave) {
      const enhancedResume = {
        ...resumeData,
        education: sectionStates.education === 'accepted' ? enhancedSections.education?.enhanced : resumeData.education,
        summary: sectionStates.summary === 'accepted' ? enhancedSections.summary?.enhanced : resumeData.summary,
        experience: sectionStates.experience === 'accepted' ? enhancedSections.experience?.enhanced : resumeData.experience,
        projects: sectionStates.projects === 'accepted' ? enhancedSections.projects?.enhanced : resumeData.projects,
        skills: sectionStates.skills === 'accepted' ? enhancedSections.skills?.enhanced : resumeData.skills,
        enhancedSkills: [...resumeData.skills, ...selectedSkills], // Include both original and selected skills
        achievements: sectionStates.achievements === 'accepted' ? enhancedSections.achievements?.enhanced : resumeData.achievements,
        projectHyperlinks: projectHyperlinks
      };
      
      onSave(candidate.id, currentFitmentScore, enhancedResume);
    }
    onClose();
  };

  const ActionButtons: React.FC<{ section: string }> = ({ section }) => {
    const currentState = sectionStates[section] || 'original';
    const isEditing = currentState === 'editing';
    
    if (isEditing) {
      return (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => handleSaveEdit(section)}
            className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
          >
            <Save className="w-3 h-3" />
            <span>Save Edit</span>
          </button>
          <button
            onClick={() => handleSectionAction(section, 'undo')}
            className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        </div>
      );
    }
    
    return (
    <div className="flex space-x-2 mt-2">
      {currentState !== 'accepted' && (
      <button
        onClick={() => handleSectionAction(section, 'accept')}
        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
      >
        <CheckCircle className="w-3 h-3" />
        <span>Accept</span>
      </button>
      )}
      {currentState !== 'rejected' && (
      <button
        onClick={() => handleSectionAction(section, 'reject')}
        className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
      >
        <XCircle className="w-3 h-3" />
        <span>Reject</span>
      </button>
      )}
      {currentState !== 'editing' && (
      <button
        onClick={() => handleSectionAction(section, 'edit')}
        className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
      >
        <span>Edit</span>
      </button>
      )}
      {currentState !== 'original' && (
      <button
        onClick={() => handleSectionAction(section, 'undo')}
        className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Undo</span>
      </button>
      )}
    </div>
    );
  };

  const getStatusBadge = (section: string) => {
    const currentState = sectionStates[section] || 'original';
    
    switch (currentState) {
      case 'accepted':
        return <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded ml-2">✓ Accepted</span>;
      case 'rejected':
        return <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded ml-2">✗ Rejected</span>;
      case 'editing':
        return <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded ml-2">✎ Editing</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Wand2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Enhancer</h1>
              <p className="text-gray-600">AI-powered resume optimization for better job fitment</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Fitment</div>
              <div className="text-2xl font-bold text-purple-600">{currentFitmentScore}%</div>
              {/* Progress Bar */}
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentFitmentScore}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-4 border-b border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleSaveEnhancements}
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm"
            >
              Save Enhanced Resume
            </button>
          </div>
        </div>

        {/* Resume Comparison */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Original Resume */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Original Resume</h2>
              </div>

              {/* Contact Info */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{resumeData.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{resumeData.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{resumeData.contact}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Linkedin className="w-4 h-4" />
                    <span>{resumeData.linkedin}</span>
                  </div>
                  {resumeData.github && (
                    <div className="flex items-center justify-center space-x-2">
                      <Github className="w-4 h-4" />
                      <span>{resumeData.github}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Education</h3>
                </div>
                <p className="text-gray-700 text-sm">{resumeData.education}</p>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Summary</h3>
                </div>
                <p className="text-gray-700 text-sm">{resumeData.summary}</p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                </div>
                <div className="space-y-2">
                  {resumeData.experience.map((exp: string, index: number) => (
                    <p key={index} className="text-gray-700 text-sm">• {exp}</p>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Projects</h3>
                </div>
                <div className="space-y-2">
                  {resumeData.projects.map((project: string, index: number) => (
                    <p key={index} className="text-gray-700 text-sm">• {project}</p>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Achievements</h3>
                </div>
                <div className="space-y-2">
                  {resumeData.achievements.map((achievement: string, index: number) => (
                    <p key={index} className="text-gray-700 text-sm">• {achievement}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Resume */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Enhanced Resume</h2>
              </div>

              {/* Contact Info */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{resumeData.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{resumeData.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{resumeData.contact}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Linkedin className="w-4 h-4" />
                    <span>{resumeData.linkedin}</span>
                  </div>
                  {resumeData.github && (
                    <div className="flex items-center justify-center space-x-2">
                      <Github className="w-4 h-4" />
                      <span>{resumeData.github}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Education</h3>
                  {getStatusBadge('education')}
                </div>
                {enhancedSections.education && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Addition</span>
                    </div>
                    {sectionStates.education === 'editing' ? (
                    <textarea
                        value={editingContent.education || ''}
                      onChange={(e) => handleSectionEdit('education', e.target.value)}
                      className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                      rows={3}
                    />
                    ) : (
                      <div className={`text-sm text-gray-700 ${sectionStates.education === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.education.enhanced}
                      </div>
                    )}
                    <ActionButtons section="education" />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Summary</h3>
                  {getStatusBadge('summary')}
                </div>
                {enhancedSections.summary && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {sectionStates.summary === 'editing' ? (
                    <textarea
                        value={editingContent.summary || ''}
                      onChange={(e) => handleSectionEdit('summary', e.target.value)}
                      className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                      rows={4}
                    />
                    ) : (
                      <div className={`text-sm text-gray-700 ${sectionStates.summary === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.summary.enhanced}
                      </div>
                    )}
                    <ActionButtons section="summary" />
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                  {getStatusBadge('experience')}
                </div>
                {enhancedSections.experience && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Improvement</span>
                    </div>
                    {sectionStates.experience === 'editing' ? (
                    <div className="space-y-2">
                        {(editingContent.experience || enhancedSections.experience.enhanced).map((exp: string, index: number) => (
                        <textarea
                          key={index}
                          value={exp}
                          onChange={(e) => {
                              const newExperience = [...(editingContent.experience || enhancedSections.experience.enhanced)];
                            newExperience[index] = e.target.value;
                            handleSectionEdit('experience', newExperience);
                          }}
                          className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                          rows={2}
                        />
                      ))}
                    </div>
                    ) : (
                      <div className={`space-y-2 ${sectionStates.experience === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.experience.enhanced.map((exp: string, index: number) => (
                          <div key={index} className="text-sm text-gray-700">
                            {exp}
                          </div>
                        ))}
                      </div>
                    )}
                    <ActionButtons section="experience" />
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Projects</h3>
                  {getStatusBadge('projects')}
                </div>
                {enhancedSections.projects && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {sectionStates.projects === 'editing' ? (
                    <div className="space-y-4">
                        {(editingContent.projects || enhancedSections.projects.enhanced).map((project: string, index: number) => (
                        <div key={index} className="space-y-2">
                          <textarea
                            value={project}
                            onChange={(e) => {
                                const newProjects = [...(editingContent.projects || enhancedSections.projects.enhanced)];
                              newProjects[index] = e.target.value;
                              handleSectionEdit('projects', newProjects);
                            }}
                            className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                            rows={2}
                          />
                          <input
                            type="url"
                            placeholder="Enter project hyperlink (e.g., GitHub or Live Demo)"
                            value={projectHyperlinks[`project_${index}`] || ''}
                            onChange={(e) => handleProjectHyperlinkChange(index, e.target.value)}
                            className="w-full text-sm text-gray-600 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                    ) : (
                      <div className={`space-y-4 ${sectionStates.projects === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.projects.enhanced.map((project: string, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="text-sm text-gray-700">{project}</div>
                            <input
                              type="url"
                              placeholder="Enter project hyperlink (e.g., GitHub or Live Demo)"
                              value={projectHyperlinks[`project_${index}`] || ''}
                              onChange={(e) => handleProjectHyperlinkChange(index, e.target.value)}
                              className="w-full text-sm text-gray-600 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <ActionButtons section="projects" />
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resumeData.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                  {selectedSkills.map((skill: string, index: number) => (
                    <span key={`selected-${index}`} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                {enhancedSections.skills?.suggested && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {enhancedSections.skills.suggested.map((skill: string, index: number) => (
                        <label key={index} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`px-2 py-1 rounded text-sm transition-colors ${
                            selectedSkills.includes(skill) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {skill}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Achievements</h3>
                  {getStatusBadge('achievements')}
                </div>
                {enhancedSections.achievements && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {sectionStates.achievements === 'editing' ? (
                    <div className="space-y-2">
                        {(editingContent.achievements || enhancedSections.achievements.enhanced).map((achievement: string, index: number) => (
                        <textarea
                          key={index}
                          value={achievement}
                          onChange={(e) => {
                              const newAchievements = [...(editingContent.achievements || enhancedSections.achievements.enhanced)];
                            newAchievements[index] = e.target.value;
                            handleSectionEdit('achievements', newAchievements);
                          }}
                          className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                          rows={1}
                        />
                      ))}
                    </div>
                    ) : (
                      <div className={`space-y-2 ${sectionStates.achievements === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.achievements.enhanced.map((achievement: string, index: number) => (
                          <div key={index} className="text-sm text-gray-700">
                            {achievement}
                          </div>
                        ))}
                      </div>
                    )}
                    <ActionButtons section="achievements" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEnhancer;