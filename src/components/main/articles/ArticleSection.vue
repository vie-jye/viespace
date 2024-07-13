<template>
<div class="section glass-morphism" v-for="(homeArticle, index) in homeArticles" :key="index">
    <!-- 版块头部 -->
    <div class="section-head">
        <!-- 版块分类 -->
        <div class="section-cate">
            <span class="cate-title">{{ homeArticle.category }}</span>
            <div class="more-btn" @click="clickMoreBtn"></div>
            <!-- 分类列表/项 -->
            <div class="cate-expand" :class="cateExpandState">
                <ul class="cate-list">
                    <li class="cate-item" v-for="(item, index) in category" :key="index" @click="handleClickCate(item.id)">{{ item.name }}</li>
                </ul>
            </div>
        </div>
        <!-- 分页 -->
        <div class="section-page" :class="pageBoundary(homeArticle.total)">
            <div class="page-previous-btn" @click="pagePrevious()"></div>
            <div class="separator"></div>
            <div class="page-next-btn" @click="pageNext()"></div>
        </div>
    </div>
    <!-- 版块文章 -->
    <div class="section-article" @mouseover="hoverArticle" @mouseout="hoverOutArticle" @click="clickArticle(item.id)"
        v-for="item in homeArticle.articles" :key="item.id">
        <!-- 文章封面 -->
        <img class="article-cover" :src="item.image" />
        <!-- 文章封面遮罩 -->
        <div class="article-mask">
            <div class="article-title">
                <p>{{ item.title }}</p>
            </div>
        </div>
        <!-- 文章 hover 时显示信息 -->
        <div class="article-show">
            <div class="article-preview">
                <div class="article-title">
                    <p>{{ item.title }}</p>
                </div>
                <div class="article-tags">
                    <span v-for="tag in item.tags.split(',')">#{{ tag }}</span>
                </div>
                <div class="article-info">
                    <span>{{ handleShowArticleType(item.articleType) }}</span>
                    <span>{{ handleShowCreatedDate(item.createTime) }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="section-bottom"></div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import router from '../../../router';
import axios from "axios";
import moment from 'moment'
import appConfig from "../../../appConfig";
import { useAppState } from "../../../store/appState"

const props = defineProps(['selectedYear'])
let cateExpandState = ref('')
let collapseCate = true
let boundary = ref(10)
const host = appConfig.host
const category = [
    {
        id: 0,
        name: 'All Articles'
    },
    {
        id: 1,
        name: 'Programming Tech',
        title: '编程技术'
    },
    {
        id: 2,
        name: 'Dev Logs',
        title: '开发日志'
    },
    {
        id: 3,
        name: 'Essay',
        title: '随笔'
    },
    {
        id: 4,
        name: 'Travelogue',
        title: '游记'
    },
    {
        id: 5,
        name: 'Poetry',
        title: '诗歌'
    },
    {
        id: 6,
        name: 'Photography',
        title: '摄影'
    }
]
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
    tags: string,
    views: number,
    image: string
}
// 分页文章结构
type PageArticles = {
    total: number,
    list: Article[],
    pageNum: number,
    pages: number,
    size: number,
    hasNextPage: boolean
}
// 展示文章结构
type ShowingArticles = {
    category: string,
    categoryId: number,
    total: number,
    pageNum: number,
    hasNextPage: boolean,
    articles: Article[]
}
type QueryParams = {
    startYear: number,
    endYear: number,
    categoryId: number,
    page: number,
    pageSize: number
}
const queryParams = {
    startYear: moment('2024').startOf('year').unix(),
    endYear: moment('2024').endOf('year').unix(),
    categoryId: useAppState().getCate() || 0,
    page: 1,
    pageSize: boundary.value
} as QueryParams
// const showingArticles = {
//     category: 'All Articles',
//     categoryId: 0,
//     total: 6,
//     articles: [
//         {
//             id: 1,
//             title: 'From customizing images to setting up service deployment architecture',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             tags: ['Backend', 'Docker', 'Shell', 'Nginx', 'Deployment', 'Server'],
//             category: 'Programming Tech',
//             views: 99,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8c96600e.jpeg'
//         },
//         {
//             id: 2,
//             title: 'This is a jasmine flower that blooms in the deep night',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             tags: ['Eassy', 'Photograph'],
//             category: 'Eassy',
//             views: 66,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d78faf009.jpg'
//         },
//         {
//             id: 3,
//             title: 'A cat that I missed while traveling',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             tags: ['Travelogue', 'Cat'],
//             category: 'Travelogue',
//             views: 88,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8cba2953.jpeg'
//         },
//         {
//             id: 4,
//             title: '良此宵月，寂如斯',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             tags: ['Poetry'],
//             category: 'Poetry',
//             views: 9,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8c9960e0.jpeg'
//         },
//         {
//             id: 5,
//             title: '云南民族的织布',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             tags: ['Photograph'],
//             category: 'Travelogue',
//             views: 9,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8cb0e51f.jpeg'
//         },
//         {
//             id: 6,
//             title: '云南民族的织布',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             tags: ['Docker', 'Shell', 'Nginx'],
//             category: 'Travelogue',
//             views: 9,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8cb0e51f.jpeg'
//         },
//     ]
// }

const homeArticles = reactive([]) as ShowingArticles[]

// 获取文章列表
function getArticles() {
    axios.get(host + '/app/article/list', { params: queryParams })
        .then(res => {
            const data = res.data as PageArticles
            console.log(data)
            const showingArticles = {
                category: queryParams.categoryId !== 0 ? data.list[0].category : 'All Articles',
                categoryId: queryParams.categoryId !== 0 ? data.list[0].categoryId : 0,
                total: data.total,
                pageNum: data.pageNum,
                hasNextPage: data.hasNextPage,
                articles: data.list
            } as ShowingArticles
            homeArticles.splice(0);
            homeArticles.push(showingArticles)
        })
        .catch(err => {
            console.log(err)
        })
}
// 跳转获取文章详情
function clickArticle(id: number) {
    router.push({ name: 'article-detail', params: { id: id } })
}

// 展开或收起分类列表
function clickMoreBtn() {
    if (collapseCate) {
        collapseCate = false
        cateExpandState.value = 'cate-state-expand'
    } else {
        collapseCate = true
        cateExpandState.value = 'cate-state-collapse'
    }
}
function pageBoundary(total: number) {
    return total > boundary.value ? 'out-boundary' : 'in-boundary'
}

function hoverArticle(event: MouseEvent) {
    const sectionArticle = getSectionArticle(event.target as HTMLElement)
    // const otherArticles = getSectionArticleSibling(sectionArticle)
    const articleMask = sectionArticle.querySelector('.article-mask') as HTMLElement
    const articleShow = sectionArticle.querySelector('.article-show') as HTMLElement
    sectionArticle.classList.add('article-hovered')
    articleMask.classList.add('article-hovered')
    articleShow.classList.add('article-hovered')
    // otherArticles.forEach(e => e.style.display = 'none')

}
function hoverOutArticle(event: MouseEvent) {
    let sectionArticle = getSectionArticle(event.target as HTMLElement)
    // const otherArticles = getSectionArticleSibling(sectionArticle)
    const articleMask = sectionArticle.querySelector('.article-mask') as HTMLElement
    const articleShow = sectionArticle.querySelector('.article-show') as HTMLElement
    sectionArticle.classList.remove('article-hovered')
    articleMask.classList.remove('article-hovered')
    articleShow.classList.remove('article-hovered')
    // otherArticles.forEach(e => e.style.display = '')
}
function getSectionArticle(target: HTMLElement): HTMLElement {
    return getTargetClassElement(target, 'section-article')
}
// function getSectionArticleSibling(target: HTMLElement): HTMLElement[] {
//     let section = target.parentElement as HTMLElement
//     return Array.from(section.children).filter(e => e !== target && e.classList.contains('section-article')) as HTMLElement[]
// }
function getTargetClassElement(target: HTMLElement, className: string) {
    while (target) {
        if (target.classList.contains(className)) {
            break
        }
        target = target.parentElement as HTMLElement
    }
    return target
}

// 分类点击事件处理
function handleClickCate(categoryId: number) {
    queryParams.categoryId = categoryId
    queryParams.page = 1
    getArticles()
    collapseCate = true
    cateExpandState.value = 'cate-state-collapse'
}
// 分页点击事件处理
function pagePrevious() {
    if (homeArticles[0].pageNum > 1) {
        queryParams.page = homeArticles[0].pageNum - 1
        getArticles()
    }
}
function pageNext() {
    if (homeArticles[0].hasNextPage) {
        queryParams.page = homeArticles[0].pageNum + 1
        getArticles()
    }
}

// 响应式处理，文章展示数据
function handleShowArticleType(articleType: string) {
    if (window.innerWidth < 1440) {
        if (articleType === 'original') {
            articleType = 'orig.'
        }
    }
    return articleType
}
function handleShowCreatedDate(createdDate: number) {
    if (window.innerWidth < 1440) {
        // createdDate = createdDate
        //     .replace('January', 'Jan.')
        //     .replace('February', 'Feb.')
        //     .replace('March', 'Mar.')
        //     .replace('April', 'Apr.')
        //     .replace('May', 'May')
        //     .replace('June', 'Jun.')
        //     .replace('July', 'Jul.')
        //     .replace('August', 'Aug.')
        //     .replace('September', 'Sep.')
        //     .replace('October', 'Oct.')
        //     .replace('November', 'Nov.')
        //     .replace('December', 'Dec.')
    }
    return moment(createdDate * 1000).format('YYYY/MM/DD')
}
watch(() => props.selectedYear, (newVal) => {
    queryParams.startYear = moment(newVal).startOf('year').unix()
    queryParams.endYear = moment(newVal).endOf('year').unix()
    queryParams.page = 1
    getArticles()
})

// function handleResize() {
// }

// 监听窗口变化，处理响应式
onMounted(() => {
    getArticles()
    // window.addEventListener('resize', handleResize);
});
</script>

<style scoped>
.glass-morphism {
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.25);
}

/* 内容版块，占4-23栅格 */
/* 内容版块，内部划分 5栅格 */
/* 横向栅格划为 section-head 0, section-article autofill, 留白*/
.section {
    background-color: rgba(255, 255, 255, 0.3);
    margin-top: 100px;
    box-sizing: border-box;
    grid-column: 4/24;

    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 34px;
    /* section-head section-article 留白 */
    display: grid;
    grid-template-rows: 0 autofill 0;
    row-gap: 28px;
    padding: 0 34px;
}

/* 文章区块头样式 */
.section .section-head {
    /* 占满 grid */
    grid-column: 1/-1;
    position: relative;
    top: -16px;
    /* 高度为0，网格中才不占高度 */
    height: 0;

    display: flex;
    justify-content: space-between;
}

/* 分类区块样式 */
.section-head .section-cate {
    height: 32px;
    background-color: var(--color-molv);
    font-size: 20px;
    line-height: 32px;
    /* 与 height 一样，实现文本垂直居中 */
    color: white;
    display: flex;
}

.section-cate .cate-title {
    padding: 0 15px;
}

.section-cate .more-btn {
    width: 32px;
    height: 32px;
    background-color: var(--color-molv);
    border-left: 3px solid #B0C0A0;
    background-image: url("/src/assets/ui/expand.svg");
}

.section-cate .more-btn:hover {
    cursor: pointer;
}

.section-cate .more-btn:active {
    background-color: var(--color-youlv);
    cursor: pointer;
}

/* 分类列表样式 */
.section-cate .cate-expand {
    position: absolute;
    top: 32px;
    z-index: 1;
    border: 0;

    /* 下拉菜单过渡 */
    display: grid;
    transition-duration: 0.2s;
    transition-property: border, grid-template-rows;
    overflow: hidden;
    grid-template-rows: 0fr;
}

/* 分类列表展开样式 */
.section-cate .cate-state-expand {
    grid-template-rows: 1fr;
    border-top: 3px solid #B0C0A0;
}

.section-cate .cate-expand .cate-list {
    min-height: 0;
    color: white;
    font-size: 20px;
    background-color: var(--color-molv);
}

.section-cate .cate-expand .cate-list .cate-item {
    padding: 5px 15px;
}

.section-cate .cate-expand .cate-list .cate-item:hover {
    background-color: var(--color-youlv);
    cursor: pointer;
}

/* 分页按钮样式 */
.section-head .section-page {
    display: flex;
}

.section-page .page-previous-btn {
    width: 32px;
    height: 32px;
    background-color: var(--color-molv);
    background-image: url("/src/assets/ui/previous.svg");
}

.section-page.in-boundary .page-previous-btn {
    background-color: #808879;
}

.section-page.out-boundary .page-previous-btn:hover {
    cursor: pointer;
}

.section-page.out-boundary .page-previous-btn:active {
    background-color: var(--color-youlv);
    cursor: pointer;
}

.section-page .page-next-btn {
    width: 32px;
    height: 32px;
    background-color: var(--color-molv);
    background-image: url("/src/assets/ui/next.svg");
}

.section-page.in-boundary .page-next-btn {
    background-color: #808879;
}

.section-page.out-boundary .page-next-btn:hover {
    cursor: pointer;
}

.section-page.out-boundary .page-next-btn:active {
    background-color: var(--color-youlv);
    cursor: pointer;
}

.section-page .separator {
    width: 3px;
    height: 32px;
    background-color: #B0C0A0;
}

/* 版块文章样式 */
.section .section-article {
    height: 270px;
    background-color: lightgray;
    border-radius: 20px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 50%);
    /* margin: auto 0; */
    overflow: hidden;
    position: relative;
}

.section-article .article-cover {
    width: 100%;
    height: 270px;
    border-radius: 20px;
    /* 图片等比例适配 */
    object-fit: cover;
}

/* 文章遮罩 */
.section-article .article-mask {
    width: 100%;
    height: 100px;
    background-image: linear-gradient(to bottom, #00000011, #00000033);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    position: absolute;
    bottom: 0;
    backdrop-filter: blur(5px);

    display: flex;
    align-items: center;

    /* 过渡 */
    transition-duration: 0.3s;
    transition-property: height;
}

.article-mask .article-title {
    padding: 15px 15px;
}

/* 文本超出3行，溢出省略 */
.article-mask .article-title>p {
    color: white;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}

.section-article.article-hovered {
    cursor: pointer;
}

.article-mask.article-hovered {
    height: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.article-mask.article-hovered .article-title {
    display: none;
}

.section-article .article-show {
    /* 隐藏 */
    height: 0;
    width: 0;
    overflow: hidden;
}

.section-article .article-show.article-hovered {
    /* 显示 */
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
}

.article-show .article-preview {
    height: 100%;
    box-sizing: border-box;
    padding-top: 20px;
    padding-left: 12px;
    padding-right: 12px;
    position: relative;
    ;
}

.article-preview .article-title {
    font-size: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.article-preview .article-title>p {
    color: white;
    font-size: 20px;
    font-weight: bold;
    line-height: 1.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
}

.article-preview .article-tags {
    margin-top: 5px;
    color: white;
    font-size: 14px;
    line-height: 1.5em;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    max-height: 3em;
}

.article-preview .article-tags>span {
    margin-right: 5px;
}

.article-preview .article-info {
    color: white;
    opacity: 0.8;
    font-size: 14px;
    line-height: 1.6em;
    box-sizing: border-box;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    /* 绝对定位，并实现居中 */
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 10px;
    /* 弹性布局 */
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.article-preview .article-info>span {
    margin-right: 10px;
}

.article-preview .article-info>span:first-of-type {
    border: 1px solid white;
    padding: 1px 5px;
    border-radius: 10px;
}

.article-preview .article-info>span:last-of-type {
    margin-right: 0;
}

/* section底部留白 */
.section .section-bottom {
    grid-column: 1/-1;
}

@media screen and (max-width: 529px) {
    .section {
        grid-column: 1/-1;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 20px;
        padding: 0 20px;
    }
}

/* 内边距归零 横向2 */
@media screen and (min-width: 530px) and (max-width: 640px) {
    .section {
        grid-column: 1/-1;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 48px;
        padding: 0 48px;
    }
}

/* 占满栅格 横向3 */
@media screen and (min-width: 641px) and (max-width: 700px) {
    .section {
        grid-column: 1/-1;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 20px;
        padding: 0 20px;
    }
}

/* 占满栅格 横向3 */
@media screen and (min-width: 701px) and (max-width: 767px) {
    .section {
        grid-column: 1/-1;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 34px;
        padding: 0 34px;
    }
}

/* 横向3 */
@media screen and (min-width: 768px) and (max-width: 820px) {
    .section {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 34px;
        padding: 0 34px;
    }
}

/* 横向3 */
@media screen and (min-width: 821px) and (max-width: 910px) {
    .section {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 34px;
        padding: 0 34px;
    }
}

/* 横向3 */
@media screen and (min-width: 911px) and (max-width: 992px) {
    .section {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 48px;
        padding: 0 56px;
    }
}

/* 横向4 */
@media screen and (min-width: 993px) and (max-width: 1100px) {
    .section {
        grid-template-columns: repeat(4, 1fr);
        column-gap: 24px;
        padding: 0 24px;
    }
}

/* 横向4 */
@media screen and (min-width: 1101px) and (max-width: 1200px) {
    .section {
        grid-template-columns: repeat(4, 1fr);
        column-gap: 40px;
        padding: 0 40px;
    }
}

/* 横向5 */
@media screen and (min-width: 1201px) and (max-width: 1290px) {
    .section {
        column-gap: 20px;
        padding: 0 20px;
    }

}
</style>