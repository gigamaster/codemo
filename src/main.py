#!/usr/local/bin/python3
"""
use os package to iterate through files in a directory
"""
import os
import sys
# import time
import json
import base64
import datetime as dt

with open('/src/icons.json', encoding="utf-8") as json_file:
  data   = json.load(json_file)

  urepo  = "https://github.com/gigamaster/codemo/tree/main/app"
  uFolder= "@click=\"GitZip.zipRepo('https://github.com/gigamaster/codemo/tree/main/app"
  ufile  = "@click=\"GitZip.zipRepo('https://github.com/gigamaster/codemo/blob/main/app"
  uBlob  = "https://github.com/gigamaster/codemo/blob/main/app"
  uraw   = "https://raw.githubusercontent.com/gigamaster/codemo/main/app"
  uEdit  = "https://github.com/gigamaster/codemo/edit/main/app"
  
  code   = ["code.png", "css3.png", "js.png", "markdown.png", "php.png", "py.png", "sql.png", "text.png"]
  media  = ["audio.png", "video.png"]

  exclude = set(['asset', 'test'])

def main():
  """
  main function
  """
  if len(sys.argv) > 1:
    print("changing directory to " + sys.argv[1])
    # add error handling to chdir
    try:
        os.chdir(sys.argv[1])
    except OSError:
        print("Cannot change the current working Directory")
        sys.exit()
  else:
      print("no directory specified")
      sys.exit()

  for dirname, dirnames, filenames in os.walk('.'):
      dirnames[:] = [d for d in dirnames if d not in exclude] # exclude assets
      
      if 'index.html' in filenames:
            print("index.html already exists, skipping...")
      else:
          print("index.html does not exist, generating")
          with open(os.path.join(dirname, 'index.html'), 'w', encoding="utf-8") as f:
              # Parent Dirname [1:] remove dot
              pDirname = dirname[1:]
              f.write("\n".join([
                  get_template_head(dirname),
                  #dirname home icon
                  "<tr class=\"w-2/4 border-b dark:border-primary-darker hover:bg-primary-100 dark:hover:bg-primary-dark\">" +
                      "<th scope=\"row\" class=\"py-2 px-2 lg:px-6 font-medium whitespace-nowrap flex align-middle\">" +
                      "<a class=\"flex flex-nowrap items-center my-auto dark:text-light\" href=\"../\">" +
                      "<img style=\"max-width:23px; margin-right:5px\" src=\"" + get_icon_base64("o.folder-home") + "\"/>" +
                      "<span class=\"icon-updir\"></span></a></th><td class=\"text-center\">-</td><td class=\"text-center\">-</td>" +
                      "<td class=\"text-center\">" + pDirname + "-</td></tr>" #if dirname != "." else "",
                      ]))
              
              #sort dirnames alphabetically
              dirnames.sort()
              for subdirname in dirnames:
                  
                  # Join Parent and File Name with extension
                  #fName = os.path.join(pDirname, subdirname)
                  
                  
                  f.write("<tr class=\"w-1/4 border-b dark:border-primary-darker hover:bg-primary-100 dark:hover:bg-primary-dark\">" +
                          "<th scope=\"row\" class=\"py-2 px-2 lg:px-6 font-medium whitespace-nowrap flex align-middle\">" +
                          "<a class=\"flex flex-nowrap items-center my-auto dark:text-light\" href=\"" + subdirname + "/\">" +
                          "<img style=\"max-width:23px; margin-right:5px\" src=\"" + get_icon_base64("o.folder") + "\"/>" + 
                          subdirname + "</a></th><td class=\"text-center\">-</td><td class=\"text-center\">-</td>" +
                          "<td class=\"text-center\">")
                
                  folderZip = os.path.join(pDirname, subdirname)
                  f.write("<a class=\"download\" @click=\"GitZip.zipRepo('" + uFolder + folderZip + "'); await $nextTick(); $notify('Downloading folder...')\" title=\"Download Folder\"><span class=\"icon-download\"></span></td></a></tr>\n")
              
              #sort filenames alphabetically
              filenames.sort()
              for filename in filenames:
                  # File Icon - Link - Size - Time
                  path = (dirname == '.' and filename or dirname + '/' + filename)
                  f.write("<tr class=\"w-1/4 border-b dark:border-primary-darker hover:bg-primary-100 dark:hover:bg-primary-dark\">" +
                          "<th scope=\"row\" class=\"py-2 px-2 lg:px-6 font-medium whitespace-nowrap flex align-middle\">\n" +
                          "<a class=\"flex flex-nowrap items-center my-auto dark:text-light\" href=\"" + filename + "\" target=\"_blank\">" +
                          "<img style=\"max-width:23px; margin-right:5px\" src=\"" + get_icon_base64(filename) + "\"/>" +
                          filename + "</a></th><td class=\"text-center\">" +
                          get_file_size(path) + "</td><td class=\"text-center\">" + get_file_modified_time(path) + "</td>" +
                          "<td class=\"flex flex-nowrap items-center justify-center\">")
                  
                  # Preview - filename relative path
                  f.write("<a class=\"preview\" href=\"" + filename + "\" title=\"Preview File\"><span class=\"icon-view\"></span></a>")
                  
                  # Parent Dirname [1:] remove dot
                  #pDirname = dirname[1:]
                  # Join Parent and File Name with extension
                  fName = os.path.join(pDirname, filename)
                  # GitHub Link to Edit 
                  f.write("<a class=\"edit\" href=\"" + uEdit + fName + "\"  target=\"_blank\" title=\"Edit File\"><span class=\"icon-edit\"></span></a>" +
                  #Blob URL to Download
                  "<a class=\"download\" @click=\"GitZip.zipRepo('" + uBlob + fName + "'); await $nextTick(); $notify('Downloading file...')\" title=\"Download File\"><span class=\"icon-download\"></span></td></tr>\n")

              f.write("\n".join([
                  get_template_foot(),
              ]))


def get_file_size(filepath):
    """
    get file size
    """
    size = os.path.getsize(filepath)
    if size < 1024:
        return str(size) + " B"
    elif size < 1024 * 1024:
        return str(round((size / 1024), 2)) + " KB"
    elif size < 1024 * 1024 * 1024:
        return str(round((size / 1024 / 1024), 2)) + " MB"
    else:
        return str(round((size / 1024 / 1024 / 1024), 2)) + " GB"
    return str(size)


def get_file_modified_time(filepath):
    """
    get file modified time
    """
    return dt.datetime.fromtimestamp(os.path.getmtime(filepath)).strftime('%Y-%m-%d %H:%M:%S')
    # return time.ctime(os.path.getmtime(filepath)).strftime('%X %x')


def get_template_head(foldername):
    """
    get template head
    """
    with open("/src/template/head.html", "r", encoding="utf-8") as file:
        head = file.read()
    head = head.replace("{{foldername}}", foldername) 
    head = head.replace("{{repo}}", os.environ["GITHUB_REPOSITORY"])  
    head = head.replace("{{owner}}", os.environ["GITHUB_REPOSITORY_OWNER"])  
    head = head.replace("{{url}}", os.environ["GITHUB_SERVER_URL"] + "/" + os.environ["GITHUB_REPOSITORY"] + "/")  
    return head


def get_template_foot():
    """
    get template foot
    """
    with open("/src/template/foot.html", "r", encoding="utf-8") as file:
        foot = file.read()
    foot = foot.replace("{{buildtime}}", "at " + dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    foot = foot.replace("{{author}}", os.environ["GITHUB_REPOSITORY_OWNER"]) 
    foot = foot.replace("{{giturl}}", os.environ["GITHUB_SERVER_URL"] + "/" + os.environ["GITHUB_REPOSITORY"] + "/")  

    return foot


def get_icon_base64(filename):
    """
    get icon base64
    """
    with open("/src/png/" + get_icon_from_filename(filename), "rb") as file:
        return "data:image/png;base64, " + base64.b64encode(file.read()).decode('ascii')


def get_icon_from_filename(filename):
    """
    get icon from filename
    """
    extension = "." + filename.split(".")[-1]
    # extension = "." + extension
    # print(extension)
    for i in data:
        if extension in i["extension"]:
            # print(i["icon"])
            return i["icon"] + ".png"
    # print("no icon found")
    return "unknown.png"


if __name__ == "__main__":
    main()
    # get_icon_from_filename("test.txppt")