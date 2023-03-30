import{d1 as p}from"./index-1de34779.js";function x(){const r=new Float32Array(6);return r[0]=1,r[3]=1,r}function S(r){const n=new Float32Array(6);return n[0]=r[0],n[1]=r[1],n[2]=r[2],n[3]=r[3],n[4]=r[4],n[5]=r[5],n}function _(r,n,o,e,s,c){const u=new Float32Array(6);return u[0]=r,u[1]=n,u[2]=o,u[3]=e,u[4]=s,u[5]=c,u}function g(r,n){return new Float32Array(r,n,6)}function m(r,n,o,e){const s=n[e],c=n[e+1];r[e]=o[0]*s+o[2]*c+o[4],r[e+1]=o[1]*s+o[3]*c+o[5]}function A(r,n,o,e=0,s=0,c=2){const u=s||n.length/c;for(let f=e;f<u;f++)m(r,n,o,f*c)}Object.freeze(Object.defineProperty({__proto__:null,clone:S,create:x,createView:g,fromValues:_,transform:m,transformMany:A},Symbol.toStringTag,{value:"Module"}));function $(r,n){return r[0]=n[0],r[1]=n[1],r[2]=n[2],r[3]=n[3],r[4]=n[4],r[5]=n[5],r}function j(r){return r[0]=1,r[1]=0,r[2]=0,r[3]=1,r[4]=0,r[5]=0,r}function w(r,n,o,e,s,c,u){return r[0]=n,r[1]=o,r[2]=e,r[3]=s,r[4]=c,r[5]=u,r}function F(r,n){const o=n[0],e=n[1],s=n[2],c=n[3],u=n[4],f=n[5];let i=o*c-e*s;return i?(i=1/i,r[0]=c*i,r[1]=-e*i,r[2]=-s*i,r[3]=o*i,r[4]=(s*f-c*u)*i,r[5]=(e*u-o*f)*i,r):null}function O(r){return r[0]*r[3]-r[1]*r[2]}function y(r,n,o){const e=n[0],s=n[1],c=n[2],u=n[3],f=n[4],i=n[5],l=o[0],a=o[1],M=o[2],b=o[3],t=o[4],h=o[5];return r[0]=e*l+c*a,r[1]=s*l+u*a,r[2]=e*M+c*b,r[3]=s*M+u*b,r[4]=e*t+c*h+f,r[5]=s*t+u*h+i,r}function q(r,n,o){const e=n[0],s=n[1],c=n[2],u=n[3],f=n[4],i=n[5],l=Math.sin(o),a=Math.cos(o);return r[0]=e*a+c*l,r[1]=s*a+u*l,r[2]=e*-l+c*a,r[3]=s*-l+u*a,r[4]=f,r[5]=i,r}function v(r,n,o){const e=n[0],s=n[1],c=n[2],u=n[3],f=n[4],i=n[5],l=o[0],a=o[1];return r[0]=e*l,r[1]=s*l,r[2]=c*a,r[3]=u*a,r[4]=f,r[5]=i,r}function T(r,n,o){const e=n[0],s=n[1],c=n[2],u=n[3],f=n[4],i=n[5],l=o[0],a=o[1];return r[0]=e,r[1]=s,r[2]=c,r[3]=u,r[4]=e*l+c*a+f,r[5]=s*l+u*a+i,r}function z(r,n){const o=Math.sin(n),e=Math.cos(n);return r[0]=e,r[1]=o,r[2]=-o,r[3]=e,r[4]=0,r[5]=0,r}function P(r,n){return r[0]=n[0],r[1]=0,r[2]=0,r[3]=n[1],r[4]=0,r[5]=0,r}function V(r,n){return r[0]=1,r[1]=0,r[2]=0,r[3]=1,r[4]=n[0],r[5]=n[1],r}function E(r){return"mat2d("+r[0]+", "+r[1]+", "+r[2]+", "+r[3]+", "+r[4]+", "+r[5]+")"}function R(r){return Math.sqrt(r[0]**2+r[1]**2+r[2]**2+r[3]**2+r[4]**2+r[5]**2+1)}function k(r,n,o){return r[0]=n[0]+o[0],r[1]=n[1]+o[1],r[2]=n[2]+o[2],r[3]=n[3]+o[3],r[4]=n[4]+o[4],r[5]=n[5]+o[5],r}function d(r,n,o){return r[0]=n[0]-o[0],r[1]=n[1]-o[1],r[2]=n[2]-o[2],r[3]=n[3]-o[3],r[4]=n[4]-o[4],r[5]=n[5]-o[5],r}function B(r,n,o){return r[0]=n[0]*o,r[1]=n[1]*o,r[2]=n[2]*o,r[3]=n[3]*o,r[4]=n[4]*o,r[5]=n[5]*o,r}function C(r,n,o,e){return r[0]=n[0]+o[0]*e,r[1]=n[1]+o[1]*e,r[2]=n[2]+o[2]*e,r[3]=n[3]+o[3]*e,r[4]=n[4]+o[4]*e,r[5]=n[5]+o[5]*e,r}function D(r,n){return r[0]===n[0]&&r[1]===n[1]&&r[2]===n[2]&&r[3]===n[3]&&r[4]===n[4]&&r[5]===n[5]}function G(r,n){const o=r[0],e=r[1],s=r[2],c=r[3],u=r[4],f=r[5],i=n[0],l=n[1],a=n[2],M=n[3],b=n[4],t=n[5],h=p();return Math.abs(o-i)<=h*Math.max(1,Math.abs(o),Math.abs(i))&&Math.abs(e-l)<=h*Math.max(1,Math.abs(e),Math.abs(l))&&Math.abs(s-a)<=h*Math.max(1,Math.abs(s),Math.abs(a))&&Math.abs(c-M)<=h*Math.max(1,Math.abs(c),Math.abs(M))&&Math.abs(u-b)<=h*Math.max(1,Math.abs(u),Math.abs(b))&&Math.abs(f-t)<=h*Math.max(1,Math.abs(f),Math.abs(t))}const H=y,I=d;Object.freeze(Object.defineProperty({__proto__:null,add:k,copy:$,determinant:O,equals:G,exactEquals:D,frob:R,fromRotation:z,fromScaling:P,fromTranslation:V,identity:j,invert:F,mul:H,multiply:y,multiplyScalar:B,multiplyScalarAndAdd:C,rotate:q,scale:v,set:w,str:E,sub:I,subtract:d,translate:T},Symbol.toStringTag,{value:"Module"}));export{P as M,j as a,A as b,v as c,q as e,V as f,z as h,T as i,x as n,y as o,F as r,w as s};
