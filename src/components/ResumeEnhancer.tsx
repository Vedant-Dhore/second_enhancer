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
  
  // Calculate enhancement metrics
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
        "• Created responsive web interfaces using HTML, CSS, and JavaScript, optimizing user experience and implementing cross-browser compatibility"