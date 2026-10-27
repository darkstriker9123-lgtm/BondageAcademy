// C000_Intro / CreatePlayer — styled name + skill → Day01
var C000_Intro_CreatePlayer_ChapterToLoad = "C001_Day01";
var C000_Intro_CreatePlayer_ScreenToLoad = "Intro";
var C000_Intro_CreatePlayer_ControlLoaded = false;

var CP_PANEL_W = 560;
var CP_INPUT_X = 80;
var CP_INPUT_Y = 340;
var CP_INPUT_W = 420;
var CP_SELECT_X = 80;
var CP_SELECT_Y = 480;
var CP_SELECT_W = 420;
var CP_BTN_X = 80;
var CP_BTN_Y = 620;
var CP_BTN_W = 360;
var CP_BTN_H = 78;

var CP_SKILL_KEYS = [
	"", "Arts", "Fighting", "RopeMastery", "Sports", "Seduction",
	"Medicine", "Stealth", "Observation", "Endurance", "Psychology", "Dance"
];

function C000_Intro_CreatePlayer_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	C000_Intro_CreatePlayer_ControlLoaded = false;
	LoadText();
	PlayerTransitionFrame = 1;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_CreatePlayer_ClearControls() {
	var n = document.getElementById("InputName");
	var s = document.getElementById("SelectSkill");
	if (n && n.parentNode) n.parentNode.removeChild(n);
	if (s && s.parentNode) s.parentNode.removeChild(s);
	C000_Intro_CreatePlayer_ControlLoaded = false;
}

function C000_Intro_CreatePlayer_PlaceControl(el, logicalX, logicalY, logicalW, logicalH) {
	var canvas = document.getElementById("MainCanvas");
	var rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: 1920, height: 1280 };
	var sx = rect.width / 1920;
	var sy = rect.height / 1280;
	el.style.position = "absolute";
	el.style.left = Math.round(rect.left + window.scrollX + logicalX * sx) + "px";
	el.style.top = Math.round(rect.top + window.scrollY + logicalY * sy) + "px";
	el.style.width = Math.round(logicalW * sx) + "px";
	el.style.height = Math.round(logicalH * sy) + "px";
	el.style.fontSize = Math.max(14, Math.round(26 * sy)) + "px";
	el.style.fontFamily = "Arial";
	el.style.zIndex = "10";
	el.style.paddingLeft = "12px";
	el.style.boxSizing = "border-box";
	el.style.border = "2px solid rgba(200,100,140,0.45)";
	el.style.borderRadius = "6px";
	el.style.background = "rgba(255,255,255,0.95)";
	el.style.color = "#222";
}

function C000_Intro_CreatePlayer_OnResize() {
	var n = document.getElementById("InputName");
	var s = document.getElementById("SelectSkill");
	if (n) C000_Intro_CreatePlayer_PlaceControl(n, CP_INPUT_X, CP_INPUT_Y, CP_INPUT_W, 52);
	if (s) C000_Intro_CreatePlayer_PlaceControl(s, CP_SELECT_X, CP_SELECT_Y, CP_SELECT_W, 52);
}

function C000_Intro_CreatePlayer_DrawWrapped(text, x, y, maxW, lineH) {
	var words = String(text).split(" ");
	var line = "";
	var cy = y;
	for (var i = 0; i < words.length; i++) {
		var test = line ? (line + " " + words[i]) : words[i];
		if (MainCanvas.measureText(test).width > maxW && line) {
			MainCanvas.fillText(line, x, cy);
			line = words[i];
			cy += lineH;
		} else line = test;
	}
	if (line) MainCanvas.fillText(line, x, cy);
}

function C000_Intro_CreatePlayer_Run() {
	// Dark academy bg
	var g = MainCanvas.createLinearGradient(0, 0, UI_W, UI_H);
	g.addColorStop(0, "#1a1228");
	g.addColorStop(0.5, "#241832");
	g.addColorStop(1, "#120c1c");
	MainCanvas.fillStyle = g;
	MainCanvas.fillRect(0, 0, UI_W, UI_H);
	DrawRect(0, 0, UI_W, 8, "rgba(200,80,120,0.35)");

	// Large character on the right
	PlayerTransitionFrame = 1;
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(1, {
			x: CP_PANEL_W, y: 8, w: UI_W - CP_PANEL_W, h: UI_H - 16, pad: 4
		});

	// Left panel (narrower)
	DrawRect(30, 60, CP_PANEL_W - 50, UI_H - 120, "rgba(255,255,255,0.08)");
	MainCanvas.strokeStyle = "rgba(255,200,220,0.25)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(30, 60, CP_PANEL_W - 50, UI_H - 120);
	DrawRect(70, 200, 140, 3, "#c05078");

	var t1 = GetText("EnterName");
	var t2 = GetText("ValidChars");
	if (!t1 || t1.indexOf("MISSING") == 0) t1 = "Enter a name and select a starting skill.";
	if (!t2 || t2.indexOf("MISSING") == 0) t2 = "Letters, spaces, or Chinese (max 20).";

	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.font = "36px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "创建角色" : "Create your character", 70, 140);
	MainCanvas.font = "24px Arial";
	MainCanvas.fillStyle = "#e8d0dc";
	C000_Intro_CreatePlayer_DrawWrapped(t1, 70, 250, CP_PANEL_W - 120, 34);
	MainCanvas.font = "22px Arial";
	MainCanvas.fillStyle = "#a888a0";
	C000_Intro_CreatePlayer_DrawWrapped(t2, 70, 300, CP_PANEL_W - 120, 28);

	// Labels
	MainCanvas.font = "22px Arial";
	MainCanvas.fillStyle = "#c0a0b0";
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "名字" : "Name", 70, 325);
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "初始技能" : "Starting skill", 70, 465);

	if (!C000_Intro_CreatePlayer_ControlLoaded) {
		var InputName = document.createElement("input");
		InputName.id = "InputName";
		InputName.type = "text";
		InputName.maxLength = 20;
		InputName.placeholder = (CurrentLanguageTag == "CN") ? "名字" : "Name";
		C000_Intro_CreatePlayer_PlaceControl(InputName, CP_INPUT_X, CP_INPUT_Y, CP_INPUT_W, 52);
		InputName.addEventListener("keypress", KeyDown);
		document.body.appendChild(InputName);
		InputName.focus();

		var SelectSkill = document.createElement("select");
		SelectSkill.id = "SelectSkill";
		C000_Intro_CreatePlayer_PlaceControl(SelectSkill, CP_SELECT_X, CP_SELECT_Y, CP_SELECT_W, 52);
		var defaults = [
			"No skill", "Arts", "Fighting", "Rope Mastery", "Sports", "Seduction",
			"Medicine", "Stealth", "Observation", "Endurance", "Psychology", "Dance"
		];
		for (var S = 0; S < CP_SKILL_KEYS.length; S++) {
			var label = GetText("Skill" + S);
			if (!label || label.indexOf("MISSING") == 0) label = defaults[S];
			SelectSkill.appendChild(new Option(label, S.toString()));
		}
		document.body.appendChild(SelectSkill);
		C000_Intro_CreatePlayer_ControlLoaded = true;
		window.addEventListener("resize", C000_Intro_CreatePlayer_OnResize);
	}

	var hover = (MouseX >= CP_BTN_X && MouseX <= CP_BTN_X + CP_BTN_W &&
		MouseY >= CP_BTN_Y && MouseY <= CP_BTN_Y + CP_BTN_H);
	DrawRect(CP_BTN_X, CP_BTN_Y, CP_BTN_W, CP_BTN_H, hover ? "#c05078" : "#8c304e");
	MainCanvas.strokeStyle = "rgba(255,200,220,0.5)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(CP_BTN_X, CP_BTN_Y, CP_BTN_W, CP_BTN_H);
	MainCanvas.font = "30px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.textAlign = "center";
	var vlabel = GetText("Validate");
	if (!vlabel || vlabel.indexOf("MISSING") == 0) vlabel = "Start the game";
	MainCanvas.fillText(vlabel, CP_BTN_X + CP_BTN_W / 2, CP_BTN_Y + CP_BTN_H / 2);
}

function C000_Intro_CreatePlayer_Validate() {
	var input = document.getElementById("InputName");
	var select = document.getElementById("SelectSkill");
	if (!input || !select) return;
	var NewName = input.value.trim();
	var StartingSkill = parseInt(select.value, 10) || 0;
	if (!/^[a-zA-Z\u4e00-\u9fff ]+$/.test(NewName) || NewName.length < 1 || NewName.length > 20) return;

	var skillKey = CP_SKILL_KEYS[StartingSkill] || "";
	if (skillKey && typeof PlayerAddSkill === "function") PlayerAddSkill(skillKey, 1);
	if (typeof PlayerSkillShowLevelUp !== "undefined") PlayerSkillShowLevelUp = 0;
	Common_PlayerName = NewName;

	C000_Intro_CreatePlayer_ClearControls();
	window.removeEventListener("resize", C000_Intro_CreatePlayer_OnResize);

	if (typeof CurrentDay !== "undefined") CurrentDay = 1;
	if (typeof CurrentMinute !== "undefined") CurrentMinute = 8 * 60;
	if (typeof SetTime === "function") SetTime(8, 0);

	var targetChapter = C000_Intro_CreatePlayer_ChapterToLoad;
	var targetScreen = C000_Intro_CreatePlayer_ScreenToLoad;
	if (typeof window[targetChapter + "_" + targetScreen + "_Load"] !== "function") {
		alert((CurrentLanguageTag == "CN")
			? "角色已创建。\nDay 01 尚未制作，先返回主菜单。"
			: "Character created.\nDay 01 is not built yet — returning to menu.");
		SetScene("C000_Intro", "ChapterSelect");
		return;
	}
	SetScene(targetChapter, targetScreen);
}

function C000_Intro_CreatePlayer_KeyDown() {
	if (KeyPress == 13) C000_Intro_CreatePlayer_Validate();
}

function C000_Intro_CreatePlayer_Click() {
	if (MouseX >= CP_BTN_X && MouseX <= CP_BTN_X + CP_BTN_W &&
		MouseY >= CP_BTN_Y && MouseY <= CP_BTN_Y + CP_BTN_H)
		C000_Intro_CreatePlayer_Validate();
}
