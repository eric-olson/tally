-- pin definition
local pvwPin = 7
local pgmPin = 6

-- creates a UDP listener
function setup_udp()
  print("Setting up UDP socket...")

  udpSocket = net.createUDPSocket()

  -- start UDP listener on port 5002
  ip_addr = wifi.sta.getip()
  udpSocket:listen(5002, ip_addr)

  udpSocket:on("receive", function(s, data, port, ip)
    print("Received UDP packet:")
    print(data)

    -- OFF
    if data == "0\n" then
      gpio.write(pgmPin, gpio.HIGH)
      gpio.write(pvwPin, gpio.HIGH)
    -- PGM
    elseif data == "1\n" then
      gpio.write(pgmPin, gpio.LOW)
      gpio.write(pvwPin, gpio.HIGH)
    -- PVW
    elseif data == "2\n" then
      gpio.write(pgmPin, gpio.HIGH)
      gpio.write(pvwPin, gpio.LOW)
    else
      print("Invalid data")
    end
  end)
end

-- turn on blue LED as an indication that network connection was successful
gpio.mode(4, gpio.OUTPUT)
gpio.write(4, gpio.LOW)

-- initialize pins
gpio.mode(pgmPin, gpio.OUTPUT)
gpio.write(pgmPin, gpio.HIGH)

gpio.mode(pvwPin, gpio.OUTPUT)
gpio.write(pvwPin, gpio.HIGH)

setup_udp()

