import express from 'express';
import mongoose from 'mongoose';
import Case from '../models/Case.js';

const router = express.Router();

// Create a new case
router.post('/', async (req, res) => {
    try {
        console.log('Received case data:', req.body);
        
        // Create a new object without assignedTo first
        const caseData = { ...req.body };
        
        // Handle assignedTo separately
        if (req.body.assignedTo && mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
            caseData.assignedTo = new mongoose.Types.ObjectId(req.body.assignedTo);
        }

        const newCase = new Case(caseData);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        console.error("Error creating case:", error);
        res.status(500).json({ 
            error: 'Failed to create case',
            details: error.message 
        });
    }
});

// Get all cases
router.get('/', async (req, res) => {
    try {
        const cases = await Case.find()
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        console.error("Error retrieving cases:", error);
        res.status(500).json({ error: 'Failed to retrieve cases' });
    }
});

// Get a single case by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        const caseItem = await Case.findById(req.params.id)
            .populate('assignedTo', 'name email');
        
        if (!caseItem) {
            return res.status(404).json({ error: 'Case not found' });
        }
        res.json(caseItem);
    } catch (error) {
        console.error("Error retrieving case:", error);
        res.status(500).json({ error: 'Failed to retrieve case' });
    }
});

// Update a case by ID
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        const updateData = { ...req.body };
        
        // Handle assignedTo conversion
        if (req.body.assignedTo && mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
            updateData.assignedTo = new mongoose.Types.ObjectId(req.body.assignedTo);
        }

        const updatedCase = await Case.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!updatedCase) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json(updatedCase);
    } catch (error) {
        console.error("Error updating case:", error);
        res.status(500).json({ error: 'Failed to update case' });
    }
});

// Delete a case by ID
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        const deletedCase = await Case.findByIdAndDelete(req.params.id);
        
        if (!deletedCase) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json({ message: 'Case deleted successfully' });
    } catch (error) {
        console.error("Error deleting case:", error);
        res.status(500).json({ error: 'Failed to delete case' });
    }
});

export default router;