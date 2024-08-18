const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()
// app.use 使用中间件cors来处理跨域
app.use(cors())

const upload = multer({ dest: 'uploads/' })

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
app.listen(3333)