
// var ENV = location.host == 'html.jz.yueming888.com' ? 'prod' : 'dev'

// var inter_pre = {
//   dev: 'http://dev.jz.yueming888.com/wyWChat',
//   prod: 'https://jz.yueming888.com/wyWChat',

// }

// var REST_PRRFIX = inter_pre[ENV]

var REST_PRRFIX = "https://api.vvildtech.com/xy/test"
var nonum = GetQueryString("nonum")

//提示框
function showModal(config) {
  var title = config.title ? config.title : "提示";
  var leftTxt = config.leftTxt || '取消'
  var rightTxt = config.rightTxt || '确定'

  var html =
    '<div class="modal_container">' +
    '<div class="modal_box">' +
    '<div>' +
    // '<p class="modal_title">' + title + '</p>' +
    '<p class="modal_content">' + config.content + '</p>' +
    '</div>' +
    '<div class="modal_footer">' +
    '<div class="modal_cancel">' + leftTxt + '</div>' +
    '<div class="modal_submit">' + rightTxt + '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  $("body").append(html)
  $(".modal_container").fadeIn(300);
  if (config.type == 1) {
    $(".modal_cancel").hide();
    $(".modal_title").hide();
    //    $(".modal_submit").text("知道了")

  } else {
    $(".modal_cancel").on("click", function () {
      $(".modal_container").fadeOut(300, function () {

        $(this).remove()
      });
    })
  }

  $(".modal_submit").on("click", function () {
    config.success()
    $(".modal_container").fadeOut(300, function () {
      $(this).remove()
    });
  })

}

//header
$('.back').click(function () {
  var vip = ['taskStep.html', 'result.html', 'city.html'], stop = false
  vip.forEach(function (item) {
    if (location.pathname.indexOf(item) !== -1) {
      stop = true
    }
  })
  if (stop) return
  history.back()
})

// 顶部导航
// 我的任务
$('.myTask').click(function () {
  location.href = 'myTask.html'
})


function ajax(config) {

  $.ajax({
    type: config.type,
    url: REST_PRRFIX + config.url,
    data: config.data,
    dataType: config.dataType || 'json',
    async: config.async,
    processData: config.processData,
    contentType: config.contentType,
    success: function (data) {
      //登录失效
      if (data.code == '0') {
        config.success(data);
      } else {
        $.toast(data.errMsg, 'cancel');
      }
    },
    error: function (data) {
      typeof config.error == 'function' ? config.error(data) : ""
    },
    complete: function () {
      config.complete && config.complete()
      // $.hideLoading()
    }
  });

}


//多余字数省略号
function showSize(str, num) {
  return str.slice(0, num) + "..."
}

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}


//toast
function showToast(value) {
  var html = '<div class="toast">' +
    '<div class="toast_value">' + value + '</div>' +
    '</div>'
  $("body").append(html)
  $(".toast").fadeIn(300);
  setTimeout(function () {
    $(".toast").fadeOut(300, function () {
      $(this).remove()
    });
  }, 1500)
}

//时间转换
function formatDate(str, type) {
  if (!str) return
  if (typeof str === 'string') {
    str = str.replace(/-/g, '/')
  }
  var sDate = new Date(str);
  var y = sDate.getFullYear();
  var m = sDate.getMonth() + 1 < 10 ? "0" + (sDate.getMonth() + 1) : sDate.getMonth() + 1;
  var d = sDate.getDate() < 10 ? "0" + sDate.getDate() : sDate.getDate();
  var H = sDate.getHours() < 10 ? "0" + sDate.getHours() : sDate.getHours();
  var M = sDate.getMinutes() < 10 ? "0" + sDate.getMinutes() : sDate.getMinutes();
  var S = sDate.getSeconds() < 10 ? "0" + sDate.getSeconds() : sDate.getSeconds();
  var nTime = "";
  switch (String(type)) {
    case "1":
      nTime = m + "月" + d + "日"
      break;
    case "2":
      nTime = y + "-" + m + "-" + d
      break;
    case "3":
      nTime = +m + "-" + d
      break;
    case "4":
      nTime = m + "-" + d + ' ' + H + ":" + M
      break;
    default:
      nTime = y + "-" + m + "-" + d + " " + H + ":" + M + ":" + S
      break;
  }
  return nTime
}

function getDateDiff(dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  // var halfamonth = day * 15;
  var month = day * 30;

  var idata = Date.parse(dateTimeStamp.replace(/-/gi, "/"));  //js函数代码：字符串转换为时间
  var now = new Date().getTime();
  var diffValue = now - idata;
  if (diffValue < 0) {
    return '-'
  }
  var monthC = diffValue / month;
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = parseInt(monthC) + "个月前";
    if (monthC >= 12) {
      result = formatDate(idata, 2)
    }
  }
  else if (dayC >= 1) {
    result = parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = parseInt(hourC) + "个小时前";
  }
  else if (minC >= 1) {
    result = parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}


// 定义全局资源
var TASK_ICON = {
  0: '../img/icon_other.png',
  1: '../img/icon_zhuce.png',
  2: '../img/icon_caiji.png',
  3: '../img/icon_xinyongka.png',
}

// 定义全局任务类型
var TASK_TYPE = {
  0: '图文说明',
  1: '打开链接',
  2: '文本输入',
  3: '提交图片',
}

// 获取步骤icon
function getStepIcon(num) {
  if (!num) return
  return '../img/icon_step' + num + '.png'
}


// 图片预览所需
// 获取图片列表
function getImgListByEl(par) {
  var imgList = []
  par.find('img').each(function (index, item) {
    imgList.push(item.src)
  })
  return imgList
}
// 初始化图片预览组件
function initPreviewComp(items, index) {
  return $.photoBrowser({
    items: items,
    initIndex: index,
    onClose: function () {
      $('.weui-photo-browser-modal').remove()
    }
  });
}


// 设置选中
function setActive(el) {
  el.addClass('active').siblings().removeClass('active')
}


// 倒计时
function getCountdown(str) {
  var d = str.replace(/-/g, '/')
  var startDate = new Date(d)
  var now = new Date()
  var sy = 2 * 60 * 60 * 1000 - (now - startDate) //剩余毫秒数
  var alls = parseInt(sy / 1000)
  var h = parseInt(alls / (60 * 60))
  var m = parseInt(alls % (60 * 60) / 60)
  var s = alls % (60)
  if (sy <= 0) {
    return '00:00:00'
  }
  console.log(h, m, s)
  return getNumber(h) + ':' + getNumber(m) + ':' + getNumber(s)

}

function getNumber(n) {
  return n < 10 ? '0' + n : n
}

function getTimestamp(str) {
  if (!str) return
  let dates = str.replace(/[-]/g, "/");
  let ts = new Date(dates).getTime()
  return ts
}

function getCountDown(start, end) {
  if (!end || !start) return {}
  if (typeof end == 'string') {
    end = this.getTimestamp(end)
  }
  if (typeof start == 'string') {
    start = this.getTimestamp(start)
  }

  if (start >= end) {
    return { d: '00', h: '00', m: '00', s: '00' }
  }

  function getDig(n) {
    return n < 10 ? '0' + n : n
  }
  let time = parseInt(Math.abs(end - start) / 1000) //秒
  let d = getDig(parseInt(time / (60 * 60 * 24)))
  let h = getDig(parseInt((time % (60 * 60 * 24)) / (60 * 60)))
  let m = getDig(parseInt((time % (60 * 60)) / (60)))
  let s = getDig((time % (60)))

  return { d, h, m, s }

}

// 深拷贝
function cloneDeep(data) {
  return JSON.parse(JSON.stringify(data))
}

// 参数序列化
function qs(obj) {
  let arr = [];
  for (let i in obj) {
    if (obj[i]) {
      arr.push(`${i}=${obj[i]}`)
    }
  }
  return arr.join('&');
}

// 微信环境
function isWeiXin() {
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

// 去重
function unique1(arr) {
  var hash = [];
  for (var i = 0; i < arr.length; i++) {
    if (hash.indexOf(arr[i]) == -1) {
      hash.push(arr[i]);
    }
  }
  return hash;
}

// 定位
function locate(cb) {
  var iframe = document.createElement('iframe')
  iframe.style.cssText = 'display: none; width: 0; height: 0;'
  iframe.src = 'https://apis.map.qq.com/tools/geolocation?key=VXEBZ-D6YKU-ZW7VO-4PAGH-X3OQ3-PCBJU&referer=wycs'
  iframe.id = 'wycs_location'
  document.body.appendChild(iframe)

  window.addEventListener('message', function (event) {
    // 接收位置信息
    var loc = event.data;
    if (loc && loc.city && loc.province) {
      var obj = {
        latitude: loc.lat,
        longitude: loc.lng
      }

      console.log('loc->', loc, 'province', loc.province)

      var locationEl = document.getElementById('wycs_location')
      if (locationEl) {
        loc.city = loc.city.slice(0, -1)

        cb && cb(loc)
        locationEl.remove()
      }



    }

  }, false);

}

// 获取图片
function getImg(cb) {
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      console.log('localIds==>', localIds)
      wx.getLocalImgData({
        localId: localIds[0], // 图片的localID
        success: function (res) {
          var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
          cb && cb(localData)
        }
      });

    }
  });

}

function showLoading(){
  var html = '<div class="z-loading">'+
  '<div class="weui_loading"><i class="weui-loading weui-icon_toast"></i></div>'+
  '</div>'
  $('body').append(html)

}

function hideLoading(){
  $('.z-loading').remove()
}

function getWholeUrl(url){
  if(!nonum) return url

  return url += '?nonum='+nonum
}

// var nonum = GetQueryString("nonum")
// if(nonum){
//   sessionStorage.setItem("nonum", nonum)
// } else {
//   nonum = sessionStorage.setItem("nonum", nonum)
// }

