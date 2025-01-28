const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Hataları konsola yazdır
  
    res.status(500).json({
      message: 'Something went wrong!',
      error: err.message,
    });
  };
  
  module.exports = errorHandler;