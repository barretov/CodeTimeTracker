import sublime
import sublime_plugin
import time
import datetime
import json
import webbrowser
import os
from datetime import datetime
from time import gmtime, strftime

class CodeTimeTracker (sublime_plugin.EventListener):

    date = datetime.now()
    time_start = time.time()
    time_save = 300 # time for save seconds
    current_project = "none"
    current_technology = "none"
    version = sublime.version()
    platform = sublime.platform()
    arch = sublime.arch()

    print(datetime.now())

    # apresenta mensagem de iniciado
    sublime.active_window().status_message("     | CodeTimeTracker :: Started |")

    #  listeners  #
    # observa a mudança de abas
    def on_activated(self, view):
        self.handle_active()

    # observa o carregamento de novos arquivos
    def on_load_async(self, view):
        self.handle_active()

    # observa o clone de arquivos
    def on_clone_async(self, view):
        self.handle_active()

    # observa a criação de arquivos
    def on_new_async(self, view):
        self.handle_active()

    # observa o salvamento de arquivos
    def on_post_save(self, view):
        self.handle_active()

    # observa o fechamento de arquivos
    def on_close(self, view):
        self.handle_active()

    # Controlador de salvamento #
    def handle_active(self):
        print("========================================")
        print("handle_active")

        # se o projeto ainda é o mesmo salva o tempo
        if self.current_project == sublime.active_window().extract_variables()['project_base_name']:

            if self.current_technology != sublime.active_window().extract_variables()['file_extension']:

               self.pre_save()
               self.current_technology = sublime.active_window().extract_variables()['file_extension']
               print("mudou a tecnologia")

            elif self.time_save < int(time.time()) - int(self.time_start):
                self.pre_save()

        # se o projeto foi mudado
        else:

            print("save and change")
            # salva o tempo ate aqui
            self.pre_save()

            # muda as variaveis de projeto
            self.current_project = sublime.active_window().extract_variables()['project_base_name']
            print("mudou de projeto")

        print(int(time.time()) - int(self.time_start))
        print("========================================")

     # faz verificações antes do salvamento
    def pre_save(self):

        if int(time.time()) - int(self.time_start) > 1:
            self.save_time()

    # salvamento #
    def save_time(self):

        print("save_time")

        # verifica se o arquivo existe
        if os.path.exists(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt") is False:

            print("não existe")

            # cria os arquivos
            # data.txt
            create_json = open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt", "w")
            create_json.close()

            # status.txt
            create_json = open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/status.txt", "w")
            create_json.close()

            # cria o cabeçalho do arquivo status
            with open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/status.txt", 'a') as file:
                 file.writelines("stts" + "{" + "\"version\"" + ":" + str(self.version) + "," + "\"arch\"" + ":\"" + str(self.arch) + "\"," + "\"platform\"" + ":\"" + str(self.platform) + "\"" + "}")

            # verifica se a pasta existe
            # if os.path.exists(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/") is False:

            #     # cria a pasta
            #     os.makedirs(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/")

            #     #  cria o arquivo
            # elif os.path.exists(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt") is False:

            #     create_json = open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt", "w")
            #     create_json.close()

            #     # cria o cabeçalho do arquivo
            #     with open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt", 'a') as file:
            #         file.writelines("version" + "," + self.version + "," + "arch" + "," + self.arch + "platform" + "," + self.platform + "\n")

        # se a pasta e o arquivo existe, escreve os dados
        print("existe o arquivo")

        now_time = int(time.time()) - int(self.time_start)

        with open(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt", 'a') as file:
            file.writelines("data" + "{" + "\"date\"" + ":\"" + str(self.date) + "\"," + "\"project\"" + ":\"" + self.current_project + "\"," + "\"tech\"" + ":\"" + self.current_technology + "\"," + "\"time\"" + ":" + str(now_time) + "}" + "\n")

        # zera o tempo e começa denovo
        self.time_start = time.time()

# Abre o Dashboard
class CodeTimeTrackerDashboardCommand(sublime_plugin.ApplicationCommand):

    def run(self):
        webbrowser.open_new_tab("file://" + os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/index.html")

# remove file data.
class CodeTimeTrackerDeleteDataCommand(sublime_plugin.ApplicationCommand):

    def run(self):
        os.remove(os.path.realpath(sublime.packages_path()) + "/CodeTimeTracker/data.txt")
        sublime.active_window().status_message("     | CodeTimeTracker :: Data deleted |")
