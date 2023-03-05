const errorHandler = async (err, req, res, next) => {
    const errorStatusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Something went wrong';

    return res.status(errorStatusCode).json({ statusCode: errorStatusCode, msg: errorMessage });
};

module.exports = { errorHandler };
