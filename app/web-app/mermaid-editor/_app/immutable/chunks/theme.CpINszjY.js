import{w as a}from"./index.BIOmDrk3.js";import{p as o,l as e,a as r}from"./state.tVSlibSF.js";const l=o(a({isDark:!1}),e(),"themeStore"),i=new Set(["black","dark","luxury"]),p=s=>{s.includes(" ")&&(s=s.split(" ")[1].trim());const t=i.has(s);console.log("Setting theme",s),l.set({theme:s,isDark:t}),r("themeChange",{theme:s,isDark:t})};export{p as s,l as t};