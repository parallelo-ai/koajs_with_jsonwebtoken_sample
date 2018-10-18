# Generate private key
openssl genrsa -des3 -out private.pem 2048
# Generate public pair
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
