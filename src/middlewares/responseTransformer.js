// Gelen yanıtı dönüştüren middleware
const responseTransformer = (req, res, next) => {
    const oldSend = res.send;
    res.send = (data) => {
      const transformedData = {
        status: 'success',
        timestamp: new Date(),
        data: JSON.parse(data)
      };
      oldSend.call(res, JSON.stringify(transformedData));
    };
    next();
  };
  
  module.exports = responseTransformer;