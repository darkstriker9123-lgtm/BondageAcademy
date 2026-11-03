// C001_Day01 — Outro → Day 02

function C001_Day01_Outro_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	if (typeof StopTimer === "function") StopTimer(21 * 60 * 60 * 1000);
	if (typeof LoadText === "function") LoadText();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	if (typeof GameLogAdd === "function")
		GameLogAdd("CompletedDay01");
}

function C001_Day01_Outro_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawRect(40, 40, 900, 780, "rgba(18,10,24,0.55)");
	var lines = ["Line1", "Line2", "Line3", "Line4", "Line5", "Line6", "Line7"];
	for (var i = 0; i < lines.length; i++) {
		if (TextPhase >= i) {
			var t = (typeof GetText === "function") ? GetText(lines[i]) : "";
			if (!t || String(t).indexOf("MISSING") == 0) t = "";
			if (t) DrawText(t, 490, 90 + i * 85, "White");
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
