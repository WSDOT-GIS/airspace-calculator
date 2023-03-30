import{s as m,jo as y,_ as h,jp as w,g as v,z as d,L as b,K as x,m as _,jq as E,S as F}from"./index-1de34779.js";const p=m.getLogger("esri.layers.support.labelFormatUtils"),g={type:"simple",evaluate:()=>null},V={getAttribute:(a,n)=>a.field(n)};async function T(a,n,e){if(!a||!a.symbol||!n)return g;const s=a.where,u=y(a),o=s?await h(()=>import("./WhereClause-22950160.js").then(r=>r.W),["assets/WhereClause-22950160.js","assets/index-1de34779.js","assets/index-252dcfb5.css","assets/executionError-fb3f283a.js"]):null;let i;if(u.type==="arcade"){const r=await w(u.expression,e,n);if(v(r))return g;i={type:"arcade",evaluate(l){try{const t=r.evaluate({$feature:"attributes"in l?r.repurposeFeature(l):l});if(t!=null)return t.toString()}catch{p.error(new d("arcade-expression-error","Encountered an error when evaluating label expression for feature",{feature:l,expression:u}))}return null},needsHydrationToEvaluate:()=>E(u.expression)==null}}else i={type:"simple",evaluate:r=>u.expression.replace(/{[^}]*}/g,l=>{const t=l.slice(1,-1),c=n.get(t);if(!c)return l;let f=null;return"attributes"in r?r&&r.attributes&&(f=r.attributes[c.name]):f=r.field(c.name),f==null?"":L(f,c)})};if(s){let r;try{r=o.WhereClause.create(s,n)}catch(t){return p.error(new d("bad-where-clause","Encountered an error when evaluating where clause, ignoring",{where:s,error:t})),g}const l=i.evaluate;i.evaluate=t=>{const c="attributes"in t?void 0:V;try{if(r.testFeature(t,c))return l(t)}catch(f){p.error(new d("bad-where-clause","Encountered an error when evaluating where clause for feature",{where:s,feature:t,error:f}))}return null}}return i}function L(a,n){if(a==null)return"";const e=n.domain;if(e){if(e.type==="codedValue"||e.type==="coded-value"){const u=a;for(const o of e.codedValues)if(o.code===u)return o.name}else if(e.type==="range"){const u=+a,o="range"in e?e.range[0]:e.minValue,i="range"in e?e.range[1]:e.maxValue;if(o<=u&&u<=i)return e.name}}let s=a;return n.type==="date"||n.type==="esriFieldTypeDate"?s=b(s,F("short-date")):x(n)&&(s=_(+s)),s||""}export{T as createLabelFunction,L as formatField};
