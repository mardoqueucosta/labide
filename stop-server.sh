#!/bin/bash
# Script para parar o servidor do site Imperial Toalheria

echo "Parando servidor na porta 8000..."
pkill -f "python3 -m http.server 8000"
echo "Servidor parado!"
