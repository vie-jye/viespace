<template>
<div class="goto-top" @mouseover="showActiveBtn" @mouseout="hideActiveBtn" @click="doGotoTop" ref="gotoTop">
    <img class="top-btn-default" src="/src/assets/ui/gotoTop.svg" />
    <img class="top-btn-active" style="display: none" src="/src/assets/ui/gotoTopActive.svg" />
</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const gotoTop = ref(null) as any;

let scrollTimeout = 0;
function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        gotoTop.value.style.display = ifShowGotoTop() ? '' : 'none';
    }, 200);
}
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    gotoTop.value.style.display = ifShowGotoTop() ? '' : 'none';
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

function ifShowGotoTop() { 
    // Bug 修复：将 window.pageYOffset 修改为 window.scrollY
    let pageTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    return pageTop > 100;
}
function doGotoTop() {
    window.scrollTo({
        top: 0,
        behavior:'smooth'
    });
    gotoTop.value.style.display = ifShowGotoTop() ? '' : 'none';
    const topBtnDefault = gotoTop.value.querySelector('.top-btn-default') as HTMLElement
    const topBtnActive = gotoTop.value.querySelector('.top-btn-active') as HTMLElement
    topBtnDefault.style.display = ''
    topBtnActive.style.display = 'none'
}
function showActiveBtn(event: MouseEvent) {
    const gotoTop = getGotoTop(event.target as HTMLElement)
    const topBtnDefault = gotoTop.querySelector('.top-btn-default') as HTMLElement
    const topBtnActive = gotoTop.querySelector('.top-btn-active') as HTMLElement
    topBtnDefault.style.display = 'none'
    topBtnActive.style.display = ''
}
function hideActiveBtn(event: MouseEvent) {
    const gotoTop = getGotoTop(event.target as HTMLElement)
    const topBtnDefault = gotoTop.querySelector('.top-btn-default') as HTMLElement
    const topBtnActive = gotoTop.querySelector('.top-btn-active') as HTMLElement
    topBtnDefault.style.display = ''
    topBtnActive.style.display = 'none'
}
function getGotoTop(target: HTMLElement) {
    return getTargetClassElement(target, 'goto-top')
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
</script>

<style scoped>
.goto-top {
    height: 42px;
    width: 42px;
    position: fixed;
    right: 15px;
    bottom: 50px;
    z-index: 1;
}

.goto-top .top-btn-default {
    opacity: 0.6;
}

.goto-top:hover {
    cursor: pointer;
}
</style>