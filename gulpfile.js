var gulp = require("gulp");

var createTsProject = (function () {
    var projects = {};

    return function (fileName) {
        var ts = require("gulp-typescript");

        return projects[fileName] = ts.createProject(fileName);
    };
})();

var createTscTask = (function () {
    function runTsc(config, destination) {
        var merge = require("merge2");

        var project = createTsProject(config);
        var output = project
            .src()
            .pipe(project());

        return merge([
            output.dts.pipe(gulp.dest(destination)),
            output.js.pipe(gulp.dest(destination))
        ]);
    }

    return function (config, destination) {
        return function () {
            return runTsc(config, destination);
        };
    };
})();

var createTslintTask = (function () {
    function runTslint(config, source) {
        var gulpTslint = require("gulp-tslint");
        var tslint = require("tslint");

        var program = tslint.Linter.createProgram(config);

        return gulp
            .src(
                [
                    "./" + source + "/**/*.ts",
                    "!./" + source + "/**/*.d.ts"
                ],
                {
                    base: "."
                })
            .pipe(gulpTslint({
                formatter: "stylish",
                program
            }))
            .pipe(gulpTslint.report());
    }

    return function (config, source) {
        return function () {
            return runTslint(config, source);
        };
    };
})();

gulp.task("clean", function () {
    var del = require("del");

    return del([
        "lib/**/*",
        "test/**/*.js",
        "test/**/*.d.ts"
    ]);
});

gulp.task("src:tsc", createTscTask("./tsconfig.json", "lib"));
gulp.task("src:tslint", createTslintTask("./tsconfig.json", "src"));
gulp.task("src", function (callback) {
    require("run-sequence").use(gulp)("src:tsc", "src:tslint", callback);
});

gulp.task("test:tsc", createTscTask("./test/tsconfig.json", "test"));
gulp.task("test:tslint", createTslintTask("./test/tsconfig.json", "test"));

gulp.task("test:run", function () {
    var mocha = require("gulp-mocha");

    return gulp.src("test/**/*.js")
        .pipe(mocha({
            reporter: "spec",
        }))
        .on("error", function () {
            this.emit("end");
        });
});

gulp.task("test", function (callback) {
    require("run-sequence").use(gulp)("test:tsc", "test:tslint",  "test:run", callback);
});

gulp.task("watch", ["tsc"], function () {
    var merge = require("merge2");

    return merge([
        gulp.watch(["src/**/*.ts"], ["src"]),
        gulp.watch(["test/**/*.ts"], ["test"]),
    ]);
});

gulp.task("default", function (callback) {
    var runSequence = require("run-sequence").use(gulp);

    runSequence(
        ["clean"],
        ["src"],
        ["test"],
        callback);
});
