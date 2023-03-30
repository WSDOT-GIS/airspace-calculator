import{E as h,S}from"./color-0ee4e5aa.js";import{f as u,_ as V,A as b}from"./MaterialKey-9cb0f200.js";import"./index-1de34779.js";import"./enums-55085e26.js";import"./enums-64ab819c.js";import"./VertexElementDescriptor-2925c6af.js";import"./number-b10bd8f5.js";import"./alignmentUtils-ae955d28.js";function y(e){var r;return e.type==="line-marker"?{type:"line-marker",color:(r=e.color)==null?void 0:r.toJSON(),placement:e.placement,style:e.style}:e.constructor.fromJSON(e.toJSON()).toJSON()}function p(e){return b(e)}function A(e,r,t=!1){if(!e)return null;switch(e.type){case"simple-fill":case"picture-fill":return x(e,r,t);case"simple-marker":case"picture-marker":return g(e,r,t);case"simple-line":return K(e,r,t);case"text":return z(e,r,t);case"label":return d(e,r,t);case"cim":return{type:"cim",rendererKey:r.vvFlags,data:e.data,maxVVSize:r.maxVVSize};case"CIMSymbolReference":return{type:"cim",rendererKey:r.vvFlags,data:e,maxVVSize:r.maxVVSize};case"web-style":return{...y(e),type:"web-style",hash:e.hash(),rendererKey:r.vvFlags,maxVVSize:r.maxVVSize};default:throw new Error(`symbol not supported ${e.type}`)}}function d(e,r,t){const a=e.toJSON(),l=u(h.LABEL,{...r,placement:a.labelPlacement});return{materialKey:t?p(l):l,hash:e.hash(),...a,labelPlacement:a.labelPlacement}}function x(e,r,t){const a=u(h.FILL,r),l=t?p(a):a,s=e.clone(),n=s.outline,i=V(r.symbologyType);i||(s.outline=null);const m={materialKey:l,hash:s.hash(),...y(s)};if(i)return m;const o=[];if(o.push(m),n){const c=u(h.LINE,{...r,isOutline:!0}),f={materialKey:t?p(c):c,hash:n.hash(),...y(n)};o.push(f)}return{type:"composite-symbol",layers:o,hash:o.reduce((c,f)=>f.hash+c,"")}}function K(e,r,t){const a=V(r.symbologyType)?S.DEFAULT:r.symbologyType,l=u(h.LINE,{...r,symbologyType:a}),s=t?p(l):l,n=e.clone(),i=n.marker;n.marker=null;const m=[];if(m.push({materialKey:s,hash:n.hash(),...y(n)}),i){const o=u(h.MARKER,r),c=t?p(o):o;i.color=i.color??n.color,m.push({materialKey:c,hash:i.hash(),lineWidth:n.width,...y(i)})}return{type:"composite-symbol",layers:m,hash:m.reduce((o,c)=>c.hash+o,"")}}function g(e,r,t){const a=u(h.MARKER,r),l=t?p(a):a,s=y(e);return{materialKey:l,hash:e.hash(),...s,angle:e.angle,maxVVSize:r.maxVVSize}}function z(e,r,t){const a=u(h.TEXT,r),l=t?p(a):a,s=y(e);return{materialKey:l,hash:e.hash(),...s,angle:e.angle,maxVVSize:r.maxVVSize}}export{A as createSymbolSchema};
