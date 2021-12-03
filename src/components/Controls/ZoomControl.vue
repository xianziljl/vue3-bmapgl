<template></template>

<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { getOffsetSize } from '../../utils'
import type { Ref } from 'vue'
import type { OffsetType } from '../../utils'

const DEFAULT_ANCHOR = 3

const props = defineProps<{
    anchor?: BMapGL.ControlAnchor,
    offset?: OffsetType
}>()

const map = inject<Ref<BMapGL.Map>>('map')
let ctrl: BMapGL.ZoomControl


const init = () => {
    if (!map?.value || ctrl) return
    const { anchor, offset } = props
    ctrl = new BMapGL.ZoomControl({
        anchor: anchor ?? DEFAULT_ANCHOR,
        offset: getOffsetSize(offset)
    })

    watch(() => props.anchor, val => ctrl.setAnchor(val ?? DEFAULT_ANCHOR))
    watch(() => props.offset, val => ctrl.setOffset(getOffsetSize(val)))

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
