<template>
    <div style="position: relative;width:100%;height: 100%;overflow: hidden;">
        <div ref="el" style="width:100%;height: 100%;"></div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { getPoint } from '../../utils'
import type { PointType } from '../../utils'

interface MapProps {
    // 中心位置
    center?: PointType
    // 缩放级别
    zoom?: BMapGL.ZoomType
    // 地图最小缩放级别
    minZoom?: BMapGL.ZoomType
    // 地图最大缩放级别
    maxZoom?: BMapGL.ZoomType
    // 地图类型，普通地图或地球模式
    mapType?: 'normal' | 'earth'
    // 地图旋转角度
    heading?: number
    // 地图倾斜角度
    tilt?: number
    // 是否开启地图旋转功能
    enableRotate?: boolean
    // 是否开启地图倾斜功能
    enableTilt?: boolean
    // 是否开启地图可拖拽缩放
    enableDragging?: boolean
    // 是否开启鼠标滚轮缩放
    enableScrollWheelZoom?: boolean
    // 是否开启双击鼠标缩放
    enableDoubleClickZoom?: boolean
    // 是否开启惯性拖拽
    enableInertialDragging?: boolean
    // 个性化地图样式
    mapStyleV2?: BMapGL.MapStyleV2
}

interface EmitsType {
    (e: string, data: Object): void
}

const props = withDefaults(defineProps<MapProps>(), {
    center: '116.41088,39.898774',
    zoom: 12,
    minZoom: 1,
    maxZoom: 20,
    enableRotate: true,
    enableTilt: true,
    enableDragging: true,
    enableScrollWheelZoom: true,
    enableDoubleClickZoom: true,
    enableInertialDragging: true
})

const emits = defineEmits<EmitsType>()

const events = new Set([
    'click',
    'dblclick',
    'rightclick',
    'rightdblclick',
    'maptypechange',
    'mousemove',
    'mouseover',
    'mouseout',
    'movestart',
    'moving',
    'moveend',
    'zoomstart',
    'zoomend',
    'addoverlay',
    'addcontrol',
    'removecontrol',
    'removeoverlay',
    'clearoverlays',
    'dragstart',
    'dragging',
    'dragend',
    'resize'
])

const instance = getCurrentInstance()
const attrs = instance?.attrs ?? {}

const el = ref<HTMLDivElement>()
const map = ref<BMapGL.Map>()

provide('map', map)

defineExpose({ map })

const watchProps = (map: BMapGL.Map) => {
    const watchConfig = { immediate: true }
    watch(() => props.center, val => map.setCenter(getPoint(val)))
    watch(() => props.zoom, val => map.setZoom(val))
    watch(() => props.maxZoom, val => map.setMaxZoom(val), watchConfig)
    watch(() => props.minZoom, val => map.setMinZoom(val), watchConfig)
    watch(() => props.mapType, val => map.setMapType(val === 'earth' ? BMAP_EARTH_MAP : BMAP_NORMAL_MAP), watchConfig)
    watch(() => props.heading, val => map.setHeading(val ?? 0), watchConfig)
    watch(() => props.tilt, val => map.setTilt(val ?? 0), watchConfig)
    watch(() => props.enableRotate, val => val ? map.enableRotate() : map.disableRotate(), watchConfig)
    watch(() => props.enableTilt, val => val ? map.enableTilt() : map.disableTilt(), watchConfig)
    watch(() => props.enableDragging, val => val ? map.enableDragging() : map.disableDragging(), watchConfig)
    watch(() => props.enableScrollWheelZoom, val => val ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom(), watchConfig)
    watch(() => props.enableDoubleClickZoom, val => val ? map.enableDoubleClickZoom() : map.disableDoubleClickZoom(), watchConfig)
    watch(() => props.enableInertialDragging, val => val ? map.enableInertialDragging() : map.disableInertialDragging(), watchConfig)
    watch(() => props.mapStyleV2, val => map.setMapStyleV2(val ?? { styleJson: [] }))
}

const bindEventListeners = (map: BMapGL.Map) => {
    for (const key in attrs) {
        if (typeof attrs[key] === 'function') {
            const eventName = key.toLowerCase().replace(/^on/, '')
            if (events.has(eventName)) {
                map.addEventListener(eventName, e => emits(eventName, e))
            }
        }
    }
}

const init = () => {
    if (map.value) return;
    const {center, zoom} = props

    const mapInstance = new BMapGL.Map(el.value as HTMLDivElement)
    mapInstance.centerAndZoom(getPoint(center), zoom)

    bindEventListeners(mapInstance)
    watchProps(mapInstance)

    map.value = mapInstance
}

onMounted(init)

onBeforeUnmount(() => {
    map.value?.destroy()
})

</script>
