import express from 'express';
import Case from '../models/Case.js';

const router = express.Router();

// Create a new case
router.post('/', async (req, res) => {
    try {
        // Convert assignedTo to ObjectId if it is a valid string
        if (req.body.assignedTo && mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
            req.body.assignedTo = mongoose.Types.ObjectId(req.body.assignedTo);
        }

        const newCase = new Case(req.body);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        console.error("Error creating case:", error);
        res.status(500).json({ error: 'Failed to create case' });
    }
});

// Get all cases
router.get('/', async (req, res) => {
    try {
        const cases = await Case.find().populate('assignedTo');
        res.json(cases);
    } catch (error) {
        console.error("Error retrieving cases:", error);
        res.status(500).json({ error: 'Failed to retrieve cases' });
    }
});

// Get a single case by ID
router.get('/:id', async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id).populate('assignedTo');
        if (!caseItem) return res.status(404).json({ error: 'Case not found' });
        res.json(caseItem);
    } catch (error) {
        console.error("Error retrieving case:", error);
        res.status(500).json({ error: 'Failed to retrieve case' });
    }
});

// Update a case by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCase);
    } catch (error) {
        console.error("Error updating case:", error);
        res.status(500).json({ error: 'Failed to update case' });
    }
});

// Delete a case by ID
router.delete('/:id', async (req, res) => {
    try {
        await Case.findByIdAndDelete(req.params.id);
        res.json({ message: 'Case deleted successfully' });
    } catch (error) {
        console.error("Error deleting case:", error);
        res.status(500).json({ error: 'Failed to delete case' });
    }
});

export default router;
