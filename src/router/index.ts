// 引入 createRouter
import { createRouter, createWebHistory } from "vue-router";
// 引入路由组件
import AppHome from '@/components/main/AppHome.vue';
import AppArticles from '@/components/main/AppArticles.vue';
import ArticleDetail from "@/components/main/articles/ArticleDetail.vue";

const router = createRouter({
    // 路由器工作模式
    history: createWebHistory(),
    routes: [
        {
            name: 'home',
            path: '/home',
            component: AppHome
        },
        {
            name: 'articles',
            path: '/articles',
            component: AppArticles
        },
        {
            name: 'about',
            path: '/articles/detail/:id',
            component: ArticleDetail,
            props: true
        },
        {
            name: 'article-detail',
            path: '/articles/detail/:id',
            component: ArticleDetail,
            props: true
        },
        {
            path: '/',
            redirect: '/home'
        }
    ]
});

// 全局前置守卫
// @ts-ignore
router.beforeEach((to, from, next) => {
    // 在每次路由切换前将页面滚动到顶部
    window.scrollTo(0, 0);
    next();
});

export default router;