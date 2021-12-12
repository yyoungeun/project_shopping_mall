const express = require("express");
const router = express.Router();
const multer = require("multer");

const { Product } = require("../models/Product");

//=================================
//             FileUpload
//=================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일 저장경로
    cb(null, "uploads/");
  },
  // 파일 이름
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장을 해주면 된다. (multer사용)
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

//=========================================
//             UploadProductPage
//=========================================

router.post("/", (req, res) => {
  // 받아온 정보들을 DB에 넣어준다.
  const product = new Product(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//=====================================
//             landingPage
//=====================================

router.post("/products", (req, res) => {
  // Product collection에 들어있는 모든 상품 정보를 가져오기

  // 모든 정보 가져오기 : find()
  // 조건이 있을 경우 : find({object 형식})
  Product.find()
    .populate("writer") // writer에 대한 모든 정보 가져오기
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, productInfo });
    });
});

module.exports = router;
