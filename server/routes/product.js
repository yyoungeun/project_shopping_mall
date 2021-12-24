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

  let limit = req.body.limit ? parseInt(req.body.limit) : 50;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);
      if (key === "price") {
        findArgs[key] = {
          // Greater than equal
          $gte: req.body.filters[key][0],
          // Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  console.log("findArgs", findArgs);
  console.log("term", term);

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: "term" } }) // mongodb 연산자
      .populate("writer") // writer에 대한 모든 정보 가져오기
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  } else {
    // 모든 정보 가져오기 : find()
    // 조건이 있을 경우 : find({object 형식})
    Product.find(findArgs)
      .populate("writer") // writer에 대한 모든 정보 가져오기
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  }
});

module.exports = router;
