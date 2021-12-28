<template>
  
</template>

<script setup>
import {inject, onMounted, onBeforeUnmount, watch, nextTick, defineProps, getCurrentInstance} from 'vue';
import {View, BloomEffect, BrightEffect, BlurEffect} from 'mapvgl';

const map = inject('map')
const props = defineProps({
    effects: [String, Array]
})

const instance = getCurrentInstance()
const attrs = instance?.attrs ?? {}

let mapvglView;

const formatEffect = effect => {
    if(!effect) {
        return;
    }

    switch (effect) {
        case 'bloom':
            return new BloomEffect();
        case 'bright':
            return new BrightEffect();
        case 'blur':
            return new BlurEffect();
    }
}

const events = new Set([
    'addLayer',
    'removeLayer',
    'removeAllLayers',
    'getAllLayers',
    'getAllThreeLayers',
    'hide',
    'show',
    'hideLayer',
    'showLayer'
])

const bindEventListeners = (mapvglView) => {
    for (const key in attrs) {
        if (typeof attrs[key] === 'function') {
            const eventName = key.toLowerCase().replace(/^on/, '')
            if (events.has(eventName)) {
                mapvglView.addEventListener(eventName, e => emits(eventName, e))
            }
        }
    }
}

const init = () => {
    if(!map) {
        return;
    }
    if(!props.effects) {
        return;
    }
    let effects = [];

    if(typeof props.effects === 'string') {
        const effect = formatEffect(props.effects);
        effects = [effect]
    }
    if(props.effects instanceof Array) {
        effects =  props.effects.map(effect => {
            return formatEffect(effect);
        })
    }
    mapvglView = new View({
        effects,
        map: map?.value
    });

    bindEventListeners(mapvglView);
};

onMounted(() => {
    nextTick(() => {
        init();
    })
}) 

onBeforeUnmount(() => {
    mapvglView?.destroy();
})
</script>

<style>

</style>