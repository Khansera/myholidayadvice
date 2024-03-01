const AllowedIps = ['192.168.1.4', '::1','::ffff:192.168.1.3'];

const ipFilterMiddleware = (req, res, next) => {
  const clientIp = req.ip;
  console.log(clientIp)
  if (AllowedIps.includes(clientIp)) {
    next();
  } else {
    res.status(404).send('Not found');
  }
};
module.exports={ipFilterMiddleware};