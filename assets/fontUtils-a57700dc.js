import{bV as i}from"./index-1de34779.js";const o="woff2",a=new Map;async function w(t){const e=u(t);let r=a.get(e);if(r)return r;const n=new FontFace(t.family,`url('${i.fontsUrl}/woff2/${e}.${o}') format('${o}')`),s=document.fonts;return s.has(n)&&n.status==="loading"?n.loaded:(r=n.load(),a.set(e,r),s.add(n),r)}function c(t){if(!t)return"arial-unicode-ms";const e=t.toLowerCase().split(" ").join("-");switch(e){case"serif":return"noto-serif";case"sans-serif":return"arial-unicode-ms";case"monospace":return"ubuntu-mono";case"fantasy":return"cabin-sketch";case"cursive":return"redressed";default:return e}}function u(t){const e=f(t)+l(t);return c(t.family)+(e.length>0?e:"-regular")}function f(t){if(!t.weight)return"";switch(t.weight.toLowerCase()){case"bold":case"bolder":return"-bold"}return""}function l(t){if(!t.style)return"";switch(t.style.toLowerCase()){case"italic":case"oblique":return"-italic"}return""}export{w as n,u as o,c as s};
