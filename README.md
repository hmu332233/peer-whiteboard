# peer-whiteboard

whale extension을 이용하여, 같은 페이지를 보고 있는 두 유저에게  
서로의 커서를 공유할 수 있는 서비스


https://user-images.githubusercontent.com/10302969/147124867-7422848c-f0eb-44b3-a1ca-e6822060af45.mp4

## 동작 원리
컨셉은 아래와 같은 경로로 커서 위치를 주고 받고, 브라우저에서 커서를 그린다.  
더 나아가서 실시간 채팅 등의 아이디어도 구현 가능

```
웹 페이지 <--[message]--> sidebar <--[Web RTC]--> sidebar <--[message]--> 웹 페이지
```

## 현 문제
MVP로 핵심 흐름까지는 구현되어 있으나  
상대방과 화면 크기가 동일하지 않는 이상, 커서 위치를 완벽하게 싱크를 맞추는게 불가능  
이를 해결할 방법이 생각 난다면 시도해볼 예정

**해결을 위한 아이디어**
- document.elementFromPoint()와 element를 이용한 query selector 조합
  - 기존 아이디어는 그냥 xy 좌표를 그대로 찍는거였는데 이제는 내 커서가 위치한 곳의 query selector를 넘겨주는 방식으로 이를 해결