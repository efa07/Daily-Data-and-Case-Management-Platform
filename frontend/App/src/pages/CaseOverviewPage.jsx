import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CaseOverviewPage.css';

const CaseOverviewPage = () => {
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
    dueDate: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentCaseId, setCurrentCaseId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [comments, setComments] = useState({}); // Store comments for each case
  const [newComment, setNewComment] = useState(''); // Store new comment input
  const [selectedCaseId, setSelectedCaseId] = useState(null); // Track which case's comments are being viewed
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user ? user.username : 'Guest';

  // Toast notification functions
  const notifySuccess = (message) => {
    toast.success(message);
  };

  const notifyError = (message) => {
    toast.error(message);
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
      setFormData((prevFormData) => ({
        ...prevFormData,
        assignedTo: decodedToken.id, // Automatically assign the user ID to the case
      }));
    }
  };

  // Fetch cases assigned to the user
  const fetchCases = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/cases');
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
      notifyError('Error fetching cases!');
    }
  };

  // Fetch comments for a specific case
  const fetchComments = async (caseId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/comment/${caseId}`);
      setComments((prevComments) => ({
        ...prevComments,
        [caseId]: data, // Store comments for the specific case
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      notifyError('Error fetching comments!');
    }
  };

  // Handle adding a new comment
  const handleAddComment = async (caseId) => {
    if (!newComment.trim()) {
      notifyError('Comment cannot be empty!');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/comment/${caseId}`, {
        commenter: username,
        comment: newComment,
      });
      setNewComment(''); // Clear the input field
      fetchComments(caseId); // Refresh comments
      notifySuccess('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      notifyError('Error adding comment!');
    }
  };

  // Open modal and fetch comments for the selected case
  const openCommentsModal = async (caseId) => {
    setSelectedCaseId(caseId);
    setIsModalOpen(true);

    // Fetch comments if not already fetched
    if (!comments[caseId]) {
      await fetchComments(caseId);
    }
  };

  // Close modal
  const closeCommentsModal = () => {
    setIsModalOpen(false);
    setSelectedCaseId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
              </div>
              <div className="case-card-body">
                <p>
                  <strong>Description:</strong> {caseItem.description}
                </p>
                <p>
                  <strong>Case ID:</strong> {caseItem._id}
                </p>
                <p>
                  <strong>Priority:</strong>{' '}
                  <span className={`priority-${caseItem.priority.toLowerCase()}`}>
                    {caseItem.priority}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`status-${caseItem.status.toLowerCase().replace(' ', '-')}`}
                  >
                    {caseItem.status}
                  </span>
                </p>
                <p>
                  <strong>Created by:</strong> {username ? username : 'Guest'}
                </p>
                <p>
                  <strong>Due Date:</strong>{' '}
                  {caseItem.dueDate ? new Date(caseItem.dueDate).toLocaleDateString() : 'N/A'}
                </p>

                {/* Add Comment Form */}
                <div className="add-comment">
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={() => handleAddComment(caseItem._id)}>Add Comment</button>
                  <button onClick={() => openCommentsModal(caseItem._id)}>View Comments</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-cases">No cases found.</p>
        )}
      </div>

      {/* Comments Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Comments</h3>
              <button onClick={closeCommentsModal} className="close-button">
                &times;
              </button>
            </div>
            <div className="modal-body">
              {comments[selectedCaseId]?.length > 0 ? (
                comments[selectedCaseId].map((comment, index) => (
                  <div key={index} className="comment">
                    <p>
                      <strong>{comment.commenter}:</strong> {comment.comment}
                    </p>
                    <small>{new Date(comment.createdAt).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseOverviewPage;