var params ={
  phone: "",
}

$(".phone").on("input",function(){
  var val = this.value
  if(val){
    val = val.trim()
  }
  params.phone = val

  checkoutSubmit()

})



// 检测是否可提交
$(".btn_confirm").click(function(){
  var disabled = $(this).attr("data-disabled")
  if(disabled == "true") return

  if(!params.phone){
    return showToast("请输入联系电话");
  }

  $.showLoading('正在提交...')
  ajax({
    url: "/customerjoin.json",
    data: params,
    success: function(data){
      location.href = "success.html"
    },
    complete: function(e){
      $.hideLoading()
    }
  })

})

// 检测是否可提交
function checkoutSubmit(){
  if(params.phone){
    $(".btn_confirm").attr("data-disabled", false)
  } else {
    $(".btn_confirm").attr("data-disabled", true)
  }

}