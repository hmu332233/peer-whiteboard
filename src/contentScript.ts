import { optimizeScroll, getSelectorFromCursor } from './utils';

let port: chrome.runtime.Port;

type CursorProps = { name: string };
function Cursor({
  name,
}: CursorProps) {
  const $element = document.createElement('div');
  $element.style.position = 'absolute';
  $element.style.zIndex = '99999';
  $element.style.top = '0';
  $element.style.left = '0';

  const $cursor = document.createElement('div');
  $cursor.style.willChange = 'transform';
  $cursor.innerHTML = `
    <div style="position: absolute; top: 10px; left: 10px; padding: 4px 8px; background: #efefef; border-radius: 50%; border-top-left-radius: 0;">${name}</div>
  `;

  $element.appendChild($cursor);

  const move = ({ x, y }: { x: number, y: number }) => {
    $cursor.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

  return {
    element: $element,
    move,
  }
}

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    const { key, payload } = message;

    switch (key) {
      case 'init': {
        const myCursor = Cursor({ name: 'me' });
        const peerCursor = Cursor({ name: 'peer' });

        let peerHighlightElement; // NOTE: 컨셉 코드 (삭제 필요)
        
        const updateDisplay = (event: MouseEvent) => {
          myCursor.move({
            x: event.pageX,
            y: event.pageY,
          });
          if (port) {
            port.postMessage({
              key: 'mousemove',
              payload: {
                x: event.pageX,
                y: event.pageY,
                selector: getSelectorFromCursor(event.clientX, event.clientY),
              }
            });
          }
        }

        port = chrome.runtime.connect({ name: 'peer-whiteboard' });
        port.onMessage.addListener(message => {
          console.log('port', message);
          const { key, payload } = message;
          switch (key) {
            case 'connected': {
              document.body.addEventListener("mousemove", optimizeScroll(updateDisplay), false);
              document.body.append(myCursor.element);
              document.body.append(peerCursor.element);
              break;
            }
            case 'mousemove': {
              peerHighlightElement?.classList.remove('mu-active'); // NOTE: 컨셉 코드 (삭제 필요)

              const { x, y, selector } = payload;
              const element = document.querySelector(selector);
              
              if (!element) {
                return;
              }
              peerHighlightElement = element; // NOTE: 컨셉 코드 (삭제 필요)
              element.classList.add('mu-active'); // NOTE: 컨셉 코드 (삭제 필요)

              const rect = element.getBoundingClientRect(); // NOTE: 컨셉 코드 (삭제 필요)
              console.log('rect', rect); // NOTE: 컨셉 코드 (삭제 필요)
              peerCursor.move({ x: rect.left, y: rect.top }); // NOTE: 컨셉 코드 (삭제 필요)
              // peerCursor.move({ x, y });
              break;
            }
          }
        });
      }
    }
  }
);



