//  bonesLoader.js (localforage)

    var debugMode;

    var skinnedFolder = "/skinned/";
    var bonesUrl = skinnedFolder + "Bones_ABK04_v02.js";

    $getBones({
        name: "bones",
        key : "bones",
        obj : Avatars,
        url : bonesUrl, 
    });

    function $getBones( options ){

        var url  = options.url;
        var key  = options.key;
        var name = options.name;
        var object = options.obj;

        CacheStorage.getItem(url).then(function(result){

        //  debugMode && console.log("result:", result);

            if ( !result || JSON.stringify(result) == "{}" ) {

                debugMode && console.log("Bones:", "Getting from web.");

                return $getJSON( options );

            } else {

                debugMode && console.log("Bones:", "Getting from cache.");

                object[ name ] = result;

            }

        }).catch(function(err) {
            console.error(err);
        });

        function $getJSON(options){

            var url  = options.url;
            var key  = options.key;
            var name = options.name;
            var object = options.obj;

            return $.getJSON( url, function(data){

                CacheStorage.setItem(url, data).then(function(result){

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
                        object[ name ] = result;
                    }

                }).catch(function(err) {
                    console.log(err);
                    throw Error(err);
                });

            });
        }
    }

/*

//  bonesLoader.js (zargodb)

//  var bonesUrl = skinnedFolder + "Bones_ABK04_v02.js";

    db.open(function(err, database){
        if (err) console.error( "db.error:", err );
    }).then( function(){

        var bonesUrl = skinnedFolder + "Bones_ABK04_v02.js";
        var collection = db.collection("bones");
        console.log( "collection:", collection );

        $getBones({
            name: "bones",
            obj : Avatars,
            url : bonesUrl,
            col : collection, 
        });

        function $getBones( options ){
    
            var url  = options.url;
            var name = options.name;
            var object = options.obj;
            var collection = options.col;
    
            collection.findOne({url:url}, function( err ){
                if (err) { throw err; }
            }).then( function( result ){
        
                if ( !!result ) {
    
                    debugMode && console.log("%s: Getting from %s:", url, collection.name);
                    debugMode && console.log( "result:", result );
                    object[ name ] = result.bones;
    
                } else {
    
                    debugMode && console.log("%s: Getting from web.", url);
        
                    $.getJSON( url, function( data ){
                        console.log( url, data );
                    }).then( function( data ){
    
                        data._id = generateSalt(13);
                        data.url = url;    // IMPORTANT //
                        data.name = name;  // IMPORTANT //
                        
                        collection.insert(data, function(err){
                            if (err) { throw err; }
                        }).then( function(){
                            debugMode && console.log("%s: saved in %s", url, collection.name);
                        }).then( function(){
                            $getBones( options );
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

*/
