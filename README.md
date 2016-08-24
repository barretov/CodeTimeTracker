# CodeTimeTracker
Sublime plugin to measure the time spent on projects

--------------------------------------------------------------

Warning

    This plugin measure the time spent on projects, then you have to working with sublime projects.

    To do a project on Sublime-Text you have to:

        1- Go to menu 'File'->'Open Folder...' choose the project folder.
        2- Go to menu 'Project'->'Save Project As...' and save the project.

    Now you are in a sublime project.

Dashboard

    To open dashboard:

        - Use command (Crtl+Shift+p) and type 'CodeTimeTracker' or 'tracker'
        and choose the option "CondeTimeTracker: Open Dashboard".

        or.

        - Open menu 'Tools'->'CodeTimeTracker'->'CodeTimeTracker:Open Dasshboard'.

    FireFox
    =======

        Dashboard works fine in FireFox.

    Chrome
    ======

        If you want open dashboard in google chrome, you have to open the chrome using
        this command --allow-file-access-from-files

        to do this:

            1- Close all running Chrome instances first.

            2- Start the Chrome executable with a command line flag:

        Linux:
        Example /usr/bin/chromium-browser --allow-file-access-from-files

        Mac:

        Example: open /Applications/Google\ Chrome.app --args --allow-file-access-from-files

        Windows:

        On Windows, probably the easiest is probably to create a special shortcut icon which
        has added the flag given above (right-click on shortcut -> properties -> target).

        Example: chrome.exe --allow-file-access-from-files

    Safari
    ======

        Enable the develop menu using the preferences panel, under Advanced -> "Show develop menu in menu bar"
        Then from the safari "Develop" menu, select "Disable local file restrictions".

Delete Data

    To delete tracker data you have do:

        - Use command (Crtl+Shift+p) and type 'CodeTimeTracker' or 'tracker'
        and choose the option "CondeTimeTracker: Delete tracker data".

        or.

        - Open menu 'Tools'->'CodeTimeTracker'->'CodeTimeTracker:Delete tracker data'.

Comming Soon

    - Option for choose technologies to appear in the graphics.
    - Maybe git integration for merge tracker data, case you use CodeTimeTracker in another computer.
    - Top 3 techonogies.
    - Top 3 projects.