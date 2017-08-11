const express = require('express')
const algoliasearch = require('algoliasearch')

const app = express()
const client = algoliasearch('BH4D9OD16A', 'db5b2379e5ffbc33509585c35ccabba8')
const index = client.initIndex('weex_cn')

app.get('/api/robot/search', function (req, res) {
  const keyword = req.query.q ? req.query.q : ''
  if (keyword) {
    index.search(keyword, {
      hitsPerPage: 10
    }, function(err, content) {
      if (err) {
        res.json({
          "success": true,
          "errorCode": "200",
          "errorMsg": "",
          "fields": {
              "搜索结果": "weex 不小心睡着了，能再重复您的问题吗？"
          }
        })
        return
      }

      const hits = content.hits
      let resultStr = ''
      hits.forEach((item, index) => {
        let itemStr = ''
        for (var i = 1; i <= 6; i++) {
          if (item.hierarchy["lvl" + i]) {
            itemStr += item.hierarchy["lvl" + i] + ' > '
          }
        }
        itemStr = itemStr.replace(/\s*>\s*$/, '')
        itemStr = itemStr.replace(/&lt;/g, '')
        itemStr = itemStr.replace(/&gt;/, '')
        itemUrl = item.url.replace(/#.*$/,'')
        resultStr += '[' + (index + 1) + '. ' + itemStr + '](' + itemUrl + ') <br>'
      })
      if (hits.length === 0) {
        resultStr = '> weex 找不到相关结果'
      }

      res.json({
        "success": true,
        "errorCode": "200",
        "errorMsg": "",
        "fields": {
          "搜索结果": resultStr
        }
      })      
    })
  } else {
    res.json({
      "success": true,
      "errorCode": "200",
      "errorMsg": "",
      "fields": {
          "搜索结果": "weex 找不到相关结果"
      }
    })
  }
})

app.listen(8666, function () {
  console.log('Example app listening on port 8666!')
})
