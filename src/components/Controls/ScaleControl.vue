<template></template>

<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { getOffsetSize } from '../../utils'
import type { Ref } from 'vue'
import type { OffsetType } from '../../utils'

const DEFAULT_ANCHOR = 2

const props = defineProps<{
    anchor?: BMapGL.ControlAnchor,
    offset?: OffsetType,
    unit?: 'metric' | 'us'
}>()

const map = inject<Ref<BMapGL.Map>>('map')
let ctrl: BMapGL.ScaleControl

const init = () => {
    if (!map?.value || ctrl) return
    const { anchor, offset } = props
    ctrl = new BMapGL.ScaleControl({
        anchor: anchor ?? DEFAULT_ANCHOR,
        offset: getOffsetSize(offset)
    })

    watch(() => props.anchor, val => ctrl.setAnchor(val ?? DEFAULT_ANCHOR))
    watch(() => props.offset, val => ctrl.setOffset(getOffsetSize(val)))
    watch(() => props.unit, val => ctrl.setUnit(val === 'us' ? 'us' : 'metric'), { immediate: true })

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
