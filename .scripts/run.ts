#!/usr/bin/env node
import logger from '@fonoster/logger'
import ConnectProcessor from "../mods/connect/src/service"
import SimpleAuthProcessor from "../mods/simpleauth/src/service"
import MessageDispatcher from "../mods/dispatcher/src/service"
import LocationService from "../mods/location/src/service"
import { getConfig as getDispatcherConfig } from "../mods/dispatcher/src/config/get_config"
import { getConfig as getLocationConfig } from "../mods/location/src/config/get_config"
import { spawn } from "child_process"

const edgeport = spawn("./mods/edgeport/edgeport.sh")
const dispatcherConfig = getDispatcherConfig(__dirname + "/../config/dispatcher.json")
const locationConfig = getLocationConfig(__dirname + "/../config/location.json")
const users = require(__dirname + "/../config/auth.json")

logger.info("routr v2 // connect distribution")

if (dispatcherConfig._tag === 'Right') {
  MessageDispatcher(dispatcherConfig.right)
} else {
  logger.error(dispatcherConfig.left)
}

if (locationConfig._tag === 'Right') {
  LocationService(locationConfig.right)
} else {
  logger.error(locationConfig.left)
}

SimpleAuthProcessor({ bindAddr: "0.0.0.0:51903", users })
ConnectProcessor({ bindAddr: "0.0.0.0:51904", locationAddr: "localhost:51905" })

edgeport.stdout.on("data", (data: any) => {
  process.stdout.write(`${data}`)
});
