const rand = ({ min, max }) => Math.floor(Math.random() * max) + min;

const generateCheckerboard = ({ width, height }) => {
  const wrapperEl = document.createElement('div');
  const tableEl = document.createElement('table');
  wrapperEl.appendChild(tableEl);

  const cells = {};
  
  let id = 0;
  for (let y = 0; y < height; y += 1) {
    const rowEl = document.createElement('tr');
    tableEl.appendChild(rowEl);

    for (let x = 0; x < width; x += 1) {
      const cellEl = document.createElement('td');
      rowEl.appendChild(cellEl);

      const cell = {
        id,
        coords: {
          x,
          y,
        },
        value: rand({ min: 1, max: 10 }),
        el: cellEl,
      };

      cells[[x, y]] = cell;

      cellEl.title = `x = ${x}, y = ${y}`;
      cellEl.innerText = cell.value;

      id++;
    }
  }

  const lowerLeftCell = cells[[0, height - 1]];

  const computePaths = () => {
    const paths = [];
    let bestPaths = [];
    let bestValue = 0;
    let pathValue = 0;

    const traversePath = (path, pathValue, x, y) => {
      const cell = cells[[x, y]];
      path.push(cell);
      pathValue += cell.value;

      if (x === width - 1 && y === 0) {
        // This is the upperRightCell. End of the road!
        paths.push({
          path,
          value: pathValue,
        });

        if (pathValue >= bestValue) {
          if (pathValue > bestValue) {
            // This is a new record! Forget the previous paths!
            bestPaths = [path];
            bestValue = pathValue;
          } else {
            // This value is as good as a previous path; add the current path to the hall of fame
            bestPaths.push(path);
          }
        }

        return;
      }

      if (x < width - 1 && y > 0) {
        // We can go in both directions
        traversePath([...path], pathValue, x + 1, y);
        traversePath([...path], pathValue, x, y - 1);
      } else if (x === width - 1) {
        // We can only go top
        traversePath([...path], pathValue, x, y - 1);
      } else if (y === 0) {
        // We can only go right
        traversePath([...path], pathValue, x + 1, y);
      }
    };

    traversePath([], pathValue, lowerLeftCell.coords.x, lowerLeftCell.coords.y);

    return {
      paths,
      bestPaths,
      bestValue,
    };
  };

  const { paths, bestPaths, bestValue } = computePaths();

  let resultMessage = `Out of <strong>${paths.length}</strong> different paths, there is `;
  if (bestPaths.length > 1) {
    resultMessage += `<strong>${bestPaths.length}</strong> different paths to achieve the best score of <strong>${bestValue}</strong>:<br />`;
  } else {
    resultMessage += `one path to achieve the best score of <strong>${bestValue}</strong>:<br />`;
  }

  bestPaths.forEach((path) => {
    const pathWay = path.map((cell) => cell.value);
    resultMessage += `${pathWay.join(' + ')}<br />`;
  });

  const paragraphEl = document.createElement('p');
  wrapperEl.appendChild(paragraphEl);
  paragraphEl.innerHTML = resultMessage;

  return {
    el: wrapperEl,
    cells,
  };
};

const init = () => {
  const rootEl = document.querySelector('#root');

  let width;
  let height;

  const inputButtons = document.querySelectorAll('input[type="number"');
  const submitButton = document.querySelector('input[type="submit"');

  submitButton.addEventListener('click', () => {
    width = inputButtons[0].value;
    height = inputButtons[1].value;

    rootEl.innerHTML = '';

    const board = generateCheckerboard({ width, height });
    rootEl.appendChild(board.el);
  });



};

document.addEventListener('DOMContentLoaded', () => {
  init();
});
