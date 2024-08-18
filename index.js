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

app.listen(3333)