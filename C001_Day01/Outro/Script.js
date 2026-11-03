// C001_Day01 — Outro → Day 02

function C001_Day01_Outro_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	CurrentActor = "";
	if (typeof StopTimer === "function") StopTimer(21 * 60 * 60 * 1000);
	if (typeof LoadText === "function") LoadText();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	if (typeof GameLogAdd === "function")
		GameLogAdd("CompletedDay01");
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "", "CompletedDay01");
}

function C001_Day01_Outro_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	var keys = ["Line1", "Line2", "Line3", "Line4", "Line5", "Line6", "Line7"];
	if (typeof DrawStoryPanel === "function") {
		DrawStoryPanel(keys, TextPhase, { x: 48, y: UI_TOP_H + 20, w: 880, h: 900 });
	} else {
		DrawRect(48, UI_TOP_H + 20, 880, 900, "rgba(18,10,24,0.62)");
		for (var i = 0; i < keys.length; i++) {
			if (TextPhase < i) break;
			var t = (typeof GetText === "function") ? GetText(keys[i]) : "";
			if (t && String(t).indexOf("MISSING") != 0)
				DrawTextLeft(t, 84, UI_TOP_H + 80 + i * 95, "White");
		}
	}
}

function C001_Day01_Outro_Click() {
	TextPhase++;
	if (TextPhase >= 7) {
		if (typeof window["C002_Day02_Intro_Load"] === "function")
			SetScene("C002_Day02", "Intro");
		else
			SetScene("C000_Intro", "ChapterSelect");
	}
}
