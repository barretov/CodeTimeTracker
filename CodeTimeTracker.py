import sublime
import sublime_plugin
import webbrowser
import os
import shutil
import time
from datetime import datetime
import threading
import http.server
import socketserver

class CodeTimeTracker (sublime_plugin.EventListener):

    time_start = time.time()
    time_save = 300 # time for save seconds
    time_afk = 2400 # time to verify if sublime is inactive (40 minutes)
    time_inactivity = time.time()
    current_project = "none"
    current_technology = "none"
    stVersion = sublime.version()
    cttVersion = "1.2.9" # current version
    platform = sublime.platform()
    arch = sublime.arch()
    httpServer_port = 10123

    # show init message
    sublime.active_window().status_message("CodeTimeTracker | Started")

    # show console message
    print("............::::::::| CodeTimeTracker | Started |::::::::............")

    #  listeners  #
    def on_activated(self, view):
        self.handle_active()

    def on_load_async(self, view):
        self.handle_active()

    def on_clone_async(self, view):
        self.handle_active()

    def on_new_async(self, view):
        self.handle_active()

    def on_post_save(self, view):
        self.handle_active()

    def on_close(self, view):
        self.handle_active()

    # controller
    def handle_active(self):

        # try found the project
        try:
            # verify if the project is the same yet
            if self.current_project == sublime.active_window().extract_variables()['project_base_name']:

                # try found extension of archive
                try:
                    if self.current_technology != sublime.active_window().extract_variables()['file_extension']:

                       self.pre_save()
                       self.current_technology = sublime.active_window().extract_variables()['file_extension']

                    elif self.time_save < int(time.time()) - int(self.time_start):
                        self.pre_save()

                except KeyError as error:
                    print("CodeTimeTracker | You are working with a archive without extension")

            # if the project was changed
            else:

                # save the time until here
                self.pre_save()

                # change the variable of project
                self.current_project = sublime.active_window().extract_variables()['project_base_name']

        except KeyError as error:
            sublime.active_window().status_message("CodeTimeTracker | You are working out of project. Make a project!")
            print("CodeTimeTracker | You are working out of project. Make a project")

    # do verification before save
    def pre_save(self):

        # check if have more of two second in archive
        if int(time.time()) - int(self.time_start) > 2:

            # check if sublime was inactive
            if int(time.time()) - int(self.time_inactivity) < self.time_afk:
                self.save_time()

            # if is inactive reset the time
            else:
                self.time_start = time.time()
                self.time_inactivity = time.time()

        # verify if exists the file status
        if os.path.exists(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/status.txt") is False:

            # status.txt
            create_json = open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/status.txt", "w")
            create_json.close()

            # write status file
            with open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/status.txt", 'a') as file:
                 file.writelines("stts" + "{" + "\"stVersion\"" + ":" + str(self.stVersion) + "," + "\"cttVersion\"" + ":\"" + str(self.cttVersion) + "\","  + "\"arch\"" + ":\"" + str(self.arch) + "\"," + "\"platform\"" + ":\"" + str(self.platform) + "\"" + "}")

    # save
    def save_time(self):

        # verify if exists file data
        if os.path.exists(os.path.realpath(sublime.packages_path()) + "/User/CodeTimeTracker/data.txt") is False:

            # make folder and file
            # User/CodetimeTracker
            os.makedirs(os.path.realpath(sublime.packages_path()) + "/User/CodeTimeTracker/")

            # data.txt
            create_json = open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt", "w")
            create_json.close()

        # set now time variable
        now_time = int(time.time()) - int(self.time_start)

        with open(os.path.realpath(sublime.packages_path()) + "/User/CodeTimeTracker/data.txt", 'a') as file:
            file.writelines("data" + "{" + "\"date\"" + ":\"" + str(datetime.now()) + "\"," + "\"project\"" + ":\"" + self.current_project + "\"," + "\"tech\"" + ":\"" + self.current_technology + "\"," + "\"time\"" + ":" + str(now_time) + "}" + "\n")

        # reset time variables
        self.time_start = time.time()
        self.time_inactivity = time.time()

# open the dashboard
class CodeTimeTrackerDashboardCommand(sublime_plugin.ApplicationCommand):

    def run(self):
        HttpServer().start()
        webbrowser.open_new_tab("http://localhost:" + str(CodeTimeTracker.httpServer_port) + "/CodeTimeTracker")

# remove file data.
class CodeTimeTrackerDeleteDataCommand(sublime_plugin.ApplicationCommand):

    def run(self):
        shutil.rmtree(os.path.realpath(sublime.packages_path()) + "/User/CodeTimeTracker")
        sublime.active_window().status_message("CodeTimeTracker | Data deleted")

# HTTP Server
class HttpServer(threading.Thread):

    httpd = "none"

    def __init__(self):
        threading.Thread.__init__(self)

        os.chdir(os.path.realpath(sublime.packages_path()))
        handler = http.server.SimpleHTTPRequestHandler
        self.httpd = socketserver.TCPServer(('', CodeTimeTracker.httpServer_port), handler, bind_and_activate=False)

    def run(self):

        try:
            self.httpd.server_bind()
            self.httpd.server_activate()
            self.httpd.serve_forever()

        except OSError as error:
            print("CodeTimeTracker | Http server already started")

        else:
            self.httpd.server_activate()
