//  jquery-render-engine.js

//  Scene.
    var bodySelector = "body";
    var rendersSelector = "#renders";
    var rendererSelector = "#renderer";

    $(bodySelector).append('<div class="hidden" id="renders"></div>');
    $(rendersSelector).append('<input type="hidden" id="renderer">');

    var $renderer = $(rendererSelector)[0];
    $renderer.render = function(){ 
        renderer.render( scene, camera ); 
    };

    $(rendererSelector).toggleClass("render");

//  Water.
    var waterSelector = "#water";
    $(rendersSelector).append('<input type="hidden" id="water">');

    $(waterSelector)[0].render = function(){ 
        water.render(); 
    };

    $(waterSelector)[0].update = function(delta){ 
        water.material.uniforms.time.value += 2.0 / 60.0;
    };

//  Camera.
    var cameraSelector = "#camera";
    $(rendersSelector).append('<input type="hidden" id="camera">');
    $(cameraSelector)[0].render = function(){ 
        camera.position.x += ( - mouse.x - camera.position.x ) * .001;
        camera.position.y += ( - mouse.y - camera.position.y ) * .001;
        camera.position.z += ( localPlayer.controller.center.z - camera.position.z ) * .01;
        camera.lookAt(  
            new THREE.Vector3(
                localPlayer.controller.center.x, 
                    cameraControls.offset.y,
                localPlayer.controller.center.z,
            )
        );
    };

//  camera.position.set(0,25,0);
//  $(cameraSelector).toggleClass("render");

//  jQuery rendering.
//  Every object that needs render has a coresponding "render dom element".
//  When the "render dom element" has class "render", it trigger the object 
//  "render" function.

    function render(){
        var $render = $(".render");
        if ( $render.length > 0 ) {
            for (var i = 0; i < $render.length; i++){
                if ( !!$render[i].render ) $render[i].render();
            }
        }
    }
