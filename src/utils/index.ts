export type PointType = string | [number, number] | { lng: number, lat: number } | BMapGL.Point

export type OffsetType = number | [number, number] | { width: number, height: number } | BMapGL.Size

export function getPoint(point: PointType, isMC?: boolean): BMapGL.Point {
    let p: BMapGL.Point
    if (point instanceof BMapGL.Point) {
        p = point
    }
    else if (point instanceof Array) {
        p = new BMapGL.Point(point[0], point[1])
    }
    else if (typeof point === 'string') {
        const arr = point.split(',').map(x => parseFloat(x))
        p = new BMapGL.Point(arr[0], arr[1])
    }
    else if (point.lng && point.lat) {
        p = new BMapGL.Point(point.lng, point.lat)
    }
    else {
        p = new BMapGL.Point(0, 0)
    }

    if (isMC) {
        p = BMapGL.Projection.convertMC2LL(p)
    }

    return p
}

export function getOffsetSize(offset?: OffsetType): BMapGL.Size {
    if (typeof offset === 'number') {
        return new BMapGL.Size(offset, offset)
    }
    if (offset instanceof Array) {
        return new BMapGL.Size(offset[0], offset[1])
    }
    if (offset instanceof BMapGL.Size) {
        return offset
    }
    if (offset?.width !== undefined) {
        return new BMapGL.Size(offset.width, offset.height)
    }
    return new BMapGL.Size(10, 10)
}

export function isMC(type?: string) {
    return type === 'bd09mc'
}

export function getRenderLevel(level?: number | [number, number]):[number, number] {
    if (level === undefined) {
        return [0, 99]
    }
    if (typeof level === 'number') {
        return [level, level + 99]
    }
    return level.sort((a, b) => a - b)
}