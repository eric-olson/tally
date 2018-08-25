# Tally Server

The tally server acts as the mediator between the switcher's TSL-UMD output and
the ESP8266 tally lights. I run it on a Raspberry Pi 3 Model B+ with a wired
network connection.

## Running the Tally Server as a Service

The tally server can run as a Linux service, which eliminates the need to start
it manually each time the host machine is restarted. This functionality is
especially useful when the server is part of a portable system that power
cycles frequently.

TODO: add more details and example service config file

## Note on configuration

For now, tally configuration is hard-coded into `tally-handler.js` as a way to
test until web UI is complete. The eventual goal is to move all of the
configuration to the web UI and out of tally-handler.

