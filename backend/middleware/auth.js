import jwt from 'jsonwebtoken';

/**
 * Verify Bearer JWT token middleware and attach owner document
 */
export async function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token provided' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach minimal owner info; ensure owner exists
    const Owner = (await import('../models/Owner.js')).Owner;
    const owner = await Owner.findById(payload.id).lean();
    if (!owner) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.owner = { id: payload.id, email: payload.email, name: owner.name, businessName: owner.businessName };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}
