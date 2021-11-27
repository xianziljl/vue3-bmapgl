<template></template>

<script setup lang="ts">
import { getPoint } from '../../utils'
import { getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, Ref, watch } from 'vue'
import type { PointType } from '../../utils'

interface PlaylineProps {
    // 中心点
    center: PointType,
    // 圆形的半径，单位为米
    radius: number,
    //描边的颜色，同CSS颜色
    strokeColor?: string;
    // 描边的宽度，单位为像素
    strokeWeight?: number;
    // 描边的透明度，范围`0-1`
    strokeOpacity?: number;
    // 设置描边为实线、虚线、或者点状线 
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
let circle: BMapGL.Circle

const watchProps = (circle: BMapGL.Circle) => {
    watch(() => props.center, val => circle.setCenter(getPoint(val)))
    watch(() => props.radius, val => circle.setRadius(val))
    watch(() => props.strokeColor, val => circle.setStrokeColor(val ?? color))
    watch(() => props.strokeWeight, val => circle.setStrokeWeight(val ?? 2))
    watch(() => props.strokeOpacity, val => circle.setStrokeOpacity(val ?? 1))
    watch(() => props.strokeStyle, val => circle.setStrokeStyle(val ?? 'solid'))
    watch(() => props.fillColor, val => circle.setFillColor(val ?? color))
    watch(() => props.fillOpacity, val => circle.setFillOpacity(val ?? 0.3))
    watch(() => props.enableMassClear, val => val ? circle.enableEditing() : circle.disableMassClear())
    watch(() => props.enableEditing, val => val ? circle.enableEditing() : circle.disableEditing())
}

const init = () => {
    if (!map?.value || circle) return
    const point = getPoint(props.center)
    const options = {
        strokeColor: props.strokeColor || color,
        strokeWeight: props.strokeWeight || 2,
        strokeOpacity: props.strokeOpacity || 1,
        strokeStyle: props.strokeStyle || 'solid',
        fillColor: props.fillColor || color,
        fillOpacity: props.fillOpacity || 0.2,
        enableMassClear: props.enableMassClear || true
    }
    circle = new BMapGL.Circle(point, props.radius, options)
    map.value.addOverlay(circle)

    if (typeof attrs.onClick === 'function') {
        circle.addEventListener('click', e => emits('click', e))
    }
    
    if (props.autoViewport) {
        const bounds = circle.getBounds()
        map.value.setViewport([bounds.getNorthEast(), bounds.getSouthWest()])
    }

    watchProps(circle)
}

onMounted(() => {
    nextTick(init)
})

onBeforeUnmount(() => {
    if (!circle) return
    map?.value.removeOverlay(circle)
})
</script>
