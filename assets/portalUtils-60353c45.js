import{bG as l,bB as i,U as a}from"./index-1de34779.js";function d(r,e){return r===null?e:new l({url:r.field("url")})}async function y(r,e,t){var o;if(!((o=i)==null?void 0:o.findCredential(r.restUrl)))return null;if(r.loadStatus==="loaded"&&e===""&&r.user&&r.user.sourceJSON&&t===!1)return r.user.sourceJSON;if(e===""){const s=await a(r.restUrl+"/community/self",{responseType:"json",query:{f:"json",...t===!1?{}:{returnUserLicenseTypeExtensions:!0}}});if(s.data){const n=s.data;if(n&&n.username)return n}return null}const u=await a(r.restUrl+"/community/users/"+e,{responseType:"json",query:{f:"json"}});if(u.data){const s=u.data;return s.error?null:s}return null}export{y as s,d as t};
