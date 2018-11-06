let router = [
    {
        path: '/',
        component: () => import("../html/components/index.vue")
    },
    {
        //雪亮登录
        path: '/login',
        component: () => import("../html/components/login/login.vue")
    },
    {
        //监护搜索
        path: '/custody/search',
        component: () => import("../html/components/custody/search.vue")
    },

    {
        //监护搜索结果
        path: '/custody/search-result',
        component: () => import("../html/components/custody/search-result.vue")
    },

    {
        //监护一人一档
        path: '/custody/personRecord',
        component: () => import("../html/components/custody/person-record.vue")
    },
    {
        //监护一人一档
        path: '/custody/personRecord/:idCard/:personId',
        component: () => import("../html/components/custody/person-record.vue")
    },
    {
        path: '/test',
        component: () => import("../html/components/test/index.vue")
    },
    {
        path: '/test/echart-hello',
        component: () => import("../html/components/test/echart-hello.vue")
    },
    {
        path: '/test/echart-heatmap',
        component: () => import("../html/components/test/echart-heatmap.vue")
    },
    {
        path: '/test/ajax',
        component: () => import("../html/components/test/ajax.vue")
    },
    {
        //监护大屏
        path: '/custody/screen',
        component: () => import("../html/components/custody/screen.vue")
    },
    {
        //交通大屏
        path: '/traffic/screen',
        component: () => import("../html/components/traffic/screen.vue")
    },
    {
        //交通点位分析
        path: '/traffic/device-analysis/:id',
        component: () => import("../html/components/traffic/device-analysis.vue")
    },
    {
        //交通抓拍分析
        path: '/traffic/capture-analysis',
        component: () => import("../html/components/traffic/capture-analysis.vue")
    },
    {
        //警情分析
        path: '/traffic/warning-analysis',
        component: () => import("../html/components/traffic/warning-analysis.vue")
    },

];
module.exports = router;
