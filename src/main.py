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
  # GitHub Version and Repository Links
  appVersion= "v.0.9.0"
  uBlob  = "https://github.com/gigamaster/codemo/blob/main/app"
  uEdit  = "https://github.com/gigamaster/codemo/edit/main/app"
  uFolder= "https://github.com/gigamaster/codemo/tree/main/app"
  # TODO customize UI preview
  code   = ["code.png", "css3.png", "js.png", "markdown.png", "php.png", "py.png", "sql.png", "text.png"]
  media  = ["audio.png", "video.png"]
  # Exclude directories from UI
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
      dirnames[:] = [d for d in dirnames if d not in exclude] # exclude folders
      
      if 'index.html' in filenames:
            print("index.html already exists, skipping...")
      else:
          print("index.html does not exist, generating")
          with open(os.path.join(dirname, 'index.html'), 'w', encoding="utf-8") as f:
              # Parent Dirname [1:] remove first dot from path
              pDirname = dirname[1:]
              f.write("\n".join([
                  get_template_head(dirname),
                  # Dirname Home Icon
                  "<tr class=\"w-2/4 border-b dark:border-primary-darker hover:bg-primary-100 dark:hover:bg-primary-dark\">" +
                      "<th scope=\"row\" class=\"p-2 lg:px-6 font-medium whitespace-nowrap flex align-middle\">" +
                      "<a class=\"flex flex-nowrap items-center my-auto dark:text-light\" href=\"../\">" +
                      "<img style=\"max-width:23px; margin-right:5px\" src=\"" + get_icon_base64("o.folder-home") + "\"/>" +
                      "<span class=\"icon-updir\"></span></a></th>" + 
                      "<td></td><td></td><td></td></tr>" if dirname != "." else "",
                      ]))
              
              #sort dirnames alphabetically
              dirnames.sort()
              for subdirname in dirnames:
                  
                  # Join Parent Directory and Subdirectory
                  folderZip = os.path.join(pDirname, subdirname)
                  f.write("<tr class=\"w-1/4 border-b dark:border-primary-darker hover:bg-primary-100 dark:hover:bg-primary-dark\">" +
                          "<th scope=\"row\" class=\"p-2 lg:px-6 font-medium whitespace-nowrap flex align-middle\">" +
                          "<a class=\"flex flex-nowrap items-center my-auto dark:text-light\" href=\"" + subdirname + "/\">" +
                          "<img style=\"max-width:23px; margin-right:5px\" src=\"" + get_icon_base64("o.folder") + "\"/>" + 
                          subdirname + "</a></th><td></td><td></td>" +
                          "<td class=\"text-center\">" +
                          "<a class=\"download m-1 mb-1 py-1 bg-gray-100 rounded-md hover:text-light hover:bg-primary dark:bg-dark dark:hover:bg-dark dark:hover:text-light\" @click=\"GitZip.zipRepo('" + uFolder + folderZip + "'); await $nextTick(); $notify('Downloading folder...')\" title=\"Download Folder\">" +
                          "<span class=\"icon-download w-4 h-4 mx-2\"></span></a>" + 
                          "</td></tr>\n")
              
              #sort filenames alphabetically
              filenames.sort()
              for filename in filenames:
                  
                  # File Icon - Link - Size - Time
                  path = (dirname == '.' and filename or dirname + '/' + filename)
                  f.write("<tr class=\"w-1/4 border-b dark:border-primary-darker hover:bg-primary-100 dark:hover:bg-primary-dark\">" +
                          "<th scope=\"row\" class=\"p-2 lg:px-6 font-medium whitespace-nowrap flex align-middle\">\n" +
                          "<a class=\"flex flex-nowrap items-center my-auto dark:text-light\" href=\"" + filename + "\" target=\"_blank\">" +
                          "<img style=\"max-width:23px; margin-right:5px\" src=\"" + get_icon_base64(filename) + "\"/>" +
                          filename + "</a></th><td class=\"size\">" +
                          get_file_size(path) + "</td><td class=\"time\">" + get_file_modified_time(path) + "</td>" +
                          "<td class=\"flex flex-nowrap items-center justify-center\">") if dirname != "." else ""
                  
                  # File Preview - filename relative path
                  f.write("<a class=\"preview m-1 mb-1 py-1 bg-gray-100 rounded-md hover:text-light hover:bg-primary dark:bg-dark dark:hover:bg-dark dark:hover:text-light\" title=\"Preview File\" x-on:click=\"openWithSelfMain('" + filename + "','codemo','960','540')\">" +
                          "<span class=\"icon-view w-4 h-4 mx-2\"></span></a>")
                  
                  # Join Parent Directory and File Name with extension
                  fName = os.path.join(pDirname, filename)
                  # GitHub Link to Edit 
                  f.write("<a class=\"edit m-1 mb-1 py-1 bg-gray-100 rounded-md hover:text-light hover:bg-primary dark:bg-dark dark:hover:bg-dark dark:hover:text-light\" href=\"" + uEdit + fName + "\"  target=\"_blank\" title=\"Edit File\">" +
                          "<span class=\"icon-edit w-4 h-4 mx-2\"></span></a>" +
                          # GitHubBlob URL to Download
                          "<a class=\"download m-1 mb-1 py-1 bg-gray-100 rounded-md hover:text-light hover:bg-primary dark:bg-dark dark:hover:bg-dark dark:hover:text-light\" @click=\"GitZip.zipRepo('" + uBlob + fName + "'); await $nextTick(); $notify('Downloading file...')\" title=\"Download File\">" +
                          "<span class=\"icon-download w-4 h-4 mx-2\"></span></a></td></tr>\n")

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
        foldername = foldername[1:]
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
    foot = foot.replace("{{appVersion}}", appVersion)

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
    # no icon found
    return "unknown.png"


if __name__ == "__main__":
    main()
    # get_icon_from_filename("test.txt")