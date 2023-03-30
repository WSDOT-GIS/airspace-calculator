import{dF as y,dI as p,cm as u,cn as c,dH as d,co as h,c5 as m,n as S,cq as g,U as v,ih as f,bV as b,e as o,y as s,cr as C,aP as G,dP as $,hH as w,cs as P,a as _,ii as n,d2 as x,hr as F,gN as R,ag as k,aj as j}from"./index-1de34779.js";const E=["atom","xml"],L={base:n,key:"type",typeMap:{"simple-line":x},errorContext:"symbol"},M={base:n,key:"type",typeMap:{"picture-marker":F,"simple-marker":R},errorContext:"symbol"},O={base:n,key:"type",typeMap:{"simple-fill":k},errorContext:"symbol"};let t=class extends y(p(u(c(d(h(j)))))){constructor(...e){super(...e),this.description=null,this.fullExtent=null,this.legendEnabled=!0,this.lineSymbol=null,this.pointSymbol=null,this.polygonSymbol=null,this.operationalLayerType="GeoRSS",this.url=null,this.type="geo-rss"}normalizeCtorArgs(e,r){return typeof e=="string"?{url:e,...r}:e}readFeatureCollections(e,r){return r.featureCollection.layers.forEach(i=>{var a;const l=i.layerDefinition.drawingInfo.renderer.symbol;l&&l.type==="esriSFS"&&((a=l.outline)!=null&&a.style.includes("esriSFS"))&&(l.outline.style="esriSLSSolid")}),r.featureCollection.layers}get hasPoints(){return this._hasGeometry("esriGeometryPoint")}get hasPolylines(){return this._hasGeometry("esriGeometryPolyline")}get hasPolygons(){return this._hasGeometry("esriGeometryPolygon")}get title(){const e=this._get("title");return e&&this.originOf("title")!=="defaults"?e:this.url?m(this.url,E)||"GeoRSS":e||""}set title(e){this._set("title",e)}load(e){const r=S(e)?e.signal:null;return this.addResolvingPromise(this.loadFromPortal({supportedTypes:["Map Service","Feature Service","Feature Collection","Scene Service"]},e).catch(g).then(()=>this._fetchService(r)).then(i=>{this.read(i,{origin:"service"})})),Promise.resolve(this)}async hasDataChanged(){const e=await this._fetchService();return this.read(e,{origin:"service",ignoreDefaults:!0}),!0}async _fetchService(e){const r=this.spatialReference,{data:i}=await v(b.geoRSSServiceUrl,{query:{url:this.url,refresh:!!this.loaded||void 0,outSR:f(r)?void 0:r.wkid??JSON.stringify(r)},signal:e});return i}_hasGeometry(e){var r;return((r=this.featureCollections)==null?void 0:r.some(i=>{var l,a;return((l=i.featureSet)==null?void 0:l.geometryType)===e&&((a=i.featureSet.features)==null?void 0:a.length)>0}))??!1}};o([s()],t.prototype,"description",void 0),o([s()],t.prototype,"featureCollections",void 0),o([C("service","featureCollections",["featureCollection.layers"])],t.prototype,"readFeatureCollections",null),o([s({type:G,json:{name:"lookAtExtent"}})],t.prototype,"fullExtent",void 0),o([s($)],t.prototype,"id",void 0),o([s(w)],t.prototype,"legendEnabled",void 0),o([s({types:L,json:{write:!0}})],t.prototype,"lineSymbol",void 0),o([s({type:["show","hide"]})],t.prototype,"listMode",void 0),o([s({types:M,json:{write:!0}})],t.prototype,"pointSymbol",void 0),o([s({types:O,json:{write:!0}})],t.prototype,"polygonSymbol",void 0),o([s({type:["GeoRSS"]})],t.prototype,"operationalLayerType",void 0),o([s(P)],t.prototype,"url",void 0),o([s({json:{origins:{service:{read:{source:"name",reader:e=>e||void 0}}}}})],t.prototype,"title",null),o([s({readOnly:!0,json:{read:!1},value:"geo-rss"})],t.prototype,"type",void 0),t=o([_("esri.layers.GeoRSSLayer")],t);const q=t;export{q as default};
