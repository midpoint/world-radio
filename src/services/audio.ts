import Hls from 'hls.js'
import type { Station,PlayerStatus } from '../types'
const isHlsUrl=(u:string)=>/\.m3u8($|\?)/i.test(u)
const isHlsStation=(s:Station,u:string)=>s.codec==='HLS'||isHlsUrl(u)

export class AudioEngine{
 audio=new Audio()
 hls:Hls|null=null
 timer:number|null=null
 generation=0
 volume=1
 muted=false
 live=false
 probing=false
 onState:(s:PlayerStatus,msg?:string)=>void=()=>{}
 constructor(){this.setupAudio()}
 private setupAudio(){
  const audio=this.audio,gen=this.generation
  audio.preload='none';audio.volume=this.volume;audio.muted=this.muted
  audio.addEventListener('playing',()=>{if(gen===this.generation){this.live=true;this.onState('playing')}})
  audio.addEventListener('pause',()=>{if(gen===this.generation&&audio.src)this.onState('paused')})
  audio.addEventListener('error',()=>{if(gen===this.generation&&!this.probing)this.onState('error',this.nativeErrorOf(audio))})
 }
 // HTTPS 页面优先尝试 https 升级地址，原 http 地址作为兜底
 private candidates(s:Station){
  const src=s.streamUrl
  if(location.protocol==='https:'&&src.startsWith('http:'))return [src.replace(/^http:/,'https:'),src]
  return [src]
 }
 private async playWithTimeout(audio:HTMLAudioElement){
  await Promise.race([audio.play(),new Promise<never>((_,reject)=>{this.timer=window.setTimeout(()=>reject(new Error('连接超时')),15000)})])
  if(this.timer){clearTimeout(this.timer);this.timer=null}
 }
 async play(station:Station){
  this.stop()
  const gen=this.generation,urls=this.candidates(station)
  this.live=false
  this.onState('loading')
  // hls.js 支持时走 MSE 路径；不支持（Safari/部分安卓）时由原生 <audio> 直接解码 HLS
  if(isHlsStation(station,urls[0])&&Hls.isSupported()){await this.playHls(urls,gen);return}
  // 原生流无需 CORS，逐个尝试候选地址
  const audio=this.audio
  this.probing=true
  let err:unknown=null
  for(const url of urls){
   try{audio.src=url;await this.playWithTimeout(audio);this.probing=false;return}
   catch(e){err=e;if(this.timer){clearTimeout(this.timer);this.timer=null}audio.removeAttribute('src');audio.load()}
  }
  this.probing=false
  this.onState('error',this.nativeFailMessage(audio,urls,err))
 }
 private async playHls(urls:string[],gen:number){
  let failed=''
  for(const url of urls){
   if(this.generation!==gen)return
   this.probing=true
   const ok=await new Promise<boolean>(resolve=>{
    const hls=this.hls=new Hls({enableWorker:true})
    hls.on(Hls.Events.ERROR,(_e,data)=>{
     if(this.generation!==gen)return
     if(!data.fatal)return
     failed=this.hlsFailMessage(data)
     hls.destroy();this.hls=null
     if(this.live){this.onState('error',failed);return}
     resolve(false)
    })
    hls.loadSource(url);hls.attachMedia(this.audio)
    this.playWithTimeout(this.audio).then(()=>{this.probing=false;resolve(true)})
     .catch(()=>{failed='连接直播流超时，请重试或尝试下一台';hls.destroy();this.hls=null;if(this.generation!==gen)return;if(this.live){this.onState('error',failed);return}resolve(false)})
   })
   if(ok||this.generation!==gen)return
  }
  this.probing=false
  if(this.generation===gen)this.onState('error',failed||'当前电台暂不可用，可能存在格式或地区限制')
 }
 private hlsFailMessage(data:any){
  if(data.type==='mediaError')return '该电台流格式无法在当前浏览器解码，请尝试下一台'
  if(!navigator.onLine)return '网络已断开，请恢复连接后重试'
  const status:number|undefined=data?.xhr?.status
  if(status===0||status===undefined)return '无法读取直播流：流服务器禁止跨域访问(CORS)或网络异常，请尝试下一台'
  return '无法读取直播流（HTTP '+status+'），请尝试下一台'
 }
 private nativeErrorOf(audio:HTMLAudioElement){
  if(!navigator.onLine)return '网络已断开，请恢复连接后重试'
  return '当前电台暂不可用，可能存在格式或地区限制'
 }
 private nativeFailMessage(audio:HTMLAudioElement,urls:string[],err:unknown){
  const pageHttps=location.protocol==='https:'
  const upgradedFailed=pageHttps&&urls.length===2&&urls[1].startsWith('http:')
  if((err as Error)?.message==='连接超时')return '连接直播流超时，请重试或尝试下一台'
  if(!navigator.onLine)return '网络已断开，请恢复连接后重试'
  if((err as Error)?.message.includes('NotAllowed'))return '浏览器阻止了自动播放，请再次点击播放'
  if(upgradedFailed&&audio.error?.code===4)return '该电台只提供 HTTP 流，且 HTTPS 升级失败：当前为 HTTPS 页面，浏览器禁止播放不安全的 HTTP 内容'
  return '当前电台暂不可用，可能存在格式或地区限制'
 }
 pause(){this.audio.pause()}
 async resume(){this.onState('loading');await this.audio.play()}
 stop(){
  this.generation++
  if(this.timer){clearTimeout(this.timer);this.timer=null}
  if(this.hls){this.hls.destroy();this.hls=null}
  this.live=false
  const old=this.audio
  old.pause();old.src='';old.removeAttribute('src');old.load()
  this.audio=new Audio();this.setupAudio()
 }
 setVolume(v:number){this.volume=v;this.audio.volume=v}
 setMuted(v:boolean){this.muted=v;this.audio.muted=v}
 destroy(){this.stop()}
}
