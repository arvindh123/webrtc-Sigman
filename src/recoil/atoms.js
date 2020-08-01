import { atom } from "recoil";

export const counterState = atom({
    key: 'counterState',
    default: 0,
});

export const videoState = atom({
    key: 'videoState',
    default: [] ,
});

export const LocalMedia = atom({
    key: 'LocalMedia',
    default: [] ,
});


export const RemoteMedia = atom({
    key: 'RemoteMedia',
    default: [] ,
    dangerouslyAllowMutability : true
});