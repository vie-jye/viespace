<template>
<div class="container">
    <div class="article glass-morphism">
        <div class="article-header">
            <div class="article-cover">
                <img :src="article.image">
            </div>
            <div class="article-title">
                <span>{{ article.title }}</span>
            </div>
        </div>
        <div class="article-content">
            <Viewer :value="article.content" :plugins="plugins" :zh="zh" />
        </div>
        <div class="article-footer">
            <div class="article-tags">
                <span v-for="tag in article.tags">#{{ tag }}</span>
            </div>
            <div class="article-info">
                <span>{{ article.articleType }}</span>
                <span>views: {{ article.views }}</span>
                <span>{{ handleShowCreatedDate(article.createTime) }}</span>
            </div>
        </div>
    </div>
    <HomeGotoTop />
</div>
</template>

<script setup lang="ts">
import { onMounted, defineProps, reactive, markRaw, toRefs } from 'vue';
import HomeGotoTop from '../home/HomeGotoTop.vue';
import axios from 'axios';
import moment from 'moment'
import 'highlight.js/styles/a11y-light.css'
import 'bytemd/dist/index.css' // 导入bytemd样式
import { Viewer } from '@bytemd/vue-next' // 导入bytemd编辑器
import gfm from '@bytemd/plugin-gfm' // 语法高亮
import gemoji from '@bytemd/plugin-gemoji' // 表情
import highlight from '@bytemd/plugin-highlight' // 代码高亮
import frontmatter from '@bytemd/plugin-frontmatter' // 解析前题
import mediumZoom from '@bytemd/plugin-medium-zoom' // 缩放图片
import breaks from '@bytemd/plugin-breaks' // 换行
import 'juejin-markdown-themes/dist/vuepress.min.css' // 主题
import zhHans from 'bytemd/locales/zh_Hans.json' // 中文语言包
import appConfig from "../../../appConfig";

// bytemd配置
const pluginList = [
    gfm(),
    gemoji(),
    highlight(),
    frontmatter(),
    mediumZoom(),
    breaks()
]
const state = reactive({
    plugins: markRaw(pluginList),
    zh: zhHans
})
const { plugins, zh } = toRefs(state)
const host = appConfig.host
const props = defineProps<{ id: number }>();

// 文章结构
type Article = {
    id: number,
    title: string,
    description: string,
    content: string,
    articleType: string,
    categoryId: number,
    category: string,
    createTime: number,
    tags: string[],
    views: number,
    image: string
}
let article = reactive({}) as Article

function getArticleDetail() {
    console.log(props.id)
    axios.get(host + `/app/article/detail/${props.id}`)
        .then(res => {
            console.log(res.data)
            res.data.tags = res.data.tags.split(',')
            Object.assign(article, res.data)
        })
        .catch(err => {
            console.log(err)
        })
}

function handleShowCreatedDate(createdDate: number) {
    return moment(createdDate * 1000).format('YYYY/MM/DD')
}

onMounted(() => {
    getArticleDetail()
})
</script>

<style scoped>
.container {
    margin-top: 100px;
    margin-bottom: 80px;
    box-sizing: border-box;
    width: 100vw;

    display: flex;
    justify-content: center;
}

.article {
    width: 80%;
    height: auto;
    box-sizing: border-box;
    overflow: hidden;
    border: 0;
    backdrop-filter: blur(10px);
}

.article .article-header {
    width: 100%;
    height: auto;
    position: relative;
}
.article .article-cover {
    width: 100%;
    height: 400px;
}

.article .article-cover>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.article .article-title {
    width: 100%;
    height: auto;
    line-height: 32px;
    font-size: 32px;
    font-weight: bold;
    color: var(--color-snow);
    background-color: var(--color-molv);
    padding: 20px 0;
    text-align: center;
    opacity: 0.9;
    position: absolute;
    bottom: 0;
}

.article .article-content {
    padding: 0 68px;
    margin-top: 30px;
}

.article .article-footer {
    margin: 60px 0;
    margin-bottom: 0;
    padding: 24px 0;
    background-color: var(--color-molv);
    opacity: 0.8;
}

.article-footer .article-tags {
    padding: 0 20px;
    color: var(--color-snow);
}

.article-footer .article-tags>span {
    margin-right: 14px;
}

.article-footer .article-info {
    padding: 0 20px;
    margin-top: 24px;
    color: var(--color-snow);
}

.article-footer .article-info>span {
    margin-right: 14px;
}

.article-footer .article-info>span:first-of-type {
    border: 1px solid white;
    padding: 1px 5px;
    border-radius: 10px;
}

@media screen and (max-width: 600px) {
    .container {
        margin-top: 60px;
    }

    .article {
        width: 100%;
    }

    .article .article-title {
        font-size: 24px;
    }

    .article .article-content {
        padding: 0 18px;
    }
}

@media screen and (min-width: 601px) and (max-width: 768px) {
    .container {
        margin-top: 80px;
    }

    .article {
        width: 85%;
    }

    .article .article-content {
        padding: 0 48px;
    }
}
</style>
