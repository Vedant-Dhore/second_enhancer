import React from 'react';
import { ChevronDown, MoreVertical, Eye, User, Wand2, Download, FileText } from 'lucide-react';
import { useJob } from '../contexts/JobContext';
import ResumeEnhancer from './ResumeEnhancer';
import ResumeViewer from './ResumeViewer';

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

const CandidatesKanban: React.FC = () => {
  const { selectedJobId, getCandidatesForJob, updateCandidateFitment, getSelectedJob } = useJob();
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [showResumeEnhancer, setShowResumeEnhancer] = React.useState(false);
  const [showResumeViewer, setShowResumeViewer] = React.useState(false);
  const [candidateMenuOpen, setCandidateMenuOpen] = React.useState<string | null>(null);
  
  const candidates = selectedJobId ? getCandidatesForJob(selectedJobId) : [];
  const selectedJob = getSelectedJob();
  
  const getCandidatesByStage = (stage: string) => 
    candidates.filter(candidate => candidate.stage === stage);

  const fitmentCandidates = getCandidatesByStage('fitment');
  const basicScreeningCandidates = getCandidatesByStage('basic_screening');
  const technicalCandidates = getCandidatesByStage('technical');

  const getStatusColorClass = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResumeEnhancer = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowResumeEnhancer(true);
  };

  const handleViewResume = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowResumeViewer(true);
    setCandidateMenuOpen(null);
  };

  const handleDownloadFitmentReport = (candidate: Candidate) => {
    alert(`Downloading fitment report for ${candidate.name}...`);
    setCandidateMenuOpen(null);
  };

  const handleSaveEnhancements = (candidateId: string, newScore: number, enhancedResume?: any) => {
    // Extract enhanced skills from the enhanced resume
    const enhancedSkills = enhancedResume?.skills || undefined;
    
    // Update candidate fitment score and skills in context
    if (enhancedSkills) {
      updateCandidateFitment(candidateId, newScore, enhancedSkills);
    } else {
      updateCandidateFitment(candidateId, newScore);
    }
    
    console.log(`Updated ${candidateId} fitment score to ${newScore}%`);
  };

  // Function to get current fitment score (including any in-progress enhancements)
  const getCurrentFitmentScore = (candidate: Candidate) => {
    const saveKey = `resume_enhancements_${candidate.id}_${selectedJob?.id || 'default'}`;
    const savedData = localStorage.getItem(saveKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return parsedData.fitmentScore || candidate.fitmentScore;
      } catch (error) {
        return candidate.fitmentScore;
      }
    }
    return candidate.fitmentScore;
  };

  const Column: React.FC<{ 
    title: string; 
    count: number; 
    candidates: Candidate[];
    color: string;
  }> = ({ title, count, candidates, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900">{title} ({count})</h3>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="p-4 space-y-3 min-h-[400px]">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img 
                    src={candidate.profileImage} 
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600">
                        {getCurrentFitmentScore(candidate)}% match
                      </span>
                      {/* Mini progress bar */}
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${getCurrentFitmentScore(candidate)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setCandidateMenuOpen(candidateMenuOpen === candidate.id ? null : candidate.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                
                {candidateMenuOpen === candidate.id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                    <button
                      onClick={() => handleDownloadFitmentReport(candidate)}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Fitment Report</span>
                    </button>
                    <button
                      onClick={() => handleViewResume(candidate)}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Resume</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 italic">
              "{candidate.fitmentSummary}"
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`${getStatusColorClass(candidate.statusColor)} px-2 py-1 rounded text-xs font-medium`}>
                  {candidate.status}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handleResumeEnhancer(candidate)}
                  className="p-1 hover:bg-purple-100 rounded transition-colors group"
                  title="Resume Enhancer"
                >
                  <Wand2 className="w-4 h-4 text-purple-500 group-hover:text-purple-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {candidates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No candidates in this stage
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        <Column 
          title="Fitment" 
          count={fitmentCandidates.length}
          candidates={fitmentCandidates}
          color="blue"
        />
        <Column 
          title="Basic Screening" 
          count={basicScreeningCandidates.length}
          candidates={basicScreeningCandidates}
          color="yellow"
        />
        <Column 
          title="Technical" 
          count={technicalCandidates.length}
          candidates={technicalCandidates}
          color="green"
        />
      </div>
      
      {showResumeEnhancer && selectedCandidate && (
        <ResumeEnhancer 
          candidate={selectedCandidate}
          jobId={selectedJob?.id}
          onSave={handleSaveEnhancements}
          onClose={() => {
            setShowResumeEnhancer(false);
            setSelectedCandidate(null);
          }} 
        />
      )}
      
      {showResumeViewer && selectedCandidate && (
        <ResumeViewer 
          candidate={selectedCandidate}
          onClose={() => {
            setShowResumeViewer(false);
            setSelectedCandidate(null);
          }} 
        />
      )}
    </div>
  );
};

export default CandidatesKanban;