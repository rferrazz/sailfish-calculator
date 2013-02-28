# The name of your app
TARGET = sailfish-calculator

# C++ sources
SOURCES += main.cpp

# C++ headers
HEADERS +=

# QML files and folders
qml.files = *.qml pages cover elements main.qml engine.js formula.js

# The .desktop file
desktop.files = sailfish-calculator.desktop

# Please do not modify the following line.
include(sailfishapplication/sailfishapplication.pri)

OTHER_FILES = rpm/sailfish-calculator.yaml \
    pages/Calculator.qml \
    engine.js \
    formula.js

