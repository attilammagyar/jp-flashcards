#!/bin/bash

source ./py3/bin/activate
PYTHONIOENCODING=utf-8 python3 ./compile.py
deactivate
