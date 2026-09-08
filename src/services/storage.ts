import { openDB } from 'idb'
import type { Station } from '../types'
const dbp=openDB('world-radio',1,{upgrade(db){db.createObjectStore('favorites',{keyPath:'id'});db.createObjectStore('history',{keyPath:'id'})}})
export async function listSaved(store:'favorites'|'history'){return (await (await dbp).getAll(store) as (Station&{savedAt:number})[]).sort((a,b)=>b.savedAt-a.savedAt)}
export async function saveStation(store:'favorites'|'history',s:Station){
 const plainStation=JSON.parse(JSON.stringify(s)) as Station
 await (await dbp).put(store,{...plainStation,savedAt:Date.now()})
}
export async function removeStation(store:'favorites'|'history',id:string){await (await dbp).delete(store,id)}
export async function clearStore(store:'favorites'|'history'){await (await dbp).clear(store)}
export async function clearAll(){const db=await dbp;await Promise.all([db.clear('favorites'),db.clear('history')]);localStorage.removeItem('wr-settings')}
