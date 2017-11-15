import os, errno, sys
from os import path
from distutils.dir_util import copy_tree
from lib.files import replace_in_file
from shutil import rmtree

default_port = '3006'
base_app_component_dir = path.abspath(sys.argv[1])
dev_app_dir = path.abspath(sys.argv[2])
dev_app_port = sys.argv[3] if(len(sys.argv) >= 4) else default_port
component_dir_name = str.split(base_app_component_dir, '/')[-1]
dev_app_component_dir = path.join(dev_app_dir, 'src', component_dir_name)
file_parent = path.dirname(os.path.realpath(__file__))
template_dir = path.join(file_parent, 'template')

print(f"""
    base_app_component_dir {base_app_component_dir}

        ---

    dev_app_dir {dev_app_dir}    
    dev_app_port {dev_app_port}
    dev_app_component_dir {dev_app_component_dir}    
    component_dir_name {component_dir_name}    
    file_parent {file_parent}
    template_dir {template_dir}
""")

def get_template_list():
    return [
        ('{port}', dev_app_port)
    ]

def init_template(app_dir):
    assert not path.exists(app_dir)

    try:
        os.makedirs(app_dir)
        os.makedirs(path.join(dev_app_dir, 'src'))    
        copy_tree(template_dir, app_dir)

        for root, dirs, files in os.walk(app_dir):
            for file in files:
                print(f"""
                    root {root}
                    dirs {dirs}
                    file {file}                
                """)
                file_path = path.join(root, file)                
                print(file_path)
                assert path.exists(file_path)
                replace_in_file(file_path, get_template_list()) 
    except:
        # rmtree(app_dir)
        raise

def init():
    init_template(dev_app_dir)
    os.symlink(base_app_component_dir, dev_app_component_dir)

init()    