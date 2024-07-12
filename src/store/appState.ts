import {defineStore} from "pinia";
import {ref} from "vue";

export const useAppState = defineStore('appState', ()=> {
    // state
    let categoryId = ref(0);

    // actions
    function setCate(value: number): void {
        categoryId.value = value;
    }

    // getters
    const getCate = () => categoryId.value;

    return { setCate, getCate }
});