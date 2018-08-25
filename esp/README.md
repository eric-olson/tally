# ESP8266 Tally Notes

## Getting NodeMCU Firmware

Firmware used to run lua on ESP8266 is a NodeMCU custom build and can be found [here](https://nodemcu-build.com).
Integer version of the firmware is used.

## Setting up Wi-Fi Connection
1. Rename `examplecredentials.lua` to `credentials.lua`
    $ mv examplecredentials.lua credentials.lua
2. Edit fields in `credentials.lua` to reflect desired network settings

## Required Tools
- [esptool](https://github.com/espressif/esptool) is used for firmware flashing on the ESP8266
- [nodemcu-tool](https://www.npmjs.com/package/nodemcu-tool) is used to upload code to the ESP8266

## Useful Commands

### Erasing Firmware:

    $ esptool.py --port /dev/tty.SLAB_USBtoUART erase_flash

### Flashing Firmware:

    $ esptool.py --port /dev/tty.SLAB_USBtoUART write_flash -fm qio 0x00000 /path/to/firmware.bin

### Uploading Code:

    $ nodemcu-tool upload init.lua tally.lua credentials.lua

#### Notes on uploading code

- To avoid having to manually specify a port and baudrate for each upload, a .nodemcutool file is present in the working directory.
- nodemcu-tool needs to have access to the lua interpreter to begin file uploads. If the tool doesn't work on the first try, restart the ESP8266 and initiate a file upload before a wi-fi connection is established.

