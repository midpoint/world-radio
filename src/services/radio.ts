import type { Station } from '../types'
const HOSTS=['https://de1.api.radio-browser.info','https://at1.api.radio-browser.info','https://nl1.api.radio-browser.info']
const mem=new Map<string,{at:number,data:Station[]}>()
let controller:AbortController|null=null
type Raw=Record<string,any>
const normalize=(s:Raw):Station=>({id:s.stationuuid,name:(s.name||'Unknown station').trim(),streamUrl:s.url_resolved||s.url,homepage:s.homepage||undefined,logo:s.favicon||undefined,countryCode:s.countrycode||undefined,countryName:s.country||undefined,region:s.state||undefined,languages:(s.language||'').split(',').map((x:string)=>x.trim()).filter(Boolean),tags:(s.tags||'').split(',').map((x:string)=>x.trim()).filter(Boolean).slice(0,5),codec:s.codec||undefined,bitrate:+s.bitrate||undefined,latitude:Number.isFinite(+s.geo_lat)?+s.geo_lat:undefined,longitude:Number.isFinite(+s.geo_long)?+s.geo_long:undefined,hasReliableGeo:Number.isFinite(+s.geo_lat)&&Number.isFinite(+s.geo_long)&&!(+s.geo_lat===0&&+s.geo_long===0),votes:+s.votes||0,clickCount:+s.clickcount||0,isAvailable:s.lastcheckok===1})
async function request(params:Record<string,string|number>,ttl=10*60e3){
 const query=new URLSearchParams(Object.entries({...params,hidebroken:'true'}).map(([k,v])=>[k,String(v)])),key=query.toString(),cached=mem.get(key)
 if(cached&&Date.now()-cached.at<ttl)return cached.data
 controller?.abort();controller=new AbortController();let err:unknown
 for(const host of HOSTS){try{const res=await fetch(`${host}/json/stations/search?${query}`,{signal:controller.signal,headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`HTTP ${res.status}`);const data=((await res.json()) as Raw[]).map(normalize);mem.set(key,{at:Date.now(),data});return data}catch(e){if((e as Error).name==='AbortError')throw e;err=e}}
 throw err||new Error('电台目录暂时不可用')
}
export const radioApi={
 byCountry:(code:string,offset=0,tag='',language='')=>request({countrycode:code,limit:30,offset,order:'votes',reverse:'true',...(tag?{tag}:{}),...(language?{language}:{})},30*60e3),
 search:(q:string)=>request({name:q,limit:20,order:'votes',reverse:'true'}),
 byTag:(tag:string)=>request({tag,limit:30,order:'votes',reverse:'true'}),
 detail:async(id:string)=>(await request({stationuuid:id,limit:1},10*60e3))[0]
}
