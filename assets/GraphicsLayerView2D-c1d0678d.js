import{b as e,w as m,j as s,n as a,e as h,y as g,a as l}from"./index-c754ff65.js";import{f as c,u as n}from"./LayerView-968a0443.js";import{i as d}from"./GraphicContainer-c8c09d12.js";import{a as u}from"./GraphicsView2D-734762b1.js";import"./Container-72cba08e.js";import"./MapView-2d5cc699.js";import"./Viewpoint-eb6ec031.js";import"./Cyclical-5c5da130.js";import"./CollectionFlattener-459cb615.js";import"./TileInfo-2589d4ff.js";import"./aaBoundingRect-5c57438c.js";import"./TileKey-b87e0dc5.js";import"./widget-7352089c.js";import"./uuid-73213768.js";import"./byteSizeEstimations-90c5a50d.js";import"./AttachmentInfo-2f7fbe5e.js";import"./Heading-adb0ad8a.js";import"./symbolUtils-5e5f8d3d.js";import"./utils-7a1e2b28.js";import"./ItemCache-096925bc.js";import"./utils-bd924f31.js";import"./colorUtils-c0f43caf.js";import"./mat2d-e11be45e.js";import"./webStyleSymbolUtils-5cb46bea.js";import"./devEnvironmentUtils-5002a058.js";import"./executeQueryJSON-ca6c73e1.js";import"./utils-3b5f5c5a.js";import"./query-d95b3dd5.js";import"./normalizeUtils-703059af.js";import"./normalizeUtilsCommon-258cba9f.js";import"./pbfQueryUtils-06c77b54.js";import"./pbf-f46def03.js";import"./OptimizedGeometry-9aa8664b.js";import"./OptimizedFeatureSet-1d1ac4b9.js";import"./featureConversionUtils-c00360ef.js";import"./Scheduler-68df8c73.js";import"./layerViewUtils-5da1782e.js";import"./GoTo-9b5cecfc.js";import"./accessibleHandler-b82b4bb4.js";import"./vmEvent-d773b6c5.js";import"./Map-e64f8eb2.js";import"./Basemap-11f6c81d.js";import"./loadAll-026b7227.js";import"./writeUtils-a7e8e976.js";import"./basemapUtils-abd7da37.js";import"./TablesMixin-8184194b.js";import"./GraphicsCollection-b80722b0.js";import"./ViewingMode-915d19cb.js";import"./unitBezier-881ac1eb.js";import"./vec2-bbd3449a.js";import"./vec2f64-22afc56f.js";import"./mat3-21bcfd83.js";import"./TileStrategy-1967197e.js";import"./TileInfoView-ccee1155.js";import"./quickselect-56c5966e.js";import"./TileKey-b1f5cdb9.js";import"./capabilities-57d1a30a.js";import"./EffectView-a1fb6514.js";import"./definitions-f329b961.js";import"./enums-64ab819c.js";import"./Texture-ca46920b.js";import"./color-6aec3839.js";import"./enums-55085e26.js";import"./VertexElementDescriptor-2925c6af.js";import"./number-b10bd8f5.js";import"./BaseGraphicContainer-862908ea.js";import"./FeatureContainer-86576b95.js";import"./AttributeStoreView-bcdc844b.js";import"./TiledDisplayObject-accbee08.js";import"./visualVariablesUtils-50880e5a.js";import"./visualVariablesUtils-7dbd5d40.js";import"./VertexArrayObject-07c1da56.js";import"./TileContainer-842f76b1.js";import"./WGLContainer-e2488f5a.js";import"./ProgramTemplate-9f1c124b.js";import"./MaterialKey-5b247dd4.js";import"./alignmentUtils-ae955d28.js";import"./utils-7263c34f.js";import"./StyleDefinition-fbc907c2.js";import"./config-1337d16e.js";import"./GeometryUtils-dd03fc25.js";import"./earcut-61f7b102.js";import"./vec3f32-ad1dc57f.js";import"./cimAnalyzer-02b56dc2.js";import"./fontUtils-afce1abc.js";import"./BidiEngine-836b7ef6.js";import"./GeometryUtils-fea59923.js";import"./Rect-ea14f53a.js";import"./quantizationUtils-193e54d0.js";import"./floatRGBA-4f7fa53a.js";import"./normalizeUtilsSync-f1c7dfdb.js";import"./projectionSupport-60e6d2f8.js";import"./json-48e3ea08.js";import"./Matcher-10c827e6.js";import"./tileUtils-c2f19f52.js";import"./TurboLine-0c6b5b1e.js";import"./ExpandedCIM-2a6dd26b.js";import"./schemaUtils-9a6e7dda.js";import"./createSymbolSchema-21e81f0c.js";import"./util-e5019f71.js";import"./ComputedAttributeStorage-b555102a.js";import"./arcadeTimeUtils-ef4a84e4.js";import"./executionError-fb3f283a.js";import"./centroid-335ed93e.js";const w={remove(){},pause(){},resume(){}};let o=class extends c(n){constructor(){super(...arguments),this._highlightIds=new Map}attach(){this.graphicsView=new u({requestUpdateCallback:()=>this.requestUpdate(),view:this.view,graphics:this.layer.graphics,container:new d(this.view.featuresTilingScheme)}),this._updateHighlight(),this.container.addChild(this.graphicsView.container),this.addAttachHandles(this.layer.on("graphic-update",this.graphicsView.graphicUpdateHandler))}detach(){this.container.removeAllChildren(),this.graphicsView=e(this.graphicsView)}async hitTest(i){return this.graphicsView?this.graphicsView.hitTest(i).map(t=>({type:"graphic",graphic:t,mapPoint:i,layer:this.layer})):null}async fetchPopupFeatures(i){return this.graphicsView?this.graphicsView.hitTest(i).filter(t=>!!t.popupTemplate):[]}queryGraphics(){return Promise.resolve(this.graphicsView.graphics)}update(i){this.graphicsView.processUpdate(i)}moveStart(){}viewChange(){this.graphicsView.viewChange()}moveEnd(){}isUpdating(){return!this.graphicsView||this.graphicsView.updating}highlight(i){let t;typeof i=="number"?t=[i]:i instanceof m?t=[i.uid]:Array.isArray(i)&&i.length>0?t=typeof i[0]=="number"?i:i.map(p=>p&&p.uid):s.isCollection(i)&&i.length>0&&(t=i.map(p=>p&&p.uid).toArray());const r=t==null?void 0:t.filter(a);return r!=null&&r.length?(this._addHighlight(r),{remove:()=>this._removeHighlight(r)}):w}_addHighlight(i){for(const t of i)if(this._highlightIds.has(t)){const r=this._highlightIds.get(t);this._highlightIds.set(t,r+1)}else this._highlightIds.set(t,1);this._updateHighlight()}_removeHighlight(i){for(const t of i)if(this._highlightIds.has(t)){const r=this._highlightIds.get(t)-1;r===0?this._highlightIds.delete(t):this._highlightIds.set(t,r)}this._updateHighlight()}_updateHighlight(){var i;(i=this.graphicsView)==null||i.setHighlight(Array.from(this._highlightIds.keys()))}};h([g()],o.prototype,"graphicsView",void 0),o=h([l("esri.views.2d.layers.GraphicsLayerView2D")],o);const nt=o;export{nt as default};
