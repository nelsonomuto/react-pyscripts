import os, errno, sys
from os import path
from directory import add_directory
from templates import tpls

component_name = sys.argv[1]
component_dir_name = sys.argv[2] if(len(sys.argv) > 2) else 'component'
script_path = path.dirname(path.realpath(sys.argv[0]))
repo_path = path.dirname(path.dirname(script_path))
app_path = path.join(repo_path, 'app')
directory = path.join(app_path, component_dir_name, component_name)
test_directory = path.join(directory, '__tests__')

def format(s): 
    return s.format(component_name = component_name)

for k, v in tpls.items(): 
    tpls[k] = format(v)
    print(f'format {v}')    

print(f'\
    component_dir_name {component_dir_name}\n \
    component_name {component_name}\n \
    script_path {script_path}\n \
    dir_path {app_path}\n \
    directory {directory}\n \
    test_directory {test_directory}\n \
')

assert not path.exists(directory)

add_directory(directory)
add_directory(test_directory)

open(path.join(directory, f'style.scss'), 'w+').write(tpls['style'])
open(path.join(directory, f'index.js'), 'w+').write(tpls['index'])
open(path.join(test_directory, f'{component_name}-test.js'), 'w+').write(tpls['test'])