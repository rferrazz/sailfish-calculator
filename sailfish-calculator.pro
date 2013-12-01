# The name of your app.
# NOTICE: name defined in TARGET has a corresponding QML filename.
#         If name defined in TARGET is changed, following needs to be
#         done to match new name:
#         - corresponding QML filename must be changed
#         - desktop icon filename must be changed
#         - desktop filename must be changed
#         - icon definition filename in desktop file must be changed
TARGET = scientific-calculator

CONFIG += sailfishapp

SOURCES += src/scientific-calculator.cpp

OTHER_FILES += qml/scientific-calculator.qml \
    qml/engine.js \
    qml/cover/CoverPage.qml \
    qml/pages/Calculator.qml \
    qml/elements/StdKeyboard.qml \
    qml/elements/Memory.qml \
    qml/elements/KeyboardButton.qml \
    qml/elements/CalcScreen.qml \
    rpm/scientific-calculator.spec \
    rpm/scientific-calculator.yaml \
    scientific-calculator.desktop

