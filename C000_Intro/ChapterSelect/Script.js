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
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_ChapterSelect_Run() {
	DrawRect(0, 0, UI_W, UI_H, "#f0f0f4");
	if (typeof AdvancePlayerTransitionAuto === "function")
		AdvancePlayerTransitionAuto();
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(PlayerTransitionFrame, {
			x: Math.floor(UI_W * 0.45), y: 80, w: Math.floor(UI_W * 0.55), h: UI_H - 160, pad: 20
		});

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

	DrawInteraction(CurrentStageText, C000_Intro_ChapterSelect_CurrentStage, 0, 0);
	if (typeof BuildBottomBar === "function") BuildBottomBar();
}

function C000_Intro_ChapterSelect_Click() {
	if (C000_Intro_ChapterSelect_CreditMode) {
		C000_Intro_ChapterSelect_CreditMode = false;
		return;
	}
	ClickInteraction(C000_Intro_ChapterSelect_CurrentStage);
}

function C000_Intro_ChapterSelect_KeyDown() {}

function LoadChapter(ChapterName) {
	// New Game always starts at story Intro (not a calendar day)
	if (ChapterName == "C001_Day01" || ChapterName == "NewGame") {
		SetScene("C000_Intro", "Intro");
		return;
	}
	SetScene(ChapterName, "Intro");
}

function SetLanguage(Lang) {
	CurrentLanguageTag = Lang;
	LoadInteractions();
}

function RollCredits() {
	C000_Intro_ChapterSelect_CreditMode = true;
}
