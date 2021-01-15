Used to generate certificate for https support
openssl req -newkey rsa:2048 -new -x509 -days 3650 -keyout key.pem -out cert.pem