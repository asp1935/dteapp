import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, CheckCircle, Upload, AlertCircle, ArrowRight, X } from 'lucide-react';
import { Button, Input } from '../../components/common/UIComponents';
import { createApplication, uploadDocuments, submitApplication, resetApplicationState } from './applicationSlice';
import { cn } from '../../utils/cn';

const JobApplicationFlow = ({ advertisementId, advertisementTitle, onClose }) => {
  const dispatch = useDispatch();
  const { currentApplication, loading, error, success, step } = useSelector((state) => state.application);
  
  const [coverLetter, setCoverLetter] = useState('');
  const [documents, setDocuments] = useState([]);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(resetApplicationState());
    };
  }, [dispatch]);

  const handleInitialApply = (e) => {
    e.preventDefault();
    dispatch(createApplication({ advertisement_id: advertisementId, cover_letter: coverLetter }));
  };

  const handleDocumentUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    documents.forEach((file) => {
      formData.append('documents', file);
    });
    dispatch(uploadDocuments({ applicationId: currentApplication.id, formData }));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    dispatch(submitApplication({ applicationId: currentApplication.id, submissionData: { declaration_accepted: declarationAccepted } }));
  };

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  if (success) {
    return (
      <div className="p-12 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Application Submitted!</h3>
        <p className="text-secondary max-w-sm mx-auto">
          Your application for <strong>{advertisementTitle}</strong> has been successfully submitted. You can track its status in your dashboard.
        </p>
        <Button variant="accent" className="px-12" onClick={onClose}>Done</Button>
      </div>
    );
  }

  return (
    <div className="bg-background w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
        <div>
          <h3 className="text-xl font-bold text-foreground">Apply for Position</h3>
          <p className="text-xs text-secondary mt-1">{advertisementTitle}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-all text-secondary hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
          {[
            { s: 1, label: 'Apply', icon: FileText },
            { s: 2, label: 'Documents', icon: Upload },
            { s: 3, label: 'Submit', icon: CheckCircle },
          ].map((item) => (
            <div key={item.s} className="relative z-10 flex flex-col items-center group">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                step >= item.s ? "bg-accent border-accent text-white" : "bg-background border-border text-secondary"
              )}>
                <item.icon size={18} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider mt-2 transition-colors",
                step >= item.s ? "text-accent" : "text-secondary"
              )}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8 pt-0">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-500 text-sm animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="mr-3 shrink-0" />
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleInitialApply} className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Cover Letter / Statement of Interest</label>
              <textarea 
                className="w-full p-4 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all min-h-[200px] text-sm"
                placeholder="Briefly describe why you are interested in this position and why you are a good fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
              <p className="text-[10px] text-secondary">Minimum 50 characters required.</p>
            </div>
            <div className="flex justify-end">
              <Button variant="accent" className="px-8 py-3 group" disabled={loading || coverLetter.length < 10}>
                {loading ? 'Processing...' : (
                  <>
                    Next: Upload Documents <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleDocumentUpload} className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center bg-muted/5 group hover:border-accent transition-all cursor-pointer relative">
              <input 
                type="file" 
                multiple 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
              />
              <Upload className="mx-auto text-secondary mb-4 group-hover:text-accent transition-colors" size={48} />
              <h4 className="font-bold text-foreground">Click to upload required documents</h4>
              <p className="text-xs text-secondary mt-2">PDF, PNG or JPG (Max 5MB each)</p>
              
              {documents.length > 0 && (
                <div className="mt-6 space-y-2 text-left">
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest px-2">Selected Files ({documents.length})</p>
                  {documents.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        <FileText size={16} className="text-accent" />
                        <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-4">
              <Button type="button" variant="outline" onClick={() => dispatch(setStep(1))}>Back</Button>
              <Button variant="accent" className="px-8 py-3 group" disabled={loading || documents.length === 0}>
                {loading ? 'Uploading...' : (
                  <>
                    Next: Final Review <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20 space-y-4">
              <h4 className="font-bold text-accent flex items-center">
                <CheckCircle size={18} className="mr-2" /> Final Declaration
              </h4>
              <div className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  id="declaration"
                  className="mt-1 w-5 h-5 rounded border-border text-accent focus:ring-accent"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                />
                <label htmlFor="declaration" className="text-sm text-secondary leading-relaxed cursor-pointer">
                  I hereby declare that all the information provided in this application is true and correct to the best of my knowledge. I understand that any false statement or omission of material facts may result in my disqualification from the selection process or subsequent termination of services.
                </label>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-secondary uppercase tracking-wider">Application Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Position</span>
                  <span className="font-bold">{advertisementTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Documents Uploaded</span>
                  <span className="font-bold">{documents.length} Files</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={() => dispatch(setStep(2))}>Back</Button>
              <Button variant="primary" className="px-12 py-3 bg-primary text-white hover:bg-primary/90" disabled={loading || !declarationAccepted}>
                {loading ? 'Submitting...' : 'Submit Final Application'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobApplicationFlow;
