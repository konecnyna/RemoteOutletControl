################################################
# From amazon: 
# Bye Bye Standby Wireless Remote 
# https://www.amazon.com/gp/product/B00F4AQKRI
################################################
class ByeBye():
	NAME = "byebye"

	SIGNAL_SEND_ATTEMPTS = 5	
	SHORT_DELAY_ON = 330
	SHORT_DELAY_OFF = 900
	LONG_DELAY_ON = 920
	LONG_DELAY_OFF = 305
	SIGNAL_BEGIN = 2000
	
	# Wave forms
	BASE_WAVE_FORM = [0,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,0,0,1]
	OUTLET_MAP = {
		0: [0,0,1,0],
		1: [1,1,1,0],
		2: [1,0,1,0],
		3: [0,1,1,0],
		4: [1,1,0,0],
		5: [1,0,0,0],
		6: [0,0,1,0,0]
	}

	def createSignal(self, outlet, state):
		return self.BASE_WAVE_FORM + [state] + self.OUTLET_MAP[outlet]


################################################
# From amazon: 
# Etekcity Wireless Remote Control Electrical Outlet Switc
# https://www.amazon.com/gp/product/B00DQELHBS
################################################
class Zap:
	NAME = "zap"
	
	SIGNAL_SEND_ATTEMPTS = 3
	SHORT_DELAY_ON = 147
	SHORT_DELAY_OFF = 627
	LONG_DELAY_ON = 535
	LONG_DELAY_OFF = 247
	SIGNAL_BEGIN = 6113
	

	# Wave forms
	BASE_WAVE_FORM = [0,0,0,1,0,1,0,1,0,1]
	BASE_ON_TAIL = [0,0,1,1,0]
	BASE_OFF_TAIL = [1,1,0,0,0]
	
	#[0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,1,1,0,0,0] # ch 1 off
	#[0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,0,0] # ch 2 off
	#[0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,0,0,1,1,0,0,0] # ch 3 off
	#[0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,0,0,0,1,1,0,0,0] # ch 4 off
	#[0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,1,0,0,0] # ch 5 off
	
	#[0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,0,1,1,0] # ch 1 on
	#[0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,0,0,1,1,0] # ch 2 on
	#[0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,0,0,0,0,1,1,0] # ch 3 on
	#[0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,0,0,0,0,0,1,1,0] # ch 4 on
	#[0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,0,0,0,0,0,1,1,0] # ch 5 on

	CHANNEL_MAP = {
		1: [0,1,0,1,0,1,0,0,1,1],
		2: [0,1,0,1,0,1,1,1,0,0],
		3: [0,1,0,1,1,1,0,0,0,0],
		4: [0,1,1,1,0,1,0,0,0,0],
		5: [1,1,0,1,0,1,0,0,0,0]
	}

	def createSignal(self, outlet, state):
		if (state == 0):
			return self.BASE_WAVE_FORM + self.CHANNEL_MAP[outlet] + self.BASE_OFF_TAIL
		elif (state == 1):
			return self.BASE_WAVE_FORM + self.CHANNEL_MAP[outlet] + self.BASE_ON_TAIL


		print "This shouldn't happen..."
		return []


