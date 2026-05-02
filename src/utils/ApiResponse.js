class ApiResponse {
  static success(res, data, message = 'Succès', statusCode = 200, pagination = null) {
    const response = { success: true, message, data };
    if (pagination) response.pagination = pagination;
    return res.status(statusCode).json(response);
  }

  static created(res, data, message = 'Ressource créée') {
    return res.status(201).json({ success: true, message, data });
  }

  static error(res, message, statusCode = 500, errors = []) {
    const response = { success: false, message };
    if (errors.length) response.errors = errors;
    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
