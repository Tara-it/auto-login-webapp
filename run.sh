#!/bin/bash

echo "=== Генериране на скриптове ==="
node generateLoginScript.js

echo "=== Тестване на скриптовете ==="
node testLoginScript.js

echo "=== Готово. Виж output/ и results.log ==="