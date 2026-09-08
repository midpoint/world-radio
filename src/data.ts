import type { Place } from './types'
export const PLACES: Place[] = [
{code:'CN',name:'China',nameZh:'中国',lat:35,lng:104,timezone:'Asia/Shanghai',aliases:['china','中国','cn','北京','beijing','上海','shanghai','广州'],flag:'🇨🇳'},
{code:'JP',name:'Japan',nameZh:'日本',lat:36.2,lng:138.2,timezone:'Asia/Tokyo',aliases:['japan','日本','jp','东京','tokyo','大阪'],flag:'🇯🇵'},
{code:'US',name:'United States',nameZh:'美国',lat:38,lng:-97,timezone:'America/New_York',aliases:['usa','united states','美国','us','纽约','new york'],flag:'🇺🇸'},
{code:'GB',name:'United Kingdom',nameZh:'英国',lat:54,lng:-2,timezone:'Europe/London',aliases:['uk','united kingdom','英国','gb','伦敦','london'],flag:'🇬🇧'},
{code:'FR',name:'France',nameZh:'法国',lat:46.2,lng:2.2,timezone:'Europe/Paris',aliases:['france','法国','fr','巴黎','paris'],flag:'🇫🇷'},
{code:'DE',name:'Germany',nameZh:'德国',lat:51.2,lng:10.4,timezone:'Europe/Berlin',aliases:['germany','德国','de','柏林'],flag:'🇩🇪'},
{code:'IT',name:'Italy',nameZh:'意大利',lat:42.8,lng:12.8,timezone:'Europe/Rome',aliases:['italy','意大利','it','罗马'],flag:'🇮🇹'},
{code:'ES',name:'Spain',nameZh:'西班牙',lat:40.4,lng:-3.7,timezone:'Europe/Madrid',aliases:['spain','西班牙','es','马德里'],flag:'🇪🇸'},
{code:'BR',name:'Brazil',nameZh:'巴西',lat:-10,lng:-52,timezone:'America/Sao_Paulo',aliases:['brazil','巴西','br','里约'],flag:'🇧🇷'},
{code:'AU',name:'Australia',nameZh:'澳大利亚',lat:-25,lng:133,timezone:'Australia/Sydney',aliases:['australia','澳大利亚','澳洲','au','悉尼'],flag:'🇦🇺'},
{code:'CA',name:'Canada',nameZh:'加拿大',lat:56,lng:-106,timezone:'America/Toronto',aliases:['canada','加拿大','ca','多伦多'],flag:'🇨🇦'},
{code:'IN',name:'India',nameZh:'印度',lat:21,lng:78,timezone:'Asia/Kolkata',aliases:['india','印度','in','孟买','德里'],flag:'🇮🇳'},
{code:'KR',name:'South Korea',nameZh:'韩国',lat:36,lng:128,timezone:'Asia/Seoul',aliases:['korea','south korea','韩国','kr','首尔'],flag:'🇰🇷'},
{code:'RU',name:'Russia',nameZh:'俄罗斯',lat:61,lng:99,timezone:'Europe/Moscow',aliases:['russia','俄罗斯','ru','莫斯科'],flag:'🇷🇺'},
{code:'MX',name:'Mexico',nameZh:'墨西哥',lat:23,lng:-102,timezone:'America/Mexico_City',aliases:['mexico','墨西哥','mx'],flag:'🇲🇽'},
{code:'ZA',name:'South Africa',nameZh:'南非',lat:-30,lng:25,timezone:'Africa/Johannesburg',aliases:['south africa','南非','za'],flag:'🇿🇦'},
{code:'AR',name:'Argentina',nameZh:'阿根廷',lat:-34,lng:-64,timezone:'America/Argentina/Buenos_Aires',aliases:['argentina','阿根廷','ar'],flag:'🇦🇷'},
{code:'NL',name:'Netherlands',nameZh:'荷兰',lat:52.1,lng:5.3,timezone:'Europe/Amsterdam',aliases:['netherlands','holland','荷兰','nl'],flag:'🇳🇱'},
{code:'SE',name:'Sweden',nameZh:'瑞典',lat:62,lng:15,timezone:'Europe/Stockholm',aliases:['sweden','瑞典','se'],flag:'🇸🇪'},
{code:'NZ',name:'New Zealand',nameZh:'新西兰',lat:-41,lng:174,timezone:'Pacific/Auckland',aliases:['new zealand','新西兰','nz'],flag:'🇳🇿'}]
export const TAGS=[['pop','流行'],['jazz','爵士'],['classical','古典'],['rock','摇滚'],['electronic','电子'],['news','新闻'],['talk','谈话'],['folk','民谣'],['ambient','环境'],['world','世界音乐']]
export const findPlace=(q:string)=>PLACES.find(p=>[p.code,p.name,p.nameZh,...p.aliases].some(x=>x.toLowerCase().includes(q.toLowerCase())))
