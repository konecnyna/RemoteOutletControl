#!/bin/bash
for(( i=1; i<=30; i++ ))
do
        STATE=$((i%2))
    if [ $STATE == 1  ]
    then
        echo "Turning on outlet"
    else
        echo "Turning off outlet"
    fi
        sudo python ac_outlet_control.py zap 2 $STATE;
done
