<template>
<div class="category glass-morphism">
    <ul class="cate">
        <li class="cate-item" v-for="item in category" :key="item.id" @mouseover="hoverCate" @mouseout="hoverOutCate" @click="clickCate(item.id)">
            {{ item.name }}
            <img class="cate-btn cate-btn-default" src="/src/assets/ui/cateGoto.svg" />
            <img class="cate-btn cate-btn-active" style="display: none" src="/src/assets/ui/cateGotoActive.svg"
                :class="cateHoverState" />
        </li>
    </ul>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from '@/router'
import { useAppState } from "@/store/appState"

let cateHoverState = ref('no-hover')
const category = [
    {
        id: 1,
        name: 'Programming',
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

function clickCate(id: number) {
    useAppState().setCate(id)
    router.push({ name: 'articles' })
}

function hoverCate(event: MouseEvent) {
    let cateItem = getCateItem(event.target as HTMLElement)
    const cateBtnDefault = cateItem.querySelector('.cate-btn-default') as HTMLElement
    const cateBtnActive = cateItem.querySelector('.cate-btn-active') as HTMLElement
    // cateHoverState.value = 'cate-hovered'
    cateBtnDefault.style.display = 'none'
    cateBtnActive.style.display = ''
}
function hoverOutCate(event: MouseEvent) {
    let cateItem = getCateItem(event.target as HTMLElement)
    const cateBtnDefault = cateItem.querySelector('.cate-btn-default') as HTMLElement
    const cateBtnActive = cateItem.querySelector('.cate-btn-active') as HTMLElement
    // cateHoverState.value = 'no-hover'
    cateBtnDefault.style.display = ''
    cateBtnActive.style.display = 'none'
}
function getCateItem(target: HTMLElement) {
    return getTargetClassElement(target, 'cate-item')
}

// Bug 修复：添加了参数 target 的类型
function getTargetClassElement(target: HTMLElement, className: String) {
    while (target) {
        // Bug 修复：将 String 类型转换为 string 类型，以确保类型安全
        if (target.classList.contains(className as string)) {
            break
        }
        target = target.parentElement as HTMLElement
    }
    return target
}
</script>

<style scoped>
.category {
    grid-column: 1/6;
    grid-row: 2/3;
    margin-top: 128px;
    background-color: rgba(37, 61, 36, 45%);
}

.category .cate {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
}

.category .cate .cate-item {
    color: white;
    font-size: 20px;
    font-weight: 300;
    padding: 10px 0;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.category .cate .cate-item:hover {
    /* color: var(--color-molv); */
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6);
    cursor: pointer;
}

@media screen and (max-width:768px) {
    .category {
        display: none;
    }
}

@media screen and (min-width:769px) and (max-width:992px) {
    .category {
        grid-column: 17/24;
        grid-row: 1/2;
        height: 300px;
        margin-top: 70px;
        box-sizing: border-box;
    }
}
</style>