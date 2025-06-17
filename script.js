const metroMap = {
  'Rajiv Chowk': {
    'Kashmere Gate': { time: 5, line: 'Yellow' },
    'Central Secretariat': { time: 4, line: 'Yellow' },
    'Barakhamba': { time: 3, line: 'Blue' }
  },
  'Kashmere Gate': {
    'Rajiv Chowk': { time: 5, line: 'Yellow' },
    'Civil Lines': { time: 3, line: 'Yellow' }
  },
  'Civil Lines': {
    'Kashmere Gate': { time: 3, line: 'Yellow' }
  },
  'Central Secretariat': {
    'Rajiv Chowk': { time: 4, line: 'Yellow' },
    'Hauz Khas': { time: 6, line: 'Yellow' }
  },
  'Hauz Khas': {
    'Central Secretariat': { time: 6, line: 'Yellow' },
    'Saket': { time: 4, line: 'Yellow' }
  },
  'Saket': {
    'Hauz Khas': { time: 4, line: 'Yellow' }
  },
  'Barakhamba': {
    'Rajiv Chowk': { time: 3, line: 'Blue' },
    'Mandi House': { time: 2, line: 'Blue' }
  },
  'Mandi House': {
    'Barakhamba': { time: 2, line: 'Blue' },
    'Yamuna Bank': { time: 5, line: 'Blue' }
  },
  'Yamuna Bank': {
    'Mandi House': { time: 5, line: 'Blue' }
  }
};

window.onload = function () {
  const stations = Object.keys(metroMap);
  const sourceSelect = document.getElementById('source');
  const destSelect = document.getElementById('destination');

  stations.forEach(station => {
    sourceSelect.innerHTML += `<option value="${station}">${station}</option>`;
    destSelect.innerHTML += `<option value="${station}">${station}</option>`;
  });
};

function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = {};
  const queue = [];

  for (let station in graph) {
    distances[station] = Infinity;
    previous[station] = null;
  }

  distances[start] = 0;
  queue.push([start, 0]);

  while (queue.length > 0) {
    queue.sort((a, b) => a[1] - b[1]);
    const [current, currDist] = queue.shift();
    if (visited[current]) continue;
    visited[current] = true;

    for (let neighbor in graph[current]) {
      const weight = graph[current][neighbor].time;
      const distance = currDist + weight;

      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
        queue.push([neighbor, distance]);
      }
    }
  }

  // Reconstruct path
  let path = [];
  let station = end;
  while (station) {
    path.unshift(station);
    station = previous[station];
  }

  return { path, distance: distances[end] };
}

function findRoute() {
  const source = document.getElementById('source').value;
  const destination = document.getElementById('destination').value;
  const resultDiv = document.getElementById('result');

  if (source === destination) {
    resultDiv.innerHTML = '<strong><span style="color: red;">Source and destination cannot be the same.</span><strong>';
    
    return;
  }

  const result = dijkstra(metroMap, source, destination);
  const route = result.path;
  let displayRoute = "";
  let previousLine = null;
  let totalTime = 0;

  for (let i = 0; i < route.length - 1; i++) {
    let current = route[i];
    let next = route[i + 1];
    let segment = metroMap[current][next];
    let line = segment.line;
    totalTime += segment.time;

    if (line !== previousLine && previousLine !== null) {
      displayRoute += `🚉<span style="color: ${line};"> Interchange to ${line} Line<br></span>`;
    }

    displayRoute += `<span style="color: ${line};">${current} (${line} Line) → </span>`;
    previousLine = line;
  }
  displayRoute += `<strong>${route[route.length - 1]}</strong>`;

  const fare = Math.max(10, Math.ceil(totalTime / 5) * 10);

  resultDiv.innerHTML = `
    <strong>${source} to ${destination} Metro Route</strong><br><br>${displayRoute}<br><br>
    <strong>Estimated Time to Travel:</strong> ${totalTime} minutes<br>
    <strong>Estimated Fare:</strong> ₹${fare}
  `;
}

function toggleMenu() {
  const menu = document.getElementById('collapsible-menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function closeMenu() {
  document.getElementById('collapsible-menu').style.display = 'none';
}

// Auto-close if clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('collapsible-menu');
  const toggle = document.getElementById('menu-toggle');
  if (!menu.contains(event.target) && event.target !== toggle) {
    menu.style.display = 'none';
  }
});







