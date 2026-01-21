export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went Wrong!";

  console.log(err.message);

  console.log(err.stack);

  const isProd = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
