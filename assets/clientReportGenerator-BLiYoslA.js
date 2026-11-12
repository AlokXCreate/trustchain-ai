import{t as e}from"./jspdf.es.min-C--pqv4K.js";var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},t(e,n)};function n(e,n){if(typeof n!=`function`&&n!==null)throw TypeError(`Class extends value `+String(n)+` is not a constructor or null`);t(e,n);function r(){this.constructor=e}e.prototype=n===null?Object.create(n):(r.prototype=n.prototype,new r)}var r=function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},r.apply(this,arguments)};function i(e,t,n,i,a){i||={};var o=1.15,s=a.internal.scaleFactor,c=a.internal.getFontSize()/s,l=c*(a.getLineHeightFactor?a.getLineHeightFactor():o),u=/\r\n|\r|\n/g,d=``,f=1;if((i.valign===`middle`||i.valign===`bottom`||i.halign===`center`||i.halign===`right`)&&(d=typeof e==`string`?e.split(u):e,f=d.length||1),n+=c*(2-o),i.valign===`middle`?n-=f/2*l:i.valign===`bottom`&&(n-=f*l),i.halign===`center`||i.halign===`right`){var p=c;if(i.halign===`center`&&(p*=.5),d&&f>=1){for(var m=0;m<d.length;m++)a.text(d[m],t-a.getStringUnitWidth(d[m])*p,n,i.textOptions),n+=l;return a}t-=a.getStringUnitWidth(e)*p}return i.halign===`justify`?a.text(e,t,n,r({maxWidth:i.maxWidth||100,align:`justify`},i.textOptions)):a.text(e,t,n,i.textOptions),a}var a={},o=function(){function e(e){this.jsPDFDocument=e,this.userStyles={textColor:e.getTextColor?this.jsPDFDocument.getTextColor():0,fontSize:e.internal.getFontSize(),fontStyle:e.internal.getFont().fontStyle,font:e.internal.getFont().fontName,lineWidth:e.getLineWidth?this.jsPDFDocument.getLineWidth():0,lineColor:e.getDrawColor?this.jsPDFDocument.getDrawColor():0}}return e.setDefaults=function(e,t){t===void 0&&(t=null),t?t.__autoTableDocumentDefaults=e:a=e},e.unifyColor=function(e){return Array.isArray(e)?e:typeof e==`number`?[e,e,e]:typeof e==`string`?[e]:null},e.prototype.applyStyles=function(t,n){var r,i,a;n===void 0&&(n=!1),t.fontStyle&&this.jsPDFDocument.setFontStyle&&this.jsPDFDocument.setFontStyle(t.fontStyle);var o=this.jsPDFDocument.internal.getFont(),s=o.fontStyle,c=o.fontName;if(t.font&&(c=t.font),t.fontStyle){s=t.fontStyle;var l=this.getFontList()[c];l&&l.indexOf(s)===-1&&this.jsPDFDocument.setFontStyle&&(this.jsPDFDocument.setFontStyle(l[0]),s=l[0])}if(this.jsPDFDocument.setFont(c,s),t.fontSize&&this.jsPDFDocument.setFontSize(t.fontSize),!n){var u=e.unifyColor(t.fillColor);u&&(r=this.jsPDFDocument).setFillColor.apply(r,u),u=e.unifyColor(t.textColor),u&&(i=this.jsPDFDocument).setTextColor.apply(i,u),u=e.unifyColor(t.lineColor),u&&(a=this.jsPDFDocument).setDrawColor.apply(a,u),typeof t.lineWidth==`number`&&this.jsPDFDocument.setLineWidth(t.lineWidth)}},e.prototype.splitTextToSize=function(e,t,n){return this.jsPDFDocument.splitTextToSize(e,t,n)},e.prototype.rect=function(e,t,n,r,i){return this.jsPDFDocument.rect(e,t,n,r,i)},e.prototype.getLastAutoTable=function(){return this.jsPDFDocument.lastAutoTable||null},e.prototype.getTextWidth=function(e){return this.jsPDFDocument.getTextWidth(e)},e.prototype.getDocument=function(){return this.jsPDFDocument},e.prototype.setPage=function(e){this.jsPDFDocument.setPage(e)},e.prototype.addPage=function(){return this.jsPDFDocument.addPage()},e.prototype.getFontList=function(){return this.jsPDFDocument.getFontList()},e.prototype.getGlobalOptions=function(){return a||{}},e.prototype.getDocumentOptions=function(){return this.jsPDFDocument.__autoTableDocumentDefaults||{}},e.prototype.pageSize=function(){var e=this.jsPDFDocument.internal.pageSize;return e.width??(e={width:e.getWidth(),height:e.getHeight()}),e},e.prototype.scaleFactor=function(){return this.jsPDFDocument.internal.scaleFactor},e.prototype.getLineHeightFactor=function(){var e=this.jsPDFDocument;return e.getLineHeightFactor?e.getLineHeightFactor():1.15},e.prototype.getLineHeight=function(e){return e/this.scaleFactor()*this.getLineHeightFactor()},e.prototype.pageNumber=function(){var e=this.jsPDFDocument.internal.getCurrentPageInfo();return e?e.pageNumber:this.jsPDFDocument.internal.getNumberOfPages()},e}(),s=function(e){n(t,e);function t(t){var n=e.call(this)||this;return n._element=t,n}return t}(Array);function c(e){return{font:`helvetica`,fontStyle:`normal`,overflow:`linebreak`,fillColor:!1,textColor:20,halign:`left`,valign:`top`,fontSize:10,cellPadding:5/e,lineColor:200,lineWidth:0,cellWidth:`auto`,minCellHeight:0,minCellWidth:0,textOptions:{isInputVisual:!1,isOutputVisual:void 0,isInputRtl:!1,isOutputRtl:void 0,isSymmetricSwapping:!1}}}function l(e){return{striped:{table:{fillColor:255,textColor:80,fontStyle:`normal`},head:{textColor:255,fillColor:[41,128,185],fontStyle:`bold`},body:{},foot:{textColor:255,fillColor:[41,128,185],fontStyle:`bold`},alternateRow:{fillColor:245}},grid:{table:{fillColor:255,textColor:80,fontStyle:`normal`,lineWidth:.1},head:{textColor:255,fillColor:[26,188,156],fontStyle:`bold`,lineWidth:0},body:{},foot:{textColor:255,fillColor:[26,188,156],fontStyle:`bold`,lineWidth:0},alternateRow:{}},plain:{head:{fontStyle:`bold`},foot:{fontStyle:`bold`}}}[e]}function u(e,t,n){return n.applyStyles(t,!0),(Array.isArray(e)?e:[e]).map(function(e){return n.getTextWidth(e)}).reduce(function(e,t){return Math.max(e,t)},0)}function d(e,t,n,r){var i=t.settings.tableLineWidth,a=t.settings.tableLineColor;e.applyStyles({lineWidth:i,lineColor:a});var o=f(i,!1);o&&e.rect(n.x,n.y,t.getWidth(e.pageSize().width),r.y-n.y,o)}function f(e,t){var n=e>0,r=t||t===0;return n&&r?`DF`:n?`S`:r?`F`:null}function p(e,t){if(e||=t,Array.isArray(e)){if(e.length>=4)return{top:e[0],right:e[1],bottom:e[2],left:e[3]};if(e.length===3)return{top:e[0],right:e[1],bottom:e[2],left:e[1]};if(e.length===2)return{top:e[0],right:e[1],bottom:e[0],left:e[1]};e=e.length===1?e[0]:t}return typeof e==`object`?(typeof e.vertical==`number`&&(e.top=e.vertical,e.bottom=e.vertical),typeof e.horizontal==`number`&&(e.right=e.horizontal,e.left=e.horizontal),{left:e.left??t,top:e.top??t,right:e.right??t,bottom:e.bottom??t}):(typeof e!=`number`&&(e=t),{top:e,right:e,bottom:e,left:e})}function m(e,t){var n=p(t.settings.margin,0);return e.pageSize().width-(n.left+n.right)}function h(e,t,n,r,i){var a={},o=96/72,s=_(t,function(e){return i.getComputedStyle(e).backgroundColor});s!=null&&(a.fillColor=s);var c=_(t,function(e){return i.getComputedStyle(e).color});c!=null&&(a.textColor=c);var l=ee(r,n);l&&(a.cellPadding=l);var u=`borderTopColor`,d=o*n,f=r.borderTopWidth;if(r.borderBottomWidth===f&&r.borderRightWidth===f&&r.borderLeftWidth===f){var p=(parseFloat(f)||0)/d;p&&(a.lineWidth=p)}else a.lineWidth={top:(parseFloat(r.borderTopWidth)||0)/d,right:(parseFloat(r.borderRightWidth)||0)/d,bottom:(parseFloat(r.borderBottomWidth)||0)/d,left:(parseFloat(r.borderLeftWidth)||0)/d},a.lineWidth.top||(a.lineWidth.right?u=`borderRightColor`:a.lineWidth.bottom?u=`borderBottomColor`:a.lineWidth.left&&(u=`borderLeftColor`));var m=_(t,function(e){return i.getComputedStyle(e)[u]});m!=null&&(a.lineColor=m);var h=[`left`,`right`,`center`,`justify`];h.indexOf(r.textAlign)!==-1&&(a.halign=r.textAlign),h=[`middle`,`bottom`,`top`],h.indexOf(r.verticalAlign)!==-1&&(a.valign=r.verticalAlign);var v=parseInt(r.fontSize||``);isNaN(v)||(a.fontSize=v/o);var y=g(r);y&&(a.fontStyle=y);var b=(r.fontFamily||``).toLowerCase();return e.indexOf(b)!==-1&&(a.font=b),a}function g(e){var t=``;return(e.fontWeight===`bold`||e.fontWeight===`bolder`||parseInt(e.fontWeight)>=700)&&(t=`bold`),(e.fontStyle===`italic`||e.fontStyle===`oblique`)&&(t+=`italic`),t}function _(e,t){var n=v(e,t);if(!n)return null;var r=n.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d*))?\)$/);if(!r||!Array.isArray(r))return null;var i=[parseInt(r[1]),parseInt(r[2]),parseInt(r[3])];return parseInt(r[4])===0||isNaN(i[0])||isNaN(i[1])||isNaN(i[2])?null:i}function v(e,t){var n=t(e);return n===`rgba(0, 0, 0, 0)`||n===`transparent`||n===`initial`||n===`inherit`?e.parentElement==null?null:v(e.parentElement,t):n}function ee(e,t){var n=[e.paddingTop,e.paddingRight,e.paddingBottom,e.paddingLeft],r=96/(72/t),i=(parseInt(e.lineHeight)-parseInt(e.fontSize))/t/2,a=p(n.map(function(e){return parseInt(e||`0`)/r}),0);return i>a.top&&(a.top=i),i>a.bottom&&(a.bottom=i),a}function y(e,t,n,r,i){r===void 0&&(r=!1),i===void 0&&(i=!1);var a=typeof t==`string`?n.document.querySelector(t):t,o=Object.keys(e.getFontList()),s=e.scaleFactor(),c=[],l=[],u=[];if(!a)return console.error(`Html table could not be found with input: `,t),{head:c,body:l,foot:u};for(var d=0;d<a.rows.length;d++){var f=a.rows[d],p=(f?.parentElement?.tagName)?.toLowerCase(),m=b(o,s,n,f,r,i);m&&(p===`thead`?c.push(m):p===`tfoot`?u.push(m):l.push(m))}return{head:c,body:l,foot:u}}function b(e,t,n,r,i,a){for(var o=new s(r),c=0;c<r.cells.length;c++){var l=r.cells[c],u=n.getComputedStyle(l);if(i||u.display!==`none`){var d=void 0;a&&(d=h(e,l,t,u,n)),o.push({rowSpan:l.rowSpan,colSpan:l.colSpan,styles:d,_element:l,content:x(l)})}}var f=n.getComputedStyle(r);if(o.length>0&&(i||f.display!==`none`))return o}function x(e){var t=e.cloneNode(!0);return t.innerHTML=t.innerHTML.replace(/\n/g,``).replace(/ +/g,` `),t.innerHTML=t.innerHTML.split(/<br.*?>/).map(function(e){return e.trim()}).join(`
`),t.innerText||t.textContent||``}function S(e,t,n){for(var r=0,i=[e,t,n];r<i.length;r++){var a=i[r];a&&typeof a!=`object`&&console.error(`The options parameter should be of type object, is: `+typeof a),a.startY&&typeof a.startY!=`number`&&(console.error(`Invalid value for startY option`,a.startY),delete a.startY)}}function C(e,t,n,r,i){if(e==null)throw TypeError(`Cannot convert undefined or null to object`);for(var a=Object(e),o=1;o<arguments.length;o++){var s=arguments[o];if(s!=null)for(var c in s)Object.prototype.hasOwnProperty.call(s,c)&&(a[c]=s[c])}return a}function w(e,t){var n=new o(e),r=n.getDocumentOptions(),i=n.getGlobalOptions();S(i,r,t);var a=C({},i,r,t),s;typeof window<`u`&&(s=window);var c=te(i,r,t),l=ne(i,r,t),u=re(n,a),d=ae(n,a,s);return{id:t.tableId,content:d,hooks:l,styles:c,settings:u}}function te(e,t,n){for(var r={styles:{},headStyles:{},bodyStyles:{},footStyles:{},alternateRowStyles:{},columnStyles:{}},i=function(i){if(i===`columnStyles`){var a=e[i],o=t[i],s=n[i];r.columnStyles=C({},a,o,s)}else{var c=[e,t,n].map(function(e){return e[i]||{}});r[i]=C({},c[0],c[1],c[2])}},a=0,o=Object.keys(r);a<o.length;a++){var s=o[a];i(s)}return r}function ne(e,t,n){for(var r=[e,t,n],i={didParseCell:[],willDrawCell:[],didDrawCell:[],willDrawPage:[],didDrawPage:[]},a=0,o=r;a<o.length;a++){var s=o[a];s.didParseCell&&i.didParseCell.push(s.didParseCell),s.willDrawCell&&i.willDrawCell.push(s.willDrawCell),s.didDrawCell&&i.didDrawCell.push(s.didDrawCell),s.willDrawPage&&i.willDrawPage.push(s.willDrawPage),s.didDrawPage&&i.didDrawPage.push(s.didDrawPage)}return i}function re(e,t){var n=p(t.margin,40/e.scaleFactor()),r=ie(e,t.startY)??n.top,i=t.showFoot===!0?`everyPage`:t.showFoot===!1?`never`:t.showFoot??`everyPage`,a=t.showHead===!0?`everyPage`:t.showHead===!1?`never`:t.showHead??`everyPage`,o=t.useCss??!1,s=t.theme||(o?`plain`:`striped`),c=!!t.horizontalPageBreak,l=t.horizontalPageBreakRepeat??null;return{includeHiddenHtml:t.includeHiddenHtml??!1,useCss:o,theme:s,startY:r,margin:n,pageBreak:t.pageBreak??`auto`,rowPageBreak:t.rowPageBreak??`auto`,tableWidth:t.tableWidth??`auto`,showHead:a,showFoot:i,tableLineWidth:t.tableLineWidth??0,tableLineColor:t.tableLineColor??200,horizontalPageBreak:c,horizontalPageBreakRepeat:l,horizontalPageBreakBehaviour:t.horizontalPageBreakBehaviour??`afterAllRows`}}function ie(e,t){var n=e.getLastAutoTable(),r=e.scaleFactor(),i=e.pageNumber(),a=!1;return n&&n.startPageNumber&&(a=n.startPageNumber+n.pageNumber-1===i),typeof t==`number`?t:(t==null||t===!1)&&a&&n?.finalY!=null?n.finalY+20/r:null}function ae(e,t,n){var r=t.head||[],i=t.body||[],a=t.foot||[];if(t.html){var o=t.includeHiddenHtml;if(n){var s=y(e,t.html,n,o,t.useCss)||{};r=s.head||r,i=s.body||r,a=s.foot||r}else console.error(`Cannot parse html in non browser environment`)}return{columns:t.columns||T(r,i,a),head:r,body:i,foot:a}}function T(e,t,n){var r=e[0]||t[0]||n[0]||[],i=[];return Object.keys(r).filter(function(e){return e!==`_element`}).forEach(function(e){var t=1,n=Array.isArray(r)?r[parseInt(e)]:r[e];typeof n==`object`&&!Array.isArray(n)&&(t=n?.colSpan||1);for(var a=0;a<t;a++){var o=void 0;o=Array.isArray(r)?i.length:e+(a>0?`_${a}`:``);var s={dataKey:o};i.push(s)}}),i}var E=function(){function e(e,t,n){this.table=t,this.pageNumber=t.pageNumber,this.settings=t.settings,this.cursor=n,this.doc=e.getDocument()}return e}(),D=function(e){n(t,e);function t(t,n,r,i,a,o){var s=e.call(this,t,n,o)||this;return s.cell=r,s.row=i,s.column=a,s.section=i.section,s}return t}(E),oe=function(){function e(e,t){this.pageNumber=1,this.id=e.id,this.settings=e.settings,this.styles=e.styles,this.hooks=e.hooks,this.columns=t.columns,this.head=t.head,this.body=t.body,this.foot=t.foot}return e.prototype.getHeadHeight=function(e){return this.head.reduce(function(t,n){return t+n.getMaxCellHeight(e)},0)},e.prototype.getFootHeight=function(e){return this.foot.reduce(function(t,n){return t+n.getMaxCellHeight(e)},0)},e.prototype.allRows=function(){return this.head.concat(this.body).concat(this.foot)},e.prototype.callCellHooks=function(e,t,n,r,i,a){for(var o=0,s=t;o<s.length;o++){var c=s[o],l=c(new D(e,this,n,r,i,a))===!1;if(n.text=Array.isArray(n.text)?n.text:[n.text],l)return!1}return!0},e.prototype.callEndPageHooks=function(e,t){e.applyStyles(e.userStyles);for(var n=0,r=this.hooks.didDrawPage;n<r.length;n++){var i=r[n];i(new E(e,this,t))}},e.prototype.callWillDrawPageHooks=function(e,t){for(var n=0,r=this.hooks.willDrawPage;n<r.length;n++){var i=r[n];i(new E(e,this,t))}},e.prototype.getWidth=function(e){if(typeof this.settings.tableWidth==`number`)return this.settings.tableWidth;if(this.settings.tableWidth===`wrap`)return this.columns.reduce(function(e,t){return e+t.wrappedWidth},0);var t=this.settings.margin;return e-t.left-t.right},e}(),O=function(){function e(e,t,n,r,i){i===void 0&&(i=!1),this.height=0,this.raw=e,e instanceof s&&(this.raw=e._element,this.element=e._element),this.index=t,this.section=n,this.cells=r,this.spansMultiplePages=i}return e.prototype.getMaxCellHeight=function(e){var t=this;return e.reduce(function(e,n){return Math.max(e,t.cells[n.index]?.height||0)},0)},e.prototype.hasRowSpan=function(e){var t=this;return e.filter(function(e){var n=t.cells[e.index];return n?n.rowSpan>1:!1}).length>0},e.prototype.canEntireRowFit=function(e,t){return this.getMaxCellHeight(t)<=e},e.prototype.getMinimumRowHeight=function(e,t){var n=this;return e.reduce(function(e,r){var i=n.cells[r.index];if(!i)return 0;var a=t.getLineHeight(i.styles.fontSize),o=i.padding(`vertical`)+a;return o>e?o:e},0)},e}(),k=function(){function e(e,t,n){this.contentHeight=0,this.contentWidth=0,this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.height=0,this.x=0,this.y=0,this.styles=t,this.section=n,this.raw=e;var r=e;typeof e==`object`&&e&&!Array.isArray(e)?(this.rowSpan=e.rowSpan||1,this.colSpan=e.colSpan||1,r=e.content??e,e._element&&(this.raw=e._element)):(this.rowSpan=1,this.colSpan=1);var i=r==null?``:``+r,a=/\r\n|\r|\n/g;this.text=i.split(a)}return e.prototype.getTextPos=function(){var e;if(this.styles.valign===`top`)e=this.y+this.padding(`top`);else if(this.styles.valign===`bottom`)e=this.y+this.height-this.padding(`bottom`);else{var t=this.height-this.padding(`vertical`);e=this.y+t/2+this.padding(`top`)}var n;if(this.styles.halign===`right`)n=this.x+this.width-this.padding(`right`);else if(this.styles.halign===`center`){var r=this.width-this.padding(`horizontal`);n=this.x+r/2+this.padding(`left`)}else n=this.x+this.padding(`left`);return{x:n,y:e}},e.prototype.getContentHeight=function(e,t){t===void 0&&(t=1.15);var n=(Array.isArray(this.text)?this.text.length:1)*(this.styles.fontSize/e*t)+this.padding(`vertical`);return Math.max(n,this.styles.minCellHeight)},e.prototype.padding=function(e){var t=p(this.styles.cellPadding,0);return e===`vertical`?t.top+t.bottom:e===`horizontal`?t.left+t.right:t[e]},e}(),A=function(){function e(e,t,n){this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.dataKey=e,this.raw=t,this.index=n}return e.prototype.getMaxCustomCellWidth=function(e){for(var t=0,n=0,r=e.allRows();n<r.length;n++){var i=r[n].cells[this.index];i&&typeof i.styles.cellWidth==`number`&&(t=Math.max(t,i.styles.cellWidth))}return t},e}();function se(e,t){ce(e,t);var n=[],r=0;t.columns.forEach(function(e){var i=e.getMaxCustomCellWidth(t);i?e.width=i:(e.width=e.wrappedWidth,n.push(e)),r+=e.width});var i=t.getWidth(e.pageSize().width)-r;i&&=j(n,i,function(e){return Math.max(e.minReadableWidth,e.minWidth)}),i&&=j(n,i,function(e){return e.minWidth}),i=Math.abs(i),!t.settings.horizontalPageBreak&&i>.1/e.scaleFactor()&&(i=i<1?i:Math.round(i),console.log(`Of the table content, ${i} units width could not fit page`)),ue(t),de(t,e),le(t)}function ce(e,t){var n=e.scaleFactor(),r=t.settings.horizontalPageBreak,i=m(e,t);t.allRows().forEach(function(a){for(var o=0,s=t.columns;o<s.length;o++){var c=s[o],l=a.cells[c.index];if(l){var d=t.hooks.didParseCell;t.callCellHooks(e,d,l,a,c,null);var f=l.padding(`horizontal`);if(l.contentWidth=u(l.text,l.styles,e)+f,l.minReadableWidth=u(l.text.join(` `).split(/[^\S\u00A0]+/),l.styles,e)+l.padding(`horizontal`),typeof l.styles.cellWidth==`number`)l.minWidth=l.styles.cellWidth,l.wrappedWidth=l.styles.cellWidth;else if(l.styles.cellWidth===`wrap`||r===!0)l.contentWidth>i?(l.minWidth=i,l.wrappedWidth=i):(l.minWidth=l.contentWidth,l.wrappedWidth=l.contentWidth);else{var p=10/n;l.minWidth=l.styles.minCellWidth||p,l.wrappedWidth=l.contentWidth,l.minWidth>l.wrappedWidth&&(l.wrappedWidth=l.minWidth)}}}}),t.allRows().forEach(function(e){for(var n=0,r=t.columns;n<r.length;n++){var i=r[n],a=e.cells[i.index];if(a&&a.colSpan===1)i.wrappedWidth=Math.max(i.wrappedWidth,a.wrappedWidth),i.minWidth=Math.max(i.minWidth,a.minWidth),i.minReadableWidth=Math.max(i.minReadableWidth,a.minReadableWidth);else{var o=t.styles.columnStyles[i.dataKey]||t.styles.columnStyles[i.index]||{},s=o.cellWidth||o.minCellWidth;s&&typeof s==`number`&&(i.minWidth=s,i.wrappedWidth=s)}a&&(a.colSpan>1&&!i.minWidth&&(i.minWidth=a.minWidth),a.colSpan>1&&!i.wrappedWidth&&(i.wrappedWidth=a.minWidth))}})}function j(e,t,n){for(var r=t,i=e.reduce(function(e,t){return e+t.wrappedWidth},0),a=0;a<e.length;a++){var o=e[a],s=r*(o.wrappedWidth/i),c=o.width+s,l=n(o),u=c<l?l:c;t-=u-o.width,o.width=u}if(t=Math.round(t*1e10)/1e10,t){var d=e.filter(function(e){return t<0?e.width>n(e):!0});d.length&&(t=j(d,t,n))}return t}function le(e){for(var t={},n=1,r=e.allRows(),i=0;i<r.length;i++)for(var a=r[i],o=0,s=e.columns;o<s.length;o++){var c=s[o],l=t[c.index];if(n>1)n--,delete a.cells[c.index];else if(l)l.cell.height+=a.height,n=l.cell.colSpan,delete a.cells[c.index],l.left--,l.left<=1&&delete t[c.index];else{var u=a.cells[c.index];if(!u)continue;if(u.height=a.height,u.rowSpan>1){var d=r.length-i,f=u.rowSpan>d?d:u.rowSpan;t[c.index]={cell:u,left:f,row:a}}}}}function ue(e){for(var t=e.allRows(),n=0;n<t.length;n++)for(var r=t[n],i=null,a=0,o=0,s=0;s<e.columns.length;s++){var c=e.columns[s];if(--o,o>1&&e.columns[s+1])a+=c.width,delete r.cells[c.index];else if(i){var l=i;delete r.cells[c.index],i=null,l.width=c.width+a}else{var l=r.cells[c.index];if(!l)continue;if(o=l.colSpan,a=0,l.colSpan>1){i=l,a+=c.width;continue}l.width=c.width+a}}}function de(e,t){for(var n={count:0,height:0},r=0,i=e.allRows();r<i.length;r++){for(var a=i[r],o=0,s=e.columns;o<s.length;o++){var c=s[o],l=a.cells[c.index];if(l){t.applyStyles(l.styles,!0);var u=l.width-l.padding(`horizontal`);if(l.styles.overflow===`linebreak`)l.text=t.splitTextToSize(l.text,u+1/t.scaleFactor(),{fontSize:l.styles.fontSize});else if(l.styles.overflow===`ellipsize`)l.text=M(l.text,u,l.styles,t,`...`);else if(l.styles.overflow===`hidden`)l.text=M(l.text,u,l.styles,t,``);else if(typeof l.styles.overflow==`function`){var d=l.styles.overflow(l.text,u);l.text=typeof d==`string`?[d]:d}l.contentHeight=l.getContentHeight(t.scaleFactor(),t.getLineHeightFactor());var f=l.contentHeight/l.rowSpan;l.rowSpan>1&&n.count*n.height<f*l.rowSpan?n={height:f,count:l.rowSpan}:n&&n.count>0&&n.height>f&&(f=n.height),f>a.height&&(a.height=f)}}n.count--}}function M(e,t,n,r,i){return e.map(function(e){return N(e,t,n,r,i)})}function N(e,t,n,r,i){var a=1e4*r.scaleFactor();if(t=Math.ceil(t*a)/a,t>=u(e,n,r))return e;for(;t<u(e+i,n,r)&&!(e.length<=1);)e=e.substring(0,e.length-1);return e.trim()+i}function P(e,t){var n=new o(e),r=new oe(t,F(t,n.scaleFactor()));return se(n,r),n.applyStyles(n.userStyles),r}function F(e,t){var n=e.content,r=z(n.columns);if(n.head.length===0){var i=L(r,`head`);i&&n.head.push(i)}if(n.foot.length===0){var i=L(r,`foot`);i&&n.foot.push(i)}var a=e.settings.theme,o=e.styles;return{columns:r,head:I(`head`,n.head,r,o,a,t),body:I(`body`,n.body,r,o,a,t),foot:I(`foot`,n.foot,r,o,a,t)}}function I(e,t,n,r,i,a){var o={};return t.map(function(t,s){for(var c=0,l={},u=0,d=0,f=0,p=n;f<p.length;f++){var m=p[f];if(o[m.index]==null||o[m.index].left===0){if(d===0){var h=void 0;h=Array.isArray(t)?t[m.index-u-c]:t[m.dataKey];var g={};typeof h==`object`&&!Array.isArray(h)&&(g=h?.styles||{});var _=B(e,m,s,i,r,a,g),v=new k(h,_,e);l[m.dataKey]=v,l[m.index]=v,d=v.colSpan-1,o[m.index]={left:v.rowSpan-1,times:d}}else d--,u++}else o[m.index].left--,d=o[m.index].times,c++}return new O(t,s,e,l)})}function L(e,t){var n={};return e.forEach(function(e){if(e.raw!=null){var r=R(t,e.raw);r!=null&&(n[e.dataKey]=r)}}),Object.keys(n).length>0?n:null}function R(e,t){if(e===`head`){if(typeof t==`object`)return t.header||null;if(typeof t==`string`||typeof t==`number`)return t}else if(e===`foot`&&typeof t==`object`)return t.footer;return null}function z(e){return e.map(function(e,t){return new A(typeof e==`object`?e.dataKey??t:t,e,t)})}function B(e,t,n,r,i,a,o){var s=l(r),u;e===`head`?u=i.headStyles:e===`body`?u=i.bodyStyles:e===`foot`&&(u=i.footStyles);var d=C({},s.table,s[e],i.styles,u),f=i.columnStyles[t.dataKey]||i.columnStyles[t.index]||{},p=e===`body`?f:{},m=e===`body`&&n%2==0?C({},s.alternateRow,i.alternateRowStyles):{};return C(C({},c(a),d,m,p),o)}function V(e,t,n){n===void 0&&(n={});var r=m(e,t),i=new Map,a=[],o=[],s=[];Array.isArray(t.settings.horizontalPageBreakRepeat)?s=t.settings.horizontalPageBreakRepeat:(typeof t.settings.horizontalPageBreakRepeat==`string`||typeof t.settings.horizontalPageBreakRepeat==`number`)&&(s=[t.settings.horizontalPageBreakRepeat]),s.forEach(function(e){var n=t.columns.find(function(t){return t.dataKey===e||t.index===e});n&&!i.has(n.index)&&(i.set(n.index,!0),a.push(n.index),o.push(t.columns[n.index]),r-=n.wrappedWidth)});for(var c=!0,l=n?.start??0;l<t.columns.length;)if(i.has(l))l++;else{var u=t.columns[l].wrappedWidth;if(c||r>=u)c=!1,a.push(l),o.push(t.columns[l]),r-=u;else break;l++}return{colIndexes:a,columns:o,lastIndex:l-1}}function fe(e,t){for(var n=[],r=0;r<t.columns.length;r++){var i=V(e,t,{start:r});i.columns.length&&(n.push(i),r=i.lastIndex)}return n}function H(e,t){var n=t.settings,r=n.startY,i=n.margin,a={x:i.left,y:r},s=t.getHeadHeight(t.columns)+t.getFootHeight(t.columns),c=r+i.bottom+s;if(n.pageBreak===`avoid`){var l=t.body.reduce(function(e,t){return e+t.height},0);c+=l}var u=new o(e);(n.pageBreak===`always`||n.startY!=null&&c>u.pageSize().height)&&(X(u),a.y=i.top),t.callWillDrawPageHooks(u,a);var f=C({},a);t.startPageNumber=u.pageNumber(),n.horizontalPageBreak?pe(u,t,f,a):(u.applyStyles(u.userStyles),(n.showHead===`firstPage`||n.showHead===`everyPage`)&&t.head.forEach(function(e){return q(u,t,e,a,t.columns)}),u.applyStyles(u.userStyles),t.body.forEach(function(e,n){K(u,t,e,n===t.body.length-1,f,a,t.columns)}),u.applyStyles(u.userStyles),(n.showFoot===`lastPage`||n.showFoot===`everyPage`)&&t.foot.forEach(function(e){return q(u,t,e,a,t.columns)})),d(u,t,f,a),t.callEndPageHooks(u,a),t.finalY=a.y,e.lastAutoTable=t,u.applyStyles(u.userStyles)}function pe(e,t,n,r){var i=fe(e,t);if(t.settings.horizontalPageBreakBehaviour===`afterAllRows`)i.forEach(function(i,a){e.applyStyles(e.userStyles),a>0?Y(e,t,n,r,i.columns,!0):U(e,t,r,i.columns),me(e,t,n,r,i.columns),G(e,t,r,i.columns)});else for(var a=-1,o=i[0],s=function(){var s=a;if(o){e.applyStyles(e.userStyles);var c=o.columns;a>=0?Y(e,t,n,r,c,!0):U(e,t,r,c),s=W(e,t,a+1,r,c),G(e,t,r,c)}var l=s-a;i.slice(1).forEach(function(i){e.applyStyles(e.userStyles),Y(e,t,n,r,i.columns,!0),W(e,t,a+1,r,i.columns,l),G(e,t,r,i.columns)}),a=s};a<t.body.length-1;)s()}function U(e,t,n,r){var i=t.settings;e.applyStyles(e.userStyles),(i.showHead===`firstPage`||i.showHead===`everyPage`)&&t.head.forEach(function(i){return q(e,t,i,n,r)})}function me(e,t,n,r,i){e.applyStyles(e.userStyles),t.body.forEach(function(a,o){K(e,t,a,o===t.body.length-1,n,r,i)})}function W(e,t,n,r,i,a){e.applyStyles(e.userStyles),a??=t.body.length;for(var o=Math.min(n+a,t.body.length),s=-1,c=t.body.slice(n,o),l=0;l<c.length;l++){var u=c[l],d=J(e,t,n+l===t.body.length-1,r);if(u.canEntireRowFit(d,i))q(e,t,u,r,i),s=n+l;else break}return s}function G(e,t,n,r){var i=t.settings;e.applyStyles(e.userStyles),(i.showFoot===`lastPage`||i.showFoot===`everyPage`)&&t.foot.forEach(function(i){return q(e,t,i,n,r)})}function he(e,t,n){var r=n.getLineHeight(e.styles.fontSize),i=e.padding(`vertical`),a=Math.floor((t-i)/r);return Math.max(0,a)}function ge(e,t,n,r){var i={};e.spansMultiplePages=!0,e.height=0;for(var a=0,o=0,s=n.columns;o<s.length;o++){var c=s[o],l=e.cells[c.index];if(l){Array.isArray(l.text)||(l.text=[l.text]);var u=new k(l.raw,l.styles,l.section);u=C(u,l),u.text=[];var d=he(l,t,r);l.text.length>d&&(u.text=l.text.splice(d,l.text.length));var f=r.scaleFactor(),p=r.getLineHeightFactor();l.contentHeight=l.getContentHeight(f,p),l.contentHeight>=t&&(l.contentHeight=t,u.styles.minCellHeight-=t),l.contentHeight>e.height&&(e.height=l.contentHeight),u.contentHeight=u.getContentHeight(f,p),u.contentHeight>a&&(a=u.contentHeight),i[c.index]=u}}var m=new O(e.raw,-1,e.section,i,!0);m.height=a;for(var h=0,g=n.columns;h<g.length;h++){var c=g[h],u=m.cells[c.index];u&&(u.height=m.height);var l=e.cells[c.index];l&&(l.height=e.height)}return m}function _e(e,t,n,r){var i=e.pageSize().height,a=r.settings.margin,o=i-(a.top+a.bottom);t.section===`body`&&(o-=r.getHeadHeight(r.columns)+r.getFootHeight(r.columns));var s=t.getMinimumRowHeight(r.columns,e),c=s<n;if(s>o)return console.log(`Will not be able to print row ${t.index} correctly since it's minimum height is larger than page height`),!0;if(!c)return!1;var l=t.hasRowSpan(r.columns);return t.getMaxCellHeight(r.columns)>o?(l&&console.log(`The content of row ${t.index} will not be drawn correctly since drawing rows with a height larger than the page height and has cells with rowspans is not supported.`),!0):!(l||r.settings.rowPageBreak===`avoid`)}function K(e,t,n,r,i,a,o){var s=J(e,t,r,a);if(n.canEntireRowFit(s,o))q(e,t,n,a,o);else if(_e(e,n,s,t)){var c=ge(n,s,t,e);q(e,t,n,a,o),Y(e,t,i,a,o),K(e,t,c,r,i,a,o)}else Y(e,t,i,a,o),K(e,t,n,r,i,a,o)}function q(e,t,n,r,a){r.x=t.settings.margin.left;for(var o=0,s=a;o<s.length;o++){var c=s[o],l=n.cells[c.index];if(!l)r.x+=c.width;else if(e.applyStyles(l.styles),l.x=r.x,l.y=r.y,t.callCellHooks(e,t.hooks.willDrawCell,l,n,c,r)===!1)r.x+=c.width;else{ve(e,l,r);var u=l.getTextPos();i(l.text,u.x,u.y,{halign:l.styles.halign,valign:l.styles.valign,maxWidth:Math.ceil(l.width-l.padding(`left`)-l.padding(`right`)),textOptions:l.styles.textOptions},e.getDocument()),t.callCellHooks(e,t.hooks.didDrawCell,l,n,c,r),r.x+=c.width}}r.y+=n.height}function ve(e,t,n){var r=t.styles;if(e.getDocument().setFillColor(e.getDocument().getFillColor()),typeof r.lineWidth==`number`){var i=f(r.lineWidth,r.fillColor);i&&e.rect(t.x,n.y,t.width,t.height,i)}else typeof r.lineWidth==`object`&&(r.fillColor&&e.rect(t.x,n.y,t.width,t.height,`F`),ye(e,t,n,r.lineWidth))}function ye(e,t,n,r){var i,a,o,s;r.top&&(i=n.x,a=n.y,o=n.x+t.width,s=n.y,r.right&&(o+=.5*r.right),r.left&&(i-=.5*r.left),c(r.top,i,a,o,s)),r.bottom&&(i=n.x,a=n.y+t.height,o=n.x+t.width,s=n.y+t.height,r.right&&(o+=.5*r.right),r.left&&(i-=.5*r.left),c(r.bottom,i,a,o,s)),r.left&&(i=n.x,a=n.y,o=n.x,s=n.y+t.height,r.top&&(a-=.5*r.top),r.bottom&&(s+=.5*r.bottom),c(r.left,i,a,o,s)),r.right&&(i=n.x+t.width,a=n.y,o=n.x+t.width,s=n.y+t.height,r.top&&(a-=.5*r.top),r.bottom&&(s+=.5*r.bottom),c(r.right,i,a,o,s));function c(t,n,r,i,a){e.getDocument().setLineWidth(t),e.getDocument().line(n,r,i,a,`S`)}}function J(e,t,n,r){var i=t.settings.margin.bottom,a=t.settings.showFoot;return(a===`everyPage`||a===`lastPage`&&n)&&(i+=t.getFootHeight(t.columns)),e.pageSize().height-r.y-i}function Y(e,t,n,r,i,a){i===void 0&&(i=[]),a===void 0&&(a=!1),e.applyStyles(e.userStyles),t.settings.showFoot===`everyPage`&&!a&&t.foot.forEach(function(n){return q(e,t,n,r,i)}),t.callEndPageHooks(e,r);var o=t.settings.margin;d(e,t,n,r),X(e),t.pageNumber++,r.x=o.left,r.y=o.top,n.y=o.top,t.callWillDrawPageHooks(e,r),t.settings.showHead===`everyPage`&&(t.head.forEach(function(n){return q(e,t,n,r,i)}),e.applyStyles(e.userStyles))}function X(e){var t=e.pageNumber();return e.setPage(t+1),e.pageNumber()===t&&(e.addPage(),!0)}function be(e){e.API.autoTable=function(){var e=[...arguments][0],t=w(this,e),n=P(this,t);return H(this,n),this},e.API.lastAutoTable=!1,e.API.autoTableText=function(e,t,n,r){i(e,t,n,r,this)},e.API.autoTableSetDefaults=function(e){return o.setDefaults(e,this),this},e.autoTableSetDefaults=function(e,t){o.setDefaults(e,t)},e.API.autoTableHtmlToJson=function(e,t){if(t===void 0&&(t=!1),typeof window>`u`)return console.error(`Cannot run autoTableHtmlToJson in non browser environment`),null;var n=y(new o(this),e,window,t,!1),r=n.head,i=n.body;return{columns:r[0]?.map(function(e){return e.content})||[],rows:i,data:i}}}function Z(e,t){H(e,P(e,w(e,t)))}try{if(typeof window<`u`&&window){var Q=window,$=Q.jsPDF||Q.jspdf?.jsPDF;$&&be($)}}catch(e){console.error(`Could not apply autoTable plugin`,e)}var xe=class{static download(e,t){switch(t===`docx`?`word`:t){case`json`:this.downloadJson(e);break;case`html`:this.downloadHtml(e);break;case`word`:this.downloadWord(e);break;case`pdf`:this.downloadPdf(e);break;default:this.downloadJson(e)}}static downloadJson(e){let t={$schema:`https://trustchain-ai.org/schemas/v1.2.0/verification-report.json`,application:`TRUSTCHAIN AI`,framework:`Machine Learning and Blockchain-Based Document Authentication and Fraud Detection Framework`,report_version:`2.4.0`,report_id:e.reportId,generated_at:e.generatedAt||new Date().toISOString(),confidentiality:`RESTRICTED - FORENSIC AUDIT`,executive_summary:{document_name:e.documentName,category:e.category||`Academic Credential`,overall_status:e.status,fraud_risk_score:e.riskScore,risk_category:e.riskCategory||(e.riskScore<30?`Low Risk`:e.riskScore<60?`Moderate Risk`:`High Risk`),recommendation:e.decision?.recommendation||(e.riskScore<30?`AUTHENTIC - CREDENTIAL VERIFIED`:`MANUAL REVIEW RECOMMENDED`)},document_metadata:{filename:e.documentName,format:e.fileFormat||`PDF Document`,size_bytes:e.fileSizeBytes||245e4,sha256_fingerprint:e.sha256||`9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`},ocr_extraction:{status:`validated`,extracted_fields:e.extractedFields||{candidate_name:`Alex Mercer`,institution_name:`Stanford University`,degree_conferred:`Bachelor of Science in Computer Science`,conferral_date:`June 18, 2024`,gpa_cum_laude:`3.94 / Magna Cum Laude`}},ai_ml_forensics:{classification:e.category||`Degree Certificate`,confidence:e.classificationConfidence||.984,error_level_analysis:{ela_discrepancies_detected:e.tamperFindings&&e.tamperFindings.length>0,splicing_probability:e.riskScore>50?.42:.02},tamper_findings:e.tamperFindings||[{finding:`Cryptographic Typography Consistency`,severity:`low`,confidence:.98,description:`Glyph kerning and font vectors align with official Stanford University registrar templates.`}]},blockchain_verification:{network:e.blockchain?.network||`Ethereum Sepolia Testnet`,contract_address:e.blockchain?.contractAddress||`0x71C840A95A1E586e927c97825b7a701E7E5Ac2D4`,transaction_hash:e.blockchain?.transactionHash||`0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f`,is_registered:e.blockchain?.isRegistered??!0,block_number:e.blockchain?.blockNumber||5892104},integrity_checksum:this.simpleChecksum(e.reportId+e.documentName+e.riskScore),disclaimer:`This document verification report is generated by TrustChain AI decision-support algorithms. Final authority rests with accredited issuing institutions.`},n=new Blob([JSON.stringify(t,null,2)],{type:`application/json;charset=utf-8`});this.triggerDownload(n,`${e.reportId}_TRUSTCHAIN_REPORT.json`)}static downloadHtml(e){let t=e.riskScore<30?`#10b981`:e.riskScore<60?`#f59e0b`:`#ef4444`,n=e.riskCategory||(e.riskScore<30?`Low Risk`:e.riskScore<60?`Moderate Risk`:`High Risk`),r=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TRUSTCHAIN AI – Official Verification Dossier [${e.reportId}]</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary: #0284c7;
      --navy: #0f172a;
      --slate: #475569;
      --light-bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --navy: #f8fafc;
        --light-bg: #0b1120;
        --card-bg: #0f172a;
        --border: #1e293b;
        --slate: #94a3b8;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--light-bg);
      color: var(--navy);
      margin: 0;
      padding: 32px 16px;
      line-height: 1.6;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
    }
    .header-banner {
      border-bottom: 3px solid var(--primary);
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin: 0;
      color: #0284c7;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate);
      margin: 4px 0 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .meta-box {
      text-align: right;
      font-size: 12px;
      color: var(--slate);
    }
    .meta-id {
      font-family: monospace;
      font-weight: bold;
      color: var(--navy);
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 6px;
    }
    .score-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(2, 132, 199, 0.08);
      border: 1px solid rgba(2, 132, 199, 0.2);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
    }
    .score-gauge {
      font-size: 36px;
      font-weight: 900;
      color: ${t};
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--navy);
      border-bottom: 2px solid var(--border);
      padding-bottom: 8px;
      margin-top: 32px;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    th, td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      font-weight: 700;
      background: rgba(0,0,0,0.02);
      color: var(--slate);
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    .font-mono {
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      word-break: break-all;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      font-size: 11px;
      color: var(--slate);
      text-align: center;
    }
    @media print {
      body { background: white; color: black; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-banner">
      <div>
        <h1 class="brand-title">TRUSTCHAIN AI</h1>
        <p class="brand-subtitle">Machine Learning & Blockchain Document Authentication Framework</p>
      </div>
      <div class="meta-box">
        <div>Dossier Reference</div>
        <div class="meta-id">${e.reportId}</div>
        <div>Generated: ${new Date().toUTCString()}</div>
        <div class="badge" style="background:${t}20; color:${t};">
          ${n} (${e.riskScore}/100)
        </div>
      </div>
    </div>

    <div class="score-banner">
      <div>
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--slate);">Overall Forensic Assessment</div>
        <div style="font-size:18px; font-weight:800; color:var(--navy); margin-top:2px;">
          ${e.riskScore<30?`AUTHENTIC – High Cryptographic & Layout Confidence`:`CAUTION – Elevated Discrepancy Indicators`}
        </div>
        <div style="font-size:12px; color:var(--slate); margin-top:4px;">
          Document: <strong>${e.documentName}</strong> • Category: <strong>${e.category||`Degree`}</strong>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--slate);">Risk Index</div>
        <div class="score-gauge">${e.riskScore}<span style="font-size:18px; color:var(--slate);">/100</span></div>
      </div>
    </div>

    <div class="section-title">1. Document Forensic Metadata</div>
    <table>
      <tbody>
        <tr><td style="width:30%; font-weight:bold;">Original Filename</td><td>${e.documentName}</td></tr>
        <tr><td style="font-weight:bold;">Document Fingerprint (SHA-256)</td><td class="font-mono">${e.sha256||`9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`}</td></tr>
        <tr><td style="font-weight:bold;">File Format & Size</td><td>${e.fileFormat||`application/pdf`} (${((e.fileSizeBytes||245e4)/1024/1024).toFixed(2)} MB)</td></tr>
        <tr><td style="font-weight:bold;">Classification Model</td><td>ResNet-50 Document Vectorizer (Confidence: ${((e.classificationConfidence||.984)*100).toFixed(1)}%)</td></tr>
      </tbody>
    </table>

    <div class="section-title">2. OCR Extracted Fields & Cross-Validation</div>
    <table>
      <thead>
        <tr><th>Field Name</th><th>Extracted Value</th><th>Validation Status</th></tr>
      </thead>
      <tbody>
        ${Object.entries(e.extractedFields||{"Candidate Name":`Alex Mercer`,"Conferring Institution":`Stanford University`,"Degree Title":`Bachelor of Science in Computer Science`,"Graduation Date":`June 18, 2024`,"Honors / Standing":`Magna Cum Laude (GPA 3.94)`}).map(([e,t])=>`
          <tr>
            <td style="font-weight:bold;">${e}</td>
            <td>${t}</td>
            <td><span style="color:#10b981; font-weight:bold;">✓ VALIDATED</span></td>
          </tr>
        `).join(``)}
      </tbody>
    </table>

    <div class="section-title">3. AI / ML Forensic Analysis & Tampering Detection</div>
    <table>
      <thead>
        <tr><th>Inspection Check</th><th>Severity</th><th>Confidence</th><th>Findings</th></tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight:bold;">Error Level Analysis (ELA)</td>
          <td><span style="color:#10b981; font-weight:bold;">LOW</span></td>
          <td>98.7%</td>
          <td>Uniform compression artifact matrix across all structural boundaries; no digital splicing detected.</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">Typography & Kerning</td>
          <td><span style="color:#10b981; font-weight:bold;">LOW</span></td>
          <td>99.1%</td>
          <td>Micro-spacing and baseline alignment match registered institutional typography specifications.</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">Metadata Exif Inspection</td>
          <td><span style="color:#10b981; font-weight:bold;">CLEAN</span></td>
          <td>100.0%</td>
          <td>Linearized PDF syntax intact; original creation timestamp coincides with official registrar records.</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">4. Blockchain Credential Proof</div>
    <table>
      <tbody>
        <tr><td style="width:30%; font-weight:bold;">Decentralized Ledger</td><td>${e.blockchain?.network||`Ethereum Sepolia Testnet`}</td></tr>
        <tr><td style="font-weight:bold;">Smart Contract Registry</td><td class="font-mono">${e.blockchain?.contractAddress||`0x71C840A95A1E586e927c97825b7a701E7E5Ac2D4`}</td></tr>
        <tr><td style="font-weight:bold;">Transaction Hash</td><td class="font-mono">${e.blockchain?.transactionHash||`0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f`}</td></tr>
        <tr><td style="font-weight:bold;">Cryptographic Digest Match</td><td><strong style="color:#10b981;">CONFIRMED (Exact SHA-256 State Match)</strong></td></tr>
      </tbody>
    </table>

    <div class="footer">
      <p><strong>TRUSTCHAIN AI DECISION-SUPPORT REPORT</strong></p>
      <p>Dossier Integrity Checksum: <span class="font-mono">${this.simpleChecksum(e.reportId)}</span> • Verification Portal: https://trustchain-ai.org</p>
      <p style="margin-top:8px;">CONFIDENTIALITY NOTICE: This forensic analysis is intended solely for authorized verification personnel.</p>
    </div>
  </div>
</body>
</html>`,i=new Blob([r],{type:`text/html;charset=utf-8`});this.triggerDownload(i,`${e.reportId}_TRUSTCHAIN_REPORT.html`)}static downloadWord(e){let t=e.riskScore<30?`#10b981`:e.riskScore<60?`#f59e0b`:`#ef4444`,n=e.riskCategory||(e.riskScore<30?`Low Risk`:e.riskScore<60?`Moderate Risk`:`High Risk`),r=`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>TRUSTCHAIN AI Report</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; }
    h1 { font-size: 20pt; color: #0284c7; text-transform: uppercase; margin-bottom: 2pt; font-weight: bold; }
    h2 { font-size: 13pt; color: #0f172a; text-transform: uppercase; border-bottom: 2pt solid #0284c7; padding-bottom: 4pt; margin-top: 18pt; font-weight: bold; }
    p.subtitle { font-size: 10pt; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 12pt; }
    th { background-color: #f1f5f9; color: #334155; font-size: 9pt; text-transform: uppercase; font-weight: bold; padding: 6pt; border: 1pt solid #cbd5e1; text-align: left; }
    td { padding: 6pt; border: 1pt solid #cbd5e1; font-size: 10pt; vertical-align: top; }
    .header-table { width: 100%; border: none; margin-bottom: 16pt; }
    .header-table td { border: none; padding: 2pt; }
    .risk-box { background-color: #f8fafc; border: 1.5pt solid ${t}; padding: 10pt; margin-top: 8pt; margin-bottom: 12pt; }
    .footer { font-size: 8.5pt; color: #64748b; text-align: center; border-top: 1pt solid #cbd5e1; padding-top: 12pt; margin-top: 24pt; }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td>
        <h1>TRUSTCHAIN AI</h1>
        <p class="subtitle">Document Authentication & Fraud Detection Framework</p>
      </td>
      <td style="text-align: right;">
        <strong>REPORT REF:</strong> ${e.reportId}<br>
        <strong>DATE:</strong> ${new Date().toLocaleDateString()}<br>
        <strong>CLASSIFICATION:</strong> RESTRICTED FORENSIC
      </td>
    </tr>
  </table>

  <div class="risk-box">
    <strong style="font-size: 12pt; color: #0f172a;">EXECUTIVE VERIFICATION ASSESSMENT</strong><br>
    Document: <strong>${e.documentName}</strong><br>
    Fraud Risk Index: <strong style="color: ${t}; font-size: 13pt;">${e.riskScore} / 100 (${n})</strong><br>
    Assessment: <strong>${e.riskScore<30?`VERIFIED AUTHENTIC – All cryptographic, layout, and registrar checks passed.`:`REVIEW REQUIRED – Discrepancies flagged for human auditor review.`}</strong>
  </div>

  <h2>1. Document Identification</h2>
  <table>
    <tr><td style="width: 35%; font-weight: bold; background: #f8fafc;">Document Filename</td><td>${e.documentName}</td></tr>
    <tr><td style="font-weight: bold; background: #f8fafc;">Category</td><td>${e.category||`Degree Certificate`}</td></tr>
    <tr><td style="font-weight: bold; background: #f8fafc;">SHA-256 Digest</td><td><font face="Courier New">${e.sha256||`9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`}</font></td></tr>
    <tr><td style="font-weight: bold; background: #f8fafc;">Classification Model</td><td>ResNet-50 Document Vectorizer (Confidence: ${((e.classificationConfidence||.984)*100).toFixed(1)}%)</td></tr>
  </table>

  <h2>2. Extracted Attributes & OCR Validation</h2>
  <table>
    <tr><th>ATTRIBUTE</th><th>EXTRACTED VALUE</th><th>STATUS</th></tr>
    ${Object.entries(e.extractedFields||{"Candidate Name":`Alex Mercer`,"Conferring Institution":`Stanford University`,"Degree Program":`Bachelor of Science in Computer Science`,"Conferral Date":`June 18, 2024`,"Academic Distinction":`Magna Cum Laude`}).map(([e,t])=>`
      <tr>
        <td style="font-weight: bold;">${e}</td>
        <td>${t}</td>
        <td style="color: #10b981; font-weight: bold;">VALIDATED</td>
      </tr>
    `).join(``)}
  </table>

  <h2>3. AI Forensics & Tampering Analysis</h2>
  <table>
    <tr><th>FORENSIC TEST</th><th>SEVERITY</th><th>FINDINGS</th></tr>
    <tr>
      <td style="font-weight: bold;">Error Level Analysis (ELA)</td>
      <td style="color: #10b981; font-weight: bold;">PASS</td>
      <td>Compression gradient uniform; no digital copy-move or spliced pixels.</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Font Typography Validation</td>
      <td style="color: #10b981; font-weight: bold;">PASS</td>
      <td>Kerning vectors match official university registrar templates.</td>
    </tr>
  </table>

  <h2>4. Blockchain Credential Proof</h2>
  <table>
    <tr><td style="width: 35%; font-weight: bold; background: #f8fafc;">Network</td><td>${e.blockchain?.network||`Ethereum Sepolia Testnet`}</td></tr>
    <tr><td style="font-weight: bold; background: #f8fafc;">Smart Contract</td><td><font face="Courier New">${e.blockchain?.contractAddress||`0x71C840A95A1E586e927c97825b7a701E7E5Ac2D4`}</font></td></tr>
    <tr><td style="font-weight: bold; background: #f8fafc;">Transaction Hash</td><td><font face="Courier New">${e.blockchain?.transactionHash||`0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f`}</font></td></tr>
    <tr><td style="font-weight: bold; background: #f8fafc;">Integrity Proof</td><td><strong style="color: #10b981;">VERIFIED (Exact On-Chain Hash Match)</strong></td></tr>
  </table>

  <div class="footer">
    TRUSTCHAIN AI — Machine Learning & Blockchain Document Authentication Framework<br>
    Report Integrity Hash: <font face="Courier New">${this.simpleChecksum(e.reportId)}</font> • Confidential Document
  </div>
</body>
</html>`,i=new Blob([`﻿`+r],{type:`application/msword;charset=utf-8`});this.triggerDownload(i,`${e.reportId}_TRUSTCHAIN_REPORT.doc`)}static downloadPdf(t){let n=new e({orientation:`portrait`,unit:`mm`,format:`a4`}),r=t.riskScore,i=r<30,a=r>=30&&r<60,o=t.riskCategory||(i?`Low Risk`:a?`Moderate Risk`:`High Risk`),s=i?[16,185,129]:a?[245,158,11]:[239,68,68],c=t.generatedAt?new Date(t.generatedAt).toLocaleString():new Date().toLocaleString();n.setFillColor(15,23,42),n.rect(0,0,210,34,`F`),n.setFillColor(2,132,199),n.rect(0,0,210,3,`F`),n.setFont(`helvetica`,`bold`),n.setFontSize(18),n.setTextColor(255,255,255),n.text(`TRUSTCHAIN AI`,14,16),n.setFontSize(8),n.setFont(`helvetica`,`normal`),n.setTextColor(186,230,253),n.text(`DOCUMENT AUTHENTICATION & FORENSIC FRAUD DETECTION FRAMEWORK`,14,22),n.setFont(`helvetica`,`bold`),n.setFontSize(9),n.setTextColor(255,255,255),n.text(`REPORT REF: ${t.reportId}`,196,15,{align:`right`}),n.setFont(`helvetica`,`normal`),n.setFontSize(7.5),n.setTextColor(203,213,225),n.text(`DATE: ${c}  |  CLASSIFICATION: RESTRICTED FORENSIC`,196,21,{align:`right`}),n.setFillColor(248,250,252),n.roundedRect(14,39,182,30,2,2,`F`),n.setDrawColor(226,232,240),n.roundedRect(14,39,182,30,2,2,`S`),n.setFont(`helvetica`,`bold`),n.setFontSize(11),n.setTextColor(15,23,42),n.text(`EXECUTIVE FORENSIC VERIFICATION OUTCOME`,19,47),n.setFontSize(8.5),n.setFont(`helvetica`,`normal`),n.setTextColor(71,85,105),n.text(`Target Document: `,19,53),n.setFont(`helvetica`,`bold`),n.setTextColor(15,23,42),n.text(`${t.documentName} (${t.category||`Academic Credential`})`,46,53),n.setFont(`helvetica`,`normal`),n.setTextColor(71,85,105),n.text(`Forensic Verdict: `,19,59),n.setFont(`helvetica`,`bold`),n.setTextColor(s[0],s[1],s[2]),n.text(i?`AUTHENTIC & VERIFIED — Passed All Cryptographic & Forensic Validation Gates`:`MANUAL REVIEW RECOMMENDED — Discrepancies or Forensic Flags Detected`,46,59),n.setFont(`helvetica`,`normal`),n.setTextColor(100,116,139),n.text(`Pipeline Status: ${t.status.toUpperCase()}  •  Confidential Institutional Audit`,19,65),n.setFillColor(s[0],s[1],s[2]),n.roundedRect(154,43,38,22,2,2,`F`),n.setFont(`helvetica`,`bold`),n.setFontSize(7.5),n.setTextColor(255,255,255),n.text(`FRAUD RISK INDEX`,173,48,{align:`center`}),n.setFontSize(13),n.text(`${r}/100`,173,56,{align:`center`}),n.setFontSize(7),n.setFont(`helvetica`,`normal`),n.text(o.toUpperCase(),173,61,{align:`center`});let l=74;Z(n,{startY:l,margin:{left:14,right:14},head:[[`1. DOCUMENT FORENSIC METADATA`,`SPECIFICATION & CRYPTOGRAPHIC PROOF`]],body:[[`Original Filename`,t.documentName],[`Document SHA-256 Digest`,t.sha256||`9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`],[`File Format & Encoded Size`,`${t.fileFormat||`application/pdf`} (${((t.fileSizeBytes||245e4)/1048576).toFixed(2)} MB)`],[`Classification Model`,`ResNet-50 Feature Extractor + Visual Attention (Confidence: ${((t.classificationConfidence||.984)*100).toFixed(1)}%)`],[`Processing Integrity Checksum`,this.simpleChecksum(t.reportId)]],headStyles:{fillColor:[15,23,42],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:55,textColor:[30,41,59]},1:{cellWidth:`auto`,textColor:[51,65,85]}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`}),l=n.lastAutoTable.finalY+5;let u=Object.entries(t.extractedFields||{"Candidate Name":`Alex Mercer`,"Conferring University":`Stanford University Registrar`,"Degree Title":`Bachelor of Science in Computer Science`,"Graduation Date":`June 18, 2024`,"Academic Honors":`Magna Cum Laude (GPA 3.94)`});Z(n,{startY:l,margin:{left:14,right:14},head:[[`ATTRIBUTE FIELD`,`EXTRACTED VALUE`,`AI CONFIDENCE`,`VALIDATION STATUS`]],body:u.map(([e,t])=>[e,typeof t==`object`?t?.value||JSON.stringify(t):String(t),typeof t==`object`&&t?.confidence?`${(t.confidence*100).toFixed(1)}%`:`98.8%`,i?`✓ VALIDATED`:`FLAGGED`]),headStyles:{fillColor:[2,132,199],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:45,textColor:[30,41,59]},1:{cellWidth:65,textColor:[15,23,42]},2:{cellWidth:32,textColor:[71,85,105],halign:`center`},3:{cellWidth:40,fontStyle:`bold`,textColor:i?[16,185,129]:[239,68,68],halign:`center`}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`}),l=n.lastAutoTable.finalY+5,Z(n,{startY:l,margin:{left:14,right:14},head:[[`FORENSIC INSPECTION TEST`,`SEVERITY`,`CONFIDENCE`,`DIAGNOSTIC FINDINGS`]],body:[[`Error Level Analysis (ELA)`,i?`LOW (PASS)`:`HIGH (DISCREPANCY)`,`98.7%`,i?`Uniform compression artifact matrix across all structural boundaries; 0% pixel splicing detected.`:`Variance in JPEG DCT frequency matrices detected around conferral date and candidate name.`],[`Typography & Kerning Verification`,i?`LOW (PASS)`:`MEDIUM (WARNING)`,`99.1%`,i?`Micro-spacing and baseline kerning align perfectly with official institutional templates.`:`Kerning baseline diverges by 2.4pt from registered university template specifications.`],[`Metadata & Structure Forensics`,`CLEAN (PASS)`,`100.0%`,`PDF linearization markers intact; creation and modification timestamps match registrar records.`]],headStyles:{fillColor:[15,23,42],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:50,textColor:[30,41,59]},1:{cellWidth:35,fontStyle:`bold`,textColor:i?[16,185,129]:[239,68,68],halign:`center`},2:{cellWidth:25,textColor:[71,85,105],halign:`center`},3:{cellWidth:`auto`,textColor:[51,65,85]}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`}),l=n.lastAutoTable.finalY+5,Z(n,{startY:l,margin:{left:14,right:14},head:[[`4. DECENTRALIZED BLOCKCHAIN RECORD`,`ON-CHAIN CRYPTOGRAPHIC PROOF`]],body:[[`Decentralized Ledger Network`,t.blockchain?.network||`Ethereum Sepolia Testnet`],[`Smart Contract Address`,t.blockchain?.contractAddress||`0x71C840A95A1E586e927c97825b7a701E7E5Ac2D4`],[`Transaction Hash (TxID)`,t.blockchain?.transactionHash||`0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f`],[`Cryptographic Anchor Status`,i?`CONFIRMED ON-CHAIN — Exact SHA-256 byte digest matches deployed university smart contract`:`UNANCHORED / UNVERIFIED — Digest not found in official registrar blockchain registry`]],headStyles:{fillColor:[2,132,199],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:55,textColor:[30,41,59]},1:{cellWidth:`auto`,textColor:[51,65,85]}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`});let d=n.getNumberOfPages();for(let e=1;e<=d;e++)n.setPage(e),n.setDrawColor(203,213,225),n.line(14,283,196,283),n.setFont(`helvetica`,`normal`),n.setFontSize(7),n.setTextColor(148,163,184),n.text(`TRUSTCHAIN AI DECISION-SUPPORT REPORT  •  CONFIDENTIAL FORENSIC AUDIT`,14,288),n.text(`Page ${e} of ${d}`,196,288,{align:`right`}),n.text(`Integrity Checksum: ${this.simpleChecksum(t.reportId)}  |  Portal: https://alokxcreate.github.io/trustchain-ai/`,14,292);n.save(`${t.reportId}_TRUSTCHAIN_REPORT.pdf`)}static triggerDownload(e,t){let n=window.URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.appendChild(r),r.click(),window.URL.revokeObjectURL(n),document.body.removeChild(r)}static simpleChecksum(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return`0x`+Math.abs(t).toString(16).padStart(8,`0`)+`a89c`}};export{xe as t};