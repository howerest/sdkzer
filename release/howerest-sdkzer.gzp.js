var g=function(){function c(){}return c.m=function(b,a){if("undefined"!=typeof angular&&"undefined"!=typeof angular.w)angular.w(b,[]).M([function(){return a}]);else{var e="undefined"!=typeof process&&"undefined"!=typeof process.o&&"undefined"!=typeof global?!0:!1;"undefined"!=typeof window?"function"==typeof define&&define.J||"undefined"!=typeof window&&(window[b]=a):e&&(global[b]=a)}},c}(),h;
!function(c){var b=function(){function a(){}return a.u=function(){return"undefined"!=typeof window},a.v=function(){return"undefined"!=typeof process&&"undefined"!=typeof process.o&&"undefined"!=typeof global?!0:!1},a.j=function(){},a}();c.b=b;b=function(){function a(){}return a.A=function(e){if(null!==e&&"object"==typeof e){var a=e.constructor(),d;for(d in e)e.hasOwnProperty(d)&&(e[d]instanceof Object?a[d]=this.A(e[d]):a[d]=e[d]);e=a}return e},a}();c.F=b;b=function(){function a(){}return a.i=function(a){return this.h(a)},
a.h=function(a){var b=this;return this.reduce(Object.keys(a),function(d,c){var f=b.l(c);return d[f]=b.h(a[c]),d},{})},a.l=function(a){return a.replace(/[_.-](\w|$)/g,function(a,d){return d.toUpperCase()})},a.reduce=function(a,b,d){if(a.reduce)return a.reduce(b,d);for(var c=0;c<a.length;c++)d=b(d,a[c],c);return d},a.map=function(a,b){if(a.map)return a.map(b);for(var d=[],c=0;c<a.length;c++)d.push(b(a[c],c));return d},a}();c.D=b}(h||(h={}));var n;
!function(c){c.G=function(){return function(a,b){this.name=a;this.value=b}}();c.c=function(){return function(a,c,d,q,f){void 0===d&&(d=[]);this.data={};this.response=null;this.endpoint=a;this.s=c;this.g=d;this.data=f;var l=this;if(h.b.u())if("undefined"!=typeof k)this.client=new k;else{if("undefined"==typeof XDomainRequest)return;this.client=new XDomainRequest}else{if(!h.b.v())return;var k=require("xhr2");this.client=new k}this.client.open(this.s,this.endpoint);for(var m in this.g)this.client.setRequestHeader(m,
this.g[m]);this.client.setRequestHeader("Accept","application/json");this.a=new Promise(function(a){this.client.onreadystatechange=function(c){c&&4==c.target.readyState?200==c.target.status&&(l.response=new b(this.endpoint,{},c.target.responseText),a(l.response)):this.a=Promise.reject(!1)}});this.client.send(f?JSON.stringify(f):null)}}();var b=function(){return function(a,c,b){this.data=0<Object.keys(b).length?JSON.parse(b):{}}}();c.I=b;var a=function(){function a(c,b){this.headers=b}return a.prototype.B=
function(a){var c=[],b;for(b in a){var e=a[b];c.push("object"==typeof e?this.B(e):encodeURIComponent(b)+"="+encodeURIComponent(e))}return c.join("&")},a}();c.H=a}(n||(n={}));
var p=function(){function c(b){void 0===b&&(b={});this.f={id:null};this.C();for(var a in b)this.f[a]=b[a]}return c.prototype.C=function(){var b={},a;for(a in b)this.f[a]=b[a]},c.prototype.parse=function(b){return b},c.K=function(b,a){void 0===a&&(a=[]);new this;return(new n.c("","GET",a)).a},c.L=function(b,a){void 0===a&&(a=[]);new this;return(new n.c("/"+b,"GET",a)).a},c.i=[],c.j="restful-crud",c}();g.m("Sdkzer",p);
