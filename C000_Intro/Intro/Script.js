// C000_Intro / Intro — pre-day story intro (not part of Day 01–30)
// Title: Bondage Academy

var C000_Intro_Intro_Frame = 1;
var C000_Intro_Intro_Page = 0;

// Fallback English pages (Text_*.csv overrides when available)
var C000_Intro_Intro_Pages_EN = [
	[
		"You transfer to a strict private college.",
		"The rules are heavy. The air feels tense.",
		"Everyone watches everyone else."
	],
	[
		"Students, teachers, clubs, and people outside campus…",
		"Any of them could become close to you.",
		"Love. Control. Or being controlled."
	],
	[
		"Thirty days. Your choices shape every bond.",
		"Girlfriend. Owner. Or owned — any day, any person.",
		"Be curious. Be careful. Be honest about what you want."
	]
];

var C000_Intro_Intro_Pages_CN = [
	[
		"你转学进入一所严格的私立学院。",
		"规矩很重，空气也很紧张。",
		"每个人都在看着彼此。"
	],
	[
		"学生、老师、社团，还有校外的人……",
		"任何人都可能与你产生关系。",
		"恋爱、支配，或者被支配。"
	],
	[
		"三十天。你的选择决定每一种羁绊。",
		"成为女友、拥有对方，或被对方拥有——任何一天、任何人。",
		"保持好奇，保持谨慎，诚实面对自己想要什么。"
	]
];

function C000_Intro_Intro_GetPages() {
	if (CurrentLanguageTag == "CN") return C000_Intro_Intro_Pages_CN;
	return C000_Intro_Intro_Pages_EN;
}

function C000_Intro_Intro_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	C000_Intro_Intro_Frame = 1;
	C000_Intro_Intro_Page = 0;
	PlayerTransitionFrame = 1;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_Intro_Run() {
	// Background
	try {
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	} catch (e) {
		DrawRect(0, 0, UI_W, UI_H, "#1a1a24");
	}

	// Player transition frame (Player01–08)
	PlayerTransitionFrame = C000_Intro_Intro_Frame;
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(C000_Intro_Intro_Frame);

	// Bottom dialogue panel
	DrawRect(40, UI_BOTTOM_Y - 20, UI_W - 80, UI_BOTTOM_H + 10, "rgba(0,0,0,0.55)");

	var pages = C000_Intro_Intro_GetPages();
	var lines = pages[C000_Intro_Intro_Page] || pages[0];
	MainCanvas.font = UI_FONT;
	MainCanvas.fillStyle = "white";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	var baseY = UI_BOTTOM_Y + 40;
	for (var i = 0; i < lines.length; i++)
		MainCanvas.fillText(lines[i], 80, baseY + i * 48);

	// Continue hint
	MainCanvas.font = UI_FONT_SM;
	MainCanvas.fillStyle = "rgba(255,255,255,0.7)";
	MainCanvas.textAlign = "right";
	var hint = (CurrentLanguageTag == "CN") ? "点击继续" : "Click to continue";
	MainCanvas.fillText(hint + "  (" + (C000_Intro_Intro_Page + 1) + "/" + pages.length + ")", UI_W - 80, UI_H - 30);
}

function C000_Intro_Intro_Click() {
	var pages = C000_Intro_Intro_GetPages();
	C000_Intro_Intro_Page++;
	C000_Intro_Intro_Frame = Math.min(8, C000_Intro_Intro_Frame + 1);
	PlayerTransitionFrame = C000_Intro_Intro_Frame;
	if (C000_Intro_Intro_Page >= pages.length)
		SetScene(CurrentChapter, "CreatePlayer");
}

function C000_Intro_Intro_KeyDown() {
	if (KeyPress == 13 || KeyPress == 32) C000_Intro_Intro_Click();
}
