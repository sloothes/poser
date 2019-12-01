//  alerts.js (v2.0)

    function bootboxSuccessAlert( msg, callback ){
        var message = [ '<div class="alert-icon icon-success"></div>', '<label class="alert-small">', msg, '</label>' ].join("") ;
        bootbox.alert({size:"small", message:message, callback:callback});
    }

    function bootboxCancelAlert( msg, callback ){
        var message = [ '<div class="alert-icon icon-cancel"></div>', '<label class="alert-small">', msg, '</label>' ].join("") ;
        bootbox.alert({size:"small", message:message, callback:callback});
    }

    function bootboxWarningAlert( msg, callback ){
        var message = [ '<div class="alert-icon icon-warning"></div>', '<label class="alert-small">', msg, '</label>' ].join("") ;
        bootbox.alert({size:"small", message:message, callback:callback});
    }

    function bootboxErrorAlert( msg, callback ){
        var message = [ '<div class="alert-icon icon-error"></div>', '<label class="alert-small">', msg, '</label>' ].join("") ;
        bootbox.alert({size:"small", message:message, callback:callback});
    }

    function bootboxInfoAlert( msg, callback ){
        var message = [ '<div class="alert-icon icon-logo"></div>', '<label class="alert-small">', msg, '</label>' ].join("") ;
        bootbox.alert({size:"small", message:message, callback:callback});
    }

    function bootboxBugAlert( msg, callback ){
        var message = [ '<div class="alert-icon icon-bug"></div>', '<label class="alert-small">', msg, '</label>' ].join("") ;
        bootbox.alert({size:"small", message:message, callback:callback});
    }


//  alerts.js (v1.0)
/*
    function bootboxSuccessAlert( msg ){
        var prefix = '<div class="alert-icon icon-success"></div><label class="alert-small">';
        var postfix = '</label>';
        var message =  [prefix, msg, postfix].join("") ;
        if (!bootbox) alert( msg );
        else bootbox.alert({size:"small", message: message});
    }

    function bootboxCancelAlert( msg ){
        var prefix = '<div class="alert-icon icon-cancel"></div><label class="alert-small">';
        var postfix = '</label>';
        var message =  [prefix, msg, postfix].join("") ;
        if (!bootbox) alert( msg );
        else bootbox.alert({size:"small", message: message});
    }

    function bootboxWarningAlert( msg ){
        var prefix = '<div class="alert-icon icon-warning"></div><label class="alert-small">';
        var postfix = '</label>';
        var message =  [prefix, msg, postfix].join("") ;
        if (!bootbox) alert( msg );
        else bootbox.alert({size:"small", message: message});
    }

    function bootboxErrorAlert( msg ){
        var prefix = '<div class="alert-icon icon-error"></div><label class="alert-small">';
        var postfix = '</label>';
        var message =  [prefix, msg, postfix].join("") ;
        if (!bootbox) alert( msg );
        else bootbox.alert({size:"small", message: message});
    }

    function bootboxInfoAlert( msg ){
        var prefix = '<div class="alert-icon icon-logo"></div><label class="alert-small">';
        var postfix = '</label>';
        var message =  [prefix, msg, postfix].join("") ;
        //if (!bootbox) alert( msg );
        else bootbox.alert({size:"small", message: message});
    }

    function bootboxBugAlert( msg ){
        var prefix = '<div class="alert-icon icon-bug"></div><label class="alert-small">';
        var postfix = '</label>';
        var message =  [prefix, msg, postfix].join("") ;
        if (!bootbox) alert( msg );
        else bootbox.alert({size:"small", message: message});
    }
*/
