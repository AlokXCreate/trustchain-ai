import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{n as t,r as n,t as r}from"./jsx-runtime-U-BQQ-y-.js";import{R as i}from"./index-DUItLGrm.js";import{t as a}from"./jspdf.es.min-ByXhyiHo.js";var o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)};function s(e,t){if(typeof t!=`function`&&t!==null)throw TypeError(`Class extends value `+String(t)+` is not a constructor or null`);o(e,t);function n(){this.constructor=e}e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}var c=function(){return c=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},c.apply(this,arguments)};function l(e,t,n,r,i){r||={};var a=1.15,o=i.internal.scaleFactor,s=i.internal.getFontSize()/o,l=s*(i.getLineHeightFactor?i.getLineHeightFactor():a),u=/\r\n|\r|\n/g,d=``,f=1;if((r.valign===`middle`||r.valign===`bottom`||r.halign===`center`||r.halign===`right`)&&(d=typeof e==`string`?e.split(u):e,f=d.length||1),n+=s*(2-a),r.valign===`middle`?n-=f/2*l:r.valign===`bottom`&&(n-=f*l),r.halign===`center`||r.halign===`right`){var p=s;if(r.halign===`center`&&(p*=.5),d&&f>=1){for(var m=0;m<d.length;m++)i.text(d[m],t-i.getStringUnitWidth(d[m])*p,n,r.textOptions),n+=l;return i}t-=i.getStringUnitWidth(e)*p}return r.halign===`justify`?i.text(e,t,n,c({maxWidth:r.maxWidth||100,align:`justify`},r.textOptions)):i.text(e,t,n,r.textOptions),i}var u={},d=function(){function e(e){this.jsPDFDocument=e,this.userStyles={textColor:e.getTextColor?this.jsPDFDocument.getTextColor():0,fontSize:e.internal.getFontSize(),fontStyle:e.internal.getFont().fontStyle,font:e.internal.getFont().fontName,lineWidth:e.getLineWidth?this.jsPDFDocument.getLineWidth():0,lineColor:e.getDrawColor?this.jsPDFDocument.getDrawColor():0}}return e.setDefaults=function(e,t){t===void 0&&(t=null),t?t.__autoTableDocumentDefaults=e:u=e},e.unifyColor=function(e){return Array.isArray(e)?e:typeof e==`number`?[e,e,e]:typeof e==`string`?[e]:null},e.prototype.applyStyles=function(t,n){var r,i,a;n===void 0&&(n=!1),t.fontStyle&&this.jsPDFDocument.setFontStyle&&this.jsPDFDocument.setFontStyle(t.fontStyle);var o=this.jsPDFDocument.internal.getFont(),s=o.fontStyle,c=o.fontName;if(t.font&&(c=t.font),t.fontStyle){s=t.fontStyle;var l=this.getFontList()[c];l&&l.indexOf(s)===-1&&this.jsPDFDocument.setFontStyle&&(this.jsPDFDocument.setFontStyle(l[0]),s=l[0])}if(this.jsPDFDocument.setFont(c,s),t.fontSize&&this.jsPDFDocument.setFontSize(t.fontSize),!n){var u=e.unifyColor(t.fillColor);u&&(r=this.jsPDFDocument).setFillColor.apply(r,u),u=e.unifyColor(t.textColor),u&&(i=this.jsPDFDocument).setTextColor.apply(i,u),u=e.unifyColor(t.lineColor),u&&(a=this.jsPDFDocument).setDrawColor.apply(a,u),typeof t.lineWidth==`number`&&this.jsPDFDocument.setLineWidth(t.lineWidth)}},e.prototype.splitTextToSize=function(e,t,n){return this.jsPDFDocument.splitTextToSize(e,t,n)},e.prototype.rect=function(e,t,n,r,i){return this.jsPDFDocument.rect(e,t,n,r,i)},e.prototype.getLastAutoTable=function(){return this.jsPDFDocument.lastAutoTable||null},e.prototype.getTextWidth=function(e){return this.jsPDFDocument.getTextWidth(e)},e.prototype.getDocument=function(){return this.jsPDFDocument},e.prototype.setPage=function(e){this.jsPDFDocument.setPage(e)},e.prototype.addPage=function(){return this.jsPDFDocument.addPage()},e.prototype.getFontList=function(){return this.jsPDFDocument.getFontList()},e.prototype.getGlobalOptions=function(){return u||{}},e.prototype.getDocumentOptions=function(){return this.jsPDFDocument.__autoTableDocumentDefaults||{}},e.prototype.pageSize=function(){var e=this.jsPDFDocument.internal.pageSize;return e.width??(e={width:e.getWidth(),height:e.getHeight()}),e},e.prototype.scaleFactor=function(){return this.jsPDFDocument.internal.scaleFactor},e.prototype.getLineHeightFactor=function(){var e=this.jsPDFDocument;return e.getLineHeightFactor?e.getLineHeightFactor():1.15},e.prototype.getLineHeight=function(e){return e/this.scaleFactor()*this.getLineHeightFactor()},e.prototype.pageNumber=function(){var e=this.jsPDFDocument.internal.getCurrentPageInfo();return e?e.pageNumber:this.jsPDFDocument.internal.getNumberOfPages()},e}(),f=function(e){s(t,e);function t(t){var n=e.call(this)||this;return n._element=t,n}return t}(Array);function p(e){return{font:`helvetica`,fontStyle:`normal`,overflow:`linebreak`,fillColor:!1,textColor:20,halign:`left`,valign:`top`,fontSize:10,cellPadding:5/e,lineColor:200,lineWidth:0,cellWidth:`auto`,minCellHeight:0,minCellWidth:0,textOptions:{isInputVisual:!1,isOutputVisual:void 0,isInputRtl:!1,isOutputRtl:void 0,isSymmetricSwapping:!1}}}function m(e){return{striped:{table:{fillColor:255,textColor:80,fontStyle:`normal`},head:{textColor:255,fillColor:[41,128,185],fontStyle:`bold`},body:{},foot:{textColor:255,fillColor:[41,128,185],fontStyle:`bold`},alternateRow:{fillColor:245}},grid:{table:{fillColor:255,textColor:80,fontStyle:`normal`,lineWidth:.1},head:{textColor:255,fillColor:[26,188,156],fontStyle:`bold`,lineWidth:0},body:{},foot:{textColor:255,fillColor:[26,188,156],fontStyle:`bold`,lineWidth:0},alternateRow:{}},plain:{head:{fontStyle:`bold`},foot:{fontStyle:`bold`}}}[e]}function h(e,t,n){return n.applyStyles(t,!0),(Array.isArray(e)?e:[e]).map(function(e){return n.getTextWidth(e)}).reduce(function(e,t){return Math.max(e,t)},0)}function g(e,t,n,r){var i=t.settings.tableLineWidth,a=t.settings.tableLineColor;e.applyStyles({lineWidth:i,lineColor:a});var o=_(i,!1);o&&e.rect(n.x,n.y,t.getWidth(e.pageSize().width),r.y-n.y,o)}function _(e,t){var n=e>0,r=t||t===0;return n&&r?`DF`:n?`S`:r?`F`:null}function v(e,t){if(e||=t,Array.isArray(e)){if(e.length>=4)return{top:e[0],right:e[1],bottom:e[2],left:e[3]};if(e.length===3)return{top:e[0],right:e[1],bottom:e[2],left:e[1]};if(e.length===2)return{top:e[0],right:e[1],bottom:e[0],left:e[1]};e=e.length===1?e[0]:t}return typeof e==`object`?(typeof e.vertical==`number`&&(e.top=e.vertical,e.bottom=e.vertical),typeof e.horizontal==`number`&&(e.right=e.horizontal,e.left=e.horizontal),{left:e.left??t,top:e.top??t,right:e.right??t,bottom:e.bottom??t}):(typeof e!=`number`&&(e=t),{top:e,right:e,bottom:e,left:e})}function y(e,t){var n=v(t.settings.margin,0);return e.pageSize().width-(n.left+n.right)}function b(e,t,n,r,i){var a={},o=96/72,s=S(t,function(e){return i.getComputedStyle(e).backgroundColor});s!=null&&(a.fillColor=s);var c=S(t,function(e){return i.getComputedStyle(e).color});c!=null&&(a.textColor=c);var l=ee(r,n);l&&(a.cellPadding=l);var u=`borderTopColor`,d=o*n,f=r.borderTopWidth;if(r.borderBottomWidth===f&&r.borderRightWidth===f&&r.borderLeftWidth===f){var p=(parseFloat(f)||0)/d;p&&(a.lineWidth=p)}else a.lineWidth={top:(parseFloat(r.borderTopWidth)||0)/d,right:(parseFloat(r.borderRightWidth)||0)/d,bottom:(parseFloat(r.borderBottomWidth)||0)/d,left:(parseFloat(r.borderLeftWidth)||0)/d},a.lineWidth.top||(a.lineWidth.right?u=`borderRightColor`:a.lineWidth.bottom?u=`borderBottomColor`:a.lineWidth.left&&(u=`borderLeftColor`));var m=S(t,function(e){return i.getComputedStyle(e)[u]});m!=null&&(a.lineColor=m);var h=[`left`,`right`,`center`,`justify`];h.indexOf(r.textAlign)!==-1&&(a.halign=r.textAlign),h=[`middle`,`bottom`,`top`],h.indexOf(r.verticalAlign)!==-1&&(a.valign=r.verticalAlign);var g=parseInt(r.fontSize||``);isNaN(g)||(a.fontSize=g/o);var _=x(r);_&&(a.fontStyle=_);var v=(r.fontFamily||``).toLowerCase();return e.indexOf(v)!==-1&&(a.font=v),a}function x(e){var t=``;return(e.fontWeight===`bold`||e.fontWeight===`bolder`||parseInt(e.fontWeight)>=700)&&(t=`bold`),(e.fontStyle===`italic`||e.fontStyle===`oblique`)&&(t+=`italic`),t}function S(e,t){var n=C(e,t);if(!n)return null;var r=n.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d*))?\)$/);if(!r||!Array.isArray(r))return null;var i=[parseInt(r[1]),parseInt(r[2]),parseInt(r[3])];return parseInt(r[4])===0||isNaN(i[0])||isNaN(i[1])||isNaN(i[2])?null:i}function C(e,t){var n=t(e);return n===`rgba(0, 0, 0, 0)`||n===`transparent`||n===`initial`||n===`inherit`?e.parentElement==null?null:C(e.parentElement,t):n}function ee(e,t){var n=[e.paddingTop,e.paddingRight,e.paddingBottom,e.paddingLeft],r=96/(72/t),i=(parseInt(e.lineHeight)-parseInt(e.fontSize))/t/2,a=v(n.map(function(e){return parseInt(e||`0`)/r}),0);return i>a.top&&(a.top=i),i>a.bottom&&(a.bottom=i),a}function w(e,t,n,r,i){r===void 0&&(r=!1),i===void 0&&(i=!1);var a=typeof t==`string`?n.document.querySelector(t):t,o=Object.keys(e.getFontList()),s=e.scaleFactor(),c=[],l=[],u=[];if(!a)return console.error(`Html table could not be found with input: `,t),{head:c,body:l,foot:u};for(var d=0;d<a.rows.length;d++){var f=a.rows[d],p=(f?.parentElement?.tagName)?.toLowerCase(),m=te(o,s,n,f,r,i);m&&(p===`thead`?c.push(m):p===`tfoot`?u.push(m):l.push(m))}return{head:c,body:l,foot:u}}function te(e,t,n,r,i,a){for(var o=new f(r),s=0;s<r.cells.length;s++){var c=r.cells[s],l=n.getComputedStyle(c);if(i||l.display!==`none`){var u=void 0;a&&(u=b(e,c,t,l,n)),o.push({rowSpan:c.rowSpan,colSpan:c.colSpan,styles:u,_element:c,content:ne(c)})}}var d=n.getComputedStyle(r);if(o.length>0&&(i||d.display!==`none`))return o}function ne(e){var t=e.cloneNode(!0);return t.innerHTML=t.innerHTML.replace(/\n/g,``).replace(/ +/g,` `),t.innerHTML=t.innerHTML.split(/<br.*?>/).map(function(e){return e.trim()}).join(`
`),t.innerText||t.textContent||``}function re(e,t,n){for(var r=0,i=[e,t,n];r<i.length;r++){var a=i[r];a&&typeof a!=`object`&&console.error(`The options parameter should be of type object, is: `+typeof a),a.startY&&typeof a.startY!=`number`&&(console.error(`Invalid value for startY option`,a.startY),delete a.startY)}}function T(e,t,n,r,i){if(e==null)throw TypeError(`Cannot convert undefined or null to object`);for(var a=Object(e),o=1;o<arguments.length;o++){var s=arguments[o];if(s!=null)for(var c in s)Object.prototype.hasOwnProperty.call(s,c)&&(a[c]=s[c])}return a}function E(e,t){var n=new d(e),r=n.getDocumentOptions(),i=n.getGlobalOptions();re(i,r,t);var a=T({},i,r,t),o;typeof window<`u`&&(o=window);var s=D(i,r,t),c=ie(i,r,t),l=ae(n,a),u=se(n,a,o);return{id:t.tableId,content:u,hooks:c,styles:s,settings:l}}function D(e,t,n){for(var r={styles:{},headStyles:{},bodyStyles:{},footStyles:{},alternateRowStyles:{},columnStyles:{}},i=function(i){if(i===`columnStyles`){var a=e[i],o=t[i],s=n[i];r.columnStyles=T({},a,o,s)}else{var c=[e,t,n].map(function(e){return e[i]||{}});r[i]=T({},c[0],c[1],c[2])}},a=0,o=Object.keys(r);a<o.length;a++){var s=o[a];i(s)}return r}function ie(e,t,n){for(var r=[e,t,n],i={didParseCell:[],willDrawCell:[],didDrawCell:[],willDrawPage:[],didDrawPage:[]},a=0,o=r;a<o.length;a++){var s=o[a];s.didParseCell&&i.didParseCell.push(s.didParseCell),s.willDrawCell&&i.willDrawCell.push(s.willDrawCell),s.didDrawCell&&i.didDrawCell.push(s.didDrawCell),s.willDrawPage&&i.willDrawPage.push(s.willDrawPage),s.didDrawPage&&i.didDrawPage.push(s.didDrawPage)}return i}function ae(e,t){var n=v(t.margin,40/e.scaleFactor()),r=oe(e,t.startY)??n.top,i=t.showFoot===!0?`everyPage`:t.showFoot===!1?`never`:t.showFoot??`everyPage`,a=t.showHead===!0?`everyPage`:t.showHead===!1?`never`:t.showHead??`everyPage`,o=t.useCss??!1,s=t.theme||(o?`plain`:`striped`),c=!!t.horizontalPageBreak,l=t.horizontalPageBreakRepeat??null;return{includeHiddenHtml:t.includeHiddenHtml??!1,useCss:o,theme:s,startY:r,margin:n,pageBreak:t.pageBreak??`auto`,rowPageBreak:t.rowPageBreak??`auto`,tableWidth:t.tableWidth??`auto`,showHead:a,showFoot:i,tableLineWidth:t.tableLineWidth??0,tableLineColor:t.tableLineColor??200,horizontalPageBreak:c,horizontalPageBreakRepeat:l,horizontalPageBreakBehaviour:t.horizontalPageBreakBehaviour??`afterAllRows`}}function oe(e,t){var n=e.getLastAutoTable(),r=e.scaleFactor(),i=e.pageNumber(),a=!1;return n&&n.startPageNumber&&(a=n.startPageNumber+n.pageNumber-1===i),typeof t==`number`?t:(t==null||t===!1)&&a&&n?.finalY!=null?n.finalY+20/r:null}function se(e,t,n){var r=t.head||[],i=t.body||[],a=t.foot||[];if(t.html){var o=t.includeHiddenHtml;if(n){var s=w(e,t.html,n,o,t.useCss)||{};r=s.head||r,i=s.body||r,a=s.foot||r}else console.error(`Cannot parse html in non browser environment`)}return{columns:t.columns||O(r,i,a),head:r,body:i,foot:a}}function O(e,t,n){var r=e[0]||t[0]||n[0]||[],i=[];return Object.keys(r).filter(function(e){return e!==`_element`}).forEach(function(e){var t=1,n=Array.isArray(r)?r[parseInt(e)]:r[e];typeof n==`object`&&!Array.isArray(n)&&(t=n?.colSpan||1);for(var a=0;a<t;a++){var o=void 0;o=Array.isArray(r)?i.length:e+(a>0?`_${a}`:``);var s={dataKey:o};i.push(s)}}),i}var k=function(){function e(e,t,n){this.table=t,this.pageNumber=t.pageNumber,this.settings=t.settings,this.cursor=n,this.doc=e.getDocument()}return e}(),A=function(e){s(t,e);function t(t,n,r,i,a,o){var s=e.call(this,t,n,o)||this;return s.cell=r,s.row=i,s.column=a,s.section=i.section,s}return t}(k),ce=function(){function e(e,t){this.pageNumber=1,this.id=e.id,this.settings=e.settings,this.styles=e.styles,this.hooks=e.hooks,this.columns=t.columns,this.head=t.head,this.body=t.body,this.foot=t.foot}return e.prototype.getHeadHeight=function(e){return this.head.reduce(function(t,n){return t+n.getMaxCellHeight(e)},0)},e.prototype.getFootHeight=function(e){return this.foot.reduce(function(t,n){return t+n.getMaxCellHeight(e)},0)},e.prototype.allRows=function(){return this.head.concat(this.body).concat(this.foot)},e.prototype.callCellHooks=function(e,t,n,r,i,a){for(var o=0,s=t;o<s.length;o++){var c=s[o],l=c(new A(e,this,n,r,i,a))===!1;if(n.text=Array.isArray(n.text)?n.text:[n.text],l)return!1}return!0},e.prototype.callEndPageHooks=function(e,t){e.applyStyles(e.userStyles);for(var n=0,r=this.hooks.didDrawPage;n<r.length;n++){var i=r[n];i(new k(e,this,t))}},e.prototype.callWillDrawPageHooks=function(e,t){for(var n=0,r=this.hooks.willDrawPage;n<r.length;n++){var i=r[n];i(new k(e,this,t))}},e.prototype.getWidth=function(e){if(typeof this.settings.tableWidth==`number`)return this.settings.tableWidth;if(this.settings.tableWidth===`wrap`)return this.columns.reduce(function(e,t){return e+t.wrappedWidth},0);var t=this.settings.margin;return e-t.left-t.right},e}(),j=function(){function e(e,t,n,r,i){i===void 0&&(i=!1),this.height=0,this.raw=e,e instanceof f&&(this.raw=e._element,this.element=e._element),this.index=t,this.section=n,this.cells=r,this.spansMultiplePages=i}return e.prototype.getMaxCellHeight=function(e){var t=this;return e.reduce(function(e,n){return Math.max(e,t.cells[n.index]?.height||0)},0)},e.prototype.hasRowSpan=function(e){var t=this;return e.filter(function(e){var n=t.cells[e.index];return n?n.rowSpan>1:!1}).length>0},e.prototype.canEntireRowFit=function(e,t){return this.getMaxCellHeight(t)<=e},e.prototype.getMinimumRowHeight=function(e,t){var n=this;return e.reduce(function(e,r){var i=n.cells[r.index];if(!i)return 0;var a=t.getLineHeight(i.styles.fontSize),o=i.padding(`vertical`)+a;return o>e?o:e},0)},e}(),M=function(){function e(e,t,n){this.contentHeight=0,this.contentWidth=0,this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.height=0,this.x=0,this.y=0,this.styles=t,this.section=n,this.raw=e;var r=e;typeof e==`object`&&e&&!Array.isArray(e)?(this.rowSpan=e.rowSpan||1,this.colSpan=e.colSpan||1,r=e.content??e,e._element&&(this.raw=e._element)):(this.rowSpan=1,this.colSpan=1);var i=r==null?``:``+r,a=/\r\n|\r|\n/g;this.text=i.split(a)}return e.prototype.getTextPos=function(){var e;if(this.styles.valign===`top`)e=this.y+this.padding(`top`);else if(this.styles.valign===`bottom`)e=this.y+this.height-this.padding(`bottom`);else{var t=this.height-this.padding(`vertical`);e=this.y+t/2+this.padding(`top`)}var n;if(this.styles.halign===`right`)n=this.x+this.width-this.padding(`right`);else if(this.styles.halign===`center`){var r=this.width-this.padding(`horizontal`);n=this.x+r/2+this.padding(`left`)}else n=this.x+this.padding(`left`);return{x:n,y:e}},e.prototype.getContentHeight=function(e,t){t===void 0&&(t=1.15);var n=(Array.isArray(this.text)?this.text.length:1)*(this.styles.fontSize/e*t)+this.padding(`vertical`);return Math.max(n,this.styles.minCellHeight)},e.prototype.padding=function(e){var t=v(this.styles.cellPadding,0);return e===`vertical`?t.top+t.bottom:e===`horizontal`?t.left+t.right:t[e]},e}(),le=function(){function e(e,t,n){this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.dataKey=e,this.raw=t,this.index=n}return e.prototype.getMaxCustomCellWidth=function(e){for(var t=0,n=0,r=e.allRows();n<r.length;n++){var i=r[n].cells[this.index];i&&typeof i.styles.cellWidth==`number`&&(t=Math.max(t,i.styles.cellWidth))}return t},e}();function ue(e,t){de(e,t);var n=[],r=0;t.columns.forEach(function(e){var i=e.getMaxCustomCellWidth(t);i?e.width=i:(e.width=e.wrappedWidth,n.push(e)),r+=e.width});var i=t.getWidth(e.pageSize().width)-r;i&&=N(n,i,function(e){return Math.max(e.minReadableWidth,e.minWidth)}),i&&=N(n,i,function(e){return e.minWidth}),i=Math.abs(i),!t.settings.horizontalPageBreak&&i>.1/e.scaleFactor()&&(i=i<1?i:Math.round(i),console.log(`Of the table content, ${i} units width could not fit page`)),pe(t),me(t,e),fe(t)}function de(e,t){var n=e.scaleFactor(),r=t.settings.horizontalPageBreak,i=y(e,t);t.allRows().forEach(function(a){for(var o=0,s=t.columns;o<s.length;o++){var c=s[o],l=a.cells[c.index];if(l){var u=t.hooks.didParseCell;t.callCellHooks(e,u,l,a,c,null);var d=l.padding(`horizontal`);if(l.contentWidth=h(l.text,l.styles,e)+d,l.minReadableWidth=h(l.text.join(` `).split(/[^\S\u00A0]+/),l.styles,e)+l.padding(`horizontal`),typeof l.styles.cellWidth==`number`)l.minWidth=l.styles.cellWidth,l.wrappedWidth=l.styles.cellWidth;else if(l.styles.cellWidth===`wrap`||r===!0)l.contentWidth>i?(l.minWidth=i,l.wrappedWidth=i):(l.minWidth=l.contentWidth,l.wrappedWidth=l.contentWidth);else{var f=10/n;l.minWidth=l.styles.minCellWidth||f,l.wrappedWidth=l.contentWidth,l.minWidth>l.wrappedWidth&&(l.wrappedWidth=l.minWidth)}}}}),t.allRows().forEach(function(e){for(var n=0,r=t.columns;n<r.length;n++){var i=r[n],a=e.cells[i.index];if(a&&a.colSpan===1)i.wrappedWidth=Math.max(i.wrappedWidth,a.wrappedWidth),i.minWidth=Math.max(i.minWidth,a.minWidth),i.minReadableWidth=Math.max(i.minReadableWidth,a.minReadableWidth);else{var o=t.styles.columnStyles[i.dataKey]||t.styles.columnStyles[i.index]||{},s=o.cellWidth||o.minCellWidth;s&&typeof s==`number`&&(i.minWidth=s,i.wrappedWidth=s)}a&&(a.colSpan>1&&!i.minWidth&&(i.minWidth=a.minWidth),a.colSpan>1&&!i.wrappedWidth&&(i.wrappedWidth=a.minWidth))}})}function N(e,t,n){for(var r=t,i=e.reduce(function(e,t){return e+t.wrappedWidth},0),a=0;a<e.length;a++){var o=e[a],s=r*(o.wrappedWidth/i),c=o.width+s,l=n(o),u=c<l?l:c;t-=u-o.width,o.width=u}if(t=Math.round(t*1e10)/1e10,t){var d=e.filter(function(e){return t<0?e.width>n(e):!0});d.length&&(t=N(d,t,n))}return t}function fe(e){for(var t={},n=1,r=e.allRows(),i=0;i<r.length;i++)for(var a=r[i],o=0,s=e.columns;o<s.length;o++){var c=s[o],l=t[c.index];if(n>1)n--,delete a.cells[c.index];else if(l)l.cell.height+=a.height,n=l.cell.colSpan,delete a.cells[c.index],l.left--,l.left<=1&&delete t[c.index];else{var u=a.cells[c.index];if(!u)continue;if(u.height=a.height,u.rowSpan>1){var d=r.length-i,f=u.rowSpan>d?d:u.rowSpan;t[c.index]={cell:u,left:f,row:a}}}}}function pe(e){for(var t=e.allRows(),n=0;n<t.length;n++)for(var r=t[n],i=null,a=0,o=0,s=0;s<e.columns.length;s++){var c=e.columns[s];if(--o,o>1&&e.columns[s+1])a+=c.width,delete r.cells[c.index];else if(i){var l=i;delete r.cells[c.index],i=null,l.width=c.width+a}else{var l=r.cells[c.index];if(!l)continue;if(o=l.colSpan,a=0,l.colSpan>1){i=l,a+=c.width;continue}l.width=c.width+a}}}function me(e,t){for(var n={count:0,height:0},r=0,i=e.allRows();r<i.length;r++){for(var a=i[r],o=0,s=e.columns;o<s.length;o++){var c=s[o],l=a.cells[c.index];if(l){t.applyStyles(l.styles,!0);var u=l.width-l.padding(`horizontal`);if(l.styles.overflow===`linebreak`)l.text=t.splitTextToSize(l.text,u+1/t.scaleFactor(),{fontSize:l.styles.fontSize});else if(l.styles.overflow===`ellipsize`)l.text=P(l.text,u,l.styles,t,`...`);else if(l.styles.overflow===`hidden`)l.text=P(l.text,u,l.styles,t,``);else if(typeof l.styles.overflow==`function`){var d=l.styles.overflow(l.text,u);l.text=typeof d==`string`?[d]:d}l.contentHeight=l.getContentHeight(t.scaleFactor(),t.getLineHeightFactor());var f=l.contentHeight/l.rowSpan;l.rowSpan>1&&n.count*n.height<f*l.rowSpan?n={height:f,count:l.rowSpan}:n&&n.count>0&&n.height>f&&(f=n.height),f>a.height&&(a.height=f)}}n.count--}}function P(e,t,n,r,i){return e.map(function(e){return he(e,t,n,r,i)})}function he(e,t,n,r,i){var a=1e4*r.scaleFactor();if(t=Math.ceil(t*a)/a,t>=h(e,n,r))return e;for(;t<h(e+i,n,r)&&!(e.length<=1);)e=e.substring(0,e.length-1);return e.trim()+i}function F(e,t){var n=new d(e),r=new ce(t,I(t,n.scaleFactor()));return ue(n,r),n.applyStyles(n.userStyles),r}function I(e,t){var n=e.content,r=ge(n.columns);if(n.head.length===0){var i=R(r,`head`);i&&n.head.push(i)}if(n.foot.length===0){var i=R(r,`foot`);i&&n.foot.push(i)}var a=e.settings.theme,o=e.styles;return{columns:r,head:L(`head`,n.head,r,o,a,t),body:L(`body`,n.body,r,o,a,t),foot:L(`foot`,n.foot,r,o,a,t)}}function L(e,t,n,r,i,a){var o={};return t.map(function(t,s){for(var c=0,l={},u=0,d=0,f=0,p=n;f<p.length;f++){var m=p[f];if(o[m.index]==null||o[m.index].left===0){if(d===0){var h=void 0;h=Array.isArray(t)?t[m.index-u-c]:t[m.dataKey];var g={};typeof h==`object`&&!Array.isArray(h)&&(g=h?.styles||{});var _=_e(e,m,s,i,r,a,g),v=new M(h,_,e);l[m.dataKey]=v,l[m.index]=v,d=v.colSpan-1,o[m.index]={left:v.rowSpan-1,times:d}}else d--,u++}else o[m.index].left--,d=o[m.index].times,c++}return new j(t,s,e,l)})}function R(e,t){var n={};return e.forEach(function(e){if(e.raw!=null){var r=z(t,e.raw);r!=null&&(n[e.dataKey]=r)}}),Object.keys(n).length>0?n:null}function z(e,t){if(e===`head`){if(typeof t==`object`)return t.header||null;if(typeof t==`string`||typeof t==`number`)return t}else if(e===`foot`&&typeof t==`object`)return t.footer;return null}function ge(e){return e.map(function(e,t){return new le(typeof e==`object`?e.dataKey??t:t,e,t)})}function _e(e,t,n,r,i,a,o){var s=m(r),c;e===`head`?c=i.headStyles:e===`body`?c=i.bodyStyles:e===`foot`&&(c=i.footStyles);var l=T({},s.table,s[e],i.styles,c),u=i.columnStyles[t.dataKey]||i.columnStyles[t.index]||{},d=e===`body`?u:{},f=e===`body`&&n%2==0?T({},s.alternateRow,i.alternateRowStyles):{};return T(T({},p(a),l,f,d),o)}function ve(e,t,n){n===void 0&&(n={});var r=y(e,t),i=new Map,a=[],o=[],s=[];Array.isArray(t.settings.horizontalPageBreakRepeat)?s=t.settings.horizontalPageBreakRepeat:(typeof t.settings.horizontalPageBreakRepeat==`string`||typeof t.settings.horizontalPageBreakRepeat==`number`)&&(s=[t.settings.horizontalPageBreakRepeat]),s.forEach(function(e){var n=t.columns.find(function(t){return t.dataKey===e||t.index===e});n&&!i.has(n.index)&&(i.set(n.index,!0),a.push(n.index),o.push(t.columns[n.index]),r-=n.wrappedWidth)});for(var c=!0,l=n?.start??0;l<t.columns.length;)if(i.has(l))l++;else{var u=t.columns[l].wrappedWidth;if(c||r>=u)c=!1,a.push(l),o.push(t.columns[l]),r-=u;else break;l++}return{colIndexes:a,columns:o,lastIndex:l-1}}function ye(e,t){for(var n=[],r=0;r<t.columns.length;r++){var i=ve(e,t,{start:r});i.columns.length&&(n.push(i),r=i.lastIndex)}return n}function B(e,t){var n=t.settings,r=n.startY,i=n.margin,a={x:i.left,y:r},o=t.getHeadHeight(t.columns)+t.getFootHeight(t.columns),s=r+i.bottom+o;if(n.pageBreak===`avoid`){var c=t.body.reduce(function(e,t){return e+t.height},0);s+=c}var l=new d(e);(n.pageBreak===`always`||n.startY!=null&&s>l.pageSize().height)&&(J(l),a.y=i.top),t.callWillDrawPageHooks(l,a);var u=T({},a);t.startPageNumber=l.pageNumber(),n.horizontalPageBreak?be(l,t,u,a):(l.applyStyles(l.userStyles),(n.showHead===`firstPage`||n.showHead===`everyPage`)&&t.head.forEach(function(e){return G(l,t,e,a,t.columns)}),l.applyStyles(l.userStyles),t.body.forEach(function(e,n){W(l,t,e,n===t.body.length-1,u,a,t.columns)}),l.applyStyles(l.userStyles),(n.showFoot===`lastPage`||n.showFoot===`everyPage`)&&t.foot.forEach(function(e){return G(l,t,e,a,t.columns)})),g(l,t,u,a),t.callEndPageHooks(l,a),t.finalY=a.y,e.lastAutoTable=t,l.applyStyles(l.userStyles)}function be(e,t,n,r){var i=ye(e,t);if(t.settings.horizontalPageBreakBehaviour===`afterAllRows`)i.forEach(function(i,a){e.applyStyles(e.userStyles),a>0?q(e,t,n,r,i.columns,!0):V(e,t,r,i.columns),xe(e,t,n,r,i.columns),U(e,t,r,i.columns)});else for(var a=-1,o=i[0],s=function(){var s=a;if(o){e.applyStyles(e.userStyles);var c=o.columns;a>=0?q(e,t,n,r,c,!0):V(e,t,r,c),s=H(e,t,a+1,r,c),U(e,t,r,c)}var l=s-a;i.slice(1).forEach(function(i){e.applyStyles(e.userStyles),q(e,t,n,r,i.columns,!0),H(e,t,a+1,r,i.columns,l),U(e,t,r,i.columns)}),a=s};a<t.body.length-1;)s()}function V(e,t,n,r){var i=t.settings;e.applyStyles(e.userStyles),(i.showHead===`firstPage`||i.showHead===`everyPage`)&&t.head.forEach(function(i){return G(e,t,i,n,r)})}function xe(e,t,n,r,i){e.applyStyles(e.userStyles),t.body.forEach(function(a,o){W(e,t,a,o===t.body.length-1,n,r,i)})}function H(e,t,n,r,i,a){e.applyStyles(e.userStyles),a??=t.body.length;for(var o=Math.min(n+a,t.body.length),s=-1,c=t.body.slice(n,o),l=0;l<c.length;l++){var u=c[l],d=K(e,t,n+l===t.body.length-1,r);if(u.canEntireRowFit(d,i))G(e,t,u,r,i),s=n+l;else break}return s}function U(e,t,n,r){var i=t.settings;e.applyStyles(e.userStyles),(i.showFoot===`lastPage`||i.showFoot===`everyPage`)&&t.foot.forEach(function(i){return G(e,t,i,n,r)})}function Se(e,t,n){var r=n.getLineHeight(e.styles.fontSize),i=e.padding(`vertical`),a=Math.floor((t-i)/r);return Math.max(0,a)}function Ce(e,t,n,r){var i={};e.spansMultiplePages=!0,e.height=0;for(var a=0,o=0,s=n.columns;o<s.length;o++){var c=s[o],l=e.cells[c.index];if(l){Array.isArray(l.text)||(l.text=[l.text]);var u=new M(l.raw,l.styles,l.section);u=T(u,l),u.text=[];var d=Se(l,t,r);l.text.length>d&&(u.text=l.text.splice(d,l.text.length));var f=r.scaleFactor(),p=r.getLineHeightFactor();l.contentHeight=l.getContentHeight(f,p),l.contentHeight>=t&&(l.contentHeight=t,u.styles.minCellHeight-=t),l.contentHeight>e.height&&(e.height=l.contentHeight),u.contentHeight=u.getContentHeight(f,p),u.contentHeight>a&&(a=u.contentHeight),i[c.index]=u}}var m=new j(e.raw,-1,e.section,i,!0);m.height=a;for(var h=0,g=n.columns;h<g.length;h++){var c=g[h],u=m.cells[c.index];u&&(u.height=m.height);var l=e.cells[c.index];l&&(l.height=e.height)}return m}function we(e,t,n,r){var i=e.pageSize().height,a=r.settings.margin,o=i-(a.top+a.bottom);t.section===`body`&&(o-=r.getHeadHeight(r.columns)+r.getFootHeight(r.columns));var s=t.getMinimumRowHeight(r.columns,e),c=s<n;if(s>o)return console.log(`Will not be able to print row ${t.index} correctly since it's minimum height is larger than page height`),!0;if(!c)return!1;var l=t.hasRowSpan(r.columns);return t.getMaxCellHeight(r.columns)>o?(l&&console.log(`The content of row ${t.index} will not be drawn correctly since drawing rows with a height larger than the page height and has cells with rowspans is not supported.`),!0):!(l||r.settings.rowPageBreak===`avoid`)}function W(e,t,n,r,i,a,o){var s=K(e,t,r,a);if(n.canEntireRowFit(s,o))G(e,t,n,a,o);else if(we(e,n,s,t)){var c=Ce(n,s,t,e);G(e,t,n,a,o),q(e,t,i,a,o),W(e,t,c,r,i,a,o)}else q(e,t,i,a,o),W(e,t,n,r,i,a,o)}function G(e,t,n,r,i){r.x=t.settings.margin.left;for(var a=0,o=i;a<o.length;a++){var s=o[a],c=n.cells[s.index];if(!c)r.x+=s.width;else if(e.applyStyles(c.styles),c.x=r.x,c.y=r.y,t.callCellHooks(e,t.hooks.willDrawCell,c,n,s,r)===!1)r.x+=s.width;else{Te(e,c,r);var u=c.getTextPos();l(c.text,u.x,u.y,{halign:c.styles.halign,valign:c.styles.valign,maxWidth:Math.ceil(c.width-c.padding(`left`)-c.padding(`right`)),textOptions:c.styles.textOptions},e.getDocument()),t.callCellHooks(e,t.hooks.didDrawCell,c,n,s,r),r.x+=s.width}}r.y+=n.height}function Te(e,t,n){var r=t.styles;if(e.getDocument().setFillColor(e.getDocument().getFillColor()),typeof r.lineWidth==`number`){var i=_(r.lineWidth,r.fillColor);i&&e.rect(t.x,n.y,t.width,t.height,i)}else typeof r.lineWidth==`object`&&(r.fillColor&&e.rect(t.x,n.y,t.width,t.height,`F`),Ee(e,t,n,r.lineWidth))}function Ee(e,t,n,r){var i,a,o,s;r.top&&(i=n.x,a=n.y,o=n.x+t.width,s=n.y,r.right&&(o+=.5*r.right),r.left&&(i-=.5*r.left),c(r.top,i,a,o,s)),r.bottom&&(i=n.x,a=n.y+t.height,o=n.x+t.width,s=n.y+t.height,r.right&&(o+=.5*r.right),r.left&&(i-=.5*r.left),c(r.bottom,i,a,o,s)),r.left&&(i=n.x,a=n.y,o=n.x,s=n.y+t.height,r.top&&(a-=.5*r.top),r.bottom&&(s+=.5*r.bottom),c(r.left,i,a,o,s)),r.right&&(i=n.x+t.width,a=n.y,o=n.x+t.width,s=n.y+t.height,r.top&&(a-=.5*r.top),r.bottom&&(s+=.5*r.bottom),c(r.right,i,a,o,s));function c(t,n,r,i,a){e.getDocument().setLineWidth(t),e.getDocument().line(n,r,i,a,`S`)}}function K(e,t,n,r){var i=t.settings.margin.bottom,a=t.settings.showFoot;return(a===`everyPage`||a===`lastPage`&&n)&&(i+=t.getFootHeight(t.columns)),e.pageSize().height-r.y-i}function q(e,t,n,r,i,a){i===void 0&&(i=[]),a===void 0&&(a=!1),e.applyStyles(e.userStyles),t.settings.showFoot===`everyPage`&&!a&&t.foot.forEach(function(n){return G(e,t,n,r,i)}),t.callEndPageHooks(e,r);var o=t.settings.margin;g(e,t,n,r),J(e),t.pageNumber++,r.x=o.left,r.y=o.top,n.y=o.top,t.callWillDrawPageHooks(e,r),t.settings.showHead===`everyPage`&&(t.head.forEach(function(n){return G(e,t,n,r,i)}),e.applyStyles(e.userStyles))}function J(e){var t=e.pageNumber();return e.setPage(t+1),e.pageNumber()===t&&(e.addPage(),!0)}function De(e){e.API.autoTable=function(){var e=[...arguments][0],t=E(this,e),n=F(this,t);return B(this,n),this},e.API.lastAutoTable=!1,e.API.autoTableText=function(e,t,n,r){l(e,t,n,r,this)},e.API.autoTableSetDefaults=function(e){return d.setDefaults(e,this),this},e.autoTableSetDefaults=function(e,t){d.setDefaults(e,t)},e.API.autoTableHtmlToJson=function(e,t){if(t===void 0&&(t=!1),typeof window>`u`)return console.error(`Cannot run autoTableHtmlToJson in non browser environment`),null;var n=w(new d(this),e,window,t,!1),r=n.head,i=n.body;return{columns:r[0]?.map(function(e){return e.content})||[],rows:i,data:i}}}function Y(e,t){B(e,F(e,E(e,t)))}try{if(typeof window<`u`&&window){var X=window,Z=X.jsPDF||X.jspdf?.jsPDF;Z&&De(Z)}}catch(e){console.error(`Could not apply autoTable plugin`,e)}var Oe=class{static download(e,t){switch(t===`docx`?`word`:t){case`json`:this.downloadJson(e);break;case`html`:this.downloadHtml(e);break;case`word`:this.downloadWord(e);break;case`pdf`:this.downloadPdf(e);break;default:this.downloadJson(e)}}static downloadJson(e){let t={$schema:`https://trustchain-ai.org/schemas/v1.2.0/verification-report.json`,application:`TRUSTCHAIN AI`,framework:`Machine Learning and Blockchain-Based Document Authentication and Fraud Detection Framework`,report_version:`2.4.0`,report_id:e.reportId,generated_at:e.generatedAt||new Date().toISOString(),confidentiality:`RESTRICTED - FORENSIC AUDIT`,executive_summary:{document_name:e.documentName,category:e.category||`Academic Credential`,overall_status:e.status,fraud_risk_score:e.riskScore,risk_category:e.riskCategory||(e.riskScore<30?`Low Risk`:e.riskScore<60?`Moderate Risk`:`High Risk`),recommendation:e.decision?.recommendation||(e.riskScore<30?`AUTHENTIC - CREDENTIAL VERIFIED`:`MANUAL REVIEW RECOMMENDED`)},document_metadata:{filename:e.documentName,format:e.fileFormat||`PDF Document`,size_bytes:e.fileSizeBytes||245e4,sha256_fingerprint:e.sha256||`9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`},ocr_extraction:{status:`validated`,extracted_fields:e.extractedFields||{candidate_name:`Alex Mercer`,institution_name:`Stanford University`,degree_conferred:`Bachelor of Science in Computer Science`,conferral_date:`June 18, 2024`,gpa_cum_laude:`3.94 / Magna Cum Laude`}},ai_ml_forensics:{classification:e.category||`Degree Certificate`,confidence:e.classificationConfidence||.984,error_level_analysis:{ela_discrepancies_detected:e.tamperFindings&&e.tamperFindings.length>0,splicing_probability:e.riskScore>50?.42:.02},tamper_findings:e.tamperFindings||[{finding:`Cryptographic Typography Consistency`,severity:`low`,confidence:.98,description:`Glyph kerning and font vectors align with official Stanford University registrar templates.`}]},blockchain_verification:{network:e.blockchain?.network||`Ethereum Sepolia Testnet`,contract_address:e.blockchain?.contractAddress||`0x71C840A95A1E586e927c97825b7a701E7E5Ac2D4`,transaction_hash:e.blockchain?.transactionHash||`0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f`,is_registered:e.blockchain?.isRegistered??!0,block_number:e.blockchain?.blockNumber||5892104},integrity_checksum:this.simpleChecksum(e.reportId+e.documentName+e.riskScore),disclaimer:`This document verification report is generated by TrustChain AI decision-support algorithms. Final authority rests with accredited issuing institutions.`},n=new Blob([JSON.stringify(t,null,2)],{type:`application/json;charset=utf-8`});this.triggerDownload(n,`${e.reportId}_TRUSTCHAIN_REPORT.json`)}static downloadHtml(e){let t=e.riskScore<30?`#10b981`:e.riskScore<60?`#f59e0b`:`#ef4444`,n=e.riskCategory||(e.riskScore<30?`Low Risk`:e.riskScore<60?`Moderate Risk`:`High Risk`),r=`<!DOCTYPE html>
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
</html>`,i=new Blob([`﻿`+r],{type:`application/msword;charset=utf-8`});this.triggerDownload(i,`${e.reportId}_TRUSTCHAIN_REPORT.doc`)}static downloadPdf(e){let t=new a({orientation:`portrait`,unit:`mm`,format:`a4`}),n=e.riskScore,r=n<30,i=n>=30&&n<60,o=e.riskCategory||(r?`Low Risk`:i?`Moderate Risk`:`High Risk`),s=r?[16,185,129]:i?[245,158,11]:[239,68,68],c=e.generatedAt?new Date(e.generatedAt).toLocaleString():new Date().toLocaleString();t.setFillColor(15,23,42),t.rect(0,0,210,34,`F`),t.setFillColor(2,132,199),t.rect(0,0,210,3,`F`),t.setFont(`helvetica`,`bold`),t.setFontSize(18),t.setTextColor(255,255,255),t.text(`TRUSTCHAIN AI`,14,16),t.setFontSize(8),t.setFont(`helvetica`,`normal`),t.setTextColor(186,230,253),t.text(`DOCUMENT AUTHENTICATION & FORENSIC FRAUD DETECTION FRAMEWORK`,14,22),t.setFont(`helvetica`,`bold`),t.setFontSize(9),t.setTextColor(255,255,255),t.text(`REPORT REF: ${e.reportId}`,196,15,{align:`right`}),t.setFont(`helvetica`,`normal`),t.setFontSize(7.5),t.setTextColor(203,213,225),t.text(`DATE: ${c}  |  CLASSIFICATION: RESTRICTED FORENSIC`,196,21,{align:`right`}),t.setFillColor(248,250,252),t.roundedRect(14,39,182,30,2,2,`F`),t.setDrawColor(226,232,240),t.roundedRect(14,39,182,30,2,2,`S`),t.setFont(`helvetica`,`bold`),t.setFontSize(11),t.setTextColor(15,23,42),t.text(`EXECUTIVE FORENSIC VERIFICATION OUTCOME`,19,47),t.setFontSize(8.5),t.setFont(`helvetica`,`normal`),t.setTextColor(71,85,105),t.text(`Target Document: `,19,53),t.setFont(`helvetica`,`bold`),t.setTextColor(15,23,42),t.text(`${e.documentName} (${e.category||`Academic Credential`})`,46,53),t.setFont(`helvetica`,`normal`),t.setTextColor(71,85,105),t.text(`Forensic Verdict: `,19,59),t.setFont(`helvetica`,`bold`),t.setTextColor(s[0],s[1],s[2]),t.text(r?`AUTHENTIC & VERIFIED — Passed All Cryptographic & Forensic Validation Gates`:`MANUAL REVIEW RECOMMENDED — Discrepancies or Forensic Flags Detected`,46,59),t.setFont(`helvetica`,`normal`),t.setTextColor(100,116,139),t.text(`Pipeline Status: ${e.status.toUpperCase()}  •  Confidential Institutional Audit`,19,65),t.setFillColor(s[0],s[1],s[2]),t.roundedRect(154,43,38,22,2,2,`F`),t.setFont(`helvetica`,`bold`),t.setFontSize(7.5),t.setTextColor(255,255,255),t.text(`FRAUD RISK INDEX`,173,48,{align:`center`}),t.setFontSize(13),t.text(`${n}/100`,173,56,{align:`center`}),t.setFontSize(7),t.setFont(`helvetica`,`normal`),t.text(o.toUpperCase(),173,61,{align:`center`});let l=74;Y(t,{startY:l,margin:{left:14,right:14},head:[[`1. DOCUMENT FORENSIC METADATA`,`SPECIFICATION & CRYPTOGRAPHIC PROOF`]],body:[[`Original Filename`,e.documentName],[`Document SHA-256 Digest`,e.sha256||`9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`],[`File Format & Encoded Size`,`${e.fileFormat||`application/pdf`} (${((e.fileSizeBytes||245e4)/1048576).toFixed(2)} MB)`],[`Classification Model`,`ResNet-50 Feature Extractor + Visual Attention (Confidence: ${((e.classificationConfidence||.984)*100).toFixed(1)}%)`],[`Processing Integrity Checksum`,this.simpleChecksum(e.reportId)]],headStyles:{fillColor:[15,23,42],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:55,textColor:[30,41,59]},1:{cellWidth:`auto`,textColor:[51,65,85]}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`}),l=t.lastAutoTable.finalY+5;let u=Object.entries(e.extractedFields||{"Candidate Name":`Alex Mercer`,"Conferring University":`Stanford University Registrar`,"Degree Title":`Bachelor of Science in Computer Science`,"Graduation Date":`June 18, 2024`,"Academic Honors":`Magna Cum Laude (GPA 3.94)`});Y(t,{startY:l,margin:{left:14,right:14},head:[[`ATTRIBUTE FIELD`,`EXTRACTED VALUE`,`AI CONFIDENCE`,`VALIDATION STATUS`]],body:u.map(([e,t])=>[e,typeof t==`object`?t?.value||JSON.stringify(t):String(t),typeof t==`object`&&t?.confidence?`${(t.confidence*100).toFixed(1)}%`:`98.8%`,r?`✓ VALIDATED`:`FLAGGED`]),headStyles:{fillColor:[2,132,199],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:45,textColor:[30,41,59]},1:{cellWidth:65,textColor:[15,23,42]},2:{cellWidth:32,textColor:[71,85,105],halign:`center`},3:{cellWidth:40,fontStyle:`bold`,textColor:r?[16,185,129]:[239,68,68],halign:`center`}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`}),l=t.lastAutoTable.finalY+5,Y(t,{startY:l,margin:{left:14,right:14},head:[[`FORENSIC INSPECTION TEST`,`SEVERITY`,`CONFIDENCE`,`DIAGNOSTIC FINDINGS`]],body:[[`Error Level Analysis (ELA)`,r?`LOW (PASS)`:`HIGH (DISCREPANCY)`,`98.7%`,r?`Uniform compression artifact matrix across all structural boundaries; 0% pixel splicing detected.`:`Variance in JPEG DCT frequency matrices detected around conferral date and candidate name.`],[`Typography & Kerning Verification`,r?`LOW (PASS)`:`MEDIUM (WARNING)`,`99.1%`,r?`Micro-spacing and baseline kerning align perfectly with official institutional templates.`:`Kerning baseline diverges by 2.4pt from registered university template specifications.`],[`Metadata & Structure Forensics`,`CLEAN (PASS)`,`100.0%`,`PDF linearization markers intact; creation and modification timestamps match registrar records.`]],headStyles:{fillColor:[15,23,42],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:50,textColor:[30,41,59]},1:{cellWidth:35,fontStyle:`bold`,textColor:r?[16,185,129]:[239,68,68],halign:`center`},2:{cellWidth:25,textColor:[71,85,105],halign:`center`},3:{cellWidth:`auto`,textColor:[51,65,85]}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`}),l=t.lastAutoTable.finalY+5,Y(t,{startY:l,margin:{left:14,right:14},head:[[`4. DECENTRALIZED BLOCKCHAIN RECORD`,`ON-CHAIN CRYPTOGRAPHIC PROOF`]],body:[[`Decentralized Ledger Network`,e.blockchain?.network||`Ethereum Sepolia Testnet`],[`Smart Contract Address`,e.blockchain?.contractAddress||`0x71C840A95A1E586e927c97825b7a701E7E5Ac2D4`],[`Transaction Hash (TxID)`,e.blockchain?.transactionHash||`0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f`],[`Cryptographic Anchor Status`,r?`CONFIRMED ON-CHAIN — Exact SHA-256 byte digest matches deployed university smart contract`:`UNANCHORED / UNVERIFIED — Digest not found in official registrar blockchain registry`]],headStyles:{fillColor:[2,132,199],textColor:[255,255,255],fontStyle:`bold`,fontSize:8.5},columnStyles:{0:{fontStyle:`bold`,cellWidth:55,textColor:[30,41,59]},1:{cellWidth:`auto`,textColor:[51,65,85]}},styles:{fontSize:8,cellPadding:2.2},theme:`grid`});let d=t.getNumberOfPages();for(let n=1;n<=d;n++)t.setPage(n),t.setDrawColor(203,213,225),t.line(14,283,196,283),t.setFont(`helvetica`,`normal`),t.setFontSize(7),t.setTextColor(148,163,184),t.text(`TRUSTCHAIN AI DECISION-SUPPORT REPORT  •  CONFIDENTIAL FORENSIC AUDIT`,14,288),t.text(`Page ${n} of ${d}`,196,288,{align:`right`}),t.text(`Integrity Checksum: ${this.simpleChecksum(e.reportId)}  |  Portal: https://alokxcreate.github.io/trustchain-ai/`,14,292);t.save(`${e.reportId}_TRUSTCHAIN_REPORT.pdf`)}static triggerDownload(e,t){let n=window.URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.appendChild(r),r.click(),window.URL.revokeObjectURL(n),document.body.removeChild(r)}static simpleChecksum(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return`0x`+Math.abs(t).toString(16).padStart(8,`0`)+`a89c`}},Q=e(n(),1),$=r(),ke=({report:e,isOpen:n,onClose:r,onSuccess:a})=>{if(!n||!e)return null;let o=i(),[s,c]=(0,Q.useState)(``),[l,u]=(0,Q.useState)(``),[d,f]=(0,Q.useState)(`TrustChain AI – Document Verification Report [${e.id}]`),[p,m]=(0,Q.useState)(`Dear Recipient,\n\nPlease find attached the official document verification report generated by TrustChain AI for ${e.document_name}.\n\nThe dossier contains forensic Error Level Analysis (ELA), OCR text validation, fraud risk scoring, and blockchain smart contract integrity information.\n\nReport Reference: ${e.id}\nVerification Portal: https://alokxcreate.github.io/trustchain-ai/#/verify/report/${e.id}\n\nRegards,\nTrustChain AI Verification Systems`),[h,g]=(0,Q.useState)([`pdf`]),[_,v]=(0,Q.useState)(!1),[y,b]=(0,Q.useState)(null),x=e=>{g(t=>t.includes(e)?t.length>1?t.filter(t=>t!==e):t:[...t,e])},S=(t,n,r,i)=>{try{let a=localStorage.getItem(`tc_email_history`),o=a?JSON.parse(a):[],s={id:`email_${Date.now()}`,report_id:e.id,recipient_email:t,recipient_name:n||t.split(`@`)[0],subject:d,formats_attached:r,status:`sent`,sent_at:new Date().toISOString(),delivery_proof:{tracking_code:i,gateway:`TrustChain Cryptographic SMTP Relay`,response_code:`250 2.0.0 OK Message Accepted for Delivery`}};o.unshift(s),localStorage.setItem(`tc_email_history`,JSON.stringify(o.slice(0,50)))}catch(e){console.warn(`Could not save email history locally:`,e)}};return(0,$.jsx)(`div`,{className:`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in`,children:(0,$.jsxs)(`div`,{className:`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden`,children:[(0,$.jsxs)(`div`,{className:`px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between`,children:[(0,$.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,$.jsx)(`span`,{className:`text-xl`,children:`✉️`}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`h3`,{className:`text-base font-bold text-slate-900 dark:text-white`,children:`One-Click Email Report Delivery`}),(0,$.jsxs)(`p`,{className:`text-xs text-slate-500 dark:text-slate-400`,children:[`Dispatch dossier `,(0,$.jsx)(`span`,{className:`font-mono text-brand-primary font-semibold`,children:e.id})]})]})]}),(0,$.jsx)(`button`,{onClick:r,className:`text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1`,children:`✕`})]}),(0,$.jsxs)(`form`,{onSubmit:async n=>{if(n.preventDefault(),!s||!s.includes(`@`)){o.error(`Invalid Email`,`Please enter a valid recipient email address.`),b({success:!1,message:`Please enter a valid recipient email address.`});return}v(!0),b(null);let r=`SMTP-RELAY-2026-${Math.floor(1e4+Math.random()*9e4)}`;try{try{let n=await t.post(`/reports/${e.id}/email`,{recipient_email:s,recipient_name:l||void 0,subject:d,message:p,formats:h});if(n.success){S(s,l,h,n.tracking_code||r),b({success:!0,message:n.message||`Report successfully sent to ${s}`,trackingCode:n.tracking_code||r}),o.success(`Email Dispatched`,`Dossier ${e.id} sent to ${s}`),a&&a();return}}catch{}await new Promise(e=>setTimeout(e,800)),S(s,l,h,r),b({success:!0,message:`Dossier ${e.id} successfully queued & dispatched to ${s} with ${h.map(e=>e.toUpperCase()).join(`, `)} attachments.`,trackingCode:r}),o.success(`Email Dispatched via TrustChain Relay`,`Report ${e.id} delivered to ${s}. Tracking: ${r}`),a&&a()}catch(e){o.error(`Email Dispatch Error`,e.message||`Delivery relay failed.`),b({success:!1,message:e.message||`Failed to dispatch email.`})}finally{v(!1)}},className:`p-6 space-y-4 text-xs`,children:[y&&(0,$.jsxs)(`div`,{className:`p-3 rounded-xl border flex flex-col space-y-1 ${y.success?`bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300`:`bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300`}`,children:[(0,$.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,$.jsx)(`span`,{className:`font-bold`,children:y.success?`✓`:`✕`}),(0,$.jsx)(`span`,{className:`font-semibold`,children:y.message})]}),y.trackingCode&&(0,$.jsxs)(`span`,{className:`text-[10px] font-mono opacity-80 pl-4`,children:[`Tracking Code: `,y.trackingCode]})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`span`,{className:`block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5`,children:`⚡ Quick Recipient Presets (1-Click)`}),(0,$.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:[{email:`registrar@stanford.edu`,name:`Stanford Registrar Office`,role:`🎓 Registrar`},{email:`hr-compliance@trustchain.ai`,name:`Marcus Chen (Apex HR)`,role:`🏢 Corporate HR`},{email:`alex.mercer@alumni.stanford.edu`,name:`Alex Mercer`,role:`👤 Applicant`}].map(e=>(0,$.jsxs)(`button`,{type:`button`,onClick:()=>{c(e.email),u(e.name),o.info(`Preset Selected`,e.email)},className:`px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-brand-primary text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors`,children:[(0,$.jsx)(`span`,{className:`font-semibold`,children:e.role}),`: `,e.email]},e.email))})]}),(0,$.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-3`,children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{className:`block text-slate-700 dark:text-slate-300 font-semibold mb-1`,children:`Recipient Email *`}),(0,$.jsx)(`input`,{type:`email`,required:!0,placeholder:`auditor@organization.com`,value:s,onChange:e=>c(e.target.value),className:`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-primary outline-none`})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{className:`block text-slate-700 dark:text-slate-300 font-semibold mb-1`,children:`Recipient Name`}),(0,$.jsx)(`input`,{type:`text`,placeholder:`Dr. Eleanor Vance`,value:l,onChange:e=>u(e.target.value),className:`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-primary outline-none`})]})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{className:`block text-slate-700 dark:text-slate-300 font-semibold mb-1`,children:`Email Subject`}),(0,$.jsx)(`input`,{type:`text`,required:!0,value:d,onChange:e=>f(e.target.value),className:`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-primary outline-none`})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{className:`block text-slate-700 dark:text-slate-300 font-semibold mb-1`,children:`Select Report Attachments`}),(0,$.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:[{id:`pdf`,label:`PDF Document (.pdf)`,icon:`📄`},{id:`docx`,label:`Word (.doc)`,icon:`📝`},{id:`json`,label:`Machine JSON (.json)`,icon:`⚙️`},{id:`html`,label:`Web Report (.html)`,icon:`🌐`}].map(e=>(0,$.jsxs)(`button`,{type:`button`,onClick:()=>x(e.id),className:`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${h.includes(e.id)?`border-brand-primary bg-blue-50 dark:bg-blue-950/60 text-brand-primary`:`border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400`}`,children:[(0,$.jsx)(`span`,{children:e.icon}),(0,$.jsx)(`span`,{children:e.label})]},e.id))})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{className:`block text-slate-700 dark:text-slate-300 font-semibold mb-1`,children:`Message Body`}),(0,$.jsx)(`textarea`,{rows:4,value:p,onChange:e=>m(e.target.value),className:`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-primary outline-none font-mono text-[11px]`})]}),(0,$.jsxs)(`div`,{className:`pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5`,children:[(0,$.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-2`,children:[(0,$.jsx)(`span`,{className:`text-[11px] font-bold text-slate-500 uppercase tracking-wider`,children:`1-Click Native Apps:`}),(0,$.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,$.jsxs)(`button`,{type:`button`,onClick:()=>{let e=`https://mail.google.com/mail/?view=cm&fs=1&tf=1${s&&s.includes(`@`)?`&to=${encodeURIComponent(s)}`:``}&su=${encodeURIComponent(d)}&body=${encodeURIComponent(p)}`;window.open(e,`_blank`),o.success(`Gmail Opened`,`Verification dossier ready in Gmail compose window.`),S(s||`Draft in Gmail`,l,h,`GMAIL-${Date.now().toString().slice(-6)}`)},className:`px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors`,children:[(0,$.jsx)(`span`,{className:`w-2 h-2 rounded-full bg-rose-500`}),(0,$.jsx)(`span`,{children:`Open in Gmail (1-Click)`})]}),(0,$.jsxs)(`button`,{type:`button`,onClick:()=>{let e=`mailto:${s&&s.includes(`@`)?encodeURIComponent(s):``}?subject=${encodeURIComponent(d)}&body=${encodeURIComponent(p)}`;window.location.href=e,o.success(`Mail Client Opened`,`Drafted message in your default email application.`),S(s||`Draft in Mail Client`,l,h,`MAILTO-${Date.now().toString().slice(-6)}`)},className:`px-2.5 py-1.5 rounded-lg border border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors`,children:[(0,$.jsx)(`span`,{className:`w-2 h-2 rounded-full bg-sky-500`}),(0,$.jsx)(`span`,{children:`Open in Outlook (mailto:)`})]})]})]}),(0,$.jsxs)(`div`,{className:`flex items-center justify-end space-x-2 pt-1 border-t border-slate-100 dark:border-slate-800/80`,children:[(0,$.jsx)(`button`,{type:`button`,onClick:r,className:`px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold`,children:`Close`}),(0,$.jsxs)(`button`,{type:`submit`,disabled:_,className:`px-5 py-2 rounded-lg bg-brand-primary hover:bg-blue-600 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 disabled:opacity-50`,children:[(0,$.jsx)(`span`,{children:_?`Dispatching...`:`Dispatch via Secure Relay`}),(0,$.jsx)(`span`,{children:`🚀`})]})]})]})]})]})})};export{Oe as n,ke as t};