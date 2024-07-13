<template>
<div class="section glass-morphism" v-for="(homeArticle, sectionIndex) in homeArticles" :key="sectionIndex">
    <!-- 版块头部 -->
    <div class="section-head">
        <!-- 版块分类 -->
        <div class="section-cate">
            <span class="cate-title">{{ homeArticle.category }}</span>
            <div class="more-btn" @click="clickCate(homeArticle.categoryId)"></div>
        </div>
        <!-- 分页 -->
        <div class="section-page" :class="pageBoundary(homeArticle.total)">
            <div class="page-previous-btn" @click="pagePrevious(sectionIndex)"></div>
            <div class="separator"></div>
            <div class="page-next-btn" @click="pageNext(sectionIndex)"></div>
        </div>
    </div>
    <!-- 版块文章 -->
    <div class="section-article" @mouseover="hoverArticle" @mouseout="hoverOutArticle" @click="clickArticle(item.id)"
        v-for="item in homeArticle.pageArticles" :key="item.id">
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
                <div class="article-desc">
                    <p>{{ item.description }}</p>
                </div>
                <div class="article-info">
                    <span>{{ item.articleType }}</span>
                    <span><i class="iconfont">&#xe8bf;</i> {{ item.views }}</span>
                    <span>{{ handleShowCreatedDate(item.createTime) }}</span>
                </div>
            </div>
            <div class="article-detail-btn">
                <img src="../../../assets/ui/goto.svg" /> 
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, onUnmounted } from "vue";
import axios from "axios"
import moment from 'moment'
import appConfig from '../../../appConfig'
import { useAppState } from "../../../store/appState";
import router from "../../../router";

const host = appConfig.host
let boundary = ref(window.innerWidth < 660 ? 2 : window.innerWidth > 1220 ? 4 : 3)
type Article = {
    id: number,
    title: string,
    description: string,
    content: string,
    articleType: string,
    categoryId: number,
    category: string,
    createdTime: number,
    tags: string,
    views: number,
    image: string
}
// @ts-ignore
type HomeArticle = {
    'featured': Article[],
    'programming': Article[],
    'devLogs': Article[],
    'travelogue': Article[],
    'poetry': Article[],
    'photography': Article[]
}
// const featuredArticles = {
//     category: 'Featured Articles',
//     cateType: 'featured',
//     total: 4,
//     articles: [
//         {
//             id: 1,
//             title: 'From customizing images to setting up service deployment architecture',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             views: 99,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8c96600e.jpeg'
//         },
//         {
//             id: 2,
//             title: 'This is a jasmine flower that blooms in the deep night',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             views: 66,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d78faf009.jpg'
//         },
//         {
//             id: 3,
//             title: 'A cat that I missed while traveling',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             views: 88,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8cba2953.jpeg'
//         },
//         {
//             id: 4,
//             title: '良此宵月，寂如斯',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             views: 9,
//             image: 'https://img.picui.cn/free/2024/07/02/6683d8c9960e0.jpeg'
//         }
//     ]
// }
// const programmingArticles = {
//     category: 'Programming Tech',
//     cateType: 'programming',
//     total: 1,
//     articles: [
//         {
//             id: 1,
//             title: 'From customizing images to setting up service deployment architecture',
//             description: 'Introduction: This article will start by examining what a poor deployment architecture looks like from the perspective of a cumbersome deployment architecture, its drawbacks, and the risks it brings. Then, we will gradually explain the implementation ideas and processes from customizing a common service image to setting up a service deployment architecture. Finally, from the perspective of architectural development, we will complete the implementation of service rolling updates.',
//             articleType: 'original',
//             createdDate: 'July 25, 2023',
//             views: 99,
//             image: 'https://rqaadaviiwfwecvebqgh.supabase.co/storage/v1/object/public/space/image_thumbnail/IMG_20201004_105338-01.jpeg'
//         }
//     ]
// }
let homeArticles = reactive([]) as any

// 获取首页文章
function getHomeArticles() {
    axios.get(host + '/app/article/homeList', { params: { flag: 1 } })
        .then(res => {
            const data = res.data
            console.log(data)
            for (let cate in data) {
                if (data[cate].length > 0) {
                    const article = {
                        category: toSectionCategory(cate),
                        categoryId: data[cate][0].categoryId,
                        cateType: cate,
                        total: data[cate].length,
                        articles: data[cate]
                    }
                    if (cate === 'featured') {
                        article.categoryId = 0
                        homeArticles.unshift(article)
                    } else {
                        homeArticles.push(article)
                    }
                }
            }
            handlePageArticle(boundary.value)
        })
        .catch(err => {
            console.log(err)
        })
}
// 跳转获取文章详情
function clickArticle(id: number) {
    router.push({ name: 'article-detail', params: { id: id } })
}
// 跳转文章列表
function clickCate(id: number) {
    useAppState().setCate(id)
    router.push({ name: 'articles' })
}

function toSectionCategory(cate: string) {
    return cate === 'featured' ? 'Featured Articles' : cate === 'programming' ? 'Programming Tech' : cate === 'devLogs' ? 'Dev Logs' : cate === 'travelogue' ? 'Travelogue' : cate === 'poetry' ? 'Poetry' : cate === 'photography' ? 'Photography' : 'Other'
}
function pageBoundary(total: number) {
    return total > boundary.value ? 'out-boundary' : 'in-boundary'
}
function handleResize() {
    if (window.innerWidth > 1220) {
        boundary.value = 4;
    } else if (window.innerWidth < 660) {
        boundary.value = 2;
    } else {
        boundary.value = 3;
    }
}
function handleShowCreatedDate(createdDate: number) {
    return moment(createdDate * 1000).format('YYYY/MM/DD')
}

function hoverArticle(event: MouseEvent) {
    const sectionArticle = getSectionArticle(event.target as HTMLElement)
    const otherArticles = getSectionArticleSibling(sectionArticle)
    const articleMask = sectionArticle.querySelector('.article-mask') as HTMLElement
    const articleShow = sectionArticle.querySelector('.article-show') as HTMLElement
    sectionArticle.classList.add('article-hovered')
    articleMask.classList.add('article-hovered')
    articleShow.classList.add('article-hovered')
    otherArticles.forEach(e => e.style.display = 'none')

}
function hoverOutArticle(event: MouseEvent) {
    let sectionArticle = getSectionArticle(event.target as HTMLElement)
    const otherArticles = getSectionArticleSibling(sectionArticle)
    const articleMask = sectionArticle.querySelector('.article-mask') as HTMLElement
    const articleShow = sectionArticle.querySelector('.article-show') as HTMLElement
    sectionArticle.classList.remove('article-hovered')
    articleMask.classList.remove('article-hovered')
    articleShow.classList.remove('article-hovered')
    otherArticles.forEach(e => e.style.display = '')
}
function getSectionArticle(target: HTMLElement): HTMLElement {
    return getTargetClassElement(target, 'section-article')
}
function getSectionArticleSibling(target: HTMLElement): HTMLElement[] {
    let section = target.parentElement as HTMLElement
    return Array.from(section.children).filter(e => e !== target && e.classList.contains('section-article')) as HTMLElement[]
}
function getTargetClassElement(target: HTMLElement, className: string) {
    while (target) {
        if (target.classList.contains(className)) {
            break
        }
        target = target.parentElement as HTMLElement
    }
    return target
}

// 分页点击事件处理
function pagePrevious(sectionIndex: number) {
    const bnd = boundary.value
    const a = homeArticles[sectionIndex]
    if (a.total <= bnd) return

    const temp = [].concat(a.pageArticles)
    a.articlePointer = a.articlePointer - 1 < 0 ? a.articles.length - 1 : a.articlePointer - 1
    for (let i = 0; i < bnd; i++) {
        if (i === 0) {
            a.pageArticles[i] = a.articles[a.articlePointer]
        } else {
            a.pageArticles[i] = temp[i - 1]
        }
    }
}
function pageNext(sectionIndex: number) {
    const bnd = boundary.value
    const a = homeArticles[sectionIndex]
    if (a.total <= bnd) return

    const temp = [].concat(a.pageArticles)
    a.articlePointer = a.articlePointer + 1 > a.articles.length - 1 ? 0 : a.articlePointer + 1
    for (let i = 0; i < bnd; i++) {
        if (i === bnd - 1) {
            // articlePointer=1, 1+ 2 =3, a.articles[3]
            // articlePointer=2, 2+ 2 =4 -4, a.articles[0]
            // articlePointer=3, 3+ 2 =5 -4, a.articles[1]
            // articlePointer=0, 0+ 2 =2, a.articles[2]
            let offset = a.articlePointer + (bnd - 1)
            let x = offset >= a.articles.length ? offset - a.articles.length : offset
            a.pageArticles[i] = a.articles[x]
        } else {
            a.pageArticles[i] = temp[i + 1]
        }
    }
}

function handlePageArticle(boundaryValue: number) {
    homeArticles.forEach((e: any) => {
        e.pageArticles = []
        e.articlePointer = 0
        if (e.total > boundaryValue) {
            for (let i = 0; i < boundaryValue; i++) {
                e.pageArticles[i] = e.articles[i]
            }
        } else {
            for (let i = 0; i < e.articles.length; i++) {
                e.pageArticles[i] = e.articles[i]
            }
        }
    })
}
// 监听分页边界，根据边界展示最大边界数量的文章
watch(boundary, (boundaryValue, _) => {
    handlePageArticle(boundaryValue)
}, { immediate: true })

// 监听窗口变化，处理分页边界响应式
onMounted(() => {
    getHomeArticles()
    window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
    window.removeEventListener('resize', handleResize); // 组件卸载时移除 resize 事件监听
});
</script>

<style scoped>
.glass-morphism {
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.25);
}

/* 内容版块，占7-23栅格 */
/* 内容版块，内部划分 4栅格 */
/* 横向栅格划分 2栅格，分别给 section-head 0px, section-article 1fr */
.section {
    height: 330px;
    background-color: rgba(255, 255, 255, 0.3);
    margin-top: 70px;
    box-sizing: border-box;
    grid-column: 7/24;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 34px;
    grid-template-rows: 0 1fr;
    padding: 0 32px;
}

.section .section-head {
    grid-column: 1/-1;
    /* 占满 grid */
    position: relative;
    top: -16px;

    display: flex;
    justify-content: space-between;
}

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
    background-image: url("src/assets/ui/getAll.svg");
}

.section-cate .more-btn:hover {
    cursor: pointer;
}

.section-cate .more-btn:active {
    background-color: var(--color-youlv);
    cursor: pointer;
}

.section-head .section-page {
    display: flex;
}

.section-page .page-previous-btn {
    width: 32px;
    height: 32px;
    background-color: var(--color-molv);
    background-image: url("src/assets/ui/previous.svg");
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
    background-image: url("src/assets/ui/next.svg");
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

.section .section-article {
    height: 270px;
    background-color: lightgray;
    border-radius: 20px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 50%);
    margin: auto 0;
    overflow: hidden;
    position: relative;
}

.section-article .article-cover {
    width: 100%;
    height: 270px;
    border-radius: 20px;
    object-fit: cover;
    /* 图片等比例适配 */
}

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
    grid-column: 1/-1;
    /* 占满 grid */
    background-color: rgba(37, 61, 36, 45%);

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 34px;
    cursor: pointer;
}

.article-mask.article-hovered {
    display: none;
}

.section-article .article-show {
    grid-column: 2/-1;

    height: 270px;
    padding-left: 10px;
    position: relative;
}

.article-show .article-preview {
    height: 100%;
    box-sizing: border-box;
    padding-top: 25px;
    margin-right: 80px;
    position: relative;
}

.article-preview .article-title {
    padding-bottom: 5px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
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
    -webkit-line-clamp: 2;
}

.article-preview .article-desc {
    margin-top: 10px;
    color: white;
    font-size: 16px;
    line-height: 1.3em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
}

.article-preview .article-info {
    color: white;
    opacity: 0.8;
    font-size: 14px;
    line-height: 1.6em;
    position: absolute;
    bottom: 15px;
}

.article-preview .article-info>span {
    margin-right: 20px;
}

.article-preview .article-info>span:first-of-type {
    border: 1px solid var(--color-molv);
    padding: 1px 10px;
    border-radius: 10px;
}

.article-preview .article-info>span:last-of-type {
    margin-right: 0;
}

.article-show .article-detail-btn {
    width: 43px;
    height: 43px;
    position: absolute;
    right: 18px;
    bottom: 18px;
}

/* 占满栅格 */
@media screen and (max-width: 768px) {
    .section {
        grid-column: 1/-1;
    }
}

/* 留出最后一格，让出 gotoTop 位置 */
@media screen and (min-width: 769px) and (max-width:992px) {
    .section {
        grid-column: 1/24;
    }
}

/* 调整内边距，展示最多两篇文章 */
@media screen and (max-width: 529px) {
    .section {
        width: 100vw;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 20px;
        padding: 0 20px;
    }

    .section-article.article-hovered {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 10px;
    }

    .article-show .article-preview {
        padding-top: 20px;
        margin-right: 54px;
    }

    .article-preview .article-info {
        bottom: 10px;
    }

    .article-show .article-detail-btn {
        right: 10px;
        bottom: 10px;
    }
}

/* 展示最多两篇文章 */
@media screen and (min-width: 530px) and (max-width: 660px) {
    .section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 34px;
    }

    .section-article.article-hovered {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 10px;
    }

    .section-article .article-show {
        grid-column: 2/-1;
    }

    .article-show .article-preview {
        padding-top: 20px;
        margin-right: 54px;
    }

    .article-preview .article-info {
        bottom: 10px;
    }

    .article-show .article-detail-btn {
        right: 10px;
        bottom: 10px;
    }
}

/* 展示最多三篇文章 */
@media screen and (min-width: 660px) and (max-width: 1220px) {
    .section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 34px;
    }

    .section-article.article-hovered {
        grid-template-columns: repeat(3, 1fr);
    }

    .section-article .article-show {
        grid-column: 2/-1;
    }
}
</style>