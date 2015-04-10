require.config({
    paths: {

        /* 插件类库
        ------------------------------------------------------------*/
        'handlebars': _requireUri(__uri('/resource/lib/handlebars/handlebars-v3.0.0.js')),
        'jquery.lazyload': _requireUri(__uri('/resource/lib/jquery.lazyload/jquery.lazyload.js')),
        'jquery.jqzoom': _requireUri(__uri('/resource/lib/jquery.jqzoom/jquery.jqzoom.js')),
        'jquery.mousewheel': _requireUri(__uri('/resource/lib/jquery.mousewheel/jquery.mousewheel.js')),
        'jquery.easing': _requireUri(__uri('/resource/lib/jquery.easing/jquery.easing.js')),

        /* 组件
        ------------------------------------------------------------*/
        'jquery.date.input': _requireUri(__uri('/resource/assets/widgets/jquery.date.input/jquery.date.input.js')),
        'jquery.scrollbox': _requireUri(__uri('/resource/assets/widgets/jquery.scrollbox/jquery.scrollbox.js')),
        'jquery.xui.masking': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.masking.js')),
        'jquery.xui.lock': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.lock.js')),
        'jquery.xui.fixed-window': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.fixed-window.js')),
        'jquery.xui.dialog': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.dialog.js')),
        'jquery.xui.placeholder': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.placeholder.js')),
        'jquery.xui.tabs': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.tabs.js')),
        'jquery.xui.check': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.check.js')),
        'jquery.xui.select': _requireUri(__uri('/resource/assets/widgets/jquery.xui/jquery.xui.select.js'))
    },

    shim: {
        'jquery.date.input': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.date.input/themes/default/jquery.date.input.css'))]
        },
        'jquery.scrollbox': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.scrollbox/themes/default/jquery.scrollbox.css'))]
        },
        'jquery.xui.lock': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.xui/themes/grey/jquery.xui.css'))]
        },
        'jquery.xui.fixed-window': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.xui/themes/grey/jquery.xui.css'))]
        },
        'jquery.xui.placeholder': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.xui/themes/grey/jquery.xui.css'))]
        },
        'jquery.xui.tabs': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.xui/themes/grey/jquery.xui.css'))]
        },
        'jquery.xui.check': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.xui/themes/grey/jquery.xui.css'))]
        },
        'jquery.xui.select': {
            deps: ['css!' + _requireUri(__uri('/resource/assets/widgets/jquery.xui/themes/grey/jquery.xui.css'))]
        }
    },

    // 加载requirejs插件(对于给定的模块前缀，使用一个不同的模块ID来加载该模块，如下第一个配置说明对所有css前缀的模块使用指定的插件来加载))
    map: {
        '*': {
            'css': _requireUri(__uri('/resource/lib/requirejs/css/css.js')) + '.js',
            'text': _requireUri(__uri('/resource/lib/requirejs/text/text.js')) + '.js'
        }
    }
});

function _requireUri (url) {
    return url.replace(/\.js|\.css|\.html/g, '');
}

function __uri (url) {
    return url;
}
