<template></template>

<script setup lang="ts">
import { getPoint } from '../../utils'
import { getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, Ref, watch } from 'vue'
import type { PointType } from '../../utils'

interface PlaylineProps {
    points: PointType[],
    //折线的颜色，同CSS颜色
    strokeColor?: string;
    // 折线的宽度，单位为像素
    strokeWeight?: number;
    // 线的透明度，范围`0-1`
    strokeOpacity?: number;
    // 设置线为实线、虚线、或者点状线 
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    // 面填充颜色，同CSS颜色
    fillColor?: string;
    // 面填充的透明度，范围`0-1`
    fillOpacity?: number;
    // 可通过`map.clearOverlays()`方法移除 
    enableMassClear?: boolean;
    // 开启可编辑模式 
    enableEditing?: boolean;
    // 自动聚焦视野
    autoViewport?: boolean;
}

interface EmitsType {
    (e: string, data: Object): void
}

const color = '#00ffff'

const emits = defineEmits<EmitsType>()

const props = defineProps<PlaylineProps>()
const instance = getCurrentInstance()
const attrs = instance?.attrs ?? {}

const map = inject<Ref<BMapGL.Map>>('map')
let polygon: BMapGL.Polygon

const watchProps = (polygon: BMapGL.Polygon) => {
    watch(() => props.points, (val) => {
        const points = val.map(p => getPoint(p))
        polygon.setPath(points)
    })
    watch(() => props.strokeColor, val => polygon.setStrokeColor(val ?? color))
    watch(() => props.strokeWeight, val => polygon.setStrokeWeight(val ?? 2))
    watch(() => props.strokeOpacity, val => polygon.setStrokeOpacity(val ?? 1))
    watch(() => props.strokeStyle, val => polygon.setStrokeStyle(val ?? 'solid'))
    watch(() => props.fillColor, val => polygon.setFillColor(val ?? color))
    watch(() => props.fillOpacity, val => polygon.setFillOpacity(val ?? 0.3))
    watch(() => props.enableMassClear, val => val ? polygon.enableEditing() : polygon.disableMassClear())
    watch(() => props.enableEditing, val => val ? polygon.enableEditing() : polygon.disableEditing())
}

const init = () => {
    if (!map?.value || polygon) return
    const points = props.points.map(p => getPoint(p))
    const options = {
        strokeColor: props.strokeColor || color,
        strokeWeight: props.strokeWeight || 2,
        strokeOpacity: props.strokeOpacity || 1,
        strokeStyle: props.strokeStyle || 'solid',
        fillColor: props.fillColor || color,
        fillOpacity: props.fillOpacity || 0.3,
        enableMassClear: props.enableMassClear || true
    }
    polygon = new BMapGL.Polygon(points, options)
    map.value.addOverlay(polygon)

    if (typeof attrs.onClick === 'function') {
        polygon.addEventListener('click', e => emits('click', e))
    }
    
    if (props.autoViewport) {
        map.value.setViewport(points)
    }

    watchProps(polygon)
}

onMounted(() => {
    nextTick(init)
})

onBeforeUnmount(() => {
    if (!polygon) return
    map?.value.removeOverlay(polygon)
})
</script>
