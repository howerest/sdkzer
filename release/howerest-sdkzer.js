/*! howerest-sdkzer 0.1.0-rc.3 | howerest 2016 - <davidvalin@howerest.com> | Apache 2.0 Licensed */
define(["require","exports"],function(a,b){"use strict";var c;!function(a){var b=function(){function a(){}return a.isBrowser=function(){return"undefined"!=typeof window},a.isNode=function(){return"undefined"!=typeof process&&"undefined"!=typeof process.env&&"undefined"!=typeof global},a.nodeVersion=function(){},a}();a.EnvChecker=b;var c=function(){function a(){}return a.obj=function(a){var b=this;return function(a){if(null===a||"object"!=typeof a)return function(a){return a}(a);var c=a.constructor();for(var d in a)a.hasOwnProperty(d)&&(a[d]instanceof Object?c[d]=b.obj(a[d]):c[d]=a[d]);return c}(a)},a}();a.Cloner=c;var d=function(){function a(){}return a.camelize=function(a){return this.walk(a)},a.walk=function(a){var b=this;return this.reduce(Object.keys(a),function(c,d){var e=b.camelCase(d);return c[e]=b.walk(a[d]),c},{})},a.camelCase=function(a){return a.replace(/[_.-](\w|$)/g,function(a,b){return b.toUpperCase()})},a.reduce=function(a,b,c){if(a.reduce)return a.reduce(b,c);for(var d=0;d<a.length;d++)c=b(c,a[d],d);return c},a.map=function(a,b){if(a.map)return a.map(b);for(var c=[],d=0;d<a.length;d++)c.push(b(a[d],d));return c},a}();a.Camel=d}(c=b.Util||(b.Util={}))}),define(["require","exports","es6-promise","./util"],function(a,b,c,d){"use strict";var e;!function(a){var b=function(){function a(){try{return new XMLHttpRequest}catch(a){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(a){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(a){}return null}return a}();a.XHR=b;var e=function(){function a(a){this.name=Object.keys(a)[0],this.value=a[Object.keys(a)[0]]}return a}();a.HttpHeader=e;var f=function(){function a(a){this.response=null,this.query=a;var e,f=this,h=null;if(d.Util.EnvChecker.isBrowser())this.client=new b;else{if(!d.Util.EnvChecker.isNode())return;var i=xhr2;this.client=new i}this.client.open(this.query.httpMethod,this.query.endpoint);for(var j=0;j<this.query.headers.length;j++)this.client.setRequestHeader(this.query.headers[j].name,this.query.headers[j].value);this.query.headers.Accept||this.client.setRequestHeader("Accept","application/json"),this.query.headers["Content-Type"]||this.client.setRequestHeader("Content-Type","application/json;charset=UTF-8"),this.promise=new c.Promise(function(a,b){f.client.onreadystatechange=function(b){b&&4==b.target.readyState&&(200==b.target.status||204==b.target.status?(f.response=new g(f.query.endpoint,{},b.target.responseText?b.target.responseText:null),a(f.response)):(f.promise=c.Promise.reject(!1),a({})))}}),"object"==typeof this.query.data&&(e=Object.keys(this.query.data),e.length>0&&(h=JSON.stringify(this.query.data))),this.client.send(h)}return a}();a.HttpRequest=f;var g=function(){function a(a,b,c,d){if(void 0===d&&(d=!0),c&&d)try{this.data=JSON.parse(c)}catch(e){}else this.data=c}return a}();a.HttpResponse=g;var h=function(){function a(a){this.httpMethod="GET",this.qsParams={},this.headers=[],this.data={},this.endpoint=a.endpoint,this.httpMethod=a.httpMethod,this.qsParams=a.qsParams,this.headers=a.headers,this.data=a.data}return a.prototype.where=function(a){void 0===a&&(a=this.qsParams);for(var b in a)a.hasOwnProperty(b)&&(this.qsParams[b]=a[b]);return this},a.prototype.withHeaders=function(a){void 0===a&&(a=[]),this.headers=a},a.prototype.withData=function(a){void 0===a&&(a={}),this.data=a},a.prototype.qsParamsToString=function(a){return void 0===a&&(a=this.qsParams),this.serialize(a)},a.prototype.serialize=function(a){var b=[];for(var c in a){var d=a[c];b.push("object"==typeof d?this.serialize(d):encodeURIComponent(c)+"="+encodeURIComponent(d))}return b.join("&")},a}();a.HttpQuery=h;var i=function(){function b(){}return b.mergeHttpQueries=function(b){for(var c=new a.HttpQuery({endpoint:null,httpMethod:null,qsParams:{},headers:[],data:{}}),d=0;d<b.length;d++)for(var e=["httpMethod","endpoint","headers","qsParams","data"],f=0;f<e.length;f++)"undefined"!=typeof b[d][e[f]]&&(c[e[f]]=b[d][e[f]]);return c},b}();a.Merger=i}(e=b.WebServices||(b.WebServices={}))}),define(["require","exports"],function(a,b){"use strict";var c=function(){function a(){}return a.defineModule=function(a,b){if("undefined"!=typeof angular&&"undefined"!=typeof angular.module)angular.module(a,[]).factory([function(){return b}]);else{var c="undefined"!=typeof window,d="undefined"!=typeof process&&"undefined"!=typeof process.env&&"undefined"!=typeof global;c?"function"==typeof define&&define.amd||"undefined"!=typeof window&&(window[a]=b):d&&(global[a]=b)}},a}();b.Modularizer=c}),define(["require","exports","es6-promise","./howerest.modularizer","js-webservices/ts/web_services"],function(require,exports,es6_promise_1,howerest_modularizer_1,web_services_1){"use strict";var Sdkzer=function(){function Sdkzer(a){void 0===a&&(a={}),this.syncing=!1,this.lastResponse=null,this.attrs={id:null},this.pAttrs={id:null},this.setDefaults();for(var b in a)this.attrs[b]=a[b],this.pAttrs[b]=a[b]}return Sdkzer.configure=function(a){if(a.defaultHttpHeaders){Sdkzer.DEFAULT_HTTP_HEADERS=[];for(var b=0;b<a.defaultHttpHeaders.length;b++)Sdkzer.DEFAULT_HTTP_HEADERS.push(new web_services_1.WebServices.HttpHeader(a.defaultHttpHeaders[b]))}Sdkzer.HTTP_PATTERN=a.httpPattern?a.httpPattern:this.HTTP_PATTERN,Sdkzer.PARENTS_FETCH_STRATEGY=a.parentsFetchStrategy?a.parentsFetchStrategy:this.PARENTS_FETCH_STRATEGY,Sdkzer.HTTP_QUERY_GUESS_CONFIG=a.httpQueryGuessConfig?a.httpQueryGuessConfig:this.HTTP_QUERY_GUESS_CONFIG},Sdkzer.usingRestfulCrudHttpPattern=function(){return"restful_crud"===Sdkzer.HTTP_PATTERN},Sdkzer.usingCustomHttpPattern=function(){return"restful_crud"!==Sdkzer.HTTP_PATTERN},Sdkzer.usingParentsFetchStrategy=function(){return"none"!==Sdkzer.PARENTS_FETCH_STRATEGY},Sdkzer.getHttpQueryGuessConfigFor=function(a){return Sdkzer.usingRestfulCrudHttpPattern()?Sdkzer.HTTP_QUERY_GUESS_CONFIG.restful_crud:Sdkzer.HTTP_QUERY_GUESS_CONFIG.custom},Sdkzer.prototype.setDefaults=function(){if(this.defaults()){var a=this.defaults();for(var b in a)this.attrs[b]=a[b]}},Sdkzer.prototype.defaults=function(){return{}},Sdkzer.prototype.attr=function(attrName,value){if(void 0===attrName||void 0===value){if(void 0!==attrName&&void 0===value){for(var attrKeys=attrName.split("."),attrValue=this.attrs[attrName.split(".")[0]],i=1;i<attrKeys.length;i++)attrValue=attrValue[attrKeys[i]];return attrValue}return this.attrs}var attrKeys=attrName.split("."),attrKeyName="";eval("this.attrs['"+attrKeys.join("']['")+"'] = "+("string"==typeof value?"'"+value+"'":value))},Sdkzer.prototype.baseEndpoint=function(){return null},Sdkzer.prototype.resourceEndpoint=function(){return""},Sdkzer.prototype.isNew=function(){return null===this.attrs.id||null===this.lastResponse},Sdkzer.prototype.hasChanged=function(){return this.changedAttrs().length>0},Sdkzer.prototype.hasAttrChanged=function(a){var b,c=this.changedAttrs();for(b=0;b<c.length;b++)if(c[b]===a)return!0;return!1},Sdkzer.prototype.changedAttrs=function(){var a,b,c=[],d=Object.keys(this.attrs),e=Object.keys(this.pAttrs);for(a=0;a<=d.length;a++)for(b=0;b<=e.length;b++)if(null!==d[a]&&d[a]===e[b]&&this.attrs[d[a]]!==this.pAttrs[e[b]]){c.push(d[a]);break}return c},Sdkzer.prototype.prevAttrs=function(){var a={};for(var b in this.attrs)this.pAttrs[b]!==this.attrs[b]&&(a[b]=this.pAttrs[b]?this.pAttrs[b]:null);return a},Sdkzer.prototype.prevValue=function(a){return this.prevAttrs()[a]},Sdkzer.prototype.fetch=function(a,b){void 0===b&&(b=!0);var c,d=this;if(this.attrs.id){this.syncing=!0;var e=new web_services_1.WebServices.HttpQuery({httpMethod:"GET",endpoint:this.baseEndpoint()+"/"+this.attrs.id,headers:Sdkzer.DEFAULT_HTTP_HEADERS?Sdkzer.DEFAULT_HTTP_HEADERS:[],qsParams:{},data:{}});"undefined"!=typeof a&&(e=web_services_1.WebServices.Merger.mergeHttpQueries([e,a]));var f=new web_services_1.WebServices.HttpRequest(e);c=f.promise,c.then(function(a){d.syncing=!1;var b=d.$parse(a.data);d.pAttrs=b,d.attrs=b},function(a){d.syncing=!1})}return"undefined"==typeof c&&(c=es6_promise_1.Promise.reject(!1)),c},Sdkzer.prototype.$parse=function(a,b){return null!==b&&a[b]?a[b]:a},Sdkzer.prototype.toOriginJSON=function(){return this.attrs},Sdkzer.prototype.toOriginXML=function(){return""},Sdkzer.prototype.toOrigin=function(a){switch(a){case"json":this.toOriginJSON();break;case"xml":this.toOriginXML()}return this.attrs},Sdkzer.prototype.update=function(a){void 0===a&&(a=[]);var b,c,d=this;return"restful-crud"===Sdkzer.HTTP_PATTERN,b=new web_services_1.WebServices.HttpQuery({httpMethod:"PUT",endpoint:this.baseEndpoint()+"/"+this.attrs.id,headers:Sdkzer.DEFAULT_HTTP_HEADERS?Sdkzer.DEFAULT_HTTP_HEADERS:[],qsParams:{},data:this.toOriginJSON()}),c=new web_services_1.WebServices.HttpRequest(b),c.promise.then(function(a){d.lastResponse=a})},Sdkzer.prototype.destroy=function(){var a,b;return a=new web_services_1.WebServices.HttpQuery({httpMethod:"DELETE",endpoint:this.baseEndpoint()+"/"+this.attrs.id,headers:Sdkzer.DEFAULT_HTTP_HEADERS?Sdkzer.DEFAULT_HTTP_HEADERS:[],qsParams:{},data:{}}),b=new web_services_1.WebServices.HttpRequest(a),b.promise},Sdkzer.fetchIndex=function(a){var b,c,d,e,f=this,g=[];return d=new es6_promise_1.Promise(function(d,h){b=new web_services_1.WebServices.HttpQuery({httpMethod:"GET",endpoint:(new f).baseEndpoint(),headers:Sdkzer.DEFAULT_HTTP_HEADERS?Sdkzer.DEFAULT_HTTP_HEADERS:[],qsParams:{},data:{}}),"undefined"!=typeof a&&(b=web_services_1.WebServices.Merger.mergeHttpQueries([b,a])),c=new web_services_1.WebServices.HttpRequest(b),c.promise.then(function(a){for(var b in a.data)e=new f,e.attrs=e.pAttrs=e.$parse(a.data[b]),g.push(e);d(g)},function(a){h(a)})})},Sdkzer.fetchOne=function(a,b){var c,d,e,f,g=this,h=new this;return e=new es6_promise_1.Promise(function(e,i){c=new web_services_1.WebServices.HttpQuery({httpMethod:"GET",endpoint:h.baseEndpoint()+"/"+a,headers:Sdkzer.DEFAULT_HTTP_HEADERS?Sdkzer.DEFAULT_HTTP_HEADERS:[],qsParams:{},data:{}}),"undefined"!=typeof b&&(c=web_services_1.WebServices.Merger.mergeHttpQueries([c,b])),d=new web_services_1.WebServices.HttpRequest(c),d.promise.then(function(a){f=new g,f.attrs=f.pAttrs=f.$parse(a.data),e(f)},function(a){i(a)})})},Sdkzer}();Sdkzer.DEFAULT_HTTP_HEADERS=[],Sdkzer.HTTP_PATTERN="restful_crud",Sdkzer.PARENTS_FETCH_STRATEGY="none",Sdkzer.HTTP_QUERY_GUESS_CONFIG={restful_crud:{read_collection:{verb:"GET",endpoint:""},read_record:{verb:"GET",endpoint:""},create_record:{verb:"GET",endpoint:""},update_record:{verb:"GET",endpoint:""},delete_record:{verb:"GET",endpoint:""}}},exports.Sdkzer=Sdkzer,howerest_modularizer_1.Modularizer.defineModule("Sdkzer",Sdkzer)});