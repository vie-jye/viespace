<template>
<div class="social glass-morphism">
    <div class="social-btn" @mouseover="hoverSocial" @mouseout="hoverOutSocial" v-for="item in socialInfo"
        :key="item.id" :class="item.type" @click="openUrl(item.url)">
        <div class="social-icon" :class="item.type">
            <img class="icon-default" :src="item.icon">
            <img class="icon-active" style="display: none" :src="item.iconActive">
        </div>
        <span style="display: none">{{ item.name }}</span>
    </div>
</div>
</template>

<script setup lang="ts">
const socialInfo = [
    {
        id: 1,
        type: 'juejin',
        name: 'Juejin',
        icon: 'http://lc-3sdxeS8b.cn-n1.lcfile.com/XYQegXSQvElqy0fnVP3U3M6d0j37aXwH/juejin.png',
        iconActive: 'http://lc-3sdxeS8b.cn-n1.lcfile.com/OhPSVms9pRHKglhPe5xXs15ivfANzLDs/juejin_active.png',
        url: 'https://juejin.cn/user/761280266516381'
    },
    {
        id: 2,
        type: 'figma',
        name: 'Figma',
        icon: 'http://lc-3sdxeS8b.cn-n1.lcfile.com/dFLfEUxO1n9LX4grEzGASWNo6vaNyNPP/figma.png',
        iconActive: 'http://lc-3sdxeS8b.cn-n1.lcfile.com/l9rUBRnI018gqhVjjvT7GvbRDQ1YUTnQ/figma_active.png',
        url: 'https://www.figma.com/'
    },
    {
        id: 3,
        type: 'bilibili',
        name: 'Bilibili',
        icon: 'http://lc-3sdxeS8b.cn-n1.lcfile.com/3NT9AGObuPidJnOMnKpGAC9lrAkhE2pE/bilibili.png',
        iconActive: 'http://lc-3sdxeS8b.cn-n1.lcfile.com/SAEaP8hLc2QVibDbJo8Ty6SVPLzFOXXj/bilibili_active.png',
        url: 'https://www.bilibili.com/'
    },
    {
        id: 4,
        type: 'github',
        name: 'Github',
        icon: 'http://lc-3sdxeS8b.cn-n1.lcfile.com/GEg0OiGgDt6KDiiv09ijAz1UIRbJ8lVv/github.png',
        iconActive: 'https://rqaadaviiwfwecvebqgh.supabase.co/storage/v1/object/public/space/icon/github.png',
        url: 'https://github.com/'
    }
]

function openUrl(url: string) {
    window.open(url)
}

function hoverSocial(event: MouseEvent) {
    let socialBtn = getSocialBtn(event.target as HTMLElement)
    const socialIcon = socialBtn.querySelector('.social-icon') as HTMLElement
    const iconDefault = socialIcon.querySelector('.icon-default') as HTMLElement
    const iconActive = socialIcon.querySelector('.icon-active') as HTMLElement
    const socialText = socialBtn.querySelector('span') as HTMLElement
    iconDefault.style.display = 'none'
    iconActive.style.display = ''
    socialText.style.display = ''
}
function hoverOutSocial(event: MouseEvent) {
    let socialBtn = getSocialBtn(event.target as HTMLElement)
    const socialIcon = socialBtn.querySelector('.social-icon') as HTMLElement
    const iconDefault = socialIcon.querySelector('.icon-default') as HTMLElement
    const iconActive = socialIcon.querySelector('.icon-active') as HTMLElement
    const socialText = socialBtn.querySelector('span') as HTMLElement
    iconDefault.style.display = ''
    iconActive.style.display = 'none'
    socialText.style.display = 'none'
}
function getSocialBtn(target: HTMLElement) {
    return getTargetClassElement(target, 'social-btn')
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
.glass-morphism {
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.25);
}
/* 社交平台 */
.social {
    height: 48px;
    grid-column: 1/6;
    grid-row: 2/3;
    background-color: rgba(255, 255, 255, 0.2);
    border-width: 1px;
    margin-top: 30px;
    padding: 0 10px;
    overflow: hidden;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 10px;
    align-items: center;
}

.social .social-btn {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-image: linear-gradient(to bottom, #C1C1C133, #F5F5F533);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 20%);
    justify-self: center;
    align-self: center;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: 0.2s width;
}

.social .social-btn .social-icon {
    height: 24px;
    width: 24px;
}

.social .social-btn .social-icon>img {
    width: 100%;
    height: 100%;
    opacity: 70%;
}

.social .social-btn span {
    font-size: 14px;
    font-weight: bold;
    opacity: 0.5;
}

/* hover效果 */
.social .social-btn:hover {
    width: 96px;
    justify-content: space-evenly;
    cursor: pointer;
}

.social .social-btn .social-icon>img.icon-active {
    opacity: 95%;
}

@media screen and (max-width:460px) {
    .social {
        grid-column: 3/23;
    }
}

@media screen and (min-width:460px) and (max-width:550px) {
    .social {
        grid-column: 20/24;
    }
}

@media screen and (min-width: 550px) and (max-width:768px) {
    .social {
        grid-column: 21/24;
    }
}

@media screen and (min-width: 769px) and (max-width:992px) {
    .social {
        grid-column: 15/17;
    }
}

/* 与 profile 并列，横向变纵向 */
@media screen and (min-width:460px) and (max-width:992px) {
    .social {
        grid-row: 1/2;
        height: 300px;
        padding: 10px 0;
        margin-top: 70px;
        box-sizing: border-box;

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr);
        column-gap: 0;
        align-items: center;
    }

    .social .social-btn {
        width: 36px;
        height: 36px;
        border-radius: 18px;

        display: flex;
        flex-direction: column;

        transition: 0.2s height;
    }

    .social .social-btn span {
        writing-mode: vertical-rl;
    }

    .social .social-btn:hover {
        width: 36px;
        height: 96px;
    }
}
</style>