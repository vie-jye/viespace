<template>
<main>
    <!--  个人介绍  -->
    <HomeProfile />
    <!--  社交平台  -->
    <HomeSocial />
    <!--  分类  -->
    <HomeCategory />
    <!--  主体版块  -->
    <HomeSection />
    <!--  返回顶部  -->
    <HomeGotoTop />
    <!-- 页脚 -->
</main>
</template>

<script setup lang="ts">
import HomeProfile from './home/HomeProfile.vue';
import HomeSocial from './home/HomeSocial.vue';
import HomeCategory from './home/HomeCategory.vue';
import HomeSection from './home/HomeSection.vue';
import HomeGotoTop from './home/HomeGotoTop.vue';
</script>

<style scoped>
/* 页面主体 24栅格，内容区容器 */
main {
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    column-gap: 20px;
    padding: 0 34px;
}

/* 最小宽度 24*10 */
@media screen and (max-width: 460px) {
    main {
        column-gap: 10px;
    }
}

/* 调整内边距，展示最多两篇文章 */
@media screen and (max-width: 529px) {
    main {
        padding: 0 0;
    }
}

/* 超大屏幕调整主体视觉 */
@media screen and (min-width:1440px) {
    main {
        padding: 0 68px;
    }
}
</style>
