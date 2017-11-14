import os, errno, sys
from os import path
from distutils.dir_util import copy_tree

dev_app_dir = path.abspath(sys.argv[1])
file_parent = path.dirname(os.path.realpath(__file__))
template_dir = path.join(file_parent, 'template')

def init_template(app_dir):
    assert not path.exists(app_dir)
    os.makedirs(app_dir)
    copy_tree(template_dir, app_dir)

def init():
    init_template(dev_app_dir)

init()    