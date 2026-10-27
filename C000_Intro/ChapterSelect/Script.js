// C000_Intro / ChapterSelect — main menu (styled)
var C000_Intro_ChapterSelect_CurrentStage = 0; // 0 main, 30 language
var C000_Intro_ChapterSelect_CreditMode = false;

var CS_BTN_X = 80;
var CS_BTN_W = 440;
var CS_BTN_H = 78;
var CS_BTN_TOP = 380;
var CS_BTN_GAP = 18;

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

function C000_Intro_ChapterSelect_DrawBg() {
	// Deep academy gradient
	var g = MainCanvas.createLinearGradient(0, 0, UI_W, UI_H);
	g.addColorStop(0, "#1a1228");
	g.addColorStop(0.45, "#2a1a3a");
	g.addColorStop(1, "#120c1c");
	MainCanvas.fillStyle = g;
	MainCanvas.fillRect(0, 0, UI_W, UI_H);
	// Soft vignette bars
	DrawRect(0, 0, UI_W, 8, "rgba(200,80,120,0.35)");
	DrawRect(0, UI_H - 8, UI_W, 8, "rgba(200,80,120,0.25)");
}

function C000_Intro_ChapterSelect_Run() {
	C000_Intro_ChapterSelect_DrawBg();

	if (typeof AdvancePlayerTransitionAuto === "function")
		AdvancePlayerTransitionAuto();
	// Large character (right side)
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(PlayerTransitionFrame, {
			x: 600, y: 10, w: 1300, h: 1260, pad: 4
		});

	if (C000_Intro_ChapterSelect_CreditMode) {
		DrawRect(200, 160, 1520, 900, "rgba(20,12,28,0.92)");
		MainCanvas.strokeStyle = "rgba(200,100,140,0.5)";
		MainCanvas.lineWidth = 2;
		MainCanvas.strokeRect(200, 160, 1520, 900);
		MainCanvas.font = "44px Arial";
		MainCanvas.fillStyle = "#f0d0e0";
		MainCanvas.textAlign = "center";
		MainCanvas.textBaseline = "middle";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "制作人员" : "Credits", UI_W / 2, 280);
		MainCanvas.font = UI_FONT;
		MainCanvas.fillStyle = "#ffffff";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "束缚学院" : "Bondage Academy", UI_W / 2, 420);
		MainCanvas.font = UI_FONT_SM;
		MainCanvas.fillStyle = "#c8a0b8";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "三十天 · 每一种关系都有可能" : "Thirty days. Every bond is possible.", UI_W / 2, 500);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "原作：Ben987 与贡献者" : "Original game by Ben987 and contributors", UI_W / 2, 580);
		MainCanvas.fillStyle = "rgba(255,255,255,0.55)";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "点击返回" : "Click to return", UI_W / 2, 920);
		return;
	}

	// Left glass panel (narrower so character can be larger)
	DrawRect(40, 80, 520, UI_H - 160, "rgba(255,255,255,0.08)");
	MainCanvas.strokeStyle = "rgba(255,200,220,0.25)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(40, 80, 520, UI_H - 160);
	DrawRect(80, 250, 160, 3, "#c05078");

	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.font = "52px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "束缚学院" : "Bondage Academy", 80, 170);
	MainCanvas.font = "24px Arial";
	MainCanvas.fillStyle = "#d0a8c0";
	MainCanvas.fillText(
		(CurrentLanguageTag == "CN") ? "三十天 · 每一种关系都有可能" : "Thirty days · Every bond is possible",
		80, 230
	);

	var buttons = C000_Intro_ChapterSelect_GetButtons();
	for (var i = 0; i < buttons.length; i++) {
		var y = CS_BTN_TOP + i * (CS_BTN_H + CS_BTN_GAP);
		var hover = (MouseX >= CS_BTN_X && MouseX <= CS_BTN_X + CS_BTN_W &&
			MouseY >= y && MouseY <= y + CS_BTN_H);
		if (hover) {
			DrawRect(CS_BTN_X, y, CS_BTN_W, CS_BTN_H, "#a03d5c");
			MainCanvas.strokeStyle = "rgba(255,200,220,0.7)";
		} else {
			DrawRect(CS_BTN_X, y, CS_BTN_W, CS_BTN_H, "rgba(255,255,255,0.12)");
			MainCanvas.strokeStyle = "rgba(255,255,255,0.22)";
		}
		MainCanvas.lineWidth = 2;
		MainCanvas.strokeRect(CS_BTN_X, y, CS_BTN_W, CS_BTN_H);
		MainCanvas.font = "32px Arial";
		MainCanvas.fillStyle = "#ffffff";
		MainCanvas.textAlign = "center";
		MainCanvas.fillText(buttons[i].label, CS_BTN_X + CS_BTN_W / 2, y + CS_BTN_H / 2);
	}

	// Footer hint
	MainCanvas.font = "22px Arial";
	MainCanvas.fillStyle = "rgba(255,255,255,0.35)";
	MainCanvas.textAlign = "left";
	MainCanvas.fillText("v Remake · 30 Days", 100, UI_H - 120);
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
function LoadChapter(ChapterName) { SetScene("C000_Intro", "Intro"); }
function SetLanguage(Lang) { C000_Intro_ChapterSelect_SetLang(Lang); }
function RollCredits() { C000_Intro_ChapterSelect_CreditMode = true; }
