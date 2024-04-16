#!/usr/bin/env -S npx nodejsscript
import { pkg } from "./config.js";

if($.isMain(import.meta))
	$.api("", true)
	.option("--full", "Reports also warnings", false)
	.action(a=> s.exit(lint(a)))
	.parse();

export function lint({ full }= {}){
	const args= [ "--verbose" ];
	if(full) args.push("--show-non-errors");
	const r= s.run`npx jshint ${args} ${pkg.main}`;
	return r.code;
}
