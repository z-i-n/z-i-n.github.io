
var nativeListener = {
    execute : function (command, strJson){
        //console.log('Command : ' + command );
/*         if ( command.indexOf('edit') > -1 ) {
            setTimeout(function () {
                console.log('jsLinstener callback : ' + strJson);
                // var obj = JSON.parse(strJson);
                // obj.thumbnail = './images/style01/img_sample_04.png';
                // obj.url = './images/style01/img_sample_04.png';
                // obj.content = 'Text Text';
                // strJson = JSON.stringify(obj);
                //strJson = '{"name":"이메일","thumbnail":"./edit/preload/shortcut/05_n.png","classname":"com.sec.esg.android.app.smartfile.FileManagerActivity","packagename":"com.sec.esg.android.app.smartfile","type":"shortcut","x":"6","y":"2","uid":"2e5409f4-36ff-03a5-a51a-b71e8c4449c1"}';
                jsListener(command, strJson);
            }, 2000);
        } else  */
		if (command == 'loadlayout') {
			$("#selectLayout").show();
			$('.dev_pop').show();
		} else if (command.indexOf('edit') > -1) {
			$("#selectItem").show();
			$('.dev_pop').show();
		} else if (command == 'save') {
			//console.log(strJson);
		}
    }
};