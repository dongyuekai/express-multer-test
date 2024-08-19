const express = require('express')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
// app.use 使用中间件cors来处理跨域
app.use(cors())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'my-uploads'));
    } catch (e) { }
    cb(null, path.join(process.cwd(), 'my-uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});
const upload = multer({ storage })

// 单文件传输
app.post('/aaa', upload.single('aaa'), function (req, res, next) {
  console.log('req.file', req.file)
  console.log('req.body', req.body)
})

// 多文件传输
app.post('/bbb', upload.array('bbb', 2), function (req, res, next) {
  console.log('req.file', req.files)
  console.log('req.body', req.body)
}, function (err, req, res, next) {
  // 超过俩文件报错处理
  if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).end('Too many files uploaded');
  }
})

// 不同字段上次文件不同情况
app.post('/ccc', upload.fields([
  { name: 'aaa', maxCount: 3 },
  { name: 'bbb', maxCount: 2 }
]), function (err, req, res, next) {
  if (err) {
    res.status(400).end('err---', err.code);
  }
  console.log('ccc/req.files', req.files);
  console.log('ccc/req.body', req.body);
})

// 如果并不知道那些字段是file 可以用any接收
app.post('/ddd', upload.any(), function (req, res, next) {
  console.log('ddd/req.files---', req.files)
  console.log('ddd/req.body---', req.body)
})

app.listen(3333)