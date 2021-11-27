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

const emits = defineEmits<EmitsType>()

const props = defineProps<PlaylineProps>()
const instance = getCurrentInstance()
const attrs = instance?.attrs ?? {}

const map = inject<Ref<BMapGL.Map>>('map')
let polyline: BMapGL.Polyline

const watchProps = (polyline: BMapGL.Polyline) => {
    watch(() => props.points, (val) => {
        const points = val.map(p => getPoint(p))
        polyline.setPath(points)
    })
    watch(() => props.strokeColor, val => polyline.setStrokeColor(val ?? '#00ffff'))
    watch(() => props.strokeWeight, val => polyline.setStrokeWeight(val ?? 5))
    watch(() => props.strokeOpacity, val => polyline.setStrokeOpacity(val ?? 1))
    watch(() => props.strokeStyle, val => polyline.setStrokeStyle(val ?? 'solid'))
    watch(() => props.enableMassClear, val => val ? polyline.enableEditing() : polyline.disableMassClear())
    watch(() => props.enableEditing, val => val ? polyline.enableEditing() : polyline.disableEditing())
}

const init = () => {
    if (!map?.value || polyline) return
    const points = props.points.map(p => getPoint(p))
    const options = {
        strokeColor: props.strokeColor || '#00ffff',
        strokeWeight: props.strokeWeight || 5,
        strokeOpacity: props.strokeOpacity || 1,
        strokeStyle: props.strokeStyle || 'solid',
        enableMassClear: props.enableMassClear || true
    }
    polyline = new BMapGL.Polyline(points, options)
    map.value.addOverlay(polyline)

    if (typeof attrs.onClick === 'function') {
        polyline.addEventListener('click', e => emits('click', e))
    }
    
    if (props.autoViewport) {
        map.value.setViewport(points)
    }

    watchProps(polyline)
}

onMounted(() => {
    nextTick(init)
})

onBeforeUnmount(() => {
    if (!polyline) return
    map?.value.removeOverlay(polyline)
})
</script>
