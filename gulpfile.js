var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");
var imagemin = require('gulp-imagemin');
var cached = require('gulp-cached');
//var rename = require("gulp-rename");

//获取gulp-less模块
//var less = require("gulp-less")
var sass = require("gulp-sass")
//反向代理
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');

gulp.task('connect', function(){
  connect.server({
    livereload:true,
    port:8021,
    middleware: function(){
      return [
        proxy('/rest', {
        	target: "http://www.czoxx.com/xsManage",
//          target: "http://dev.fa.weiduanxian.com/xsManage/",
//          target: 'http://10.0.30.121/xsManage/',//李振宁本地
//          target: 'http://10.0.30.112:8080/xsManage',//樊华
//          target: 'http://dev.fa.weiduanxian.com:6001/',
//          target: 'http://api.hz.weiduanxian.com:7000/',
          changeOrigin: true,
          pathRewrite: {
            '^/rest': '/'
          }
        })
      ]
    }
  })
});





var htmlSrc = "src/html/**/*.html",
    cssSrc = "src/css/**/*.css",
    jsSrc = "src/js/**/*.js",
    scssSrc = "src/css/**/*.scss",
    imgSrc = "src/img/**/*.{jpg,jpeg,png,gif}";
    
//自动化编译scss
gulp.task('scss',function(){
  gulp.src(scssSrc)
    .pipe(cached('scss'))
    .pipe(sass())
    .pipe(gulp.dest('src/css'));
   
})

gulp.task("wHtml", function(){
  gulp.src([htmlSrc])
    .pipe(connect.reload())
})

gulp.task("wCss", function(){
  gulp.src([cssSrc])
    .pipe(connect.reload())
})

gulp.task("wJs", function(){
  gulp.src([jsSrc])
    .pipe(connect.reload())
})



gulp.task('watch', function() {
  gulp.watch(htmlSrc, ['wHtml']);
  gulp.watch(cssSrc, ['wCss']);
  gulp.watch(scssSrc, ['scss']);
  gulp.watch(jsSrc, ['wJs']);
  
});

gulp.task('default', ['watch','connect']);



gulp.task('compress', function() {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  gulp.src(htmlSrc)
    .pipe(minifyHtml(options))
    .pipe(gulp.dest('dist/html'));
    
  // gulp.src(jsSrc)
  //   .pipe(cached('js'))
  //   .pipe(uglify())
  //   .pipe(gulp.dest('dist/js'));
  gulp.src(jsSrc)
  .pipe(gulp.dest('dist/js'))

  gulp.src(cssSrc) 
    .pipe(cached('css'))
    .pipe(minifyCss()) //
    .pipe(gulp.dest('dist/css'));
    
  gulp.src(imgSrc)
    .pipe(cached('images'))
    .pipe(imagemin({
      optimizationlevel: 9,
    }))
    .pipe(gulp.dest('dist/img'));
  
});