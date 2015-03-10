
		var isDevMode = !(/Android/i.test(navigator.userAgent));

		if (window.location.href.indexOf('dev=true') > 0) {
			isDevMode = true;
		}
		//PC 개발용
		$(function(){
				if (window.isDevMode) {
					var EDITJS = ['edit/mockup.js'];
					getScript(EDITJS);
					$(".dev_area").css("display", "block");
				} else {
					$(".dev_area").css("display", "none");
				}
		});

		function setStyle(type){
			jsListener('loadstyle', type);
		}
		function addPage(){
			jsListener('addpage');
		}

		function setWallpaper(){
			jsListener('loadwallpaper', $('#wallpaperType').val());
		}
		function setLayoutTemplate(){
			$("#selectLayout").hide();
			$('.dev_pop').hide();
			jsListener('loadlayout', $('#layoutTemplateType').val());
		}
		function setItemTemplate(){
			$("#selectItem").hide();
			var val = $('#itemTemplateType').val();
			$("#edit_"+val).show();
			//jsListener('edititem', $('#itemTemplateType').val());
		}

		function editImage(){
			$("#selectItem").hide();
			var ret = {"type": "image"};
			ret.data = {};
			//ret.data.id = $('#imageId').val();
			ret.data.url = $('#imageUrl').val();
			ret.data.title = $('#imageTitle').val();
			ret.data.link = $('#imageLink').val();

			jsListener('edititem', JSON.stringify(ret))

			$(".editItem").hide();
			$('.dev_pop').hide();
		}


		function editVideo(){
			$("#selectItem").hide();
			var ret = {"type": "video"};
			ret.data = {};
			//ret.data.id = $('#videoId').val();
			ret.data.url = $('#videoUrl').val();
			ret.data.title = $('#videoTitle').val();
			ret.data.poster = $('#videoPoster').val();

			jsListener('edititem', JSON.stringify(ret))

			$(".editItem").hide();
			$('.dev_pop').hide();
		}

		function editAudio(){
			$("#selectItem").hide();
			var ret = {"type": "audio"};
			ret.data = {};
			//ret.data.id = $('#audioId').val();
			ret.data.url = $('#audioUrl').val();
			ret.data.title = $('#audioTitle').val();
			ret.data.link = $('#audioLink').val();

			jsListener('edititem', JSON.stringify(ret))

			$(".editItem").hide();
			$('.dev_pop').hide();
		}

		function changeFontSize() {
			var val = document.getElementById('fSize').value;
			$('#fsize').html(val);
		}
		function editText(){
			$("#selectItem").hide();
			var ret = {"type": "text"};
			ret.data = {};

			ret.data.bold = document.getElementById('fBold').checked;
			ret.data.italic = document.getElementById('fItalic').checked;
			ret.data.underline = document.getElementById('fUnderline').checked;
			ret.data.content =  document.getElementById('fContent').value;
			ret.data.fontstyle =  document.getElementById('fStyle').value;
			ret.data.fontsize = document.getElementById('fSize').value;

			jsListener('edititem', JSON.stringify(ret));

			$(".editItem").hide();
			$('.dev_pop').hide();
		}

		function cancel () {
			$(".editItem").hide();
			$('.dev_pop').hide();
		}

		function gotoPage(){
			jsListener('gotopage', $('#pageNum').val());
		}
		function delPage(){
			jsListener('delpage', $('#delNum').val());
		}
		function swapPage(){
			var ret = {"source": $('#Num1').val(), "target": $('#Num2').val()};
			jsListener('swappage', JSON.stringify(ret));
		}
		function save(){
			jsListener('save');
		}

		function pageThumb(){
			jsListener('pagethumb', $('#pageThumb').val());
		}

