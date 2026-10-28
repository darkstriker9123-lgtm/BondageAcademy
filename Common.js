// Main variables
var CurrentIntro;
var CurrentStage;
var CurrentText;
var CurrentChapter;
var CurrentScreen;
var CurrentLanguageTag = "EN";
var OverridenIntroText;
var OverridenIntroImage;
var LeaveChapter = "";
var LeaveScreen = "";
var LeaveIcon = "";
var MouseX = 0;
var MouseY = 0;
var KeyPress = "";
var IsMobile = false;
var TextPhase = 0;
var CSVCache = {};
var MaxFightSequence = 500;
var MaxRaceSequence = 1000;
var AllowCheats = false;

// Array variables (CSV column indexes)
var IntroStage = 0;
var IntroLoveReq = 1;
var IntroSubReq = 2;
var IntroVarReq = 3;
var IntroText = 4;
var	IntroImage = 5;
var StageNumber = 0;
var StageLoveReq = 1;
var StageSubReq = 2;
var StageVarReq = 3;
var StageInteractionText = 4;
var StageInteractionResult = 5;
var StageNextStage = 6;
var StageLoveMod = 7;
var StageSubMod = 8;
var StageFunction = 9;
var TextTag = 0;
var TextContent = 1;
var FightMoveType = 0;
var FightMoveTime = 1;
var RaceMoveType = 0;
var RaceMoveTime = 1;

// Common variables - Player state
var Common_BondageAllowed = true;
var Common_SelfBondageAllowed = true;
var Common_PlayerName = "";
var Common_PlayerOwner = "";
var Common_PlayerLover = "";
var Common_PlayerRestrained = false;
var Common_PlayerGagged = false;
var Common_PlayerBlinded = false;
var Common_PlayerChaste = false;
var Common_PlayerNotRestrained = true;
var Common_PlayerNotGagged = true;
var Common_PlayerNotBlinded = true;
var Common_PlayerClothed = true;
var Common_PlayerUnderwear = false;
var Common_PlayerNaked = false;
var Common_PlayerCloth = "";
var Common_PlayerCostume = "";
var Common_PlayerPose = "";
var Common_ActorIsLover = false;
var Common_ActorIsOwner = false;
var Common_ActorIsOwned = false;
var Common_Number = "";

// New player status flags (remake)
var Common_PlayerSedated = false;		// chloroformed / sleeping pills / drugs
var Common_PlayerOwned = false;			// player is owned by someone
var Common_PlayerBroken = false;		// mind broken / fully trained
var Common_PlayerForSale = false;		// on the black market
var Common_PlayerInCage = false;		// locked in a cage
var Common_PlayerEscaped = false;		// recently escaped

// Chapter list for the remake — 100 days + Outro/Ending
// Kinbaku Club is integrated into the day system (no separate club chapter)
var Common_ChapterList = (function () {
	var list = ["C000_Intro"];
	for (var d = 1; d <= 100; d++) {
		var n3 = ("000" + d).slice(-3);
		var n2 = (d < 100) ? ("00" + d).slice(-2) : String(d);
		list.push("C" + n3 + "_Day" + n2);
	}
	list.push("C101_Outro");
	list.push("C102_Ending");
	list.push("C999_Common");	// shared resources (ActorNames, icons, etc.)
	return list;
})();

// Returns TRUE if the variable is a number
function IsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Returns the current date and time in a yyyy-mm-dd hh:mm:ss format
function GetFormatDate() {
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
	var dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
	var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
	return "".concat(yyyy).concat("-").concat(mm).concat("-").concat(dd).concat(" ").concat(hh).concat(":").concat(min).concat(":").concat(ss);
}

// Used to detect whether the users browser is an mobile browser
function DetectMobile() {

	// First check
    if (sessionStorage.desktop) return false;
    else if (localStorage.mobile) return true;

    // Alternative check
    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile','mobile/'];
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

    // If nothing is found, we assume desktop
    return false;
}

// Parse a CSV file
function ParseCSV(str) {

    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline and we're not in a quoted field, move on to the next
        // row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

// Read a CSV file from the web site
function ReadCSV(Array, ChapterOrPath, Screen, Type, Language) {
    // Changed from a single path to various arguments and internally concatenate them
    // This ternary operator is used to keep backward compatibility
    var Path = (Screen && Type)
                 ? ChapterOrPath + "/" + Screen + "/" + Type + (Language ? "_" : "") + (Language || "") + ".csv"
                 : ChapterOrPath;

    if (CSVCache[Path]) {
        window[Array] = CSVCache[Path];
        return;
    }

    // Opens the file, parse it and returns the result in an array
    Get(Path + (TranslationCheatAllow ? "?force_" + TranslationCacheCounter : ""), function() {
        if (this.status == 200) {
            CSVCache[Path] = ParseCSV(this.responseText);
            window[Array] = CSVCache[Path];
        } else if (this.status == 404 && Language && Language != "EN") { // If language isn't EN and the file doesn't exist, then fallback to EN
            ReadCSV(Array, ChapterOrPath, Screen, Type, "EN");
        }
    });
}

// AJAX utility
function Get(Path, Callback) {
	var xhr = new XMLHttpRequest();
    xhr.open("GET", Path);
    xhr.onreadystatechange = function() { if (this.readyState == 4) Callback.bind(this)(); };
    xhr.send(null);
}

// Shuffles all array elements at random
function ArrayShuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// Returns a working language if translation isn't fully ready
function GetWorkingLanguage() {
	return GetWorkingLanguageForChapter(CurrentChapter);
}

// Returns a working language for a specific chapter
// Only English and Chinese are supported in the remake
function GetWorkingLanguageForChapter(Chapter) {
	// Chinese support - all new day chapters + specials
	if (CurrentLanguageTag == "CN") {
		if (Common_ChapterList.indexOf(Chapter) >= 0) return "CN";
	}
	// Everything else falls back to English
	return "EN";
}

// Load the interactions from a scene and keep it in common variable
function LoadInteractions() {
	ReadCSV("CurrentIntro", CurrentChapter, CurrentScreen, "Intro", GetWorkingLanguage());
	ReadCSV("CurrentStage", CurrentChapter, CurrentScreen, "Stage", GetWorkingLanguage());
	LoadText();
}

// Load the custom texts from a scene and keep it in common variable
function LoadText() {
	ReadCSV("CurrentText", CurrentChapter, CurrentScreen, "Text", GetWorkingLanguage());
}

// Calls a dynamic function (if it exists)
function DynamicFunction(FunctionName) {
	if (typeof window[FunctionName.substr(0, FunctionName.indexOf("("))] == "function") {
		var Fct = new Function(FunctionName);
		Fct();
	} else console.log("Trying to launch invalid function: " + FunctionName);
}

// Set the current scene (chapter and screen)
function SetScene(Chapter, Screen) {

	// Keep the chapter and screen
	CurrentStage = null;
	CurrentIntro = null;
	CurrentText = null;
	CurrentActor = "";
	CurrentChapter = Chapter;
	CurrentScreen = Screen;
	OverridenIntroText = "";
	OverridenIntroImage = "";
	LeaveIcon = "";
	LeaveScreen = "";
	LeaveChapter = Chapter;
	Common_ActorIsLover = false;
	Common_ActorIsOwner = false;
	Common_ActorIsOwned = false;

	// Load the screen code
	DynamicFunction(CurrentChapter + "_" + CurrentScreen + "_Load()");

}

// Validates if any interaction was clicked
function ClickInteraction(CurrentStagePosition) {

	if (CurrentStage == null) return;

	// Build same available list as Drawing.js
	var list = [];
	for (var L = 0; L < CurrentStage.length; L++)
		if (CurrentStage[L][StageNumber] == CurrentStagePosition)
			if (ActorInteractionAvailable(CurrentStage[L][StageLoveReq], CurrentStage[L][StageSubReq], CurrentStage[L][StageVarReq], CurrentStage[L][StageInteractionText], false))
				list.push(CurrentStage[L]);

	var total = list.length;
	var maxPage = Math.max(0, Math.ceil(total / 4) - 1);
	if (typeof InteractionOptionPage === "undefined") InteractionOptionPage = 0;
	if (InteractionOptionPage > maxPage) InteractionOptionPage = maxPage;
	if (InteractionOptionPage < 0) InteractionOptionPage = 0;

	var start = InteractionOptionPage * 4;
	var show = list.slice(start, start + 4);

	// Check option rows 0-3
	for (var i = 0; i < show.length; i++) {
		var top = UI_OPT_TOP + i * (UI_OPT_H + UI_OPT_GAP);
		if ((MouseX >= UI_OPT_X) && (MouseX <= UI_OPT_X + UI_OPT_W) && (MouseY >= top) && (MouseY <= top + UI_OPT_H)) {
			var opt = show[i];
			InteractionOptionPage = 0; // reset page on choice
			CurrentStagePosition = opt[StageNextStage];
			ActorChangeAttitude(opt[StageLoveMod], opt[StageSubMod]);
			if (opt[StageFunction] != "") DynamicFunction(opt[StageFunction]);
			if (opt[StageInteractionResult].indexOf("ADD_MINUTES:") == 0) {
				var Minutes = parseInt(opt[StageInteractionResult].substr(12));
				if (!isNaN(Minutes)) {
					CurrentTime = CurrentTime + (Minutes * 60000);
					if (typeof AddMinutes === "function") AddMinutes(Minutes);
				}
				OverridenIntroText = opt[StageInteractionResult].substr(opt[StageInteractionResult].indexOf("|") + 1);
			} else OverridenIntroText = opt[StageInteractionResult];
			LoadInteractions();
			return;
		}
	}

	// 5th slot: Next / Back when more than 4 options
	if (total > 4) {
		var top5 = UI_OPT_TOP + 4 * (UI_OPT_H + UI_OPT_GAP);
		if ((MouseX >= UI_OPT_X) && (MouseX <= UI_OPT_X + UI_OPT_W) && (MouseY >= top5) && (MouseY <= top5 + UI_OPT_H)) {
			if (InteractionOptionPage < maxPage) InteractionOptionPage++;
			else if (InteractionOptionPage > 0) InteractionOptionPage--;
			return;
		}
	}

}

// Returns a text from the current text CSV
function GetText(Tag) {
	if (CurrentText == null) return "MISSING TEXT FOR TAG: " + Tag;
	for (var T = 0; T < CurrentText.length; T++)
		if (CurrentText[T][TextTag] == Tag)
			return CurrentText[T][TextContent];
	return "MISSING TEXT FOR TAG: " + Tag;
}

// Returns a text from a specific CSV array
function GetCSVText(CSVArray, Tag) {
	if (CSVArray == null) return "MISSING TEXT FOR TAG: " + Tag;
	for (var T = 0; T < CSVArray.length; T++)
		if (CSVArray[T][TextTag] == Tag)
			return CSVArray[T][TextContent];
	return "MISSING TEXT FOR TAG: " + Tag;
}

// When the leave / wait button is clicked (top-right, matches Drawing.js)
function LeaveButtonClick() {
	if (!((MouseX >= UI_W - 100) && (MouseX <= UI_W) && (MouseY >= 0) && (MouseY <= UI_TOP_H))) return;
	if (LeaveIcon == "Leave") {
		if (LeaveScreen != "") SetScene(LeaveChapter, LeaveScreen);
		else if (LeaveChapter != "") SetScene(LeaveChapter, "MainHall");
	}
	if (LeaveIcon == "Wait") {
		CurrentTime = CurrentTime + 60000;
		if (typeof AddMinutes === "function") AddMinutes(1);
	}
}

// Returns the full path of a file
function GetPath(FileName) {
	return CurrentChapter + "/" + CurrentScreen + "/" + FileName;
}
