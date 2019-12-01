//  outfitLoader.js (v1.0)

    var debugMode;

    var scriptsFolder  = "/scripts/";
    var skinnedFolder  = "/skinned/";
    var texturesFolder = "/textures/";

    var Avatars = {};

    var initOutfitAsset = initSkinnedAsset;

    function $getOutfit(options, loadTextures, loadStamp){
    
        var url  = options.url;
        var key  = options.key;
        var name = options.name;

        CacheStorage.getItem(url).then(function( result ){ 

            if ( !result || JSON.stringify(result) == "{}" ) {

                debugMode && console.log("Outfit:", "Getting from web.");

                return $getJSON(options);

            } else {

                debugMode && console.log("Outfit:", "Getting from cache.");

                result.sourceFile = url;                             //  IMPORTANT  //

                Avatars[ name ] = initSkinnedAsset( result, url );

                if ( !Avatars[ name ].geometry.sourceFile ) {
                    Avatars[ name ].geometry.sourceFile = url;       //  IMPORTANT  //
                }

                if (!!loadTextures) loadTextures( Avatars[ name ] );

            }

        }).catch(function(err) {
            console.error(err);
        });

        function $getJSON(options){

            var url  = options.url;
            var key  = options.key;
            var name = options.name;

            $.getJSON( url ).then(function(json){

                json.sourceFile = url;  //  IMPORTANT  //

                CacheStorage.setItem(url, json).then(function(result){

                    if (!result) {

                        var err = [ 
                            "AW3D Cache Error:", 
                            "No result returned:", 
                            result,
                        ].join(" ");
                        console.error(err);
                        throw Error(err);

                    } else if ( JSON.stringify(result) == "{}" ) {

                        var err = [ 
                            "AW3D Cache Warning:", 
                            "empty object returned:", 
                            JSON.stringify(result),
                        ].join(" ");
                        console.warn(err);
                        throw Error(err);

                    } else {

                        console.log("AW3D Cache:", "success!");

                        Avatars[ name ] = initSkinnedAsset( result, url );
                        if ( !Avatars[ name ].geometry.sourceFile ) {
                            Avatars[ name ].geometry.sourceFile = url;       //  IMPORTANT  //
                        }

                        if ( !!loadStamp )  loadStamp( Avatars[ name ] );
                        if (!!loadTextures) loadTextures( Avatars[ name ] );

                    }

                }).catch(function(err) {
                    console.log(err);
                    throw Error(err);
                });

            }).fail(function(err){
                console.error(err);
                throw Error(err);
            });

        }
    }

    function textureMapLoader( options ){

        var url   = options.url;
        var map   = options.map;
        var name  = options.name;
        var index = options.index;
        var asset = options.asset;

        var img = new Image();
        img.crossOrigin = "anonymous";   //  IMPORTANT  //
        $(img).one("load", function (){
            var texture = new THREE.Texture( img ); // or canvas //
            texture.name = name;
            texture.sourceFile = url;
            applyTexture( asset, texture, map, index );
            $(img).remove();
        });

        img.src = url;
    }

    function applyTexture( asset, texture, map, index ){

        if ( !texture ){
            var msg = "Outfit texture have not defined!";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        }

        if ( !asset ) {
            var name = name || "asset";
            var msg = "Outfit <b>" + name + "</b> have not been defined!";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        }

        if ( !asset.material.materials ) {
            var msg = "Outfit material is not of type multimaterial.";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        } 

        if ( asset.material.materials.length == 0 ) {
            var msg = "Outfit multimaterial does not have materials.";
            debugMode && console.error(msg);
            try { bootboxErrorAlert( msg ); } catch(err){ alert(msg); }
            return;
        }

        var map = map || "map";

        if ( !! texture && asset.material.materials.length > 0 ) {

            if ( index == null || isNaN(index) ) index = 0;

        //  Dispose old texture.
            if ( !!asset.material.materials[index][map] 
            &&  asset.material.materials[index][map] instanceof THREE.Texture ){

                asset.material.materials[index][map].dispose();
                asset.material.materials[index][map] = null;
    
            }

            asset.material.materials[index][map] = texture;
            asset.material.materials[index][map].needsUpdate = true;
            asset.material.materials[index].needsUpdate = true;

        }
    }

/*
    if ( index != null && !isNaN(index) ) {
        asset.material.materials[index][map] = texture;
        asset.material.materials[index][map].needsUpdate = true;
        asset.material.materials[index].needsUpdate = true;
    } else {
        asset.material.materials[0][map] = texture;
        asset.material.materials[0][map].needsUpdate = true;
        asset.material.materials[0].needsUpdate = true;
    }
*/


    function initSkinnedAsset( json, url ){

        var loader = new THREE.JSONLoader();
        var object = loader.parse( json );

    //  Material.

        if ( !!object.materials ) {

            object.materials.forEach( function ( material ) {
                material.skinning = true;     // IMPORTANT //
            }); 
        }

    //  Switching to multimaterials.

    //  var multimaterial = new THREE.MeshFaceMaterial(); // <-- MultiMaterial. //

        if ( !!object.materials && object.materials.length > 0 ) {

            var multimaterial = new THREE.MeshFaceMaterial( object.materials );  // <-- MultiMaterial.
            for (var i = 0; i < multimaterial.materials.length; i++){
                if ( !multimaterial.materials[i].skinning ) {
                    multimaterial.materials[i].skinning = true;                   //  IMPORTANT  //
                }
            }

        } else {

            var multimaterial = new THREE.MeshFaceMaterial([
                new THREE.MeshStandardMaterial({skinning:true})
            ]);
        }

        if ( !multimaterial ) console.error("MultiMaterial did not defined:", multimaterial);

    //  Geometry.

        var geometry = object.geometry;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.name = json.name;

        if ( !!json.sourceFile ) {
            geometry.sourceFile = json.sourceFile;  // IMPORTANT //
        } else if ( !!url ) {
            geometry.sourceFile = url;              // IMPORTANT //
        }

    //  Skinned mesh.

        var skinned = new THREE.SkinnedMesh( geometry, multimaterial );

        skinned.renderDepth = 1;
        skinned.frustumCulled = false;              // IMPORTANT //
        skinned.scale.set( 1, 1, 1 );
        skinned.position.set( 0, 0, 0 );
        skinned.rotation.set( 0, 0, 0 ); 

        return skinned;
    }

/*
        var material;
        if ( object.materials.length == 1 ) {
            material = object.materials[0];
            material.skinning = true;                                    //  IMPORTANT  //
        } else if ( object.materials.length > 1 ) {
            material = new THREE.MeshFaceMaterial(object.materials);     // <-- MultiMaterial //
            for (var i=0; i < material.materials.length; i++){
                material.materials[i].skinning = true;                   //  IMPORTANT  //
            }
        } else {
            material = new THREE.MeshStandardMaterial({skinning:true});  //  IMPORTANT  //
        }
*/

    function initMeshAsset( json, url ){

        var loader = new THREE.JSONLoader();
        var object = loader.parse( json );

    //  Material.

    //  Switching to multimaterials.

        if ( !!object.materials && object.materials.length > 0 ) {

            var multimaterial = new THREE.MeshFaceMaterial( object.materials );  // <-- MultiMaterial.
            for (var i = 0; i < multimaterial.materials.length; i++){
                if ( multimaterial.materials[i].skinning ) {
                    multimaterial.materials[i].skinning = false;                   //  IMPORTANT  //
                }
            }

        } else {

            var multimaterial = new THREE.MeshFaceMaterial([ 
                new THREE.MeshStandardMaterial({skinning:false}) 
            ]);
        }

        if ( !multimaterial ) console.error("MultiMaterial did not defined:", multimaterial);

    //  Geometry.

        var geometry = object.geometry;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.name = json.name;

        if ( !!json.sourceFile ) {
            geometry.sourceFile = json.sourceFile;  // IMPORTANT //
        } else if ( !!url ) {
            geometry.sourceFile = url;              // IMPORTANT //
        }

    //  Mesh.

        var mesh = new THREE.Mesh( geometry, multimaterial );

        mesh.renderDepth = 1;
        mesh.frustumCulled = false;                 // IMPORTANT //
        mesh.scale.set( 1, 1, 1 );
        mesh.position.set( 0, 0, 0 );
        mesh.rotation.set( 0, 0, 0 ); 

        return mesh;
    }

/*
    var material;
    if ( object.materials.length == 1 ) {
        material = object.materials[0];
        material.skinning = false;                                    // IMPORTANT //
    } else if ( object.materials.length > 1 ) {
        material = new THREE.MeshFaceMaterial(object.materials);
        for (var i=0; i < material.materials.length; i++){
            material.materials[i].skinning = false;                   // IMPORTANT //
        }
    } else {
        material = new THREE.MeshStandardMaterial({skinning:false});  // IMPORTANT //
    }
*/

    function imgurQualityUrl(options){

        if (!options.id) return "https://i.imgur.com/ODeftia.jpg";

        var dot    = ".";
        var ext    = options.ext || "jpg";
        var id     = options.id || "ODeftia";
        var q      = options.quality || "original";
        var imgur  = "https://i.imgur.com/";

        return imgur + imgurId( id, q ) + dot + ext;
    }

    function imgurId(id, quality){

        switch (quality) {

            case null:
            case undefined:
            case "original":
                break;
    
            case "small":
                id += "s";
                break;
    
            case "big":
                id += "b";
                break;
    
            case "thumb":
                id += "t";
                break;
    
            case "medium":
                id += "m";
                break;
    
            case "large":
                id += "l";
                break;

            case "huge":
                id += "h";
                break;

            default:
                id;
        }

        return id;
    }


    function makePowerOfTwo( image, natural ) {
        var canvas = document.createElement( "canvas" );

        if ( natural ){
            canvas.width = THREE.Math.nearestPowerOfTwo( image.naturalWidth );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.naturalHeight );
        } else {
            canvas.width = THREE.Math.nearestPowerOfTwo( image.width );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.height );
        }
        var context = canvas.getContext( "2d" );
        context.drawImage( image, 0, 0, canvas.width, canvas.height );

        debugMode && console.warn( "outfitLoader:makePowerOfTwo(img):", 
            "Image resized to:", canvas.width, "x", canvas.height, 
        );

        return canvas;
    }

    function getAvatarAssetPromise( url, name ){
        debugMode && console.log("DEPRECTED:", 
            "getAvatarAssetPromise(url, name) is deprecated.",
            "Use instead $.getJSON( url ).then(function(json){});" 
        );

        return new Promise( function( resolve, reject ){
            $.getJSON( url, function(json){
            //  debugMode && console.log("json:", json);
                Avatars[ name ] = initSkinnedAsset( json );
            //  debugMode && console.log( name, Avatars[ name ] );
                resolve( Avatars[ name ] );
            });
        });
    }


    function toLocalStore( key, data ){
        if (!window.localStorage) return;
        return localStorage[key] = JSON.stringify(data);
    }

    function fromLocalStore( key ){
        if (!window.localStorage) return;
        if ( !localStorage[key] ) return;
        return JSON.parse( localStorage[key] );
    }


/*
//  OutfitLoader.js (zargodb)

    function $getOutfit( options ){

//        var url = options.url;
//        var col = options.col;
//        var name = options.name;
//        var object = options.obj;
//        var loadTextures = options.loadTextures;

        db.open(function(err, database){
            if (err) console.error( "db.error:", err );
        }).then( function(){

        //  var collection = db.collection( options.collection );
        //  console.log( "collection:", collection );
            options.collection = db.collection( options.col );
            console.log( "options:", options );

            $getJSON(options);

            function $getJSON(options){

                var url  = options.url;
                var name = options.name;
            //  var object = options.obj;
                var collection = options.collection;
                var loadTextures = options.loadTextures;

                collection.findOne({url:options.url}, function( err ){
                    if (err) { throw err; }
                }).then( function( result ){
                    console.log( "result:", result );

                    if ( !!result ) {

                        debugMode && console.log("%s: Getting from %s.", url, collection.name);
                        //object[ name ] = result[ name ];
                        Avatars[ name ] = initSkinnedAsset( result[ name ], url ); // object: Avatars.
                        if ( !Avatars[ name ].geometry.sourceFile ) {
                            Avatars[ name ].geometry.sourceFile = url;       //  IMPORTANT  //
                        }

                        if (!!loadTextures) loadTextures( Avatars[ name ] );


                    } else {

                        debugMode && console.log("%s: Getting from web.", url);
            
                        $.getJSON( url, function( json ){
                            console.log( url, json );
                        }).then( function( json ){

                            var data = {};
                            data._id = generateSalt(13);
                            data.url = url;    // IMPORTANT //
                            data.name = name;  // IMPORTANT //                            
                            data[ name ] = json; // or data.json ???

                            collection.insert(data, function(err){
                                if (err) { throw err; }
                            }).then( function(){
                                debugMode && console.log("%s: saved in %s", url, collection.name);
                            }).then( function(){
                                $getOutfit( options );
                            }).catch( function(err){
                                console.error(err);
                            });
        
                        });

                    }

                }).catch( function(err){
                    console.error(err);
                });

            }

        });

    } // end $getOutfit().

*/
