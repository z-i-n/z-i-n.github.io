$.templates({
    edit_bookcase: 
        '<item type="bookcase" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '{{for book}}'+
            '<book type="bookcase">'+
                '<title><![CDATA[{{:title}}]]></title>' +
                '<thumbnail>{{:thumbnail}}</thumbnail>' +
                '<path>{{:path}}</path>' +
            '</book>'+
            '{{/for}}'+
        '</item>',
    edit_text:
        '<item type="text" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '<fontstyle><![CDATA[{{:fontstyle}}]]></fontstyle>'+
            '<fontsize>{{:fontsize}}</fontsize>'+
            '<bold>{{:bold}}</bold>'+
            '<italic>{{:italic}}</italic>'+
            '<underline>{{:underline}}</underline>'+
            '<content>'+
            '<![CDATA[{{:content}}]]>'+
            '</content>'+
        '</item>',
    edit_linker:
        '<item type="linker" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '<title><![CDATA[{{:title}}]]></title>'+
            '<url>{{:url}}</url>'+
        '</item>',
    edit_image:
        '<item type="image" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '<title><![CDATA[{{:title}}]]></title>'+
            '<url>{{:url}}</url>'+
            '<link>{{:link}}</link>'+
        '</item>',
    edit_video:
        '<item type="video" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '<title><![CDATA[{{:title}}]]></title>'+
            '<url>{{:url}}</url>'+
            '<link>{{:link}}</link>'+
        '</item>',
    edit_audio:
        '<item type="audio" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '<title><![CDATA[{{:title}}]]></title>'+
            '<url>{{:url}}</url>'+
            '<link>{{:link}}</link>'+
        '</item>',
    edit_objectQuiz:
        '<item type="objectQuiz" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '<email>{{:email}}</email>' +
            '{{for answer}}' +
            '<answer><![CDATA[{{:#data}}]]></answer>' +
            '{{/for}}'+
        '</item>',
    edit_subjectQuiz:
        '<item type="subjectQuiz" top="{{:top}}" left="{{:left}}" width="{{:width}}" height="{{:height}}">' +
            '<email>{{:email}}</email>'+
        '</item>',
    edit_board:
        '<item type="board" />',
    edit_shortcut:
        '<item type="shortcut">' +
            '{{for shortcut}}'+
            '<shortcut type="shortcut" x="{{:x}}" y="{{:y}}">' +
                '<name><![CDATA[{{:name}}]]></name>' +
                '<thumbnail>{{:thumbnail}}</thumbnail>' +
                '<classname>{{:classname}}</classname>' +
                '<packagename>{{:packagename}}</packagename>' +
            '</shortcut>' +
            '{{/for}}'+
        '</item>'
});

xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
