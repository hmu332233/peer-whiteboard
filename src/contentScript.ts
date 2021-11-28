import { optimizeScroll } from './utils';

let port;

type CursorProps = { name: string };
function Cursor({
  name,
}: CursorProps) {
  const $element = document.createElement('div');
  $element.innerText = name;
  $element.style.position = 'absolute';
  $element.style.zIndex = '99999';
  $element.style.pointerEvents = 'none';

  const move = ({ x, y }: { x: number, y: number }) => {
    $element.style.left = `${x}px`;
    $element.style.top = `${y}px`;
  }

  return {
    element: $element,
    move,
  }
}

const myCursor = Cursor({ name: 'me' });
const peerCursor = Cursor({ name: 'peer' });

function updateDisplay(event: MouseEvent) {
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

document.body.addEventListener("mousemove", optimizeScroll(updateDisplay), false);
document.body.append(myCursor.element);
document.body.append(peerCursor.element);

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    const { key, payload } = message;
    console.log(message);

    switch (key) {
      case 'init': {
        port = chrome.runtime.connect({ name: 'peer-whiteboard' });
        port.onMessage.addListener(message => {
          console.log('port', message);
          const { key, payload } = message;
          switch (key) {
            case 'mousemove': {
              const { x, y } = payload;
              peerCursor.move({ x, y });
            }
          }
        });
      }
    }
  }
);



