import{cZ as n}from"./index-1de34779.js";class o{static getId(l,e,s,t){return typeof l=="object"?`${l.level}/${l.row}/${l.col}/${l.world}`:`${l}/${e}/${s}/${t}`}constructor(l,e,s,t){this.set(l,e,s,t)}get key(){return this}get id(){return this.toString()}set id(l){this.set(l)}get hash(){const l=4095&this.row,e=4095&this.col,s=63&this.level;return(3&this.world)<<30|e<<22|l<<8|s}acquire(l,e,s,t){this.set(l,e,s,t)}contains(l){const e=l.level-this.level;return e>=0&&this.row===l.row>>e&&this.col===l.col>>e&&this.world===l.world}equals(l){return this.level===l.level&&this.row===l.row&&this.col===l.col&&this.world===l.world}clone(){return new o(this)}release(){this.level=0,this.row=0,this.col=0,this.world=0}set(l,e,s,t){if(l==null)this.level=0,this.row=0,this.col=0,this.world=0;else if(typeof l=="object")this.level=l.level||0,this.row=l.row||0,this.col=l.col||0,this.world=l.world||0;else if(typeof l=="string"){const[r,i,h,w]=l.split("/");this.level=parseFloat(r),this.row=parseFloat(i),this.col=parseFloat(h),this.world=parseFloat(w)}else this.level=+l,this.row=+e,this.col=+s,this.world=+t||0;return this}toString(){return`${this.level}/${this.row}/${this.col}/${this.world}`}getParentKey(){return this.level<=0?null:new o(this.level-1,this.row>>1,this.col>>1,this.world)}getChildKeys(){const l=this.level+1,e=this.row<<1,s=this.col<<1,t=this.world;return[new o(l,e,s,t),new o(l,e,s+1,t),new o(l,e+1,s,t),new o(l,e+1,s+1,t)]}compareRowMajor(l){return this.row<l.row?-1:this.row>l.row?1:this.col<l.col?-1:this.col>l.col?1:0}}o.pool=new n(o,null,null,25,50);export{o as e};
