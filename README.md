# Intiface Websocket Device Visualizer for OBS Browser Overlay

This is an example project of creating a Websocket Device in Intiface Central to use as a visualizer on a stream via OBS overlay.

## How To Use

- Open Intiface Central
- Under the `App Modes` tab, make sure the mode is set to `Engine` and `Device Websocket Server`
  (under Advanced Device Managers) is turned on.
- Under the `Devices` tab, scroll down to `Websocket Devices (Advanced)`. Add a device of protocol
  type `lovense` with name `LVS-Test`.
- Start the engine by hitting the large play button on the top bar
- **This step should only be done AFTER starting the engine.** Open a web browser on the same
  machine that Intiface is running on, and go to https://qdot.github.io/intiface-obs-visualizer
- In Intiface Central, a new device should show as connected on the devices tab. Moving the slider
  should update the graph on the webpage.
- If this doesn't work, check the browser console to see if any errors were printed.