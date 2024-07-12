<template>
<main>
    <div class="nav">
        <div class="decoration-line">
            <div class="line line-one"></div>
            <div class="line line-two"></div>
        </div>
        <ul class="timeline" @click="clickTimeline" ref="timeline">
            <li class="date-year" v-for="item in yearList" :key="item">{{ item }}</li>
        </ul>
    </div>
    <ArticleSection :selectedYear="selectedYear" />
</main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ArticleSection from './articles/ArticleSection.vue'

let yearList = [2024, 2023, 2022, 2021, 2020, 2019, 2018]
let selectedYear = ref('2024')
const timeline = ref<HTMLElement | null>(null)

function clickTimeline(event: MouseEvent) {
    // 判断事件目标是否为date-yeaer
    if ((event.target as HTMLElement).classList.contains('date-year')) {
        // 点击年份时，将年份设置为当前选中的年份
        (event.target as HTMLElement).classList.add('date-year-active')
        const otherDateYears = getDateYearSibling(event.target as HTMLElement)
        otherDateYears.forEach(e => e.classList.remove('date-year-active'))

        // 将选中的年份设置到selectedYear属性中
        selectedYear.value = (event.target as HTMLElement).textContent as string;
        
        const index = yearList.indexOf(parseInt(selectedYear.value))
        if (index !== -1) {
            const yearsToMove = yearList.splice(index); // 截取选中年份及其后面的年份
            yearList = [...yearsToMove, ...yearList]; // 将截取的年份移到数组最前面
            (timeline.value as HTMLElement).scrollLeft = 0 // 将滚动条移动到最左边
        }
    }    
}
function getDateYearSibling(target: HTMLElement): HTMLElement[] {
    let timeline = target.parentElement as HTMLElement
    return Array.from(timeline.children).filter(e => e !== target && e.classList.contains('date-year')) as HTMLElement[]
}
</script>

<style scoped>
/* 页面主体 24栅格，内容区容器 */
main {
    min-height: 800px;
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    column-gap: 20px;
    padding: 0 34px;
}

.nav {
    position: absolute;
    width: 100%;
    margin-top: 30px;
    left: 0;

    display: grid;
    grid-template-columns: repeat(24, 1fr);
    column-gap: 20px;
}

.nav .decoration-line {
    grid-column: 1/-1;

    display: grid;
    grid-template-columns: repeat(24, 1fr);
    column-gap: 20px;
}

.decoration-line .line {
    background-color: var(--color-molv);
    height: 18px;
}

.decoration-line .line-one {
    grid-column: 1/2;
    min-width: 18px;
}

.decoration-line .line-two {
    grid-column: 4/-1;
}

.nav .timeline {
    grid-column: 2/4;
    position: absolute;
    top: -20px;
}

.timeline .date-year {
    font-size: 24px;
    font-weight: bold;
    color: white;
    margin-bottom: 45px;
    opacity: 0.5;
    background-color: var(--color-molv);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: rgba(255, 255, 255, 0.3);
    border-bottom-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
}
.timeline .date-year:hover {
    cursor: pointer;
}
.timeline .date-year:first-of-type {
    /* color: var(--color-molv); */
    font-size: 36px;
    opacity: 0.9;
}

.timeline .date-year:last-of-type {
    margin-bottom: 0;
}

/* 最小宽度 24*10 */
@media screen and (max-width: 460px) {
    main {
        column-gap: 10px;
    }
}

/* 内边距归零 */
@media screen and (max-width: 640px) {
    main {
        padding: 0 0;
    }
}

/* 调整导航年份横向布局 */
@media screen and (max-width: 767px) {
    .nav {
        align-items: center;
        column-gap: 0;
    }

    .nav .decoration-line {
        grid-row: 1/2;
        column-gap: 0;
    }

    .decoration-line .line-two {
        grid-column: 24/-1;
        min-width: 18px;
    }

    .nav .timeline {
        grid-row: 1/2;
        grid-column: 3/23;
        position: unset;
        display: flex;
        align-items: center;
        overflow-x: auto;
    }
    /* 隐藏滚动条 */
    .nav .timeline::-webkit-scrollbar {
        display: none;
    }

    .timeline .date-year {
        font-size: 24px;
        margin: 0;
        margin-right: 45px;
    }

    .timeline .date-year:first-of-type {
        /* color: transparent; */
        /* -webkit-text-stroke: 1px var(--color-molv); */
        font-size: 24px;
        opacity: 0.9;
    }

    .timeline .date-year:last-of-type {
        margin-right: 0;
    }

    .timeline .date-year.date-year-active {
        /* color: white; */
        font-size: 24px;
        /* opacity: 1; */
    }
}

@media screen and (min-width:768px) and (max-width: 1024px) {
    .decoration-line .line-two {
        grid-column: 5/-1;
    }
}
</style>