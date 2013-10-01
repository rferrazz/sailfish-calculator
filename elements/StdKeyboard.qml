/****************************************************************************************
**
** Copyright (C) 2013 Riccardo Ferrazzo <f.riccardo87@gmail.com>.
** All rights reserved.
**
** This program is based on ubuntu-calculator-app created by:
** Dalius Dobravolskas <dalius@sandbox.lt>
** Riccardo Ferrazzo <f.riccardo87@gmail.com>
**
** This file is part of ScientificCalc Calculator.
** ScientificCalc Calculator is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** ScientificCalc Calculator is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with ScientificCalc Calculator.  If not, see <http://www.gnu.org/licenses/>.
**
****************************************************************************************/

import QtQuick 2.0
import Sailfish.Silica 1.0

Item {
    width: parent.width
    height: grid.height+16

    Grid {
        id: grid
        columns: 1

        anchors{
            top: parent.top
            topMargin: 4
            horizontalCenter: parent.horizontalCenter
        }
        spacing: 12
        Grid{
            spacing: 12

            KeyboardButton {
                text: "sin"
                onClicked: formulaPush('sin', 'sin', 'function')
            }

            KeyboardButton {
                text: "cos"
                onClicked: formulaPush('cos', 'cos', 'function')
            }

            KeyboardButton {
                text: "tan"
                onClicked: formulaPush('tan', 'tan', 'function')
            }

            KeyboardButton {
                text: "asin"
                onClicked: formulaPush('asin', 'asin', 'function')
            }

            KeyboardButton {
                text: "acos"
                onClicked: formulaPush('acos', 'acos', 'function')
            }

            KeyboardButton {
                text: "atan"
                onClicked: formulaPush('atan', 'atan', 'function')
            }


            KeyboardButton {
                text: "ln"
                onClicked: formulaPush('ln', 'ln', 'function')
            }

            KeyboardButton {
                text: "π"
                onClicked: formulaPush('π', 'π', 'const')
            }

            KeyboardButton {
                text: "e"
                onClicked: formulaPush('e', 'E', 'const')
            }

            KeyboardButton {
                text: "log"
                onClicked: formulaPush('log', 'log', 'function')
            }

            KeyboardButton {
                text: "!"
                onClicked: formulaPush('!', '!', 'operation')
            }

            KeyboardButton {
                text: "^"
                onClicked: formulaPush('^', '^', 'operation')
            }

            KeyboardButton {
                text: "("
                onClicked: formulaPush('(', '(', 'group')
            }

            KeyboardButton {
                text: ")"
                onClicked: formulaPush(')', ')', 'group')
            }

            KeyboardButton {
                text: "%"
                onClicked: formulaPush('%', '%', 'operation')
            }

            KeyboardButton {
                text: "√"
                onClicked: formulaPush('√', '√', 'function')
            }
        }

        Grid{
            columns:4
            spacing: 12

            KeyboardButton {
                text: "7"
                onClicked: formulaPush('7', '7', 'number')
            }

            KeyboardButton {
                text: "8"
                onClicked: formulaPush('8', '8', 'number')
            }

            KeyboardButton {
                text: "9"
                onClicked: formulaPush('9', '9', 'number')
            }

            KeyboardButton {
                text: "÷"
                onClicked: formulaPush('÷', '/', 'operation')
            }

            KeyboardButton {
                text: "4"
                onClicked: formulaPush('4', '4', 'number')
            }

            KeyboardButton {
                text: "5"
                onClicked: formulaPush('5', '5', 'number')
            }

            KeyboardButton {
                text: "6"
                onClicked: formulaPush('6', '6', 'number')
            }

            KeyboardButton {
                text: "×"
                onClicked: formulaPush('×', '*', 'operation')
            }

            KeyboardButton {
                text: "1"
                onClicked: formulaPush('1', '1', 'number')
            }

            KeyboardButton {
                text: "2"
                onClicked: formulaPush('2', '2', 'number')
            }

            KeyboardButton {
                text: "3"
                onClicked: formulaPush('3', '3', 'number')
            }

            KeyboardButton {
                text: "+"
                onClicked: formulaPush('+', '+', 'operation')
            }

            KeyboardButton {
                text: "0"
                onClicked: formulaPush('0', '0', 'number')
            }

            KeyboardButton {
                text: "."
                onClicked: formulaPush('.', '.', 'real')
            }

            KeyboardButton {
                text: "C"
                onClicked: {
                    formulaView.addCurrentToMemory();
                    formulaReset();
                }
            }

            KeyboardButton {
                text: "−"
                onClicked: formulaPush('−', '-', 'operation')
            }

        }

    }
}
