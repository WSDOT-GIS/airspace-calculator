import{e as a,y as l,c_ as n,a as h,j as d,l as o,ak as p,bh as V,g as y}from"./index-1de34779.js";import{r as w}from"./GroupContainer-003e33a7.js";import{u as v,f as u}from"./LayerView-c09ce6b8.js";import"./WGLContainer-b530f017.js";import"./MapView-bd487abe.js";import"./Viewpoint-ea32c9f1.js";import"./Cyclical-49a6a04d.js";import"./CollectionFlattener-69c675dd.js";import"./TileInfo-c53ba83b.js";import"./aaBoundingRect-da6cd5b1.js";import"./TileKey-b87e0dc5.js";import"./widget-4447051f.js";import"./uuid-73213768.js";import"./byteSizeEstimations-90c5a50d.js";import"./AttachmentInfo-191d5abd.js";import"./Heading-bde04247.js";import"./symbolUtils-0c3c786b.js";import"./utils-47432d32.js";import"./ItemCache-edc397ee.js";import"./utils-960d8c85.js";import"./colorUtils-c0f43caf.js";import"./mat2d-e3bbc217.js";import"./webStyleSymbolUtils-1470c8f4.js";import"./devEnvironmentUtils-5002a058.js";import"./executeQueryJSON-7409703b.js";import"./utils-fd07bdbf.js";import"./query-87b53af6.js";import"./normalizeUtils-744c3a37.js";import"./normalizeUtilsCommon-5bd32cf4.js";import"./pbfQueryUtils-9e72fccf.js";import"./pbf-2cecd0ba.js";import"./OptimizedGeometry-48f8abe8.js";import"./OptimizedFeatureSet-1d1ac4b9.js";import"./featureConversionUtils-b6ed3a7e.js";import"./Scheduler-895f76dc.js";import"./layerViewUtils-5da1782e.js";import"./GoTo-2f121aae.js";import"./accessibleHandler-c78ecdf0.js";import"./vmEvent-d773b6c5.js";import"./Map-183141ee.js";import"./Basemap-05b492be.js";import"./loadAll-0643270c.js";import"./writeUtils-c3a30ac3.js";import"./basemapUtils-d89c0772.js";import"./TablesMixin-a90c4927.js";import"./GraphicsCollection-96c69dc0.js";import"./ViewingMode-915d19cb.js";import"./unitBezier-881ac1eb.js";import"./vec2-a3077e7b.js";import"./vec2f64-22afc56f.js";import"./mat3-fdb5e70d.js";import"./TileStrategy-ae37d4cf.js";import"./TileInfoView-d2de27b2.js";import"./quickselect-56c5966e.js";import"./TileKey-d02c5724.js";import"./capabilities-99358f40.js";import"./definitions-f329b961.js";import"./VertexArrayObject-a0fc2785.js";import"./Texture-33390e7d.js";import"./enums-64ab819c.js";import"./VertexElementDescriptor-2925c6af.js";import"./color-0ee4e5aa.js";import"./enums-55085e26.js";import"./number-b10bd8f5.js";import"./ProgramTemplate-178dc95f.js";import"./MaterialKey-9cb0f200.js";import"./alignmentUtils-ae955d28.js";import"./utils-6e7a4f80.js";import"./StyleDefinition-fbc907c2.js";import"./config-1337d16e.js";import"./GeometryUtils-dd03fc25.js";import"./Container-8b0f7655.js";import"./EffectView-8576c2a4.js";import"./earcut-61f7b102.js";let r=class extends v{constructor(i){super(i),this.type="group",this.layerViews=new d}_allLayerViewVisibility(i){this.layerViews.forEach(e=>{e.visible=i})}initialize(){this.handles.add([this.layerViews.on("change",i=>this._layerViewsChangeHandler(i)),o(()=>this.layer.visibilityMode,()=>this._applyVisibility(()=>this._allLayerViewVisibility(this.visible),()=>this._applyExclusiveVisibility(null)),p),o(()=>this.visible,i=>{this._applyVisibility(()=>this._allLayerViewVisibility(i),()=>{})},p)],"grouplayerview"),this._layerViewsChangeHandler({target:null,added:this.layerViews.toArray(),removed:[],moved:[]})}set layerViews(i){this._set("layerViews",V(i,this._get("layerViews")))}get updatingProgress(){return this.layerViews.length===0?1:this.layerViews.reduce((i,e)=>i+e.updatingProgress,0)/this.layerViews.length}isUpdating(){return this.layerViews.some(i=>i.updating)}_hasLayerViewVisibleOverrides(){return this.layerViews.some(i=>i._isOverridden("visible"))}_findLayerViewForLayer(i){return i&&this.layerViews.find(e=>e.layer===i)}_firstVisibleOnLayerOrder(){const i=this.layer.layers.find(e=>{var t;return!!((t=this._findLayerViewForLayer(e))!=null&&t.visible)});return i&&this._findLayerViewForLayer(i)}_applyExclusiveVisibility(i){y(i)&&(i=this._firstVisibleOnLayerOrder(),y(i)&&this.layerViews.length>0&&(i=this._findLayerViewForLayer(this.layer.layers.getItemAt(0)))),this.layerViews.forEach(e=>{e.visible=e===i})}_layerViewsChangeHandler(i){this.handles.remove("grouplayerview:visible"),this.handles.add(this.layerViews.map(t=>o(()=>t.visible,s=>this._applyVisibility(()=>{s!==this.visible&&(t.visible=this.visible)},()=>this._applyExclusiveVisibility(s?t:null)),p)).toArray(),"grouplayerview:visible");const e=i.added[i.added.length-1];this._applyVisibility(()=>this._allLayerViewVisibility(this.visible),()=>this._applyExclusiveVisibility(e!=null&&e.visible?e:null))}_applyVisibility(i,e){var t,s;this._hasLayerViewVisibleOverrides()&&(((t=this.layer)==null?void 0:t.visibilityMode)==="inherited"?i():((s=this.layer)==null?void 0:s.visibilityMode)==="exclusive"&&e())}};a([l({cast:n})],r.prototype,"layerViews",null),a([l({readOnly:!0})],r.prototype,"updatingProgress",null),a([l()],r.prototype,"view",void 0),r=a([h("esri.views.layers.GroupLayerView")],r);const b=r;let m=class extends u(b){constructor(){super(...arguments),this.container=new w}attach(){this._updateStageChildren(),this.addAttachHandles(this.layerViews.on("after-changes",()=>this._updateStageChildren()))}detach(){this.container.removeAllChildren()}update(i){}moveStart(){}viewChange(){}moveEnd(){}_updateStageChildren(){this.container.removeAllChildren(),this.layerViews.forEach((i,e)=>this.container.addChildAt(i.container,e))}};m=a([h("esri.views.2d.layers.GroupLayerView2D")],m);const zi=m;export{zi as default};
