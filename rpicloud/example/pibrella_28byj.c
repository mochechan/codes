/*
 * stepper.c:
 *	Controll a micro stepper motor off the Pibrella board
 *	Copyright (c) Gordon Henderson, 2014
 ***********************************************************************
 *    This is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Lesser General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Lesser General Public License for more details.
 *
 *    You should have received a copy of the GNU Lesser General Public License
 *    along with This.  If not, see <http://www.gnu.org/licenses/>.
 ***********************************************************************
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <math.h>

#include <wiringPi.h>

#include "pibrella.h"

#define	MAX_STEPS	8

static int sequence [] =
{
  1, 0, 0, 0,
  1, 1, 0, 0,
  0, 1, 0, 0,
  0, 1, 1, 0,
  0, 0, 1, 0,
  0, 0, 1, 1,
  0, 0, 0, 1,
  1, 0, 0, 1,
} ;

static int sequenceStep = 0 ;


/*
 * stepCW: stepACW:
 *	Step the motor for the given number of steps clockwise or anticlockwise
 *********************************************************************************
 */

static void stepCW (int steps)
{
  int i ;

  for (i = 0 ; i < steps ; ++i)
  {
    sequenceStep -= 4 ;
    if (sequenceStep < 0)
      sequenceStep = MAX_STEPS * 4 - 4 ;

    digitalWrite (PIBRELLA_OUT_0, sequence [sequenceStep+0]) ;
    digitalWrite (PIBRELLA_OUT_1, sequence [sequenceStep+1]) ;
    digitalWrite (PIBRELLA_OUT_2, sequence [sequenceStep+2]) ;
    digitalWrite (PIBRELLA_OUT_3, sequence [sequenceStep+3]) ;

    delay (1) ;
  }
}


static void stepACW (int steps)
{
  int i ;

  for (i = 0 ; i < steps ; ++i)
  {
    sequenceStep += 4 ;
    if (sequenceStep >= (MAX_STEPS * 4))
      sequenceStep = 0 ;

    digitalWrite (PIBRELLA_OUT_0, sequence [sequenceStep+0]) ;
    digitalWrite (PIBRELLA_OUT_1, sequence [sequenceStep+1]) ;
    digitalWrite (PIBRELLA_OUT_2, sequence [sequenceStep+2]) ;
    digitalWrite (PIBRELLA_OUT_3, sequence [sequenceStep+3]) ;

    delay (1) ;
  }
}



/*
 * main:
 ***********************************************************************
 */

int main (int argc, char *argv[]){
  wiringPiSetup () ;
  pibrellaSetup () ;

  int degree = 0;
  degree = atoi(argv[1]);
  if (degree>0) {
    stepCW(degree);
  } else if (degree<0) {
    stepACW(abs(degree));
  }
    digitalWrite (PIBRELLA_OUT_0, 0) ;
    digitalWrite (PIBRELLA_OUT_1, 0) ;
    digitalWrite (PIBRELLA_OUT_2, 0) ;
    digitalWrite (PIBRELLA_OUT_3, 0) ;
  return 0;

  return 0 ;
}
