//  SELECTED EDGES HELPER.
    
function creatingSelectedEdgesHelpers( object ){
    debugMode && console.log("creating selected edges helpers:", object);
    if ( object.children ) {
        for( child in object.children ) {
            object.children[child].add( new THREE.EdgesHelper( object.children[child], 0x00ff00, 1 ) );
            debugMode && console.log(child, object.children[child].name);
        }
    }
}

//  CONVERT FROM BUFFER GEOMETRY.

function convertingFromBufferGeometry( object ){
    if ( object.geometry instanceof THREE.BufferGeometry ) {
        debugMode && console.log("converting object from buffer geometry:", object );
        object.geometry = new THREE.Geometry().fromBufferGeometry( object.geometry );
        debugMode && console.log(object, object.name);
    } else {
        debugMode && console.log("converting from object buffer geometry:", "aborted." );
    }
}

function convertingChildrenFromBufferGeometry( object ){
    if ( object.children && object.children.length > 0 ) {
        for( child in object.children ) {
        //  debugMode && console.log( "object.children[child]:", object.children[child] );
            if ( object.children[child].geometry instanceof THREE.BufferGeometry ){
                debugMode && console.log("converting child from buffer geometry:", object.children[child] );
                object.children[child].geometry = new THREE.Geometry().fromBufferGeometry( object.children[child].geometry );
                debugMode && console.log(child, object.children[child].name);
            }
        }
    } else {
        debugMode && console.log("converting from children buffer geometry:", "aborted." );
    }
}

//  WILDCARD ANY OBJECT AND CHILD OF ROOT OBJECT.

function wildcardAnyObjectAndChild( object, callback ){
// callback: function(item, index){};
// Return any children of an object and object itself.
    if ( !!object && !!callback ){
    //  Object itself.
        if ( !(object instanceof THREE.Scene) ) callback( object );
    //  Object children.
        if ( object.children ) object.children.forEach( function( item, index ){
            wildcardAnyObjectAndChild( item, callback );
        });
    }
}

//  REMOVE OLD EDGESHELPERS.

function removeEdgesHelpers(){
    scene.children.filter( function(item){
        return (item instanceof THREE.EdgesHelper);
    }).forEach( function(item){
        scene.remove(item);
        item.geometry.dispose();
        item.material.dispose();
    });
}

function removeBoxHelpers(){
    scene.children.filter( function(item){
        return (item instanceof THREE.BoxHelper);
    }).forEach( function(item){
        scene.remove(item);
        item.geometry.dispose();
        item.material.dispose();
    });
}

function removeBoundHelpers(){
    scene.children.filter( function(item){
        return (item instanceof THREE.BoundingBoxHelper);
    }).forEach( function(item){
        scene.remove(item);
        item.geometry.dispose();
        item.material.dispose();
    });
}





