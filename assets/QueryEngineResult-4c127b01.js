import{z as S,g as ae,aU as ce,aO as U,n as Y,eA as H,_ as de,eB as he,ey as X,eC as fe,eD as me,k as ge}from"./index-1de34779.js";import{s as k}from"./quantizationUtils-8e0165c7.js";import{e as J}from"./ItemCache-edc397ee.js";import{f as pe}from"./WhereClause-22950160.js";import{c as P,D as ye,m as xe,f as K,d as W,T as Fe,y as Ie,x as _e,z as Ve,S as Te,M as ve,v as De,p as Ae}from"./utils-55006552.js";import{g as ee}from"./projectionSupport-5b721288.js";import{E as $,v as O,b as te}from"./utils-a7d63c3f.js";let be=class{constructor(t,e){this._cache=new J(t),this._invalidCache=new J(e)}get(t,e){const i=`${e.uid}:${t}`,s=this._cache.get(i);if(s)return s;if(this._invalidCache.get(i)!==void 0)return null;try{const a=pe.create(t,e);return this._cache.put(i,a),a}catch{return this._invalidCache.put(i,null),null}}};const j=new be(50,500),w="feature-store:unsupported-query",ne=" as ",Se=new Set(["esriFieldTypeOID","esriFieldTypeSmallInteger","esriFieldTypeInteger","esriFieldTypeSingle","esriFieldTypeDouble","esriFieldTypeLong","esriFieldTypeDate"]);function je(u,t){if(!t)return!0;const e=j.get(t,u);if(!e)throw new S(w,"invalid SQL expression",{where:t});if(!e.isStandardized)throw new S(w,"where clause is not standard",{where:t});return Z(u,e.fieldNames,"where clause contains missing fields"),!0}function Ze(u,t,e){if(!t)return!0;const i=j.get(t,u);if(!i)throw new S(w,"invalid SQL expression",{having:t});if(!i.isAggregate)throw new S(w,"having does not contain a valid aggregate function",{having:t});const s=i.fieldNames;if(Z(u,s,"having contains missing fields"),!i.getExpressions().every(a=>{var l;const{aggregateType:n,field:r}=a,o=(l=u.get(r))==null?void 0:l.name;return e.some(c=>{var f;const{onStatisticField:h,statisticType:m}=c;return((f=u.get(h))==null?void 0:f.name)===o&&m.toLowerCase().trim()===n})}))throw new S(w,"expressions in having should also exist in outStatistics",{having:t});return!0}function N(u,t){return u?j.get(u,t):null}function Z(u,t,e,i=!0){const s=[];for(const a of t)if(a!=="*"&&!u.has(a))if(i){const n=re(a);try{const r=N(n,u);if(!r)throw new S(w,"invalid SQL expression",{where:n});if(!r.isStandardized)throw new S(w,"expression is not standard",{clause:r});Z(u,r.fieldNames,"expression contains missing fields")}catch(r){const o=r&&r.details;if(o&&(o.clause||o.where))throw r;o&&o.missingFields?s.push(...o.missingFields):s.push(a)}}else s.push(a);if(s.length)throw new S(w,e,{missingFields:s})}function re(u){return u.split(ne)[0]}function we(u){return u.split(ne)[1]}function Qe(u,t){const e=t.get(u);return!!e&&!Se.has(e.type)}class q{constructor(t,e,i){this._fieldDataCache=new Map,this._returnDistinctMap=new Map,this.returnDistinctValues=t.returnDistinctValues??!1,this.fieldsIndex=i,this.featureAdapter=e;const s=t.outFields;if(s&&!s.includes("*")){this.outFields=s;let a=0;for(const n of s){const r=re(n),o=this.fieldsIndex.get(r),l=o?null:N(r,i),c=o?o.name:we(n)||"FIELD_EXP_"+a++;this._fieldDataCache.set(n,{alias:c,clause:l})}}}countDistinctValues(t){return this.returnDistinctValues?(t.forEach(e=>this.getAttributes(e)),this._returnDistinctMap.size):t.length}getAttributes(t){const e=this._processAttributesForOutFields(t);return this._processAttributesForDistinctValues(e)}getFieldValue(t,e,i){var n;const s=i?i.name:e;let a=null;return this._fieldDataCache.has(s)?a=(n=this._fieldDataCache.get(s))==null?void 0:n.clause:i||(a=N(e,this.fieldsIndex),this._fieldDataCache.set(s,{alias:s,clause:a})),i?this.featureAdapter.getAttribute(t,s):a==null?void 0:a.calculateValue(t,this.featureAdapter)}getDataValue(t,e){const i=e.normalizationType,s=e.normalizationTotal;let a=e.field&&this.getFieldValue(t,e.field,this.fieldsIndex.get(e.field));if(e.field2&&(a=`${P(a)}${e.fieldDelimiter}${P(this.getFieldValue(t,e.field2,this.fieldsIndex.get(e.field2)))}`,e.field3&&(a=`${a}${e.fieldDelimiter}${P(this.getFieldValue(t,e.field3,this.fieldsIndex.get(e.field3)))}`)),i&&Number.isFinite(a)){const n=i==="field"&&e.normalizationField?this.getFieldValue(t,e.normalizationField,this.fieldsIndex.get(e.normalizationField)):null;a=ye(a,i,n,s)}return a}getExpressionValue(t,e,i,s){const a={attributes:this.featureAdapter.getAttributes(t),layer:{fields:this.fieldsIndex.fields}},n=s.createExecContext(a,i);return s.executeFunction(e,n)}getExpressionValues(t,e,i,s){const a={fields:this.fieldsIndex.fields};return t.map(n=>{const r={attributes:this.featureAdapter.getAttributes(n),layer:a},o=s.createExecContext(r,i);return s.executeFunction(e,o)})}validateItem(t,e){var i,s;return this._fieldDataCache.has(e)||this._fieldDataCache.set(e,{alias:e,clause:N(e,this.fieldsIndex)}),((s=(i=this._fieldDataCache.get(e))==null?void 0:i.clause)==null?void 0:s.testFeature(t,this.featureAdapter))??!1}validateItems(t,e){var i,s;return this._fieldDataCache.has(e)||this._fieldDataCache.set(e,{alias:e,clause:N(e,this.fieldsIndex)}),((s=(i=this._fieldDataCache.get(e))==null?void 0:i.clause)==null?void 0:s.testSet(t,this.featureAdapter))??!1}_processAttributesForOutFields(t){const e=this.outFields;if(!e||!e.length)return this.featureAdapter.getAttributes(t);const i={};for(const s of e){const{alias:a,clause:n}=this._fieldDataCache.get(s);i[a]=n?n.calculateValue(t,this.featureAdapter):this.featureAdapter.getAttribute(t,a)}return i}_processAttributesForDistinctValues(t){if(ae(t)||!this.returnDistinctValues)return t;const e=this.outFields,i=[];if(e)for(const n of e){const{alias:r}=this._fieldDataCache.get(n);i.push(t[r])}else for(const n in t)i.push(t[n]);const s=`${(e||["*"]).join(",")}=${i.join(",")}`;let a=this._returnDistinctMap.get(s)||0;return this._returnDistinctMap.set(s,++a),a>1?null:t}}function ze(u,t,e){return{objectId:u,target:t,distance:e,type:"vertex"}}function Ee(u,t,e,i,s,a=!1){return{objectId:u,target:t,distance:e,type:"edge",start:i,end:s,draped:a}}class Le{constructor(t,e,i){this.items=t,this.query=e,this.geometryType=i.geometryType,this.hasM=i.hasM,this.hasZ=i.hasZ,this.fieldsIndex=i.fieldsIndex,this.objectIdField=i.objectIdField,this.spatialReference=i.spatialReference,this.featureAdapter=i.featureAdapter}get size(){return this.items.length}createQueryResponseForCount(){const t=new q(this.query,this.featureAdapter,this.fieldsIndex);if(!this.query.outStatistics)return t.countDistinctValues(this.items);const{groupByFieldsForStatistics:e,having:i,outStatistics:s}=this.query;if(!(e==null?void 0:e.length))return 1;const n=new Map,r=new Map,o=new Set;for(const l of s){const{statisticType:c}=l,h=c!=="exceedslimit"?l.onStatisticField:void 0;if(!r.has(h)){const d=[];for(const f of e){const y=this._getAttributeValues(t,f,n);d.push(y)}r.set(h,this._calculateUniqueValues(d,t.returnDistinctValues))}const m=r.get(h);for(const d in m){const{data:f,items:y}=m[d],_=f.join(",");i&&!t.validateItems(y,i)||o.add(_)}}return o.size}async createQueryResponse(){let t;if(this.query.outStatistics?t=this.query.outStatistics.some(e=>e.statisticType==="exceedslimit")?this._createExceedsLimitQueryResponse(this.query):await this._createStatisticsQueryResponse(this.query):t=this._createFeatureQueryResponse(this.query),this.query.returnQueryGeometry){const e=this.query.geometry;ce(this.query.outSR)&&!U(e.spatialReference,this.query.outSR)?t.queryGeometry=$({spatialReference:this.query.outSR,...ee(e,e.spatialReference,this.query.outSR)}):t.queryGeometry=$({spatialReference:this.query.outSR,...e})}return t}createSnappingResponse(t,e){const i=this.featureAdapter,s=ie(this.hasZ,this.hasM),{point:a,mode:n}=t,r=typeof t.distance=="number"?t.distance:t.distance.x,o=typeof t.distance=="number"?t.distance:t.distance.y,l={candidates:[]},c=this.geometryType==="esriGeometryPolygon",h=this._getPointCreator(n,this.spatialReference,e),m=new se(null,0),d=new se(null,0),f={x:0,y:0,z:0};for(const y of this.items){const _=i.getGeometry(y);if(ae(_))continue;const{coords:x,lengths:V}=_;if(m.coords=x,d.coords=x,t.types&G.EDGE){let F=0;for(let I=0;I<V.length;I++){const p=V[I];for(let g=0;g<p;g++,F+=s){const T=m;if(T.coordsIndex=F,g!==p-1){const v=d;v.coordsIndex=F+s;const C=f;Ce(f,a,T,v);const D=(a.x-C.x)/r,A=(a.y-C.y)/o,z=D*D+A*A;z<=1&&l.candidates.push(Ee(i.getObjectId(y),h(C),Math.sqrt(z),h(T),h(v)))}}}}if(t.types&G.VERTEX){const F=c?x.length-s:x.length;for(let I=0;I<F;I+=s){const p=m;p.coordsIndex=I;const g=(a.x-p.x)/r,T=(a.y-p.y)/o,v=g*g+T*T;v<=1&&l.candidates.push(ze(i.getObjectId(y),h(p),Math.sqrt(v)))}}}return l.candidates.sort((y,_)=>y.distance-_.distance),l}_getPointCreator(t,e,i){const s=Y(i)&&!U(e,i)?r=>ee(r,e,i):r=>r,{hasZ:a}=this,n=0;return t==="3d"?a?({x:r,y:o,z:l})=>s({x:r,y:o,z:l}):({x:r,y:o})=>s({x:r,y:o,z:n}):({x:r,y:o})=>s({x:r,y:o})}async createSummaryStatisticsResponse(t){const{field:e,valueExpression:i,normalizationField:s,normalizationType:a,normalizationTotal:n,minValue:r,maxValue:o,scale:l}=t,c=this.fieldsIndex.isDateField(e),h=await this._getDataValues({field:e,valueExpression:i,normalizationField:s,normalizationType:a,normalizationTotal:n,scale:l}),m=xe({normalizationType:a,normalizationField:s,minValue:r,maxValue:o}),d=this.fieldsIndex.get(e),f={value:.5,fieldType:d==null?void 0:d.type},y=H(d)?K({values:h,supportsNullCount:m,percentileParams:f}):W({values:h,minValue:r,maxValue:o,useSampleStdDev:!a,supportsNullCount:m,percentileParams:f});return Fe(y,c)}async createUniqueValuesResponse(t){const{field:e,valueExpression:i,domains:s,returnAllCodedValues:a,scale:n}=t,r=await this._getDataValues({field:e,field2:t.field2,field3:t.field3,fieldDelimiter:t.fieldDelimiter,valueExpression:i,scale:n}),o=Ie(r);return _e(o,s,a,t.fieldDelimiter)}async createClassBreaksResponse(t){const{field:e,valueExpression:i,normalizationField:s,normalizationType:a,normalizationTotal:n,classificationMethod:r,standardDeviationInterval:o,minValue:l,maxValue:c,numClasses:h,scale:m}=t,d=await this._getDataValues({field:e,valueExpression:i,normalizationField:s,normalizationType:a,normalizationTotal:n,scale:m}),f=Ve(d,{field:e,normalizationField:s,normalizationType:a,normalizationTotal:n,classificationMethod:r,standardDeviationInterval:o,minValue:l,maxValue:c,numClasses:h});return Te(f,r)}async createHistogramResponse(t){const{field:e,valueExpression:i,normalizationField:s,normalizationType:a,normalizationTotal:n,classificationMethod:r,standardDeviationInterval:o,minValue:l,maxValue:c,numBins:h,scale:m}=t,d=await this._getDataValues({field:e,valueExpression:i,normalizationField:s,normalizationType:a,normalizationTotal:n,scale:m});return ve(d,{field:e,normalizationField:s,normalizationType:a,normalizationTotal:n,classificationMethod:r,standardDeviationInterval:o,minValue:l,maxValue:c,numBins:h})}_sortFeatures(t,e,i){if(t.length>1&&e&&e.length)for(const s of e.reverse()){const a=s.split(" "),n=a[0],r=this.fieldsIndex.get(n),o=!!a[1]&&a[1].toLowerCase()==="desc",l=De(r==null?void 0:r.type,o);t.sort((c,h)=>{const m=i(c,n,r),d=i(h,n,r);return l(m,d)})}}_createFeatureQueryResponse(t){const e=this.items,{geometryType:i,hasM:s,hasZ:a,objectIdField:n,spatialReference:r}=this,{outFields:o,outSR:l,quantizationParameters:c,resultRecordCount:h,resultOffset:m,returnZ:d,returnM:f}=t,y=h!=null&&e.length>(m||0)+h,_=o&&(o.includes("*")?[...this.fieldsIndex.fields]:o.map(x=>this.fieldsIndex.get(x)));return{exceededTransferLimit:y,features:this._createFeatures(t,e),fields:_,geometryType:i,hasM:s&&f,hasZ:a&&d,objectIdFieldName:n,spatialReference:$(l||r),transform:c&&k(c)||null}}_createFeatures(t,e){const i=new q(t,this.featureAdapter,this.fieldsIndex),{hasM:s,hasZ:a}=this,{orderByFields:n,quantizationParameters:r,returnGeometry:o,returnCentroid:l,maxAllowableOffset:c,resultOffset:h,resultRecordCount:m,returnZ:d=!1,returnM:f=!1}=t,y=a&&d,_=s&&f;let x=[],V=0;const F=[...e];if(this._sortFeatures(F,n,(p,g,T)=>i.getFieldValue(p,g,T)),o||l){const p=k(r)??void 0;if(o&&!l)for(const g of F)x[V++]={attributes:i.getAttributes(g),geometry:O(this.geometryType,this.hasZ,this.hasM,this.featureAdapter.getGeometry(g),c,p,y,_)};else if(!o&&l)for(const g of F)x[V++]={attributes:i.getAttributes(g),centroid:te(this,this.featureAdapter.getCentroid(g,this),p)};else for(const g of F)x[V++]={attributes:i.getAttributes(g),centroid:te(this,this.featureAdapter.getCentroid(g,this),p),geometry:O(this.geometryType,this.hasZ,this.hasM,this.featureAdapter.getGeometry(g),c,p,y,_)}}else for(const p of F){const g=i.getAttributes(p);g&&(x[V++]={attributes:g})}const I=h||0;if(m!=null){const p=I+m;x=x.slice(I,Math.min(x.length,p))}return x}_createExceedsLimitQueryResponse(t){let e=!1,i=Number.POSITIVE_INFINITY,s=Number.POSITIVE_INFINITY,a=Number.POSITIVE_INFINITY;for(const n of t.outStatistics??[])if(n.statisticType==="exceedslimit"){i=n.maxPointCount!=null?n.maxPointCount:Number.POSITIVE_INFINITY,s=n.maxRecordCount!=null?n.maxRecordCount:Number.POSITIVE_INFINITY,a=n.maxVertexCount!=null?n.maxVertexCount:Number.POSITIVE_INFINITY;break}if(this.geometryType==="esriGeometryPoint")e=this.items.length>i;else if(this.items.length>s)e=!0;else{const n=ie(this.hasZ,this.hasM),r=this.featureAdapter;e=this.items.reduce((o,l)=>{const c=r.getGeometry(l);return o+(Y(c)&&c.coords.length||0)},0)/n>a}return{fields:[{name:"exceedslimit",type:"esriFieldTypeInteger",alias:"exceedslimit",sqlType:"sqlTypeInteger",domain:null,defaultValue:null}],features:[{attributes:{exceedslimit:Number(e)}}]}}async _createStatisticsQueryResponse(t){const e={attributes:{}},i=[],s=new Map,a=new Map,n=new Map,r=new Map,o=new q(t,this.featureAdapter,this.fieldsIndex),l=t.outStatistics,{groupByFieldsForStatistics:c,having:h,orderByFields:m}=t,d=c&&c.length,f=!!d,y=f?c[0]:null,_=f&&!this.fieldsIndex.get(y);for(const V of l??[]){const{outStatisticFieldName:F,statisticType:I}=V,p=V,g=I!=="exceedslimit"?V.onStatisticField:void 0,T=I==="percentile_disc"||I==="percentile_cont",v=I==="EnvelopeAggregate"||I==="CentroidAggregate"||I==="ConvexHullAggregate",C=f&&d===1&&(g===y||_)&&I==="count";if(f){if(!n.has(g)){const A=[];for(const z of c){const M=this._getAttributeValues(o,z,s);A.push(M)}n.set(g,this._calculateUniqueValues(A,!v&&o.returnDistinctValues))}const D=n.get(g);for(const A in D){const{count:z,data:M,items:Q,itemPositions:oe}=D[A],L=M.join(",");if(!h||o.validateItems(Q,h)){const E=r.get(L)||{attributes:{}};if(v){E.aggregateGeometries||(E.aggregateGeometries={});const{aggregateGeometries:b,outStatisticFieldName:R}=await this._getAggregateGeometry(p,Q);E.aggregateGeometries[R]=b}else{let b=null;if(C)b=z;else{const R=this._getAttributeValues(o,g,s),B=oe.map(ue=>R[ue]);b=T&&"statisticParameters"in p?this._getPercentileValue(p,B):this._getStatisticValue(p,B,null,o.returnDistinctValues)}E.attributes[F]=b}let le=0;c.forEach((b,R)=>E.attributes[this.fieldsIndex.get(b)?b:"EXPR_"+ ++le]=M[R]),r.set(L,E)}}}else if(v){e.aggregateGeometries||(e.aggregateGeometries={});const{aggregateGeometries:D,outStatisticFieldName:A}=await this._getAggregateGeometry(p,this.items);e.aggregateGeometries[A]=D}else{const D=this._getAttributeValues(o,g,s);e.attributes[F]=T&&"statisticParameters"in p?this._getPercentileValue(p,D):this._getStatisticValue(p,D,a,o.returnDistinctValues)}i.push({name:F,alias:F,type:"esriFieldTypeDouble"})}const x=f?Array.from(r.values()):[e];return this._sortFeatures(x,m,(V,F)=>V.attributes[F]),{fields:i,features:x}}async _getAggregateGeometry(t,e){const i=await de(()=>import("./geometryEngineJSON-1e940afe.js"),["assets/geometryEngineJSON-1e940afe.js","assets/geometryEngineBase-e1a33b0a.js","assets/geometryEngineJSON-3f330436.js","assets/json-48e3ea08.js"]),{statisticType:s,outStatisticFieldName:a}=t,{featureAdapter:n,spatialReference:r,geometryType:o,hasZ:l,hasM:c}=this,h=e.map(f=>O(o,l,c,n.getGeometry(f))),m=i.convexHull(r,h,!0)[0],d={aggregateGeometries:null,outStatisticFieldName:null};if(s==="EnvelopeAggregate"){const f=m?he(m):X(i.union(r,h));d.aggregateGeometries={...f,spatialReference:r},d.outStatisticFieldName=a||"extent"}else if(s==="CentroidAggregate"){const f=m?fe(m):me(X(i.union(r,h)));d.aggregateGeometries={x:f[0],y:f[1],spatialReference:r},d.outStatisticFieldName=a||"centroid"}else s==="ConvexHullAggregate"&&(d.aggregateGeometries=m,d.outStatisticFieldName=a||"convexHull");return d}_getStatisticValue(t,e,i,s){const{onStatisticField:a,statisticType:n}=t;let r=null;return r=i!=null&&i.has(a)?i.get(a):H(this.fieldsIndex.get(a))?K({values:e,returnDistinct:s}):W({values:s?[...new Set(e)]:e,minValue:null,maxValue:null,useSampleStdDev:!0}),i&&i.set(a,r),r[n==="var"?"variance":n]}_getPercentileValue(t,e){const{onStatisticField:i,statisticParameters:s,statisticType:a}=t,{value:n,orderBy:r}=s,o=this.fieldsIndex.get(i);return Ae(e,{value:n,orderBy:r,fieldType:o==null?void 0:o.type,isDiscrete:a==="percentile_disc"})}_getAttributeValues(t,e,i){if(i.has(e))return i.get(e);const s=this.fieldsIndex.get(e),a=this.items.map(n=>t.getFieldValue(n,e,s));return i.set(e,a),a}_getAttributeDataValues(t,e){return this.items.map(i=>t.getDataValue(i,{field:e.field,field2:e.field2,field3:e.field3,fieldDelimiter:e.fieldDelimiter,normalizationField:e.normalizationField,normalizationType:e.normalizationType,normalizationTotal:e.normalizationTotal}))}async _getAttributeExpressionValues(t,e,i){const{arcadeUtils:s}=await ge(),a=s.createFunction(e),n=i&&s.getViewInfo(i);return t.getExpressionValues(this.items,a,n,s)}_calculateUniqueValues(t,e){const i={},s=this.items,a=s.length;for(let n=0;n<a;n++){const r=s[n],o=[];for(const c of t)o.push(c[n]);const l=o.join(",");i[l]==null?i[l]={count:1,data:o,items:[r],itemPositions:[n]}:(e||i[l].count++,i[l].items.push(r),i[l].itemPositions.push(n))}return i}async _getDataValues(t){const e=new q(this.query,this.featureAdapter,this.fieldsIndex),{valueExpression:i,field:s,normalizationField:a,normalizationType:n,normalizationTotal:r,scale:o}=t,l=i?{viewingMode:"map",scale:o,spatialReference:this.query.outSR||this.spatialReference}:null;return i?this._getAttributeExpressionValues(e,i,l):this._getAttributeDataValues(e,{field:s,field2:t.field2,field3:t.field3,fieldDelimiter:t.fieldDelimiter,normalizationField:a,normalizationType:n,normalizationTotal:r})}}function Ce(u,t,e,i){const s=i.x-e.x,a=i.y-e.y,n=s*s+a*a,r=(t.x-e.x)*s+(t.y-e.y)*a,o=Math.min(1,Math.max(0,r/n));u.x=e.x+s*o,u.y=e.y+a*o}function ie(u,t){return u?t?4:3:t?3:2}var G;(function(u){u[u.NONE=0]="NONE",u[u.EDGE=1]="EDGE",u[u.VERTEX=2]="VERTEX"})(G||(G={}));class se{constructor(t,e){this.coords=t,this.coordsIndex=e}get x(){return this.coords[this.coordsIndex]}get y(){return this.coords[this.coordsIndex+1]}get z(){return this.coords[this.coordsIndex+2]}}export{Le as A,G as D,Ze as a,Z as c,Qe as f,N as l,je as o};
