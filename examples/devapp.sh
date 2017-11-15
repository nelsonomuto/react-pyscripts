# instantiate dev app
# the first argument is the components directory, 
#   the second the name of the directory where the dev app will be created
#   the third is an optional port number where the dev app will listen
python app/main.py app/component dev_app 3006

# instantiate dev app pointing to multiple component directories
python app/main.py app/component,app/container dev_app 3006
