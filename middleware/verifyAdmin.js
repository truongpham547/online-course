const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  var token = req.header("auth-token");
  if(!token){
    token = req.cookies["auth-cookie"];
  }
  if (!token) {
    return res
      .status(401)
      .send({ message: "Bạn không có quyền truy cập, vui lòng đăng nhập" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if(verified.role=="admin"){
        req.user = verified;
        next();
    }else{
        return res
            .status(401)
            .send({ message: "Bạn không có quyền truy cập, vui lòng đăng nhập" });
    }

  } catch (error) {
    return res.status(400).send({ message: "Token không hợp lệ" });
  }
};
