import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Edit, Save, X, Search, BarChart3, ChevronRight } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button, Input } from '../../components/common/UIComponents';
import Modal from '../../components/common/Modal';
import IntakeModal from '../../components/common/IntakeModal';
import { fetchInstitutions, createInstitution, updateInstitution, deleteInstitution, createIntake } from './institutionSlice';

const InstitutionManagement = () => {
  const dispatch = useDispatch();
  const { institutions, loading } = useSelector((state) => state.institutions);

  useEffect(() => {
    dispatch(fetchInstitutions({ page: 1, limit: 10 }));
  }, [dispatch]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedInstitutionForCourses, setSelectedInstitutionForCourses] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    district: '',
    type: 'GOVERNMENT',
    courses: []
  });

  const [newCourse, setNewCourse] = useState({ name: '', level: 'DIPLOMA' });
  const [currentId, setCurrentId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    if (newCourse.name.trim()) {
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, { ...newCourse }]
      }));
      setNewCourse({ name: '', level: 'DIPLOMA' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId) {
      dispatch(updateInstitution({ id: currentId, data: formData }));
    } else {
      dispatch(createInstitution(formData));
    }
    resetForm();
  };

  const handleEdit = (institution) => {
    setFormData({
      name: institution.name,
      code: institution.code,
      district: institution.district,
      type: institution.type,
      courses: institution.courses || []
    });
    setCurrentId(institution.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this institution?')) {
      dispatch(deleteInstitution(id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', district: '', type: 'GOVERNMENT', courses: [] });
    setNewCourse({ name: '', level: 'DIPLOMA' });
    setCurrentId(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'name', label: 'Institution Name' },
    { key: 'code', label: 'Code' },
    { key: 'district', label: 'District' },
    { 
      key: 'type', 
      label: 'Type',
      render: (val) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 uppercase">
          {val}
        </span>
      )
    },
    {
      key: 'courses',
      label: 'Courses',
      render: (courses) => (
        <span className="text-xs font-bold text-secondary bg-muted px-2 py-1 rounded-md">
          {courses?.length || 0} Courses
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background border border-border p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search institutions..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border focus:bg-background focus:border-accent rounded-lg text-sm transition-all outline-none"
          />
        </div>
        <Button 
          variant="accent" 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>Add Institution</span>
        </Button>
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={resetForm} 
        title={isEditing ? 'Edit Institution' : 'Add New Institution'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest border-b border-border pb-1">Basic Information</h4>
            <Input 
              label="Institution Name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g. Government Polytechnic, Pune"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Institution Code" 
                name="code" 
                value={formData.code} 
                onChange={handleInputChange} 
                placeholder="e.g. 1001"
                required
              />
              <Input 
                label="District" 
                name="district" 
                value={formData.district} 
                onChange={handleInputChange} 
                placeholder="e.g. Pune"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-secondary">Type</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm"
              >
                <option value="GOVERNMENT">Government</option>
                <option value="AIDED">Aided</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>

          {/* Courses Section */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-secondary uppercase tracking-widest">Courses Offered</h4>
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                {formData.courses.length} ACTIVE
              </span>
            </div>
            
            {/* Dynamic Course List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {formData.courses.length === 0 ? (
                <div className="col-span-full py-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-secondary/40 bg-muted/5">
                  <Plus size={24} className="mb-2 opacity-20" />
                  <p className="text-xs font-medium">No courses added yet</p>
                </div>
              ) : (
                formData.courses.map((course, index) => (
                  <div key={index} className="group flex items-center justify-between bg-muted/40 hover:bg-muted/60 border border-border p-2.5 rounded-xl transition-all">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-foreground break-words">{course.name}</span>
                      <span className="text-[10px] text-secondary font-semibold uppercase tracking-tight">{course.level}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="p-1.5 h-auto text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() => {
                        const newCourses = [...formData.courses];
                        newCourses.splice(index, 1);
                        setFormData(prev => ({ ...prev, courses: newCourses }));
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Add Course Sub-form */}
            <div className="bg-muted/20 p-4 rounded-2xl border border-border space-y-4 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input 
                    type="text"
                    placeholder="e.g. Computer Engineering" 
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-10 px-4 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <select 
                    value={newCourse.level}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-xs font-bold uppercase"
                  >
                    <option value="DIPLOMA">Diploma</option>
                    <option value="UG">Under Graduate</option>
                    <option value="PG">Post Graduate</option>
                  </select>
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddCourse}
                className="w-full py-2.5 h-auto text-xs font-bold uppercase tracking-wider bg-background hover:bg-accent hover:text-white transition-all border-dashed"
              >
                <Plus size={14} className="mr-2" /> Add Course to List
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="flex items-center">
              <Save size={18} className="mr-2" />
              {isEditing ? 'Update Institution' : 'Create Institution'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Courses & Intake Modal */}
      <Modal 
        isOpen={!!selectedInstitutionForCourses} 
        onClose={() => {
          setSelectedInstitutionForCourses(null);
          setSelectedCourse(null);
        }}
        title={selectedCourse ? `Manage Intake: ${selectedCourse.name}` : `Courses: ${selectedInstitutionForCourses?.name}`}
      >
        {!selectedCourse ? (
          <div className="space-y-3">
            {selectedInstitutionForCourses?.courses?.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all group cursor-default">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">{course.name}</span>
                  <span className="text-xs text-secondary font-semibold uppercase tracking-wider">{course.level}</span>
                </div>
                <Button 
                  variant="accent" 
                  onClick={() => setSelectedCourse(course)}
                  className="text-xs px-4 py-2 h-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-lg"
                >
                  <BarChart3 size={14} className="mr-2" /> Manage Intake
                </Button>
              </div>
            ))}
            {(!selectedInstitutionForCourses?.courses || selectedInstitutionForCourses.courses.length === 0) && (
              <div className="py-10 text-center text-secondary italic">No courses registered for this institution.</div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Inline Intake Form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const intakeData = {
                course_id: selectedCourse.id,
                academic_year: formData.get('academic_year'),
                approved_seats: parseInt(formData.get('approved_seats') || '0'),
                actual_admitted: parseInt(formData.get('actual_admitted') || '0')
              };
              
              console.log('--- STARTING INTAKE SUBMISSION ---');
              console.log('Data:', intakeData);
              
              try {
                await dispatch(createIntake(intakeData)).unwrap();
                console.log('Submission Successful');
                setSelectedCourse(null);
              } catch (err) {
                console.error('Submission Failed:', err);
                alert('Failed to save intake: ' + (err.message || err));
              }
            }} className="space-y-4">
              <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 flex items-center mb-2">
                <BarChart3 className="text-accent mr-3" size={24} />
                <div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Level</p>
                  <p className="text-sm font-bold text-foreground">{selectedCourse.level}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Input 
                  label="Academic Year"
                  name="academic_year"
                  defaultValue="2026-2027"
                  placeholder="e.g. 2026-2027"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Approved Seats"
                    name="approved_seats"
                    type="number"
                    defaultValue={60}
                    required
                  />
                  <Input 
                    label="Actual Admitted"
                    name="actual_admitted"
                    type="number"
                    defaultValue={0}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
                <Button type="button" variant="ghost" onClick={() => setSelectedCourse(null)} className="text-secondary hover:text-foreground">
                  <X size={18} className="mr-2" /> Back to Courses
                </Button>
                <Button type="submit" variant="accent" className="px-8">
                  <Save size={18} className="mr-2" />
                  Save Intake
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Table Section */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground">Registered Institutions</h3>
        </div>
        {loading ? (
          <div className="py-20 text-center text-secondary italic">Updating list...</div>
        ) : (
          <Table 
            columns={columns} 
            data={institutions} 
            actions={(row) => (
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto text-accent hover:bg-accent/10"
                  onClick={() => setSelectedInstitutionForCourses(row)}
                  title="View Courses & Intake"
                >
                  <BarChart3 size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto text-blue-500 hover:bg-blue-500/10"
                  onClick={() => handleEdit(row)}
                  title="Edit Institution"
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDelete(row.id)}
                  title="Delete Institution"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default InstitutionManagement;
