import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CaseManagement.css";

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
    dueDate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentCaseId, setCurrentCaseId] = useState(null);

  // Fetch cases
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/cases');
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Update case
        await axios.put(`http://localhost:5000/api/cases/${currentCaseId}`, formData);
      } else {
        // Create case
        await axios.post('http://localhost:5000/api/cases', formData);
      }
      // Reset form data
      setFormData({ title: '', description: '', priority: 'Medium', status: 'Open', assignedTo: '', dueDate: '' });
      setEditMode(false);
      fetchCases();
    } catch (error) {
      console.error("Error saving case:", error);
    }
  };

  const handleEdit = (caseItem) => {
    setFormData({
      title: caseItem.title,
      description: caseItem.description,
      priority: caseItem.priority,
      status: caseItem.status,
      assignedTo: caseItem.assignedTo || '', // Ensure it's not undefined
      dueDate: caseItem.dueDate ? caseItem.dueDate.split('T')[0] : ''
    });
    setCurrentCaseId(caseItem._id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cases/${id}`);
      fetchCases();
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  return (
    <div className="case-management">
      <h2>Case Management</h2>

      {/* Case List */}
      <div className="case-list">
        <h3>Cases</h3>
        {cases.length > 0 ? (
          cases.map((caseItem) => (
            <div key={caseItem._id} className="case-item">
              <h4>{caseItem.title}</h4>
              <p>Description: {caseItem.description}</p>
              <p>Priority: {caseItem.priority}</p>
              <p>Status: {caseItem.status}</p>
              <p>Assigned To: {caseItem.assignedTo ? caseItem.assignedTo : 'N/A'}</p>
              <p>Due Date: {caseItem.dueDate ? new Date(caseItem.dueDate).toLocaleDateString() : 'N/A'}</p>
              <button onClick={() => handleEdit(caseItem)}>Edit</button>
              <button onClick={() => handleDelete(caseItem._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No cases found.</p>
        )}
      </div>

      {/* Case Form */}
      <div className="case-form">
        <h3>{editMode ? 'Edit Case' : 'Add New Case'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <input type="text" name="assignedTo" placeholder="Assigned To (User ID)" value={formData.assignedTo} onChange={handleChange} />
          <input type="date" name="dueDate" placeholder="Due Date" value={formData.dueDate} onChange={handleChange} />
          <button type="submit">{editMode ? 'Update Case' : 'Create Case'}</button>
          {editMode && <button type="button" onClick={() => setEditMode(false)}>Cancel</button>}
        </form>
      </div>
    </div>
  );
};

export default CaseManagement;
