const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const gutil = require('gulp-util');
// const cleanCSS = require('gulp-clean-css');
const combiner = require('stream-combiner2');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const handleError = function(err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
};
/*开发阶段可以做SASS的编译*/
/*开发阶段，不用gulp-clean-css进行压缩*/
/*配置SASS任务*/
gulp.task('watchsass', function() {
    /*监听sass文件，并在修改后自动编译成CSS，然后通知浏览器并注入CSS*/
    gulp.watch('src/sass/**/*.scss', function (event) {
        var paths = plugins.watchPath(event, 'src/sass/', 'src/css/');
        // 文件操作的事件类型
        gutil.log('File ' + paths.srcPath + ' was ' + gutil.colors.green(event.type));
        // 文件输出路径
        gutil.log('Dist ' + paths.distPath);
        // 用stream-combiner2合并多个stream，只需添加一个错误监听，而且不会让gulp停止运行
        var combined = combiner.obj([
            // 从src/sass/取得SASS文件
            gulp.src(paths.srcPath),
            // 这里开启sourcemap后会生成sourcemap文件，可以在firefox（要在开发者工具的设置里样式编辑器部分勾选显示原始来源）和chrome（同样要在开发者工具的设置里勾选enable JavaScript sourcemaps和enable css sourcemaps）自带的开发者工具里直接调试SASS了
            plugins.sourcemaps.init(),
            // 编译SASS，outputStyle选项表示输出CSS的风格，默认是nested，对sass里的嵌套在编译成CSS后也会缩进，expanded会在输出CSS的每一个选择器设置之间空一行，compact也在每个选择器之间空一行，但是每个选择器的样式设置都只写在一行里—（就是花括号里的所有样式设置都写在一行），compressed输出压缩后的CSS
            plugins.sass({outputStyle: 'expanded'}),
            plugins.autoprefixer(['last 2 Chrome versions', 'Firefox > 20', 'ie >= 8', 'last 2 Opera versions', 'Safari >= 5']),
            plugins.sourcemaps.write('./'),
            // 输出到src/css
            gulp.dest(paths.distDir),
            // 调用Browsersync的reload方法通知浏览器文件修改并注入CSS
            reload({ stream: true })
        ])
        // 对合并后的stream添加事件监听
        combined.on('error', handleError)
        return combined;
    })
});
// 先执行监听和编译SASS的任务，然后启动Browsersync，并监听src/路径下所有html、css和js文件（js文件还需要js-hint等前置的任务，可以放在watchjs任务里）
gulp.task('reload',['watchsass'], function() {
    return browserSync.init({
        // 设置监听的文件，以baseDir设置的根目录为起点，单个文件就用字符串，多个文件就用数组
        files: ["src/*.html", "src/css/*.css", "src/js/*.js", "src/images/*.*"],
        // 启动静态服务器，默认监听3000端口，设置文件监听路径为src/
        server: {
            baseDir: "./src"
        },
        // 在不同浏览器上镜像点击、滚动和表单，即所有浏览器都会同步
        ghostMode: {
            clicks: true,
            scroll: true
        },
        // 更改控制台日志前缀，可以用项目名，每个项目单独修改即可
        logPrefix: "waterfall",
        // 设置监听时默认打开的浏览器
        browser: "chrome",
        // 设置服务器监听的端口号
        port: 8080
    });
});
gulp.task('default', ['reload'], function() {
    console.log('gulp is running~');
});