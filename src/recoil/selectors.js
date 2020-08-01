import { selector } from "recoil";
import { counterState , videoState } from "./atoms";

export const incrementSelector = selector({
    key: 'incrementSelector',
    get: ({ get }) => {
        const count = get(counterState);
        return count + 1;
    },
});


export const addVideoSelector = selector({
    key: 'addVideoSelector',
    get: ({ get }) => {
        const videos = get(videoState);
        console.log(videos)
        return videos;
    },
});

export const removeVideoSelector = selector({
    key: 'removeVideoSelector',
    get: ({ get }) => {
        const videos = get(videoState);
        console.log(videos)
        return videos;
    },
});