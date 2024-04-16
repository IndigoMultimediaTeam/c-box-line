#!/usr/bin/env -S npx nodejsscript
import { pkg } from "./config.js";

if($.isMain(import.meta))
	$.api("", true)
	.action(()=> s.exit(examples()))
	.parse();

export function examples(){
	s.cp("-u", pkg.main, "docs/");
	return;
}
