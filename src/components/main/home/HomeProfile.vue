<template>
<div class="profile">
    <div class="profile-cover glass-morphism">
        <div class="profile-background">
            <img :src="profile.background">
        </div>
        <div class="profile-mask">
            <p>{{ profile.name }}</p>
            <p>{{ profile.selfIntro }}</p>
            <p style="display: none;">{{ profile.backIntro}}</p>
        </div>
    </div>
    <div class="profile-avatar">
        <img :src="profile.avatar">
    </div>
</div>
</template>

<script setup lang="ts">
const profile = {
    avatar: 'https://ihy3rkcqheljxe35.public.blob.vercel-storage.com/IMG_20200518_235830-ICVS5ULw9EbsI4KiJAJxBBnzNLsUES.jpg',
    background: 'https://ihy3rkcqheljxe35.public.blob.vercel-storage.com/IMG_20200518_235830-ICVS5ULw9EbsI4KiJAJxBBnzNLsUES.jpg',
    name: 'VIE',
    selfIntro: 'I\'m a developer, interested in design, poetry, and photography',
    backIntro: 'Hi～ I\'m VIE. 欢迎访问我的空间！我是一名练习时长两月半的前端菜鸟，努力走向全栈开发。日常里喜欢音乐、电影、摄影、诗歌，还有猫猫狗狗——生活文艺，但理科出身。'
}
</script>

<style scoped>
/* 个人 占5栅格 */
.profile {
    height: 330px;
    margin-top: 70px;
    grid-column: 1/6;
    position: relative;
}

.profile-cover {
    height: 100%;
    border-width: 0;
    overflow: hidden;
    position: relative;
}

.profile-cover .profile-background {
    height: 100%;
    width: 100%;
}

.profile-cover .profile-background>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(5px);
}

.profile-cover .profile-mask {
    height: 100%;
    width: 100%;
    background-color: rgba(150, 150, 150, 0.45);
    border-radius: 20px;
    position: absolute;
    top: 0;
    /* backdrop-filter: blur(5px); */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-cover .profile-mask>p:first-of-type {
    color: var(--color-snow);
    font-size: 24px;
    font-weight: bold;
    margin-top: 55px;
}

.profile-cover .profile-mask>p:nth-of-type(2) {
    color: var(--color-snow);
    font-size: 20px;
    font-style: italic;
    margin-top: 30px;
    padding: 0 20px;
}

.profile .profile-avatar {
    width: 80px;
    height: 80px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 50%);
    border-radius: 50%;
    position: absolute;
    top: -40px;
    left: 0;
    right: 0;
    margin: 0 auto;
    overflow: hidden;
}

.profile .profile-avatar>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@media screen and (max-width:460px) {
    .profile {
        grid-column: 3/23;
        grid-row: 1/2;
        height: 300px;
    }
}

@media screen and (min-width:460px) and (max-width:550px) {
    .profile {
        grid-column: 2/19;
        grid-row: 1/2;
        height: 300px;
    }
}

@media screen and (min-width:550px) and (max-width:768px) {
    .profile {
        grid-column: 2/20;
        grid-row: 1/2;
        height: 300px;
    }
}

@media screen and (min-width: 769px) and (max-width:992px) {
    .profile {
        grid-column: 2/15;
        grid-row: 1/2;
        height: 300px;
    }
}
</style>