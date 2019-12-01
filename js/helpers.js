//  helpers.js

    function imageToDataUri(img, width, height) {
    
    //  Create an off-screen canvas
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    
    //  Set its dimension to target size
        canvas.width = width;
        canvas.height = height;
    
    //  Draw source image into the off-screen canvas:
        ctx.drawImage(img, 0, 0, width, height);
    
    //  Encode image to data-uri with base64 version of compressed image
        return canvas.toDataURL();
    }

    function convertDataUrlToImageDataPromise( dataUrl ) {
        return new Promise( function(resolve, reject) {

            if (dataUrl == null) return reject();
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var image = new Image();

            image.addEventListener('load', function() {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            //  resolve( ctx.getImageData(0, 0, canvas.width, canvas.height) );
                resolve( canvas );
            }, false);

            image.src = dataUrl;
        });
    }

//  dataURL to blob.

    dataURLtoBlob = function (dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    };
    
//  blob to dataURL.
    
    blobToDataURL = function (blob, callback) {
        var a = new FileReader();
        a.onload = function(e) {callback(e.target.result);}
        a.readAsDataURL(blob);
    };

    function isDataUrl( value ){
        var REGEXP_DATA_URL = /^data:(.+?\/.+?)?(;.+?=.+?)*(;base64)?,.*$/;
        return REGEXP_DATA_URL.test(value);
    }

//  Download local resource without server.
    
    downloadLocalResource = function(data, filename, mimeType) {
        filename = filename || "download";
        mimeType = mimeType || "application/octet-stream";
        var bb = new Blob([data], { type: mimeType });
        var link = document.createElement("a");
        link.download = filename;
        link.href= window.URL.createObjectURL(bb);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    downloadFile = function(url) {
        var link = document.createElement("a");
        link.href = url;
        link.download = "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

//  Generate UUID (lowercase).

    function generateUUID() {

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
        var uuid = new Array( 36 );
        var rnd = 0, r;

        for ( var i = 0; i < 36; i ++ ) {

            if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                uuid[ i ] = "-";

            } else if ( i === 14 ) {

                uuid[ i ] = '4';

            } else {

                if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

            }
        }

        return uuid.join( "" ).toLocaleLowerCase();
    
    }

