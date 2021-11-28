import { optimizeScroll } from './utils';


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

const myCursor = Cursor({ name: 'test' });

function updateDisplay(event: MouseEvent) {
  myCursor.move({
    x: event.pageX,
    y: event.pageY,
  });
}

document.body.addEventListener("mousemove", optimizeScroll(updateDisplay), false);
document.body.append(myCursor.element);

console.log('create!')


chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    const { key, payload } = message;
    console.log(message);
  }
);
