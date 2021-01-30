/* jshint esversion: 6,-W097, -W040, node: true, expr: true, undef: true, maxparams: 4 */
module.exports= function({app, $gulp_folder, gulp, error, $g, $o, $run}){
    const 
        to_folder= "docs/",
        from_folder= "docs/";
    return function(cb){
        gulp.src([app.directories.bin+app.name+".js"])
            .pipe(gulp.dest(to_folder))
            .on('end', cb);
        /*
        gulp.src([from_folder+"__examples.html"])
            .pipe($g.rename(path=> { path.basename= "examples"; }))
            .pipe(gulp.dest(to_folder))
            .on('end', function(){
            });
        */
    };
};