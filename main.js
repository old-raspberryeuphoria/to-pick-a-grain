const rand = ({ min, max }) => Math.floor(Math.random() * max) + min;

const generateCheckerboard = ({ width, height }) => {
  const wrapperEl = document.createElement('div');
  const tableEl = document.createElement('table');
  wrapperEl.appendChild(tableEl);
  wrapperEl.className = 'wrapper';

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
        value: rand({ min: 1, max: 99 }),
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

    const moveRight = (path, pathValue, x, y) => traversePath([...path], pathValue, x + 1, y);
    const moveTop = (path, pathValue, x, y) => traversePath([...path], pathValue, x, y - 1);

    const traversePath = (path, pathValue, x, y) => {
      const cell = cells[[x, y]];
      path.push(cell);
      pathValue += cell.value;

      if (x === width - 1 && y === 0) {
        // This is the upperRightCell. End of the road!
        paths.push({
          cells,
          pathValue: pathValue,
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
        moveRight(path, pathValue, x, y);
        moveTop(path, pathValue, x, y);
      } else if (x === width - 1) {
        // We can only go top
        moveTop(path, pathValue, x, y);
      } else if (y === 0) {
        // We can only go right
        moveRight(path, pathValue, x, y);
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

  const paragraphEl = document.createElement('p');
  wrapperEl.appendChild(paragraphEl);

  let resultMessage = `Out of <strong>${paths.length}</strong> different paths, there is `;
  if (bestPaths.length > 1) {
    resultMessage += `<strong>${bestPaths.length}</strong> different paths to achieve the best score of <strong>${bestValue}</strong>:`;
  } else {
    resultMessage += `one path to achieve the best score of <strong>${bestValue}</strong>:`;
  }

  paragraphEl.innerHTML = resultMessage;

  const pathsListEl = document.createElement('ul');
  wrapperEl.appendChild(pathsListEl);

  bestPaths.forEach((path) => {
    const pathWay = path.map((cell) => cell.value);
    const pathEl = document.createElement('li');
    pathsListEl.appendChild(pathEl);
    pathEl.innerHTML = pathWay.join(' + ');

    path.enableHighlight = () => {
      pathEl.classList.add('highlighted');

      path.forEach((cell) => {
        cell.el.classList.add('highlighted');
      });
    };

    path.disableHighlight = () => {
      pathEl.removeAttribute('class');

      path.forEach((cell) => {
        cell.el.removeAttribute('class');
      });
    };

    if (bestPaths.length === 1) {
      path.enableHighlight();
    }
  });

  if (bestPaths.length > 1) {
    let i = 0;

    setInterval(() => {
      if (bestPaths[i - 1]) {
        bestPaths[i - 1].disableHighlight();
      } else {
        bestPaths[bestPaths.length - 1].disableHighlight();
      }
  
      bestPaths[i].enableHighlight();
  
      if (i === bestPaths.length - 1) {
        i = 0;
      } else {
        i++;
      }
    }, 1000);
  }

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
