// C000_Intro / ChapterSelect — New Game / Language / Credits
// Hardcoded menu (no CSV required for clicks)

var C000_Intro_ChapterSelect_CurrentStage = 0; // 0 = main, 30 = language
var C000_Intro_ChapterSelect_CreditMode = false;

// Button layout (logical 1920×1280 coords)
var CS_BTN_X = 80;
var CS_BTN_W = 780;
var CS_BTN_H = 90;
var CS_BTN_TOP = 300;
var CS_BTN_GAP = 16;

function C000_Intro_ChapterSelect_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	C000_Intro_ChapterSelect_CreditMode = false;
	C000_Intro_ChapterSelect_CurrentStage = 0;
	PlayerTransitionFrame = 1;
	if (typeof PlayerTransitionAutoTimer !== "undefined") PlayerTransitionAutoTimer = 0;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_ChapterSelect_GetButtons() {
	var cn = (CurrentLanguageTag == "CN");
	if (C000_Intro_ChapterSelect_CurrentStage == 30) {
		return [
			{ label: "English", action: function () { C000_Intro_ChapterSelect_SetLang("EN"); } },
			{ label: "中文", action: function () { C000_Intro_ChapterSelect_SetLang("CN"); } },
			{ label: cn ? "返回" : "Back", action: function () { C000_Intro_ChapterSelect_CurrentStage = 0; } }
		];
	}
	return [
		{ label: cn ? "新游戏" : "New Game", action: function () { SetScene("C000_Intro", "Intro"); } },
		{ label: cn ? "语言" : "Language", action: function () { C000_Intro_ChapterSelect_CurrentStage = 30; } },
		{ label: cn ? "制作人员" : "Credits", action: function () { C000_Intro_ChapterSelect_CreditMode = true; } }
	];
}

function C000_Intro_ChapterSelect_SetLang(Lang) {
	CurrentLanguageTag = Lang;
	try { localStorage.setItem("CurrentLanguageTag", Lang); } catch (e) {}
	C000_Intro_ChapterSelect_CurrentStage = 0;
}

function C000_Intro_ChapterSelect_Run() {
	DrawRect(0, 0, UI_W, UI_H, "#f0f0f4");

	if (typeof AdvancePlayerTransitionAuto === "function")
		AdvancePlayerTransitionAuto();
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(PlayerTransitionFrame, {
			x: Math.floor(UI_W * 0.48), y: 60, w: Math.floor(UI_W * 0.52), h: UI_H - 120, pad: 20
		});

	if (C000_Intro_ChapterSelect_CreditMode) {
		DrawRect(0, 0, UI_W, UI_H, "#111");
		MainCanvas.font = UI_FONT;
		MainCanvas.fillStyle = "white";
		MainCanvas.textAlign = "center";
		MainCanvas.textBaseline = "middle";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "制作人员" : "Credits", UI_W / 2, 160);
		MainCanvas.font = UI_FONT_SM;
		MainCanvas.fillText("Bondage Academy", UI_W / 2, 260);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "束缚学院" : "Thirty days. Every bond is possible.", UI_W / 2, 320);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "原作：Ben987 与贡献者" : "Original game by Ben987 and contributors", UI_W / 2, 400);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "点击返回" : "Click to return", UI_W / 2, UI_H - 100);
		return;
	}

	// Left panel
	DrawRect(40, 80, 880, UI_H - 160, "rgba(255,255,255,0.92)");

	MainCanvas.font = "48px Arial";
	MainCanvas.fillStyle = "#222";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillText("Bondage Academy", 80, 160);
	MainCanvas.font = UI_FONT_SM;
	MainCanvas.fillStyle = "#555";
	MainCanvas.fillText(
		(CurrentLanguageTag == "CN") ? "三十天。每一种关系都有可能。" : "Thirty days. Every bond is possible.",
		80, 220
	);

	var buttons = C000_Intro_ChapterSelect_GetButtons();
	for (var i = 0; i < buttons.length; i++) {
		var y = CS_BTN_TOP + i * (CS_BTN_H + CS_BTN_GAP);
		var hover = (MouseX >= CS_BTN_X && MouseX <= CS_BTN_X + CS_BTN_W &&
			MouseY >= y && MouseY <= y + CS_BTN_H);
		DrawRect(CS_BTN_X, y, CS_BTN_W, CS_BTN_H, hover ? "#8c304e" : "#333");
		MainCanvas.font = UI_FONT;
		MainCanvas.fillStyle = "white";
		MainCanvas.textAlign = "center";
		MainCanvas.textBaseline = "middle";
		MainCanvas.fillText(buttons[i].label, CS_BTN_X + CS_BTN_W / 2, y + CS_BTN_H / 2);
	}
}

function C000_Intro_ChapterSelect_Click() {
	if (C000_Intro_ChapterSelect_CreditMode) {
		C000_Intro_ChapterSelect_CreditMode = false;
		return;
	}

	var buttons = C000_Intro_ChapterSelect_GetButtons();
	for (var i = 0; i < buttons.length; i++) {
		var y = CS_BTN_TOP + i * (CS_BTN_H + CS_BTN_GAP);
		if (MouseX >= CS_BTN_X && MouseX <= CS_BTN_X + CS_BTN_W &&
			MouseY >= y && MouseY <= y + CS_BTN_H) {
			buttons[i].action();
			return;
		}
	}
}

function C000_Intro_ChapterSelect_KeyDown() {}

// Keep these global names for any old CSV references
function LoadChapter(ChapterName) {
	SetScene("C000_Intro", "Intro");
}
function SetLanguage(Lang) {
	C000_Intro_ChapterSelect_SetLang(Lang);
}
function RollCredits() {
	C000_Intro_ChapterSelect_CreditMode = true;
}
