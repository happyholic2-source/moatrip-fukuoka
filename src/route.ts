export type Place = { id: string; name: string; category: '맛집'|'카페'|'관광'|'기타'; latitude: number; longitude: number; created_by: string; created_at?: string };
export const distanceKm = (a: Pick<Place,'latitude'|'longitude'>, b: Pick<Place,'latitude'|'longitude'>) => {
  const rad = Math.PI / 180, dLat = (b.latitude-a.latitude)*rad, dLon = (b.longitude-a.longitude)*rad;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.latitude*rad)*Math.cos(b.latitude*rad)*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
};
// Open route: nearest-neighbor seed + 2-opt. Distance is great-circle approximation, not road travel time.
export function optimizeRoute(places: Place[], start?: {latitude:number;longitude:number}): Place[] {
  if (places.length < 2) return [...places];
  const remaining = [...places], ordered: Place[] = [];
  let cursor = start ?? remaining[0];
  if (!start) ordered.push(remaining.shift()!);
  while (remaining.length) {
    let best = 0;
    for(let i=1;i<remaining.length;i++) if(distanceKm(cursor,remaining[i]) < distanceKm(cursor,remaining[best])) best=i;
    const next = remaining.splice(best,1)[0]; ordered.push(next); cursor=next;
  }
  const length = (route:Place[]) => (start ? distanceKm(start,route[0]) : 0) + route.slice(1).reduce((sum,p,i)=>sum+distanceKm(route[i],p),0);
  let improved=true, rounds=0;
  while(improved && rounds++<30) {
    improved=false;
    for(let i= start?0:1;i<ordered.length-1;i++) for(let j=i+1;j<ordered.length;j++) {
      const candidate=[...ordered.slice(0,i),...ordered.slice(i,j+1).reverse(),...ordered.slice(j+1)];
      if(length(candidate)+1e-8<length(ordered)) {ordered.splice(0,ordered.length,...candidate);improved=true;}
    }
  }
  return ordered;
}
