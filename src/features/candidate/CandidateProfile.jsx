import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Briefcase, GraduationCap, Save, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../components/common/UIComponents';
import { updateProfile, updateExperience, updateQualifications, resetState } from './candidateSlice';

const CandidateProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.candidate);

  // Section State
  const [activeTab, setActiveTab] = useState('basic');

  // Basic Profile State
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone_number || '',
    date_of_birth: '',
    gender: 'MALE',
    category: 'OPEN',
    address: ''
  });

  // Experience State
  const [experiences, setExperiences] = useState([
    { organization: '', designation: '', from_date: '', to_date: '', experience_type: 'TEACHING', description: '' }
  ]);

  // Qualification State
  const [qualifications, setQualifications] = useState([
    { degree: '', specialization: '', university: '', year_of_passing: '', percentage: '', grade: '' }
  ]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const handleExperienceSubmit = (e) => {
    e.preventDefault();
    dispatch(updateExperience(experiences));
  };

  const handleQualificationSubmit = (e) => {
    e.preventDefault();
    dispatch(updateQualifications(qualifications));
  };

  const addExperience = () => {
    setExperiences([...experiences, { organization: '', designation: '', from_date: '', to_date: '', experience_type: 'TEACHING', description: '' }]);
  };

  const removeExperience = (index) => {
    const newExp = experiences.filter((_, i) => i !== index);
    setExperiences(newExp.length ? newExp : [{ organization: '', designation: '', from_date: '', to_date: '', experience_type: 'TEACHING', description: '' }]);
  };

  const addQualification = () => {
    setQualifications([...qualifications, { degree: '', specialization: '', university: '', year_of_passing: '', percentage: '', grade: '' }]);
  };

  const removeQualification = (index) => {
    const newQual = qualifications.filter((_, i) => i !== index);
    setQualifications(newQual.length ? newQual : [{ degree: '', specialization: '', university: '', year_of_passing: '', percentage: '', grade: '' }]);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(resetState()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-accent p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Complete Your Profile</h1>
              <p className="text-accent-foreground/80 text-sm">Provide your details to start applying for vacancies</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-muted/30">
          <button 
            onClick={() => setActiveTab('basic')}
            className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'basic' ? 'border-accent text-accent bg-background' : 'border-transparent text-secondary hover:bg-muted'}`}
          >
            <User size={18} className="mr-2" /> Basic Info
          </button>
          <button 
            onClick={() => setActiveTab('education')}
            className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'education' ? 'border-accent text-accent bg-background' : 'border-transparent text-secondary hover:bg-muted'}`}
          >
            <GraduationCap size={18} className="mr-2" /> Education
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'experience' ? 'border-accent text-accent bg-background' : 'border-transparent text-secondary hover:bg-muted'}`}
          >
            <Briefcase size={18} className="mr-2" /> Experience
          </button>
        </div>

        {/* Status Messages */}
        <div className="px-8 pt-4">
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-xl flex items-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} className="mr-2" /> Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex items-center text-sm font-medium">
              <AlertCircle size={18} className="mr-2" /> {error}
            </div>
          )}
        </div>

        <div className="p-8">
          {activeTab === 'basic' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="Full Name" 
                  value={profileData.full_name} 
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                  placeholder="Enter full name"
                />
                <Input 
                  label="Phone Number" 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
                <Input 
                  label="Date of Birth" 
                  type="date"
                  value={profileData.date_of_birth} 
                  onChange={(e) => setProfileData({...profileData, date_of_birth: e.target.value})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary uppercase tracking-wider">Gender</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all"
                    value={profileData.gender}
                    onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary uppercase tracking-wider">Category</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all"
                    value={profileData.category}
                    onChange={(e) => setProfileData({...profileData, category: e.target.value})}
                  >
                    <option value="OPEN">Open</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-secondary uppercase tracking-wider">Address</label>
                  <textarea 
                    className="w-full p-4 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all min-h-[100px]"
                    placeholder="Enter full address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="accent" className="px-8 py-3" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile Details'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'education' && (
            <form onSubmit={handleQualificationSubmit} className="space-y-8">
              {qualifications.map((qual, index) => (
                <div key={index} className="bg-muted/10 p-6 rounded-2xl border border-border relative group">
                  <button 
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="absolute top-4 right-4 text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input 
                      label="Degree" 
                      value={qual.degree} 
                      onChange={(e) => {
                        const newQuals = [...qualifications];
                        newQuals[index].degree = e.target.value;
                        setQualifications(newQuals);
                      }}
                      placeholder="e.g. B.Tech, M.Tech"
                    />
                    <Input 
                      label="Specialization" 
                      value={qual.specialization} 
                      onChange={(e) => {
                        const newQuals = [...qualifications];
                        newQuals[index].specialization = e.target.value;
                        setQualifications(newQuals);
                      }}
                      placeholder="e.g. Computer Science"
                    />
                    <Input 
                      label="University" 
                      value={qual.university} 
                      onChange={(e) => {
                        const newQuals = [...qualifications];
                        newQuals[index].university = e.target.value;
                        setQualifications(newQuals);
                      }}
                      placeholder="e.g. Pune University"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        label="Year of Passing" 
                        type="number"
                        value={qual.year_of_passing} 
                        onChange={(e) => {
                          const newQuals = [...qualifications];
                          newQuals[index].year_of_passing = parseInt(e.target.value);
                          setQualifications(newQuals);
                        }}
                      />
                      <Input 
                        label="Percentage" 
                        type="number"
                        step="0.01"
                        value={qual.percentage} 
                        onChange={(e) => {
                          const newQuals = [...qualifications];
                          newQuals[index].percentage = parseFloat(e.target.value);
                          setQualifications(newQuals);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button type="button" variant="outline" onClick={addQualification} className="w-full sm:w-auto">
                  <Plus size={18} className="mr-2" /> Add Another Qualification
                </Button>
                <Button variant="accent" className="w-full sm:w-auto px-12" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Qualifications'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'experience' && (
            <form onSubmit={handleExperienceSubmit} className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="bg-muted/10 p-6 rounded-2xl border border-border relative group">
                  <button 
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-4 right-4 text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input 
                      label="Organization" 
                      value={exp.organization} 
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[index].organization = e.target.value;
                        setExperiences(newExp);
                      }}
                      placeholder="e.g. ABC Polytechnic"
                    />
                    <Input 
                      label="Designation" 
                      value={exp.designation} 
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[index].designation = e.target.value;
                        setExperiences(newExp);
                      }}
                      placeholder="e.g. Lecturer"
                    />
                    <Input 
                      label="From Date" 
                      type="date"
                      value={exp.from_date} 
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[index].from_date = e.target.value;
                        setExperiences(newExp);
                      }}
                    />
                    <Input 
                      label="To Date" 
                      type="date"
                      value={exp.to_date} 
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[index].to_date = e.target.value;
                        setExperiences(newExp);
                      }}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-wider">Experience Type</label>
                      <select 
                        className="w-full h-11 px-4 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all"
                        value={exp.experience_type}
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[index].experience_type = e.target.value;
                          setExperiences(newExp);
                        }}
                      >
                        <option value="TEACHING">Teaching</option>
                        <option value="INDUSTRIAL">Industrial</option>
                        <option value="RESEARCH">Research</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-wider">Description</label>
                      <textarea 
                        className="w-full p-4 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all min-h-[80px]"
                        placeholder="Key responsibilities and achievements"
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[index].description = e.target.value;
                          setExperiences(newExp);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button type="button" variant="outline" onClick={addExperience} className="w-full sm:w-auto">
                  <Plus size={18} className="mr-2" /> Add More Experience
                </Button>
                <Button variant="accent" className="w-full sm:w-auto px-12" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Experience Details'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
