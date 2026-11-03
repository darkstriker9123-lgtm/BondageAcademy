// C001_Day01 — Intro (gate / transfer morning)

function C001_Day01_Intro_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
	if (typeof LoadText === "function") LoadText();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
}

function C001_Day01_Intro_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	var keys = ["Line1", "Line2", "Line3", "Line4", "Line5", "Line6"];
	if (typeof DrawStoryPanel === "function")
		DrawStoryPanel(keys, TextPhase, { x: 48, y: UI_TOP_H + 20, w: 880, h: 900 });
	else {
		DrawRect(48, UI_TOP_H + 20, 880, 900, "rgba(18,10,24,0.62)");
		for (var i = 0; i < keys.length; i++) {
			if (TextPhase < i) break;
			var t = GetText(keys[i]);
			if (t && String(t).indexOf("MISSING") != 0)
				DrawTextLeft(t, 84, UI_TOP_H + 80 + i * 100, "White");
		}
	}
}

function C001_Day01_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 6)
		SetScene(CurrentChapter, "Intake");
}
