# vue3-bmapgl
> BMapGL 的 vue3 绑定，参考 [react 版](https://github.com/huiyan-fe/react-bmapgl/tree/master)

## 安装
```shell
npm install vue3-bmapgl
```

## 使用
``` javascript
import { Map, CustomOverlay } from 'vue3-bmapgl/dist'
```
```html
<Map ref="mapComp">
    <CustomOverlay position="116.41088,39.798774">custom overlay</CustomOverlay>
    <CustomOverlay :position="[116.41088, 39.898774]">custom overlay</CustomOverlay>
    <CustomOverlay :position="{lng: 116.41088, lat: 39.998774}">custom overlay</CustomOverlay>
</map>
```
## Map
### props
|Prop name|Type|Default|Description|
|---|---|---|---|
|`center`|`string \| [number, number] \| { lng: number, lat: number } \| BMapGL.Point`|`'116.41088,39.898774'`|中心位置|
|`zoom`|`number`|`12`|缩放级别|
|`minZoom`|`number`|`1`|最小缩放级别|
|`maxZoom`|`number`|`20`|最大缩放级别|
|`mapType`|`normal \| earth`|`normal`|地图类型，普通地图或地球模式|
|`heading`|`number`|`0`|地图旋转角度|
|`tilt`|`number`|`0`|地图倾斜角度|
|`enableRotate`|`boolean`|`true`|是否允许旋转|
|`enableTilt`|`boolean`|`true`|是否允许倾斜|
|`enableDragging`|`boolean`|`true`|是否允许拖拽|
|`enableScrollWheelZoom`|`boolean`|`true`|是否允许鼠标滚轮缩放|
|`enableDoubleClickZoom`|`boolean`|`true`|是否允许鼠标双击缩放|
|`enableInertialDragging`|`boolean`|`true`|是否允许惯性拖拽|
|`mapStyleV2`|`BMapGL.MapStyleV2`|-|个性化地图样式|

### 获取 map 实例
```javascript
setup() {
    const mapComp = ref()
    onMounted(() => {
        console.log(mapComp.value?.map)
    })
    return { mapComp }
}
```

## CustomOverlay
### props
|Prop name|Type|Default|Description|
|---|---|---|---|
|`position`|`string \| [number, number] \| { lng: number, lat: number } \| BMapGL.Point`|`required`|坐标|
|`coordType`|`bd09ll \| bd09mc`|`bd09ll`|坐标类型，百度经纬度坐标或百度墨卡托坐标|
|`zIndex`|`number`|-|层级|
|`renderOutSize`|`number`|`0`|元素位置在超出视图外多少像素后停止渲染|
|`renderLevel`|`[number, number] \| number`|-|在地图缩放层级范围显示[min, max] \| min|
|`autoViewport`|`boolean`|-|是否在组件创建后自动聚焦到位置|

## Circle
|Prop name|Type|Default|Description|
|---|---|---|---|
|`center`|`string \| [number, number] \| { lng: number, lat: number } \| BMapGL.Point`|`required`|圆心坐标|
|`radius`|`number`|`required`|半径，单位为米|
|`strokeColor`|`string`|-| 描边的颜色，同CSS颜色|
|`strokeWeight`|`number`|-| 描边的宽度，单位为像素|
|`strokeOpacity`|`number`|-| 描边的透明度，范围 `0-1`|
|`strokeStyle`| `solid \| dashed \| dotted` |-| 设置描边为实线、虚线、或者点状线 |
|`fillColor`| `string` |-| 面填充颜色，同CSS颜色|
|`fillOpacity`| `number` |-| 面填充的透明度，范围 `0-1`|
|`enableMassClear`| `boolean`|-| 可通过 `map.clearOverlays()` 方法移除 |
|`enableEditing`| `boolean` |-| 开启可编辑模式 |
|`autoViewport`| `boolean` |-| 自动聚焦视野|

## polygon
|Prop name|Type|Default|Description|
|---|---|---|---|
|`points`|`string[] \| [number, number][] \| { lng: number, lat: number }[] \| BMapGL.Point[]`|`required`|坐标点数组|
|`strokeColor`|`string`|-| 描边的颜色，同CSS颜色|
|`strokeWeight`|`number`|-| 描边的宽度，单位为像素|
|`strokeOpacity`|`number`|-| 描边的透明度，范围 `0-1`|
|`strokeStyle`| `solid \| dashed \| dotted` |-| 设置描边为实线、虚线、或者点状线 |
|`fillColor`| `string` |-| 面填充颜色，同CSS颜色|
|`fillOpacity`| `number` |-| 面填充的透明度，范围 `0-1`|
|`enableMassClear`| `boolean`|-| 可通过 `map.clearOverlays()` 方法移除 |
|`enableEditing`| `boolean` |-| 开启可编辑模式 |
|`autoViewport`| `boolean` |-| 自动聚焦视野|

## polyline
|Prop name|Type|Default|Description|
|---|---|---|---|
|`points`|`string[] \| [number, number][] \| { lng: number, lat: number }[] \| BMapGL.Point[]`|`required`|坐标点数组|
|`strokeColor`|`string`|-| 描边的颜色，同CSS颜色|
|`strokeWeight`|`number`|-| 描边的宽度，单位为像素|
|`strokeOpacity`|`number`|-| 描边的透明度，范围 `0-1`|
|`strokeStyle`| `solid \| dashed \| dotted` |-| 设置描边为实线、虚线、或者点状线 |
|`enableMassClear`| `boolean`|-| 可通过 `map.clearOverlays()` 方法移除 |
|`enableEditing`| `boolean` |-| 开启可编辑模式 |
|`autoViewport`| `boolean` |-| 自动聚焦视野|



