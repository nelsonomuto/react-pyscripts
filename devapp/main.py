import os, errno, sys
from os import path
from distutils.dir_util import copy_tree
from lib.files import replace_in_file

default_port = '3006'
dev_app_dir = path.abspath(sys.argv[1])
component_dir = path.abspath(sys.argv[2])
port = sys.argv[3] if(len(sys.argv) >= 4) else default_port
component_name = str.split(component_dir, '/')[-1]
dev_app_component_dir = path.join(dev_app_dir, 'src', component_name)
file_parent = path.dirname(os.path.realpath(__file__))
template_dir = path.join(file_parent, 'template')

print(f"""
    dev_app_dir {dev_app_dir}
    port {port}
    component_dir {component_dir}
    component_name {component_name}
    dev_app_component_dir {dev_app_component_dir}    
    file_parent {file_parent}
    template_dir {template_dir}
""")

def get_template_list():
    template_list = [
        ('{port}', port)
    ]

def init_template(app_dir):
    assert not path.exists(app_dir)
    os.makedirs(app_dir)
    os.makedirs(path.join(dev_app_dir, 'src'))    
    copy_tree(template_dir, app_dir)

    for root, dirs, files in os.walk(app_dir):
        for file in files:
            replace_in_file(file, get_template_list())

def init():
    init_template(dev_app_dir)
    os.symlink(component_dir, dev_app_component_dir)

init()    