/****************************************************************************************
**
** Copyright (C) 2013 Riccardo Ferrazzo <f.riccardo87@gmail.com>.
** All rights reserved.
**
** This program is based on ubuntu-calculator-app created by:
** Dalius Dobravolskas <dalius@sandbox.lt>
** Riccardo Ferrazzo <f.riccardo87@gmail.com>
**
** This file is part of AfroFish Calculator.
** AfroFish Calculator is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** AfroFish Calculator is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with AfroFish Calculator.  If not, see <http://www.gnu.org/licenses/>.
**
****************************************************************************************/

import QtQuick 1.1
import Sailfish.Silica 1.0

CoverBackground {

        Column{
            anchors{
                top: parent.top
                left: parent.left
                topMargin: 10
                leftMargin: 2
            }
            width: parent.width - 4
            Label{
                width: parent.width
                text: calculatorPage.formula_text+calculatorPage.brackets_added
                horizontalAlignment: Text.AlignRight
            }

        Label{
            width: parent.width
            text: '= ' + calculatorPage.answer
        }
        }

        Label {
            id: label
            anchors.centerIn: parent
            text: "Calculator"
        }
        //    CoverActionList{
        //        CoverAction{
        //            id: copy
        //            iconSource: "image://theme/icon-cover-paste"
        //        }
        //    }
    }



