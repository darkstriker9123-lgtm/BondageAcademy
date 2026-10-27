// C000_Intro / Intro — pre-day story intro (not part of Day 01–30)
// Title: Bondage Academy
// PlayerTransition auto-cycles Player01–08 while text pages advance on click

var C000_Intro_Intro_Page = 0;

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
	C000_Intro_Intro_Page = 0;
	PlayerTransitionFrame = 1;
	if (typeof PlayerTransitionAutoTimer !== "undefined") PlayerTransitionAutoTimer = 0;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_Intro_Run() {
	try {
		var bg = DrawGetImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg");
		if (bg && bg.complete && bg.naturalWidth > 0)
			MainCanvas.drawImage(bg, 0, 0, bg.naturalWidth, bg.naturalHeight, 0, 0, UI_W, UI_H);
		else
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	} catch (e) {
		DrawRect(0, 0, UI_W, UI_H, "#1a1a24");
	}

	// Auto-cycle through all 8 player outfits
	if (typeof AdvancePlayerTransitionAuto === "function")
		AdvancePlayerTransitionAuto();

	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(PlayerTransitionFrame, {
			x: 0, y: 0, w: UI_W, h: UI_BOTTOM_Y, pad: 40
		});

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

	MainCanvas.font = UI_FONT_SM;
	MainCanvas.fillStyle = "rgba(255,255,255,0.7)";
	MainCanvas.textAlign = "right";
	var hint = (CurrentLanguageTag == "CN") ? "点击继续" : "Click to continue";
	MainCanvas.fillText(hint + "  (" + (C000_Intro_Intro_Page + 1) + "/" + pages.length + ")", UI_W - 80, UI_H - 30);
}

function C000_Intro_Intro_Click() {
	var pages = C000_Intro_Intro_GetPages();
	C000_Intro_Intro_Page++;
	if (C000_Intro_Intro_Page >= pages.length)
		SetScene(CurrentChapter, "CreatePlayer");
}

function C000_Intro_Intro_KeyDown() {
	if (KeyPress == 13 || KeyPress == 32) C000_Intro_Intro_Click();
}
