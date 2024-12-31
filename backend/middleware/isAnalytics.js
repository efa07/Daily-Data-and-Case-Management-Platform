import jwt from "jsonwebtoken"

// Middleware to check for 'Analyst' role
const checkAnalystRole = (req, res, next) => {
    // Extract token from headers
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the role is 'Analyst'
        if (decoded.role === 'Analyst') {
            return next(); // Proceed to the next middleware or route handler
        }

        return res.status(403).json({ message: 'Access denied. Only Analysts are allowed.' });
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

export default checkAnalystRole