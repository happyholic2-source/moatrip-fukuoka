export type Lodging={name:string;address:string;latitude:number;longitude:number};
export type TripSettings={startDate:string;endDate:string;arrivalTime:string;departureTime:string;lodging:Lodging|null};
export const defaultSettings:TripSettings={startDate:'',endDate:'',arrivalTime:'12:00',departureTime:'18:00',lodging:null};
export function validateSettings(s:TripSettings){
 const parse=(v:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('날짜는 YYYY-MM-DD 형식으로 입력해줘.');const [y,m,d]=v.split('-').map(Number);const date=new Date(Date.UTC(y,m-1,d));if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)throw Error('유효한 날짜를 입력해줘.');return date.getTime()};
 const a=parse(s.startDate),b=parse(s.endDate),days=Math.round((b-a)/86400000)+1;
 if(days<1||days>30)throw Error('종료일은 시작일 이후여야 하며 최대 30일까지 가능해.');
 for(const t of [s.arrivalTime,s.departureTime])if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(t))throw Error('시간은 24시간제 HH:MM 형식으로 입력해줘.');
 if(!s.lodging)throw Error('숙소를 Google 장소 검색으로 선택해줘.');
 return {days,nights:days-1};
}
export const timeToMinutes=(v:string)=>{const [h,m]=v.split(':').map(Number);return h*60+m};
