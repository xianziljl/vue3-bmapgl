<template></template>

<script setup lang="ts">
import { getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { getOffsetSize } from '../../utils'
import type { Ref } from 'vue'
import type { OffsetType } from '../../utils'

const DEFAULT_ANCHOR = 1

const props = defineProps<{
    anchor?: BMapGL.ControlAnchor,
    offset?: OffsetType
}>()

const map = inject<Ref<BMapGL.Map>>('map')
let ctrl: BMapGL.NavigationControl3D

const instance = getCurrentInstance()
const attrs = instance?.attrs ?? {}

const init = () => {
    if (!map?.value || ctrl) return
    const { anchor, offset } = props
    ctrl = new BMapGL.NavigationControl3D({
        anchor: anchor ?? DEFAULT_ANCHOR,
        offset: getOffsetSize(offset)
    })
    // 这里控件似乎没有类名，在做样式覆盖时可能不太方便，手动添加一个
    setTimeout(() => {
        const div: HTMLElement = ctrl['_container']
        div?.classList.add('bmapgl-navigation-control-3d')
        const className = attrs.class as string ?? ''
        const arr = className.split(' ').filter(Boolean)
        arr.forEach(n => div?.classList.add(n))
    })

    const watchConfig = { immediate: true }
    watch(() => props.anchor, val => ctrl.setAnchor(val ?? DEFAULT_ANCHOR), watchConfig)
    watch(() => props.offset, val => ctrl.setOffset(getOffsetSize(val)), watchConfig)

    map.value.addControl(ctrl)
}

onMounted(() => {
    nextTick(init)
})

onBeforeUnmount(() => {
    if (!ctrl) return
    map?.value?.removeControl(ctrl)
})

</script>
