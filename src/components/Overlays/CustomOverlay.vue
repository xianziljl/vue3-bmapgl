<template>
<div ref="el" style="position: absolute;">
    <slot></slot>
</div>
</template>

<script lang="ts">
class CustomOverlay extends BMapGL.Overlay {
    el: HTMLElement
    position: BMapGL.Point
    zIndex: number
    map: BMapGL.Map
    renderOutSize: number | undefined
    renderLevel?: [number, number]

    constructor(
        el: HTMLElement,
        position: BMapGL.Point,
        zIndex?: number,
        renderOutSize?: number,
        renderLevel?: [number, number] | number
    ) {
        super()
        this.el = el
        this.position = position
        this.zIndex = zIndex || 0
        this.renderOutSize = renderOutSize
        this.renderLevel = getRenderLevel(renderLevel)
    }
    initialize(map: BMapGL.Map) {
        map.getPanes().markerPane?.appendChild(this.el);
        this.map = map
        return this.el
    }
    draw() {
        const { position, el, map, renderOutSize, renderLevel } = this
        const s = renderOutSize || 0
        const { x, y } = map.pointToOverlayPixel(position)
        const { width, height } = map
        
        // 只在一定缩放级别内显示
        if (renderLevel) {
            const min = renderLevel[0] || 0
            const max = renderLevel[1] || 99
            const level = map.getZoom()
            if (level < min || level > max) {
                el.style.visibility = 'hidden'
                return
            }
        }
        // 超出可可视区域不显示
        if (x < -s || y < -s || x > width + s || y > height + s) {
            el.style.visibility = 'hidden'
            return
        }
        el.style.visibility = 'visible'
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.zIndex = this.zIndex + ''
    }
}
</script>

<script setup lang="ts">
import { getPoint, getRenderLevel, isMC } from '../../utils'
import { inject, nextTick, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'
import type { PointType } from '../../utils'

const props = defineProps<{
    // 标注点的坐标
    position: PointType;
    // 坐标体系，可选百度经纬度坐标或百度墨卡托坐标
    coordType?: 'bd09ll' | 'bd09mc';
    // 元素的zIndex属性
    zIndex?: number;
    // 元素位置在视图外多少像素后停止渲染
    renderOutSize?: number,
    // 在地图缩放层级范围显示
    renderLevel?: [number, number] | number,
    // 自动聚焦视野
    autoViewport?: boolean;
}>()

const el = ref<HTMLElement>()
const map = inject<Ref<BMapGL.Map>>('map')

let overlay: CustomOverlay

const init = () => {
    if (!map?.value || overlay) return

    const point = getPoint(props.position, isMC(props.coordType))
    overlay = new CustomOverlay(
        el.value as HTMLElement,
        point,
        props.zIndex,
        props.renderOutSize,
        props.renderLevel
    )
    overlay.renderOutSize = props.renderOutSize

    map?.value.addOverlay(overlay)

    if (props.autoViewport) {
        map.value.setCenter(point)
    }

    watch(() => props.position, val => {
        overlay.position = getPoint(val, isMC(props.coordType))
        overlay.draw()
    })
    watch(() => props.coordType, val => {
        overlay.position = getPoint(props.position, isMC(val))
        overlay.draw()
    })
    watch(() => props.zIndex, val => {
        overlay.zIndex = val || 0
        overlay.draw()
    })
    watch(() => props.renderOutSize, val => {
        overlay.renderOutSize = val
        overlay.draw()
    })
    watch(() => props.renderLevel, val => {
        overlay.renderLevel = getRenderLevel(val)
        overlay.draw()
    })
    
}

onMounted(() => {
    nextTick(init)
})

onBeforeUnmount(() => {
    if (!overlay) return
    map?.value.removeOverlay(overlay)
})
</script>
