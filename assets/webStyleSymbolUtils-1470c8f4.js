import{dt as z,ad as C,z as w,n as N,bG as S,bM as b,du as f,dv as E,dw as U,dx as D,dy as P,dz as j,dc as M,dA as h,dB as $,dC as A}from"./index-1de34779.js";import{c as B,a as g}from"./devEnvironmentUtils-5002a058.js";function T(e,t,a,s){return e.name?e.styleName&&e.styleName==="Esri2DPointSymbolsStyle"?G(e,t,s):z(e,t,s).then(r=>F(C(r),e.name,t,a,s)):Promise.reject(new w("symbolstyleutils:style-symbol-reference-name-missing","Missing name in style symbol reference"))}function F(e,t,a,s,r){var p;const u=e.data,m=a&&N(a.portal)?a.portal:S.getDefault(),c={portal:m,url:b(e.baseUrl),origin:"portal-item"},o=u.items.find(n=>n.name===t);if(!o){const n=`The symbol name '${t}' could not be found`;return Promise.reject(new w("symbolstyleutils:symbol-name-not-found",n,{symbolName:t}))}let i=f(E(o,s),c),y=((p=o.thumbnail)==null?void 0:p.href)??null;const d=o.thumbnail&&o.thumbnail.imageData;B()&&(i=g(i)??"",y=g(y));const x={portal:m,url:b(U(i)),origin:"portal-item"};return D(i,r).then(n=>{const O=s==="cimRef"?P(n.data):n.data,l=j(O,x);if(l&&M(l)){if(y){const v=f(y,c);l.thumbnail=new h({url:v})}else d&&(l.thumbnail=new h({url:`data:image/png;base64,${d}`}));e.styleUrl?l.styleOrigin=new $({portal:a.portal,styleUrl:e.styleUrl,name:t}):e.styleName&&(l.styleOrigin=new $({portal:a.portal,styleName:e.styleName,name:t}))}return l})}function G(e,t,a){const s=A.replace(/\{SymbolName\}/gi,e.name),r=N(t.portal)?t.portal:S.getDefault();return D(s,a).then(u=>{const m=P(u.data);return j(m,{portal:r,url:b(U(s)),origin:"portal-item"})})}export{F as fetchSymbolFromStyle,T as resolveWebStyleSymbol};
