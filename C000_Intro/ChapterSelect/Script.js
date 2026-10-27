// C000_Intro / ChapterSelect — New Game / Language / Credits
// Title: Bondage Academy  |  Languages: EN + CN only

var C000_Intro_ChapterSelect_CurrentStage = 0;
var C000_Intro_ChapterSelect_CreditMode = false;

function C000_Intro_ChapterSelect_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	C000_Intro_ChapterSelect_CreditMode = false;
	C000_Intro_ChapterSelect_CurrentStage = 0;
	LoadInteractions();
	PlayerTransitionFrame = 1;
	if (typeof PlayerTransitionAutoTimer !== "undefined") PlayerTransitionAutoTimer = 0;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_ChapterSelect_Run() {
	// Background
	DrawRect(0, 0, UI_W, UI_H, "#f0f0f4");

	// Character on the right (auto-cycle outfits)
	if (typeof AdvancePlayerTransitionAuto === "function")
		AdvancePlayerTransitionAuto();
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(PlayerTransitionFrame, {
			x: Math.floor(UI_W * 0.48), y: 60, w: Math.floor(UI_W * 0.52), h: UI_H - 120, pad: 20
		});

	// Credits overlay
	if (C000_Intro_ChapterSelect_CreditMode) {
		DrawRect(0, 0, UI_W, UI_H, "#111");
		MainCanvas.font = UI_FONT;
		MainCanvas.fillStyle = "white";
		MainCanvas.textAlign = "center";
		MainCanvas.textBaseline = "middle";
		var creditsTitle = (CurrentLanguageTag == "CN") ? "制作人员" : "Credits";
		MainCanvas.fillText(creditsTitle, UI_W / 2, 160);
		MainCanvas.font = UI_FONT_SM;
		MainCanvas.fillText("Bondage Academy", UI_W / 2, 260);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "束缚学院" : "Thirty days. Every bond is possible.", UI_W / 2, 320);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "原作：Ben987 与贡献者" : "Original game by Ben987 and contributors", UI_W / 2, 400);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "点击返回" : "Click to return", UI_W / 2, UI_H - 100);
		return;
	}

	// Left panel for title + menu
	DrawRect(40, 80, 880, UI_H - 160, "rgba(255,255,255,0.92)");
	DrawRect(40, 80, 880, 2, "rgba(0,0,0,0.15)");

	// Title
	MainCanvas.font = "48px Arial";
	MainCanvas.fillStyle = "#222";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillText("Bondage Academy", 80, 160);
	MainCanvas.font = UI_FONT_SM;
	MainCanvas.fillStyle = "#555";
	var subtitle = (CurrentLanguageTag == "CN")
		? "三十天。每一种关系都有可能。"
		: "Thirty days. Every bond is possible.";
	MainCanvas.fillText(subtitle, 80, 220);

	// Wait until Stage CSV is loaded, then draw options on the LEFT
	if (CurrentStage == null) {
		MainCanvas.fillStyle = "#888";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "加载中…" : "Loading…", 80, 320);
		return;
	}

	// Draw menu options as solid buttons on the left (not transparent right-side options)
	var list = [];
	for (var S = 0; S < CurrentStage.length; S++)
		if (CurrentStage[S][StageNumber] == C000_Intro_ChapterSelect_CurrentStage)
			list.push(CurrentStage[S]);

	var btnX = 80;
	var btnW = 780;
	var btnH = 90;
	var btnTop = 300;
	var gap = 16;

	for (var i = 0; i < list.length; i++) {
		var y = btnTop + i * (btnH + gap);
		var hover = (MouseX >= btnX && MouseX <= btnX + btnW && MouseY >= y && MouseY <= y + btnH);
		DrawRect(btnX, y, btnW, btnH, hover ? "#8c304e" : "#333");
		MainCanvas.font = UI_FONT;
		MainCanvas.fillStyle = "white";
		MainCanvas.textAlign = "center";
		MainCanvas.textBaseline = "middle";
		MainCanvas.fillText(list[i][StageInteractionText], btnX + btnW / 2, y + btnH / 2);
	}
}

function C000_Intro_ChapterSelect_Click() {
	if (C000_Intro_ChapterSelect_CreditMode) {
		C000_Intro_ChapterSelect_CreditMode = false;
		return;
	}
	if (CurrentStage == null) return;

	var list = [];
	for (var S = 0; S < CurrentStage.length; S++)
		if (CurrentStage[S][StageNumber] == C000_Intro_ChapterSelect_CurrentStage)
			list.push(CurrentStage[S]);

	var btnX = 80;
	var btnW = 780;
	var btnH = 90;
	var btnTop = 300;
	var gap = 16;

	for (var i = 0; i < list.length; i++) {
		var y = btnTop + i * (btnH + gap);
		if (MouseX >= btnX && MouseX <= btnX + btnW && MouseY >= y && MouseY <= y + btnH) {
			var row = list[i];
			// Next stage
			var next = parseInt(row[StageNextStage], 10);
			if (!isNaN(next) && row[StageNextStage] !== "" && row[StageNextStage] != null) {
				// Our CSV: columns are Stage,Love,Sub,Var,Text,NextStage,LoveMod,SubMod,Script
				// Mapped with missing Result column — handle both layouts
			}
			// Detect column layout from CSV (no Result column)
			// indices: 0 Stage, 1 Love, 2 Sub, 3 Var, 4 Text, 5 Next, 6 LoveMod, 7 SubMod, 8 Script
			var nextStage = row[5];
			var script = row[8] != null ? row[8] : row[StageFunction];

			if (nextStage !== "" && nextStage != null && !isNaN(parseInt(nextStage, 10))) {
				var ns = parseInt(nextStage, 10);
				if (ns != C000_Intro_ChapterSelect_CurrentStage)
					C000_Intro_ChapterSelect_CurrentStage = ns;
			}
			if (script && String(script).trim() != "") {
				try {
					var Fct = new Function(script);
					Fct();
				} catch (e) {
					console.log("Menu script error:", script, e);
				}
			}
			return;
		}
	}
}

function C000_Intro_ChapterSelect_KeyDown() {}

function LoadChapter(ChapterName) {
	if (ChapterName == "C001_Day01" || ChapterName == "NewGame") {
		SetScene("C000_Intro", "Intro");
		return;
	}
	SetScene(ChapterName, "Intro");
}

function SetLanguage(Lang) {
	CurrentLanguageTag = Lang;
	if (window.localStorage) localStorage.setItem("CurrentLanguageTag", Lang);
	C000_Intro_ChapterSelect_CurrentStage = 0;
	LoadInteractions();
}

function RollCredits() {
	C000_Intro_ChapterSelect_CreditMode = true;
}
