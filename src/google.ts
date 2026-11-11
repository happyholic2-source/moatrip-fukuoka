export type GooglePlace = {id:string;name:string;address:string;latitude:number;longitude:number};
const key=process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
export async function searchFukuokaPlaces(query:string):Promise<GooglePlace[]>{
 if(!key) throw new Error('Google Places API 키가 설정되지 않았어.');
 const response=await fetch('https://places.googleapis.com/v1/places:searchText',{
  method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'places.id,places.displayName,places.formattedAddress,places.location'},
  body:JSON.stringify({textQuery:`${query} 福岡市 日本`,languageCode:'ko',regionCode:'JP',locationBias:{circle:{center:{latitude:33.5902,longitude:130.4017},radius:18000}},maxResultCount:10})
 });
 const data=await response.json();if(!response.ok)throw new Error(data.error?.message??'장소 검색 실패');
 return (data.places??[]).filter((p:any)=>p.location?.latitude&&p.location?.longitude).map((p:any)=>({id:p.id,name:p.displayName?.text??'이름 없음',address:p.formattedAddress??'',latitude:p.location.latitude,longitude:p.location.longitude}));
}
