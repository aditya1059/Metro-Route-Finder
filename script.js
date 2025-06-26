
const metroMap = {};

// --- Yellow Line ---
metroMap['Samaypur Badli'] = {
   'Rohini Sector 18': { time: 2, line: 'Yellow' } 
  };
metroMap['Rohini Sector 18'] = {
   'Samaypur Badli': { time: 2, line: 'Yellow' },
    'Haiderpur Badli Mor': { time: 2, line: 'Yellow' }
   };
metroMap['Haiderpur Badli Mor'] = {
   'Rohini Sector 18': { time: 2, line: 'Yellow' },
    'Jahangirpuri': { time: 3, line: 'Yellow' } 
  };
metroMap['Jahangirpuri'] = {
   'Haiderpur Badli Mor': { time: 3, line: 'Yellow' },
    'Adarsh Nagar': { time: 2, line: 'Yellow' } 
  };
metroMap['Adarsh Nagar'] = {
   'Jahangirpuri': { time: 2, line: 'Yellow' },
    'Azadpur': { time: 3, line: 'Yellow' } 
  };
metroMap['Azadpur'] = {
   'Adarsh Nagar': { time: 3, line: 'Yellow' },
    'Model Town': { time: 2, line: 'Yellow' } 
  };
metroMap['Model Town'] = {
   'Azadpur': { time: 2, line: 'Yellow' },
    'GTB Nagar': { time: 2, line: 'Yellow' } 
  };
metroMap['GTB Nagar'] = {
   'Model Town': { time: 2, line: 'Yellow' },
    'Vishwa Vidyalaya': { time: 2, line: 'Yellow' } 
  };
metroMap['Vishwa Vidyalaya'] = {
   'GTB Nagar': { time: 2, line: 'Yellow' },
    'Vidhan Sabha': { time: 2, line: 'Yellow' } 
  };
metroMap['Vidhan Sabha'] = {
   'Vishwa Vidyalaya': { time: 2, line: 'Yellow' },
    'Civil Lines': { time: 2, line: 'Yellow' } 
  };
metroMap['Civil Lines'] = {
   'Vidhan Sabha': { time: 2, line: 'Yellow' },
    'Kashmere Gate': { time: 2, line: 'Yellow' } 
  };
metroMap['Kashmere Gate'] = {
  'Civil Lines': { time: 2, line: 'Yellow' },
  'Tis Hazari': { time: 2, line: 'Red' },
  'Rajiv Chowk': { time: 5, line: 'Yellow' }
};
metroMap['Rajiv Chowk'] = {
  'Kashmere Gate': { time: 5, line: 'Yellow' },
  'Patel Chowk': { time: 2, line: 'Yellow' },
  'Barakhamba': { time: 2, line: 'Blue' }
};
metroMap['Patel Chowk'] = {
   'Rajiv Chowk': { time: 2, line: 'Yellow' },
    'Central Secretariat': { time: 2, line: 'Yellow' } 
  };
metroMap['Central Secretariat'] = {
  'Patel Chowk': { time: 2, line: 'Yellow' },
  'Udyog Bhawan': { time: 2, line: 'Yellow' }
};

// --- Blue Line ---
metroMap['Dwarka Sector 21'] = {
   'Dwarka Sector 8': { time: 2, line: 'Blue' } 
  };
metroMap['Dwarka Sector 8'] = {
   'Dwarka Sector 21': { time: 2, line: 'Blue' },
    'Dwarka Sector 9': { time: 2, line: 'Blue' } 
  };
// ... (Add intermediate stations here)
metroMap['Barakhamba'] = {
  'Rajiv Chowk': { time: 2, line: 'Blue' },
  'Mandi House': { time: 2, line: 'Blue' }
};
metroMap['Mandi House'] = {
  'Barakhamba': { time: 2, line: 'Blue' },
  'Pragati Maidan': { time: 2, line: 'Blue' }
};

// --- Green Line ---
metroMap['Inderlok'] = {
  'Ashok Park Main': { time: 3, line: 'Green' },
  'Kanhaiya Nagar': { time: 2, line: 'Red' }
};
metroMap['Ashok Park Main'] = {
  'Inderlok': { time: 3, line: 'Green' },
  'Punjabi Bagh': { time: 2, line: 'Green' }
};
metroMap['Kirti Nagar'] = {
  'Moti Nagar': { time: 2, line: 'Blue' },
  'Satguru Ram Singh Marg': { time: 2, line: 'Green' }
};

// --- Red Line ---
metroMap['Rithala'] = {
   'Rohini West': { time: 2, line: 'Red' } 
  };
metroMap['Rohini West'] = {
   'Rithala': { time: 2, line: 'Red' },
    'Rohini East': { time: 2, line: 'Red' }
   };
metroMap['Kanhaiya Nagar'] = {
   'Inderlok': { time: 2, line: 'Red' },
    'Keshav Puram': { time: 2, line: 'Red' } 
  };
metroMap['Tis Hazari'] = {
   'Kashmere Gate': { time: 2, line: 'Red' },
    'Pul Bangash': { time: 2, line: 'Red' } 
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
      displayRoute += `🚉 Interchange to <span style="color: ${line};">${line} Line<br></span>`;
    }

    displayRoute += `${current} <span style="color: ${line};">(${line} Line) → </span>`;
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
document.addEventListener('click', function (event) {
  const menu = document.getElementById('collapsible-menu');
  const toggle = document.getElementById('menu-toggle');
  if (!menu.contains(event.target) && event.target !== toggle) {
    menu.style.display = 'none';
  }
});