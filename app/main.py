import os, errno, sys
from os import path
from distutils.dir_util import copy_tree

dev_app_dir = path.abspath(sys.argv[1])
component_dir = path.abspath(sys.argv[2])
component_name = str.split(component_dir, '/')[-1]
file_parent = path.dirname(os.path.realpath(__file__))
template_dir = path.join(file_parent, 'template')

print(f"""
    dev_app_dir {dev_app_dir}
    component_dir {component_dir}
    component_name {component_name}
    file_parent {file_parent}
    template_dir {template_dir}
""")

def init_template(app_dir):
    assert not path.exists(app_dir)
    os.makedirs(app_dir)
    copy_tree(template_dir, app_dir)

def init():
    init_template(dev_app_dir)
    copy_tree(component_dir, path.join(dev_app_dir, component_name))

init()    