// C000_Intro / CreatePlayer — name + starting skill → C001_Day01 (Saturday)
// Layout tuned for 1920×1280

var C000_Intro_CreatePlayer_ChapterToLoad = "C001_Day01";
var C000_Intro_CreatePlayer_ScreenToLoad = "Intro";
var C000_Intro_CreatePlayer_ControlLoaded = false;

// Panel geometry (left side of screen)
var CP_PANEL_W = 900;
var CP_INPUT_X = 200;
var CP_INPUT_Y = 300;
var CP_SELECT_X = 300;
var CP_SELECT_Y = 420;
var CP_BTN_X = 300;
var CP_BTN_Y = 580;
var CP_BTN_W = 300;
var CP_BTN_H = 80;

function C000_Intro_CreatePlayer_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	C000_Intro_CreatePlayer_ControlLoaded = false;
	LoadText();
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_CreatePlayer_ClearControls() {
	var n = document.getElementById("InputName");
	var s = document.getElementById("SelectSkill");
	if (n && n.parentNode) n.parentNode.removeChild(n);
	if (s && s.parentNode) s.parentNode.removeChild(s);
	C000_Intro_CreatePlayer_ControlLoaded = false;
}

function C000_Intro_CreatePlayer_Run() {
	// Full background
	DrawRect(0, 0, UI_W, UI_H, "#f5f5f8");

	// Player preview (transition frame 1)
	PlayerTransitionFrame = 1;
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(1);

	// Left white panel for form
	DrawRect(0, 0, CP_PANEL_W, UI_H, "rgba(255,255,255,0.92)");

	var t1 = GetText("EnterName");
	var t2 = GetText("ValidChars");
	if (!t1 || t1.indexOf("MISSING") == 0) t1 = "Enter a name and select a starting skill.";
	if (!t2 || t2.indexOf("MISSING") == 0) t2 = "Letters and spaces only (max 20).";
	DrawText(t1, CP_PANEL_W / 2, 140, "black");
	DrawText(t2, CP_PANEL_W / 2, 200, "black");

	// HTML controls (absolute positions match canvas scale)
	if (!C000_Intro_CreatePlayer_ControlLoaded) {
		var InputName = document.createElement("input");
		InputName.setAttribute("id", "InputName");
		InputName.setAttribute("name", "InputName");
		InputName.setAttribute("type", "text");
		InputName.setAttribute("value", "");
		InputName.setAttribute("maxlength", "20");
		InputName.setAttribute("style",
			"font-size:28px; font-family:Arial; position:absolute; padding-left:12px; " +
			"left:" + CP_INPUT_X + "px; top:" + CP_INPUT_Y + "px; width:500px; height:56px; z-index:10;");
		InputName.addEventListener("keypress", KeyDown);
		document.body.appendChild(InputName);
		InputName.focus();

		var SelectSkill = document.createElement("select");
		SelectSkill.setAttribute("id", "SelectSkill");
		SelectSkill.setAttribute("name", "SelectSkill");
		SelectSkill.setAttribute("style",
			"font-size:28px; font-family:Arial; position:absolute; padding-left:12px; " +
			"left:" + CP_SELECT_X + "px; top:" + CP_SELECT_Y + "px; width:300px; height:56px; z-index:10;");
		var defaults = ["No skill", "Arts", "Fighting", "Rope Mastery", "Sports", "Seduction"];
		for (var S = 0; S <= 5; S++) {
			var label = GetText("Skill" + S);
			if (!label || label.indexOf("MISSING") == 0) label = defaults[S];
			SelectSkill.appendChild(new Option(label, S.toString()));
		}
		document.body.appendChild(SelectSkill);
		C000_Intro_CreatePlayer_ControlLoaded = true;
	}

	// Validate button
	var hover = (MouseX >= CP_BTN_X && MouseX <= CP_BTN_X + CP_BTN_W &&
		MouseY >= CP_BTN_Y && MouseY <= CP_BTN_Y + CP_BTN_H);
	DrawRect(CP_BTN_X, CP_BTN_Y, CP_BTN_W, CP_BTN_H, hover ? "#a03d5c" : "#8c304e");
	MainCanvas.font = UI_FONT;
	MainCanvas.fillStyle = "white";
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	var vlabel = GetText("Validate");
	if (!vlabel || vlabel.indexOf("MISSING") == 0) vlabel = "Start the game";
	MainCanvas.fillText(vlabel, CP_BTN_X + CP_BTN_W / 2, CP_BTN_Y + CP_BTN_H / 2);
}

function C000_Intro_CreatePlayer_Validate() {
	var input = document.getElementById("InputName");
	var select = document.getElementById("SelectSkill");
	if (!input || !select) return;

	var NewName = input.value.trim();
	var StartingSkill = select.value.trim();
	// Letters, spaces, Chinese characters
	var letters = /^[a-zA-Z\u4e00-\u9fff ]+$/;
	if (!(NewName.match(letters) && NewName.length > 0 && NewName.length <= 20)) return;

	if (StartingSkill == "1") PlayerAddSkill("Arts", 1);
	if (StartingSkill == "2") PlayerAddSkill("Fighting", 1);
	if (StartingSkill == "3") PlayerAddSkill("RopeMastery", 1);
	if (StartingSkill == "4") PlayerAddSkill("Sports", 1);
	if (StartingSkill == "5") PlayerAddSkill("Seduction", 1);
	PlayerSkillShowLevelUp = 0;
	Common_PlayerName = NewName;

	C000_Intro_CreatePlayer_ClearControls();

	// Start calendar at Day 1 (Saturday) morning
	if (typeof CurrentDay !== "undefined") CurrentDay = 1;
	if (typeof CurrentMinute !== "undefined") CurrentMinute = 8 * 60;
	if (typeof SetTime === "function") SetTime(8, 0);

	SetScene(C000_Intro_CreatePlayer_ChapterToLoad, C000_Intro_CreatePlayer_ScreenToLoad);
}

function C000_Intro_CreatePlayer_KeyDown() {
	// Enter validates if focus is not trapped oddly
	if (KeyPress == 13) C000_Intro_CreatePlayer_Validate();
}

function C000_Intro_CreatePlayer_Click() {
	if ((MouseX >= CP_BTN_X) && (MouseX <= CP_BTN_X + CP_BTN_W) &&
		(MouseY >= CP_BTN_Y) && (MouseY <= CP_BTN_Y + CP_BTN_H))
		C000_Intro_CreatePlayer_Validate();
}
