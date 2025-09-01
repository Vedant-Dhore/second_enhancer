import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, Download, CheckCircle, XCircle, RotateCcw, User, Mail, Phone, Linkedin, Github, GraduationCap, Briefcase, Code, Trophy, FileText, Save } from 'lucide-react';

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
  const [selectedSkills, setSelectedSkills] = useState<{[key: string]: boolean}>({});
  const [newSections, setNewSections] = useState<{[key: string]: any[]}>({
    certifications: [],
    researchPapers: [],
    volunteering: []
  });
  const [newSectionStates, setNewSectionStates] = useState<{[key: string]: 'accepted' | 'rejected' | 'editing' | 'original'}>({});
  const [newSectionEditingContent, setNewSectionEditingContent] = useState<{[key: string]: any}>({});
  const [newSectionHyperlinks, setNewSectionHyperlinks] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>('quick');
  const [advancedAnswers, setAdvancedAnswers] = useState<{[key: string]: string}>({});
  const [isResumeEnhanced, setIsResumeEnhanced] = useState(false);
  
  // Calculate enhancement metrics
  const handleDownloadEnhancedResume = () => {
    const enhancedResumeData = {
      ...resumeData,
      // Apply all accepted enhancements
      summary: sectionStates.summary === 'accepted' ? enhancedSections.summary : resumeData.summary,
      education: sectionStates.education === 'accepted' ? enhancedSections.education : resumeData.education,
      experience: sectionStates.experience === 'accepted' ? enhancedSections.experience : resumeData.experience,
      projects: sectionStates.projects === 'accepted' ? enhancedSections.projects : resumeData.projects,
      achievements: sectionStates.achievements === 'accepted' ? enhancedSections.achievements : resumeData.achievements,
      skills: [...resumeData.skills, ...Array.from(selectedSkills)],
      // Add new sections if they have accepted entries
      certifications: Object.entries(newSections.certifications || {})
        .filter(([id]) => newSectionStates[`certifications_${id}`] === 'accepted')
        .map(([, content]) => content),
      researchPapers: Object.entries(newSections.researchPapers || {})
        .filter(([id]) => newSectionStates[`researchPapers_${id}`] === 'accepted')
        .map(([, content]) => content),
      volunteering: Object.entries(newSections.volunteering || {})
        .filter(([id]) => newSectionStates[`volunteering_${id}`] === 'accepted')
        .map(([, content]) => content)
    };

    // Create downloadable content
    const resumeContent = `
${enhancedResumeData.name}
${enhancedResumeData.email} | ${enhancedResumeData.contact}
${enhancedResumeData.linkedin}${enhancedResumeData.github ? ' | ' + enhancedResumeData.github : ''}

SUMMARY
${enhancedResumeData.summary}

EDUCATION
${enhancedResumeData.education}

EXPERIENCE
${enhancedResumeData.experience.map(exp => `• ${exp}`).join('\n')}

TECHNICAL SKILLS
${enhancedResumeData.skills.join(', ')}

PROJECTS
${enhancedResumeData.projects.map(project => `• ${project}`).join('\n')}

ACHIEVEMENTS
${enhancedResumeData.achievements.map(achievement => `• ${achievement}`).join('\n')}

${enhancedResumeData.certifications?.length ? `CERTIFICATIONS\n${enhancedResumeData.certifications.map(cert => `• ${cert}`).join('\n')}\n` : ''}
${enhancedResumeData.researchPapers?.length ? `RESEARCH PAPERS\n${enhancedResumeData.researchPapers.map(paper => `• ${paper}`).join('\n')}\n` : ''}
${enhancedResumeData.volunteering?.length ? `VOLUNTEERING\n${enhancedResumeData.volunteering.map(vol => `• ${vol}`).join('\n')}\n` : ''}
    `.trim();

    // Create and download file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${enhancedResumeData.name.replace(/\s+/g, '_')}_Enhanced_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getEnhancementMetrics = () => {
    const metrics: string[] = [];
    
    // Original sections
    if (sectionStates.education === 'accepted') metrics.push('Enhanced Education');
    if (sectionStates.summary === 'accepted') metrics.push('Enhanced Summary');
    if (sectionStates.experience === 'accepted') metrics.push('Enhanced Experience');
    if (sectionStates.projects === 'accepted') metrics.push('Enhanced Projects');
    if (sectionStates.achievements === 'accepted') metrics.push('Enhanced Achievements');
    
    // Skills count
    const addedSkillsCount = Object.values(selectedSkills).filter(Boolean).length;
    if (addedSkillsCount > 0) metrics.push(`Added Skills: ${addedSkillsCount}`);
    
    // Project hyperlinks count
    const projectHyperlinksCount = Object.values(projectHyperlinks).filter(link => link.trim() !== '').length;
    if (projectHyperlinksCount > 0) metrics.push(`Added Hyperlinks: ${projectHyperlinksCount}`);
    
    // New sections
    const acceptedCertifications = newSections.certifications.filter(entry => 
      newSectionStates[`certifications_${entry.id}`] === 'accepted'
    ).length;
    if (acceptedCertifications > 0) {
      metrics.push(`Added Certifications Section: ${acceptedCertifications} Certificate${acceptedCertifications > 1 ? 's' : ''}`);
    }
    
    const acceptedResearchPapers = newSections.researchPapers.filter(entry => 
      newSectionStates[`researchPapers_${entry.id}`] === 'accepted'
    ).length;
    if (acceptedResearchPapers > 0) {
      metrics.push(`Added Research Papers Section: ${acceptedResearchPapers} Research Paper${acceptedResearchPapers > 1 ? 's' : ''}`);
    }
    
    const acceptedVolunteering = newSections.volunteering.filter(entry => 
      newSectionStates[`volunteering_${entry.id}`] === 'accepted'
    ).length;
    if (acceptedVolunteering > 0) {
      metrics.push(`Added Volunteering Section: ${acceptedVolunteering} Entr${acceptedVolunteering > 1 ? 'ies' : 'y'}`);
    }
    
    return metrics;
  };

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
      },
      '2': {
        name: "Aarya Ranpise",
        email: "aarya123r@email.com",
        contact: "+91 9856543211",
        linkedin: "linkedin.com/in/ranpiseaarya",
        github: "github.com/aarya",
        education: "Bachelor of Technology, MIT WPU (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Built web applications using Python and Django framework",
          "Created responsive web interfaces using HTML, CSS, and JavaScript"
        ],
        skills: ["Python", "Django", "HTML", "CSS"],
        projects: [
          "Library Management System - Python Django application",
          "Personal Portfolio Website - Frontend development with responsive design"
        ],
        achievements: [
          "Certificate of Merit in Academics for 2 years",
          "IBM - Java certification course"
        ]
      }
    };

    return candidateResumes[candidate.id] || candidateResumes['1'];
  };

  // Generate personalized questions based on candidate's resume and job requirements
  const getPersonalizedQuestions = () => {
    const resumeData = getResumeData();
    const questions = [];

    // Question 1: Version control based on GitHub presence
    if (resumeData.github) {
      questions.push({
        id: 'version_control',
        question: `How did you use GitHub for version control in your ${resumeData.projects[0]?.split(' - ')[0] || 'projects'}?`,
        placeholder: 'Describe your experience with Git workflows, branching strategies, collaboration...'
      });
    } else {
      questions.push({
        id: 'version_control_missing',
        question: 'Do you have experience with version control systems like Git or SVN?',
        placeholder: 'Please describe your experience with version control systems...'
      });
    }

    // Question 2: Frontend skills based on projects
    const hasWebProject = resumeData.projects.some((project: string) => 
      project.toLowerCase().includes('website') || project.toLowerCase().includes('web') || project.toLowerCase().includes('frontend')
    );
    if (hasWebProject) {
      questions.push({
        id: 'frontend_skills',
        question: `How did you implement the user interface in your ${resumeData.projects.find((p: string) => p.toLowerCase().includes('website') || p.toLowerCase().includes('web'))?.split(' - ')[0]}?`,
        placeholder: 'Describe your use of HTML, CSS, JavaScript, responsive design...'
      });
    } else {
      questions.push({
        id: 'frontend_missing',
        question: 'Have you worked on collaborative projects using GitHub or GitLab?',
        placeholder: 'Please describe your collaborative development experience...'
      });
    }

    // Question 3: Database experience
    const hasDatabaseProject = resumeData.projects.some((project: string) => 
      project.toLowerCase().includes('database') || project.toLowerCase().includes('mysql') || project.toLowerCase().includes('management system')
    );
    if (hasDatabaseProject) {
      questions.push({
        id: 'database_skills',
        question: `In your ${resumeData.projects.find((p: string) => p.toLowerCase().includes('management system') || p.toLowerCase().includes('database'))?.split(' - ')[0]}, did you follow specific coding standards or practices?`,
        placeholder: 'Describe database design, SQL queries, data modeling approaches...'
      });
    } else {
      questions.push({
        id: 'coding_standards',
        question: 'In your Java projects, did you follow specific coding standards or practices?',
        placeholder: 'Describe coding conventions, best practices, code organization...'
      });
    }

    // Question 4: Code reviews and collaboration
    questions.push({
      id: 'code_reviews',
      question: 'Have you participated in code reviews or pair programming sessions?',
      placeholder: 'Describe your experience with code reviews, feedback processes...'
    });

    return questions;
  };

  const handleAdvancedAnswerChange = (questionId: string, answer: string) => {
    setAdvancedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const resumeData = getResumeData();
  const personalizedQuestions = getPersonalizedQuestions();

  // Enhanced suggestions for each section
  const getEnhancementSuggestions = () => ({
    education: {
      original: resumeData.education,
      enhanced: "Bachelor of Computer Science, Pune University (2021-2025)\nRelevant Coursework: Data Structures, Algorithms, Database Management, Software Engineering\nGPA: 8.5/10"
    },
    summary: {
      original: resumeData.summary,
      enhanced: "Passionate Computer Science student with hands-on experience in full-stack web development and programming. Proficient in Java backend development, React frontend frameworks, and SQL database management. Demonstrated ability to build scalable applications with strong problem-solving skills and attention to detail."
    },
    experience: {
      original: resumeData.experience,
      enhanced: [
        "• Developed a Blood Bank Management System using Java and MySQL, implementing secure authentication, inventory tracking, and donor management features with responsive UI design",
        "• Created responsive web interfaces using HTML, CSS, and JavaScript, optimizing user experience across multiple devices and browsers with modern design principles"
      ]
    },
    projects: {
      original: resumeData.projects,
      enhanced: [
        "• Blood Bank Management System - Java application with database integration using MySQL, featuring donor registration, blood inventory tracking, and admin dashboard with secure authentication",
        "• E-commerce Website - Frontend development with responsive design using React.js, implementing shopping cart functionality, product catalog, and payment gateway integration"
      ]
    },
    skills: {
      original: resumeData.skills,
      enhanced: ["Java", "React", "SQL", "JavaScript", "HTML/CSS", "Git"]
    },
    achievements: {
      original: resumeData.achievements,
      enhanced: [
        "• Dean's List for 2 consecutive semesters (2022-2023)",
        "• Winner of College Technical Fest 2023 - Best Project Award",
        "• Completed Oracle Java SE 11 Developer Certification"
      ]
    }
  });

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
    
    // Initialize new sections with sample entries
    setNewSections({
      certifications: [
        { id: 'cert_1', text: 'Oracle Java SE 11 Developer Certification', hyperlink: '' }
      ],
      researchPapers: [
        { id: 'research_1', text: 'Machine Learning Applications in Web Development - Published in IEEE Conference 2023', hyperlink: '' }
      ],
      volunteering: [
        { id: 'volunteer_1', text: 'Technical Mentor at Local Coding Bootcamp - Helped 20+ students learn programming fundamentals' }
      ]
    });
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

  const handleNewSectionAction = (sectionType: string, entryId: string, action: 'accept' | 'reject' | 'edit' | 'undo') => {
    const stateKey = `${sectionType}_${entryId}`;
    const currentState = newSectionStates[stateKey] || 'original';
    const scoreImpact = 2; // Each new section entry contributes +2%
    
    if (action === 'accept') {
      setNewSectionStates(prev => ({ ...prev, [stateKey]: 'accepted' }));
      if (currentState !== 'accepted') {
        setCurrentFitmentScore(prev => Math.min(100, prev + scoreImpact));
      }
    } else if (action === 'reject') {
      setNewSectionStates(prev => ({ ...prev, [stateKey]: 'rejected' }));
      if (currentState === 'accepted') {
        setCurrentFitmentScore(prev => Math.max(0, prev - scoreImpact));
      }
    } else if (action === 'edit') {
      setNewSectionStates(prev => ({ ...prev, [stateKey]: 'editing' }));
      const entry = newSections[sectionType].find(e => e.id === entryId);
      setNewSectionEditingContent(prev => ({
        ...prev,
        [`${stateKey}_text`]: entry?.text || '',
        [`${stateKey}_hyperlink`]: entry?.hyperlink || ''
      }));
    } else if (action === 'undo') {
      if (currentState === 'accepted') {
        setCurrentFitmentScore(prev => Math.max(0, prev - scoreImpact));
      }
      setNewSectionStates(prev => ({ ...prev, [stateKey]: 'original' }));
      setNewSectionEditingContent(prev => {
        const newContent = { ...prev };
        delete newContent[`${stateKey}_text`];
        delete newContent[`${stateKey}_hyperlink`];
        return newContent;
      });
    }
  };

  const handleSaveNewSectionEdit = (sectionType: string, entryId: string) => {
    const stateKey = `${sectionType}_${entryId}`;
    const editedText = newSectionEditingContent[`${stateKey}_text`];
    const editedHyperlink = newSectionEditingContent[`${stateKey}_hyperlink`];
    
    setNewSections(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].map(entry => 
        entry.id === entryId 
          ? { ...entry, text: editedText, hyperlink: editedHyperlink || entry.hyperlink }
          : entry
      )
    }));
    
    setNewSectionStates(prev => ({ ...prev, [stateKey]: 'accepted' }));
    const scoreImpact = 2;
    setCurrentFitmentScore(prev => Math.min(100, prev + scoreImpact));
    
    setNewSectionEditingContent(prev => {
      const newContent = { ...prev };
      delete newContent[`${stateKey}_text`];
      delete newContent[`${stateKey}_hyperlink`];
      return newContent;
    });
  };

  const handleAddNewEntry = (sectionType: string) => {
    const newId = `${sectionType}_${Date.now()}`;
    const newEntry = {
      id: newId,
      text: '',
      ...(sectionType === 'certifications' || sectionType === 'researchPapers' ? { hyperlink: '' } : {})
    };
    
    setNewSections(prev => ({
      ...prev,
      [sectionType]: [...prev[sectionType], newEntry]
    }));
    
    // Automatically start editing the new entry
    const stateKey = `${sectionType}_${newId}`;
    setNewSectionStates(prev => ({ ...prev, [stateKey]: 'editing' }));
    setNewSectionEditingContent(prev => ({
      ...prev,
      [`${stateKey}_text`]: '',
      [`${stateKey}_hyperlink`]: ''
    }));
  };

  const handleSkillToggle = (skill: string) => {
    const isCurrentlySelected = selectedSkills[skill] || false;
    const newSelectedState = !isCurrentlySelected;
    
    setSelectedSkills(prev => ({
      ...prev,
      [skill]: newSelectedState
    }));
    
    // Update fitment score (+1% for select, -1% for deselect)
    if (newSelectedState) {
      setCurrentFitmentScore(prev => Math.min(100, prev + 1));
    } else {
      setCurrentFitmentScore(prev => Math.max(0, prev - 1));
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

  const handleSaveEnhancements = () => {
    if (candidate && onSave) {
      const enhancedResume = {
        ...resumeData,
        education: sectionStates.education === 'accepted' ? enhancedSections.education?.enhanced : resumeData.education,
        summary: sectionStates.summary === 'accepted' ? enhancedSections.summary?.enhanced : resumeData.summary,
        experience: sectionStates.experience === 'accepted' ? enhancedSections.experience?.enhanced : resumeData.experience,
        projects: sectionStates.projects === 'accepted' ? enhancedSections.projects?.enhanced : resumeData.projects,
        skills: sectionStates.skills === 'accepted' ? enhancedSections.skills?.enhanced : resumeData.skills,
        achievements: sectionStates.achievements === 'accepted' ? enhancedSections.achievements?.enhanced : resumeData.achievements,
        projectHyperlinks: projectHyperlinks,
        certifications: newSections.certifications.filter(entry => 
          newSectionStates[`certifications_${entry.id}`] === 'accepted'
        ),
        researchPapers: newSections.researchPapers.filter(entry => 
          newSectionStates[`researchPapers_${entry.id}`] === 'accepted'
        ),
        volunteering: newSections.volunteering.filter(entry => 
          newSectionStates[`volunteering_${entry.id}`] === 'accepted'
        ),
        newSectionHyperlinks: newSectionHyperlinks
      };
      
      onSave(candidate.id, currentFitmentScore, enhancedResume);
    }
    setIsResumeEnhanced(true);
    onClose();
  };

  const ActionButtons: React.FC<{ section: string; sectionType?: 'original' | 'new'; entryId?: string }> = ({ 
    section, 
    sectionType = 'original', 
    entryId 
  }) => {
    const currentState = sectionType === 'original' 
      ? (sectionStates[section] || 'original')
      : (newSectionStates[`${section}_${entryId}`] || 'original');
    const isEditing = currentState === 'editing';
    
    const handleAction = (action: 'accept' | 'reject' | 'edit' | 'undo') => {
      if (sectionType === 'original') {
        handleSectionAction(section, action);
      } else if (entryId) {
        handleNewSectionAction(section, entryId, action);
      }
    };
    
    const handleSaveEdit = () => {
      if (sectionType === 'original') {
        handleSaveEdit(section);
      } else if (entryId) {
        handleSaveNewSectionEdit(section, entryId);
      }
    };
    
    if (isEditing) {
      return (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={handleSaveEdit}
            className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
          >
            <Save className="w-3 h-3" />
            <span>Save Edit</span>
          </button>
          <button
            onClick={() => handleAction('undo')}
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
        onClick={() => handleAction('accept')}
        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
      >
        <CheckCircle className="w-3 h-3" />
        <span>Accept</span>
      </button>
      )}
      {currentState !== 'rejected' && (
      <button
        onClick={() => handleAction('reject')}
        className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
      >
        <XCircle className="w-3 h-3" />
        <span>Reject</span>
      </button>
      )}
      {currentState !== 'editing' && (
      <button
        onClick={() => handleAction('edit')}
        className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
      >
        <span>Edit</span>
      </button>
      )}
      {currentState !== 'original' && (
      <button
        onClick={() => handleAction('undo')}
        className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Undo</span>
      </button>
      )}
    </div>
    );
  };

  const getStatusBadge = (section: string, sectionType: 'original' | 'new' = 'original', entryId?: string) => {
    const currentState = sectionType === 'original' 
      ? (sectionStates[section] || 'original')
      : (newSectionStates[`${section}_${entryId}`] || 'original');
    
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

  const NewSectionRenderer: React.FC<{ 
    sectionType: string; 
    title: string; 
    icon: React.ComponentType<any>;
    hasHyperlinks?: boolean;
  }> = ({ sectionType, title, icon: Icon, hasHyperlinks = false }) => {
    const entries = newSections[sectionType] || [];
    
    return (
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Icon className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button
            onClick={() => handleAddNewEntry(sectionType)}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            + Add
          </button>
        </div>
        
        <div className="space-y-4">
          {entries.map((entry, index) => {
            const stateKey = `${sectionType}_${entry.id}`;
            const currentState = newSectionStates[stateKey] || 'original';
            const isEditing = currentState === 'editing';
            const isRejected = currentState === 'rejected';
            
            return (
              <div key={entry.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {title} Entry {index + 1}
                  </span>
                  {getStatusBadge(sectionType, 'new', entry.id)}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={newSectionEditingContent[`${stateKey}_text`] || ''}
                      onChange={(e) => setNewSectionEditingContent(prev => ({
                        ...prev,
                        [`${stateKey}_text`]: e.target.value
                      }))}
                      placeholder={`Enter ${title.toLowerCase()} details...`}
                      className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    {hasHyperlinks && (
                      <input
                        type="url"
                        value={newSectionEditingContent[`${stateKey}_hyperlink`] || ''}
                        onChange={(e) => setNewSectionEditingContent(prev => ({
                          ...prev,
                          [`${stateKey}_hyperlink`]: e.target.value
                        }))}
                        placeholder="Enter hyperlink (optional)"
                        className="w-full text-sm text-gray-600 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={`text-sm text-gray-700 ${isRejected ? 'line-through opacity-60' : ''}`}>
                      {entry.text || 'No content added yet'}
                    </div>
                    {hasHyperlinks && entry.hyperlink && (
                      <div className={`text-sm text-blue-600 ${isRejected ? 'line-through opacity-60' : ''}`}>
                        <a href={entry.hyperlink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {entry.hyperlink}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                <ActionButtons section={sectionType} sectionType="new" entryId={entry.id} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh]"> {/* overflow-y-auto */}
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
            
            {/* Enhancement Metrics */}
            {activeTab === 'quick' && (
              <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">Enhancement Summary</div>
              <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
                {getEnhancementMetrics().length > 0 ? (
                  <div className="space-y-1">
                    {getEnhancementMetrics().map((metric, index) => (
                      <div key={index} className="text-xs text-gray-700 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {metric}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">No enhancements accepted yet</div>
                )}
              </div>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>


        {/* Tabs + Buttons Row */}
        <div className="px-6 py-2 border-b border-gray-200 flex items-center justify-between">
          {/* Tabs */}
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('quick')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'quick'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quick Enhancement
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'advanced'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Advanced Enhancement
            </button>
          </div>
        
          {/* Buttons section (always rendered to keep height consistent) */}
          <div className="flex items-center space-x-3">
            {activeTab === 'quick' ? (
              <>
                {/* Download Icon Button */}
                <button
                  onClick={handleDownloadEnhancedResume}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
        
                {/* Save Button */}
                <button
                  onClick={handleSaveEnhancements}
                  className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm"
                >
                  Save
                </button>
              </>
            ) : (
              <div className="h-9" /> 
            )}
          </div>
        </div>


        
        {/* Tab Content */}
        <div className="overflow-y-auto flex-1">
        <div className="p-6">
          {activeTab === 'quick' ? (
            /* Quick Enhancement - Resume Comparison */
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
                
                {/* Current Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                    {/* Show selected additional skills */}
                    {enhancedSections.skills && enhancedSections.skills.enhanced
                      .filter((skill: string) => !resumeData.skills.includes(skill) && selectedSkills[skill])
                      .map((skill: string, index: number) => (
                        <span key={`new-${index}`} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          {skill} ✓
                        </span>
                      ))}
                  </div>
                </div>
                
                {/* Suggested Additional Skills */}
                {enhancedSections.skills && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Suggested Additional Skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {enhancedSections.skills.enhanced
                        .filter((skill: string) => !resumeData.skills.includes(skill))
                        .map((skill: string, index: number) => (
                        <label key={index} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSkills[skill] || false}
                            onChange={() => handleSkillToggle(skill)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`px-2 py-1 rounded text-sm transition-colors ${
                            selectedSkills[skill] 
                              ? 'bg-green-100 text-green-800 font-medium' 
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

              {/* Certifications */}
              <NewSectionRenderer 
                sectionType="certifications" 
                title="Certifications" 
                icon={Trophy}
                hasHyperlinks={true}
              />

              {/* Research Papers */}
              <NewSectionRenderer 
                sectionType="researchPapers" 
                title="Research Papers" 
                icon={FileText}
                hasHyperlinks={true}
              />

              {/* Volunteering */}
              <NewSectionRenderer 
                sectionType="volunteering" 
                title="Volunteering" 
                icon={User}
                hasHyperlinks={false}
              />
            </div>
          </div>
          ) : (
            /* Advanced Enhancement - Personalized Questions */
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">AI Observations</h3>
                      <p className="text-sm text-blue-800">
                        Your resume shows strong Java and React skills, but lacks mention of version control systems like Git. Adding this experience can boost your fitment score as collaborative development is crucial for this role.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Clarifying Questions</h2>
                  <p className="text-sm text-gray-600 mb-6">Please answer these questions to help us better understand your experience:</p>
                  
                  <div className="space-y-6">
                    {personalizedQuestions.map((question, index) => (
                      <div key={question.id}>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </label>
                        <textarea
                          value={advancedAnswers[question.id] || ''}
                          onChange={(e) => handleAdvancedAnswerChange(question.id, e.target.value)}
                          placeholder={question.placeholder}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Skip for now
                    </button>
                    <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm">
                      Submit Answers
                    </button>
                  </div>                 
                </div>
              </div>
            </div>  
          )}          
        </div>
      </div>
    </div>
  </div>
  );
};

export default ResumeEnhancer;