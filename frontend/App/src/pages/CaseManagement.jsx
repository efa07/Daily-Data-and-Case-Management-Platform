import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./CaseManagement.css";

// Analyst Case Management Component
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
  const [userRole, setUserRole] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user ? user.username : 'Guest'; 

  // Toast notification functions
  const notifySuccess = (message) => {
    toast.success(message, {
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
    });
  };

  // Fetch cases and user info
  useEffect(() => {
    fetchCases();
    setUserRoleFromToken();
  }, []);

  // Decode JWT to get the user ID and role
  const setUserRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role); // Store the user role
      setFormData(prevFormData => ({
        ...prevFormData,
        assignedTo: decodedToken.id // Automatically assign the user ID to the case
      }));
    }
  };

  // Fetch cases assigned to the user
  const fetchCases = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/cases');
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
      notifyError("Error fetching cases!");
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
        await axios.put(`http://localhost:5000/api/cases/${currentCaseId}`, formData);
        notifySuccess("Case updated successfully!");
      } else {
        await axios.post('http://localhost:5000/api/cases', formData);
        notifySuccess("Case created successfully!");
      }
      setFormData({ title: '', description: '', priority: 'Medium', status: 'Open', assignedTo: formData.assignedTo, dueDate: '' });
      setEditMode(false);
      fetchCases();
    } catch (error) {
      console.error("Error saving case:", error);
      notifyError("An error occurred while saving the case.");
    }
  };

  const handleEdit = (caseItem) => {
    setFormData({
      title: caseItem.title,
      description: caseItem.description,
      priority: caseItem.priority,
      status: caseItem.status,
      assignedTo: caseItem.assignedTo,
      dueDate: caseItem.dueDate ? caseItem.dueDate.split('T')[0] : ''
    });
    setCurrentCaseId(caseItem._id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cases/${id}`);
      notifySuccess("Case deleted successfully!");
      fetchCases();
    } catch (error) {
      console.error("Error deleting case:", error);
      notifyError("An error occurred while deleting the case.");
    }
  };

  return (
    <div className="case-management">
      <h2 className="ch2">Case Management - Analyst</h2>

      {/* Case List */}
      <div className="case-list">
  {cases.length > 0 ? (
    cases.map((caseItem) => (
      <div key={caseItem._id} className="case-card">
        <div className="case-card-header">
          <h4>{caseItem.title}</h4>
          <div className="case-card-actions">
            <button onClick={() => handleEdit(caseItem)} className="edit">Edit</button>
            <button onClick={() => handleDelete(caseItem._id)} className="delete">Delete</button>
          </div>
        </div>
        <div className="case-card-body">
          <p><strong>Description:</strong> {caseItem.description}</p>
          <p><strong>Priority:</strong> <span className={`priority-${caseItem.priority.toLowerCase()}`}>{caseItem.priority}</span></p>
          <p><strong>Status:</strong> <span className={`status-${caseItem.status.toLowerCase().replace(' ', '-')}`}>{caseItem.status}</span></p>
          <p><strong>Created by:</strong> {username ? username : 'Guest'}</p>
          <p><strong>Due Date:</strong> {caseItem.dueDate ? new Date(caseItem.dueDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="no-cases">No cases found.</p>
  )}
</div>

      {/* Case Form */}
      {/* {userRole === 'Analyst' && ( */}
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
            <input type="date" name="dueDate" placeholder="Due Date" value={formData.dueDate} onChange={handleChange} />
            <button type="submit">{editMode ? 'Update Case' : 'Create Case'}</button>
            {editMode && <button type="button" onClick={() => setEditMode(false)}>Cancel</button>}
          </form>
        </div>
      
      <ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

    </div>
  );
};

export default CaseManagement;
