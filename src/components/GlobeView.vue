<script setup lang="ts">
import {onMounted,onBeforeUnmount,ref,watch} from 'vue'
import Globe from 'globe.gl'
import {feature} from 'topojson-client'
import atlas from 'world-atlas/countries-110m.json'
import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'
import type {Place,Station} from '../types'
countries.registerLocale(en)
const props=defineProps<{place:Place;stations:Station[];autoRotate:boolean;lowQuality:boolean;reduceMotion:boolean}>()
const emit=defineEmits<{selectCountry:[code:string];selectStation:[station:Station];interacted:[]}>()
const root=ref<HTMLElement>();let globe:any;let observer:ResizeObserver
const polygons=(feature(atlas as any,(atlas as any).objects.countries) as any).features
function codeOf(d:any){return countries.getAlpha2Code(d.properties?.name||'','en')||''}
function focus(){if(globe)globe.pointOfView({lat:props.place.lat,lng:props.place.lng,altitude:1.7},props.reduceMotion?0:1200)}
function points(){return props.stations.filter(s=>s.hasReliableGeo).slice(0,100)}
onMounted(()=>{if(!root.value)return;globe=(Globe as any)()(root.value)
 .backgroundColor('rgba(0,0,0,0)').showAtmosphere(true).atmosphereColor('#4fc3ff').atmosphereAltitude(.18)
 .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
 .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
 .polygonsData(polygons).polygonAltitude((d:any)=>codeOf(d)===props.place.code.toUpperCase() ? .01 : .006)
 .polygonCapColor((d:any)=>codeOf(d)===props.place.code?'rgba(59,206,255,.28)':'rgba(10,31,55,.08)')
 .polygonSideColor(()=> 'rgba(45,125,170,.08)').polygonStrokeColor(()=> 'rgba(111,207,255,.3)')
 .onPolygonClick((d:any)=>{const c=codeOf(d);if(c){emit('interacted');emit('selectCountry',c)}})
 .pointsData(points()).pointLat((d:any)=>d.latitude).pointLng((d:any)=>d.longitude).pointAltitude(.018)
 .pointRadius((d:any)=>d.id===props.stations[0]?.id ? .16 : .08).pointColor(()=> '#44e6ff').pointsMerge(false)
 .onPointClick((d:any)=>emit('selectStation',d as Station)).pointLabel((d:any)=>`<b>${d.name}</b><br>${d.region||d.countryName||''}`)
 const controls=globe.controls();controls.autoRotate=props.autoRotate;controls.autoRotateSpeed=.38;controls.enableDamping=true;controls.dampingFactor=.08
 controls.addEventListener('start',()=>emit('interacted'));observer=new ResizeObserver(()=>{if(root.value)globe.width(root.value.clientWidth).height(root.value.clientHeight)});observer.observe(root.value);focus()})
watch(()=>props.place,()=>{focus();if(globe){globe.polygonsData([...polygons])}},{deep:true})
watch(()=>props.stations,()=>globe?.pointsData(points()))
watch(()=>props.autoRotate,v=>{if(globe)globe.controls().autoRotate=v})
watch(()=>props.lowQuality,v=>{if(globe)globe.renderer().setPixelRatio(v?1:Math.min(devicePixelRatio,2))},{immediate:true})
onBeforeUnmount(()=>{observer?.disconnect();globe?._destructor?.()})
defineExpose({reset:()=>globe?.pointOfView({lat:15,lng:0,altitude:2.5},props.reduceMotion?0:1000),focus})
</script>
<template><div ref="root" class="globe" aria-label="可旋转缩放的 3D 地球"></div></template>
