<template>
    <Map ref="mapComp" :zoom="zoom" center="116.08405648702066,39.50625062759024" preserveDrawingBuffer>
        <CustomOverlay v-for="(p, i) in _path" :key="i" :position="p" :render-level="12">
            <div
                style="background: darkgreen;padding: 10px;border: 1px solid yellow;"
            >custom overlay</div>
        </CustomOverlay>

        <Polyline :points="_path" @click="log"></Polyline>

        <Circle center="116.08405648702066,39.50625062759024" :radius="5000" @click="log"></Circle>

        <ZoomControl :anchor="3"></ZoomControl>

        <NavigationControl3D class="ctrl-3d" :anchor="1" :offset="10"></NavigationControl3D>

        <ScaleControl :anchor="1" :offset="[80, 20]"></ScaleControl>

        <MiniMapControl></MiniMapControl>
        <Marker 
        position="115.968582,39.050007" 
        @click="log"
        :enableDragging="true"
        :icon="iconMarker"
        :icon-size="iconSize"
        :autoViewport="true"
        title="我是title"></Marker>
    </Map>

   

    <div style="position: absolute;left: 10px;top: 10px;z-index: 100;">
        <button @click="zoom++">放大</button>
        <button @click="zoom--">缩小</button>
        <button @click="toggle = !toggle">Toggle</button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    Map,
    ZoomControl,
    CustomOverlay,
    Polyline,
    Circle,
    NavigationControl3D,
    MiniMapControl,
    ScaleControl,
    Marker
} from '..'
import MapvglView from '../components/MapVGL/MapvglView.vue';
import styleJson from './assets/style.json'
import path from './assets/path.json'

const _path = path as [number, number][]

const zoom = ref<number>(10)
const toggle = ref(false)
const mapComp = ref<{ map: BMapGL.Map }>()
const iconMarker = ref('/src/examples/assets/car.png');
const iconSize = 32

// const customOverlayPosition = new BMapGL.Point(116.08405648702066, 39.30625062759024)

const log = (e: any) => {
    console.log(e)
}


</script>

<style>
.bmapgl-navigation-control-3d > div,
.bmapgl-navigation-control-3d button {
    background-image: url("./assets/gl-navi-control-pc4.png") !important;
}
.bmapgl-navigation-control-3d > button,
.BMap_stdMpZoom .BMap_button_new {
    background-color: #132b4c !important;
}
.BMap_stdMpZoom .BMap_button_new:first-child {
    border-color: #193863 !important;
}
.bmapgl-mini-map-bg{
    background: url('./assets/cbimage.png') center / 100% 100%;
}
</style>
