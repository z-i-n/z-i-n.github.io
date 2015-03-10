(function () {

	window.isEditMode = window.location.href.indexOf('edit=true') < 0 ? false : true;

	window.getScript = function (files) {
		files = (files.constructor == Array) ? files : [files];
		for (var i=0, len=files.length; i<len; i++) {
			var fileref = document.createElement("script");
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", files[i]);
			document.getElementsByTagName("head")[0].appendChild(fileref);
			//document.writeln('<scri' + 'pt src="' + files[i] + '" type="text/javascript"></sc' + 'ript>');
		}
	};



	function guidGenerator() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

	function copyProperty(source) {
		/*for (var property in source) {
			if (source.hasOwnProperty(property) && typeof source[property] === "object" && source[property] !== null ) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;*/
		var temp;
		if( Object.prototype.toString.call( source ) === '[object Array]' ) {
		   temp = [];
		} else {
			temp = {};
		}
		var destination = jQuery.extend(true, temp, source);
		return destination;
	}

	var Command = {
		get : function (type) {
			var command;
			switch (type) {
				case 'text':
					command = 'edittext';
				break;
				case 'image':
					command = 'editimage';
				break;
				case 'audio':
					command = 'editaudio';
				break;
				case 'video':
					command = 'editvideo';
				break;
				default:
					command = 'loadlayout';
			}
			return command;
		}
	};

	var TEMPLATE = {};
	var STYLE = {};

	var Edit = {
		styleNum : '01',
		editData : [],
		itemDic : {},
		loadLayoutTemplate : function () {
			$.ajax({
				url: 'edit/preload/layoutTemplate.json',
				type: 'GET',
				dataType: 'json',
				timeout: 10000,
				success: function(json, textStatus, jqXHR) {
					Edit.bindLayoutTemplate(json);
				},
				error: function(jqXHR, textStatus, errorThrown){
					throw new Error('ERROR.XML_PARSING');
				}
			});
		},
		loadStyle : function () {
			$.ajax({
				url: 'edit/preload/style.xml',
				type: 'GET',
				dataType: 'xml',
				timeout: 10000,
				success: function(xml, textStatus, jqXHR) {
					var style = $.xml2json(xml);
					Edit.bindStyle(style);
				},
				error: function(jqXHR, textStatus, errorThrown){
					throw new Error('ERROR.XML_PARSING');
				}
			});
		},
		bindStyle : function (style) {
			if (typeof style == 'object' && 'item' in style) {
				for (var i=0, len=style.item.length; i<len; i++) {
					STYLE[style.item[i].type] = style.item[i].file;
				}
			}
		},
		bindLayoutTemplate : function (temp) {
			this.templateVersion = temp.version;
			if (typeof temp == 'object' && 'page' in temp) {
				for (var i=0, len=temp.page.length; i<len; i++) {
					TEMPLATE[temp.page[i].type] = temp.page[i];
				}
			}
			document.getElementById('pageWrapper').addEventListener('click', function (evt) {
				if (evt.target.classList.contains('loadLayout') || evt.target.classList.contains('edititem')
					|| evt.target.classList.contains('edititembox') || evt.target.nodeName == "VIDEO" || evt.target.nodeName == "AUDIO") {
					Edit.handleEvent(evt);
				}
			}, false);
		},
		initPageData : function (pageData) {
			/*
			* 기존 페이지 데이터
			*/
			if (this.editData.length == 0 && pageData.length > 0) {
				this.editData = pageData;
			}
		},
		addItemDic : function (pageData) {
			var uid;
			for (var i=0, len=pageData.layout.length; i<len; i++) {
				uid = guidGenerator();
				pageData.layout[i].item.uid = uid;
				/* 아이템 사전에 아이템 추가 */
				this.itemDic[uid] = pageData.layout[i].item;
			}
			return pageData;
		},
		setItemDatatoPage : function (uid, data) {
			for (var i=0; i<this.editData.length; i++) {
					this.editData[i]
					for (var j=0; j<this.editData[i].layout.length; j++) {
							if (this.editData[i].layout[j].item.uid == uid) {
								this.editData[i].layout[j].item.type = data.type;
								this.editData[i].layout[j].item.data = data.data;
							}
					}
			}
		},
		setStyle : function (num) {
			this.styleNum = num;
			var fileref = document.getElementById('templateStyle');
			fileref.setAttribute("href", './css/'+STYLE[num]);
		},
		setBackGround : function (bgfile) {
			document.body.style.backgroundImage = 'url("'+bgfile+'")';
		},
		setLayout : function (type, page) {
			if (magazine.length <= 0) {
				throw new Error('Page not found');
			}
			var html, items =[],
				template = copyProperty(TEMPLATE[type]);
			this.editData[magazine.pageIndex] = template;
			//html = magazine.setLayout(this.editData[magazine.pageIndex]);
			magazine.setPage(magazine.pageIndex, this.editData[magazine.pageIndex], page);
		},
		setItem : function (elem, data) {
			var uid = elem.getAttribute('id');
			this.itemDic[uid] =  copyProperty(data);
			this.itemDic[uid].uid = uid;
			this.setItemDatatoPage(uid, this.itemDic[uid]);
			magazine.setItem(elem, data, true);
		},
		/*gotoPage : function (index) {
			index = parseInt(index);
			magazine.gotoPage(index);
		},*/
		addPage : function () {
			EDITOR.call('loadlayout', 'undefined', function(){
					var page = magazine.createPage();
					if (magazine.length > 1) {
						magazine.gotoPage(magazine.length);
					} else {
						EDITOR.call('currentpage', magazine.length);
					}
					arguments[arguments.length] = page;
					arguments.length = arguments.length + 1;
					Edit.setLayout.apply(Edit, arguments);
			});
		},
		pageThumb: function (url) {
			this.editData[magazine.pageIndex].thumb = url;
		},
		delPage : function (index) {
			index = parseInt(index -1);
			var newData = [];
			for (var i=0, len=this.editData.length; i<len; i++) {
				if (i != index) {
					newData.push(this.editData[i]);
				}
			}
			this.editData = newData;
			magazine.delPage(index);
		},
		swapPage : function (swap) {
			try{
				var temp1, temp2, source, target;
				swap = JSON.parse(swap);
				var source = parseInt(swap.source - 1);
				var target = parseInt(swap.target - 1);
				temp1 = this.editData[source];
				temp2 = this.editData[target];
				this.editData[source] = temp2
				this.editData[target] = temp1;
				magazine.swapPage(source, target);
			} catch(err) {
				console.log(err.message);
			}
		},
		handleEvent : function (e) {
			var elem;
			if (e.target.classList.contains('edititem')) {
				elem = e.target.parentElement;
			} else if (e.target.nodeName == "VIDEO" || e.target.nodeName == "AUDIO") {
				elem = e.target.parentElement.parentElement;
			} else {
				elem = e.target;
			}

			var itemType = elem.dataset.type,
				uid = elem.getAttribute('id'),
				command = Command.get(itemType);
			var editData = Edit.itemDic[uid];
				editData.width = elem.clientWidth;
				editData.height = elem.clientHeight;
				strJson = JSON.stringify(editData);
			/* EDITOR.call(command, strJson, function(){ Edit.callback.apply(Edit, command, arguments); }); */
			if (elem.classList.contains('loadLayout')) {
				var page = elem;
				EDITOR.call('loadlayout', strJson, function(){
					arguments[arguments.length] = page;
					arguments.length = arguments.length + 1;
					Edit.setLayout.apply(Edit, arguments);
				});
			} else {
				console.log(strJson);
				EDITOR.call('edititem', strJson, function(){
					var jsonObj;
					if (arguments[0].constructor == String) {
						jsonObj= JSON.parse(arguments[0]);
					} else {
						jsonObj= arguments[0];
					}
					Edit.setItem.call(Edit, elem, jsonObj);
				});
			}
			e.stopPropagation();
		},
		save : function () {
			try{
				var saveData = {
					"version": "1.0.1",
					"page": []
				};
				saveData.page = copyProperty(this.editData);

				console.log(JSON.stringify(saveData));
				for (var i=0,len=saveData.page.length;i<len;i++) {
					for (var j=0,len2=saveData.page[i].layout.length;j<len2;j++) {
						delete saveData.page[i].layout[j].item.uid;
					}
				}
				console.log(saveData.page);
				EDITOR.call('save', JSON.stringify(saveData));
			}catch(err) {
				console.dir(err);
			}
		}
	};
	window.addEventListener('load', function() {
		/*
		* .NET 용 이벤트 리스너 등록
		*/
		if (isEditMode) {
			nativeEvent.addListener('swappage', function(){ Edit.swapPage.apply(Edit, arguments); });
			nativeEvent.addListener('addpage', function(){ Edit.addPage.apply(Edit, arguments); });
			nativeEvent.addListener('delpage', function(){ Edit.delPage.apply(Edit, arguments); });
			nativeEvent.addListener('save', function(){ Edit.save.apply(Edit, arguments); });
			nativeEvent.addListener('pagethumb', function(){ Edit.pageThumb.apply(Edit, arguments); });

			/*
			nativeEvent.addListener('gotopage', function(){ Edit.gotoPage.apply(Edit, arguments); });
			nativeEvent.addListener('loadwallpaper', function(){ Edit.setBackGround.apply(Edit, arguments); });
			nativeEvent.addListener('loadstyle', function(){ Edit.setStyle.apply(Edit, arguments); });
			nativeEvent.addListener('loadlayout', function(){ Edit.setLayout.apply(Edit, arguments); });
			nativeEvent.addListener('loaditem', function(){ Edit.setItem.apply(Edit, arguments); });
			*/

			//layout Template JSON Load
			Edit.loadLayoutTemplate();

			Edit.loadStyle();
			document.body.style.overflow = "hidden";
		}
	}, false);
	window.Edit = Edit;
})();
