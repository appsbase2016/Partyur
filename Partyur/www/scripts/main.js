requirejs.config({
    //By default load any module IDs from js/lib
    shim: {
        'jquery': {
            exports: '$'
        },
        'moment': {
            exports: 'moment'
        },
        'moment-twitter': {
            deps: ['moment']
        },
        'bootstrap':
        {
            deps: ['jqueryUi']
        }
    },
    baseUrl: 'scripts',
    config: {
        //l20nCtx: {
        //    extension: "l20n",
        //    locale: "en",
        //    debug: true
        //}
    },
    paths: {
        "moment": "../bower_components/moment/moment",
        "moment-twitter": "../bower_components/moment.twitter/moment-twitter",
    },
    waitSeconds: 60
});
