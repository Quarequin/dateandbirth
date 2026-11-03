function DrawCalendar (I: number, CurrentDate: number[], Col: number, Row: number, X: number, Y: number, W: number, H: number, Src: Image) {
    CalculateDayOfWeek(CurrentDate[2], CurrentDate[1], 1)
    CalendarI = I22
    for (let index = 0; index <= Col * Row - 1; index++) {
        R = Math.floor(index / Col)
        C2 = index % Col
        Gx = X + C2 * (W - 1)
        Gy = Y + R * (H - 1)
        Src.drawRect(Gx, Gy, W, H, 1)
    }
    for (let index2 = 0; index2 <= Col * Row - 1; index2++) {
        R = Math.floor(index2 / Col)
        C2 = index2 % Col
        Gx = X + C2 * (W - 1)
        Gy = Y + R * (H - 1)
        Dstr = convertToText(DayMonthday[CalendarI])
        Osx = W / 2 - Dstr.length * 6 / 2
        Osy = H / 2 - 4
        if (R > 0 && CalendarI >= 0) {
            if (Month[CalendarI] == DateTimeToday[1]) {
                images.print(Src, Dstr, Gx + Osx, Gy + Osy, 1)
                if (DayMonthday[CalendarI] == DateTimeToday[0]) {
                    Src.drawRect(Gx, Gy, W, H, 5)
                }
            }
        }
        Dstr = convertToText(WeekName2digitFormat[C2])
        Osx = W / 2 - Dstr.length * 6 / 2
        Osy = H / 2 - 4
        if (R > 0) {
            CalendarI += 1
        } else {
            images.print(Src, Dstr, Gx + Osx, Gy + Osy, WeekColFormat[C2])
        }
    }
    CalculateDateTime(CurrentDate[2], CurrentDate[1], CurrentDate[0])
}
function CheckDateSetupDone (DateSetup: boolean) {
    DateTimeSetup = false
    BirthDateSetup = false
    if (DateSetup) {
        if (myModules.realTimeClock3.isConnected() || modules.realTimeClock1.isConnected()) {
            ModuleRealTimeClockUpdate()
            CheckDateSetupDone(false)
        } else if (blockSettings.exists("Date") || blockSettings.exists("Clock")) {
            DateTime = CalculateDateTime(blockSettings.readNumberArray("Date")[2], blockSettings.readNumberArray("Date")[1], blockSettings.readNumberArray("Date")[0])
            Clock = CalculateTimeClock(blockSettings.readNumberArray("Clock")[2], blockSettings.readNumberArray("Clock")[1], blockSettings.readNumberArray("Clock")[0])
            DateI = I22
        } else {
            SetupDateTimeBox()
            DateTimeSetup = true
        }
    } else {
        if (blockSettings.exists("BirthD")) {
            BirthDate = CalculateDateTime(blockSettings.readNumberArray("BirthD")[2], blockSettings.readNumberArray("BirthD")[1], blockSettings.readNumberArray("BirthD")[0])
        } else {
            SetupBirthDateBox()
            BirthDateSetup = true
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (DateTimeSetup) {
        DateTime = CalculateDateTime(DateSetupBox[2], DateSetupBox[1], DateSetupBox[0])
        DateI = I22
        Clock = CalculateTimeClock(DateSetupBox[3], DateSetupBox[4], DateSetupBox[5])
        DateTimeSetup = false
        CheckDateSetupDone(false)
    } else if (BirthDateSetup) {
        BirthDate = CalculateDateTime(DateSetupBox[2], DateSetupBox[1], DateSetupBox[0])
        blockSettings.writeNumberArray("BirthD", CalculateDateTime(BirthDate[2], BirthDate[1], BirthDate[0]))
        BirthDateSetup = false
    }
})
myModules.realTimeClock3.onConnectionChanged(jacdac.ClientConnectionState.Connected, function () {
    ModuleRealTimeClockUpdate()
    if (!(blockSettings.exists("BirthD"))) {
        CheckDateSetupDone(false)
    }
})
function DrawTimeClock (HasSecond: boolean, X: number, Y: number, Color: number, Src: Image) {
    Str = ""
    if (Clock[2] < 10) {
        Str = "" + Str + "0" + Clock[2]
    } else {
        Str = "" + Str + Clock[2]
    }
    Str = "" + Str + ":"
    if (Clock[1] < 10) {
        Str = "" + Str + "0" + Clock[1]
    } else {
        Str = "" + Str + Clock[1]
    }
    if (HasSecond) {
        Str = "" + Str + ":"
        if (Clock[0] < 10) {
            Str = "" + Str + "0" + Clock[0]
        } else {
            Str = "" + Str + Clock[0]
        }
    }
    images.print(Src, Str, X, Y, Color)
}
function DrawDateSetupCursor (Src: Image, Idx: number, X: number, Y: number) {
    if (Idx == 0) {
        Src.drawRect(X - 1, Y + 0, 15, 10, 1)
    } else if (Idx == 1) {
        Src.drawRect(X + 17, Y + 0, 15, 10, 1)
    } else if (Idx == 2) {
        Src.drawRect(X + 36, Y + 0, 26, 10, 1)
    } else if (Idx == 3) {
        Src.drawRect(X + 89, Y + 0, 16, 10, 1)
    } else if (Idx == 4) {
        Src.drawRect(X + 107, Y + 0, 16, 10, 1)
    } else {
        Src.drawRect(X + 125, Y + 0, 16, 10, 1)
    }
}
function CheckDateIdx (I: number) {
    if (I < 0) {
        return [
        0,
        0,
        0,
        0,
        0,
        0
        ]
    }
    return [
    DayMonthday[I],
    Month[I],
    Year[I],
    DayWeekday[I],
    Weeknumweek[I],
    DaySync[I]
    ]
}
function DrawBirthDateSetupCursor (Src: Image, Idx: number, X: number, Y: number) {
    if (Idx == 0) {
        Src.drawRect(X - 1, Y + 0, 15, 10, 1)
    } else if (Idx == 1) {
        Src.drawRect(X + 17, Y + 0, 15, 10, 1)
    } else {
        Src.drawRect(X + 36, Y + 0, 26, 10, 1)
    }
}
function DrawSubWordedDateTimedText (Color: number, X: number, Y: number, Src: Image, Mformat: any[], Wformat: any[]) {
    Str = ""
    Str = "" + Str + DateTime[0] + "/"
    Str = "" + Str + Mformat[DateTime[1] - 1] + "/"
    Str = "" + Str + Wformat[DateTime[3] - 1]
    images.print(Src, Str, X, Y, Color)
}
function CalculateDayOfWeek (Y: number, M: number, Dweek: number) {
    I22 = 0
    while (Year[I22] < Y) {
        I22 += 1
    }
    while (Month[I22] < M) {
        I22 += 1
    }
    while (DayWeekday[I22] < Dweek) {
        I22 += 1
    }
    while (DayWeekday[I22] > Dweek) {
        I22 += -1
        if (I22 < 0) {
            break;
        }
    }
    if (I22 < 0) {
        for (let index = 0; index < 7; index++) {
            ValB = 7 - Math.abs(I22)
            I22 += -1
            if (ValB == Dweek) {
                break;
            }
        }
    }
    return CheckDateIdx(I22)
}
function CalculateYourAgeOnBirthDate () {
    Count = 0
    for (let I = 0; I <= DaySync.length - 1; I++) {
        if (GetDateTimeMatching(BirthDate, I)) {
            Count += 1
        } else if (Count > 0) {
            if (CheckDateIdx(I)[1] == BirthDate[1]) {
                if (CheckDateIdx(I)[0] == BirthDate[0]) {
                    Count += 1
                }
            }
            if (GetDateTimeMatching(DateTime, I)) {
                Count += -1
                break;
            }
        }
    }
    return Count
}
function SetupTimeFormat () {
    WeekName2digitFormat = [
    "SU",
    "MO",
    "TU",
    "WE",
    "TH",
    "FR",
    "SA"
    ]
    WeekColFormat = [
    2,
    5,
    3,
    7,
    4,
    9,
    10
    ]
    SetupDateTime(1, 1, 1, 7, 1, 7, 1, 4, [
    [31, 31],
    [28, 29],
    [31, 31],
    [30, 30],
    [31, 31],
    [30, 30],
    [31, 31],
    [31, 31],
    [30, 30],
    [31, 31],
    [30, 30],
    [31, 31]
    ], 52, 2200, 1)
}
function CalculateDayMaxOfMonth (Y: number, M: number) {
    I22 = 0
    while (Year[I22] < Y) {
        I22 += 1
    }
    while (Month[I22] <= M) {
        I22 += 1
    }
    I22 += -1
    return CheckDateIdx(I22)
}
function SetupDateTimeBox () {
    DateTimeIdx = 0
    DateSetupBox = [
    1,
    1,
    2024,
    0,
    0,
    0
    ]
    MinDate = [
    1,
    1,
    Year[0],
    0,
    0,
    0
    ]
    MaxDate = [
    CalculateDayMaxOfMonth(DateSetupBox[2], DateSetupBox[1])[0],
    12,
    Year[Year.length - 1],
    23,
    59,
    59
    ]
}
function DrawDateSetupBox (X: number, Y: number, Src: Image, Hint: boolean) {
    Str = ""
    if (DateSetupBox[0] < 10) {
        Str = "" + Str + "0"
    }
    Str = "" + Str + DateSetupBox[0] + "-"
    if (DateSetupBox[1] < 10) {
        Str = "" + Str + "0"
    }
    Str = "" + Str + DateSetupBox[1] + "-"
    Str = "" + Str + DateSetupBox[2] + "     "
    if (DateSetupBox[3] < 10) {
        Str = "" + Str + "0"
    }
    Str = "" + Str + DateSetupBox[3] + ":"
    if (DateSetupBox[4] < 10) {
        Str = "" + Str + "0"
    }
    Str = "" + Str + DateSetupBox[4] + ":"
    if (DateSetupBox[5] < 10) {
        Str = "" + Str + "0"
    }
    Str = "" + Str + DateSetupBox[5]
    images.print(Src, Str, X, Y, 0)
if (Hint) {
        images.print(Src, "DD-MM-YYYY     hh:mm:ss", X, Y + 8, 1)
    }
}
function PlaceLogoToBackGround (X: number, Y: number, Width: number, Hight: number, Logo: Image) {
    Image2 = image.create(160, 120)
    spriteutils.drawTransparentImage(Logo, Image2, X - Width / 2, Y - Hight / 2)
return Image2
}
function SetupDateTime (_1stY: number, _1stM: number, _1stD: number, _1stWn: number, _1stWm: number, WNrem: number, StartY: number, RemY: number, DayMonth: number[][], WMrem: number, YearLimit: number, StartYear: number) {
    Year = []
    Month = []
    DayYearday = []
    DayMonthday = []
    DayWeekday = []
    Weeknumweek = []
    DaySync = []
    Y = _1stY
    D = _1stD
    Dsm = D
    DSY = _1stWn
    Dy = _1stD
    Dsc = _1stD
    for (let I2 = 0; I2 <= YearLimit; I2++) {
        M29 = 0
        if ((StartY + Y) % RemY == 0) {
            M29 += 1
        }
        M = 1
        for (let value of DayMonth) {
            for (let index = 0; index < value[M29]; index++) {
                if (Y > StartYear) {
                    DayYearday.push(N)
                    DayMonthday.push(D)
                    Month.push(M)
                    Year.push(Y)
                    DayWeekday.push(DSY % WNrem + 1)
                    Weeknumweek.push(Math.floor(DSY / WNrem) % WMrem + 1)
                    DaySync.push(Dsc - Sdsc)
                }
                DSY += 1
                Dsc += 1
                D += 1
                N += 1
            }
            Dsc += 1
            D = 1
            Dsm = D
            M += 1
        }
        if (Y == StartYear) {
            Sdsc = Dsc
        }
        Dsc += 1
        N = 1
        Y += 1
    }
}
function DrawAnalogClock (ClockDesignFormat: number[], X: number, Y: number, Redus: number, Src: Image) {
    spriteutils.drawCircle(
    Src,
    X,
    Y,
    ClockDesignFormat[5] * Redus ** 1.1,
    1
    )
for (let index5 = 0; index5 <= ClockDesignFormat[1] - 1; index5++) {
        Wdir = Math.floor(ClockDesignFormat[3] / ClockDesignFormat[1])
        Dir = index5 * Wdir
        Dir += -90
        Pos = spriteutils.pos(X, Y)
        Pos.x += ClockDesignFormat[5] * Redus * Math.cos(spriteutils.degreesToRadians(Dir))
Pos.y += ClockDesignFormat[5] * Redus * Math.sin(spriteutils.degreesToRadians(Dir))
PosB = spriteutils.pos(X, Y)
        if (index5 % ClockDesignFormat[4] == 0) {
            PosB.x += ClockDesignFormat[6] * Redus * Math.cos(spriteutils.degreesToRadians(Dir))
PosB.y += ClockDesignFormat[6] * Redus * Math.sin(spriteutils.degreesToRadians(Dir))
        } else {
            PosB.x += ClockDesignFormat[7] * Redus * Math.cos(spriteutils.degreesToRadians(Dir))
PosB.y += ClockDesignFormat[7] * Redus * Math.sin(spriteutils.degreesToRadians(Dir))
        }
        Src.drawLine(PosB.x, PosB.y, Pos.x, Pos.y, 1)
    }
    for (let index6 = 0; index6 <= ClockDesignFormat[2] - 1; index6++) {
        Wdir = Math.floor(ClockDesignFormat[3] / ClockDesignFormat[0])
        Dir = index6 * Wdir
        Dir += -90
        Pos = spriteutils.pos(X, Y)
        Pos.x += ClockDesignFormat[10] * Redus * Math.cos(spriteutils.degreesToRadians(Dir))
Pos.y += ClockDesignFormat[10] * Redus * Math.sin(spriteutils.degreesToRadians(Dir))
if (index6 == Clock[2]) {
            Src.drawLine(X, Y, Pos.x, Pos.y, 3)
        }
    }
    for (let index7 = 0; index7 <= ClockDesignFormat[1] - 1; index7++) {
        Wdir = Math.floor(ClockDesignFormat[3] / ClockDesignFormat[1])
        Dir = index7 * Wdir
        Dir += -90
        Pos = spriteutils.pos(X, Y)
        Pos.x += ClockDesignFormat[9] * Redus * Math.cos(spriteutils.degreesToRadians(Dir))
Pos.y += ClockDesignFormat[9] * Redus * Math.sin(spriteutils.degreesToRadians(Dir))
if (index7 == Clock[1]) {
            Src.drawLine(X, Y, Pos.x, Pos.y, 5)
        }
    }
    for (let index8 = 0; index8 <= ClockDesignFormat[1] - 1; index8++) {
        Wdir = Math.floor(ClockDesignFormat[3] / ClockDesignFormat[1])
        Dir = index8 * Wdir
        Dir += -90
        Pos = spriteutils.pos(X, Y)
        Pos.x += ClockDesignFormat[8] * Redus * Math.cos(spriteutils.degreesToRadians(Dir))
Pos.y += ClockDesignFormat[8] * Redus * Math.sin(spriteutils.degreesToRadians(Dir))
if (index8 == Clock[0]) {
            Src.drawLine(X, Y, Pos.x, Pos.y, 9)
        }
    }
}
function DateTimeUpdate (i: number) {
    DateTime = CheckDateIdx(i)
}
function ClockTimeUpdate () {
    Clock[0] = Clock[0] + 1
    if (Clock[0] >= 60) {
        Clock[0] = 0
        Clock[1] = Clock[1] + 1
        if (Clock[1] >= 60) {
            Clock[1] = 0
            Clock[2] = Clock[1] + 1
            if (Clock[1] >= 24) {
                Clock[1] = 0
                DateI += 1
            }
        }
    }
}
function DrawNormalDateTimedText (Color: number, X: number, Y: number, Src: Image, Buddhism: boolean, ShortYear: boolean) {
    Str = ""
    if (DateTime[0] < 10) {
        Str = "" + Str + "0" + DateTime[0] + "/"
    } else {
        Str = "" + Str + DateTime[0] + "/"
    }
    if (DateTime[1] < 10) {
        Str = "" + Str + "0" + DateTime[1] + "/"
    } else {
        Str = "" + Str + DateTime[1] + "/"
    }
    if (Buddhism) {
        Val = convertToText(DateTime[2] + 543)
    } else {
        Val = convertToText(DateTime[2])
    }
    for (let C = 0; C <= Val.length; C++) {
        if (ShortYear) {
            if (C > 1) {
                Str = "" + Str + Val.charAt(C)
            }
        } else {
            Str = "" + Str + Val.charAt(C)
        }
    }
    images.print(Src, Str, X, Y, Color)
}
function CalculateDayMaxOfYear (Y: number) {
    I22 = 0
    while (Year[I22] <= Y) {
        I22 += 1
    }
    I22 += -1
    return CheckDateIdx(I22)
}
function GetDateTimeMatching (Date: number[], Di: number) {
    Ci = 0
    j = 0
    for (let value2 of Date) {
        if (CheckDateIdx(Di)[j] == value2) {
            Ci += 1
        }
        j += 1
    }
    if (Ci < Date.length - 1) {
        return false
    }
    return true
}
function GetHoldKey (Click: boolean, Idx: number, HoldRem: number) {
    if (Click) {
        if (KeyHoldFrame[Idx] % HoldRem == 0) {
            KeyHoldFrame[Idx] = KeyHoldFrame[Idx] + 1
            return true
        }
        KeyHoldFrame[Idx] = KeyHoldFrame[Idx] + 1
        return false
    }
    KeyHoldFrame[Idx] = 0
    return false
}
function DrawDateText (Color: number, X: number, Y: number, Src: Image, Text: boolean, Buddhism: boolean, ShortYear: boolean) {
    if (Text) {
        DrawSubWordedDateTimedText(Color, X, Y, Src, [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
        ], [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
        ])
        return
    }
    DrawNormalDateTimedText(Color, X, Y, Src, Buddhism, ShortYear)
}
spriteutils.createRenderable(100, function (screen2) {
    if (SetupDone) {
        screen2.drawRect(0, 0, 160, 10, 15)
        screen2.fillRect(0, 0, 160, 10, 15)
        screen2.drawRect(0, 10, 160, 1, 1)
        if (DateTimeSetup) {
            DrawDateSetupBox(10, 10 + ((scene.screenHeight() - 10) / 2 - 4), screen2, true)
            DrawDateSetupCursor(screen2, DateTimeIdx, 9, 9 + ((scene.screenHeight() - 10) / 2 - 4))
            images.printCenter(screen2, "SetCurrentDateTime", 10 + ((scene.screenHeight() - 10) / 4 - 4), 1)
        } else if (BirthDateSetup) {
            DrawBirthDateSetupBox(48, 10 + ((scene.screenHeight() - 10) / 2 - 4), screen2, true)
            DrawBirthDateSetupCursor(screen2, DateTimeIdx, 47, 9 + ((scene.screenHeight() - 10) / 2 - 4))
            images.printCenter(screen2, "SetYourBirthDate", 10 + ((scene.screenHeight() - 10) / 4 - 4), 1)
        } else {
            DrawDateText(1, 1, 1, screen2, false, false, true)
            DrawTimeClock(false, 64, 1, 1, screen2)
            DateTimeToday = DateTime
            DrawCalendar(1, DateTimeToday, 7, 7, 6, 30, 14, 10, screen2)
            DrawAnalogClock([
            12,
            60,
            24,
            360,
            5,
            12,
            10,
            11,
            8,
            6,
            4
            ], 128, 60, 2, screen2)
            BirthAge = CalculateYourAgeOnBirthDate()
            images.printCenter(screen2, "YourAgeIs: " + convertToText(BirthAge), 11, 1)
        }
    }
})
modules.realTimeClock1.onConnectionChanged(jacdac.ClientConnectionState.Disconnected, function () {
    if (blockSettings.exists("Date") || blockSettings.exists("Clock")) {
        CalculateDateTime(blockSettings.readNumberArray("Date")[2], blockSettings.readNumberArray("Date")[1], blockSettings.readNumberArray("Date")[0])
        CalculateTimeClock(blockSettings.readNumberArray("Clock")[0], blockSettings.readNumberArray("Clock")[1], blockSettings.readNumberArray("Clock")[2])
        DateI = I22
    } else {
        SetupDateTimeBox()
        DateTimeSetup = true
    }
})
function ModuleRealTimeClockUpdate () {
    if (myModules.realTimeClock3.isConnected()) {
        DateTime = CalculateDateTime(myModules.realTimeClock3.year(), myModules.realTimeClock3.month(), myModules.realTimeClock3.dayOfMonth())
        Clock = CalculateTimeClock(myModules.realTimeClock3.hour(), myModules.realTimeClock3.min(), myModules.realTimeClock3.sec())
    } else {
        if (modules.realTimeClock1.isConnected()) {
            DateTime = CalculateDateTime(modules.realTimeClock1.year(), modules.realTimeClock1.month(), modules.realTimeClock1.dayOfMonth())
            Clock = CalculateTimeClock(modules.realTimeClock1.hour(), modules.realTimeClock1.min(), modules.realTimeClock1.sec())
        }
    }
    DateTime = CalculateDateTime(DateTime[2], DateTime[1], DateTime[0])
    DateI = I22
    blockSettings.writeNumberArray("Date", DateTime)
    blockSettings.writeNumberArray("Clock", Clock)
}
myModules.realTimeClock3.onConnectionChanged(jacdac.ClientConnectionState.Disconnected, function () {
    if (blockSettings.exists("Date") || blockSettings.exists("Clock")) {
        CalculateDateTime(blockSettings.readNumberArray("Date")[2], blockSettings.readNumberArray("Date")[1], blockSettings.readNumberArray("Date")[0])
        CalculateTimeClock(blockSettings.readNumberArray("Clock")[0], blockSettings.readNumberArray("Clock")[1], blockSettings.readNumberArray("Clock")[2])
        DateI = I22
    } else {
        SetupDateTimeBox()
        DateTimeSetup = true
    }
})
function CalculateTimeClock (H: number, M: number, S: number) {
    return [S, M, H]
}
modules.realTimeClock1.onConnectionChanged(jacdac.ClientConnectionState.Connected, function () {
    ModuleRealTimeClockUpdate()
    if (!(blockSettings.exists("BirthD"))) {
        CheckDateSetupDone(false)
    }
})
function SetupBirthDateBox () {
    DateTimeIdx = 0
    DateSetupBox = [1, 1, 2024]
    MinDate = [1, 1, Year[0]]
    MaxDate = [CalculateDayMaxOfMonth(DateSetupBox[2], DateSetupBox[1])[0], 12, Year[Year.length - 1]]
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    blockSettings.clear()
    game.reset()
})
function DrawBirthDateSetupBox (X: number, Y: number, Src: Image, Hint: boolean) {
    Str = ""
    if (DateSetupBox[0] < 10) {
        Str = "" + Str + "0"
    }
    Str = "" + Str + DateSetupBox[0] + "-"
    if (DateSetupBox[1] < 10) {
        Str = "" + Str + "0"
    }
    Str = "" + Str + DateSetupBox[1] + "-"
    Str = "" + Str + DateSetupBox[2]
    images.print(Src, Str, X, Y, 0)
if (Hint) {
        images.print(Src, "DD-MM-YYYY", X, Y + 8, 1)
    }
}
function CalculateDateTime (Y: number, M: number, D: number) {
    I22 = 0
    while (Year[I22] < Y) {
        I22 += 1
    }
    while (Month[I22] < M) {
        I22 += 1
    }
    while (DayMonthday[I22] < D) {
        I22 += 1
    }
    return CheckDateIdx(I22)
}
let NDate: number[] = []
let BirthAge = 0
let j = 0
let Ci = 0
let Val = ""
let Wdir = 0
let Sdsc = 0
let N = 0
let M = 0
let M29 = 0
let Dsc = 0
let Dy = 0
let DSY = 0
let Dsm = 0
let D = 0
let DayYearday: number[] = []
let MaxDate: number[] = []
let MinDate: number[] = []
let DateTimeIdx = 0
let Count = 0
let ValB = 0
let DaySync: number[] = []
let Weeknumweek: number[] = []
let DayWeekday: number[] = []
let Year: number[] = []
let DateSetupBox: number[] = []
let BirthDate: number[] = []
let DateI = 0
let Clock: number[] = []
let DateTime: number[] = []
let BirthDateSetup = false
let DateTimeSetup = false
let DateTimeToday: number[] = []
let Month: number[] = []
let Osy = 0
let Osx = 0
let Dstr = ""
let R = 0
let I22 = 0
let KeyHoldFrame: number[] = []
let SetupDone = false
let Y = 0
let Str = ""
let CalendarI = 0
let C2 = 0
let Gx = 0
let Gy = 0
let DayMonthday: number[] = []
let WeekName2digitFormat: string[] = []
let WeekColFormat: number[] = []
let Image2: Image = null
let Dir = 0
let Pos: spriteutils.Position = null
let PosB: spriteutils.Position = null
scene.setBackgroundImage(PlaceLogoToBackGround(80, 60, 80, 80, img`
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    .......................11dddd333333aaaa.aa.....cc888............................
    .......................1d333aaaaaaaccca.aaa...ccc88886..........................
    .......................d3333aaaaaacccca.aaa...cc88..86..........................
    .......................d333aaa33aacccca.aaac.ccc8....66.........................
    .......................d33aaaa33aacccca.aacc.ccc8....66.........................
    .......................daaa333333aaccca.aacccccc8...............................
    .......................3aaa33333aaaccca.aa.ccc.c8....66.........................
    .......................3aaa3333aaaaccca.aa.ccc.88....66.........................
    .......................3aaa333aaaccccca.ac..c...88..66..........................
    .......................3aaa33aaaaccccca.ac..c...888866.67.......................
    .......................3aaaaaaaaaaaccca.cc........88...67.......................
    .......................3accaaaaaaaaccca.........................................
    .......................acccaaaaaaaacccc.cccccc8.....666.........................
    .......................acccccccccccccfc.cccccc88..86666.........................
    .......................accccccccccccffc.cc....88..86............................
    .......................aaaaaaaaaaaacccc.cc....88.86.............................
    .......................aaaddaaaaaaccccc.cc...888.86.............................
    .......................aaaddaaaacccc33c.cccc888..66667..........................
    .......................addddddcccccc33c.cccc8888..66677.........................
    .......................addd333cc33ccccc.cc....886....77.........................
    .......................ccc33cccc33ccccc.cc.....86....77.........................
    .......................ccc33ccccccccccc.c8.....66...77..........................
    .......................cccccccccccccccc.888888666.6777..........................
    .......................cccccccccccccccc.88888666.667............................
    ................................................................................
    ................................................................................
    .....1...1......1......................1.......11....................1..........
    .....11.11......1......................1......1..1...................1..........
    .....1.1.1..111.1.1...11...111..11...111..11..1..1.1.11..111..111..111..11......
    .....1...1.1..1.11...1.11.1....1..1.1..1.1.11.1111.11...1....1..1.1..1.1.11.....
    .....1...1.1..1.1.1..11...1....1..1.1..1.11...1..1.1....1....1..1.1..1.11.......
    .....1...1..111.1..1..111..111..11...111..111.1..1.1.....111..111..111..111.....
    ................................................................................
    ................................................................................
    .............111.............1.........11.............1.........................
    .............1..1.....................1..1............1.........................
    .............111...111..111..1....111..1...1..1..111.111...11..11.1.............
    .............1..1.1..1.11....1...1......1..1..1.11....1...1.11.1.1.1............
    .............1..1.1..1...11..1...1....1..1..111...11..1.1.11...1.1.1............
    .............111...111.111...1....111..11..1..1.111....1...111.1.1.1............
    ............................................11..................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    `))
SetupDone = false
pause(100)
SetupTimeFormat()
scene.setBackgroundImage(img`
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    `)
scene.setBackgroundColor(8)
SetupDone = true
SetupDateTimeBox()
KeyHoldFrame = [
0,
0,
0,
0,
0,
0,
0
]
CheckDateSetupDone(true)
if (blockSettings.exists("BirthD")) {
    CheckDateSetupDone(false)
}
game.onUpdate(function () {
    if (DateTimeSetup) {
        NDate = CalculateDateTime(DateSetupBox[2], DateSetupBox[1], DateSetupBox[0])
        DateSetupBox = [
        NDate[0],
        NDate[1],
        NDate[2],
        DateSetupBox[3],
        DateSetupBox[4],
        DateSetupBox[5]
        ]
        MaxDate = [
        CalculateDayMaxOfMonth(DateSetupBox[2], DateSetupBox[1])[0],
        12,
        Year[Year.length - 1],
        23,
        59,
        59
        ]
        DateSetupBox[0] = Math.min(NDate[0], MaxDate[0])
        if (GetHoldKey(controller.left.isPressed(), 2, 4)) {
            DateTimeIdx = Math.max(DateTimeIdx - 1, 0)
        }
        if (GetHoldKey(controller.right.isPressed(), 0, 4)) {
            DateTimeIdx = Math.min(DateTimeIdx + 1, 5)
        }
        if (GetHoldKey(controller.up.isPressed(), 3, 4)) {
            DateSetupBox[DateTimeIdx] = Math.min(DateSetupBox[DateTimeIdx] + 1, MaxDate[DateTimeIdx])
        }
        if (GetHoldKey(controller.down.isPressed(), 1, 4)) {
            DateSetupBox[DateTimeIdx] = Math.max(DateSetupBox[DateTimeIdx] - 1, MinDate[DateTimeIdx])
        }
    } else if (BirthDateSetup) {
        NDate = CalculateDateTime(DateSetupBox[2], DateSetupBox[1], DateSetupBox[0])
        DateSetupBox = [NDate[0], NDate[1], NDate[2]]
        MaxDate = [CalculateDayMaxOfMonth(DateSetupBox[2], DateSetupBox[1])[0], 12, Year[Year.length - 1]]
        DateSetupBox[0] = Math.min(NDate[0], MaxDate[0])
        if (GetHoldKey(controller.left.isPressed(), 2, 4)) {
            DateTimeIdx = Math.max(DateTimeIdx - 1, 0)
        }
        if (GetHoldKey(controller.right.isPressed(), 0, 4)) {
            DateTimeIdx = Math.min(DateTimeIdx + 1, 2)
        }
        if (GetHoldKey(controller.up.isPressed(), 3, 4)) {
            DateSetupBox[DateTimeIdx] = Math.min(DateSetupBox[DateTimeIdx] + 1, MaxDate[DateTimeIdx])
        }
        if (GetHoldKey(controller.down.isPressed(), 1, 4)) {
            DateSetupBox[DateTimeIdx] = Math.max(DateSetupBox[DateTimeIdx] - 1, MinDate[DateTimeIdx])
        }
        NDate = CalculateDateTime(DateSetupBox[2], DateSetupBox[1], DateSetupBox[0])
        DateSetupBox = [NDate[0], NDate[1], NDate[2]]
        MaxDate = [CalculateDayMaxOfMonth(DateSetupBox[2], DateSetupBox[1])[0], 12, Year[Year.length - 1]]
        if (GetHoldKey(controller.left.isPressed(), 2, 4)) {
            DateTimeIdx = Math.max(DateTimeIdx - 1, 0)
        }
        if (GetHoldKey(controller.right.isPressed(), 0, 4)) {
            DateTimeIdx = Math.min(DateTimeIdx + 1, 2)
        }
        if (GetHoldKey(controller.up.isPressed(), 3, 4)) {
            DateSetupBox[DateTimeIdx] = Math.min(DateSetupBox[DateTimeIdx] + 1, MaxDate[DateTimeIdx])
        }
        if (GetHoldKey(controller.down.isPressed(), 1, 4)) {
            DateSetupBox[DateTimeIdx] = Math.max(DateSetupBox[DateTimeIdx] - 1, MinDate[DateTimeIdx])
        }
    } else {
        if (modules.realTimeClock1.isConnected() || myModules.realTimeClock3.isConnected()) {
            ModuleRealTimeClockUpdate()
        } else {
            DateTimeUpdate(DateI)
        }
        blockSettings.writeNumberArray("Date", DateTime)
        blockSettings.writeNumberArray("Clock", Clock)
        if (blockSettings.exists("BirthD")) {
            if (blockSettings.readNumberArray("BirthD").length == 0) {
                blockSettings.remove("BirthD")
            }
            CheckDateSetupDone(false)
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (!(DateTimeSetup)) {
        if (!(myModules.realTimeClock3.isConnected())) {
            ClockTimeUpdate()
        }
    }
})
