<template>
<header>
    <div class="header-title">MR_VIE's Space</div>
    <!-- 菜单导航 -->
    <nav class="header-nav">
        <ul class="nav-list">
            <li class="nav-item" v-for="(item, index) in navList" :key="index" @click="clickNav(item.name, item.route)">
                {{ item.name }}
            </li>
        </ul>
    </nav>
    <!-- 菜单按钮 -->
    <div class="header-menu-btn" @click="clickMenuBtn">
        <div class="menu-btn" :class="menuBtnState">
            <div class="btn-line"></div>
            <div class="btn-line"></div>
            <div class="btn-line"></div>
        </div>
    </div>
    <!-- 菜单列表/项 -->
    <div class="header-menu" :class="menuBtnState">
        <ul class="menu-list" @click="clickMenu">
            <li class="menu-item" v-for="(item, index) in navList" :key="index" @click="clickNav(item.name, item.route)">
                {{ item.name }}
            </li>
        </ul>
    </div>
</header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import { useAppState } from "@/store/appState";

const navList = [{
    name: 'Home',
    route: { name: 'home' }
}, {
    name: 'Articles',
    route: { name: 'articles' }
}, {
    name: 'Dev Logs',
    route: { name: 'articles' }
}, {
    name: 'About',
    route: { name: 'about', params: { id: 1 } }
}]
function clickNav(name: string, route: any) {
    if (name === 'Dev Logs') {
        useAppState().setCate(2)
    }
    router.push(route)
}
// const navList = navigation.map(item => {
//     return {
//         name: item,
//         route: '/' + item.toLowerCase()
//     }
// })
let menuBtnState = ref('')
let collapseMenu = true

function clickMenuBtn() {
    if (collapseMenu) {
        collapseMenu = false
        menuBtnState.value = 'menu-btn-expand'
    } else {
        collapseMenu = true
        menuBtnState.value = 'menu-btn-collapse'
    }
}
function clickMenu() {
    collapseMenu = true
    menuBtnState.value = 'menu-btn-collapse'
}
</script>

<style scoped>
header {
    height: 80px;
    width: 100vw;
    background-color: var(--color-youlv);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* 两端对齐 */
}

header .header-title {
    margin-left: 34px;
    color: white;
    font-size: 32px;
    font-weight: bold;
    flex-shrink: 0;
    /* 不压缩 */
}

header .header-nav {
    font-size: 20px;
    color: white;
    margin-left: auto;
    /* flex子项居中 */
    margin-right: auto;
    /* flex子项居中 */
}

.header-nav>.nav-list {
    padding: 0;
    display: flex;
}

.header-nav>.nav-list>.nav-item {
    padding: 0 10px;
    margin-right: 30px;
    line-height: 2.5em;
}

.header-nav>.nav-list>.nav-item:last-of-type {
    margin-right: 0;
}

.header-nav>.nav-list>.nav-item:hover {
    background-color: var(--color-molv);
    cursor: pointer;
}

header .header-menu-btn {
    width: 50px;
    height: 50px;
    margin-right: 34px;
    flex-shrink: 0;
    /* 不压缩 */
    display: flex;
    justify-content: center;
    align-items: center;
}

/*header .header-menu-btn:active {
  background-color: var(--color-molv);
  cursor: pointer;
}*/
.header-menu-btn .menu-btn {
    width: 30px;
    height: 26px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.header-menu-btn .menu-btn .btn-line {
    width: 30px;
    height: 2px;
    background-color: white;
}

header .header-menu {
    width: 100vw;
    border: 0;
    box-sizing: border-box;
    background-color: var(--color-youlv);
    position: absolute;
    left: 0;
    top: 80px;
    z-index: 2;

    /* 下拉菜单过渡 */
    display: grid;
    transition-duration: 0.3s;
    transition-property: border, grid-template-rows;
    overflow: hidden;
    grid-template-rows: 0fr;
}

header .header-menu.menu-btn-expand {
    grid-template-rows: 1fr;
    border-top: 3px solid var(--color-molv);
}

.header-menu .menu-list {
    color: white;
    font-size: 20px;
    line-height: 2.5em;
    min-height: 0;
}

.header-menu .menu-list .menu-item {
    width: 100%;
    text-align: center;
}

.header-menu .menu-list .menu-item:hover {
    background-color: var(--color-molv);
    cursor: pointer;
}

/* 菜单按钮动画 */
.menu-btn.menu-btn-expand .btn-line:first-of-type {
    animation: downRotate 0.3s linear forwards;
}

.menu-btn.menu-btn-expand .btn-line:nth-child(2) {
    animation: changeOpacity 0s 0.15s linear forwards;
}

.menu-btn.menu-btn-expand .btn-line:last-of-type {
    animation: upRotate 0.3s linear forwards;
}

@keyframes downRotate {
    0% {
        transform: translateY(0) rotate(0);
    }

    50% {
        transform: translateY(12px)
    }

    100% {
        transform: translateY(12px) rotate(45deg);
    }
}

@keyframes changeOpacity {
    0% {
        opacity: 1
    }

    100% {
        opacity: 0;
    }
}

@keyframes upRotate {
    0% {
        transform: translateY(0) rotate(0);
    }

    50% {
        transform: translateY(-12px)
    }

    100% {
        transform: translateY(-12px) rotate(-45deg);
    }
}

@media screen and (max-width:460px) {
    header {
        height: 64px;
    }

    header .header-title {
        margin-left: 24px;
        color: white;
        font-size: 28px;
    }

    header .header-menu-btn {
        width: 34px;
        height: 34px;
        margin-right: 24px;
    }

    header .header-menu {
        top: 64px;
    }
}

@media screen and (max-width:768px) {
    header .header-nav {
        display: none;
    }
}

@media screen and (min-width:769px) {
    header .header-menu-btn {
        display: none;
    }

    header .header-menu {
        display: none;
    }
}
</style>