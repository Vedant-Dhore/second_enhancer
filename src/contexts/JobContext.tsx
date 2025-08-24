import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Job {
  id: string;
  title: string;
  location: string;
  workType: string;
  status: 'active' | 'paused' | 'closed';
  candidateCount: number;
  experience: string;
  experienceRequired: string;
  employment: string;
  budget: string;
  budgetRange?: string;
  industry: string;
  postedDate: string;
  description: string;
  qualifications: { text: string; mandatory: boolean }[];
  skills: string[];
  recruiterNotes: string;
  totalCandidates: number;
  shortlisted: number;
  inScreening: number;
  offersSent: number;
  lastUpdated: string;
  priority?: 'high' | 'medium' | 'low';
  expectedJoining?: string;
  hiringManager?: string;
  project?: string;
}

interface Candidate {
  id: string;
  name: string;
  jobId: string;
  stage: 'fitment' | 'basic_screening' | 'technical';
  matchPercentage?: number;
  status: string;
  avatar?: string;
  skills: string[];
  fitmentScore: number;
  fitmentSummary: string;
  profileImage: string;
  statusColor: 'yellow' | 'green' | 'blue' | 'red' | 'gray';
}

interface JobContextType {
  jobs: Job[];
  candidates: Candidate[];
  addJob: (job: Job) => void;
  updateCandidateFitment: (candidateId: string, newScore: number, enhancedSkills?: string[]) => void;
  updateCandidateSkills: (candidateId: string, newSkills: string[]) => void;
  selectedJobId: string | null;
  selectedTab: string;
  searchTerm: string;
  sortBy: string;
  filters: any;
  setSelectedJobId: (id: string) => void;
  setSelectedTab: (tab: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: string) => void;
  setFilters: (filters: any) => void;
  getSelectedJob: () => Job | undefined;
  getCandidatesForJob: (jobId: string) => Candidate[];
  getFilteredAndSortedJobs: () => Job[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Test Engineer',
    location: 'Pune',
    workType: 'Hybrid',
    status: 'active',
    candidateCount: 0,
    experience: '0-2 years',
    experienceRequired: '2+ years of testing experience',
    employment: 'Full-time', 
    budgetRange: '₹4-6 LPA',
    budget: '₹4-6 LPA',
    industry: 'Technology',
    postedDate: '0 day ago',
    description: 'Seeking a skilled Test Engineer for comprehensive testing solutions.',
    qualifications: [
      { text: "Bachelor's degree in Computer Science or related field", mandatory: true },
      { text: "Experience with testing frameworks", mandatory: false }
    ],
    skills: ['Manual Testing', 'Automation Testing', 'API Testing'],
    recruiterNotes: '',
    totalCandidates: 0,
    shortlisted: 0,
    inScreening: 0,
    offersSent: 0,
    lastUpdated: '2 hours ago',
    priority: 'high',
    expectedJoining: '2024-02-15',
    hiringManager: 'John Doe',
    project: 'AI Platform'
  },
  {
    id: '2',  
    title: 'Intern Software Developer',
    location: 'Pune',
    workType: 'Pune/Hybrid',
    status: 'active',
    candidateCount: 2,
    experience: '0-1 years',
    experienceRequired: 'Fresh graduates or 0-1 year experience',
    employment: 'Internship',
    budgetRange: '₹15-25k per month',
    budget: '₹15-25k per month',
    industry: 'Technology',
    postedDate: '0 day ago',
    description: 'Seeking a passionate Junior Software Developer for Java backend development, React front-end, and SQL database management for AI Agentic applications. Will work on scalable web applications, ensuring user experience and efficient data management.',
    qualifications: [
      { text: "Bachelor's degree in Computer Science, Software Engineering, or related field", mandatory: true },
      { text: "Knowledge of software testing methodologies and best practices", mandatory: true },
      { text: "Experience with defect tracking tools", mandatory: true },
      { text: "Familiarity with automated testing frameworks", mandatory: true }
    ],
    skills: [
      'Manual and automated test case development',
      'Defect identification and documentation', 
      'Functional testing',
      'Regression testing',
      'Performance testing',
      'Collaboration with developers',
      'Test plan creation and maintenance',
      'Testing documentation'
    ],
    recruiterNotes: 'No recruiter notes available.',
    totalCandidates: 2,
    shortlisted: 1,
    inScreening: 1,
    offersSent: 0,
    lastUpdated: '1 hour ago',
    priority: 'high',
    expectedJoining: '2024-01-30',
    hiringManager: 'Jane Smith',
    project: 'AI Platform'
  },
  {
    id: '3',
    title: 'Generative AI Engineer',
    location: 'Pune',
    workType: 'Pune',
    status: 'active',
    candidateCount: 0,
    experience: '1 year',
    experienceRequired: '1-3 years in AI/ML',
    employment: 'Full-time',
    budgetRange: '₹8-12 LPA',
    budget: '₹8-12 LPA',
    industry: 'Technology',
    postedDate: '0 day ago',
    description: 'Looking for an AI Engineer specialized in generative AI technologies.',
    qualifications: [
      { text: "Master's degree in AI/ML or related field", mandatory: true },
      { text: "Experience with LLMs and generative models", mandatory: true }
    ],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Machine Learning'],
    recruiterNotes: '',
    totalCandidates: 0,
    shortlisted: 0,
    inScreening: 0,
    offersSent: 0,
    lastUpdated: '3 hours ago',
    priority: 'medium',
    expectedJoining: '2024-03-01',
    hiringManager: 'Mike Johnson',
    project: 'AI Platform'
  },
  {
    id: '4',
    title: 'Software Developer',
    location: 'Mumbai',
    workType: 'Pune/Hybrid',
    status: 'active',
    candidateCount: 0,
    experience: '1 year',
    experienceRequired: '1-3 years of development experience',
    employment: 'Full-time',
    budgetRange: '₹6-10 LPA',
    budget: '₹6-10 LPA',
    industry: 'Technology',
    postedDate: '0 day ago',
    description: 'Full-stack software developer position.',
    qualifications: [
      { text: "Bachelor's degree in Computer Science", mandatory: true },
      { text: "1-3 years of development experience", mandatory: false }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    recruiterNotes: '',
    totalCandidates: 0,
    shortlisted: 0,
    inScreening: 0,
    offersSent: 0,
    lastUpdated: '4 hours ago',
    priority: 'medium',
    expectedJoining: '2024-02-20',
    hiringManager: 'Sarah Wilson',
    project: 'E-commerce App'
  },
  {
    id: '5',
    title: 'Sr Front End Developer', 
    location: 'Pune',
    workType: 'Pune, Maharashtra',
    status: 'active',
    candidateCount: 0,
    experience: '5 years',
    experienceRequired: '5+ years of frontend development experience',
    employment: 'Full-time',
    budgetRange: '₹12-18 LPA',
    budget: '₹12-18 LPA',
    industry: 'Technology',
    postedDate: '0 day ago',
    description: 'Senior frontend developer with React expertise.',
    qualifications: [
      { text: "5+ years of frontend development experience", mandatory: true },
      { text: "Expert in React and modern JavaScript", mandatory: true }
    ],
    skills: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
    recruiterNotes: '',
    totalCandidates: 0,
    shortlisted: 0,
    inScreening: 0,
    offersSent: 0,
    lastUpdated: '5 hours ago',
    priority: 'low',
    expectedJoining: '2024-03-15',
    hiringManager: 'Alex Brown',
    project: 'Mobile Banking'
  }
];

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Janhavi Sharma',
    jobId: '2',
    stage: 'fitment',
    status: 'High Potential',
    skills: ['Java', 'React', 'SQL'],
    fitmentScore: 85,
    fitmentSummary: 'Strong technical skills in Java and React, perfect match for internship role',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    statusColor: 'green'
  },
  {
    id: '3',
    name: 'Priya Patel',
    jobId: '2',
    stage: 'fitment',
    status: 'High Potential',
    skills: ['Python', 'Django', 'HTML', 'CSS'],
    fitmentScore: 72,
    fitmentSummary: 'Good backend skills with Python, needs frontend experience with React',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    statusColor: 'green'
  },
  {
    id: '4',
    name: 'Rahul Singh',
    jobId: '2',
    stage: 'fitment',
    status: 'Needs Evaluation',
    skills: ['JavaScript', 'Node.js', 'MongoDB'],
    fitmentScore: 68,
    fitmentSummary: 'Strong in JavaScript and backend, lacks SQL database experience',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    statusColor: 'yellow'
  },
  {
    id: '5',
    name: 'Anita Desai',
    jobId: '2',
    stage: 'fitment',
    status: 'Needs Evaluation',
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    fitmentScore: 63,
    fitmentSummary: 'Excellent frontend skills, needs backend development experience',
    profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    statusColor: 'yellow'
  },
  {
    id: '6',
    name: 'Vikram Kumar',
    jobId: '2',
    stage: 'fitment',
    status: 'Low Potential',
    skills: ['Java', 'Spring Boot', 'MySQL'],
    fitmentScore: 58,
    fitmentSummary: 'Strong backend foundation, needs modern frontend framework experience',
    profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    statusColor: 'red'
  },
  {
    id: '2', 
    name: 'Aarya Ranpise',
    jobId: '2',
    stage: 'technical',
    status: 'Technical Assessment',
    skills: ['Python', 'JavaScript', 'Node.js'],
    fitmentScore: 85,
    fitmentSummary: 'Excellent technical skills demonstrated in assessment, strong problem-solving abilities',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    statusColor: 'green'
  }
];

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('information');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('priority');
  const [filters, setFilters] = useState<any>({});

  const addJob = (newJob: Job) => {
    setJobs(prevJobs => [newJob, ...prevJobs]);
  };

  const updateCandidateFitment = (candidateId: string, newScore: number, enhancedSkills?: string[]) => {
    setCandidates(prevCandidates => 
      prevCandidates.map(candidate => 
        candidate.id === candidateId 
          ? { 
              ...candidate, 
              fitmentScore: newScore,
              skills: enhancedSkills || candidate.skills
            }
          : candidate
      )
    );
  };

  const updateCandidateSkills = (candidateId: string, newSkills: string[]) => {
    setCandidates(prevCandidates => 
      prevCandidates.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, skills: newSkills }
          : candidate
      )
    );
  };
  const getSelectedJob = () => jobs.find(job => job.id === selectedJobId);
  
  const getCandidatesForJob = (jobId: string) => 
    candidates.filter(candidate => candidate.jobId === jobId);

  const getFilteredAndSortedJobs = () => {
    let filteredJobs = [...jobs];

    // Apply search filter
    if (searchTerm) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.employmentType?.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.employmentType.includes(job.employment)
      );
    }

    if (filters.location?.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.location.some((loc: string) => 
          job.location.includes(loc) || job.workType.includes(loc)
        )
      );
    }

    if (filters.hiringManager?.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.hiringManager.includes(job.hiringManager)
      );
    }

    if (filters.project?.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.project.includes(job.project)
      );
    }

    // Apply sorting
    filteredJobs.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        case 'aging':
          return new Date(a.postedDate === '0 day ago' ? Date.now() : Date.now() - 86400000).getTime() - new Date(b.postedDate === '0 day ago' ? Date.now() : Date.now() - 86400000).getTime();
        case 'joining':
          return new Date(a.expectedJoining || '2024-12-31').getTime() - new Date(b.expectedJoining || '2024-12-31').getTime();
        default:
          return 0;
      }
    });

    return filteredJobs;
  };
  return (
    <JobContext.Provider value={{
      jobs,
      candidates,
      addJob,
      updateCandidateFitment,
      updateCandidateSkills,
      selectedJobId,
      selectedTab,
      searchTerm,
      sortBy,
      filters,
      setSelectedJobId,
      setSelectedTab,
      setSearchTerm,
      setSortBy,
      setFilters,
      getSelectedJob,
      getCandidatesForJob,
      getFilteredAndSortedJobs,
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};