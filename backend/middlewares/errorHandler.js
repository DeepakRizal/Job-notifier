export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went Wrong!";

  console.log(err.message);

  console.log(err.stack);

  res.status(statusCode).json({
    success: false,
    err: message,
    stack: err.stack,
  });
};
