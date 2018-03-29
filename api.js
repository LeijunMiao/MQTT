// exports.init = function(){
//     console.log('init');
// };
var urllib = require('urllib');
var async = require('async');
// var _ = require('lodash');

var domain = 'https://47.98.106.202:8080';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.getData = function (req, res) {
  async.auto({
    jwt: function(cb_auto){
      var url = '/api/internal/login';
      var data = {
          password: "123456",
          username: "test1"
        };
      urllib.request(domain + url,{
        method: 'POST',
        data: {
          password: "123456",
          username: "test1"
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }, function (err, data, res) {
          // console.log(err);
        if (err) {
          cb_auto(err);
        }
        else if (!err && res.statusCode == 200) {
          var r = JSON.parse(data.toString());
          if(r.jwt) {
            cb_auto(null,r.jwt)
          }
          else cb_auto('no jwt');
        } else {
          cb_auto(-1);
        }
      });
    },
    history: ['jwt',function(r,cb_auto){
      var url = '/api/devices/5e005e1901000001/datas?limit=1000&offset=0';
      urllib.request(domain + url,{
        headers: {
          'authorization': r.jwt,
          'Content-Type': 'application/json'
        }
      }, function (err, data, res) {
        if (err) {
          cb_auto(err);
        }
        else if (!err && res.statusCode == 200) {
          var r = JSON.parse(data.toString());
          cb_auto(null,r.result.slice(-20));
        } else {
          cb_auto(-1);
        }
      });
    }]
  },function(err,results){
    if(err) return res.json({
      errcode: -1,
      errmsg: err.toString()
    });
    res.json(results.history);
  });
};