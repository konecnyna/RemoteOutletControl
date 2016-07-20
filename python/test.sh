for (( i=1; i<=10; i++ ))
do
	STATE=$((i%2))
	echo $STATE
	sudo python ac_outlet_control.py 6 $STATE;
	sleep .5
done
