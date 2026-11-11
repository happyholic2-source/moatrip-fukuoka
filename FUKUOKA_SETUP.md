# 후쿠오카 / Google Maps 개발 설정 (v0.2)

- 초기 지도 중심: 후쿠오카시 (33.5902, 130.4017)
- Google Maps 지도 렌더링: `react-native-maps`의 `PROVIDER_GOOGLE`
- Google Places API (New) Text Search: 앱 상단에서 검색 후 결과를 선택하여 장소 저장
- 기존 공유방 / 장소 선택 / 직선거리 기반 방문 순서 추천은 유지

## Google Cloud 설정
1. Google Cloud 프로젝트를 만들고 결제 계정을 연결합니다. 사용량에 따라 요금이 청구될 수 있습니다.
2. Maps SDK for Android, Maps SDK for iOS, Places API (New)를 활성화합니다.
3. `app.json`의 `YOUR_ANDROID_GOOGLE_MAPS_SDK_KEY` 및 `YOUR_IOS_GOOGLE_MAPS_SDK_KEY`를 실제 **플랫폼별로 제한된** 키로 바꿉니다.
4. `.env.example`을 `.env`로 복사하고 `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`를 설정합니다.
5. Google Maps의 iOS/Android 네이티브 설정에는 개발 빌드가 필요할 수 있습니다. Expo Go에서 모든 네이티브 설정이 적용된다고 가정하지 마세요. `npx expo run:android` 또는 `npx expo run:ios` 등으로 개발 빌드를 만듭니다.

## 보안 / 출시 전 필수 작업
`EXPO_PUBLIC_*` 키는 앱 사용자에게 노출됩니다. Places Web Service 키를 공개 앱에서 직접 호출하는 현재 코드는 **개발용 프로토타입**이며 배포하면 안 됩니다. 정식 앱에서는 Places 요청을 인증 및 요청 제한을 적용한 서버/Edge Function으로 옮기고 서버 키는 서버 비밀 환경변수에 저장하세요. 지도 SDK 키는 Android 패키지+서명, iOS 번들 ID 등으로 제한하세요.

## 아직 미구현
- Google Routes API를 통한 실제 도로/도보/대중교통 이동시간 기반 최적화
- 도로를 따라 그리는 polyline 및 실시간 교통 반영
- 영업시간과 일정 제약, 안전한 여행방 멤버 권한

현재 동선 화면의 거리는 **직선거리 근사치**입니다. Google 지도 SDK를 사용한다고 자동으로 도로 경로 최적화가 되는 것은 아닙니다.
