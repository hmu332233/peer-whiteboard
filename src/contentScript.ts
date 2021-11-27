
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
    console.log(x, y);
  }

  return {
    element: $element,
    move,
  }
}

const myCursor = Cursor({ name: 'test' });

document.body.addEventListener("mousemove", optimizeScroll(updateDisplay), false);

function updateDisplay(event) {
  myCursor.move({
    x: event.pageX,
    y: event.pageY,
  });
}

document.body.append(myCursor.element);

console.log('create!')



function optimizeScroll(callback) {
  let ticking = false;
  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
};