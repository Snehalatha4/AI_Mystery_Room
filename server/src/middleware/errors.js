export class HttpError extends Error {
  constructor(status, message, code = 'REQUEST_ERROR') { super(message); this.status = status; this.code = code; }
}
export function notFound(_req, _res, next) { next(new HttpError(404, 'That resource was not found.', 'NOT_FOUND')); }
export function errorHandler(error, _req, res, _next) {
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error.message);
  res.status(status).json({ success: false, error: { code: error.code || 'INTERNAL_ERROR', message: status >= 500 ? 'Something went wrong on our side. Please try again.' : error.message } });
}
