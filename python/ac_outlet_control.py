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

#CONST
SIGNAL_SEND_ATTEMPTS = 30
TRANSMIT_PIN = 24
SHORT_DELAY_ON = 330
SHORT_DELAY_OFF = 900
LONG_DELAY_ON = 920
LONG_DELAY_OFF = 305
SIGNAL_BEGIN = 2000
SIGNAL_ARRAY_SIZE = 25
STATE_OFF = 0
STATE_ON = 1

#GLOBALS
allOnSignal = [0,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,0,0,1,1,0,0,1,0]
allOffSignal = [0,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,0,0,1,0,0,0,1,0]

#FUNCTIONS
def main(args):
	try:
		initPins()

		input_outlet = int(args[1])
		input_state = int(args[2])

		sendSignal(createSignal(input_outlet,input_state))

	finally:
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.pinMode(TRANSMIT_PIN, 0)  


def initPins():
	wiringpi.wiringPiSetupGpio()
	# sets GPIO 24 to output 
	wiringpi.pinMode(TRANSMIT_PIN, 1)
	# sets port 24 to 0 (0V, off)
	wiringpi.digitalWrite(TRANSMIT_PIN,0)


def sendSignal(signalWaveForm):
	attempts = 0
	
	while(attempts < SIGNAL_SEND_ATTEMPTS):
		if (attempts % 10 == 0) :
			sleep(0.1)
			
		transmitWaveForm(2)
		for value in signalWaveForm:
			transmitWaveForm(value)

		transmitWaveForm(2)
		attempts += 1

	print "Signal complete"

def transmitWaveForm(waveForm):
	if(waveForm == 0):
		wiringpi.digitalWrite(TRANSMIT_PIN,1)
		wiringpi.delayMicroseconds(SHORT_DELAY_ON)
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.delayMicroseconds(SHORT_DELAY_OFF)
	elif(waveForm == 1):
		wiringpi.digitalWrite(TRANSMIT_PIN,1)
		wiringpi.delayMicroseconds(LONG_DELAY_ON)
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.delayMicroseconds(LONG_DELAY_OFF)
	elif(waveForm == 2):
		wiringpi.digitalWrite(TRANSMIT_PIN,0)
		wiringpi.delayMicroseconds(SIGNAL_BEGIN)


#SIGNAL CONSTS
BASE_WAVE_FORM = [0,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,0,0,1]
#Outlet wave bits
OUTLET_ALL_ON =  [1,0,0,1,0]
OUTLET_ALL_OFF = [0,0,0,1,0]
OUTLET_1_ON =    [1,1,1,1,0]
OUTLET_1_OFF =   [0,1,1,1,0]
OUTLET_2_ON =    [1,1,0,1,0]
OUTLET_2_OFF =   [0,1,0,1,0]
OUTLET_3_ON =    [1,0,1,1,0]
OUTLET_3_OFF =   [0,0,1,1,0]
OUTLET_4_ON =    [1,1,1,0,0]
OUTLET_4_OFF =   [0,1,1,0,0]
OUTLET_5_ON =    [1,1,0,0,0]
OUTLET_5_OFF =   [0,1,0,0,0]
OUTLET_6_ON =    [1,0,1,0,0]
OUTLET_6_OFF =   [0,0,1,0,0]

def createSignal(outlet, state):
	newWaveForm = BASE_WAVE_FORM[:]
	if(outlet == 0):
		if(state == STATE_OFF):
			newWaveForm.extend(OUTLET_ALL_OFF)
		elif(state == STATE_ON):
			newWaveForm.extend(OUTLET_ALL_ON)
	elif(outlet == 1):
		if(state == STATE_OFF):
			newWaveForm.extend(OUTLET_1_OFF)
		elif(state == STATE_ON):
			newWaveForm.extend(OUTLET_1_ON)
	elif(outlet == 2):
		if(state == STATE_OFF):
			newWaveForm.extend(OUTLET_2_OFF)
		elif(state == STATE_ON):
			newWaveForm.extend(OUTLET_2_ON)
	elif(outlet == 3):
		if(state == STATE_OFF):
			newWaveForm.extend(OUTLET_3_OFF)
		elif(state == STATE_ON):
			newWaveForm.extend(OUTLET_3_ON)
	elif(outlet == 4):
		if(state == STATE_OFF):
			newWaveForm.extend(OUTLET_4_OFF)
		elif(state == STATE_ON):
			newWaveForm.extend(OUTLET_4_ON)
	elif(outlet == 5):
		if(state == STATE_OFF):
			newWaveForm.extend(OUTLET_5_OFF)
		elif(state == STATE_ON):
			newWaveForm.extend(OUTLET_5_ON)
	elif(outlet == 6):
		if(state == STATE_OFF):
			newWaveForm.extend(OUTLET_6_OFF)
		elif(state == STATE_ON):
			newWaveForm.extend(OUTLET_6_ON)

			
	return newWaveForm


if(len(sys.argv) != 3 or int(sys.argv[2]) > 1):
	print "Usage: <outlet> <state>"
	print "For example: python ac_oulet_control.py 1 1"
	print "Will turn outlet 1 on."
else:
	main(sys.argv)
