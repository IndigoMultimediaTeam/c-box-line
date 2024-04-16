#!/usr/bin/env -S npx nodejsscript
import { pkg, libraryName } from "./config.js";
import esbuild from "esbuild";
import { umdWrapper } from "esbuild-plugin-umd-wrapper";

$.api("", true)
//.option("--minify", "Level of minification [ full, partial ]", "full")
.action(async function main({ minify }){
	$.is_fatal= true;
	const css= echo.css`
		.success { color: lightgreen; }
		.success::before { content: "✓ "; }
	`;
	echo.use("-R", "Linting...");
	const { lint }= await import("./lint.js");
	lint();
	echo("%clinting", css.success);
	echo.use("-R", "Examples...");
	const { examples }= await import("./examples.js");
	examples();
	echo("%cexamples", css.success);

	const outdir= "lib/";
	const file_umd= `${outdir}${libraryName}.umd.js`;
	echo.use("-R", outdir+"...");
	const umdPlugin= umdWrapper({ libraryName });
	await esbuild.build({
		entryPoints: [ pkg.main ],
		bundle: true,
		platform: "browser",
		format: "umd",
		//minify: minify==="full",
		outfile: file_umd,
		plugins: [ umdPlugin ],
	});
	customElementsInitiator(file_umd, outdir);
	echo("%c"+outdir.toLowerCase(), css.success);
	$.exit();
})
.parse();

function customElementsInitiator(file_umd, outdir){
	let usage= s.cat("README.md").trim();
	const idx_usage= usage.indexOf("## Usage")+8;
	usage= usage.slice(idx_usage, usage.indexOf("##", idx_usage))
		.trimEnd()
		.replaceAll("\n", "\n * ");
	usage+= "\n *\n * version: "+pkg.version;
	usage+= "\n * source: "+pkg.homepage;
	const component= s.cat(file_umd).trim();
	const template= s.cat("src/customElementsInitiator.js")
		.trim()
		.replace("\n// USAGE", usage)
		.replace("// COMPONENT", component);
	s.echo(template).to(outdir+libraryName+".cei.js");
}
