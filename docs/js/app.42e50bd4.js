(function(){"use strict";var t={4628:function(t,n,e){var o=e(9242),r=e(3396),i=e(7139);const c=(0,r._)("p",null,"Start をクリック後、ブラウザにカメラの使用を許可してください。",-1),u=(0,r._)("div",{id:"interactive",class:"viewport"},null,-1),a=(0,r._)("i",{class:"bi bi-upc-scan"},null,-1),l=(0,r._)("i",{class:"bi bi-stop-circle-fill"},null,-1);function s(t,n,e,o,s,d){const f=(0,r.up)("b-button");return(0,r.wg)(),(0,r.iD)(r.HY,null,[c,u,(0,r.Wm)(f,{onClick:d.doStart,variant:"primary"},{default:(0,r.w5)((()=>[a,(0,r.Uk)(" Start ")])),_:1},8,["onClick"]),(0,r.Wm)(f,{onClick:d.doStop,variant:"danger"},{default:(0,r.w5)((()=>[l,(0,r.Uk)(" Stop ")])),_:1},8,["onClick"]),(0,r._)("p",null,(0,i.zw)(s.model.log),1)],64)}var d=e(928),f=e.n(d),p={name:"pInputForm",data(){return{model:{log:""}}},setup(){},methods:{console(t){this.model.log=t},doStop(){f().stop()},doStart(){f().init({inputStream:{name:"Live",type:"LiveStream",target:document.querySelector("#interactive.viewport")},function(t){t?console(t):(console("Initialization finished. Ready to start"),f().start())}}),f().onProcessed(this.doProcessed),f().onDetected(this.doDetected)},doProcessed(){},doDetected(){}}},v=e(89);const m=(0,v.Z)(p,[["render",s]]);var b=m;const h={class:"container"};function g(t,n,e,o,i,c){const u=b;return(0,r.wg)(),(0,r.iD)("div",h,[(0,r.Wm)(u)])}var y={name:"App",components:{PInputForm:b}};const _=(0,v.Z)(y,[["render",g]]);var w=_,S=e(4193);(0,o.ri)(w).use(S.ZP).mount("#app")}},n={};function e(o){var r=n[o];if(void 0!==r)return r.exports;var i=n[o]={exports:{}};return t[o].call(i.exports,i,i.exports,e),i.exports}e.m=t,function(){var t=[];e.O=function(n,o,r,i){if(!o){var c=1/0;for(s=0;s<t.length;s++){o=t[s][0],r=t[s][1],i=t[s][2];for(var u=!0,a=0;a<o.length;a++)(!1&i||c>=i)&&Object.keys(e.O).every((function(t){return e.O[t](o[a])}))?o.splice(a--,1):(u=!1,i<c&&(c=i));if(u){t.splice(s--,1);var l=r();void 0!==l&&(n=l)}}return n}i=i||0;for(var s=t.length;s>0&&t[s-1][2]>i;s--)t[s]=t[s-1];t[s]=[o,r,i]}}(),function(){e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,{a:n}),n}}(),function(){e.d=function(t,n){for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})}}(),function(){e.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)}}(),function(){e.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){var t={143:0};e.O.j=function(n){return 0===t[n]};var n=function(n,o){var r,i,c=o[0],u=o[1],a=o[2],l=0;if(c.some((function(n){return 0!==t[n]}))){for(r in u)e.o(u,r)&&(e.m[r]=u[r]);if(a)var s=a(e)}for(n&&n(o);l<c.length;l++)i=c[l],e.o(t,i)&&t[i]&&t[i][0](),t[i]=0;return e.O(s)},o=self["webpackChunkbarcode_detection_api_demo"]=self["webpackChunkbarcode_detection_api_demo"]||[];o.forEach(n.bind(null,0)),o.push=n.bind(null,o.push.bind(o))}();var o=e.O(void 0,[998],(function(){return e(4628)}));o=e.O(o)})();
//# sourceMappingURL=app.42e50bd4.js.map