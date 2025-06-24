import request from '@/utils/request0'

export function fetchSources(query) {
  return request({
    url: '/live-video-play/source',
    method: 'get',
    params: query
  })
}

export function deleteSource(id) {
  return request({
    url: `/live-video-play/source/${id}`,
    method: 'delete'
  })
}

export function updateSource(id, data) {
  return request({
    url: `/live-video-play/source/${id}`,
    method: 'put',
    data
  })
}

export function addSource(data) {
  return request({
    url: '/live-video-play/source',
    method: 'post',
    data
  })
}

export function fetchAddresses(sourceId) {
  return request({
    url: `/live-video-play/source/${sourceId}/addresses`,
    method: 'get'
  })
}

export function deleteAddress(id) {
  return request({
    url: `/live-video-play/address/${id}`,
    method: 'delete'
  })
}

export function updateAddress(id, data) {
  return request({
    url: `/live-video-play/address/${id}`,
    method: 'put',
    data
  })
}

export function addAddress(sourceId, data) {
  return request({
    url: `/live-video-play/source/${sourceId}/address`,
    method: 'post',
    data
  })
}

export function fetchAddressItems() {
  return request({
    url: '/live-video-play/address/items',
    method: 'get'
  })
}
