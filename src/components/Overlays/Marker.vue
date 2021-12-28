<template></template>

<script setup lang="ts">
import {inject, Ref, onMounted, defineProps, nextTick, watch, getCurrentInstance, defineEmits} from 'vue';
import type { PointType , OffsetType} from '../../utils';
import { getPoint, getOffsetSize } from '../../utils'


interface MarkerProps {
    // 标注点的坐标
    position: PointType,
    // 自动聚焦视野
    autoViewport?: boolean,
    // 是否可拖拽
    enableDragging?: boolean,
    // 是否在调用Map.clearOverlays()时清除此覆盖物
    enableMassClear?: boolean,
    // 标注的Icon图标 | path
    icon?: BMapGL.Icon | string,
    // 标注的Icon尺寸
    iconSize?: OffsetType,
    // 是否将标注置于其他标注之上。默认情况下纬度低盖住纬度高的标注
    isTop?: boolean,
    // 标注的标题，当鼠标移至标注上时显示此标题
    title?: string
}

interface EmitsType {
    (e: string, data: Object): void
}
const props = defineProps<MarkerProps>()
const emits = defineEmits<EmitsType>()

const map = inject<Ref<BMapGL.Map>>('map')
let marker: BMapGL.Marker

const instance = getCurrentInstance()
const attrs = instance?.attrs ?? {}


const init = () => {
    if (!map?.value || marker) return;

    const point = getPoint(props.position);
    let icon: BMapGL.Icon;
    const propsIcon = props.icon;
    if(propsIcon instanceof BMapGL.Icon) {
        icon = propsIcon
    } else if( typeof propsIcon === 'string') {
        icon = new BMapGL.Icon(propsIcon, getOffsetSize(props.iconSize));
    }else {
        const defaultIconUrl = '/src/assets/images/marker_red.png';
        icon = new BMapGL.Icon(defaultIconUrl, new BMapGL.Size(23, 25));
    }
    

    const options = {
        autoViewport: props.autoViewport || false,
        enableDragging: props.enableDragging || false,
        enableMassClear: props.enableMassClear || false,
        icon
    };
    marker = new BMapGL.Marker(point, options);
    marker.setTop(Boolean(props.isTop));
    marker.setTitle(String(props.title));
    map.value.addOverlay(marker);


    watch(() => props.isTop, val => {
         marker.setTop(Boolean(props.isTop));
    })

    watch(() => props.title, val => {
         marker.setTitle(String(props.title));
    })

    if (typeof attrs.onClick === 'function') {
        marker.addEventListener('click', e => emits('click', e))
    }
}

onMounted(() => {
    nextTick(init)
});
</script>
