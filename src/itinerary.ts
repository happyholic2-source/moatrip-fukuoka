import {Place,distanceKm,optimizeRoute} from './route';
import {TripSettings,timeToMinutes,validateSettings} from './tripSettings';
export type DayPlan={day:number;date:string;places:Place[];walkingKm:number;walkingMinutes:number;visitMinutes:number;availableMinutes:number;startTime:string;endTime:string};
export type TripPlan={nights:number;days:number;daily:DayPlan[];unassigned:Place[];note:string};
const visit=(p:Place)=>p.category==='맛집'?75:p.category==='카페'?60:p.category==='관광'?100:60;
const minutes=(km:number)=>km/4*60;
const format=(n:number)=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
// Approximate itinerary only: great-circle distances, not actual walking paths.
// First/last day buffers allow time for airport transfers and check-in/out; adjust later to user needs.
export function makeTripPlan(places:Place[],settings:TripSettings):TripPlan{
 const {days,nights}=validateSettings(settings);const lodging=settings.lodging!;
 const remaining=[...places];const daily:DayPlan[]=[];
 for(let d=1;d<=days;d++){
  const arrival=timeToMinutes(settings.arrivalTime),departure=timeToMinutes(settings.departureTime);
  const start=d===1?Math.max(9*60,arrival+90):9*60;
  const end=d===days?Math.min(20*60,departure-120):20*60;
  const available=Math.max(0,end-start);
  const chosen:Place[]=[];let used=0;let cursor=lodging;
  while(remaining.length&&chosen.length<6){
   let best=-1,score=Infinity;
   for(let i=0;i<remaining.length;i++){
    const p=remaining[i],dist=distanceKm(cursor,p);
    const estimate=minutes(dist)+visit(p)+minutes(distanceKm(p,lodging));
    if(used+estimate<=available&&dist<score){score=dist;best=i;}
   }
   if(best<0)break;
   const next=remaining.splice(best,1)[0];used+=minutes(distanceKm(cursor,next))+visit(next);cursor=next;chosen.push(next);
  }
  const ordered=optimizeRoute(chosen,lodging);
  const walkingKm=ordered.length?distanceKm(lodging,ordered[0])+ordered.slice(1).reduce((sum,p,i)=>sum+distanceKm(ordered[i],p),0)+distanceKm(ordered[ordered.length-1],lodging):0;
  const date=new Date(Date.parse(settings.startDate+'T00:00:00Z')+(d-1)*86400000).toISOString().slice(0,10);
  daily.push({day:d,date,places:ordered,walkingKm,walkingMinutes:Math.round(minutes(walkingKm)),visitMinutes:ordered.reduce((s,p)=>s+visit(p),0),availableMinutes:available,startTime:format(start),endTime:format(end)});
 }
 return {nights,days,daily,unassigned:remaining,note:'숙소를 출발·복귀 지점으로 사용하고 도착 후 90분, 출발 전 120분의 여유를 가정했어. 직선거리·시속 4km 기반의 임시 계산이며 Google 실제 도보 경로, 공항 이동, 영업시간은 반영되지 않았어.'};
}
