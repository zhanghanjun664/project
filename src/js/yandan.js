
var params = {
  customerName: "",
  phone: "",
  product: "",
  province: "",
  city: "",
  area: "",
  fullAddress: "",
  nonum: nonum
}

checkoutSubmit()
$(".areaPicker").cityPicker({
  title: "地区",
  onChange: function (picker, values, displayValues) {

    $(".phone").blur()
    $(".customerName").blur()
    $(".fullAddress").blur()
    
    params.province = displayValues[0]
    params.city = displayValues[1]
    params.area = displayValues[2]
    checkoutSubmit()
  }
});


// 选择产品型号

$(".page_modal").click(function(){
  $(this).hide()
})

$(".content li").click(function(){
  var text = $(this).text()
  params.product = text
  $(".inp_pro .inp").val(text)
  checkoutSubmit()
})

$(".footer").click(function(){
  $(".page_modal").hide()
})

$(".inp_pro").click(function(){
  $(".page_modal").show()
})



$(".customerName").on("input",function(){
  var val = this.value
  params.customerName = val
  checkoutSubmit()

})

$(".phone").on("input",function(){
  var val = this.value
  if(val){
    val = val.trim()
  }
  params.phone = val
  checkoutSubmit()

})


$(".fullAddress").on("input",function(){
  var val = this.value
  params.fullAddress = val
  checkoutSubmit()

})


// 检测是否可提交
$(".btn_confirm").click(function(){
  var disabled = $(this).attr("data-disabled")
  if(disabled == "true") return

  if(!params.customerName){
    return showToast("请输入姓名")
  }

  if(!params.phone){
    return showToast("请输入联系电话")
  }

  if(!params.province){
    return showToast("请选择所在地区")
  }

  if(!params.fullAddress){
    return showToast("请输入详细地址")
  }

  if(!params.product){
    return showToast("请选择产品型号")
  }

  $.showLoading('正在提交...')

  ajax({
    url: "/customermess.json",
    data: params,
    success: function(data){
      // location.href = "success.html"
      location.href = getWholeUrl("success.html")
    },
    complete: function(e){
      $.hideLoading()
    }
  })

})

// 检测是否可提交
function checkoutSubmit(){
  if(params.customerName && params.phone && params.product && params.province && params.fullAddress){
    $(".btn_confirm").attr("data-disabled", false)
  } else {
    $(".btn_confirm").attr("data-disabled", true)
  }

}
