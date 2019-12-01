//  PlayerLabel.js

    /*!
    * @author anywhere3d
    * http://anywhere3d.org
    * MIT License
    */


    var PlayerLabel = function( text, options ){
    
    //  options:
    //      player: player controller,
    //      color:  color hex string,
    //      size:   font size px;
    //      margin: background margin px;
    
        var text;
        var player;
        var fontSize;
        var fontColor;
        var backgroundMargin;
    
        if (!text || text == "") return;

        if (!options) {

            player = localPlayer;
            fontColor = "orange";
            fontSize = 100;
            backgroundMargin = 50;
            
        } else {
        
            if (!options.player) {
                player = localPlayer;
                fontColor = "orange";
                fontSize = 100;
            } else {
                player = options.player;
            }
            
            if (!options.color) {
                if ( !!options.player ){
                    if ( options.player != localPlayer ) fontColor = "limegreen";
                    if ( options.player == localPlayer ) fontColor = "orange";
                }
            } else {
                fontColor = options.color;
            }
    
            if (!options.size) fontSize = 100;
            else fontSize = options.size;
            
            if (!options.margin) backgroundMargin = 50;
            else backgroundMargin = options.margin;
        }
        
        switch( player.outfit.getGender() ){
            case "male":
                var position = new THREE.Vector3(0,31,0);
                break;
            case "female":
                var position = new THREE.Vector3(0,32,0);
                break;
            case false:
                var position = new THREE.Vector3(0,30,0);
                break;
            default: 
                var position = new THREE.Vector3(0,30,0);
        }

        var label = createLabel( text, position, fontSize, fontColor, backgroundMargin );
    //  Remove existing label if any from outfit.
        player.outfit.direction.remove( player.label );
    //  Add new label to player outfit direction.
        player.outfit.direction.add( label );
    //  Set player label.
        return label;

    };


    function createLabel(text, position, size, color, backgroundMargin) {

        if (!size ) size = 100;
        if (!color) color = "#ffffff";
        if (!position) position = new THREE.Vector3(0,0,0);
        if (!backgroundMargin) backgroundMargin = 50;

        var canvas = document.createElement("canvas");

        var ctx = canvas.getContext("2d");
        ctx.font = "bold " + size + "pt Arial";

        var textWidth = ctx.measureText(text).width;
        debugMode && console.log(text, "textWidth:", textWidth );

        canvas.width  = textWidth + backgroundMargin;
        canvas.height = size + backgroundMargin;
        debugMode && console.log("canvas:", canvas );

        var context = canvas.getContext("2d");
        context.font = "bold " + size + "pt Arial";

    //  fill text.
        context.shadowColor = "rgba(0, 0, 0, 1)";
        context.shadowOffsetX = 8;
        context.shadowOffsetY = 8;
        context.shadowBlur = 4;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = color;
        context.fillText(text, canvas.width / 2, canvas.height / 2);

    //  stroke text.
        context.shadowColor = "rgba(0, 0, 0, 1)";
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 10;
        context.lineWidth = 5;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.strokeStyle = color;
        context.strokeText(text, canvas.width / 2, canvas.height / 2);

        debugMode && console.log("context:", context );

    //  return canvas;

    //  Create sprite.
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.SpriteMaterial({
            map: texture
        });

        var sprite = new THREE.Sprite(material);
    //  sprite.overdraw = true;
        sprite.doubleSided = true;
        sprite.position.copy(position);
        sprite.scale.x = canvas.width / 150;
        sprite.name = "PLAYER_LABEL";

        debugMode && console.log(
            "This is the latest createLabel",
            "function (v3) in PlayerLabel.js."
        );

        return sprite;
    }


    function createHtmlLabel( html ) {

        var s = 10;
        var w = 512;
        var h = 512;

        var data = "data:image/svg+xml," +
        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
            '<foreignObject width="100%" height="100%">' +
                html_to_xml(html) +
            '</foreignObject>' +
        '</svg>';
        debugMode && console.log("data:", data );

        var canvas = document.createElement("canvas");
        canvas.width = w;  canvas.height = h;
        var ctx = canvas.getContext('2d');

        ctx.font = "bold 100pt Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var img = new Image(w, h);
        img.onload = function () {

            ctx.drawImage(img, 0, 0, w, h);
            debugMode && console.log("ctx:", ctx );
    
        //  Create sprite.
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
    
            var material = new THREE.SpriteMaterial({
                map: texture
            });
    
            var sprite = new THREE.Sprite(material);
        //  sprite.overdraw = true;
            sprite.doubleSided = true;
            sprite.position.set(0,30,0);
            sprite.scale.set(1,1,1);
            sprite.name = "PLAYER_HTML_LABEL";

            localPlayer.outfit.direction.add(sprite);

            debugMode && console.log("img:", img );
            
        }
        
        img.src = data;

    }

    function html_to_xml(html) {
        var doc = document.implementation.createHTMLDocument("");
        doc.write(html);
    
        // You must manually set the xmlns if you intend to immediately serialize     
        // the HTML document to a string as opposed to appending it to a
        // <foreignObject> in the DOM
        doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);
    
        // Get well-formed markup
        html = (new XMLSerializer).serializeToString(doc.body);
        return html;
    }

    function render_html_to_canvas(html, ctx, x, y, width, height) {
        var data = [
            "data:image/svg+xml,",
            '<svg xmlns="http://www.w3.org/2000/svg" width="', width, 
            '" height="', height, '">',
                '<foreignObject width="100%" height="100%">',
                    html_to_xml(html),
                '</foreignObject>',
            '</svg>'
        ].join("");
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, x, y);
        }
        img.src = data;
    }
    
/*
        var data =   '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
                       '<foreignObject width="100%" height="100%">' +
                         '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">'
                           + html +
                         '</div>' +
                       '</foreignObject>' +
                     '</svg>';

        var domUrl = window.URL || window.webkitURL || window;
        
        var img = new Image();
        var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        var url = domUrl.createObjectURL(svg);
*/

