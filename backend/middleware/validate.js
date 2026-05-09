import { validationResult } from 'express-validator';

/**
 * validate: wrapper for express-validator middlewares
 * @param {Array|Function} validators - array of validator middlewares
 */
export function validate(validators) {
  return async (req, res, next) => {
    try {
      if (Array.isArray(validators)) {
        for (const v of validators) {
          // each validator is a middleware
          // run it
          // express-validator returns functions that expect (req,res,next)
          // call and await if it returns a promise
          await v.run(req);
        }
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ success: false, message: 'Validation failed', data: errors.array() });
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
