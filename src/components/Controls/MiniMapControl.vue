<template>
<!-- 小地图 -->
<div
    class="bmapgl-mini-map"
    style="position: absolute;border: 1px solid rgba(255,255,255,0.5);z-index: 10;overflow: hidden;"
    :style="{
        width: `${props.size}px`,
        height: `${props.size}px`,
        inset: `auto 50px 10px auto`,
    }">
    <div 
        class="bmapgl-mini-map-bg"
        style="position: absolute;left:0;top: 0;width: 100%;height:100%;"
    ></div>

    <div
        style="border: 1px solid cyan;position: absolute;font-size: 12px;;"
        :style="style"
    ></div>
</div>
</template>

<script lang="ts">

// class MiniMapControl extends BMapGL.Control{
//     constructor() {
//         super()
//     }
// }

</script>

<script setup lang="ts">
import { getPoint, PointType } from '../../utils'
import { inject, onMounted, reactive, nextTick, ref, computed, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import type { OffsetType } from '../../utils'

interface MiniMapControlProps {
    size?: number,
    bounds?: [PointType, PointType],
    anchor?: BMapGL.ControlAnchor,
    offset?: OffsetType,
    image?: string
}

const props = withDefaults(defineProps<MiniMapControlProps>(), {
    size: 200
})

const mapInject = inject<Ref<BMapGL.Map>>('map')

const bounds = ref<BMapGL.Bounds>()

const mapState = reactive({
    center: <BMapGL.Point>{},
    bounds: <BMapGL.Bounds>{},
    heading: 0
})


const style = computed(() => {
    const { size } = props
    if (!bounds.value) return {}
    const ne1 = bounds.value.getNorthEast()
    const sw1 = bounds.value.getSouthWest()
    const w = sw1.lng - ne1.lng 
    const h = sw1.lat - ne1.lat
    const ne2 = mapState.bounds.getNorthEast()
    const sw2 = mapState.bounds.getSouthWest()

    const top = (ne2.lat - ne1.lat) / h * size
    const bottom = (sw1.lat - sw2.lat) / h * size
    const right = (ne2.lng - ne1.lng) / w * size
    const left = (sw1.lng - sw2.lng) / w * size

    return {
        transform: `rotate(${-mapState.heading}deg)`,
        top: `${top < 0 ? 0 : top}px`,
        right: `${right < 0 ? 0 : right}px`,
        bottom: `${bottom < 0 ? 0 : bottom}px`,
        left: `${left < 0 ? 0 : left}px`,

    }
})


const init = () => {
    if (!mapInject?.value) return

    const map = mapInject.value
    console.log('map:', map)

    if (props.bounds) {
        const ne = getPoint(props.bounds[0])
        const sw = getPoint(props.bounds[1])
        bounds.value = new BMapGL.Bounds(sw, ne)
    } else {
        bounds.value = map.getBounds()
    }

    const getMapState = () => {
        mapState.bounds = map.getBounds()
        mapState.heading = map.getHeading()
    }

    let animateId = 0
    let timerId = 0
    const animate = () => {
        getMapState()
        animateId = requestAnimationFrame(animate)
    }

    const end = () => {
        console.log('end')
        cancelAnimationFrame(animateId)
        animateId = 0
    }

    const start = () => {
        console.log('start')
        end()
        animate()
    }
    
    map.addEventListener('movestart', start)
    map.addEventListener('moveend', end)

    const dragstart = () => {
        clearTimeout(timerId)
        timerId = 0
        start()
    }
    const dragend = () => {
        timerId = window.setTimeout(end, 1000)
    }
    map.addEventListener('dragstart', dragstart)
    map.addEventListener('dragend', dragend)

    map.addEventListener('zoomstart', start)
    map.addEventListener('zoomend', end)

    getMapState()

    onBeforeUnmount(() => {
        map.removeEventListener('movestart', start)
        map.removeEventListener('moveend', end)
        map.removeEventListener('dragstart', dragstart)
        map.removeEventListener('dragend', dragend)
        map.removeEventListener('zoomstart', start)
        map.removeEventListener('zoomend', end)
    })
}

onMounted(() => {
    nextTick(init)
})

</script>
