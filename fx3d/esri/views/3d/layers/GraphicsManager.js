/**
 * Copyright @ 2020 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["esri/core/Accessor"],function(t){var e=0,n=t.createSubclass({constructor:function(){this._deletedGraphicsIndex=new Set,this._intentsIndex=new Map},destroy:function(){this.removeAll(),this._deletedGraphicsIndex=null,this._intentsIndex=null},properties:{graphics:null,indexById:{value:null,dependsOn:["graphics","objectIdField"],get:function(){return this._createIndexById(this.graphics&&this.graphics.toArray(),this.objectIdField)}},numGraphics:{value:0,dependsOn:["indexById"],get:function(){return this.indexById?this.indexById.size:0}},objectIdField:null,updating:{value:!1,dependsOn:["_intentsIndex"],get:function(){return!!(this._intentsIndex&&this._intentsIndex.size>0)}},_intentsIndex:{value:null}},_oldIndex:null,_deletedGraphicsIndex:null,beginPagedUpdate:function(){this._oldIndex=this.indexById,this.indexById=null,this.notifyChange("numGraphics")},addPage:function(t,e){this.add(t,e)},revertPagedUpdate:function(){var t=this._removeLeftOnly(this.indexById,this._oldIndex);this.indexById=this._oldIndex,this._oldIndex=null,this.graphics.removeMany(t),this.notifyChange("numGraphics")},endPagedUpdate:function(){var t=this._removeLeftOnly(this._oldIndex,this.indexById);this._oldIndex=null,this.graphics.removeMany(t),this.notifyChange("numGraphics")},findGraphic:function(t){var e=this.indexById&&this.indexById.get(t);return e&&e.graphic},removeAll:function(){this.indexById=this._oldIndex=null,this.graphics.removeAll(),this.notifyChange("numGraphics")},add:function(t,e){if(t&&t.length){for(var n=this.objectIdField,i=this.indexById=this.indexById||new Map,d=this._oldIndex,s=this._createIndexById(t,n),r=this._extractObjectIds(s),h=this._extractObjectIds(i),a=this._extractObjectIds(d),o=h.concat(a),c=[],u=o.length,l=0;l<u;l++){var f=o[l];r.indexOf(f)>-1&&c.push(f)}c.length&&this._remove(c,!1);for(var I=this.findIntent(e),x=new Map,p=t.length,l=0;l<p;l++){var g=t[l];g&&g.attributes&&x.set(g.attributes[n],I)}t.length&&this._add(t,x)}},remove:function(t){this._remove(t,!1)},"delete":function(t){this._remove(t,!0)},isDeleted:function(t){return this._deletedGraphicsIndex.has(t)},createIntentToAdd:function(t){t&&this._intentsIndex.forEach(function(e,n){t.forEach(function(t){e.ignoredIds.add(t)})},this);var n=e++;return this._intentsIndex.set(n,{ignoredIds:new Set}),this.notifyChange("updating"),n},findIntent:function(t){return this._intentsIndex.get(t)},removeIntent:function(t){this._intentsIndex["delete"](t),this.notifyChange("updating")},update:function(t,e){if(t&&t.length){for(var n=this.objectIdField,i=this.indexById=this.indexById||new Map,d=this._oldIndex,s=this._createIndexById(t,n),r=this._extractObjectIds(s),h=this._extractObjectIds(i),a=this._extractObjectIds(d),o=h.concat(a),c=[],u=o.length,l=0;l<u;l++){var f=o[l];if(r.indexOf(f)===-1)c.push(f);else{var I=i.get(f)||d.get(f),x=I&&I.graphic&&I.graphic._ts,p=s.get(f),g=p&&p.graphic&&p.graphic._ts;g>x&&c.push(f)}}for(var _=[],v=r.length,l=0;l<v;l++){var f=r[l];(o.indexOf(f)===-1||c.indexOf(f)>-1)&&_.push(f)}c.length&&this._remove(c,!1),_.length&&this._add(this._extractGraphics(_,s),e)}},_createIndexById:function(t,e){var n;if(t&&t.length&&e){var i,d,s;for(n=new Map,i=0;d=t[i];i++)s=d.attributes&&d.attributes[e],null!=s&&n.set(s,{graphic:d,refCount:1})}return n},_add:function(t,e){var n=this.objectIdField;t.forEach(function(t){var i=t.attributes&&t.attributes[n],d=e.get(i);this._addToIndex(t,this.indexById,d)},this),this.graphics.addMany(t),this.notifyChange("numGraphics")},_addToIndex:function(t,e,n){var i=t.attributes&&t.attributes[this.objectIdField];if(e&&null!=i)if(e.has(i)){if(!n||!n.ignoredIds.has(i)){var d=e.get(i);e.set(i,{graphic:t,refCount:d.refCount+1})}}else this.isDeleted(i)||e.set(i,{graphic:t,refCount:1})},_remove:function(t,e){t=t||[];var n;n="object"==typeof t[0]?t.map(function(t){return t.attributes&&t.attributes[this.objectIdField]}.bind(this)):t;var i=this._extractGraphics(n,this._oldIndex),d=this._extractGraphics(n,this.indexById);n.forEach(function(t){e&&this._deletedGraphicsIndex.add(t),this._removeFromIndex(t,this._oldIndex,e),this._removeFromIndex(t,this.indexById,e)}.bind(this)),this.graphics.removeMany(i.concat(d)),this.notifyChange("numGraphics")},_removeFromIndex:function(t,e,n){if(e&&e.has(t))if(n)e["delete"](t);else{var i=e.get(t),d=i.refCount-1;0===d?e["delete"](t):i.refCount=d}},_removeLeftOnly:function(t,e){var n=[];return t&&t.forEach(function(i,d){var s=i.graphic;!s||e&&e.has(d)||(i.refCount=i.refCount-1,0===i.refCount&&t["delete"](d),n.push(s))}),n},_extractGraphics:function(t,e){return t&&e?t.map(function(t){var n=e.get(t);return n&&n.graphic}):[]},_extractObjectIds:function(t){var e=[];return t&&t.forEach(function(t,n){e.push(n)}),e}});return n});