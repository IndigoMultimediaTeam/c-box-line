export const pkg= s.cat("package.json").xargs(JSON.parse);
export const libraryName= pkg.main.slice(pkg.main.lastIndexOf("/")+1, -3);
