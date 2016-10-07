<img src="https://github.com/konecnyna/RemoteOutletControl/blob/master/screenshots/web.png" width="420" align="right" hspace="20" />

Radio controlled outlets.
===========

This project is a complete package for controlling radio AC outlets with Node and Python. All documentation is in the respective directory, see below.

Getting started.
---
1. Run `npm install` in the `app` folder.
2. npm start (for development)

This can also be installed as a node dependency.  



Description
=====================
This project is for wireless (433MHz) AC outlets controlled by the Raspberry Pi. I've wanted to control AC outlets for a while now. All home automation solutions were far to expensive for me just tinkering. I've seen similiar projects but most use an Arduino to send the radio signals. I wanted to use my pre existing temperature logger web server and add control to it. Thus this project was born.

Thoughts:
I previously made a power tail that wired directly to the Raspberry Pi which worked fine for controlling 1 outlet however it was clunky, not very portable, and most likley a fire hazard.

The wireless outlets are already IEEE certified and encapsulated. So there is no worry of anything going wrong or someone getting electrocuted. The only trade of is now I don't know the state of the AC outlets. Communcation is only 1 way. I was thinking about just making a cronjob that runs every 15 minutes to ensure that the state is correct most of the time...

Usage
------
Usage: `python ac_outlet_control.py <type> <outlet> <state>`

For example: `python ac_oulet_control.py zap 1 1` will turn outlet 1 on.


Hardware
--------
1. Raspberry pi
2. [AC outlets](https://www.amazon.com/gp/product/B00DQELHBS) (These are much better than ByeBye ones I used previously)
3. [433 MHz transmitter/receiver](http://www.amazon.com/RioRand-Superheterodyne-transmitter-receiver-3400/dp/B00HEDRHG6/ref=sr_1_8?ie=UTF8&qid=1420045056&sr=8-8&keywords=433mhz)
4. Diligent Analog discover

How-To
---------------
First step is capturing the waveform. I had an USB o-scope from college that I used however I've seen people use adacuity and their sound card. Either one will work.

I first hooked up the 433 Mhz receiver to my Diligent o-scope. Wiring it as you you assume, 5v to 5v, Ground to Ground, and I hooked the positive scope probe to the data pin and the negative scope probe to ground. I couldn't easily trigger on rising edge or falling edge due to the amount of noise, NYC isn't the greatest place to test signal sniffing, even tried putting it in the microwave, a faraday cage, to decrease noise. I ended up having to just hold the remote button and make the time range big enough to capture a few signal periods. This was the result:

Reference-style: 
![alt text][oscope]

[oscope]: https://github.com/konecnyna/rpi_ac_outlet_control/blob/master/screenshots/signal_oscope.png "Oscope signal"


From this I was able to figure out that the signal was made up of two signals: A Long high followed by a short low and a Short High followed by a long low. Using the o-scope software I was able to measure the wave peroid. After measuring the wave's peroid and identifying the pattern I created a int array, a binary representation of the wave form, where a 1 was the Long High follower by short low and an 0 was a Short high followed by a long low.

From that I was able to write a program that trasnlates the array into a series of High/Low voltages send to the transmitter that can turn on or off the AC outlets.

After looking at several different waveforms I was able to decode the signals:

        SIGNAL EXPLAINATION:
        [0,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,0,0,1] [1,0,0,1,0]
                         ↑                         ↑ ↑ ↑ ↑ ↑
                         A                         B C D E F
        A - Base Signal
        B - State bit. 1=on 0=off
        C/D - Remote outlet identifier
        E - Channel. The ac remote has two channels. 1-3 / 4-6
        F - Parity bit.

Easey peasey! Now I can control everything, up to 6 outlets.

The problem now is that I wanted to use a python script to run this however Python doesn't runn fast enough to access μs delays. Thats where wiring pi came in. A great c library for low level gpio access for the raspberry pi that also has a Python wrapper. Once I installed that I created a the python script in about 30 minutes and I was good to go!

Dependencies
-----------
Wiringpi

    git clone git://git.drogon.net/wiringPi
If you have already used the clone operation for the first time, then

    cd wiringPi
    git pull origin
Will fetch an updated version then you can re-run the build script below.

To build/install there is a new simplified script:

    cd wiringPi
    ./build
Python dev tools

    sudo apt-get install python-dev python-pip
Python wiringpi2 wrapper    

    sudo pip install wiringpi2
