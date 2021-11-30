import { optimizeScroll } from './utils';

let port: chrome.runtime.Port;

type CursorProps = { name: string };
function Cursor({
  name,
}: CursorProps) {
  const $element = document.createElement('div');
  $element.style.position = 'absolute';
  $element.style.zIndex = '99999';
  $element.style.pointerEvents = 'none';
  // TODO: transform 기반으로 변경
  // $element.style.willChange = 'transform'

  $element.innerHTML = `
    <div style="position: absolute; top: 10px; left: 10px; padding: 4px 8px; background: #efefef; border-radius: 50%; border-top-left-radius: 0;">${name}</div>
  `;


  const move = ({ x, y }: { x: number, y: number }) => {
    $element.style.left = `${x}px`;
    $element.style.top = `${y}px`;
    // transform: translate3d(1009px, 526px, 0px);
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
              const { x, y } = payload;
              peerCursor.move({ x, y });
              break;
            }
          }
        });
      }
    }
  }
);



