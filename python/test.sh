#!/bin/bash
for(( i=1; i<=30; i++ ))
do
	STATE=$((i%2))
	echo $STATE
	sudo python ac_outlet_control.py zap 2 $STATE;
done
