# 모아트립 SDK 58 마이그레이션

이 프로젝트는 Expo SDK 58 / React Native 0.88 / React 19.3 기준으로 변경한 소스입니다.

## 실행 (Node.js 22.13+ 또는 24.3+)

```bash
npm install
npx expo install --fix
npx expo-doctor
npm run check
npx expo start --clear
```

`*`로 표기된 Expo 네이티브 의존성은 `npx expo install --fix`가 SDK 58 호환 버전으로 맞춥니다. 성공한 뒤 생성된 `package-lock.json`을 커밋하세요.

## Google Maps

`FUKUOKA_SETUP.md`를 참고하여 Android/iOS Maps SDK 키를 설정하세요. `react-native-maps` 네이티브 Google 지도는 플랫폼과 Expo Go 버전에 따라 development build가 필요할 수 있습니다. `npx expo run:android` 또는 `npx expo run:ios`로 빌드하세요. `app.json`의 예시 키를 실제 키로 바꾸고 플랫폼별 앱 제한을 적용하세요.

## 알려진 제한

- 이번 작업은 SDK 58 대응이며, **실제 도보 경로 API 연동은 아직 없습니다.** 일정 계산은 직선거리 기반 근사치입니다.
- Places REST 호출에 쓰이는 `EXPO_PUBLIC_` 키는 앱에 노출됩니다. 프로덕션에서는 Places 요청을 서버로 옮기고 서버 키를 보호해야 합니다.
- Supabase SQL의 공유방 RLS는 개발용이며 실제 서비스 배포 전에 멤버십 기반으로 바꿔야 합니다.
- 이 환경에서 npm 레지스트리 네트워크 접근이 실패하여 의존성 설치, 타입 검사, 실제 기기 실행은 검증하지 못했습니다.
