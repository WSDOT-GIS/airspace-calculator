function u(r){return 32+r.length}function c(r){return 16}function b(r){if(!r)return 0;let e=i;for(const t in r)if(r.hasOwnProperty(t)){const n=r[t];switch(typeof n){case"string":e+=u(n);break;case"number":e+=c();break;case"boolean":e+=4}}return e}function a(r){if(!r)return 0;if(Array.isArray(r))return l(r);let e=i;for(const t in r)r.hasOwnProperty(t)&&(e+=f(r[t]));return e}function l(r){const e=r.length;if(e===0||typeof r[0]=="number")return 32+8*e;let t=s;for(let n=0;n<e;n++)t+=f(r[n]);return t}function f(r){switch(typeof r){case"object":return a(r);case"string":return u(r);case"number":return c();case"boolean":return 4;default:return 8}}function E(r,e){return s+r.length*e}const i=32,s=32;var o;(function(r){r[r.KILOBYTES=1024]="KILOBYTES",r[r.MEGABYTES=1048576]="MEGABYTES",r[r.GIGABYTES=1073741824]="GIGABYTES"})(o||(o={}));export{E as c,a as e,o as s,b as t};
