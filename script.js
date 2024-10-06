let currentMotorValue = 0;

window.addEventListener("load",  async function() {
  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Dataset 2 (Cubic Interpolation)',
            //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            //borderColor: Utils.CHART_COLORS.blue,
            cubicInterpolationMode: 'monotone',
            data: []
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        pointStyle: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          x: {
            type: 'realtime',
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            realtime: {
              duration: 10000,
              refresh: 100,
              delay: 0,
              onRefresh: chart => {
                const now = Date.now();
                chart.data.datasets.forEach(dataset => {
                  dataset.data.push({
                    x: now,
                    y: currentMotorValue
                  });
                });
              }
            }
          },
          y: {
            title: {
              display: false,
            },
            ticks: {
              display: false,
            },            
            grid: {
              display: false
            },
            min: 0,
            max: 1.0
          }
        },
        interaction: {
          intersect: false
        }
      }
    }
  )
});

let deviceWebsocket = new WebSocket("ws://127.0.0.1:54817");
let deviceAddress = "A9816725B";
let handshakePacket = {
  identifier: "LVS-Test",
  address: deviceAddress,
  version: 0
};

// When we open, send handshake and setup event handlers
deviceWebsocket.addEventListener("open", (socket) => {
  console.log("Connected");
  deviceWebsocket.send(JSON.stringify(handshakePacket));
  console.log("Handshake Sent");
  deviceWebsocket.addEventListener("message", async (event) => {
    
    let msg = await event.data.text();
    console.log(msg);
    if (msg.indexOf("DeviceType;") !== -1) {
      console.log("got device type");
      console.log(`Z:10:${deviceAddress};`);
      // Lovense initialization request
      deviceWebsocket.send(`Z:10:${deviceAddress};`);
    } else if (msg.indexOf("Battery;") !== -1) {
      console.log("Got battery");
      // Buttplug will wait for a response to Battery so just make something up.
      deviceWebsocket.send("90;");
    } else {
      console.log(`Lovense command: ${msg}`);
      // If it's a vibrate message, get the vibrate level, which will be 0-20.
      let regex = /Vibrate:([0-9]+)/;
      let match = msg.match(regex);
      if (match.length > 1) {
        console.log(match[1]);
        currentMotorValue = match[1] / 20.0;
      }
      //document.getElementById("lovense-output").innerHTML = msg;
      // If we wanted to conform with the Lovense protocol we'd send "OK;" here, but Buttplug doesn't care.
    }
  });
});
