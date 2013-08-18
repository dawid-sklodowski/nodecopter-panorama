nodecopter-panorama
===================

Create panoramic photo with nodecopter

**Warning!!** This is a quick hack we developed at nodecopter London.
The code is not stable and you can expect glitches. It should not do
anything dangerous, but use it at your own risk.

## Dependencies

  * ffmpeg to process the video feed from the drone
  * npm modules ar-drone and ffmpeg
  * [Hugin][hugin] to create the panorama from
    the drone's picture
  * One Parrot AR Drone to fly!

## Setup

  1. Install ffmpeg. In Mac with [homebrew][brew]: ``brew install
     ffmpeg``
  2. Install npm modules ar-drone and ffmpeg: ``npm install ar-drone
     ffmpeg``
  3. Download and install [Hugin][hugin]
  4. Include hugin command-line tools directory in your ``$PATH``. In
     Mac: ``export PATH=$PATH:/Applications/Hugin/HuginTools``
  5. run the script! ``node panorama.js``

You can make the drone land pressing ``Ctrl-C``. If there drone has
taken any pictures it'll also try to create the panorama from the
existing pictures.

## How it works

You run ``node panorama.js`` to run the program. It will:

  * Create a directory to store the pictures for the panorama based on
    the current date and time
  * Connect to the AR Drone and order it to take off
  * Once has taken off and is hovering, start rotating the drone counter
    clockwise
  * Start taking saving pictures (3 pictures/s) while the drone spins
  * Once the drone has done a complete spin:
    * Make the drone land
    * Node creates runs a child process with ``bin/panoramize.sh`` to stitch
      the pictures together into a panorama with hugin's command line tools
  * You can find the output from ``bin/panoramize.sh`` in the directory
    created for the pictures: ``panoramic_stdout.txt`` and
``panoramic_stderr.txt``

## Current caveats

  * Only tested with Mac OS X
  * Sometimes the script will lose the conection from the drone's camera
    stream. If you see TCP errors, press ``Ctrl-C``
  * The program is far from stable

[hugin]: http://hugin.sourceforge.net
[brew]: http://brew.sh
