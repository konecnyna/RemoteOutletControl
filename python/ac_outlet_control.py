# -*- coding: utf-8 -*-
# Send RF signal via RPI for Bye Bye Standby Wireless Remote Control AC outlets
# url: http://amzn.com/B00F4AQKRI
# Ref: http://raspi.tv/2013/how-to-use-wiringpi2-for-python-on-the-raspberry-pi-in-raspbian
# author: Nick Konecny
#
# SIGNAL EXPLAINATION:
# [0,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,0,0,1] [1,0,0,1,0]
#                 ↑                          ↑ ↑ ↑ ↑ ↑
#                 A                          B C D E F
# A - Base Signal
# B - State bit. 1=on 0=off
# C/D - Remote outlet identifier
# E - Channel. The ac remote has two channels. 1-3 / 4-6
# F - Parity bit.

import wiringpi2 as wiringpi
from time import sleep
import sys
import remotes

#FUNCTIONS
TRANSMIT_PIN = 24


def main(args):
	try:
		initPins()

		type = args[1]
		input_outlet = int(args[2])
		input_state = int(args[3])
		
		if type == remotes.ByeBye.NAME:
			sendSignal(remotes.ByeBye(), input_outlet, input_state)	
		elif type == remotes.Zap.NAME:
			sendSignal(remotes.Zap(), input_outlet, input_state)
		else:
			print "Bad type. try 'zap' or 'byebye'"

	finally:
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.pinMode(TRANSMIT_PIN, 0)


def initPins():
	wiringpi.wiringPiSetupGpio()
	# sets GPIO 24 to output
	wiringpi.pinMode(TRANSMIT_PIN, 1)
	# sets port 24 to 0 (0V, off)
	wiringpi.digitalWrite(TRANSMIT_PIN,0)


def sendSignal(signalObject, input_outlet, input_state):
	attempts = 0

	while(attempts < signalObject.SIGNAL_SEND_ATTEMPTS):
		if (attempts % 10 == 0) :
			sleep(0.1)

		transmitWaveForm(2, signalObject)
		for value in signalObject.createSignal(input_outlet, input_state):
			transmitWaveForm(value, signalObject)

		transmitWaveForm(2, signalObject)
		attempts += 1

	print "Signal complete"

def transmitWaveForm(waveForm, signalObject):
	if(waveForm == 0):
		wiringpi.digitalWrite(TRANSMIT_PIN,1)
		wiringpi.delayMicroseconds(signalObject.SHORT_DELAY_ON)
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.delayMicroseconds(signalObject.SHORT_DELAY_OFF)
	elif(waveForm == 1):
		wiringpi.digitalWrite(TRANSMIT_PIN,1)
		wiringpi.delayMicroseconds(signalObject.LONG_DELAY_ON)
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.delayMicroseconds(signalObject.LONG_DELAY_OFF)
	elif(waveForm == 2):
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.delayMicroseconds(signalObject.SIGNAL_BEGIN)



if(len(sys.argv) != 4 or int(sys.argv[3]) > 1):
	print "Usage: <type> <outlet> <state>"
	print "For example: python ac_oulet_control.py zap 1 1"
	print "Will turn outlet 1 on."
else:
	main(sys.argv)

