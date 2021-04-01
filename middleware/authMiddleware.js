const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    //если не GET/POST/PUT/DELETE - пропускаем и не идем дальше
    next();
  }
  try {
    //"Bearer kjsdhfsdlhfjklds" такой токен обычно имеет вид, отправляется в поле Authorization
    const token = req.headers.authorization.split(" ")[1]; //делим строку по пробелу и берем только вторую часть
    if (!token) {
      return res.status(403).json({ message: "User not authorized" });
    }
    const decodedData = jwt.verify(token, secret);
    //create new field in request for using
    req.user = decodedData;
    next();//mandatory!!!
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "User not authorized" });
  }
};
