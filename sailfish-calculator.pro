# The name of your app
TARGET = sailfish-calculator

# C++ sources
SOURCES += main.cpp

# C++ headers
HEADERS +=

# QML files and folders
qml.files = *.qml engine.js pages cover elements main.qml

# The .desktop file
desktop.files = sailfish-calculator.desktop

# Please do not modify the following line.
include(sailfishapplication/sailfishapplication.pri)

OTHER_FILES = \
    rpm/sailfish-calculator.yaml \
    rpm/sailfish-calculator.spec

