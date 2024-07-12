<template>
<div class="profile">
    <div class="profile-cover glass-morphism">
        <div class="profile-background">
            <img :src="profile.background">
        </div>
        <div class="profile-mask">
            <p>{{ profile.name }}</p>
            <p>{{ profile.selfIntro }}</p>
        </div>
    </div>
    <div class="profile-avatar">
        <img :src="profile.avatar">
    </div>
</div>
</template>

<script setup lang="ts">
const profile = {
    avatar: 'https://img.picui.cn/free/2024/07/02/6683d78faf009.jpg',
    background: 'https://img.picui.cn/free/2024/07/02/6683d78faf009.jpg',
    name: 'MR_VIE',
    selfIntro: 'I\'m a developer, interested in design, poetry, and photography'
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
}

.profile-cover .profile-mask {
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 30%);
    border-radius: 20px;
    position: absolute;
    top: 0;
    backdrop-filter: blur(5px);
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

.profile-cover .profile-mask>p:last-of-type {
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