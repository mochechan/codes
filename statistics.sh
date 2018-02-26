#!/bin/bash

echo total lines of rpicloud 
find ./rpicloud -name "*.js" -not -path "noble/*" | xargs cat | wc -l

